import React, { useState } from 'react';
import { X, Clock, Search, Filter, Pencil, UserPlus, Lock, CheckCircle2, RefreshCw, Download } from 'lucide-react';
import { AuditLogItem } from '@/lib/types';

interface AuditLogModalProps {
  logs: AuditLogItem[];
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ logs, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    if (typeFilter !== 'ALL' && log.type !== typeFilter) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      log.actorName.toLowerCase().includes(q) ||
      log.actorUsername.toLowerCase().includes(q) ||
      log.actionTitle.toLowerCase().includes(q) ||
      (log.targetName && log.targetName.toLowerCase().includes(q)) ||
      (log.targetNip && log.targetNip.toLowerCase().includes(q)) ||
      (log.reason && log.reason.toLowerCase().includes(q)) ||
      (log.source && log.source.toLowerCase().includes(q))
    );
  });

  const getLogIcon = (log: AuditLogItem) => {
    switch (log.type) {
      case 'SHIFT_CHANGE':
        return (
          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Pencil className="w-4 h-4" />
          </div>
        );
      case 'ADD_EMPLOYEE':
        return (
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <UserPlus className="w-4 h-4" />
          </div>
        );
      case 'LOCK_PERIOD':
        return (
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
        );
      case 'LEAVE_APPROVAL':
        return (
          <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
        );
    }
  };

  const handleExportCSV = () => {
    const headers = ['Waktu', 'Tipe', 'Aktor (Nama)', 'Username', 'Aksi', 'Target', 'Nilai Lama', 'Nilai Baru', 'Alasan', 'Sumber IP'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.type}"`,
      `"${l.actorName}"`,
      `"${l.actorUsername}"`,
      `"${l.actionTitle.replace(/"/g, '""')}"`,
      `"${l.targetName || '-'}"`,
      `"${l.oldValue || '-'}"`,
      `"${l.newValue || '-'}"`,
      `"${(l.reason || '-').replace(/"/g, '""')}"`,
      `"${l.source || '-'}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Audit_Log_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col w-full max-w-3xl max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Riwayat & Log Audit Kehadiran</h3>
              <p className="text-xs text-slate-500">
                Catatan lengkap setiap perubahan jadwal shift, penambahan staf, dan aksi administratif
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama karyawan, username pembuat, alasan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
              >
                <option value="ALL">Semua Jenis Log</option>
                <option value="SHIFT_CHANGE">Perubahan Shift</option>
                <option value="ADD_EMPLOYEE">Tambah Personel</option>
                <option value="LOCK_PERIOD">Kunci Periode</option>
                <option value="LEAVE_APPROVAL">Persetujuan Cuti</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Unduh data log audit ke file CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Log list body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100 space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs italic">
              Tidak ada catatan log audit yang sesuai dengan filter.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="pt-3 first:pt-0 flex items-start gap-3.5">
                {getLogIcon(log)}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                    <div className="text-xs text-slate-900 leading-snug">
                      <span className="font-bold text-slate-900">{log.actorName}</span>
                      {log.actorUsername && (
                        <span className="text-[11px] font-mono text-slate-500 ml-1">
                          (@{log.actorUsername})
                        </span>
                      )}{' '}
                      <span className="text-slate-700">{log.actionTitle}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap shrink-0">
                      {log.timestamp}
                    </span>
                  </div>

                  <div className="mt-1.5 space-y-1 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/60">
                    {log.oldValue && log.newValue && (
                      <div className="grid grid-cols-[80px_1fr] gap-1">
                        <span className="text-slate-400">Nilai</span>
                        <span className="font-bold text-slate-800">
                          {log.oldValue} <span className="text-slate-400 font-normal">→</span>{' '}
                          <span className="text-indigo-600">{log.newValue}</span>
                        </span>
                      </div>
                    )}

                    {log.details?.personelList && log.details.personelList.length > 0 && (
                      <div className="grid grid-cols-[80px_1fr] gap-1">
                        <span className="text-slate-400">Personel</span>
                        <div>
                          {log.details.personelList.map((p, pIdx) => (
                            <div key={p.nip} className="text-slate-800">
                              {pIdx + 1}. {p.name} (NIK {p.nip})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {log.reason && (
                      <div className="grid grid-cols-[80px_1fr] gap-1">
                        <span className="text-slate-400">Alasan</span>
                        <span className="text-slate-700 italic">{log.reason}</span>
                      </div>
                    )}

                    {log.source && (
                      <div className="grid grid-cols-[80px_1fr] gap-1">
                        <span className="text-slate-400">Sumber</span>
                        <span className="font-mono text-[11px] text-slate-500">{log.source}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filteredLogs.length} dari {logs.length} catatan audit</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
