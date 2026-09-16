import * as XLSX from 'xlsx';
import { Employee, RosterData, ShiftCode, ShiftEntry } from './types';
import { getDaysInMonth } from './roster-utils';
import { MONTH_NAMES_ID, SHIFTS } from './constants';

export interface ShiftDiff {
  dateStr: string;
  dayNumber: number;
  oldShift: string; // e.g. '-' or 'D'
  newShift: ShiftCode;
  isChanged: boolean;
}

export interface ParsedEmployeeRosterItem {
  key: string;
  isMatched: boolean;
  isNewEmployee: boolean;
  employee: Employee;
  originalNik: string;
  originalName: string;
  originalDept: string;
  originalPosition: string;
  shifts: Record<string, ShiftCode>;
  diffs: ShiftDiff[];
  totalShiftsFound: number;
  totalChanges: number;
  selected: boolean;
}

export interface ExcelRosterParseResult {
  success: boolean;
  message: string;
  sheetName: string;
  targetYear: number;
  targetMonthIndex: number;
  items: ParsedEmployeeRosterItem[];
  summary: {
    totalRowsFound: number;
    totalMatched: number;
    totalNew: number;
    totalWithChanges: number;
    totalUnchanged: number;
  };
}

/**
 * Normalizes user shift input from Excel cell to valid ShiftCode
 */
export function normalizeShiftCode(val: any): ShiftCode | null {
  if (val === undefined || val === null) return null;
  const s = String(val).trim().toUpperCase();
  if (!s || s === '-' || s === '.' || s === 'KOSONG') return null;

  if (s === 'S1' || s === 'SI' || s === 'D' || s === 'DAY' || s === 'PAGI' || s === 'SIANG') return 'D';
  if (s === 'S2' || s === 'N' || s === 'NIGHT' || s === 'MALAM') return 'N';
  if (s === 'OFF' || s === 'L' || s === 'LIBUR' || s === 'O') return 'OFF';
  if (s === 'CT' || s === 'C' || s === 'CUTI' || s === 'ANNUAL') return 'CT';
  if (s === 'P' || s === 'PERJALANAN' || s === 'TRIP') return 'P';

  // Fallback check against known codes
  if (s in SHIFTS) return s as ShiftCode;
  return null;
}

/**
 * Parse an Excel or CSV file buffer and match with existing employees and current roster
 */
