'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Link2,
  FileCode2,
  SendHorizontal,
} from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '@/lib/google-sheets-script';

interface GoogleSheetsWebhookModalProps {
  isOpen: boolean;
  webhookUrl: string;
  autoSync: boolean;
  onSaveConfig: (url: string, autoSync: boolean) => void;
  onClose: () => void;
  onPushBatchCurrentMonth?: () => Promise<void>;
  isBatchPushing?: boolean;
}

export const GoogleSheetsWebhookModal: React.FC<GoogleSheetsWebhookModalProps> = ({
  isOpen,
  webhookUrl,
  autoSync,
  onSaveConfig,
  onClose,
  onPushBatchCurrentMonth,
  isBatchPushing = false,
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'settings'>('settings');
  const [urlInput, setUrlInput] = useState(webhookUrl);
  const [autoSyncInput, setAutoSyncInput] = useState(autoSync);
  const [isCopied, setIsCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleTestConnection = async () => {
    if (!urlInput.trim()) {
      setTestResult({
        tested: true,
        success: false,
        message: 'Silakan masukkan URL Webhook Google Apps Script terlebih dahulu.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch(`/api/sync-spreadsheet/push?url=${encodeURIComponent(urlInput.trim())}`);
      const data = await res.json();
      if (data.success) {
        setTestResult({
          tested: true,
          success: true,
          message: 'Koneksi Sukses! Webhook Google Apps Script aktif dan merespons dengan benar.',
        });
        onSaveConfig(urlInput.trim(), autoSyncInput);
      } else {
        setTestResult({
          tested: true,
          success: false,
          message: data.message || 'Gagal menghubungi URL Webhook. Pastikan akses diset "Siapa saja (Anyone)".',
        });
      }
    } catch (e) {
      setTestResult({
        tested: true,
        success: false,
        message: e instanceof Error ? e.message : 'Koneksi gagal atau terputus.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveOnly = () => {
    onSaveConfig(urlInput.trim(), autoSyncInput);
    onClose();
  };

  const isConfigured = Boolean(urlInput.trim().startsWith('http'));

  return (
    <div
      id="modal-gas-webhook"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Sinkronisasi Otomatis ke Google Spreadsheet
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isConfigured
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {isConfigured ? 'Terkoneksi' : 'Belum Dikonfigurasi'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Gunakan Google Apps Script Webhook agar setiap perubahan roster langsung tersimpan di sheet Anda.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-6 pt-2 bg-slate-50/40">
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Pengaturan URL Webhook</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Panduan & Kode Skrip (1-2 Menit)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'settings' && (
            <div className="space-y-5">
              {/* Status Banner */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isConfigured
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                {isConfigured ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <div className="font-bold">
                    {isConfigured
                      ? 'Sinkronisasi Otomatis Google Sheets Siap Digunakan'
                      : 'Perubahan Roster Saat Ini Masih Bersifat Lokal (Belum Terkirim ke Spreadsheet)'}
                  </div>
                  <p className="leading-relaxed opacity-90">
                    {isConfigured
                      ? 'Setiap kali Anda mengubah shift atau mengosongkan sel di aplikasi web ini, data akan langsung di-push ke sel Google Spreadsheet secara instan.'
                      : 'Tempelkan URL Webhook Google Apps Script dari spreadsheet Anda di bawah ini agar perubahan jadwal shift langsung otomatis masuk ke spreadsheet.'}
                  </p>
                </div>
              </div>

              {/* URL Input Form */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>URL Webhook Google Apps Script (akhiran /exec):</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('guide')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                  >
                    Lihat Cara Dapatkan URL →
                  </button>
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
                <p className="text-[11px] text-slate-500">
                  URL ini didapat dari menu <strong>Terapkan (Deploy) &gt; Deployment baru &gt; Aplikasi Web</strong> di spreadsheet Anda.
                </p>
              </div>

              {/* Auto Sync Toggle */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Sinkron Otomatis Real-time (Auto-Save to Sheets)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Setiap kali Anda mengganti shift di tabel atau modal, langsung kirim ke spreadsheet tanpa perlu menekan tombol simpan manual.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSyncInput}
                    onChange={(e) => setAutoSyncInput(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Test Result Message */}
              {testResult && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 border ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* Action Buttons for Testing & Batch Push */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !urlInput.trim()}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Menguji Koneksi...' : 'Uji Koneksi Webhook'}</span>
                </button>

                {onPushBatchCurrentMonth && isConfigured && (
                  <button
                    type="button"
                    onClick={onPushBatchCurrentMonth}
                    disabled={isBatchPushing}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    title="Kirim semua data shift bulan yang sedang aktif ke Google Spreadsheet"
                  >
                    <SendHorizontal className={`w-3.5 h-3.5 ${isBatchPushing ? 'animate-spin' : ''}`} />
                    <span>
                      {isBatchPushing
                        ? 'Mengirim Batch...'
                        : 'Kirim Seluruh Shift Bulan Ini ke Spreadsheet'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Mudah &amp; Sekali Pasang (1-2 Menit)</div>
                  <p className="opacity-90 mt-0.5">
                    Skrip ini tidak memerlukan server luar dan aman 100% karena langsung berjalan di dalam Google Drive Anda sendiri.
                  </p>
                </div>
              </div>

              {/* Step by Step */}
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    Buka file <strong>Google Spreadsheet ROSTER KERJA</strong> Anda di browser.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    Klik menu <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>. Jendela editor skrip Google akan terbuka.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    Hapus kode bawaan (jika ada), lalu <strong>salin kode di bawah ini</strong> dan tempel ke editor.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    Klik ikon <strong>Simpan</strong>, lalu di pojok kanan atas klik <strong>Terapkan (Deploy)</strong> &gt; <strong>Deployment baru</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    5
                  </span>
                  <div>
                    Pilih jenis: <strong>Aplikasi Web</strong>. Atur:
                    <ul className="list-disc ml-5 mt-1 space-y-0.5 font-medium text-slate-800">
                      <li>Jalankan sebagai: <strong>Saya (email Anda)</strong></li>
                      <li>
                        Siapa yang memiliki akses:{' '}
                        <strong className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                          Siapa saja (Anyone)
                        </strong>{' '}
                        <span className="text-rose-600 font-bold">*Wajib agar aplikasi bisa mengirim data</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    6
                  </span>
                  <div>
                    Klik <strong>Terapkan</strong>, berikan otorisasi, lalu <strong>salin URL Aplikasi Web</strong> (berakhiran <code>/exec</code>) dan tempel ke tab Pengaturan di modal ini!
                  </div>
                </div>
              </div>

              {/* Code Box with Copy Button */}
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-900 text-slate-100">
                <div className="px-4 py-2 bg-slate-800 flex items-center justify-between border-b border-slate-700">
                  <span className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                    <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
                    Kode Google Apps Script (doPost &amp; doGet)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Seluruh Kode</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-[11px] font-mono overflow-x-auto max-h-64 text-slate-300 leading-relaxed select-all">
                  {GOOGLE_APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveOnly}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
