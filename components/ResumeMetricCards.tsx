'use client';

import React from 'react';
import { Users, Sun, Moon, Coffee, Plane, Calendar } from 'lucide-react';

export interface ResumeStatsData {
  total: number;
  countD: number;
  countN: number;
  countOff: number;
  countCT: number;
  countP: number;
}

interface ResumeCardGroupProps {
  type: 'today' | 'tomorrow';
  label: string; // 'HARI INI' | 'BESOK'
  formattedDate: string; // e.g. 'Senin, 14 September 2026'
  stats: ResumeStatsData;
  departmentLabel: string;
}

export const ResumeCardGroup: React.FC<ResumeCardGroupProps> = ({
  type,
  label,
  formattedDate,
  stats,
  departmentLabel,
}) => {
  const isToday = type === 'today';

  return (
    <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
      {/* Header Info: Hari, Tanggal */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200/70">
        <div className="flex items-center gap-2.5">
          <span
            className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md text-white shadow-2xs ${
              isToday ? 'bg-blue-600' : 'bg-indigo-600'
            }`}
          >
            {label}
          </span>
          <div className="flex items-center gap-1.5 font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
            <Calendar
              className={`w-4 h-4 ${isToday ? 'text-blue-600' : 'text-indigo-600'}`}
            />
            <span>{formattedDate}</span>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {isToday ? 'Resume Operasional Hari Ini' : 'Proyeksi Roster & Kehadiran Besok'}
        </span>
      </div>

      {/* 5 Metric Cards as shown in reference image */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* 1. Total Personel */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              TOTAL PERSONEL
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {stats.total}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
              {departmentLabel}
            </div>
          </div>
        </div>

        {/* 2. Day Shift (D) */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-emerald-200/90 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>DAY SHIFT (D)</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
              {stats.countD}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
              06:00 - 18:00 • Bertugas
            </div>
          </div>
        </div>

        {/* 3. Night Shift (N) */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-blue-200/90 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span>NIGHT SHIFT (N)</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Moon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
              {stats.countN}
            </div>
            <div className="text-[11px] text-blue-700 font-medium mt-0.5">
              18:00 - 06:00 • Bertugas
            </div>
          </div>
        </div>

        {/* 4. Off / Libur */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
              <span>OFF / LIBUR</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {stats.countOff}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              Hari Istirahat Rutin
            </div>
          </div>
        </div>

        {/* 5. Cuti & Perjalanan */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-200/90 shadow-2xs hover:shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span>CUTI & PERJALANAN</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
              {stats.countCT + stats.countP}
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5">
              {stats.countCT} Cuti • {stats.countP} Perjalanan (P)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