export function parseRosterExcelBuffer(
  buffer: ArrayBuffer | Uint8Array,
  fallbackYear: number,
  fallbackMonthIndex: number,
  existingEmployees: Employee[],
  currentRoster: RosterData
): ExcelRosterParseResult {
  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return {
        success: false,
        message: 'File Excel tidak memiliki sheet yang dapat dibaca.',
        sheetName: '',
        targetYear: fallbackYear,
        targetMonthIndex: fallbackMonthIndex,
        items: [],
        summary: { totalRowsFound: 0, totalMatched: 0, totalNew: 0, totalWithChanges: 0, totalUnchanged: 0 },
      };
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    if (!rawRows || rawRows.length === 0) {
      return {
        success: false,
        message: 'Sheet Excel kosong tidak memiliki data.',
        sheetName,
        targetYear: fallbackYear,
        targetMonthIndex: fallbackMonthIndex,
        items: [],
        summary: { totalRowsFound: 0, totalMatched: 0, totalNew: 0, totalWithChanges: 0, totalUnchanged: 0 },
      };
    }

    // Attempt to detect target year and month from title rows (e.g. "Oktober 2026" or "10/2026")
    let detectedYear = fallbackYear;
    let detectedMonthIndex = fallbackMonthIndex;

    for (let r = 0; r < Math.min(rawRows.length, 10); r++) {
      const rowText = rawRows[r].join(' ').toLowerCase();
      MONTH_NAMES_ID.forEach((mName, idx) => {
        if (rowText.includes(mName.toLowerCase())) {
          detectedMonthIndex = idx;
        }
      });
      const yearMatch = rowText.match(/20[2-3][0-9]/);
      if (yearMatch) {
        const y = parseInt(yearMatch[0], 10);
        if (y >= 2020 && y <= 2040) {
          detectedYear = y;
        }
      }
    }

    // Step 1: Find the Header Row
    let headerRowIdx = -1;
    let nikCol = -1;
    let nameCol = -1;
    let positionCol = -1;
    let deptCol = -1;
    let porCol = -1;
    let kimperCol = -1;

    for (let r = 0; r < Math.min(rawRows.length, 15); r++) {
      const row = rawRows[r].map((cell) => String(cell).trim().toUpperCase());
      const hasNik = row.some((c) => c === 'NIK' || c === 'NIP' || c === 'NO. INDUK' || c.includes('NIK'));
      const hasName = row.some((c) => c === 'NAMA' || c === 'NAMA KARYAWAN' || c.includes('NAMA') || c.includes('NAME'));

      if (hasNik || hasName) {
        headerRowIdx = r;
        row.forEach((c, idx) => {
          if (nikCol === -1 && (c === 'NIK' || c === 'NIP' || c === 'NO. INDUK' || c.includes('NIK'))) nikCol = idx;
          if (nameCol === -1 && (c === 'NAMA' || c === 'NAMA KARYAWAN' || c.includes('NAMA') || c.includes('NAME'))) nameCol = idx;
          if (positionCol === -1 && (c === 'JABATAN' || c === 'POSISI' || c.includes('JABATAN') || c.includes('POSITION'))) positionCol = idx;
          if (deptCol === -1 && (c === 'DEPARTEMEN' || c === 'DEPT' || c.includes('DEPARTEMEN') || c.includes('DEPARTMENT'))) deptCol = idx;
          if (porCol === -1 && (c === 'POR' || c.includes('ORIGIN') || c.includes('ASAL') || c === 'POINT OF ORIGIN')) porCol = idx;
          if (kimperCol === -1 && (c === 'KIMPER' || c.includes('KIMPER') || c.includes('IZIN'))) kimperCol = idx;
        });
        break;
      }
    }

    if (headerRowIdx === -1 || (nikCol === -1 && nameCol === -1)) {
      return {
        success: false,
        message: 'Gagal mendeteksi baris judul (Header). Pastikan terdapat kolom "NIK" atau "NAMA".',
        sheetName,
        targetYear: detectedYear,
        targetMonthIndex: detectedMonthIndex,
        items: [],
        summary: { totalRowsFound: 0, totalMatched: 0, totalNew: 0, totalWithChanges: 0, totalUnchanged: 0 },
      };
    }

    const headerRow = rawRows[headerRowIdx];
    const daysInMonth = getDaysInMonth(detectedYear, detectedMonthIndex);
    const numDays = daysInMonth.length;

    // Step 2: Identify Date/Day Columns
    interface DayColMap {
      colIdx: number;
      dayNumber: number;
      dateStr: string;
    }
    const dayColMapList: DayColMap[] = [];

    headerRow.forEach((cellVal, colIdx) => {
      // Skip identified profile columns
      if ([nikCol, nameCol, positionCol, deptCol, porCol, kimperCol].includes(colIdx)) return;

      const rawStr = String(cellVal).trim();
      if (!rawStr) return;

      // Ignore summary columns like D, N, OFF, CT, P, Total, Total Shift, No
      const upper = rawStr.toUpperCase();
      if (['NO', 'NO.', 'D', 'N', 'OFF', 'CT', 'P', 'TOTAL', 'TOTAL SHIFT', 'TOTAL SHIFT (D+N)'].includes(upper)) {
        return;
      }

      // Check if it's formatted as Date "YYYY-MM-DD" or "M/D/YYYY" or "D/M/YYYY"
      if (rawStr.includes('/') || rawStr.includes('-')) {
        const partsSlash = rawStr.split('/');
        const partsDash = rawStr.split('-');

        if (partsSlash.length === 3) {
          const m = parseInt(partsSlash[0], 10);
          const d = parseInt(partsSlash[1], 10);
          const y = parseInt(partsSlash[2], 10);
          if (y === detectedYear && m === detectedMonthIndex + 1 && d >= 1 && d <= numDays) {
            const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            dayColMapList.push({ colIdx, dayNumber: d, dateStr });
            return;
          }
        }

        if (partsDash.length === 3) {
          const y = parseInt(partsDash[0], 10);
          const m = parseInt(partsDash[1], 10);
          const d = parseInt(partsDash[2], 10);
          if (y === detectedYear && m === detectedMonthIndex + 1 && d >= 1 && d <= numDays) {
            const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            dayColMapList.push({ colIdx, dayNumber: d, dateStr });
            return;
          }
        }
      }

      // Check if it's a day number e.g. "1", "01", "1 (Rab)", "15 (Kam)", "31"
      const dayNumMatch = rawStr.match(/^(\d{1,2})/);
      if (dayNumMatch) {
        const dayNum = parseInt(dayNumMatch[1], 10);
        if (dayNum >= 1 && dayNum <= numDays) {
          const dateStr = `${detectedYear}-${String(detectedMonthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          dayColMapList.push({ colIdx, dayNumber: dayNum, dateStr });
        }
      }
    });

    // Step 3: Parse each Employee row
    const items: ParsedEmployeeRosterItem[] = [];
    let matchedCount = 0;
    let newCount = 0;
    let changedCount = 0;
    let unchangedCount = 0;

    for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
      const row = rawRows[r];
      if (!row || row.length === 0) continue;

      const rawNik = nikCol !== -1 ? String(row[nikCol] || '').trim() : '';
      const rawName = nameCol !== -1 ? String(row[nameCol] || '').trim() : '';
      const rawPosition = positionCol !== -1 ? String(row[positionCol] || '').trim() : 'Staff';
      const rawDept = deptCol !== -1 ? String(row[deptCol] || '').trim().toUpperCase() : 'SERVICE';
      const rawPor = porCol !== -1 ? String(row[porCol] || '').trim() : '-';
      const rawKimper = kimperCol !== -1 ? String(row[kimperCol] || '').trim() : '';

      // Skip empty or summary rows
      if (!rawNik && !rawName) continue;
      if (rawNik.toUpperCase().includes('TOTAL') || rawName.toUpperCase().includes('TOTAL')) continue;
      if (rawName.toUpperCase().includes('DATABASE') || rawName.toUpperCase().includes('PERIODE')) continue;

      // Find matching employee in existing employees
      const matchedEmp = existingEmployees.find((e) => {
        if (rawNik && e.nip && e.nip.toLowerCase() === rawNik.toLowerCase()) return true;
        if (rawName && e.name && e.name.toLowerCase() === rawName.toLowerCase()) return true;
        return false;
      });

      const isMatched = Boolean(matchedEmp);
      let employee: Employee;

      if (matchedEmp) {
        matchedCount++;
        employee = matchedEmp;
      } else {
        newCount++;
        const safeNik = rawNik || `NEW-${Date.now().toString().slice(-4)}`;
        const kimperArray = rawKimper
          ? rawKimper.split(/[,;\/]+/).map((k) => k.trim().toUpperCase()).filter(Boolean)
          : [];

        employee = {
          id: `emp-${safeNik}`,
          nip: safeNik,
          name: rawName || `Karyawan ${safeNik}`,
          department: rawDept || 'SERVICE',
          position: rawPosition || 'Mekanik',
          por: rawPor || '-',
          kimper: kimperArray,
          role: 'staff',
          username: safeNik.toLowerCase(),
          avatarColor: 'bg-indigo-600',
        };
      }

      // Extract shift values for each mapped day
      const employeeShifts: Record<string, ShiftCode> = {};
      const diffs: ShiftDiff[] = [];
      let totalShiftsFound = 0;
      let totalChanges = 0;

      const currentEmpRoster = currentRoster[employee.id] || {};

      dayColMapList.forEach(({ colIdx, dayNumber, dateStr }) => {
        const cellRaw = row[colIdx];
        const normalized = normalizeShiftCode(cellRaw);
        const oldShift = currentEmpRoster[dateStr]?.shift || '-';

        if (normalized) {
          employeeShifts[dateStr] = normalized;
          totalShiftsFound++;
          const isChanged = oldShift !== normalized;
          if (isChanged) totalChanges++;
          diffs.push({
            dateStr,
            dayNumber,
            oldShift,
            newShift: normalized,
            isChanged,
          });
        }
      });

      // Sort diffs by dayNumber
      diffs.sort((a, b) => a.dayNumber - b.dayNumber);

      const hasChanges = totalChanges > 0 || !isMatched;
      if (hasChanges) {
        changedCount++;
      } else {
        unchangedCount++;
      }

      items.push({
        key: `import-${employee.id}-${r}`,
        isMatched,
        isNewEmployee: !isMatched,
        employee,
        originalNik: rawNik,
        originalName: rawName,
        originalDept: rawDept,
        originalPosition: rawPosition,
        shifts: employeeShifts,
        diffs,
        totalShiftsFound,
        totalChanges,
        // Default selected: select all that have changes or all by default if shifts found
        selected: totalShiftsFound > 0,
      });
    }

    if (items.length === 0) {
      return {
        success: false,
        message: 'Tidak ada baris karyawan atau jadwal shift yang valid ditemukan dalam file Excel.',
        sheetName,
        targetYear: detectedYear,
        targetMonthIndex: detectedMonthIndex,
        items: [],
        summary: { totalRowsFound: 0, totalMatched: 0, totalNew: 0, totalWithChanges: 0, totalUnchanged: 0 },
      };
    }

    return {
      success: true,
      message: `Berhasil memproses file Excel: ditemukan ${items.length} karyawan dan ${dayColMapList.length} kolom tanggal.`,
      sheetName,
      targetYear: detectedYear,
      targetMonthIndex: detectedMonthIndex,
      items,
      summary: {
        totalRowsFound: items.length,
        totalMatched: matchedCount,
        totalNew: newCount,
        totalWithChanges: changedCount,
        totalUnchanged: unchangedCount,
      },
    };
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    return {
      success: false,
      message: error instanceof Error ? `Error membaca file: ${error.message}` : 'Format file Excel tidak didukung.',
      sheetName: '',
      targetYear: fallbackYear,
      targetMonthIndex: fallbackMonthIndex,
      items: [],
      summary: { totalRowsFound: 0, totalMatched: 0, totalNew: 0, totalWithChanges: 0, totalUnchanged: 0 },
    };
  }
}

/**
 * Generates and triggers download of an Excel Template pre-populated with current employees
 */
export function downloadRosterExcelTemplate(
  year: number,
  monthIndex: number,
  employees: Employee[],
  currentRoster?: RosterData
) {
  const monthName = MONTH_NAMES_ID[monthIndex];
  const days = getDaysInMonth(year, monthIndex);

  const headers = [
    'No',
    'NIK',
    'NAMA',
    'JABATAN',
    'DEPARTEMEN',
    'POR',
    'KIMPER',
    ...days.map((d) => `${d.date}`),
  ];

  const rows = employees.map((emp, idx) => {
    const empShifts = currentRoster ? currentRoster[emp.id] || {} : {};
    const dayCols = days.map((d) => empShifts[d.dateStr]?.shift || '');

    return [
      idx + 1,
      emp.nip,
      emp.name,
      emp.position,
      emp.department,
      emp.por || '-',
      (emp.kimper || []).join(', ') || '-',
      ...dayCols,
    ];
  });

  const sheetData = [
    [`TEMPLATE ROSTER KERJA - PERIODE ${monthName.toUpperCase()} ${year}`],
    [`Petunjuk: Isi kolom tanggal dengan kode shift: D (Day), N (Night), OFF (Libur), CT (Cuti), P (Perjalanan)`],
    [],
    headers,
    ...rows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  ws['!cols'] = [
    { wch: 5 },  // No
    { wch: 10 }, // NIK
    { wch: 26 }, // NAMA
    { wch: 24 }, // JABATAN
    { wch: 14 }, // DEPARTEMEN
    { wch: 12 }, // POR
    { wch: 20 }, // KIMPER
    ...days.map(() => ({ wch: 5 })),
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Roster_${monthName}_${year}`);

  const fileName = `Template_Roster_${monthName}_${year}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
