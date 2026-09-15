'use client';

import React, { useState } from 'react';
import { Department, Employee, LeaveRequest, RosterData, ShiftCode, ShiftEntry, AuditLogItem } from '@/lib/types';
import { DEPARTMENTS, MONTH_NAMES_ID, DAY_NAMES_ID, SHIFTS, KIMPER_LIST, KIMPER_MAP } from '@/lib/constants';
import {
  getDaysInMonth,
  calculateEmployeeRecap,
  getDepartmentStats,
  getDailyKimperReport,
  getMonthlyKimperAudit,
} from '@/lib/roster-utils';
import { exportRosterToExcel } from '@/lib/excel-export';
import { ShiftLegend } from './ShiftLegend';
import { KimperMonitorView } from './KimperMonitorView';
import { AuditLogModal } from './AuditLogModal';
import { ResumeCardGroup } from './ResumeMetricCards';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Filter,
  Plus,
  Search,
  Users,
  Wand2,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Layers,
  ArrowUpDown,
  Building2,
  CalendarCheck,
  AlertCircle,
  Eye,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  History,
  UserCheck,
  Info,
  Trash2,
  Link2,
  Sun,
  Moon,
  Coffee,
  Plane,
  X,
  Lock,
  Unlock,
  Shield,
} from 'lucide-react';
import {
  getRoleDisplayInfo,
  canEditEmployeeRoster,
  canAdminEditDepartment,
  isUserAdmin,
  getDefaultDeptForUser,
  getVisibleDepartmentsForUser,
} from '@/lib/role-utils';

