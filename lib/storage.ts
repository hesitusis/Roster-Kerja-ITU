import { Employee, LeaveRequest, RosterData, ShiftCode, AuditLogItem } from './types';
import { INITIAL_EMPLOYEES, INITIAL_LEAVE_REQUESTS, generateInitialRoster } from './mock-data';
import { INITIAL_AUDIT_LOGS } from './audit-logs';

export const STORAGE_KEYS = {
  EMPLOYEES: 'roster_app_employees_v4',
  ROSTER: 'roster_app_roster_v4',
  LEAVE_REQUESTS: 'roster_app_leave_requests_v4',
  CURRENT_USER: 'roster_app_current_user_v4',
  LAST_SYNCED: 'roster_app_last_synced_v4',
  AUDIT_LOGS: 'roster_app_audit_logs_v4',
  WEBHOOK_URL: 'roster_gas_webhook_url_v1',
  AUTO_SYNC: 'roster_gas_auto_sync_v1',
};

// Purge legacy dummy data from v1/v2/v3 only
if (typeof window !== 'undefined') {
  try {
    ['v1', 'v2', 'v3'].forEach((ver) => {
      localStorage.removeItem(`roster_app_employees_${ver}`);
      localStorage.removeItem(`roster_app_leave_requests_${ver}`);
      localStorage.removeItem(`roster_app_current_user_${ver}`);
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(`roster_app_roster_${ver}`)) {
          localStorage.removeItem(key);
        }
      });
    });
  } catch {
    // Ignore error
  }
}

export function getStoredEmployees(): Employee[] {
  if (typeof window === 'undefined') return INITIAL_EMPLOYEES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (raw) {
      const parsed: Employee[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sync role definitions with INITIAL_EMPLOYEES to always reflect official permissions
        const initMap = new Map(INITIAL_EMPLOYEES.map((e) => [e.nip, e]));
        const synced = parsed.map((p) => {
          const init = initMap.get(p.nip);
          if (init) {
            return {
              ...p,
              role: init.role,
              department: init.department,
              position: init.position,
              kimper: init.kimper && init.kimper.length > 0 ? init.kimper : p.kimper,
            };
          }
          return p;
        });
        return synced;
      }
    }
  } catch (e) {
    console.error('Error reading employees from storage', e);
  }
  return INITIAL_EMPLOYEES;
}

export function saveStoredEmployees(employees: Employee[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  } catch (e) {
    console.error('Error saving employees', e);
  }
}

export function getStoredRoster(year: number, monthIndex: number): RosterData {
  if (typeof window === 'undefined') return generateInitialRoster(year, monthIndex);
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.ROSTER}_${year}_${monthIndex}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Check if parsed has at least some shifts
      const hasAnyShifts = Object.values(parsed).some(
        (empShifts: any) => empShifts && typeof empShifts === 'object' && Object.keys(empShifts).length > 0
      );
      if (hasAnyShifts) {
        return parsed;
      }
      // If parsed is completely empty but generateInitialRoster has data for this month (e.g. October 2026), prefer initial
      const initial = generateInitialRoster(year, monthIndex);
      const initialHasShifts = Object.values(initial).some(
        (empShifts: any) => empShifts && typeof empShifts === 'object' && Object.keys(empShifts).length > 0
      );
      if (initialHasShifts) {
        saveStoredRoster(year, monthIndex, initial);
        return initial;
      }
      return parsed;
    }
    // If not stored for this specific month, create and store initial
    const initial = generateInitialRoster(year, monthIndex);
    saveStoredRoster(year, monthIndex, initial);
    return initial;
  } catch (e) {
    console.error('Error reading roster from storage', e);
    return generateInitialRoster(year, monthIndex);
  }
}

