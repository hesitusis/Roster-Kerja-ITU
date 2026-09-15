import React from 'react';
import { SHIFTS } from '@/lib/constants';
import { ShiftCode } from '@/lib/types';

interface ShiftLegendProps {
  interactive?: boolean;
  selectedShift?: ShiftCode | null;
  onSelectShift?: (shift: ShiftCode) => void;
  compact?: boolean;
}

export const ShiftLegend: React.FC<ShiftLegendProps> = ({
  interactive = false,
  selectedShift,
  onSelectShift,
  compact = false,
}) => {
  const canonicalCodes: ShiftCode[] = ['D', 'N', 'OFF', 'CT', 'P'];
  const shiftList = canonicalCodes.map((code) => SHIFTS[code]).filter(Boolean);

  return (
    <div id="shift-legend-bar" className="flex flex-wrap items-center gap-2 text-xs">
      <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] mr-1">
        Keterangan Shift:
      </span>
      {shiftList.map((item) => {
        const isSelected = selectedShift === item.code;
        return (
          <button
            key={item.code}
            id={`legend-item-${item.code}`}
            type="button"
            onClick={() => interactive && onSelectShift && onSelectShift(item.code)}
            disabled={!interactive}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-medium transition-all ${item.color} ${
              interactive ? 'cursor-pointer hover:shadow-xs' : 'cursor-default'
            } ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 font-bold' : ''}`}
            title={`${item.name} (${item.timeRange})`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                item.code === 'D' || item.code === 'S1'
                  ? 'bg-emerald-600'
                  : item.code === 'N' || item.code === 'S2'
                  ? 'bg-blue-600'
                  : item.code === 'OFF'
                  ? 'bg-slate-500'
                  : item.code === 'CT' || item.code === 'CUTI'
                  ? 'bg-amber-600'
                  : 'bg-purple-600'
              }`}
            />
            <span className="font-bold">{item.code}</span>
            <span className="text-slate-600 hidden sm:inline">: {item.shortName}</span>
            {!compact && (
              <span className="text-slate-500 text-[10px] hidden md:inline font-mono">
                ({item.timeRange})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