interface AdminDashboardProps {
  year: number;
  monthIndex: number;
  onPeriodChange: (year: number, monthIndex: number) => void;
  employees: Employee[];
  roster: RosterData;
  leaveRequests: LeaveRequest[];
  auditLogs?: AuditLogItem[];
  currentUser?: Employee | null;
  onUpdateShift: (employeeId: string, dateStr: string, shift: ShiftCode, reason?: string) => void;
  onClearShift?: (employeeId: string, dateStr: string, reason?: string) => void;
  onUpdateLeaveRequest: (requestId: string, status: 'APPROVED' | 'REJECTED') => void;
  onOpenAddEmployee: () => void;
  onOpenPatternModal: () => void;
  onOpenIndividualModal: (employee: Employee) => void;
  onSyncSpreadsheet?: () => void;
  isSyncing?: boolean;
  lastSynced?: string | null;
  webhookUrl?: string;
  autoSync?: boolean;
  onSaveWebhookConfig?: (url: string, autoSync: boolean) => void;
  onPushBatchCurrentMonth?: () => Promise<void>;
  isBatchPushing?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  year,
  monthIndex,
  onPeriodChange,
  employees,
  roster,
  leaveRequests,
  auditLogs = [],
  currentUser,
  onUpdateShift,
  onClearShift,
  onUpdateLeaveRequest,
  onOpenAddEmployee,
  onOpenPatternModal,
  onOpenIndividualModal,
  onSyncSpreadsheet,
  isSyncing = false,
  lastSynced,
  webhookUrl,
  autoSync = true,
  onSaveWebhookConfig,
  onPushBatchCurrentMonth,
  isBatchPushing = false,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>(() => getDefaultDeptForUser(currentUser));
  const [activeTab, setActiveTab] = useState<'matrix' | 'recap' | 'kimper' | 'audit'>('matrix');
  const [selectedKimperFilter, setSelectedKimperFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [changeReason, setChangeReason] = useState<string>('');
  const [cellPopover, setCellPopover] = useState<{
    employeeId: string;
    employeeName: string;
    employeeNip?: string;
    dateStr: string;
    currentShift?: ShiftCode | '';
    entry?: ShiftEntry;
  } | null>(null);

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const userRoleInfo = getRoleDisplayInfo(currentUser?.role, currentUser?.department);

  // Otomatis sesuaikan departemen yang ditampilkan saat user / role aktif berganti
  const currentUserKey = `${currentUser?.id || ''}_${currentUser?.role || ''}_${currentUser?.department || ''}`;
  const [prevUserKey, setPrevUserKey] = useState<string>(currentUserKey);

  if (prevUserKey !== currentUserKey) {
    setPrevUserKey(currentUserKey);
    setSelectedDept(getDefaultDeptForUser(currentUser));
  }

  const monthName = MONTH_NAMES_ID[monthIndex];
  const days = getDaysInMonth(year, monthIndex);

  // Check if current month has any scheduled shifts (kosong atau sudah dijadwalkan)
  const isMonthEmpty = !employees.some((emp) =>
    days.some((d) => Boolean(roster[emp.id]?.[d.dateStr]?.shift))
  );

  // Today's and Tomorrow's date calculations
  const now = new Date();
  const baseDay = now.getFullYear() === year && now.getMonth() === monthIndex ? now.getDate() : 1;
  const safeTodayDay = Math.min(baseDay, days.length);

  // Today Date Object & Strings
  const todayObj = new Date(year, monthIndex, safeTodayDay);
  const todayDateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(safeTodayDay).padStart(2, '0')}`;
  const todayFormatted = `${DAY_NAMES_ID[todayObj.getDay()]}, ${todayObj.getDate()} ${MONTH_NAMES_ID[todayObj.getMonth()]} ${todayObj.getFullYear()}`;

  // Tomorrow Date Object & Strings (+1 day)
  const tomorrowObj = new Date(year, monthIndex, safeTodayDay);
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowDateStr = `${tomorrowObj.getFullYear()}-${String(tomorrowObj.getMonth() + 1).padStart(2, '0')}-${String(tomorrowObj.getDate()).padStart(2, '0')}`;
  const tomorrowFormatted = `${DAY_NAMES_ID[tomorrowObj.getDay()]}, ${tomorrowObj.getDate()} ${MONTH_NAMES_ID[tomorrowObj.getMonth()]} ${tomorrowObj.getFullYear()}`;

  // Calculate Kimper status for Service today and monthly audits
  const serviceKimperToday = getDailyKimperReport(employees, roster, todayDateStr, 'Service');
  const monthlyKimperAudit = getMonthlyKimperAudit(employees, roster, year, monthIndex, 'Service');
  const totalKimperShortageDays = monthlyKimperAudit.filter((a) => a.hasShortage).length;

  // Allow all admins to view and check roster across all departments.
  // Edit permission is enforced per employee/department via canEditEmployeeRoster.
  const staffEmployees = employees;
  const filteredEmployees = staffEmployees.filter((emp) => {
    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesKimper =
      selectedKimperFilter === 'ALL' ||
      (emp.kimper && emp.kimper.includes(selectedKimperFilter));
    const matchesSearch =
      searchQuery.trim() === '' ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesKimper && matchesSearch;
  });

  // Calculate stats for today and tomorrow
  const todayStats = getDepartmentStats(employees, roster, todayDateStr, selectedDept as any);
  const tomorrowStats = getDepartmentStats(employees, roster, tomorrowDateStr, selectedDept as any);

  // Handle Export Excel
  const handleExportExcel = () => {
    exportRosterToExcel({
      year,
      monthIndex,
      departmentFilter: selectedDept,
      employees: staffEmployees,
      roster,
    });
    showNotification(`Laporan Excel untuk ${selectedDept === 'ALL' ? 'Semua Departemen' : selectedDept} berhasil diunduh!`);
  };

  // Quick period step
  const handlePrevMonth = () => {
    if (monthIndex === 0) {
      onPeriodChange(year - 1, 11);
    } else {
      onPeriodChange(year, monthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (monthIndex === 11) {
      onPeriodChange(year + 1, 0);
    } else {
      onPeriodChange(year, monthIndex + 1);
    }
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    onPeriodChange(now.getFullYear(), now.getMonth());
  };

  const pendingLeaves = leaveRequests.filter((r) => r.status === 'PENDING');

  return (
    <div id="admin-dashboard-root" className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Controls Bar: Period Selector & Quick Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
        {/* Row 1: Period Navigator & Live Status Indicators */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
          {/* Period Selector */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center bg-slate-50 border border-slate-200/80 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-3 py-1 text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>
                  {monthName} {year}
                </span>
              </div>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Bulan Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Jump to month & year dropdowns */}
            <div className="inline-flex items-center gap-1.5">
              <select
                id="select-month"
                value={monthIndex}
                onChange={(e) => onPeriodChange(year, parseInt(e.target.value, 10))}
                className="text-xs font-semibold py-2 px-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              >
                {MONTH_NAMES_ID.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                id="select-year"
                value={year}
                onChange={(e) => onPeriodChange(parseInt(e.target.value, 10), monthIndex)}
                className="text-xs font-semibold py-2 px-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              >
                {[2024, 2025, 2026, 2027, 2028].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleCurrentMonth}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Bulan Ini
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Department Filter Pills & Quick Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Departemen:</span>
            </span>

            {/* Show 'Semua' and all department pills for all admins */}
            <button
              type="button"
              id="filter-dept-ALL"
              onClick={() => setSelectedDept('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDept === 'ALL'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent'
              }`}
            >
              Semua ({staffEmployees.length})
            </button>

            {DEPARTMENTS.map((dept) => {
              const isSelected = selectedDept === dept.code;
              const count = staffEmployees.filter((e) => e.department === dept.code).length;
              const canEditThisDept = userRoleInfo.isSuperAdmin || userRoleInfo.allowedDepts.includes(dept.code);
              return (
                <button
                  key={dept.code}
                  id={`filter-dept-${dept.code}`}
                  type="button"
                  onClick={() => setSelectedDept(dept.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{dept.code}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-semibold ${
                      isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                  {!userRoleInfo.isSuperAdmin && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded ${
                        isSelected
                          ? canEditThisDept
                            ? 'bg-emerald-500/30 text-emerald-100 font-medium'
                            : 'bg-slate-700 text-slate-200'
                          : canEditThisDept
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {canEditThisDept ? 'Wewenang Edit' : 'Lihat'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box with clear button */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NIP, jabatan..."
              className="w-full pl-8 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Quick Filter Kimper */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Filter Izin Kimper:</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedKimperFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedKimperFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Semua Izin
          </button>
          {KIMPER_LIST.slice(0, 4).map((k) => {
            const isSelected = selectedKimperFilter === k.code;
            return (
              <button
                key={k.code}
                type="button"
                onClick={() => setSelectedKimperFilter(isSelected ? 'ALL' : k.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? `${k.badgeBg} text-white border-transparent shadow-2xs`
                    : `${k.color} hover:opacity-85`
                }`}
                title={k.description}
              >
                {k.code} ({k.name.split(' ')[0]})
              </button>
            );
          })}
          {selectedKimperFilter !== 'ALL' && (
            <button
              type="button"
              onClick={() => setSelectedKimperFilter('ALL')}
              className="text-[11px] font-medium text-slate-500 hover:text-slate-800 underline ml-1 cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Dual Resume Information: Hari Ini & Besok with format Hari, Tanggal */}
      <div className="space-y-4">
        {/* 1. Resume Hari Ini */}
        <ResumeCardGroup
          type="today"
          label="HARI INI"
          formattedDate={todayFormatted}
          stats={todayStats}
          departmentLabel={selectedDept === 'ALL' ? 'Semua Departemen' : `Dept. ${selectedDept}`}
        />

        {/* 2. Resume Besok */}
        <ResumeCardGroup
          type="tomorrow"
          label="BESOK"
          formattedDate={tomorrowFormatted}
          stats={tomorrowStats}
          departmentLabel={selectedDept === 'ALL' ? 'Semua Departemen' : `Dept. ${selectedDept}`}
        />
      </div>

      {/* Kimper Warning Banner for Service Department */}
      {serviceKimperToday.hasShortage && (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 text-rose-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                  Peringatan Dept. Service
                </span>
                <span className="text-xs font-bold text-rose-900">
                  Terdeteksi Kekurangan Manpower Kimper pada Hari Ini ({todayDateStr})!
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-0.5 font-medium">
                {serviceKimperToday.shortageMessages.join(' • ')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab('kimper');
              setSelectedDept('Service');
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer flex items-center gap-2 self-start sm:self-center"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Audit & Monitoring Kimper</span>
          </button>
        </div>
      )}


      {/* Informative banner if dept admin is checking another department */}
      {!userRoleInfo.isSuperAdmin && selectedDept !== 'ALL' && !userRoleInfo.allowedDepts.includes(selectedDept) && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 animate-in fade-in shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Mode Lihat Roster:</strong> Anda sedang memeriksa roster Departemen <strong>{selectedDept}</strong>. Wewenang perubahan shift Anda berada pada Departemen <strong>{userRoleInfo.allowedDepts.join(', ')}</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedDept(userRoleInfo.allowedDepts[0] || 'ALL')}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer self-start sm:self-auto"
          >
            Beralih ke {userRoleInfo.allowedDepts.join(', ')} →
          </button>
        </div>
      )}

      {/* View Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="tab-view-matrix"
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tabel Matrix Roster</span>
          </button>

          <button
            id="tab-view-recap"
            type="button"
            onClick={() => setActiveTab('recap')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'recap'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Ringkasan Alokasi Shift</span>
          </button>

          <button
            id="tab-view-kimper"
            type="button"
            onClick={() => setActiveTab('kimper')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer relative ${
              activeTab === 'kimper'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Monitoring Kimper (Dept. Service)</span>
            {totalKimperShortageDays > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {totalKimperShortageDays}
              </span>
            )}
          </button>

          <button
            id="tab-view-audit"
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer relative ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <History className="w-4 h-4 text-purple-600" />
            <span>Log & Riwayat Perubahan</span>
            {auditLogs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold border border-purple-200">
                {auditLogs.length}
              </span>
            )}
          </button>
        </div>

        {/* Shift Legend Guide Bar */}
        <ShiftLegend />
      </div>

      {/* Informational Banner if Month is Empty / Unscheduled */}
      {isMonthEmpty && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <CalendarCheck className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                Jadwal Roster Bulan {monthName} {year} Masih Kosong
              </h4>
              <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                Sesuai dengan sheet asli Anda, jadwal bulan ini belum diinput. Sel ditandai dengan strip (<span className="font-mono font-bold">-</span>). Anda dapat mengklik tanggal untuk mengisi shift secara manual, atau menggunakan tombol <strong>Terapkan Pola Shift</strong> untuk mengisi jadwal rotasi otomatis.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenPatternModal}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap shadow-xs transition-colors cursor-pointer self-start sm:self-center shrink-0 flex items-center gap-1.5"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Terapkan Pola Shift</span>
          </button>
        </div>
      )}

      {/* TAB 1: MATRIX ROSTER TABLE */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-slate-50/70">
            <div className="text-slate-600 font-medium">
              Menampilkan <strong>{filteredEmployees.length}</strong> personel • Klik pada kolom tanggal
              untuk mengubah shift secara instan. Klik nama karyawan untuk melihat kalender individu.
            </div>
            <div className="text-slate-500 text-[11px]">
              Tanggal Weekend (Sabtu/Minggu) ditandai dengan latar kemerahan.
            </div>
          </div>

          {/* The Scrollable Matrix Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[1600px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 select-none">
                  <th className="py-2.5 px-2 font-bold sticky left-0 z-20 bg-slate-100 border-r border-slate-200 w-[44px] min-w-[44px] max-w-[44px] text-center">
                    No
                  </th>
                  <th className="py-2.5 px-2.5 font-bold sticky left-[44px] z-20 bg-slate-100 border-r border-slate-200 w-[80px] min-w-[80px] max-w-[80px]">
                    NIK
                  </th>
                  <th className="py-2.5 px-3 font-bold sticky left-[124px] z-20 bg-slate-100 border-r border-slate-200 w-[188px] min-w-[188px] max-w-[188px]">
                    Nama Karyawan
                  </th>
                  <th className="py-2.5 px-3 font-bold sticky left-[312px] z-20 bg-slate-100 border-r-2 border-slate-300 shadow-[3px_0_6px_-2px_rgba(0,0,0,0.10)] w-[170px] min-w-[170px] max-w-[170px]">
                    Jabatan
                  </th>
                  <th className="py-2.5 px-2 font-bold border-r border-slate-200 w-20 text-center">
                    Dept
                  </th>
                  <th className="py-2.5 px-2 font-bold border-r border-slate-200 w-16 text-center">
                    POR
                  </th>
                  <th className="py-2.5 px-2 font-bold border-r border-slate-200 w-24">
                    Kimper
                  </th>

                  {/* Day header columns */}
                  {days.map((d) => (
                    <th
                      key={d.date}
                      className={`py-2 px-1 text-center font-bold border-r border-slate-200 w-9 min-w-[36px] ${
                        d.isWeekend ? 'bg-rose-50/70 text-rose-700' : 'bg-slate-100 text-slate-700'
                      }`}
                      title={`${d.dayName}, ${d.date} ${monthName} ${year}`}
                    >
                      <div className="text-[11px] font-extrabold">{d.date}</div>
                      <div className="text-[9px] font-normal uppercase">{d.dayShort}</div>
                    </th>
                  ))}

                  {/* Summary recap counts */}
                  <th className="py-2.5 px-2 text-center font-bold bg-emerald-50 text-emerald-800 border-r border-slate-200 w-10" title="Day Shift">
                    D
                  </th>
                  <th className="py-2.5 px-2 text-center font-bold bg-blue-50 text-blue-800 border-r border-slate-200 w-10" title="Night Shift">
                    N
                  </th>
                  <th className="py-2.5 px-2 text-center font-bold bg-slate-100 text-slate-700 border-r border-slate-200 w-10" title="Off / Libur">
                    OFF
                  </th>
                  <th className="py-2.5 px-2 text-center font-bold bg-amber-50 text-amber-800 border-r border-slate-200 w-10" title="Cuti">
                    CT
                  </th>
                  <th className="py-2.5 px-2 text-center font-bold bg-purple-50 text-purple-800 border-r border-slate-200 w-10" title="Perjalanan Pasca Cuti (Kategori Cuti)">
                    P
                  </th>
                  <th className="py-2.5 px-2 text-center font-bold bg-indigo-50 text-indigo-900 w-14" title="Total Hari Kerja">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={days.length + 13} className="py-12 text-center text-slate-500">
                      Tidak ada karyawan yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp, idx) => {
                    const recap = calculateEmployeeRecap(emp, roster, year, monthIndex);
                    const empRoster = roster[emp.id] || {};
                    const canEditThisEmp = canEditEmployeeRoster(currentUser, emp);

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/90 transition-colors group/row">
                        {/* No */}
                        <td className="py-2 px-2 text-center sticky left-0 z-10 bg-white group-hover/row:bg-slate-50 border-r border-slate-200 font-mono text-slate-500 w-[44px] min-w-[44px] max-w-[44px]">
                          {idx + 1}
                        </td>

                        {/* NIK */}
                        <td className="py-2 px-2.5 sticky left-[44px] z-10 bg-white group-hover/row:bg-slate-50 border-r border-slate-200 font-mono font-medium text-slate-700 w-[80px] min-w-[80px] max-w-[80px]">
                          {emp.nip}
                        </td>

                        {/* Employee Name */}
                        <td className="py-2 px-3 sticky left-[124px] z-10 bg-white group-hover/row:bg-slate-50 border-r border-slate-200 w-[188px] min-w-[188px] max-w-[188px]">
                          <button
                            type="button"
                            onClick={() => onOpenIndividualModal(emp)}
                            className="text-left group cursor-pointer w-full block"
                            title="Klik untuk memantau jadwal individu ini"
                          >
                            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between gap-1">
                              <span className="truncate" title={emp.name}>{emp.name}</span>
                              <div className="flex items-center gap-1 shrink-0">
                                {!canEditThisEmp && (
                                  <span title={`Hanya Lihat: Anda tidak memiliki hak edit pada Dept. ${emp.department}`} className="text-amber-500">
                                    <Lock className="w-3 h-3" />
                                  </span>
                                )}
                                <Eye className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </button>
                        </td>

                        {/* Jabatan (Frozen column to prevent cut-off) */}
                        <td className="py-2 px-3 sticky left-[312px] z-10 bg-white group-hover/row:bg-slate-50 border-r-2 border-slate-300 shadow-[3px_0_6px_-2px_rgba(0,0,0,0.10)] w-[170px] min-w-[170px] max-w-[170px] text-slate-700">
                          <span className="font-medium text-xs block truncate whitespace-nowrap" title={emp.position}>
                            {emp.position}
                          </span>
                        </td>

                        {/* Dept Badge */}
                        <td className="py-2 px-2 text-center border-r border-slate-200">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            canEditThisEmp
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {emp.department}
                          </span>
                        </td>

                        {/* POR */}
                        <td className="py-2 px-2 text-center border-r border-slate-200 font-mono text-[11px] text-slate-600">
                          {emp.por || '-'}
                        </td>

                        {/* Kimper */}
                        <td className="py-2 px-2 border-r border-slate-200">
                          {emp.kimper && emp.kimper.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-[110px]">
                              {emp.kimper.map((kCode) => {
                                const kDef = KIMPER_MAP[kCode];
                                return (
                                  <span
                                    key={kCode}
                                    className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${
                                      kDef?.color || 'bg-amber-50 text-amber-800 border-amber-300'
                                    }`}
                                    title={kDef?.name || kCode}
                                  >
                                    {kCode}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">-</span>
                          )}
                        </td>

                        {/* Day shift cells */}
                        {days.map((d) => {
                          const entry = empRoster[d.dateStr];
                          const shiftCode = entry?.shift;
                          const shiftDef = shiftCode ? SHIFTS[shiftCode] : undefined;
                          const isModified = Boolean(entry?.updatedBy);
                          const auditTooltip = shiftDef
                            ? `${emp.name}: ${d.dateStr} [${shiftCode} - ${shiftDef.name}]${
                                entry?.updatedBy
                                  ? `\n• Diubah oleh: ${entry.updatedBy}${
                                      entry.updatedByUsername ? ` (@${entry.updatedByUsername})` : ''
                                    }\n• Waktu: ${entry.updatedAt || '-'}${
                                      entry.previousShift ? `\n• Perubahan: ${entry.previousShift} → ${shiftCode}` : ''
                                    }${entry.reason ? `\n• Alasan: ${entry.reason}` : ''}${
                                      entry.source ? `\n• Sumber: ${entry.source}` : ''
                                    }`
                                  : ''
                              }`
                            : `${emp.name}: ${d.dateStr} (Kosong / Belum Terjadwal)`;

                          return (
                            <td
                              key={d.dateStr}
                              className={`p-0.5 text-center border-r border-slate-200 ${
                                d.isWeekend ? 'bg-slate-50/40' : ''
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  if (!canEditThisEmp) {
                                    showNotification(
                                      `Akses Terbatas: Anda login sebagai ${userRoleInfo.title}. Anda hanya berwenang mengedit roster untuk departemen ${userRoleInfo.allowedDepts.join(', ')}. Personel ${emp.name} berada di bawah Dept. ${emp.department}.`
                                    );
                                    return;
                                  }
                                  setCellPopover({
                                    employeeId: emp.id,
                                    employeeName: emp.name,
                                    employeeNip: emp.nip,
                                    dateStr: d.dateStr,
                                    currentShift: shiftCode || '',
                                    entry: entry,
                                  });
                                  setChangeReason(entry?.reason || '');
                                }}
                                className={`w-8 h-7 rounded text-[11px] font-bold flex items-center justify-center mx-auto transition-transform border relative ${
                                  canEditThisEmp
                                    ? 'hover:scale-110 cursor-pointer'
                                    : 'cursor-not-allowed opacity-90'
                                } ${
                                  shiftDef
                                    ? shiftDef.color
                                    : canEditThisEmp
                                    ? 'border-dashed border-slate-200 bg-white text-slate-300 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 font-normal'
                                    : 'border-slate-100 bg-slate-50 text-slate-300 font-normal'
                                }`}
                                title={
                                  canEditThisEmp
                                    ? auditTooltip
                                    : `${auditTooltip}\n\n🔒 [Hanya Lihat: Anda tidak memiliki hak edit pada Dept. ${emp.department}]`
                                }
                              >
                                {shiftCode || '-'}
                                {isModified && (
                                  <span
                                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-purple-600 ring-1 ring-white"
                                    title={`Diubah oleh: ${entry.updatedBy}${
                                      entry.updatedByUsername ? ` (@${entry.updatedByUsername})` : ''
                                    }`}
                                  />
                                )}
                              </button>
                            </td>
                          );
                        })}

                        {/* Summary Columns */}
                        <td className="py-2 px-1 text-center font-bold text-emerald-800 bg-emerald-50/40 border-r border-slate-200">
                          {recap.dCount}
                        </td>
                        <td className="py-2 px-1 text-center font-bold text-blue-800 bg-blue-50/40 border-r border-slate-200">
                          {recap.nCount}
                        </td>
                        <td className="py-2 px-1 text-center font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                          {recap.offCount}
                        </td>
                        <td className="py-2 px-1 text-center font-bold text-amber-800 bg-amber-50/40 border-r border-slate-200">
                          {recap.ctCount}
                        </td>
                        <td className="py-2 px-1 text-center font-bold text-purple-800 bg-purple-50/40 border-r border-slate-200">
                          {recap.pCount}
                        </td>
                        <td className="py-2 px-1 text-center font-extrabold text-indigo-900 bg-indigo-50/40">
                          {recap.totalWorkDays}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RINGKASAN ALOKASI SHIFT BULANAN */}
      {activeTab === 'recap' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Ringkasan Alokasi Shift Bulanan Personel
              </h3>
              <p className="text-xs text-slate-500">
                Periode: {monthName} {year} • Alokasi total jadwal Day Shift (D), Night Shift (N), Off, Cuti (CT), Perjalanan Pasca Cuti (P), dan Total Shift Terjadwal (D + N).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 font-bold w-12 text-center">No</th>
                  <th className="py-3 px-3 font-bold">NIK</th>
                  <th className="py-3 px-3 font-bold">Nama Karyawan</th>
                  <th className="py-3 px-2 font-bold text-center">Dept</th>
                  <th className="py-3 px-3 font-bold">Jabatan</th>
                  <th className="py-3 px-2 font-bold text-center">POR</th>
                  <th className="py-3 px-2 font-bold text-center bg-emerald-50 text-emerald-900">Day (D)</th>
                  <th className="py-3 px-2 font-bold text-center bg-blue-50 text-blue-900">Night (N)</th>
                  <th className="py-3 px-2 font-bold text-center bg-slate-50 text-slate-800">Off</th>
                  <th className="py-3 px-2 font-bold text-center bg-amber-50 text-amber-900">Cuti (CT)</th>
                  <th className="py-3 px-2 font-bold text-center bg-purple-50 text-purple-900">Perjalanan (P)</th>
                  <th className="py-3 px-3 font-bold text-center bg-indigo-50 text-indigo-900">Total Shift (D+N)</th>
                  <th className="py-3 px-3 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp, idx) => {
                  const recap = calculateEmployeeRecap(emp, roster, year, monthIndex);
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{emp.nip}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{emp.name}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {emp.department}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{emp.position}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-[11px] text-slate-600">
                        {emp.por || '-'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-emerald-800 bg-emerald-50/30">
                        {recap.dCount}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-blue-800 bg-blue-50/30">
                        {recap.nCount}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-700 bg-slate-50/30">
                        {recap.offCount}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-amber-800 bg-amber-50/30">
                        {recap.ctCount}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-purple-800 bg-purple-50/30">
                        {recap.pCount}
                      </td>
                      <td className="py-2.5 px-3 text-center font-extrabold text-indigo-900 bg-indigo-50/40">
                        {recap.totalWorkDays} Shift
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onOpenIndividualModal(emp)}
                          className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 rounded border border-indigo-200 transition-colors"
                        >
                          Pantau
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MONITORING STATUS & MANPOWER KIMPER (DEPT SERVICE & OPERASIONAL) */}
      {activeTab === 'kimper' && (
        <KimperMonitorView
          year={year}
          monthIndex={monthIndex}
          employees={employees}
          roster={roster}
          onUpdateShift={onUpdateShift}
          onOpenIndividualModal={onOpenIndividualModal}
          initialDepartment={selectedDept === 'Warehouse' ? 'Warehouse' : 'Service'}
        />
      )}

      {/* TAB 5: RIWAYAT & LOG AUDIT AKTIVITAS ABSENSI */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <History className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Log Aktivitas & Audit Perubahan Absensi
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pencatatan transparan dan lengkap mengenai siapa username yang mengubah jadwal absensi, alasan, waktu, dan riwayat nilai.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAuditModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-center"
            >
              <Eye className="w-4 h-4" />
              <span>Buka Tampilan Penuh / Ekspor CSV</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs italic">
                Belum ada catatan aktivitas perubahan.
              </div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="py-4 first:pt-1 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                      <div className="text-xs text-slate-900 leading-snug">
                        <span className="font-bold text-slate-900">{log.actorName}</span>
                        {log.actorUsername && (
                          <span className="text-[11px] font-mono text-purple-700 font-bold ml-1">
                            (@{log.actorUsername})
                          </span>
                        )}{' '}
                        <span className="text-slate-700 font-medium">{log.actionTitle}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap shrink-0">
                        {log.timestamp}
                      </span>
                    </div>

                    <div className="mt-2.5 space-y-1.5 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-200/70">
                      {log.oldValue && log.newValue && (
                        <div className="grid grid-cols-[85px_1fr] gap-1 text-[11px]">
                          <span className="text-slate-400 font-medium">Perubahan</span>
                          <span className="font-bold text-slate-800">
                            Nilai Lama : <span className="font-mono text-slate-600">{log.oldValue}</span>{' '}
                            <span className="text-slate-400 font-normal">→</span>{' '}
                            Nilai Baru : <span className="font-mono text-indigo-600">{log.newValue}</span>
                          </span>
                        </div>
                      )}
                      {log.reason && (
                        <div className="grid grid-cols-[85px_1fr] gap-1 text-[11px]">
                          <span className="text-slate-400 font-medium">Alasan</span>
                          <span className="text-slate-800 italic font-medium">{log.reason}</span>
                        </div>
                      )}
                      {log.source && (
                        <div className="grid grid-cols-[85px_1fr] gap-1 text-[11px]">
                          <span className="text-slate-400 font-medium">Sumber Akses</span>
                          <span className="font-mono text-[10px] text-slate-500">{log.source}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Floating Cell Shift Picker Popover */}
      {cellPopover && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 max-w-md w-full animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Ubah Shift Roster</h4>
                <p className="text-xs text-slate-500 font-medium">
                  {cellPopover.employeeName} {cellPopover.employeeNip ? `(${cellPopover.employeeNip})` : ''} • {cellPopover.dateStr}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCellPopover(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Riwayat & Informasi Pengubah Terakhir (Audit Info) */}
            {cellPopover.entry?.updatedBy ? (
              <div className="mb-3.5 p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-purple-900 text-xs">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  <span>Informasi Pengubah Terakhir:</span>
                </div>
                <div className="text-[11px] space-y-1 text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 w-24 shrink-0">Nama Pengubah:</span>
                    <strong className="text-slate-900">{cellPopover.entry.updatedBy}</strong>
                    {cellPopover.entry.updatedByUsername && (
                      <span className="font-mono text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded font-bold">
                        @{cellPopover.entry.updatedByUsername}
                      </span>
                    )}
                  </div>
                  {cellPopover.entry.updatedAt && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 w-24 shrink-0">Waktu Diubah:</span>
                      <span className="font-mono text-slate-700">{cellPopover.entry.updatedAt}</span>
                    </div>
                  )}
                  {cellPopover.entry.previousShift && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 w-24 shrink-0">Riwayat Nilai:</span>
                      <span className="font-semibold text-slate-800">
                        {cellPopover.entry.previousShift} <span className="text-slate-400">→</span>{' '}
                        <span className="text-purple-700 font-bold">{cellPopover.currentShift}</span>
                      </span>
                    </div>
                  )}
                  {cellPopover.entry.reason && (
                    <div className="flex items-start gap-1.5">
                      <span className="text-slate-500 w-24 shrink-0">Alasan:</span>
                      <span className="italic text-slate-800 font-medium">{cellPopover.entry.reason}</span>
                    </div>
                  )}
                  {cellPopover.entry.source && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 w-24 shrink-0">Sumber:</span>
                      <span className="font-mono text-[10px] text-slate-500">{cellPopover.entry.source}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Status: Mengikuti pola perputaran roster standar (belum pernah diubah manual).</span>
              </div>
            )}

            {/* Input Alasan Perubahan */}
            <div className="mb-3.5">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Alasan Perubahan (Tercatat dalam Log Audit):
              </label>
              <input
                type="text"
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Contoh: Penyesuaian kebutuhan operasional..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {[
                  'Penyesuaian operasional',
                  'Tukar shift antar rekan',
                  'Kebutuhan mendesak lapangan',
                  'Perintah atasan',
                ].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setChangeReason(sug)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs font-bold text-slate-700 mb-2">
              Pilih shift baru untuk diterapkan:
            </p>

            <div className="grid grid-cols-1 gap-2">
              {(['D', 'N', 'OFF', 'CT', 'P'] as ShiftCode[]).map((code) => {
                const item = SHIFTS[code];
                if (!item) return null;
                const isSelected = cellPopover.currentShift === code;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      onUpdateShift(
                        cellPopover.employeeId,
                        cellPopover.dateStr,
                        code,
                        changeReason || undefined
                      );
                      setCellPopover(null);
                      const actorInfo = currentUser
                        ? `${currentUser.name} (@${currentUser.username || 'admin'})`
                        : 'Admin';
                      showNotification(
                        `Shift ${cellPopover.employeeName} diubah ke ${code} oleh ${actorInfo}`
                      );
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500 ring-offset-1'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs border ${item.color}`}
                      >
                        {code}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-500">{item.timeRange}</div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </button>
                );
              })}

              {/* Tombol Kosongkan Shift */}
              {onClearShift && (
                <button
                  type="button"
                  onClick={() => {
                    onClearShift(
                      cellPopover.employeeId,
                      cellPopover.dateStr,
                      changeReason || undefined
                    );
                    setCellPopover(null);
                    showNotification(
                      `Jadwal shift ${cellPopover.employeeName} pada ${cellPopover.dateStr} berhasil dikosongkan (-)`
                    );
                  }}
                  className="w-full p-2.5 rounded-xl border border-dashed border-rose-300 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer mt-1"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Kosongkan Tanggal Ini (-)</span>
                </button>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setCellPopover(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-view Modal for Audit Logs */}
      {isAuditModalOpen && (
        <AuditLogModal
          logs={auditLogs}
          onClose={() => setIsAuditModalOpen(false)}
        />
      )}
    </div>
  );
};
