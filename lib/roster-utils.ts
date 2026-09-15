import { Department, Employee, MonthlyEmployeeRecap, RosterData, ShiftCode } from './types';
import { SHIFTS } from './constants';

export interface DayInfo {
  date: number; // 1..31
  dateStr: string; // YYYY-MM-DD
  dayOfWeek: number; // 0..6
  dayName: string;
  dayShort: string;
  isWeekend: boolean;
}

export function getDaysInMonth(year: number, monthIndex: number): DayInfo[] {
  const count = new Date(year, monthIndex + 1, 0).getDate();
  const days: DayInfo[] = [];
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayShorts = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  for (let d = 1; d <= count; d++) {
    const dateObj = new Date(year, monthIndex, d);
    const dayOfWeek = dateObj.getDay();
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      date: d,
      dateStr,
      dayOfWeek,
      dayName: dayNames[dayOfWeek],
      dayShort: dayShorts[dayOfWeek],
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
  }

  return days;
}

export function calculateEmployeeRecap(
  employee: Employee,
  roster: RosterData,
  year: number,
  monthIndex: number
): MonthlyEmployeeRecap {
  const days = getDaysInMonth(year, monthIndex);
  const empRoster = roster[employee.id] || {};

  let d = 0;
  let n = 0;
  let off = 0;
  let ct = 0;
  let p = 0;
  let scheduledCount = 0;

  days.forEach((day) => {
    const entry = empRoster[day.dateStr];
    if (!entry || !entry.shift) {
      // Tanggal belum dijadwalkan / kosong: tidak dihitung sebagai OFF
      return;
    }
    scheduledCount++;
    const shiftCode: ShiftCode = entry.shift;

    switch (shiftCode) {
      case 'D':
      case 'S1':
        d++;
        break;
      case 'N':
      case 'S2':
        n++;
        break;
      case 'OFF':
        off++;
        break;
      case 'CT':
      case 'C':
      case 'CUTI':
        ct++;
        break;
      case 'P':
      case 'IZIN':
        p++;
        break;
      default:
        break;
    }
  });

  const totalWorkDays = d + n;
  const totalWorkHours = totalWorkDays * 8;
  const standardEffectiveDays = Math.max(0, scheduledCount - off);
  const attendanceRate =
    standardEffectiveDays > 0
      ? Math.min(100, Math.round((totalWorkDays / standardEffectiveDays) * 100))
      : 0;

  return {
    employeeId: employee.id,
    name: employee.name,
    nip: employee.nip,
    department: employee.department,
    position: employee.position,
    por: employee.por,
    dCount: d,
    nCount: n,
    offCount: off,
    ctCount: ct,
    pCount: p,
    // Backward compatibility
    shift1Count: d,
    shift2Count: n,
    cutiCount: ct,
    izinCount: p,
    totalWorkDays,
    totalWorkHours,
    attendanceRate,
  };
}

export function getDepartmentStats(
  employees: Employee[],
  roster: RosterData,
  dateStr: string,
  department?: string | 'ALL'
) {
  const filtered = department && department !== 'ALL'
    ? employees.filter((e) => e.department === department)
    : employees;

  let countD = 0;
  let countN = 0;
  let countOff = 0;
  let countCT = 0;
  let countP = 0;

  filtered.forEach((emp) => {
    const shift = roster[emp.id]?.[dateStr]?.shift;
    if (!shift) return;
    if (shift === 'D' || shift === 'S1') countD++;
    else if (shift === 'N' || shift === 'S2') countN++;
    else if (shift === 'OFF') countOff++;
    else if (shift === 'CT' || shift === 'C' || shift === 'CUTI') countCT++;
    else if (shift === 'P' || shift === 'IZIN') countP++;
  });

  return {
    total: filtered.length,
    countD,
    countN,
    countOff,
    countCT,
    countP,
    // Backward-compat keys
    countS1: countD,
    countS2: countN,
    countCuti: countCT,
    countIzin: countP,
    activeDuty: countD + countN,
  };
}

export interface KimperPersonnelInfo {
  id: string;
  name: string;
  nip: string;
  position: string;
  department: string;
  shift: ShiftCode;
  allKimpers: string[];
}

