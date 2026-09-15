'use client';

import React, { useState } from 'react';
import { Employee, LeaveRequest, RosterData, ShiftCode } from '@/lib/types';
import { SHIFTS, MONTH_NAMES_ID, DEPARTMENTS } from '@/lib/constants';
import { getDaysInMonth, calculateEmployeeRecap } from '@/lib/roster-utils';
import { ShiftLegend } from './ShiftLegend';
import {
  Calendar,
  Clock,
  User,
  Building2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Send,
  Printer,
  CheckCircle2,
  CalendarCheck,
  Users,
  AlertCircle,
  FileText,
  BadgeCheck,
} from 'lucide-react';

interface StaffDashboardProps {
  currentUser: Employee;
  year: number;
  monthIndex: number;
  onPeriodChange: (year: number, monthIndex: number) => void;
  allEmployees: Employee[];
  roster: RosterData;
  leaveRequests: LeaveRequest[];
  onSubmitLeaveRequest: (newReq: Omit<LeaveRequest, 'id' | 'submittedAt' | 'status'>) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  currentUser,
  year,
  monthIndex,
  onPeriodChange,
  allEmployees,
  roster,
  leaveRequests,
  onSubmitLeaveRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'colleagues' | 'request'>('calendar');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Leave submission state
  const [reqType, setReqType] = useState<'CUTI' | 'PERJALANAN' | 'IZIN' | 'SWAP'>('CUTI');
  const [reqStartDate, setReqStartDate] = useState('');
  const [reqEndDate, setReqEndDate] = useState('');
  const [reqReason, setReqReason] = useState('');
  const [swapTargetId, setSwapTargetId] = useState('');

  const monthName = MONTH_NAMES_ID[monthIndex];
  const days = getDaysInMonth(year, monthIndex);
  const recap = calculateEmployeeRecap(currentUser, roster, year, monthIndex);
  const myRoster = roster[currentUser.id] || {};

