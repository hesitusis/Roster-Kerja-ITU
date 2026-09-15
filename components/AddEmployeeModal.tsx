'use client';

import React, { useState } from 'react';
import { Department, Employee, UserRole } from '@/lib/types';
import { DEPARTMENTS, KIMPER_LIST } from '@/lib/constants';
import { X, UserPlus, Building2, User, Key, Mail, Phone, Briefcase, ShieldCheck } from 'lucide-react';

interface AddEmployeeModalProps {
  onAddEmployee: (emp: Employee) => void;
  onClose: () => void;
  defaultDepartment?: Department;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  onAddEmployee,
  onClose,
  defaultDepartment = 'SERVICE',
}) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<Department>(defaultDepartment);
  const [position, setPosition] = useState('');
  const [nip, setNip] = useState(`${defaultDepartment}-2026-099`);
  const [role, setRole] = useState<UserRole>('staff');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedKimpers, setSelectedKimpers] = useState<string[]>([]);

  const handleDeptChange = (newDept: Department) => {
    setDepartment(newDept);
    setNip(`${newDept}-2026-099`);
  };

  const toggleKimper = (kCode: string) => {
    setSelectedKimpers((prev) =>
      prev.includes(kCode) ? prev.filter((k) => k !== kCode) : [...prev, kCode]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position.trim()) return;

    const username = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '.')
      .replace(/\.+/g, '.');

    const newEmp: Employee = {
      id: `EMP-${Date.now()}`,
      nip: nip.trim(),
      name: name.trim(),
      department,
      position: position.trim(),
      role,
      username,
      password: 'password123',
      email: email.trim() || `${username}@company.co.id`,
      phone: phone.trim() || '0812-3456-7890',
      joinDate: new Date().toISOString().split('T')[0],
      avatarColor: 'bg-indigo-600',
      kimper: selectedKimpers,
    };

    onAddEmployee(newEmp);
    onClose();
  };

  return (
    <div
      id="add-employee-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="add-employee-modal-card"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Tambah Karyawan Baru</h2>
              <p className="text-xs text-slate-400">Daftarkan personel ke salah satu dari 5 departemen</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Departemen Penugasan *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {DEPARTMENTS.map((dept) => {
                const isSelected = department === dept.code;
                return (
                  <button
                    key={dept.code}
                    type="button"
                    onClick={() => handleDeptChange(dept.code)}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {dept.code}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap Karyawan *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Raden Aditya Pratama"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jabatan / Posisi *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Contoh: Teknisi Elektrikal"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Induk Pegawai (NIP) *
              </label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Perusahaan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@company.co.id"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Telepon / WA
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Izin Khusus Operasional (Kimper)</span>
              </label>
              {department === 'Service' && (
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                  Penting untuk Dept. Service
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Pilih izin unit yang dimiliki karyawan (contoh: LV, OHC, RIGGER, Forklift) untuk monitoring ketersediaan manpower per shift.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {KIMPER_LIST.map((k) => {
                const isChecked = selectedKimpers.includes(k.code);
                return (
                  <button
                    key={k.code}
                    type="button"
                    onClick={() => toggleKimper(k.code)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isChecked
                        ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-black px-1.5 py-0.2 rounded border ${
                          isChecked ? 'bg-indigo-600 text-white border-transparent' : k.color
                        }`}
                      >
                        {k.code}
                      </span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-indigo-600 focus:ring-0 cursor-pointer pointer-events-none"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-1.5 line-clamp-1">
                      {k.name}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight line-clamp-1">
                      {k.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Peran Hak Akses (Role) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                role === 'staff' ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="staff"
                  checked={role === 'staff'}
                  onChange={() => setRole('staff')}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="font-bold text-slate-900">Staff Biasa</div>
                  <div className="text-[11px] text-slate-500">Akses Portal Karyawan & pengajuan cuti pribadi</div>
                </div>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                role === 'admin_service,hse,HRGA FA, Part' || role === 'admin' ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="admin_service,hse,HRGA FA, Part"
                  checked={role === 'admin_service,hse,HRGA FA, Part' || role === 'admin'}
                  onChange={() => setRole('admin_service,hse,HRGA FA, Part')}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <span>Super Admin</span>
                    <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-bold">Semua Dept</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Periksa & edit roster untuk seluruh departemen</div>
                </div>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                role === 'admin_service' ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="admin_service"
                  checked={role === 'admin_service'}
                  onChange={() => setRole('admin_service')}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-bold text-blue-950">Admin Service</div>
                  <div className="text-[11px] text-slate-500">Periksa semua, edit khusus Dept. SERVICE</div>
                </div>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                role === 'admin_hse' ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="admin_hse"
                  checked={role === 'admin_hse'}
                  onChange={() => setRole('admin_hse')}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="font-bold text-emerald-950">Admin HSE</div>
                  <div className="text-[11px] text-slate-500">Periksa semua, edit khusus Dept. HSE</div>
                </div>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                role === 'admin_hrga_fa' ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-500' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="admin_hrga_fa"
                  checked={role === 'admin_hrga_fa'}
                  onChange={() => setRole('admin_hrga_fa')}
                  className="mt-0.5 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <div className="font-bold text-purple-950">Admin HRGA FA</div>
                  <div className="text-[11px] text-slate-500">Periksa semua, edit khusus Dept. HRGA FA</div>
                </div>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                role === 'admin_part' ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-500' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="admin_part"
                  checked={role === 'admin_part'}
                  onChange={() => setRole('admin_part')}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <div className="font-bold text-amber-950">Admin Part</div>
                  <div className="text-[11px] text-slate-500">Periksa semua, edit khusus Dept. PART</div>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Simpan & Daftarkan Karyawan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