export interface KimperCoverageStatus {
  kimperCode: string;
  name: string;
  shift1Personnel: KimperPersonnelInfo[];
  shift1Count: number;
  shift2Personnel: KimperPersonnelInfo[];
  shift2Count: number;
  offPersonnel: KimperPersonnelInfo[];
  offCount: number;
  totalActiveToday: number;
  minRequiredPerShift: number;
  isShortageS1: boolean;
  isShortageS2: boolean;
}

export interface DailyKimperReport {
  dateStr: string;
  date: number;
  dayShort: string;
  dayName: string;
  isWeekend: boolean;
  coverages: Record<string, KimperCoverageStatus>;
  hasShortage: boolean;
  shortageMessages: string[];
}

const CRITICAL_KIMPERS: { code: string; name: string; minReq: number }[] = [
  { code: 'LV', name: 'Light Vehicle', minReq: 1 },
  { code: 'FORKLIFT', name: 'Forklift Operator', minReq: 1 },
  { code: 'WAH', name: 'Working At Height', minReq: 1 },
  { code: 'OHC', name: 'Overhead Crane', minReq: 1 },
  { code: 'RIGGER', name: 'Rigger Bersertifikat', minReq: 1 },
];

export function getDailyKimperReport(
  employees: Employee[],
  roster: RosterData,
  dateStr: string,
  targetDept: string | 'ALL' = 'SERVICE'
): DailyKimperReport {
  const dObj = new Date(dateStr);
  const dayOfWeek = dObj.getDay();
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayShorts = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const filtered = targetDept === 'ALL'
    ? employees
    : employees.filter((e) => e.department.toUpperCase() === targetDept.toUpperCase());

  const coverages: Record<string, KimperCoverageStatus> = {};
  const shortageMessages: string[] = [];

  CRITICAL_KIMPERS.forEach((ck) => {
    const s1List: KimperPersonnelInfo[] = [];
    const s2List: KimperPersonnelInfo[] = [];
    const offList: KimperPersonnelInfo[] = [];

    filtered.forEach((emp) => {
      const empKimpers = emp.kimper || [];
      const hasThisKimper = empKimpers.some(
        (k) => k.toUpperCase() === ck.code.toUpperCase()
      );

      if (hasThisKimper) {
        const shift: ShiftCode = roster[emp.id]?.[dateStr]?.shift || 'OFF';
        const info: KimperPersonnelInfo = {
          id: emp.id,
          name: emp.name,
          nip: emp.nip,
          position: emp.position,
          department: emp.department,
          shift,
          allKimpers: empKimpers,
        };

        if (shift === 'D' || shift === 'S1') s1List.push(info);
        else if (shift === 'N' || shift === 'S2') s2List.push(info);
        else offList.push(info);
      }
    });

    const isShortageS1 = s1List.length < ck.minReq;
    const isShortageS2 = s2List.length < ck.minReq;

    if (isShortageS1) {
      shortageMessages.push(`Day Shift (D) kekurangan Kimper ${ck.code} (${s1List.length}/${ck.minReq} operator bertugas)`);
    }
    if (isShortageS2) {
      shortageMessages.push(`Night Shift (N) kekurangan Kimper ${ck.code} (${s2List.length}/${ck.minReq} operator bertugas)`);
    }

    coverages[ck.code] = {
      kimperCode: ck.code,
      name: ck.name,
      shift1Personnel: s1List,
      shift1Count: s1List.length,
      shift2Personnel: s2List,
      shift2Count: s2List.length,
      offPersonnel: offList,
      offCount: offList.length,
      totalActiveToday: s1List.length + s2List.length,
      minRequiredPerShift: ck.minReq,
      isShortageS1,
      isShortageS2,
    };
  });

  return {
    dateStr,
    date: dObj.getDate() || 1,
    dayShort: dayShorts[dayOfWeek] || '',
    dayName: dayNames[dayOfWeek] || '',
    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    coverages,
    hasShortage: shortageMessages.length > 0,
    shortageMessages,
  };
}

export function getMonthlyKimperAudit(
  employees: Employee[],
  roster: RosterData,
  year: number,
  monthIndex: number,
  targetDept: string | 'ALL' = 'SERVICE'
): DailyKimperReport[] {
  const days = getDaysInMonth(year, monthIndex);
  return days.map((day) => getDailyKimperReport(employees, roster, day.dateStr, targetDept));
}

