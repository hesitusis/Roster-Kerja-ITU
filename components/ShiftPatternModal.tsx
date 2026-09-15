'use client';

import React, { useState, useMemo } from 'react';
import { Department, Employee, RosterData, ShiftCode } from '@/lib/types';
import { SHIFTS, DEPARTMENTS, MONTH_NAMES_ID } from '@/lib/constants';
import { getDaysInMonth } from '@/lib/roster-utils';
import { getRoleDisplayInfo, canEditEmployeeRoster, getAllowedDepartments, isUserAdmin } from '@/lib/role-utils';
import { X, Wand2, Calendar, Check, AlertCircle, ShieldCheck, Lock } from 'lucide-react';

interface ShiftPatternModalProps {
  year: number;
  monthIndex: number;
  employees: Employee[];
  selectedDepartment: string;
  onApplyPattern: (updatedRoster: RosterData) => void;
  currentRoster: RosterData;
  currentUser?: Employee | null;
  onClose: () => void;
}

export const ShiftPatternModal: React.FC<ShiftPatternModalProps> = ({
  year,
  monthIndex,
  employees,
  selectedDepartment,
  onApplyPattern,
  currentRoster,
  currentUser,
  onClose,
}) => {
  const roleInfo = getRoleDisplayInfo(currentUser?.role, currentUser?.department);
  const allowedDepts = getAllowedDepartments(currentUser?.role);
  const isSuper = roleInfo.isSuperAdmin;

  // Default target department based on admin authorization
  const defaultDept = useMemo(() => {
    if (isSuper) {
      return selectedDepartment === 'ALL' ? 'SERVICE' : selectedDepartment;
    }
    if (allowedDepts.length > 0) {
      if (allowedDepts.includes(selectedDepartment)) return selectedDepartment;
      return allowedDepts[0];
    }
    return 'SERVICE';
  }, [isSuper, allowedDepts, selectedDepartment]);

  const [targetDept, setTargetDept] = useState<string>(defaultDept);
  const [patternType, setPatternType] = useState<
    'standard_office' | 'rotation_2shift' | 'custom_fill'
  >('rotation_2shift');
  const [fillShift, setFillShift] = useState<ShiftCode>('D');

  const monthName = MONTH_NAMES_ID[monthIndex];
  const days = getDaysInMonth(year, monthIndex);

  const targetEmployees = useMemo(() => {
    return employees.filter((e) => {
      // Must match chosen department
      const matchDept = targetDept === 'ALL' ? true : e.department === targetDept;
      // Must have edit permission
      const canEdit = canEditEmployeeRoster(currentUser, e);
      return matchDept && canEdit;
    });
  }, [employees, targetDept, currentUser]);

  const handleApply = () => {
    const updated = { ...currentRoster };

    targetEmployees.forEach((emp, empIdx) => {
      if (!updated[emp.id]) {
        updated[emp.id] = {};
      } else {
        updated[emp.id] = { ...updated[emp.id] };
      }

      days.forEach((day, dayIdx) => {
        let shift: ShiftCode = 'D';

        if (patternType === 'standard_office') {
          // Mon-Fri: D (Day), Sat-Sun: OFF
          shift = day.isWeekend ? 'OFF' : 'D';
        } else if (patternType === 'rotation_2shift') {
          // Rotasi D & N:
          const offset = (dayIdx + empIdx * 3) % 7;
          if (offset === 0 || offset === 6) {
            shift = 'OFF';
          } else if (offset <= 3) {
            shift = empIdx % 2 === 0 ? 'D' : 'N';
          } else {
            shift = empIdx % 2 === 0 ? 'N' : 'D';
          }
        } else if (patternType === 'custom_fill') {
          // Isi dengan shift pilihan kecuali weekend
          shift = day.isWeekend ? 'OFF' : fillShift;
        }

        updated[emp.id][day.dateStr] = {
          shift,
          updatedBy: currentUser?.name || 'Admin',
          updatedByUsername: currentUser?.nip || 'admin',
          updatedAt: new Date().toISOString(),
          reason: `Pola Otomatis (${patternType})`,
          source: 'MANUAL',
        };
      });
    });

    onApplyPattern(updated);
    onClose();
  };

  return (
    <div
      id="pattern-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="pattern-modal-card"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Generator Pola Shift Otomatis</h2>
              <p className="text-xs text-slate-400">
                Terapkan template jadwal untuk periode {monthName} {year}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Admin Scope Notice */}
          <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs ${
            isSuper ? 'bg-indigo-50 border-indigo-200 text-indigo-950' : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center gap-2">
              {isSuper ? <ShieldCheck className="w-4 h-4 text-indigo-600" /> : <Lock className="w-4 h-4 text-amber-600" />}
              <div>
                <span className="font-bold">{roleInfo.title}:</span>{' '}
                <span>
                  {isSuper
                    ? 'Memiliki izin membuat pola shift untuk semua departemen.'
                    : `Hanya berwenang mengubah jadwal roster Dept. ${allowedDepts.join(', ')}.`}
                </span>
              </div>
            </div>
            <span className="font-bold px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs">
              {targetEmployees.length} Personel Sasaran
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Departemen Sasaran
            </label>
            <select
              value={targetDept}
              onChange={(e) => setTargetDept(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
            >
              {isSuper && (
                <option value="ALL">Semua Departemen ({employees.length} Personel)</option>
              )}
              {DEPARTMENTS.map((dept) => {
                const isDeptAllowed = isSuper || allowedDepts.includes(dept.code);
                const count = employees.filter((e) => e.department === dept.code).length;
                return (
                  <option
                    key={dept.code}
                    value={dept.code}
                    disabled={!isDeptAllowed}
                  >
                    {dept.code} - {dept.name} ({count} Personel){!isDeptAllowed ? ' - [Terkunci]' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Pilihan Pola Jadwal Roster
            </label>
            <div className="space-y-2">
              <label
                className={`p-3 rounded-xl border text-xs flex items-start gap-3 cursor-pointer transition-colors ${
                  patternType === 'rotation_2shift'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="pattern"
                  checked={patternType === 'rotation_2shift'}
                  onChange={() => setPatternType('rotation_2shift')}
                  className="mt-0.5 text-indigo-600"
                />
                <div>
                  <div className="font-bold text-slate-900">
                    Rotasi Bergilir 2 Shift (Shift 1 & Shift 2 + Off)
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Cocok untuk tim operasional (Service & Warehouse). Menyeimbangkan jadwal kerja pagi dan siang dengan hari libur berkala.
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border text-xs flex items-start gap-3 cursor-pointer transition-colors ${
                  patternType === 'standard_office'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="pattern"
                  checked={patternType === 'standard_office'}
                  onChange={() => setPatternType('standard_office')}
                  className="mt-0.5 text-indigo-600"
                />
                <div>
                  <div className="font-bold text-slate-900">
                    Hari Kerja Kantor Normal (Senin - Jumat S1, Weekend Off)
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Cocok untuk departemen administratif reguler (HRGA & FA).
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border text-xs flex items-start gap-3 cursor-pointer transition-colors ${
                  patternType === 'custom_fill'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="pattern"
                  checked={patternType === 'custom_fill'}
                  onChange={() => setPatternType('custom_fill')}
                  className="mt-0.5 text-indigo-600"
                />
                <div>
                  <div className="font-bold text-slate-900">
                    Isi Seragam Tertentu (Hari Kerja)
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Tetapkan shift yang sama untuk semua hari kerja:
                  </div>
                  {patternType === 'custom_fill' && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['D', 'N', 'OFF', 'CT', 'P'] as ShiftCode[]).map((sc) => (
                        <button
                          key={sc}
                          type="button"
                          onClick={() => setFillShift(sc)}
                          className={`px-3 py-1 rounded text-xs font-bold border ${SHIFTS[sc]?.color || 'bg-slate-100'} ${
                            fillShift === sc ? 'ring-2 ring-indigo-500' : ''
                          }`}
                        >
                          {sc} - {SHIFTS[sc]?.shortName || sc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>
              Perhatian: Menerapkan pola ini akan memperbarui roster {targetEmployees.length} karyawan terpilih pada bulan {monthName} {year}.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Terapkan Pola Shift</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
