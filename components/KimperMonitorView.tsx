'use client';

import React, { useState } from 'react';
import { Department, Employee, RosterData, ShiftCode } from '@/lib/types';
import { DEPARTMENTS, KIMPER_LIST, KIMPER_MAP, MONTH_NAMES_ID, SHIFTS } from '@/lib/constants';
import {
  getDaysInMonth,
  getDailyKimperReport,
  getMonthlyKimperAudit,
  DailyKimperReport,
  KimperCoverageStatus,
} from '@/lib/roster-utils';
import {
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Clock,
  UserCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Truck,
  Wrench,
  CheckCircle2,
  XCircle,
  Eye,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface KimperMonitorViewProps {
  year: number;
  monthIndex: number;
  employees: Employee[];
  roster: RosterData;
  onUpdateShift: (employeeId: string, dateStr: string, shift: ShiftCode) => void;
  onOpenIndividualModal: (employee: Employee) => void;
  initialDepartment?: Department | 'ALL';
}

export const KimperMonitorView: React.FC<KimperMonitorViewProps> = ({
  year,
  monthIndex,
  employees,
  roster,
  onUpdateShift,
  onOpenIndividualModal,
  initialDepartment = 'ALL',
}) => {
  const [selectedDept, setSelectedDept] = useState<Department | 'ALL'>(initialDepartment);
  const days = getDaysInMonth(year, monthIndex);
  const monthName = MONTH_NAMES_ID[monthIndex];

  // Selected date for detailed shift inspection (defaults to today or day 1)
  const today = new Date();
  const initialDateNum =
    today.getFullYear() === year && today.getMonth() === monthIndex
      ? Math.min(today.getDate(), days.length)
      : 1;

  const [selectedDateNum, setSelectedDateNum] = useState<number>(initialDateNum);

  const selectedDayInfo = days.find((d) => d.date === selectedDateNum) || days[0];
  const selectedDateStr = selectedDayInfo.dateStr;

  // Compute daily report for selected date
  const dailyReport = getDailyKimperReport(employees, roster, selectedDateStr, selectedDept);

  // Compute monthly audit for all days in month
  const monthlyAudit = getMonthlyKimperAudit(employees, roster, year, monthIndex, selectedDept);

  // Total shortage count in the month
  const totalDaysWithShortage = monthlyAudit.filter((d) => d.hasShortage).length;

  // Filtered employees for directory table
  const deptEmployees =
    selectedDept === 'ALL'
      ? employees
      : employees.filter((e) => e.department === selectedDept);

  const employeesWithKimper = deptEmployees.filter((e) => e.kimper && e.kimper.length > 0);

  const handlePrevDay = () => {
    setSelectedDateNum((prev) => (prev > 1 ? prev - 1 : days.length));
  };

  const handleNextDay = () => {
    setSelectedDateNum((prev) => (prev < days.length ? prev + 1 : 1));
  };

  return (
    <div id="kimper-monitor-root" className="space-y-6">
      {/* Header & Department / Date Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Monitoring Manpower Kimper (Izin Khusus Operasional)
                </h2>
                <span className="text-xs bg-blue-50 text-blue-800 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                  Dept. {selectedDept}
                </span>
                {totalDaysWithShortage > 0 ? (
                  <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {totalDaysWithShortage} Hari Ada Kekurangan Manpower
                  </span>
                ) : (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    100% Manpower Terpenuhi
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Memastikan ketersediaan teknisi pemegang izin <strong>LV, FORKLIFT, WAH, OHC, dan RIGGER</strong> pada setiap shift (Day Shift & Night Shift) agar operasional tidak terhenti.
              </p>
            </div>
          </div>

          {/* Department Filter Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start lg:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedDept('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedDept === 'ALL'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Dept
            </button>
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.code}
                type="button"
                onClick={() => setSelectedDept(dept.code)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedDept === dept.code
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {dept.code}
              </button>
            ))}
          </div>
        </div>

        {/* Date Selector Row */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Pilih Tanggal Audit:</span>
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl p-1">
              <button
                type="button"
                onClick={handlePrevDay}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                title="Hari Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-3 py-1 text-xs font-bold text-slate-900 flex items-center gap-2 min-w-[180px] justify-center">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  {selectedDayInfo.dayName}, {selectedDayInfo.date} {monthName} {year}
                </span>
                {selectedDayInfo.isWeekend && (
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-semibold">
                    Weekend
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextDay}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                title="Hari Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDateNum(initialDateNum)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Hari Ini
            </button>
          </div>

          {/* Quick Day Chips Carousel */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full sm:max-w-md">
            {days.map((d) => {
              const audit = monthlyAudit.find((a) => a.date === d.date);
              const isShort = audit?.hasShortage;
              const isSelected = d.date === selectedDateNum;

              return (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => setSelectedDateNum(d.date)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isShort
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={`${d.date} ${monthName} ${isShort ? '(Ada kekurangan Kimper)' : ''}`}
                >
                  {d.date}
                  {isShort && !isSelected && <span className="text-rose-600 ml-0.5">•</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ALERT / STATUS BANNER FOR THE SELECTED DATE */}
      {dailyReport.hasShortage ? (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 sm:p-5 text-rose-900 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-rose-900">
                  PERINGATAN: Terdeteksi Kekurangan Manpower Kimper pada {selectedDayInfo.dayName}, {selectedDayInfo.date} {monthName} {year}
                </h3>
                <span className="text-[10px] bg-rose-200 text-rose-900 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Kritis
                </span>
              </div>
              <p className="text-xs text-rose-700">
                Terdapat shift kerja yang tidak memiliki teknisi berizin khusus (Kimper) untuk mengoperasikan unit kritis:
              </p>
              <ul className="list-disc list-inside text-xs font-semibold text-rose-800 space-y-0.5 pt-1">
                {dailyReport.shortageMessages.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 sm:p-5 text-emerald-900 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-emerald-900">
                Manpower Kimper Lengkap & Aman pada {selectedDayInfo.dayName}, {selectedDayInfo.date} {monthName} {year}
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                Day Shift (D) dan Night Shift (N) memiliki personel pemegang izin LV, FORKLIFT, WAH, OHC, dan RIGGER yang cukup.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl">
            Semua Pos Terisi
          </span>
        </div>
      )}

      {/* 5 CORE KIMPER DETAILED COVERAGE CARDS FOR SELECTED DATE (LV, FORKLIFT, WAH, OHC, RIGGER) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {KIMPER_LIST.filter((k) => (k.minRecommendedPerShift ?? 0) > 0 || ['LV', 'FORKLIFT', 'WAH', 'OHC', 'RIGGER'].includes(k.code)).map((kDef) => {
          const status = dailyReport.coverages[kDef.code] as KimperCoverageStatus | undefined;
          if (!status) return null;

          const isShortS1 = status.isShortageS1;
          const isShortS2 = status.isShortageS2;

          return (
            <div
              key={kDef.code}
              className={`bg-white rounded-2xl border transition-all p-4 shadow-xs flex flex-col justify-between ${
                isShortS1 || isShortS2 ? 'border-rose-300 ring-2 ring-rose-200' : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-black tracking-wider border ${kDef.color}`}
                    >
                      {kDef.code}
                    </span>
                    <h3 className="text-xs font-extrabold text-slate-900">{kDef.name}</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Min: 1/shift</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                  {kDef.description}
                </p>

                {/* Day Shift (D) Coverage */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Day Shift (D)
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                        isShortS1
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {status.shift1Count} Operator {isShortS1 && '(KOSONG!)'}
                    </span>
                  </div>

                  {status.shift1Personnel.length > 0 ? (
                    <div className="space-y-1 pl-3.5">
                      {status.shift1Personnel.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between text-[11px] text-slate-800 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-md border border-slate-100 cursor-pointer"
                          onClick={() => {
                            const emp = employees.find((e) => e.id === p.id);
                            if (emp) onOpenIndividualModal(emp);
                          }}
                          title="Klik untuk membuka profil jadwal"
                        >
                          <span className="font-semibold truncate max-w-[130px]">{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{p.nip}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-rose-600 pl-3.5 italic font-medium">
                      ⚠️ Tidak ada personel berizin bertugas pada Day Shift (D)
                    </p>
                  )}
                </div>

                {/* Night Shift (N) Coverage */}
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Night Shift (N)
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                        isShortS2
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {status.shift2Count} Operator {isShortS2 && '(KOSONG!)'}
                    </span>
                  </div>

                  {status.shift2Personnel.length > 0 ? (
                    <div className="space-y-1 pl-3.5">
                      {status.shift2Personnel.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between text-[11px] text-slate-800 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-md border border-slate-100 cursor-pointer"
                          onClick={() => {
                            const emp = employees.find((e) => e.id === p.id);
                            if (emp) onOpenIndividualModal(emp);
                          }}
                          title="Klik untuk membuka profil jadwal"
                        >
                          <span className="font-semibold truncate max-w-[130px]">{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{p.nip}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-rose-600 pl-3.5 italic font-medium">
                      ⚠️ Tidak ada personel berizin bertugas pada Night Shift (N)
                    </p>
                  )}
                </div>
              </div>

              {/* Standby / Off Personnel for potential emergency recall */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 bg-slate-50/60 p-2 rounded-xl text-[10px] text-slate-600">
                <div className="flex items-center justify-between font-semibold mb-1">
                  <span>Standby / Off Hari Ini:</span>
                  <span className="text-slate-700 font-bold">{status.offCount} Personel</span>
                </div>
                {status.offPersonnel.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {status.offPersonnel.map((p) => (
                      <span
                        key={p.id}
                        className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 truncate max-w-[110px]"
                        title={`${p.name} (${p.shift})`}
                      >
                        {p.name} ({p.shift})
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400 italic">Semua pemegang bertugas</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MONTHLY KIMPER COVERAGE MATRIX (HEATMAP 1..31 DAYS) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/80">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Matriks Ketersediaan Kimper Bulanan ({monthName} {year})
            </h3>
            <p className="text-xs text-slate-500">
              Pantau seluruh hari dalam sebulan. Angka merah (<span className="text-rose-600 font-bold">0</span>) menandakan kekosongan operator pada shift tersebut yang perlu segera dijadwal ulang.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 text-[9px] font-bold text-emerald-800 flex items-center justify-center">
                1+
              </span>
              Tercukupi
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300 text-[9px] font-bold text-rose-800 flex items-center justify-center">
                0
              </span>
              Kosong / Kritis
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                <th className="py-2.5 px-3 font-bold sticky left-0 z-20 bg-slate-100 border-r border-slate-200 w-28">
                  Izin Kimper
                </th>
                <th className="py-2.5 px-2 font-bold sticky left-28 z-20 bg-slate-100 border-r border-slate-200 w-16 text-center">
                  Shift
                </th>
                {days.map((d) => (
                  <th
                    key={d.date}
                    onClick={() => setSelectedDateNum(d.date)}
                    className={`py-2 px-1 text-center font-bold border-r border-slate-200 w-8 min-w-[32px] cursor-pointer hover:bg-indigo-100/50 transition-colors ${
                      d.date === selectedDateNum
                        ? 'bg-indigo-600 text-white'
                        : d.isWeekend
                        ? 'bg-rose-50/70 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                    title={`Klik untuk audit detail tanggal ${d.date} ${monthName}`}
                  >
                    <div>{d.date}</div>
                    <div className="text-[9px] font-normal font-mono">{d.dayShort}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {KIMPER_LIST.filter((k) => (k.minRecommendedPerShift ?? 0) > 0 || ['LV', 'FORKLIFT', 'WAH', 'OHC', 'RIGGER'].includes(k.code)).map((kDef) => {
                return (
                  <React.Fragment key={kDef.code}>
                    {/* Shift 1 Row */}
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td
                        rowSpan={2}
                        className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200 sticky left-0 z-10 bg-white"
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${kDef.color}`}
                          >
                            {kDef.code}
                          </span>
                          <span className="truncate">{kDef.name}</span>
                        </div>
                      </td>

                      <td className="py-1.5 px-2 text-center font-bold text-emerald-800 bg-emerald-50/30 border-r border-slate-200 sticky left-28 z-10">
                        D
                      </td>

                      {days.map((d) => {
                        const audit = monthlyAudit.find((a) => a.date === d.date);
                        const count = audit?.coverages[kDef.code]?.shift1Count ?? 0;
                        const isShort = count < 1;
                        const isSelectedCol = d.date === selectedDateNum;

                        return (
                          <td
                            key={`s1-${d.date}`}
                            onClick={() => setSelectedDateNum(d.date)}
                            className={`py-1.5 px-0.5 text-center font-extrabold border-r border-slate-200 cursor-pointer transition-colors ${
                              isSelectedCol ? 'ring-2 ring-indigo-500 ring-inset' : ''
                            } ${
                              isShort
                                ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                : 'bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100'
                            }`}
                            title={`${kDef.code} S1 tgl ${d.date}: ${count} operator`}
                          >
                            {count}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Shift 2 Row */}
                    <tr className="hover:bg-slate-50/60 transition-colors border-b-2 border-slate-200">
                      <td className="py-1.5 px-2 text-center font-bold text-blue-800 bg-blue-50/30 border-r border-slate-200 sticky left-28 z-10">
                        N
                      </td>

                      {days.map((d) => {
                        const audit = monthlyAudit.find((a) => a.date === d.date);
                        const count = audit?.coverages[kDef.code]?.shift2Count ?? 0;
                        const isShort = count < 1;
                        const isSelectedCol = d.date === selectedDateNum;

                        return (
                          <td
                            key={`s2-${d.date}`}
                            onClick={() => setSelectedDateNum(d.date)}
                            className={`py-1.5 px-0.5 text-center font-extrabold border-r border-slate-200 cursor-pointer transition-colors ${
                              isSelectedCol ? 'ring-2 ring-indigo-500 ring-inset' : ''
                            } ${
                              isShort
                                ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                : 'bg-blue-50/60 text-blue-900 hover:bg-blue-100'
                            }`}
                            title={`${kDef.code} S2 tgl ${d.date}: ${count} operator`}
                          >
                            {count}
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIRECTORY OF KIMPER HOLDERS (DEPT. SERVICE & OPERATIONAL) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              Daftar Personel Berlisensi Kimper ({employeesWithKimper.length} Orang Terdaftar)
            </h3>
            <p className="text-xs text-slate-500">
              Rincian seluruh pemegang kartu izin khusus operasional beserta jabatan dan status shift hari ini ({selectedDateStr}).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {employeesWithKimper.map((emp) => {
            const todayShift: ShiftCode = roster[emp.id]?.[selectedDateStr]?.shift || 'OFF';
            const shiftDef = SHIFTS[todayShift];

            return (
              <div
                key={emp.id}
                className="bg-slate-50 rounded-xl border border-slate-200 p-4 hover:border-indigo-300 transition-all space-y-3 cursor-pointer"
                onClick={() => onOpenIndividualModal(emp)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold text-sm flex items-center justify-center">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                        {emp.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">{emp.nip}</p>
                      <p className="text-[10px] text-slate-400">{emp.position}</p>
                    </div>
                  </div>

                  <div
                    className={`px-2.5 py-1 rounded-lg border text-center text-xs font-bold ${shiftDef.color}`}
                  >
                    <div>{todayShift}</div>
                    <div className="text-[9px] font-normal">{shiftDef.shortName}</div>
                  </div>
                </div>

                {/* Kimper Badges */}
                <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-semibold text-slate-500">Izin Dimiliki:</span>
                  {(emp.kimper || []).map((kCode) => {
                    const kDef = KIMPER_MAP[kCode];
                    return (
                      <span
                        key={kCode}
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                          kDef?.color || 'bg-slate-200 text-slate-800'
                        }`}
                        title={kDef?.name || kCode}
                      >
                        {kCode}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
