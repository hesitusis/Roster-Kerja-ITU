import * as XLSX from 'xlsx';
import { Employee, MonthlyEmployeeRecap, RosterData } from './types';
import { getDaysInMonth, calculateEmployeeRecap } from './roster-utils';
import { MONTH_NAMES_ID, SHIFTS } from './constants';

export function exportRosterToExcel({
  year,
  monthIndex,
  departmentFilter,
  employees,
  roster,
}: {
  year: number;
  monthIndex: number;
  departmentFilter: string;
  employees: Employee[];
  roster: RosterData;
}) {
  const monthName = MONTH_NAMES_ID[monthIndex];
  const days = getDaysInMonth(year, monthIndex);

  const filteredEmployees = departmentFilter === 'ALL'
    ? employees
    : employees.filter((e) => e.department.toUpperCase() === departmentFilter.toUpperCase());

  // 1. Build Roster Matrix Sheet matching Google Spreadsheet layout
  const matrixHeaders: string[] = [
    'No',
    'NIK',
    'NAMA',
    'JABATAN',
    'DEPARTEMEN',
    'POR',
    'KIMPER',
    ...days.map((d) => `${d.date} (${d.dayShort})`),
    'D',
    'N',
    'OFF',
    'CT',
    'P',
    'Total Shift (D+N)',
  ];

  const matrixRows = filteredEmployees.map((emp, idx) => {
    const recap = calculateEmployeeRecap(emp, roster, year, monthIndex);
    const dayShifts = days.map((d) => {
      const code = roster[emp.id]?.[d.dateStr]?.shift || '';
      return code;
    });

    return [
      idx + 1,
      emp.nip,
      emp.name,
      emp.position,
      emp.department,
      emp.por || '-',
      (emp.kimper || []).join(', ') || '-',
      ...dayShifts,
      recap.dCount,
      recap.nCount,
      recap.offCount,
      recap.ctCount,
      recap.pCount,
      recap.totalWorkDays,
    ];
  });

  const matrixData = [
    [`DATABASE SETTING ROSTER KERJA KARYAWAN - ${departmentFilter === 'ALL' ? 'SEMUA DEPARTEMEN' : departmentFilter}`],
    [`Periode: ${monthName} ${year} | Format Google Spreadsheet`],
    [`Tanggal Export: ${new Date().toLocaleString('id-ID')}`],
    [], // empty row
    matrixHeaders,
    ...matrixRows,
  ];

  const matrixWorksheet = XLSX.utils.aoa_to_sheet(matrixData);

  // Set column widths
  const colWidths = [
    { wch: 5 },  // No
    { wch: 10 }, // NIK
    { wch: 26 }, // NAMA
    { wch: 26 }, // JABATAN
    { wch: 14 }, // DEPARTEMEN
    { wch: 14 }, // POR
    { wch: 22 }, // KIMPER
    ...days.map(() => ({ wch: 6 })), // Days
    { wch: 6 }, // D
    { wch: 6 }, // N
    { wch: 6 }, // OFF
    { wch: 6 }, // CT
    { wch: 6 }, // P
    { wch: 16 }, // Total Shift (D+N)
  ];
  matrixWorksheet['!cols'] = colWidths;

  // 2. Build Ringkasan Alokasi Shift Sheet
  const rekapHeaders = [
    'No',
    'NIK',
    'Nama Karyawan',
    'Jabatan',
    'Departemen',
    'POR',
    'Kimper',
    'Day Shift (D)',
    'Night Shift (N)',
    'Off (Libur)',
    'Cuti (CT)',
    'Perjalanan Pasca Cuti (P)',
    'Total Shift Bertugas (D+N)',
  ];

  const rekapRows = filteredEmployees.map((emp, idx) => {
    const recap = calculateEmployeeRecap(emp, roster, year, monthIndex);
    return [
      idx + 1,
      emp.nip,
      emp.name,
      emp.position,
      emp.department,
      emp.por || '-',
      (emp.kimper || []).join(', ') || '-',
      recap.dCount,
      recap.nCount,
      recap.offCount,
      recap.ctCount,
      recap.pCount,
      recap.totalWorkDays,
    ];
  });

  const rekapData = [
    [`RINGKASAN ALOKASI SHIFT ROSTER KARYAWAN`],
    [`Periode: ${monthName} ${year}`],
    [`Departemen: ${departmentFilter === 'ALL' ? 'Semua Departemen' : departmentFilter}`],
    [],
    rekapHeaders,
    ...rekapRows,
  ];

  const rekapWorksheet = XLSX.utils.aoa_to_sheet(rekapData);
  rekapWorksheet['!cols'] = [
    { wch: 5 },
    { wch: 10 },
    { wch: 26 },
    { wch: 24 },
    { wch: 14 },
    { wch: 14 },
    { wch: 20 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 12 },
    { wch: 22 },
    { wch: 24 },
  ];

  // 3. Build Legend & Reference Sheet
  const legendData = [
    ['KETERANGAN KODE SHIFT SETTING ROSTER KERJA'],
    [],
    ['Kode', 'Nama Shift / Status', 'Jam Kerja', 'Kategori', 'Keterangan'],
    ['D', SHIFTS.D.name, SHIFTS.D.timeRange, 'Hari Kerja Aktif', SHIFTS.D.description],
    ['N', SHIFTS.N.name, SHIFTS.N.timeRange, 'Hari Kerja Aktif', SHIFTS.N.description],
    ['OFF', SHIFTS.OFF.name, SHIFTS.OFF.timeRange, 'Hari Libur', SHIFTS.OFF.description],
    ['CT', SHIFTS.CT.name, SHIFTS.CT.timeRange, 'Kategori Cuti', SHIFTS.CT.description],
    ['P', SHIFTS.P.name, SHIFTS.P.timeRange, 'Kategori Cuti', SHIFTS.P.description],
    [],
    ['KIMPER STANDAR OPERASIONAL:'],
    ['LV', 'Light Vehicle', 'Izin Mengemudikan Sarana Roda 4'],
    ['FORKLIFT', 'Forklift Operator', 'Operator Alat Angkat & Angkut Material'],
    ['WAH', 'Working At Height', 'Bekerja Di Ketinggian'],
    ['OHC', 'Overhead Crane', 'Operator Derek Gantung Workshop'],
    ['RIGGER', 'Rigger Bersertifikat', 'Juru Ikat Beban Komponen Berat'],
    [],
    ['DEPARTEMEN TERDAFTAR:'],
    ['1. SERVICE', 'Teknisi, Maintenance & Workshop Mesin Tambang'],
    ['2. HSE', 'Health, Safety & Environment'],
    ['3. HRGA FA', 'HR, General Affairs, Finance & Accounting'],
    ['4. PART', 'Logistik, Storeman & Parts Inventory Gudang'],
  ];

  const legendWorksheet = XLSX.utils.aoa_to_sheet(legendData);
  legendWorksheet['!cols'] = [
    { wch: 10 },
    { wch: 25 },
    { wch: 20 },
    { wch: 18 },
    { wch: 35 },
  ];

  // Combine into workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, matrixWorksheet, 'Roster Matrix');
  XLSX.utils.book_append_sheet(workbook, rekapWorksheet, 'Rekap Kehadiran');
  XLSX.utils.book_append_sheet(workbook, legendWorksheet, 'Keterangan Shift');

  // Generate filename and trigger download
  const deptSuffix = departmentFilter === 'ALL' ? 'Semua_Dept' : departmentFilter;
  const fileName = `Roster_Kerja_${deptSuffix}_${monthName}_${year}.xlsx`;

  XLSX.writeFile(workbook, fileName);
}
