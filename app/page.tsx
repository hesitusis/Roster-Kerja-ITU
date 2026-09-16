'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { Employee, LeaveRequest, RosterData, ShiftCode, AuditLogItem } from '@/lib/types';
import {
  getStoredEmployees,
  saveStoredEmployees,
  getStoredRoster,
  saveStoredRoster,
  saveStoredRosterMultiMonth,
  getStoredLeaveRequests,
  saveStoredLeaveRequests,
  getStoredCurrentUser,
  saveStoredCurrentUser,
  getStoredLastSynced,
  saveStoredLastSynced,
  getStoredAuditLogs,
  addStoredAuditLog,
  resetAllStorage,
  getStoredWebhookUrl,
  saveStoredWebhookUrl,
  getStoredAutoSync,
  saveStoredAutoSync,
} from '@/lib/storage';
import {
  pushShiftToGoogleSheets,
  pushBatchShiftsToGoogleSheets,
} from '@/lib/google-sheets-script';
import { createShiftChangeAuditLog, formatAuditDate } from '@/lib/audit-logs';
import { Navbar } from '@/components/Navbar';
import { LoginPage } from '@/components/LoginPage';
import { AdminDashboard } from '@/components/AdminDashboard';
import { StaffDashboard } from '@/components/StaffDashboard';
import { IndividualMonitorModal } from '@/components/IndividualMonitorModal';
import { AddEmployeeModal } from '@/components/AddEmployeeModal';
import { ShiftPatternModal } from '@/components/ShiftPatternModal';
import { ExcelRosterUploadModal } from '@/components/ExcelRosterUploadModal';
import { ParsedEmployeeRosterItem } from '@/lib/excel-import';
import { MONTH_NAMES_ID } from '@/lib/constants';
import { isUserAdmin, canEditEmployeeRoster, getDefaultDeptForUser } from '@/lib/role-utils';
import { CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';

const emptySubscribe = () => () => {};

export default function HomePage() {
  // Safe client-side mount detection using React 18/19 useSyncExternalStore to prevent SSR hydration mismatch
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Current period (defaults to September 2026, or current date)
  const [year, setYear] = useState<number>(2026);
  const [monthIndex, setMonthIndex] = useState<number>(8); // 8 = September (0-indexed)

  // Data states initialized lazily from storage
  const [employees, setEmployees] = useState<Employee[]>(() => getStoredEmployees());
  const [roster, setRoster] = useState<RosterData>(() => getStoredRoster(year, monthIndex));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => getStoredLeaveRequests());
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => getStoredCurrentUser());
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(() => getStoredLastSynced());
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => getStoredAuditLogs());

  // Google Apps Script Webhook State
  const [webhookUrl, setWebhookUrl] = useState<string>(() => getStoredWebhookUrl());
  const [autoSync, setAutoSync] = useState<boolean>(() => getStoredAutoSync());
  const [isBatchPushing, setIsBatchPushing] = useState(false);
  const [syncToast, setSyncToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Modals
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isPatternModalOpen, setIsPatternModalOpen] = useState(false);
  const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false);
  const [individualModalEmployee, setIndividualModalEmployee] = useState<Employee | null>(null);

  // Initial silent background sync from Google Sheets on mount to ensure all months (including October) are up-to-date
  React.useEffect(() => {
    fetch('/api/sync-spreadsheet')
      .then((res) => res.json())
      .then((data) => {
        if (data.employees && Array.isArray(data.employees) && data.employees.length > 0) {
          setEmployees(data.employees);
          saveStoredEmployees(data.employees);
          if (data.roster) {
            saveStoredRosterMultiMonth(data.roster);
            const currentMonthRoster = getStoredRoster(year, monthIndex);
            setRoster(currentMonthRoster);
          }
          if (data.syncedAt) {
            setLastSynced(data.syncedAt);
            saveStoredLastSynced(data.syncedAt);
          }
        }
      })
      .catch((err) => {
        console.warn('Initial spreadsheet sync background check failed, continuing with stored/bundled data:', err);
      });
  }, [year, monthIndex]);

  // Handler: Change period
  const handlePeriodChange = (newYear: number, newMonthIndex: number) => {
    setYear(newYear);
    setMonthIndex(newMonthIndex);
    const newRoster = getStoredRoster(newYear, newMonthIndex);
    setRoster(newRoster);
  };

  // Handler: Sync live with Google Spreadsheet
  const handleSyncSpreadsheet = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync-spreadsheet');
      const data = await res.json();
      if (data.employees && Array.isArray(data.employees) && data.employees.length > 0) {
        setEmployees(data.employees);
        saveStoredEmployees(data.employees);
        if (data.roster) {
          saveStoredRosterMultiMonth(data.roster);
          const currentMonthRoster = getStoredRoster(year, monthIndex);
          setRoster(currentMonthRoster);
        }
        const now = new Date().toISOString();
        setLastSynced(now);
        saveStoredLastSynced(now);
        triggerSyncToast('✓ Data Roster semua bulan (termasuk Oktober) berhasil disinkronkan dari Google Spreadsheet!', 'success');
      }
    } catch (err) {
      console.error('Failed to sync with Google Spreadsheet:', err);
      triggerSyncToast('⚠ Gagal sinkronisasi data dari Google Spreadsheet', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handler: Login
  const handleLogin = (user: Employee) => {
    setCurrentUser(user);
    saveStoredCurrentUser(user);
  };

  // Handler: Logout
  const handleLogout = () => {
    setCurrentUser(null);
    saveStoredCurrentUser(null);
  };

  // Handler: Switch user
  const handleSwitchUser = (user: Employee) => {
    setCurrentUser(user);
    saveStoredCurrentUser(user);
  };

  // Handler: Reset demo data
  const handleResetData = () => {
    resetAllStorage(year, monthIndex);
    const emps = getStoredEmployees();
    const rost = getStoredRoster(year, monthIndex);
    const leaves = getStoredLeaveRequests();
    const logs = getStoredAuditLogs();
    setEmployees(emps);
    setRoster(rost);
    setLeaveRequests(leaves);
    setAuditLogs(logs);
  };

  // Helper to show sync toast
  const triggerSyncToast = (msg: string, type: 'success' | 'error' | 'info') => {
    setSyncToast({ message: msg, type });
    setTimeout(() => {
      setSyncToast((cur) => (cur?.message === msg ? null : cur));
    }, 4500);
  };

  // Handler: Save Webhook Config
  const handleSaveWebhookConfig = (url: string, auto: boolean) => {
    setWebhookUrl(url);
    setAutoSync(auto);
    saveStoredWebhookUrl(url);
    saveStoredAutoSync(auto);
  };

  // Handler: Push all shifts of current month in batch to Google Sheets
  const handlePushBatchCurrentMonth = async () => {
    if (!webhookUrl || !webhookUrl.startsWith('http')) {
      triggerSyncToast('URL Webhook belum diatur. Silakan klik "Setup Webhook Sheets".', 'error');
      return;
    }

    const updates: Array<{ nip?: string; name?: string; dateStr: string; shift: string }> = [];
    employees.forEach((emp) => {
      const empRoster = roster[emp.id] || {};
      Object.entries(empRoster).forEach(([dStr, entry]) => {
        if (entry?.shift) {
          updates.push({
            nip: emp.nip,
            name: emp.name,
            dateStr: dStr,
            shift: entry.shift,
          });
        }
      });
    });

    if (updates.length === 0) {
      triggerSyncToast('Belum ada jadwal shift pada bulan ini untuk dikirim.', 'info');
      return;
    }

    setIsBatchPushing(true);
    try {
      const res = await pushBatchShiftsToGoogleSheets({
        webhookUrl,
        updates,
      });
      if (res.success) {
        triggerSyncToast(`✓ ${res.message || `${updates.length} shift berhasil disimpan di spreadsheet!`}`, 'success');
      } else {
        triggerSyncToast(`⚠ Gagal kirim batch: ${res.message || 'Periksa webhook URL'}`, 'error');
      }
    } catch {
      triggerSyncToast('Gagal menghubungi webhook Google Apps Script', 'error');
    } finally {
      setIsBatchPushing(false);
    }
  };

  // Handler: Update Shift for an Employee on a specific date with audit logging
  const handleUpdateShift = (
    employeeId: string,
    dateStr: string,
    shift: ShiftCode,
    reason?: string
  ) => {
    const targetEmp = employees.find((e) => e.id === employeeId);
    const oldShift = roster[employeeId]?.[dateStr]?.shift || '-';
    const nowFormatted = formatAuditDate(new Date());
    const actorName = currentUser?.name || 'Admin';
    const actorUsername = currentUser?.username || 'admin';
    const appliedReason = reason?.trim() || 'Penyesuaian kebutuhan operasional';

    setRoster((prev) => {
      const updated = { ...prev };
      if (!updated[employeeId]) {
        updated[employeeId] = {};
      } else {
        updated[employeeId] = { ...updated[employeeId] };
      }
      updated[employeeId][dateStr] = {
        shift,
        updatedAt: nowFormatted,
        updatedBy: actorName,
        updatedByUsername: actorUsername,
        previousShift: oldShift,
        reason: appliedReason,
        source: 'Web (Desktop) - 192.168.1.10',
      };
      saveStoredRoster(year, monthIndex, updated);
      return updated;
    });

    // Push update to Google Sheets Webhook if autoSync is active
    if (autoSync) {
      pushShiftToGoogleSheets({
        webhookUrl: webhookUrl && webhookUrl.startsWith('http') ? webhookUrl : undefined,
        employeeNip: targetEmp?.nip,
        employeeName: targetEmp?.name,
        dateStr,
        shift,
        reason: appliedReason,
      }).then((res) => {
        if (res.success) {
          triggerSyncToast(`✓ Tersimpan ke Spreadsheet: ${targetEmp?.name || ''} (${dateStr} → ${shift})`, 'success');
        } else if (!res.notConfigured) {
          triggerSyncToast(`⚠ Gagal simpan ke Sheets: ${res.message || 'Periksa Webhook'}`, 'error');
        }
      });
    }

    // Record audit trail if shift value changed
    if (targetEmp && oldShift !== shift) {
      const newLog = createShiftChangeAuditLog({
        actorName,
        actorUsername,
        targetName: targetEmp.name,
        targetNip: targetEmp.nip,
        targetDate: dateStr,
        oldShift: oldShift as ShiftCode,
        newShift: shift,
        reason: appliedReason,
        source: 'Web (Desktop) - 192.168.1.10',
      });
      const updatedLogs = addStoredAuditLog(newLog);
      setAuditLogs(updatedLogs);
    }
  };

  // Handler: Clear / remove a shift (jadikan kosong)
  const handleClearShift = (employeeId: string, dateStr: string, reason?: string) => {
    const targetEmp = employees.find((e) => e.id === employeeId);
    const oldShift = roster[employeeId]?.[dateStr]?.shift;
    const actorName = currentUser?.name || 'Admin';
    const actorUsername = currentUser?.username || 'admin';
    const appliedReason = reason?.trim() || 'Jadwal shift dikosongkan';

    setRoster((prev) => {
      const updated = { ...prev };
      if (updated[employeeId]) {
        updated[employeeId] = { ...updated[employeeId] };
        delete updated[employeeId][dateStr];
      }
      saveStoredRoster(year, monthIndex, updated);
      return updated;
    });

    // Push clear update to Google Sheets Webhook if autoSync is active
    if (autoSync) {
      pushShiftToGoogleSheets({
        webhookUrl: webhookUrl && webhookUrl.startsWith('http') ? webhookUrl : undefined,
        employeeNip: targetEmp?.nip,
        employeeName: targetEmp?.name,
        dateStr,
        shift: '',
        reason: appliedReason,
      }).then((res) => {
        if (res.success) {
          triggerSyncToast(`✓ Tanggal ${dateStr} dikosongkan di Spreadsheet untuk ${targetEmp?.name || ''}`, 'success');
        }
      });
    }

    if (targetEmp && oldShift) {
      const newLog = createShiftChangeAuditLog({
        actorName,
        actorUsername,
        targetName: targetEmp.name,
        targetNip: targetEmp.nip,
        targetDate: dateStr,
        oldShift,
        newShift: '-' as ShiftCode,
        reason: appliedReason,
        source: 'Web (Desktop) - 192.168.1.10',
      });
      const updatedLogs = addStoredAuditLog(newLog);
      setAuditLogs(updatedLogs);
    }
  };

  // Handler: Add new Employee
  const handleAddEmployee = (newEmp: Employee) => {
    const updated = [...employees, newEmp];
    setEmployees(updated);
    saveStoredEmployees(updated);

    // Default roster starts clean
    setRoster((prev) => {
      const updatedRoster = { ...prev };
      updatedRoster[newEmp.id] = {};
      saveStoredRoster(year, monthIndex, updatedRoster);
      return updatedRoster;
    });

    // Record audit log for adding employee
    const addLog: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'ADD_EMPLOYEE',
      actorName: currentUser?.name || 'Admin',
      actorUsername: currentUser?.username || 'admin',
      actorRole: 'admin',
      actionTitle: `menambahkan personel baru ${newEmp.name}`,
      targetName: newEmp.name,
      targetNip: newEmp.nip,
      details: {
        personelList: [{ name: newEmp.name, nip: newEmp.nip }],
      },
      source: 'Admin Panel - 10.10.12.25',
      timestamp: formatAuditDate(new Date()),
      isoTimestamp: new Date().toISOString(),
    };
    const updatedLogs = addStoredAuditLog(addLog);
    setAuditLogs(updatedLogs);
  };

  // Handler: Batch apply pattern
  const handleApplyPattern = (updatedRoster: RosterData) => {
    setRoster(updatedRoster);
    saveStoredRoster(year, monthIndex, updatedRoster);
  };

  // Handler: Apply Roster Changes from Uploaded Excel
  const handleApplyRosterChangesFromExcel = ({
    selectedItems,
    targetYear,
    targetMonthIndex,
    changeReason,
    addNewEmployees,
  }: {
    selectedItems: ParsedEmployeeRosterItem[];
    targetYear: number;
    targetMonthIndex: number;
    changeReason: string;
    addNewEmployees: boolean;
  }) => {
    // 1. Handle New Employees if selected & requested
    let updatedEmployees = [...employees];
    const newEmployeesToAdd: Employee[] = [];

    if (addNewEmployees) {
      selectedItems.forEach((item) => {
        if (item.isNewEmployee) {
          const exists = updatedEmployees.some(
            (e) => (e.nip && e.nip.toLowerCase() === item.employee.nip.toLowerCase()) || e.id === item.employee.id
          );
          if (!exists) {
            newEmployeesToAdd.push(item.employee);
            updatedEmployees.push(item.employee);
          }
        }
      });

      if (newEmployeesToAdd.length > 0) {
        setEmployees(updatedEmployees);
        saveStoredEmployees(updatedEmployees);
      }
    }

    // 2. Load existing roster for the target month
    const existingTargetRoster = getStoredRoster(targetYear, targetMonthIndex);
    const updatedRoster: RosterData = { ...existingTargetRoster };

    let totalUpdatedShifts = 0;
    const shiftChangesAuditList: { name: string; nip: string; totalChanges: number }[] = [];

    selectedItems.forEach((item) => {
      const empId = item.employee.id;
      if (!updatedRoster[empId]) {
        updatedRoster[empId] = {};
      }

      let changesForThisEmp = 0;
      Object.entries(item.shifts).forEach(([dateStr, shiftCode]) => {
        const prevShift = updatedRoster[empId][dateStr]?.shift;
        if (prevShift !== shiftCode) {
          changesForThisEmp++;
        }
        updatedRoster[empId][dateStr] = {
          shift: shiftCode,
          updatedAt: new Date().toISOString(),
          updatedBy: currentUser?.name || 'Administrator',
          updatedByUsername: currentUser?.username || 'admin',
          previousShift: prevShift,
          reason: changeReason || 'Upload Excel Roster',
          source: 'Excel File Import',
        };
        totalUpdatedShifts++;
      });

      if (changesForThisEmp > 0 || item.isNewEmployee) {
        shiftChangesAuditList.push({
          name: item.employee.name,
          nip: item.employee.nip,
          totalChanges: changesForThisEmp,
        });
      }
    });

    // 3. Save target roster
    saveStoredRoster(targetYear, targetMonthIndex, updatedRoster);

    // If currently viewing the target month, update active roster state
    if (year === targetYear && monthIndex === targetMonthIndex) {
      setRoster(updatedRoster);
    } else {
      // Switch view to the target month so user sees the newly imported data immediately
      setYear(targetYear);
      setMonthIndex(targetMonthIndex);
      setRoster(updatedRoster);
    }

    // 4. Create Audit Log
    const targetMonthName = MONTH_NAMES_ID[targetMonthIndex];
    const newLogItem: AuditLogItem = {
      id: `audit-excel-${Date.now()}`,
      type: 'BATCH_CHANGE',
      actorName: currentUser?.name || 'Administrator',
      actorUsername: currentUser?.username || 'admin',
      actorRole: 'admin',
      actionTitle: `mengupload & memperbarui roster ${selectedItems.length} personel dari file Excel`,
      targetDate: `${targetMonthName} ${targetYear}`,
      newValue: `${totalUpdatedShifts} shift tersimpan`,
      reason: changeReason || 'Upload & seleksi file Excel',
      source: 'Upload Excel Roster',
      timestamp: formatAuditDate(new Date()),
      isoTimestamp: new Date().toISOString(),
      details: {
        personelCount: selectedItems.length,
        newEmployeesAdded: newEmployeesToAdd.length,
        personelList: selectedItems.map((i) => ({ name: i.employee.name, nip: i.employee.nip })),
      },
    };

    const updatedLogs = addStoredAuditLog(newLogItem);
    setAuditLogs(updatedLogs);

    // 5. Close modal & show success toast
    setIsExcelUploadOpen(false);
    setSyncToast({
      type: 'success',
      message: `✓ Berhasil menerapkan roster untuk ${selectedItems.length} karyawan terpilih (${targetMonthName} ${targetYear})!`,
    });

    // Auto-dismiss toast after 6 seconds
    setTimeout(() => {
      setSyncToast(null);
    }, 6000);
  };

  // Handler: Update Employee Kimpers
  const handleUpdateEmployeeKimper = (employeeId: string, kimpers: string[]) => {
    const updated = employees.map((emp) =>
      emp.id === employeeId ? { ...emp, kimper: kimpers } : emp
    );
    setEmployees(updated);
    saveStoredEmployees(updated);
    if (individualModalEmployee && individualModalEmployee.id === employeeId) {
      setIndividualModalEmployee({ ...individualModalEmployee, kimper: kimpers });
    }
  };

  // Handler: Submit leave request from staff
  const handleSubmitLeaveRequest = (
    newReq: Omit<LeaveRequest, 'id' | 'submittedAt' | 'status'>
  ) => {
    const fullReq: LeaveRequest = {
      ...newReq,
      id: `REQ-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'PENDING',
    };
    const updated = [fullReq, ...leaveRequests];
    setLeaveRequests(updated);
    saveStoredLeaveRequests(updated);
  };

  // Handler: Admin approve / reject leave request
  const handleUpdateLeaveRequest = (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    const targetReq = leaveRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    const updatedLeaves = leaveRequests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status,
            reviewedBy: currentUser?.name || 'Admin',
            reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          }
        : r
    );
    setLeaveRequests(updatedLeaves);
    saveStoredLeaveRequests(updatedLeaves);

    // If approved, update roster automatically!
    if (status === 'APPROVED') {
      const shiftType: ShiftCode =
        targetReq.type === 'CUTI' ? 'CT' : targetReq.type === 'PERJALANAN' || targetReq.type === 'P' ? 'P' : 'CT';
      const startDate = new Date(targetReq.startDate);
      const endDate = new Date(targetReq.endDate || targetReq.startDate);
      const nowFormatted = formatAuditDate(new Date());
      const actorName = currentUser?.name || 'Admin';
      const actorUsername = currentUser?.username || 'admin';

      setRoster((prev) => {
        const updated = { ...prev };
        if (!targetReq.employeeId) return prev;
        if (!updated[targetReq.employeeId]) {
          updated[targetReq.employeeId] = {};
        } else {
          updated[targetReq.employeeId] = { ...updated[targetReq.employeeId] };
        }

        const curr = new Date(startDate);
        while (curr <= endDate) {
          const dateStr = curr.toISOString().split('T')[0];
          const oldShift = prev[targetReq.employeeId]?.[dateStr]?.shift || 'D';
          updated[targetReq.employeeId][dateStr] = {
            shift: shiftType,
            note: targetReq.reason,
            updatedBy: actorName,
            updatedByUsername: actorUsername,
            updatedAt: nowFormatted,
            previousShift: oldShift,
            reason: targetReq.reason || 'Pengajuan Cuti / Izin Disetujui',
            source: 'Web (Desktop) - 192.168.1.10',
          };
          curr.setDate(curr.getDate() + 1);
        }

        saveStoredRoster(year, monthIndex, updated);
        return updated;
      });

      // Record audit log
      const approvalLog: AuditLogItem = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'LEAVE_APPROVAL',
        actorName,
        actorUsername,
        actorRole: 'admin',
        actionTitle: `menyetujui cuti/izin ${targetReq.employeeName}`,
        targetName: targetReq.employeeName,
        targetNip: employees.find((e) => e.id === targetReq.employeeId)?.nip || targetReq.employeeId,
        oldValue: 'D',
        newValue: shiftType,
        reason: targetReq.reason || 'Pengajuan Cuti Disetujui',
        source: 'Web (Desktop) - 192.168.1.10',
        timestamp: nowFormatted,
        isoTimestamp: new Date().toISOString(),
      };
      const updatedLogs = addStoredAuditLog(approvalLog);
      setAuditLogs(updatedLogs);
    }
  };

  // Prevent hydration mismatch between server SSR and client localStorage
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-semibold tracking-wide">Memuat Sistem Roster...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show Login Page
  if (!currentUser) {
    return (
      <LoginPage
        allEmployees={employees}
        onLoginSuccess={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        year={year}
        monthIndex={monthIndex}
        allEmployees={employees}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        onResetData={handleResetData}
      />

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {isUserAdmin(currentUser.role) ? (
          /* Admin Dashboard: Full Access or Department-Scoped Access according to role */
          <AdminDashboard
            year={year}
            monthIndex={monthIndex}
            onPeriodChange={handlePeriodChange}
            employees={employees}
            roster={roster}
            leaveRequests={leaveRequests}
            auditLogs={auditLogs}
            currentUser={currentUser}
            onUpdateShift={handleUpdateShift}
            onClearShift={handleClearShift}
            onUpdateLeaveRequest={handleUpdateLeaveRequest}
            onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
            onOpenPatternModal={() => setIsPatternModalOpen(true)}
            onOpenExcelUpload={() => setIsExcelUploadOpen(true)}
            onOpenIndividualModal={(emp) => setIndividualModalEmployee(emp)}
            onSyncSpreadsheet={handleSyncSpreadsheet}
            isSyncing={isSyncing}
            lastSynced={lastSynced}
            webhookUrl={webhookUrl}
            autoSync={autoSync}
            onSaveWebhookConfig={handleSaveWebhookConfig}
            onPushBatchCurrentMonth={handlePushBatchCurrentMonth}
            isBatchPushing={isBatchPushing}
          />
        ) : (
          /* Staff Dashboard: Restricted Access for individual employee */
          <StaffDashboard
            currentUser={currentUser}
            year={year}
            monthIndex={monthIndex}
            onPeriodChange={handlePeriodChange}
            allEmployees={employees}
            roster={roster}
            leaveRequests={leaveRequests}
            onSubmitLeaveRequest={handleSubmitLeaveRequest}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>
          Sistem Setting & Manajemen Roster Kerja Shift • 5 Departemen (HRGA, Service, HSE, Warehouse, FA) • Sinkronisasi Dua Arah Google Spreadsheet
        </p>
      </footer>

      {/* Floating Sync Toast Notification */}
      {syncToast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 right-5 z-50 max-w-sm px-4 py-3 rounded-xl shadow-lg border flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-2 ${
            syncToast.type === 'success'
              ? 'bg-emerald-900 text-emerald-50 border-emerald-700'
              : syncToast.type === 'error'
              ? 'bg-rose-900 text-rose-50 border-rose-700'
              : 'bg-slate-900 text-slate-50 border-slate-700'
          }`}
        >
          {syncToast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : syncToast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <RefreshCw className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 animate-spin" />
          )}
          <div className="flex-1 text-xs font-medium leading-relaxed">
            {syncToast.message}
          </div>
          <button
            type="button"
            onClick={() => setSyncToast(null)}
            className="text-white/60 hover:text-white shrink-0 -mr-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MODALS */}
      {/* 1. Individual Monitor Modal */}
      {individualModalEmployee && (
        <IndividualMonitorModal
          employee={individualModalEmployee}
          year={year}
          monthIndex={monthIndex}
          roster={roster}
          canEdit={canEditEmployeeRoster(currentUser, individualModalEmployee)}
          onUpdateShift={handleUpdateShift}
          onClearShift={handleClearShift}
          onUpdateEmployeeKimper={handleUpdateEmployeeKimper}
          onClose={() => setIndividualModalEmployee(null)}
        />
      )}

      {/* 2. Add Employee Modal */}
      {isAddEmployeeOpen && (
        <AddEmployeeModal
          onAddEmployee={handleAddEmployee}
          onClose={() => setIsAddEmployeeOpen(false)}
        />
      )}

      {/* 3. Batch Shift Pattern Modal */}
      {isPatternModalOpen && (
        <ShiftPatternModal
          year={year}
          monthIndex={monthIndex}
          employees={employees}
          selectedDepartment={getDefaultDeptForUser(currentUser)}
          currentRoster={roster}
          currentUser={currentUser}
          onApplyPattern={handleApplyPattern}
          onClose={() => setIsPatternModalOpen(false)}
        />
      )}

      {/* 4. Excel Roster Upload & Multi-Employee Selector Modal */}
      {isExcelUploadOpen && (
        <ExcelRosterUploadModal
          year={year}
          monthIndex={monthIndex}
          employees={employees}
          currentRoster={roster}
          currentUser={currentUser}
          onApplyRosterChanges={handleApplyRosterChangesFromExcel}
          onClose={() => setIsExcelUploadOpen(false)}
        />
      )}
    </div>
  );
}
