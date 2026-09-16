'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Employee, RosterData, ShiftCode, ShiftEntry, AuditLogItem } from '@/lib/types';
import { MONTH_NAMES_ID, SHIFTS } from '@/lib/constants';
import { getDaysInMonth } from '@/lib/roster-utils';
import {
  parseRosterExcelBuffer,
  downloadRosterExcelTemplate,
  ParsedEmployeeRosterItem,
  ExcelRosterParseResult,
} from '@/lib/excel-import';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  CheckSquare,
  Square,
  ArrowRight,
  Filter,
  UserPlus,
  RefreshCw,
  Building2,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface ExcelRosterUploadModalProps {
  year: number;
  monthIndex: number;
  employees: Employee[];
  currentRoster: RosterData;
  currentUser?: Employee | null;
  onApplyRosterChanges: (params: {
    selectedItems: ParsedEmployeeRosterItem[];
    targetYear: number;
    targetMonthIndex: number;
    changeReason: string;
    addNewEmployees: boolean;
  }) => void;
  onClose: () => void;
}

export const ExcelRosterUploadModal: React.FC<ExcelRosterUploadModalProps> = ({
  year,
  monthIndex,
  employees,
  currentRoster,
  currentUser,
  onApplyRosterChanges,
  onClose,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(year);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(monthIndex);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [parseResult, setParseResult] = useState<ExcelRosterParseResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Selection & filtering states
  const [selectedItemKeys, setSelectedItemKeys] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDept, setFilterDept] = useState<string>('ALL');
  const [filterChangeStatus, setFilterChangeStatus] = useState<'ALL' | 'CHANGED' | 'NEW' | 'UNCHANGED'>('ALL');
  const [expandedItemKeys, setExpandedItemKeys] = useState<Set<string>>(new Set());

  // Options
  const [changeReason, setChangeReason] = useState<string>('Import & Penyesuaian Roster dari File Excel');
  const [addNewEmployees, setAddNewEmployees] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const monthName = MONTH_NAMES_ID[selectedMonthIndex];
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonthIndex);

  // Handle file reading and parsing
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    processFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const processFile = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const buffer = await uploadedFile.arrayBuffer();
      const result = parseRosterExcelBuffer(
        buffer,
        selectedYear,
        selectedMonthIndex,
        employees,
        currentRoster
      );

      if (!result.success) {
        setErrorMessage(result.message);
        setParseResult(null);
      } else {
        setParseResult(result);
        if (result.targetYear) setSelectedYear(result.targetYear);
        if (result.targetMonthIndex !== undefined) setSelectedMonthIndex(result.targetMonthIndex);

        // Pre-select items
        const initialSelected = new Set<string>();
        result.items.forEach((item) => {
          if (item.selected) {
            initialSelected.add(item.key);
          }
        });
        setSelectedItemKeys(initialSelected);

        if (!changeReason || changeReason === 'Import & Penyesuaian Roster dari File Excel') {
          setChangeReason(`Import Roster dari file ${uploadedFile.name}`);
        }
      }
    } catch (err) {
      console.error('Failed to parse file:', err);
      setErrorMessage('Terjadi kesalahan saat memproses file Excel. Pastikan format file valid.');
      setParseResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle single employee selection
  const toggleSelectEmployee = (key: string) => {
    setSelectedItemKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Toggle expand diff detail
  const toggleExpand = (key: string) => {
    setExpandedItemKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Quick selection helpers
  const handleSelectAll = (itemsToSelect: ParsedEmployeeRosterItem[]) => {
    setSelectedItemKeys((prev) => {
      const next = new Set(prev);
      itemsToSelect.forEach((i) => next.add(i.key));
      return next;
    });
  };

  const handleDeselectAll = (itemsToDeselect: ParsedEmployeeRosterItem[]) => {
    setSelectedItemKeys((prev) => {
      const next = new Set(prev);
      itemsToDeselect.forEach((i) => next.delete(i.key));
      return next;
    });
  };

  const handleSelectOnlyChanged = () => {
    if (!parseResult) return;
    const next = new Set<string>();
    parseResult.items.forEach((i) => {
      if (i.totalChanges > 0 || i.isNewEmployee) {
        next.add(i.key);
      }
    });
    setSelectedItemKeys(next);
  };

  // Filter items based on user search, department, and change status
  const filteredItems = useMemo(() => {
    if (!parseResult) return [];
    return parseResult.items.filter((item) => {
      const nameMatch =
        item.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.employee.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.employee.position.toLowerCase().includes(searchQuery.toLowerCase());

      const deptMatch =
        filterDept === 'ALL' || item.employee.department.toUpperCase() === filterDept.toUpperCase();

      let statusMatch = true;
      if (filterChangeStatus === 'CHANGED') {
        statusMatch = item.totalChanges > 0 && !item.isNewEmployee;
      } else if (filterChangeStatus === 'NEW') {
        statusMatch = item.isNewEmployee;
      } else if (filterChangeStatus === 'UNCHANGED') {
        statusMatch = item.totalChanges === 0 && !item.isNewEmployee;
      }

      return nameMatch && deptMatch && statusMatch;
    });
  }, [parseResult, searchQuery, filterDept, filterChangeStatus]);

  // Handle final submit
  const handleApply = () => {
    if (!parseResult) return;
    const selectedItems = parseResult.items.filter((item) => selectedItemKeys.has(item.key));
    if (selectedItems.length === 0) {
      alert('Pilih setidaknya 1 nama karyawan untuk menerapkan perubahan roster.');
      return;
    }

    onApplyRosterChanges({
      selectedItems,
      targetYear: selectedYear,
      targetMonthIndex: selectedMonthIndex,
      changeReason: changeReason.trim() || 'Import & Edit Jadwal via Excel',
      addNewEmployees,
    });
  };

  // Extract unique departments from parseResult
  const availableDepts = useMemo(() => {
    if (!parseResult) return [];
    const set = new Set<string>();
    parseResult.items.forEach((i) => {
      if (i.employee.department) set.add(i.employee.department.toUpperCase());
    });
    return Array.from(set);
  }, [parseResult]);

  const selectedCount = selectedItemKeys.size;
  const totalCount = parseResult?.items.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Upload & Edit Roster dari Excel</span>
                <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md">
                  Multi-Personel Selector
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Unggah file Excel/CSV, periksa jadwal shift, dan pilih nama mana saja yang akan diperbarui.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadRosterExcelTemplate(selectedYear, selectedMonthIndex, employees, currentRoster)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Unduh format template Excel siap isi"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Unduh Template Excel</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-slate-50/30">
          {/* Top Configuration: Target Period */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Periode Target Roster:</span>
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonthIndex}
                  onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value, 10))}
                  className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 cursor-pointer"
                >
                  {MONTH_NAMES_ID.map((m, idx) => (
                    <option key={m} value={idx}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 cursor-pointer"
                >
                  {[2024, 2025, 2026, 2027, 2028].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-[11px] text-slate-500">
              Maks. {daysInMonth.length} hari pada {monthName} {selectedYear}
            </div>
          </div>

          {/* Upload Dropzone */}
          {!parseResult && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/70 transition-all rounded-2xl p-8 text-center cursor-pointer space-y-3 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-white text-indigo-600 border border-indigo-200 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:shadow-md transition-all">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  {isProcessing ? 'Memproses File Excel...' : 'Klik atau Tarik File Excel / CSV ke Sini'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Mendukung format spreadsheet roster resmi (Google Sheets export, Excel .xlsx, .xls, .csv).
                  Kolom otomatis diselaraskan dengan NIK dan Tanggal.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-white px-3 py-1 rounded-lg border border-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pilih File Excel (.xlsx / .csv)</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-rose-500 hover:text-rose-700 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* PARSE RESULT: Interactive Selection & Verification Screen */}
          {parseResult && (
            <div className="space-y-4">
              {/* File Info & Re-upload bar */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{file?.name || 'File Excel Roster'}</span>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                        Sheet: {parseResult.sheetName}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.2">
                      Terbaca: <strong>{parseResult.items.length}</strong> karyawan •{' '}
                      <strong className="text-emerald-700">{parseResult.summary.totalWithChanges}</strong> ada perubahan
                      jadwal
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setParseResult(null);
                    setFile(null);
                    setSelectedItemKeys(new Set());
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Ganti File Excel</span>
                </button>
              </div>

              {/* Statistics Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Total Karyawan di File</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{parseResult.summary.totalRowsFound}</div>
                  <div className="text-[10px] text-slate-500 font-medium">terdeteksi dari header NIK/Nama</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[10px] font-bold uppercase text-indigo-500">Terpilih untuk Diupdate</div>
                  <div className="text-lg font-black text-indigo-600 mt-0.5">
                    {selectedCount} <span className="text-xs font-normal text-slate-400">/ {totalCount}</span>
                  </div>
                  <div className="text-[10px] text-indigo-700 font-medium">akan disimpan ke database</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[10px] font-bold uppercase text-amber-500">Ada Perubahan Jadwal</div>
                  <div className="text-lg font-black text-amber-600 mt-0.5">
                    {parseResult.summary.totalWithChanges}
                  </div>
                  <div className="text-[10px] text-amber-700 font-medium">berbeda dengan roster saat ini</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[10px] font-bold uppercase text-purple-500">Karyawan Baru</div>
                  <div className="text-lg font-black text-purple-600 mt-0.5">{parseResult.summary.totalNew}</div>
                  <div className="text-[10px] text-purple-700 font-medium">belum ada di database app</div>
                </div>
              </div>

              {/* Action Toolbar & Filters */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                {/* Search & Selection Buttons */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Quick Select Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleSelectAll(filteredItems)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Pilih Semua ({filteredItems.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeselectAll(filteredItems)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                      <span>Batalkan Pilihan</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSelectOnlyChanged}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pilih Yang Berubah Saja ({parseResult.summary.totalWithChanges})</span>
                    </button>
                  </div>

                  {/* Search Box */}
                  <div className="relative w-full md:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari nama atau NIK..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Pills: Department & Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  {/* Department Filter */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Dept:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setFilterDept('ALL')}
                      className={`px-2 py-0.8 rounded-md font-bold text-xs transition-colors cursor-pointer ${
                        filterDept === 'ALL'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Semua
                    </button>
                    {availableDepts.map((dept) => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => setFilterDept(dept)}
                        className={`px-2 py-0.8 rounded-md font-bold text-xs transition-colors cursor-pointer ${
                          filterDept === dept
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500">Status:</span>
                    <select
                      value={filterChangeStatus}
                      onChange={(e) => setFilterChangeStatus(e.target.value as any)}
                      className="text-xs font-semibold py-1 px-2 rounded-md border border-slate-200 bg-white text-slate-700"
                    >
                      <option value="ALL">Semua Baris</option>
                      <option value="CHANGED">Ada Perubahan Saja</option>
                      <option value="UNCHANGED">Sama / Tidak Berubah</option>
                      <option value="NEW">Karyawan Baru Saja</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Employee Selection List Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="p-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={filteredItems.length > 0 && filteredItems.every((i) => selectedItemKeys.has(i.key))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleSelectAll(filteredItems);
                        } else {
                          handleDeselectAll(filteredItems);
                        }
                      }}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      id="select-all-header-checkbox"
                    />
                    <label htmlFor="select-all-header-checkbox" className="cursor-pointer">
                      Pilih ({selectedCount} dari {totalCount} Karyawan Ditandai)
                    </label>
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Klik baris atau tombol panah untuk meninjau perincian shift tanggal per tanggal
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {filteredItems.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      Tidak ada karyawan yang sesuai dengan filter pencarian.
                    </div>
                  ) : (
                    filteredItems.map((item, idx) => {
                      const isSelected = selectedItemKeys.has(item.key);
                      const isExpanded = expandedItemKeys.has(item.key);
                      const hasChanges = item.totalChanges > 0;

                      return (
                        <div
                          key={item.key}
                          className={`transition-colors ${
                            isSelected ? 'bg-indigo-50/25' : 'bg-white hover:bg-slate-50/60'
                          }`}
                        >
                          {/* Main Row */}
                          <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* Checkbox */}
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectEmployee(item.key)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                              />

                              {/* Index number */}
                              <span className="text-[11px] font-mono text-slate-400 w-5 text-right shrink-0">
                                {idx + 1}.
                              </span>

                              {/* Employee Details */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-bold text-slate-900 truncate">
                                    {item.employee.name}
                                  </span>
                                  <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                                    NIK: {item.employee.nip}
                                  </span>
                                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded">
                                    {item.employee.department}
                                  </span>
                                  <span className="text-[10px] text-slate-500 truncate">
                                    {item.employee.position}
                                  </span>
                                </div>

                                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                                  <span>{item.totalShiftsFound} shift terdeteksi di Excel</span>
                                  <span>•</span>
                                  {item.isNewEmployee ? (
                                    <span className="text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 text-[10px]">
                                      + Karyawan Baru
                                    </span>
                                  ) : hasChanges ? (
                                    <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 text-[10px]">
                                      {item.totalChanges} shift berbeda dari roster lama
                                    </span>
                                  ) : (
                                    <span className="text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">
                                      Jadwal sama persis (tidak ada perubahan)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right Actions & Expand Preview */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              {/* Shift Distribution Pill Preview */}
                              <div className="hidden lg:flex items-center gap-1 font-mono text-[10px]">
                                {(['D', 'N', 'OFF', 'CT', 'P'] as ShiftCode[]).map((c) => {
                                  const count = Object.values(item.shifts).filter((s) => s === c).length;
                                  if (count === 0) return null;
                                  return (
                                    <span
                                      key={c}
                                      className={`px-1.5 py-0.5 rounded font-bold ${
                                        c === 'D'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : c === 'N'
                                          ? 'bg-blue-100 text-blue-800'
                                          : c === 'OFF'
                                          ? 'bg-slate-200 text-slate-800'
                                          : c === 'CT'
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-purple-100 text-purple-800'
                                      }`}
                                    >
                                      {c}:{count}
                                    </span>
                                  );
                                })}
                              </div>

                              <button
                                type="button"
                                onClick={() => toggleExpand(item.key)}
                                className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span>{isExpanded ? 'Tutup' : 'Lihat Perincian'}</span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Date-by-Date Diff Strip */}
                          {isExpanded && (
                            <div className="px-4 pb-3.5 pt-1 bg-slate-50/90 border-t border-slate-100 text-xs space-y-2">
                              <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                                <span>Perbandingan Shift Bulan {monthName} {selectedYear}:</span>
                                <span className="text-amber-700 font-medium">
                                  {item.totalChanges} perubahan shift terdeteksi
                                </span>
                              </div>

                              {/* Matrix mini strip */}
                              <div className="flex gap-1 overflow-x-auto pb-1.5 pt-0.5">
                                {item.diffs.map((diff) => {
                                  const shiftConfig = SHIFTS[diff.newShift];
                                  return (
                                    <div
                                      key={diff.dateStr}
                                      className={`shrink-0 w-8 text-center p-1 rounded-md border text-[10px] ${
                                        diff.isChanged
                                          ? 'border-amber-400 bg-amber-50 ring-1 ring-amber-300'
                                          : 'border-slate-200 bg-white'
                                      }`}
                                      title={`Tgl ${diff.dayNumber}: ${diff.oldShift} → ${diff.newShift}${
                                        diff.isChanged ? ' (Berubah)' : ''
                                      }`}
                                    >
                                      <div className="font-bold text-[9px] text-slate-500">{diff.dayNumber}</div>
                                      <div
                                        className={`font-black rounded mt-0.5 py-0.2 ${
                                          diff.newShift === 'D'
                                            ? 'bg-emerald-600 text-white'
                                            : diff.newShift === 'N'
                                            ? 'bg-blue-600 text-white'
                                            : diff.newShift === 'OFF'
                                            ? 'bg-slate-400 text-white'
                                            : diff.newShift === 'CT'
                                            ? 'bg-amber-600 text-white'
                                            : 'bg-purple-600 text-white'
                                        }`}
                                      >
                                        {diff.newShift}
                                      </div>
                                      {diff.isChanged && (
                                        <div className="text-[8px] text-amber-800 font-mono line-through">
                                          {diff.oldShift}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Options & Reason */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alasan Perubahan / Catatan Audit Trail:
                  </label>
                  <input
                    type="text"
                    value={changeReason}
                    onChange={(e) => setChangeReason(e.target.value)}
                    placeholder="Contoh: Penyesuaian jadwal rotasi dari file Excel..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {parseResult.summary.totalNew > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      id="chk-add-new-employees"
                      checked={addNewEmployees}
                      onChange={(e) => setAddNewEmployees(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="chk-add-new-employees" className="cursor-pointer font-medium">
                      Otomatis tambahkan <strong>{parseResult.summary.totalNew} karyawan baru</strong> yang ada di file Excel ke dalam daftar personel database
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            {parseResult ? (
              <span>
                <strong>{selectedCount}</strong> dari <strong>{totalCount}</strong> karyawan akan diperbarui untuk{' '}
                <strong>
                  {monthName} {selectedYear}
                </strong>
              </span>
            ) : (
              <span>Pastikan file Excel memiliki kolom NIK/NIP, NAMA, dan nomor/tanggal shift.</span>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Batal
            </button>

            {parseResult && (
              <button
                type="button"
                onClick={handleApply}
                disabled={selectedCount === 0}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                  selectedCount > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Terapkan Roster ({selectedCount} Karyawan Terpilih)
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
