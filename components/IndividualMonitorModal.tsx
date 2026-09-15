'use client';

import React, { useState } from 'react';
import { Employee, RosterData, ShiftCode } from '@/lib/types';
import { SHIFTS, MONTH_NAMES_ID, KIMPER_LIST, KIMPER_MAP } from '@/lib/constants';
import { getDaysInMonth, calculateEmployeeRecap } from '@/lib/roster-utils';
import {
  X,
  Calendar,
  Clock,
  User,
  Building2,
  Briefcase,
  Phone,
  Mail,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface IndividualMonitorModalProps {
  employee: Employee;
  year: number;
  monthIndex: number;
  roster: RosterData;
  canEdit?: boolean;
  onUpdateShift?: (employeeId: string, dateStr: string, shift: ShiftCode) => void;
  onClearShift?: (employeeId: string, dateStr: string, reason?: string) => void;
  onUpdateEmployeeKimper?: (employeeId: string, kimpers: string[]) => void;
  onClose: () => void;
}

export const IndividualMonitorModal: React.FC<IndividualMonitorModalProps> = ({
  employee,
  year,
  monthIndex,
  roster,
  canEdit = false,
  onUpdateShift,
  onClearShift,
  onUpdateEmployeeKimper,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentKimpers, setCurrentKimpers] = useState<string[]>(employee.kimper || []);
  const [editShiftPopover, setEditShiftPopover] = useState<{
    dateStr: string;
    currentShift?: ShiftCode | '';
  } | null>(null);

  const toggleKimper = (kCode: string) => {
    const updated = currentKimpers.includes(kCode)
      ? currentKimpers.filter((k) => k !== kCode)
      : [...currentKimpers, kCode];
    setCurrentKimpers(updated);
    if (onUpdateEmployeeKimper) {
      onUpdateEmployeeKimper(employee.id, updated);
    }
  };

  const monthName = MONTH_NAMES_ID[monthIndex];
  const days = getDaysInMonth(year, monthIndex);
  const recap = calculateEmployeeRecap(employee, roster, year, monthIndex);
  const empRoster = roster[employee.id] || {};

  const handleShiftSelect = (newShift: ShiftCode) => {
    if (editShiftPopover && onUpdateShift) {
      onUpdateShift(employee.id, editShiftPopover.dateStr, newShift);
      setEditShiftPopover(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="individual-monitor-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="individual-monitor-modal-card"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-xs">
              {employee.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">{employee.name}</h2>
                <span className="text-xs bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-mono border border-slate-700">
                  {employee.nip}
                </span>
                <span className="text-xs bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/40">
                  {employee.department}
                </span>
                {employee.por && (
                  <span className="text-xs bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded border border-amber-400/30">
                    POR: {employee.por}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">{employee.position}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cetak Jadwal Individu"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak Slip</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Bar: Contact info & Period */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{employee.email || `${employee.username}@company.co.id`}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{employee.phone || '0812-xxxx-xxxx'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 md:justify-end">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-slate-800">
                Periode: {monthName} {year}
              </span>
            </div>
          </div>

          {/* Specialized Permits (KIMPER) Section */}
          <div className="bg-amber-50/50 rounded-2xl border border-amber-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Status Izin Khusus Operasional (KIMPER)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Lisensi pengoperasian unit dan alat berat (LV, OHC, RIGGER, Forklift)
                  </p>
                </div>
              </div>
              {canEdit && (
                <span className="text-[10px] text-amber-800 bg-amber-100 font-semibold px-2 py-0.5 rounded">
                  Klik badge lisensi di bawah untuk menambah/mencabut izin
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
              {KIMPER_LIST.map((k) => {
                const hasKimper = currentKimpers.includes(k.code);
                return (
                  <button
                    key={k.code}
                    type="button"
                    disabled={!canEdit}
                    onClick={() => canEdit && toggleKimper(k.code)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      canEdit ? 'cursor-pointer hover:shadow-xs' : 'cursor-default'
                    } ${
                      hasKimper
                        ? 'border-amber-300 bg-white shadow-2xs'
                        : 'border-slate-200 bg-slate-100/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-black px-1.5 py-0.2 rounded border ${
                          hasKimper
                            ? `${k.color} font-black`
                            : 'bg-slate-200 text-slate-400 border-slate-300'
                        }`}
                      >
                        {k.code}
                      </span>
                      {hasKimper ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Aktif
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Non-Aktif</span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 mt-1.5 line-clamp-1">
                      {k.name}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{k.category}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shift Allocation Summary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ringkasan Alokasi Shift Individu ({monthName} {year})
              </h3>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Total Bertugas: {recap.totalWorkDays} Shift (D + N)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 text-center">
                <div className="text-[11px] font-semibold text-emerald-800">Day Shift (D)</div>
                <div className="text-xl font-extrabold text-emerald-900 mt-1">{recap.dCount}</div>
                <div className="text-[10px] text-emerald-700">Hari Terjadwal</div>
              </div>

              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/70 text-center">
                <div className="text-[11px] font-semibold text-blue-800">Night Shift (N)</div>
                <div className="text-xl font-extrabold text-blue-900 mt-1">{recap.nCount}</div>
                <div className="text-[10px] text-blue-700">Hari Terjadwal</div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center">
                <div className="text-[11px] font-semibold text-slate-700">Off / Libur</div>
                <div className="text-xl font-extrabold text-slate-800 mt-1">{recap.offCount}</div>
                <div className="text-[10px] text-slate-500">Hari Libur</div>
              </div>

              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/70 text-center">
                <div className="text-[11px] font-semibold text-amber-800">Cuti (CT)</div>
                <div className="text-xl font-extrabold text-amber-900 mt-1">{recap.ctCount}</div>
                <div className="text-[10px] text-amber-700">Hari Cuti</div>
              </div>

              <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/70 text-center">
                <div className="text-[11px] font-semibold text-purple-800">Perjalanan (P)</div>
                <div className="text-xl font-extrabold text-purple-900 mt-1">{recap.pCount}</div>
                <div className="text-[10px] text-purple-700">Pasca Cuti</div>
              </div>

              <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/70 text-center">
                <div className="text-[11px] font-semibold text-indigo-800">Total Shift (D+N)</div>
                <div className="text-xl font-extrabold text-indigo-900 mt-1">{recap.totalWorkDays}</div>
                <div className="text-[10px] text-indigo-700 font-medium">
                  Hari Bertugas
                </div>
              </div>
            </div>
          </div>

          {/* Calendar View of Personal Roster */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Kalender Roster Individu
              </h3>
              {canEdit && (
                <span className="text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Mode Admin: Klik kotak tanggal untuk mengubah shift
                </span>
              )}
            </div>

            {/* Calendar Grid */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200 text-center text-xs font-semibold text-slate-600 py-2">
                <div className="text-rose-600">Minggu</div>
                <div>Senin</div>
                <div>Selasa</div>
                <div>Rabu</div>
                <div>Kamis</div>
                <div>Jumat</div>
                <div className="text-rose-600">Sabtu</div>
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-white">
                {/* Pad leading days if month doesn't start on Sunday */}
                {Array.from({ length: days[0].dayOfWeek }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-18 p-1.5 bg-slate-50/50" />
                ))}

                {days.map((day) => {
                  const entry = empRoster[day.dateStr];
                  const shiftCode = entry?.shift;
                  const shiftDef = shiftCode ? SHIFTS[shiftCode] : undefined;

                  return (
                    <div
                      key={day.dateStr}
                      onClick={() => {
                        if (canEdit) {
                          setEditShiftPopover({
                            dateStr: day.dateStr,
                            currentShift: shiftCode || '',
                          });
                        }
                      }}
                      className={`h-20 p-2 flex flex-col justify-between transition-colors ${
                        canEdit ? 'cursor-pointer hover:bg-indigo-50/40' : ''
                      } ${day.isWeekend ? 'bg-slate-50/70' : 'bg-white'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            day.isWeekend ? 'text-rose-600' : 'text-slate-700'
                          }`}
                        >
                          {day.date}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {day.dayShort}
                        </span>
                      </div>

                      {shiftDef ? (
                        <div
                          className={`px-1.5 py-1 rounded text-center text-xs font-bold border transition-all ${shiftDef.color}`}
                        >
                          <div>{shiftCode}</div>
                          <div className="text-[9px] font-normal leading-tight hidden sm:block truncate">
                            {shiftDef.shortName}
                          </div>
                        </div>
                      ) : (
                        <div className="px-1 py-1 rounded text-center text-xs border border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
                          <div>-</div>
                          <div className="text-[9px] font-normal leading-tight hidden sm:block text-slate-400">
                            Kosong
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Edit Popover inside Modal */}
          {editShiftPopover && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-900">
                  Ubah Shift Tanggal: {editShiftPopover.dateStr} ({employee.name})
                </span>
                <button
                  type="button"
                  onClick={() => setEditShiftPopover(null)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  Batal
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['D', 'N', 'OFF', 'CT', 'P'] as ShiftCode[]).map((code) => {
                  const item = SHIFTS[code];
                  if (!item) return null;
                  const isCurrent = editShiftPopover.currentShift === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleShiftSelect(code)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${item.color} ${
                        isCurrent ? 'ring-2 ring-indigo-600 ring-offset-1 font-extrabold' : 'hover:scale-105'
                      }`}
                    >
                      {code} - {item.shortName}
                    </button>
                  );
                })}
                {onClearShift && (
                  <button
                    type="button"
                    onClick={() => {
                      onClearShift(
                        employee.id,
                        editShiftPopover.dateStr,
                        'Dikosongkan dari monitoring individu'
                      );
                      setEditShiftPopover(null);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-dashed border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Kosongkan Shift (-)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Detailed Agenda List */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Daftar Rincian Jadwal Per Hari
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Tanggal</th>
                    <th className="py-2 px-3 font-semibold">Hari</th>
                    <th className="py-2 px-3 font-semibold">Shift Kerja</th>
                    <th className="py-2 px-3 font-semibold">Jam Operasional</th>
                    <th className="py-2 px-3 font-semibold">Kategori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {days.map((day) => {
                    const entry = empRoster[day.dateStr];
                    const shiftCode = entry?.shift;
                    const shiftDef = shiftCode ? SHIFTS[shiftCode] : undefined;

                    return (
                      <tr
                        key={day.dateStr}
                        className={`hover:bg-slate-50 transition-colors ${
                          day.isWeekend ? 'bg-slate-50/40' : ''
                        }`}
                      >
                        <td className="py-2 px-3 font-mono font-medium text-slate-800">
                          {day.dateStr}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          <span className={day.isWeekend ? 'text-rose-600 font-semibold' : ''}>
                            {day.dayName}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          {shiftDef ? (
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${shiftDef.color}`}
                            >
                              {shiftCode} - {shiftDef.shortName}
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] text-slate-400 font-medium border border-dashed border-slate-200">
                              - (Belum Terjadwal)
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">
                          {shiftDef ? shiftDef.timeRange : '-'}
                        </td>
                        <td className="py-2 px-3 text-slate-500 text-[11px]">
                          {shiftDef ? shiftDef.description : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>Data diverifikasi otomatis oleh Sistem Roster Kerja</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
