import React, { useState } from 'react';
import { Clock, Pencil, UserPlus, Lock, CheckCircle2, RefreshCw, ChevronRight } from 'lucide-react';
import { AuditLogItem } from '@/lib/types';
import { AuditLogModal } from './AuditLogModal';

interface AuditLogCardProps {
  logs: AuditLogItem[];
  onOpenModal?: () => void;
  maxDisplay?: number;
}

export const AuditLogCard: React.FC<AuditLogCardProps> = ({
  logs,
  onOpenModal,
  maxDisplay = 3,
}) => {
  const [showModal, setShowModal] = useState(false);

  const displayLogs = logs.slice(0, maxDisplay);

  const handleOpenModal = () => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      setShowModal(true);
    }
  };

  const getLogIcon = (log: AuditLogItem) => {
    switch (log.type) {
      case 'SHIFT_CHANGE':
        return (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Pencil className="w-4 h-4" />
          </div>
        );
      case 'ADD_EMPLOYEE':
        return (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <UserPlus className="w-4 h-4" />
          </div>
        );
      case 'LOCK_PERIOD':
        return (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
        );
      case 'LEAVE_APPROVAL':
        return (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <>
      <div
        id="audit-log-card"
        className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Aktivitas Terbaru</h3>
          </div>
          <button
            id="btn-see-all-audit-logs"
            type="button"
            onClick={handleOpenModal}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer group"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Content List */}
        {displayLogs.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 italic">
            Belum ada catatan aktivitas perubahan.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {displayLogs.map((log) => (
              <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                {getLogIcon(log)}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                    <div className="text-xs text-slate-800 leading-snug">
                      <span className="font-bold text-slate-900">{log.actorName}</span>
                      {log.actorUsername && (
                        <span className="text-[11px] font-mono text-slate-500 ml-1">
                          (@{log.actorUsername})
                        </span>
                      )}{' '}
                      <span className="text-slate-700">{log.actionTitle}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                      {log.timestamp}
                    </span>
                  </div>

                  {/* Specific Key-Value Details */}
                  <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-600">
                    {/* Shift Change specifics */}
                    {log.oldValue && log.newValue && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 w-16 shrink-0">Nilai</span>
                        <span>:</span>
                        <span className="font-bold text-slate-800">
                          {log.oldValue} <span className="text-slate-400 font-normal">→</span>{' '}
                          <span className="text-indigo-600">{log.newValue}</span>
                        </span>
                      </div>
                    )}

                    {/* Personnel List (for Add Employee) */}
                    {log.details?.personelList && log.details.personelList.length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 w-16 shrink-0">Personel</span>
                        <span>:</span>
                        <div className="flex-1">
                          {log.details.personelList.map((p, pIdx) => (
                            <div key={p.nip} className="text-slate-800">
                              {pIdx + 1}. {p.name} (NIK {p.nip})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reason */}
                    {log.reason && (
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 w-16 shrink-0">Alasan</span>
                        <span>:</span>
                        <span className="text-slate-700 italic">{log.reason}</span>
                      </div>
                    )}

                    {/* Source / IP */}
                    {log.source && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 w-16 shrink-0">Sumber</span>
                        <span>:</span>
                        <span className="font-mono text-[10px] text-slate-500">{log.source}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal View */}
      {showModal && (
        <AuditLogModal logs={logs} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};
