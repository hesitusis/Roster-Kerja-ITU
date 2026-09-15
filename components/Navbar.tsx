'use client';

import React from 'react';
import { Employee } from '@/lib/types';
import { MONTH_NAMES_ID } from '@/lib/constants';
import { IndotruckLogo } from './IndotruckLogo';
import {
  Calendar,
  LogOut,
  Clock,
} from 'lucide-react';

interface NavbarProps {
  currentUser: Employee | null;
  year: number;
  monthIndex: number;
  allEmployees?: Employee[];
  onLogout: () => void;
  onSwitchUser?: (user: Employee) => void;
  onResetData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  year,
  monthIndex,
  onLogout,
}) => {
  const monthName = MONTH_NAMES_ID[monthIndex];

  return (
    <header id="app-navbar" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand & Info */}
          <div className="flex items-center gap-4">
            <IndotruckLogo size="sm" />
            <div className="hidden lg:block h-6 w-px bg-slate-200" />
            <div className="hidden lg:flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800 tracking-tight">
                Roster Kerja
              </span>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-md">
                4 Dept
              </span>
            </div>
          </div>

          {/* Center: Current Period Indicator */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/90 text-xs text-slate-700 font-medium shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-slate-500">Periode:</span>
            <span className="font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-md shadow-2xs border border-slate-200">
              {monthName} {year}
            </span>
          </div>

          {/* Right: User Profile & Logout */}
          {currentUser && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    NIK: {currentUser.nip} • {currentUser.department}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                id="btn-logout"
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                title="Keluar dari sesi"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