export function saveStoredRoster(year: number, monthIndex: number, data: RosterData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_KEYS.ROSTER}_${year}_${monthIndex}`, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving roster', e);
  }
}

/**
 * Saves a full multi-month roster (e.g. from Google Sheets sync)
 * by splitting entries into their respective month keys (e.g. 2026_8, 2026_9, 2026_10)
 */
export function saveStoredRosterMultiMonth(fullRoster: RosterData) {
  if (typeof window === 'undefined' || !fullRoster) return;
  try {
    const monthBuckets: Record<string, RosterData> = {};
    for (const [empId, shifts] of Object.entries(fullRoster)) {
      if (!shifts || typeof shifts !== 'object') continue;
      for (const [dateStr, entry] of Object.entries(shifts)) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1; // 0-indexed
          if (!isNaN(y) && !isNaN(m)) {
            const key = `${y}_${m}`;
            if (!monthBuckets[key]) monthBuckets[key] = {};
            if (!monthBuckets[key][empId]) monthBuckets[key][empId] = {};
            monthBuckets[key][empId][dateStr] = entry;
          }
        }
      }
    }
    for (const [key, monthRoster] of Object.entries(monthBuckets)) {
      const [y, m] = key.split('_').map(Number);
      saveStoredRoster(y, m, monthRoster);
    }
  } catch (e) {
    console.error('Error saving multi-month roster', e);
  }
}

export function getStoredLeaveRequests(): LeaveRequest[] {
  if (typeof window === 'undefined') return INITIAL_LEAVE_REQUESTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading leave requests', e);
  }
  return INITIAL_LEAVE_REQUESTS;
}

export function saveStoredLeaveRequests(requests: LeaveRequest[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.error('Error saving leave requests', e);
  }
}

export function getStoredCurrentUser(): Employee | null {
  if (typeof window === 'undefined') return INITIAL_EMPLOYEES.find((e) => e.nip === '9821') || null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw === 'LOGGED_OUT') return null;
    if (raw) {
      const parsed: Employee = JSON.parse(raw);
      // Synchronize role and metadata with INITIAL_EMPLOYEES
      const init = INITIAL_EMPLOYEES.find((e) => e.nip === parsed.nip);
      if (init) {
        return {
          ...parsed,
          role: init.role,
          department: init.department,
          position: init.position,
          kimper: init.kimper && init.kimper.length > 0 ? init.kimper : parsed.kimper,
        };
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading current user', e);
  }
  return INITIAL_EMPLOYEES.find((e) => e.nip === '9821') || null;
}

export function saveStoredCurrentUser(user: Employee | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, 'LOGGED_OUT');
    }
  } catch (e) {
    console.error('Error saving current user', e);
  }
}

export function getStoredLastSynced(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNCED);
  } catch {
    return null;
  }
}

export function saveStoredLastSynced(timeStr: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNCED, timeStr);
  } catch (e) {
    console.error('Error saving last synced time', e);
  }
}

export function getStoredAuditLogs(): AuditLogItem[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading audit logs from storage', e);
  }
  return INITIAL_AUDIT_LOGS;
}

export function saveStoredAuditLogs(logs: AuditLogItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving audit logs', e);
  }
}

export function addStoredAuditLog(item: AuditLogItem): AuditLogItem[] {
  const current = getStoredAuditLogs();
  const updated = [item, ...current].slice(0, 100); // keep up to 100 entries
  saveStoredAuditLogs(updated);
  return updated;
}

export function resetAllStorage(year: number, monthIndex: number) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(`${STORAGE_KEYS.ROSTER}_${year}_${monthIndex}`);
    localStorage.removeItem(STORAGE_KEYS.LEAVE_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
  } catch (e) {
    console.error('Error resetting storage', e);
  }
}

export const DEFAULT_GAS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbzAwZxwUP5wF5jkoT_ofao8qF0SbLXGplnlXkH9VRLfT_EE61uzn4MaOoqEPJKO8iIAtA/exec';

export function getStoredWebhookUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_GAS_WEBHOOK_URL;
  try {
    const val = localStorage.getItem(STORAGE_KEYS.WEBHOOK_URL);
    return val && val.startsWith('http') ? val : DEFAULT_GAS_WEBHOOK_URL;
  } catch {
    return DEFAULT_GAS_WEBHOOK_URL;
  }
}

export function saveStoredWebhookUrl(url: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.WEBHOOK_URL, url.trim());
  } catch (e) {
    console.error('Error saving webhook URL', e);
  }
}

export function getStoredAutoSync(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem(STORAGE_KEYS.AUTO_SYNC);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

export function saveStoredAutoSync(enabled: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.AUTO_SYNC, String(enabled));
  } catch (e) {
    console.error('Error saving auto sync preference', e);
  }
}

