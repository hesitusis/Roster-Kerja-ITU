import { NextResponse } from 'next/server';
import { Employee, RosterData, ShiftCode } from '@/lib/types';
import { INITIAL_EMPLOYEES } from '@/lib/mock-data';
import { BUNDLED_MONTHLY_ROSTERS } from '@/lib/bundled-rosters';

const SPREADSHEET_ROSTER_URL =
  'https://docs.google.com/spreadsheets/d/1wb2_93gm4DmLGcA4fZyWrK77zylG26iA4mp9xnt2Kx4/export?format=csv&gid=318146429';

const SPREADSHEET_MASTER_URL =
  'https://docs.google.com/spreadsheets/d/1wb2_93gm4DmLGcA4fZyWrK77zylG26iA4mp9xnt2Kx4/export?format=csv&gid=0';

// Helper to parse CSV with quote awareness
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map((s) => s.trim().replace(/^"|"$/g, '').trim());
}

export async function GET() {
  try {
    // Fetch both sheets in parallel: Master_Karyawan (roles & metadata) and Roster_Bulanan (shifts)
    const [rosterRes, masterRes] = await Promise.all([
      fetch(SPREADSHEET_ROSTER_URL, {
        cache: 'no-store',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      }),
      fetch(SPREADSHEET_MASTER_URL, {
        cache: 'no-store',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      }),
    ]);

    if (!rosterRes.ok) {
      throw new Error(`Google Sheets Roster responded with status ${rosterRes.status}`);
    }

    const rosterText = await rosterRes.text();
    const rosterLines = rosterText.split(/\r?\n/).filter((l) => l.trim().length > 0);

    if (rosterLines.length < 2) {
      throw new Error('CSV is empty or invalid format');
    }

    // Parse Master_Karyawan if available
    const masterRoleMap = new Map<string, string>();
    const masterKimperMap = new Map<string, string[]>();

    if (masterRes.ok) {
      try {
        const masterText = await masterRes.text();
        const masterLines = masterText.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (masterLines.length >= 2) {
          const masterHeaders = parseCsvLine(masterLines[0]).map((h) => h.toUpperCase());
          const nikIdx = masterHeaders.indexOf('NIK');
          const roleIdx = masterHeaders.indexOf('ROLE');
          const kimperIdx = masterHeaders.indexOf('KIMPER');

          for (let m = 1; m < masterLines.length; m++) {
            const mCols = parseCsvLine(masterLines[m]);
            const mNik = mCols[nikIdx >= 0 ? nikIdx : 0]?.trim();
            if (!mNik) continue;

            const mRole = roleIdx >= 0 ? mCols[roleIdx]?.trim() : '';
            if (mRole) {
              masterRoleMap.set(mNik, mRole);
            }

            const mKimper = kimperIdx >= 0 ? mCols[kimperIdx]?.trim() : '';
            if (mKimper) {
              const kList = mKimper.split(',').map((k) => k.trim().toUpperCase()).filter(Boolean);
              masterKimperMap.set(mNik, kList);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to parse Master_Karyawan tab, continuing with Roster sheet:', err);
      }
    }

    const headers = parseCsvLine(rosterLines[0]);
    // Date columns start at index 6 (e.g. 9/1/2026)
    const dateHeaders = headers.slice(6);

    const employees: Employee[] = [];
    const roster: RosterData = {};

    for (let i = 1; i < rosterLines.length; i++) {
      const cols = parseCsvLine(rosterLines[i]);
      const nik = cols[0]?.trim();
      const name = cols[1]?.trim();
      if (!nik || !name) continue;

      const jabatan = cols[2]?.trim() || '';
      const dept = cols[3]?.trim() || 'SERVICE';
      const por = cols[4]?.trim() || '';
      const kimperRaw = cols[5]?.trim() || '';
      const kimpers = masterKimperMap.get(nik) || (kimperRaw
        ? kimperRaw
            .split(',')
            .map((k) => k.trim().toUpperCase())
            .filter(Boolean)
        : []);

      const empId = `emp-${nik}`;
      
      // Determine Role: Priority is given to column E (ROLE) in Master_Karyawan
      let role = masterRoleMap.get(nik);
      if (!role) {
        if (jabatan === 'PROJECT HEAD' || jabatan === 'DEPUTY PROJECT HEAD') {
          role = 'admin_service,hse,HRGA FA, Part';
        } else if (jabatan.toUpperCase().includes('SUPERVISOR')) {
          if (dept === 'SERVICE') role = 'admin_service';
          else if (dept === 'HRGA FA') role = 'admin_hrga_fa';
          else if (dept === 'HSE') role = 'admin_hse';
          else if (dept === 'PART') role = 'admin_part';
          else role = 'admin';
        } else {
          role = 'staff';
        }
      }

      const emailName = name.toLowerCase().replace(/\s+/g, '.').replace(/'/g, '');

      const emp: Employee = {
        id: empId,
        nip: nik,
        name,
        department: dept,
        position: jabatan,
        por,
        kimper: kimpers,
        role,
        username: nik, // Allow login by NIK
        email: `${emailName}@company.com`,
        phone: `0812${1000 + i}00`,
        joinDate: '2024-01-01',
        isActive: true,
      };

      employees.push(emp);

      // Parse shifts
      const empShifts: Record<string, { shift: ShiftCode }> = {};

      for (let d = 0; d < dateHeaders.length; d++) {
        const rawDate = dateHeaders[d];
        if (!rawDate) continue;

        // Parse M/D/YYYY
        const dateParts = rawDate.split('/');
        if (dateParts.length < 3) continue;

        const m = parseInt(dateParts[0], 10);
        const day = parseInt(dateParts[1], 10);
        const y = parseInt(dateParts[2], 10);
        if (isNaN(m) || isNaN(day) || isNaN(y)) continue;

        const isoDate = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const rawShift = (cols[6 + d] || '').trim().toUpperCase();

        let shiftCode: ShiftCode = 'OFF';
        if (rawShift === 'D' || rawShift === 'N' || rawShift === 'OFF' || rawShift === 'CT' || rawShift === 'C' || rawShift === 'P') {
          shiftCode = rawShift as ShiftCode;
        } else if (rawShift === 'S1') {
          shiftCode = 'D';
        } else if (rawShift === 'S2') {
          shiftCode = 'N';
        } else if (rawShift) {
          shiftCode = rawShift as ShiftCode;
        }

        empShifts[isoDate] = { shift: shiftCode };
      }

      roster[empId] = empShifts;
    }

    return NextResponse.json({
      success: true,
      source: 'Google Spreadsheet: ROSTER KERJA',
      url: SPREADSHEET_ROSTER_URL,
      employeeCount: employees.length,
      employees,
      roster,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to sync from Google Spreadsheet, falling back to bundled data:', error);
    // Fallback to pre-bundled exact data across all available months
    const unifiedRoster: RosterData = {};
    INITIAL_EMPLOYEES.forEach((emp) => {
      unifiedRoster[emp.id] = {};
    });
    for (const monthlyRoster of Object.values(BUNDLED_MONTHLY_ROSTERS)) {
      for (const [empId, shifts] of Object.entries(monthlyRoster)) {
        if (!unifiedRoster[empId]) unifiedRoster[empId] = {};
        Object.assign(unifiedRoster[empId], shifts);
      }
    }
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error syncing spreadsheet',
      fallback: true,
      employees: INITIAL_EMPLOYEES,
      roster: unifiedRoster,
      syncedAt: new Date().toISOString(),
    });
  }
}
