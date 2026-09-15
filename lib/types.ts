export type Department = 'SERVICE' | 'HSE' | 'HRGA FA' | 'PART' | 'HRGA' | 'Service' | 'Warehouse' | 'FA';

export type ShiftCode = 'D' | 'N' | 'OFF' | 'CT' | 'C' | 'P' | 'S1' | 'S2' | 'CUTI' | 'IZIN';

export interface ShiftDefinition {
  code: ShiftCode;
  name: string;
  shortName: string;
  timeRange: string;
  color: string;
  textColor: string;
  badgeBg: string;
  badgeBorder: string;
  description: string;
  isWorkday: boolean;
}

export type UserRole =
  | 'admin'
  | 'staff'
  | 'admin_service'
  | 'admin_hse'
  | 'admin_hrga_fa'
  | 'admin_part'
  | string;

export type KimperType = 'LV' | 'FORKLIFT' | 'WAH' | 'OHC' | 'RIGGER' | 'Forklift' | 'Manlift' | 'Welding';

export interface KimperDefinition {
  code: string;
  name: string;
  category: string;
  description: string;
  color: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  minRecommendedPerShift?: number;
}

export interface Employee {
  id: string;
  nip: string; // NIK di spreadsheet (e.g. 8583, 8539)
  name: string;
  department: string;
  position: string;
  por?: string; // Point of Origin: Surabaya, Tabalong, Semarang, dll.
  role: UserRole;
  username: string;
  password?: string;
  email?: string;
  phone?: string;
  joinDate?: string;
  avatarColor?: string;
  kimper?: string[]; // E.g. ['LV', 'FORKLIFT', 'WAH', 'OHC', 'RIGGER']
  isActive?: boolean;
}

export interface ShiftEntry {
  shift: ShiftCode;
  note?: string;
  updatedAt?: string;
  updatedBy?: string;
  updatedByUsername?: string;
  previousShift?: ShiftCode;
  reason?: string;
  source?: string;
}

export type AuditLogType = 'SHIFT_CHANGE' | 'ADD_EMPLOYEE' | 'LOCK_PERIOD' | 'LEAVE_APPROVAL' | 'LEAVE_REQUEST' | 'BATCH_CHANGE';

export interface AuditLogItem {
  id: string;
  type: AuditLogType;
  actorName: string;
  actorUsername: string;
  actorRole?: 'admin' | 'staff' | 'system';
  actionTitle: string; // e.g. "mengubah shift ADITYA SAPRINGA dari CT → D"
  targetName?: string;
  targetNip?: string;
  targetDate?: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  source?: string; // e.g. "Web (Desktop) - 192.168.1.10"
  timestamp: string; // e.g. "12 Sep 2026 08:24"
  isoTimestamp?: string;
  details?: {
    personelList?: { name: string; nip: string }[];
    [key: string]: any;
  };
}

// Key is `employeeId_YYYY-MM-DD` or nested `employeeId -> { [dateStr: string]: ShiftEntry }`
export type RosterData = Record<string, Record<string, ShiftEntry>>;

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: 'CUTI' | 'PERJALANAN' | 'IZIN' | 'SWAP' | 'CT' | 'P';
  startDate: string;
  endDate: string;
  durationDays?: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  swapWithEmployeeId?: string;
  swapWithEmployeeName?: string;
}

export interface MonthlyEmployeeRecap {
  employeeId: string;
  name: string;
  nip: string;
  department: string;
  position: string;
  por?: string;
  dCount: number; // Day Shift (D)
  nCount: number; // Night Shift (N)
  offCount: number;
  ctCount: number; // Cuti (CT)
  pCount: number;  // Perjalanan Pasca Cuti (P) - Kategori Cuti
  // Backward-compat aliases
  shift1Count: number;
  shift2Count: number;
  cutiCount: number;
  izinCount: number; // alias untuk pCount
  totalWorkDays: number;
  totalWorkHours: number;
  attendanceRate: number; // percentage
}