  // Current day determination
  const today = new Date();
  const todayDayNum = today.getDate();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === monthIndex;
  const todayDateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(
    todayDayNum > days.length ? 1 : todayDayNum
  ).padStart(2, '0')}`;

  const todayShiftCode = myRoster[todayDateStr]?.shift;
  const todayShift = todayShiftCode ? SHIFTS[todayShiftCode] : undefined;

  // Colleagues in the same department
  const deptColleagues = allEmployees.filter(
    (e) => e.department === currentUser.department && e.id !== currentUser.id
  );

  // My submitted requests
  const myRequests = leaveRequests.filter((r) => r.employeeId === currentUser.id);

  const handlePrevMonth = () => {
    if (monthIndex === 0) onPeriodChange(year - 1, 11);
    else onPeriodChange(year, monthIndex - 1);
  };

  const handleNextMonth = () => {
    if (monthIndex === 11) onPeriodChange(year + 1, 0);
    else onPeriodChange(year, monthIndex + 1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqStartDate || !reqReason.trim()) return;

    const swapTarget = deptColleagues.find((c) => c.id === swapTargetId);

    onSubmitLeaveRequest({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      department: currentUser.department,
      type: reqType,
      startDate: reqStartDate,
      endDate: reqEndDate || reqStartDate,
      reason: reqReason.trim(),
      swapWithEmployeeId: swapTarget?.id,
      swapWithEmployeeName: swapTarget?.name,
    });

    setReqReason('');
    setReqStartDate('');
    setReqEndDate('');
    setSuccessToast('Pengajuan Anda telah berhasil dikirim ke Administrator!');
    setTimeout(() => setSuccessToast(null), 4000);
    setActiveTab('calendar');
  };

  return (
    <div id="staff-dashboard-root" className="space-y-6 pb-12">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Staff Profile & Today's Shift Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Staff Identity & Access Level */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-extrabold text-slate-900">{currentUser.name}</h1>
                  <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-200">
                    {currentUser.nip}
                  </span>
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-200">
                    Dept. {currentUser.department}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{currentUser.position}</span>
                  <span>•</span>
                  <span>Akses Terbatas Staf</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              title="Cetak Jadwal Saya"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Slip</span>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div>
              Email: <span className="text-slate-800 font-medium">{currentUser.email}</span>
            </div>
            <div>
              Status Akun: <span className="text-emerald-700 font-semibold">Aktif Bertugas</span>
            </div>
          </div>
        </div>

        {/* Right: Today's Shift Status Highlight */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Jadwal Anda Hari Ini
              </span>
              <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-indigo-200 font-mono">
                {todayDateStr}
              </span>
            </div>
            {todayShift ? (
              <>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-3xl font-black tracking-tight">{todayShiftCode}</span>
                  <span className="text-lg font-bold text-indigo-200">{todayShift.shortName}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{todayShift.timeRange}</p>
              </>
            ) : (
              <>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-3xl font-black tracking-tight text-slate-400">-</span>
                  <span className="text-base font-semibold text-slate-300">Belum Ada Jadwal</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Jadwal roster untuk tanggal ini belum ditentukan</p>
              </>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-indigo-200">
            <span>{todayShift ? todayShift.description : 'Jadwal belum diisi oleh Administrator'}</span>
            <span className="font-semibold text-white">
              {todayShift ? (todayShift.isWorkday ? '8 Jam Kerja' : 'Hari Libur') : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Shift Allocation Summary Cards for this staff */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Alokasi Jadwal Shift Pribadi ({monthName} {year})
            </h2>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            Total Bertugas: {recap.totalWorkDays} Shift (D + N)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-emerald-800">Day Shift (D)</div>
            <div className="text-2xl font-black text-emerald-900 mt-0.5">{recap.dCount}</div>
            <div className="text-[10px] text-emerald-700">Hari Terjadwal Siang</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-blue-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-blue-800">Night Shift (N)</div>
            <div className="text-2xl font-black text-blue-900 mt-0.5">{recap.nCount}</div>
            <div className="text-[10px] text-blue-700">Hari Terjadwal Malam</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-700">Off / Libur</div>
            <div className="text-2xl font-black text-slate-800 mt-0.5">{recap.offCount}</div>
            <div className="text-[10px] text-slate-500">Hari Libur Rutin</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-amber-800">Cuti (CT)</div>
            <div className="text-2xl font-black text-amber-900 mt-0.5">{recap.ctCount}</div>
            <div className="text-[10px] text-amber-700">Hari Cuti Disetujui</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-purple-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-purple-800">Perjalanan (P)</div>
            <div className="text-2xl font-black text-purple-900 mt-0.5">{recap.pCount}</div>
            <div className="text-[10px] text-purple-700">Pasca Cuti</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-indigo-200 shadow-2xs bg-indigo-50/40">
            <div className="text-[11px] font-semibold text-indigo-800">Total Shift (D+N)</div>
            <div className="text-2xl font-black text-indigo-950 mt-0.5">{recap.totalWorkDays} Shift</div>
            <div className="text-[10px] text-indigo-700 font-medium">{recap.totalWorkDays} Hari Bertugas</div>
          </div>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Kalender Jadwal Saya</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('colleagues')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'colleagues'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Rekan Dept. {currentUser.department}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('request')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'request'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Ajukan Cuti / Izin / Tukar</span>
          </button>
        </div>

        {/* Period step buttons */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 rounded hover:bg-slate-100 text-slate-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 text-xs font-bold text-slate-800">
            {monthName} {year}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 rounded hover:bg-slate-100 text-slate-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TAB 1: PERSONAL CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Menampilkan jadwal lengkap per individu untuk bulan <strong>{monthName} {year}</strong>.
            </div>
            <ShiftLegend compact />
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200 text-center text-xs font-semibold text-slate-700 py-2.5">
              <div className="text-rose-600 font-bold">Minggu</div>
              <div>Senin</div>
              <div>Selasa</div>
              <div>Rabu</div>
              <div>Kamis</div>
              <div>Jumat</div>
              <div className="text-rose-600 font-bold">Sabtu</div>
            </div>

            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-white">
              {/* Empty leading cells */}
              {Array.from({ length: days[0].dayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-24 p-2 bg-slate-50/40" />
              ))}

              {days.map((day) => {
                const shiftCode = myRoster[day.dateStr]?.shift;
                const shiftDef = shiftCode ? SHIFTS[shiftCode] : undefined;
                const isToday = isCurrentMonth && day.date === todayDayNum;

                return (
                  <div
                    key={day.dateStr}
                    className={`h-24 p-2.5 flex flex-col justify-between transition-colors ${
                      isToday
                        ? 'bg-indigo-50/50 ring-2 ring-indigo-500 ring-inset'
                        : day.isWeekend
                        ? 'bg-slate-50/60'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold ${
                            isToday
                              ? 'w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]'
                              : day.isWeekend
                              ? 'text-rose-600'
                              : 'text-slate-800'
                          }`}
                        >
                          {day.date}
                        </span>
                        {isToday && (
                          <span className="text-[9px] font-bold text-indigo-700 uppercase">
                            Hari Ini
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{day.dayShort}</span>
                    </div>

                    {/* Shift badge */}
                    {shiftDef ? (
                      <div
                        className={`p-1.5 rounded-lg border text-center transition-transform hover:scale-102 ${shiftDef.color}`}
                      >
                        <div className="text-xs font-extrabold">{shiftCode}</div>
                        <div className="text-[9px] font-medium leading-tight truncate">
                          {shiftDef.shortName}
                        </div>
                        <div className="text-[8px] text-slate-500 font-mono hidden sm:block">
                          {shiftDef.timeRange}
                        </div>
                      </div>
                    ) : (
                      <div className="p-1 rounded-lg border border-dashed border-slate-200 bg-slate-50/40 text-center text-slate-400">
                        <div className="text-xs font-semibold text-slate-400">-</div>
                        <div className="text-[8px] text-slate-400">Belum Ada Shift</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COLLEAGUES IN SAME DEPARTMENT */}
      {activeTab === 'colleagues' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Jadwal Rekan Kerja Departemen {currentUser.department} Hari Ini ({todayDateStr})
            </h3>
            <p className="text-xs text-slate-500">
              Pantau siapa saja yang bertugas pada Shift 1, Shift 2, maupun Off untuk mempermudah serah terima kerja (handover)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {deptColleagues.map((colleague) => {
              const shiftCode = roster[colleague.id]?.[todayDateStr]?.shift || 'OFF';
              const shiftDef = SHIFTS[shiftCode];

              return (
                <div
                  key={colleague.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-700 text-white font-bold flex items-center justify-center text-sm">
                      {colleague.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{colleague.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{colleague.nip}</div>
                      <div className="text-[10px] text-slate-400">{colleague.position}</div>
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1.5 rounded-lg border text-center text-xs font-bold ${shiftDef.color}`}
                  >
                    <div>{shiftCode}</div>
                    <div className="text-[9px] font-normal">{shiftDef.shortName}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SUBMIT LEAVE / PERMISSION / SWAP FORM */}
      {activeTab === 'request' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Formulir Pengajuan Cuti, Izin & Tukar Shift
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pengajuan akan diteruskan kepada Administrator HRGA & Operasional untuk disetujui.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Pengajuan *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setReqType('CUTI')}
                    className={`p-2.5 text-xs font-bold rounded-xl border transition-colors ${
                      reqType === 'CUTI'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Cuti Resmi (CT)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReqType('PERJALANAN')}
                    className={`p-2.5 text-xs font-bold rounded-xl border transition-colors ${
                      reqType === 'PERJALANAN'
                        ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Perjalanan (P)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReqType('IZIN')}
                    className={`p-2.5 text-xs font-bold rounded-xl border transition-colors ${
                      reqType === 'IZIN'
                        ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Izin / Sakit
                  </button>
                  <button
                    type="button"
                    onClick={() => setReqType('SWAP')}
                    className={`p-2.5 text-xs font-bold rounded-xl border transition-colors ${
                      reqType === 'SWAP'
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Tukar Shift
                  </button>
                </div>
              </div>

              {/* If Tukar Shift, select colleague */}
              {reqType === 'SWAP' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilih Rekan Kerja untuk Tukar Shift *
                  </label>
                  <select
                    value={swapTargetId}
                    onChange={(e) => setSwapTargetId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    required
                  >
                    <option value="">-- Pilih Rekan Dept. {currentUser.department} --</option>
                    {deptColleagues.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.position})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Mulai *
                  </label>
                  <input
                    type="date"
                    value={reqStartDate}
                    onChange={(e) => setReqStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Selesai (Opsional)
                  </label>
                  <input
                    type="date"
                    value={reqEndDate}
                    onChange={(e) => setReqEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alasan / Keterangan Pengajuan *
                </label>
                <textarea
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  placeholder="Jelaskan alasan pengajuan secara jelas..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirimkan Permohonan ke Admin</span>
              </button>
            </form>
          </div>

          {/* History of my requests */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">Riwayat Pengajuan Anda</h3>
            <p className="text-xs text-slate-500 mb-4">
              Status permohonan yang telah Anda ajukan
            </p>

            {myRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum ada pengajuan cuti atau izin.
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {r.type === 'PERJALANAN' || r.type === 'P'
                          ? 'Perjalanan Pasca Cuti (P)'
                          : r.type === 'CUTI' || r.type === 'CT'
                          ? 'Cuti Resmi (CT)'
                          : r.type === 'SWAP'
                          ? 'Tukar Shift'
                          : 'Izin / Sakit'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status === 'APPROVED'
                          ? 'Disetujui'
                          : r.status === 'REJECTED'
                          ? 'Ditolak'
                          : 'Diproses'}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Tanggal: {r.startDate} {r.endDate !== r.startDate && `s/d ${r.endDate}`}
                    </div>
                    <div className="text-slate-500 italic">&quot;{r.reason}&quot;</div>
                    <div className="text-[10px] text-slate-400 pt-1">Diajukan: {r.submittedAt}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
