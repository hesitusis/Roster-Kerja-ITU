import { AuditLogItem, ShiftCode } from './types';

export function formatAuditDate(date: Date = new Date()): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} ${hours}:${minutes}`;
}

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    type: 'SHIFT_CHANGE',
    actorName: 'Muhammad Rifki',
    actorUsername: 'mrifki',
    actorRole: 'admin',
    actionTitle: 'mengubah shift ADITYA SAPRINGA dari CT → D',
    targetName: 'ADITYA SAPRINGA',
    targetNip: '8583',
    targetDate: '2026-09-14',
    oldValue: 'CT',
    newValue: 'D',
    reason: 'Penyesuaian kebutuhan operasional',
    source: 'Web (Desktop) - 192.168.1.10',
    timestamp: '12 Sep 2026 08:24',
    isoTimestamp: '2026-09-12T08:24:00+08:00',
  },
  {
    id: 'log-2',
    type: 'ADD_EMPLOYEE',
    actorName: 'YUDA',
    actorUsername: 'yuda',
    actorRole: 'admin',
    actionTitle: 'menambahkan 2 personel',
    details: {
      personelList: [
        { name: 'Budi Santoso', nip: '9723' },
        { name: 'Siti Nurhaliza', nip: '9845' },
      ],
    },
    source: 'Admin Panel - 10.10.12.25',
    timestamp: '12 Sep 2026 07:50',
    isoTimestamp: '2026-09-12T07:50:00+08:00',
  },
  {
    id: 'log-3',
    type: 'LOCK_PERIOD',
    actorName: 'Admin',
    actorUsername: 'admin',
    actorRole: 'system',
    actionTitle: 'mengunci periode September 2026',
    reason: 'Periode bulan berjalan telah selesai',
    source: 'Sistem - 10.10.10.5',
    timestamp: '12 Sep 2026 06:30',
    isoTimestamp: '2026-09-12T06:30:00+08:00',
  },
  {
    id: 'log-4',
    type: 'LEAVE_APPROVAL',
    actorName: 'YUDA',
    actorUsername: 'yuda',
    actorRole: 'admin',
    actionTitle: 'menyetujui cuti resmi VENDY PURNOMO',
    targetName: 'VENDY PURNOMO',
    targetNip: '8566',
    oldValue: 'D',
    newValue: 'CT',
    reason: 'Pengajuan Cuti Roster Disetujui',
    source: 'Web (Desktop) - 192.168.1.12',
    timestamp: '11 Sep 2026 14:15',
    isoTimestamp: '2026-09-11T14:15:00+08:00',
  },
];

export function createShiftChangeAuditLog(params: {
  actorName: string;
  actorUsername: string;
  targetName: string;
  targetNip: string;
  targetDate: string;
  oldShift: ShiftCode;
  newShift: ShiftCode;
  reason?: string;
  source?: string;
}): AuditLogItem {
  const {
    actorName,
    actorUsername,
    targetName,
    targetNip,
    targetDate,
    oldShift,
    newShift,
    reason = 'Penyesuaian kebutuhan operasional',
    source = 'Web (Desktop) - 192.168.1.10',
  } = params;

  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    type: 'SHIFT_CHANGE',
    actorName,
    actorUsername,
    actorRole: 'admin',
    actionTitle: `mengubah shift ${targetName} dari ${oldShift} → ${newShift}`,
    targetName,
    targetNip,
    targetDate,
    oldValue: oldShift,
    newValue: newShift,
    reason,
    source,
    timestamp: formatAuditDate(new Date()),
    isoTimestamp: new Date().toISOString(),
  };
}
