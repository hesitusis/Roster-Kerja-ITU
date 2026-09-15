'use client';

import React, { useState } from 'react';
import { Employee } from '@/lib/types';
import { isUserAdmin } from '@/lib/role-utils';
import { INITIAL_EMPLOYEES } from '@/lib/mock-data';
import { IndotruckLogo } from './IndotruckLogo';
import {
  User,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

interface LoginPageProps {
  allEmployees: Employee[];
  onLoginSuccess: (user: Employee) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  allEmployees,
  onLoginSuccess,
}) => {
  // Login input states - Username = NIK, Password = NIK (Kosong secara default)
  const [nikInput, setNikInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanNik = nikInput.trim();
    const cleanPassword = passwordInput.trim();

    if (!cleanNik) {
      setErrorMessage('Silakan masukkan NIK Anda.');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Silakan masukkan kata sandi (NIK).');
      return;
    }

    // Match employee by NIP/NIK or username
    let matchedEmp: Employee | undefined;
    if (cleanNik.toLowerCase() === 'admin') {
      matchedEmp =
        allEmployees.find((e) => e.nip === '9821') ||
        allEmployees.find((e) => e.nip === '8414') ||
        allEmployees.find((e) => isUserAdmin(e.role));
    } else {
      matchedEmp = allEmployees.find(
        (e) =>
          e.nip.trim().toLowerCase() === cleanNik.toLowerCase() ||
          e.username.trim().toLowerCase() === cleanNik.toLowerCase()
      );
    }

    if (!matchedEmp) {
      setErrorMessage(`NIK "${cleanNik}" tidak terdaftar dalam database karyawan.`);
      return;
    }

    // Validate password: Password must be NIK (or employee's NIP/username, or fallback passwords)
    const isValidPassword =
      cleanPassword.toLowerCase() === matchedEmp.nip.trim().toLowerCase() ||
      cleanPassword.toLowerCase() === matchedEmp.username.trim().toLowerCase() ||
      cleanPassword === matchedEmp.password ||
      (isUserAdmin(matchedEmp.role) && cleanPassword === 'admin123') ||
      (!isUserAdmin(matchedEmp.role) && cleanPassword === 'password123');

    if (!isValidPassword) {
      setErrorMessage('Kata sandi salah. Gunakan NIK Anda sebagai kata sandi.');
      return;
    }

    const initMaster = INITIAL_EMPLOYEES.find((e) => e.nip === matchedEmp?.nip);
    const finalEmp = initMaster
      ? { ...matchedEmp, role: initMaster.role, department: initMaster.department }
      : matchedEmp;

    onLoginSuccess(finalEmp);
  };

  return (
    <div
      id="login-page-container"
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#eff6ff] via-[#f8fafc] to-[#e0e7ff]/30 flex flex-col justify-center items-center p-4 sm:p-6"
    >
      {/* Subtle Background Decorative Pattern - Dot Grid Top Left */}
      <div
        className="absolute top-8 left-8 sm:top-12 sm:left-12 grid grid-cols-4 gap-3 pointer-events-none opacity-40 select-none"
        aria-hidden="true"
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-blue-300" />
        ))}
      </div>

      {/* Subtle Floating Ambient Circles */}
      <div
        className="absolute top-1/4 left-10 w-6 h-6 rounded-full bg-blue-200/50 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-200/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Decorative Bottom-Right Calendar Graphic Silhouette */}
      <div
        className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 opacity-30 pointer-events-none select-none hidden md:block"
        aria-hidden="true"
      >
        <svg
          width="200"
          height="160"
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="20" y="30" width="160" height="120" rx="16" fill="#bfdbfe" fillOpacity="0.4" />
          <rect x="20" y="30" width="160" height="36" rx="16" fill="#93c5fd" fillOpacity="0.5" />
          <rect x="40" y="16" width="10" height="24" rx="5" fill="#60a5fa" fillOpacity="0.6" />
          <rect x="95" y="16" width="10" height="24" rx="5" fill="#60a5fa" fillOpacity="0.6" />
          <rect x="150" y="16" width="10" height="24" rx="5" fill="#60a5fa" fillOpacity="0.6" />
          {/* Calendar grid dots */}
          <circle cx="50" cy="85" r="7" fill="#60a5fa" fillOpacity="0.4" />
          <circle cx="85" cy="85" r="7" fill="#60a5fa" fillOpacity="0.4" />
          <circle cx="120" cy="85" r="7" fill="#60a5fa" fillOpacity="0.4" />
          <circle cx="155" cy="85" r="7" fill="#60a5fa" fillOpacity="0.4" />
          <circle cx="50" cy="115" r="7" fill="#60a5fa" fillOpacity="0.4" />
          <circle cx="85" cy="115" r="7" fill="#60a5fa" fillOpacity="0.4" />
          <circle cx="120" cy="115" r="7" fill="#60a5fa" fillOpacity="0.4" />
          <circle cx="155" cy="115" r="7" fill="#60a5fa" fillOpacity="0.4" />
          {/* User badge on bottom right */}
          <circle cx="155" cy="125" r="18" fill="#3b82f6" fillOpacity="0.7" />
          <circle cx="155" cy="120" r="6" fill="#ffffff" />
          <path
            d="M143 137 C143 131, 148 128, 155 128 C162 128, 167 131, 167 137 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      {/* Main Container Wrapper */}
      <div className="w-full max-w-lg relative z-10 flex flex-col items-center">
        
        {/* Company Logo Header: PT Indotruck Utama */}
        <div id="company-logo-header" className="mb-6 sm:mb-8 text-center animate-in fade-in slide-in-from-top-3 duration-500">
          <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/80 shadow-xs inline-flex items-center justify-center">
            <IndotruckLogo size="md" />
          </div>
        </div>

        {/* Clean Login Card as specified in reference image */}
        <div
          id="login-card"
          className="w-full bg-white rounded-3xl p-7 sm:p-10 shadow-xl shadow-blue-500/8 border border-slate-100 relative"
        >
          {/* Top Graphic: Calendar with User Profile Badge */}
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 select-none">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 96 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Calendar Body */}
                <rect
                  x="8"
                  y="18"
                  width="72"
                  height="64"
                  rx="14"
                  fill="#F8FAFC"
                  stroke="#2563EB"
                  strokeWidth="3.5"
                />
                {/* Calendar Header Band */}
                <path
                  d="M10 32 L78 32"
                  stroke="#2563EB"
                  strokeWidth="3.5"
                />
                <path
                  d="M10 22 C10 16.5, 14.5 18, 20 18 L68 18 C73.5 18, 78 16.5, 78 22 L78 32 L10 32 Z"
                  fill="#2563EB"
                />
                {/* Binder Rings */}
                <rect x="22" y="10" width="6" height="14" rx="3" fill="#1D4ED8" />
                <rect x="42" y="10" width="6" height="14" rx="3" fill="#1D4ED8" />
                <rect x="60" y="10" width="6" height="14" rx="3" fill="#1D4ED8" />

                {/* Calendar Date Grid Squares */}
                <rect x="18" y="40" width="8" height="8" rx="2" fill="#93C5FD" />
                <rect x="32" y="40" width="8" height="8" rx="2" fill="#93C5FD" />
                <rect x="46" y="40" width="8" height="8" rx="2" fill="#93C5FD" />
                <rect x="60" y="40" width="8" height="8" rx="2" fill="#93C5FD" />

                <rect x="18" y="54" width="8" height="8" rx="2" fill="#93C5FD" />
                <rect x="32" y="54" width="8" height="8" rx="2" fill="#93C5FD" />
                <rect x="46" y="54" width="8" height="8" rx="2" fill="#93C5FD" />

                <rect x="18" y="68" width="8" height="8" rx="2" fill="#BFDBFE" />
                <rect x="32" y="68" width="8" height="8" rx="2" fill="#BFDBFE" />

                {/* User Avatar Badge Overlap (Bottom Right) */}
                <circle cx="68" cy="68" r="18" fill="#2563EB" stroke="#FFFFFF" strokeWidth="4" />
                {/* User Head */}
                <circle cx="68" cy="63" r="5.5" fill="#FFFFFF" />
                {/* User Torso */}
                <path
                  d="M58 78 C58 73, 62 70.5, 68 70.5 C74 70.5, 78 73, 78 78 Z"
                  fill="#FFFFFF"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Masuk <span className="text-blue-600">Edit Roster Kerja</span>
            </h2>
            {/* Subtle Blue Underline Pill */}
            <div className="h-1.5 w-14 bg-blue-600 rounded-full mx-auto mt-2.5" />
          </div>

          {/* Form */}
          <form id="form-login-clean" onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Field 1: Username (NIK / Nomor Induk Karyawan) */}
            <div>
              <label
                htmlFor="input-username-nik"
                className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5"
              >
                Username (NIK / Nomor Induk Karyawan)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="input-username-nik"
                  type="text"
                  value={nikInput}
                  onChange={(e) => setNikInput(e.target.value)}
                  placeholder="Masukkan NIK Anda"
                  className="w-full pl-11 pr-4 py-3 text-sm font-medium rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-slate-800 placeholder:text-slate-400 transition-all shadow-2xs"
                  required
                  autoFocus
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Masukkan Nomor Induk Karyawan resmi Anda
              </p>
            </div>

            {/* Field 2: Password (NIK / Nomor Induk Karyawan) */}
            <div>
              <label
                htmlFor="input-password-nik"
                className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5"
              >
                Password (NIK / Nomor Induk Karyawan)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="input-password-nik"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Masukkan kata sandi (NIK)"
                  className="w-full pl-11 pr-11 py-3 text-sm font-medium rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-slate-800 placeholder:text-slate-400 transition-all shadow-2xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Kata sandi sesuai dengan NIK Anda
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                id="login-error-alert"
                className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 animate-in fade-in"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="btn-login-submit"
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer mt-2"
            >
              <span>Masuk ke Sistem</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Footer Company Copyright */}
        <p className="mt-6 text-center text-xs text-slate-400 font-medium">
          PT Indotruck Utama &bull; Sistem Penjadwalan & Roster Kerja Terpadu
        </p>
      </div>
    </div>
  );
};
