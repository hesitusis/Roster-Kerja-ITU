// Google Apps Script template and helpers for Two-Way Google Sheets synchronization

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * GOOGLE APPS SCRIPT - WEBHOOK SINKRONISASI ROSTER DUA ARAH
 * Spreadsheet: ROSTER KERJA
 * 
 * PANDUAN PEMASANGAN (1-2 MENIT):
 * 1. Buka Google Spreadsheet Anda.
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus seluruh isi kode yang ada di editor, lalu paste (tempel) seluruh isi file ini.
 * 4. Klik ikon Simpan (Save).
 * 5. Di pojok kanan atas, klik "Terapkan" (Deploy) > "Deployment baru" (New deployment).
 * 6. Klik ikon gerigi di samping "Pilih jenis", pilih "Aplikasi Web" (Web app).
 * 7. Konfigurasi:
 *    - Deskripsi: Webhook Roster Kerja
 *    - Jalankan sebagai: Saya (email Anda)
 *    - Siapa yang memiliki akses: Siapa saja (Anyone)  <--- [PENTING!]
 * 8. Klik "Terapkan", berikan izin akses saat Google meminta otorisasi.
 * 9. Salin "URL Aplikasi Web" (URL berakhiran /exec).
 * 10. Tempelkan URL tersebut ke aplikasi Roster pada tombol "Setup Google Sheets Webhook".
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Kunci selama 15 detik untuk mencegah konflik penulisan simultan
    lock.waitLock(15000);

    var rawData = e.postData ? e.postData.contents : "{}";
    var payload = JSON.parse(rawData);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // Cari sheet target: 'Roster_Bulanan', 'ROSTER KERJA', 'Roster Bulanan', atau sheet yang mengandung kata 'roster'
    var sheet = ss.getSheetByName("Roster_Bulanan") || 
                ss.getSheetByName("ROSTER KERJA") || 
                ss.getSheetByName("Roster Bulanan");

    if (!sheet) {
      var allSheets = ss.getSheets();
      for (var sIdx = 0; sIdx < allSheets.length; sIdx++) {
        if (/roster/i.test(allSheets[sIdx].getName())) {
          sheet = allSheets[sIdx];
          break;
        }
      }
    }
    if (!sheet) {
      sheet = ss.getActiveSheet();
    }

    var values = sheet.getDataRange().getValues();
    if (values.length < 2) {
      return responseJson({
        success: false,
        sheetName: sheet.getName(),
        message: "Sheet '" + sheet.getName() + "' kosong atau belum memiliki baris data."
      });
    }

    var headerRow = values[0];

    // Normalisasi format tanggal ke ISO (YYYY-MM-DD)
    function formatDateIso(val) {
      if (!val) return "";
      if (val instanceof Date) {
        try {
          return Utilities.formatDate(val, ss.getSpreadsheetTimeZone() || "Asia/Jakarta", "yyyy-MM-dd");
        } catch (e) {
          var y = val.getFullYear();
          var m = ("0" + (val.getMonth() + 1)).slice(-2);
          var d = ("0" + val.getDate()).slice(-2);
          return y + "-" + m + "-" + d;
        }
      }
      var s = String(val).trim();
      var parts = s.split("/");
      if (parts.length === 3) {
        var m = ("0" + parseInt(parts[0], 10)).slice(-2);
        var d = ("0" + parseInt(parts[1], 10)).slice(-2);
        var y = parts[2].trim();
        return y + "-" + m + "-" + d;
      }
      if (/^\\d{4}-\\d{2}-\\d{2}$/.test(s)) return s;
      return "";
    }

    // Buat pemetaan Tanggal -> Indeks Kolom (1-indexed)
    var dateColMap = {};
    for (var c = 6; c < headerRow.length; c++) {
      var dIso = formatDateIso(headerRow[c]);
      if (dIso) {
        dateColMap[dIso] = c + 1;
      }
    }

    // Buat pemetaan NIK / Nama -> Indeks Baris (1-indexed)
    var empRowMap = {};
    for (var r = 1; r < values.length; r++) {
      var nik = String(values[r][0]).trim();
      var name = String(values[r][1]).trim().toUpperCase();
      if (nik) empRowMap[nik] = r + 1;
      if (name) empRowMap[name] = r + 1;
    }

    // Siapkan array data update
    var updates = [];
    if (payload.action === "batchUpdate" && Array.isArray(payload.updates)) {
      updates = payload.updates;
    } else if (payload.dateStr) {
      updates.push({
        nip: payload.employeeNip || payload.nip,
        name: payload.employeeName || payload.name,
        dateStr: payload.dateStr,
        shift: payload.shift
      });
    }

    var updatedCount = 0;
    var notFound = [];

    for (var i = 0; i < updates.length; i++) {
      var item = updates[i];
      var targetNip = item.nip ? String(item.nip).trim() : "";
      var targetName = item.name ? String(item.name).trim().toUpperCase() : "";
      var row = empRowMap[targetNip] || empRowMap[targetName];
      var col = dateColMap[item.dateStr];

      if (row && col) {
        var shiftVal = item.shift;
        if (!shiftVal || shiftVal === "-" || shiftVal === "OFF") {
          shiftVal = (!shiftVal || shiftVal === "-") ? "" : "OFF";
        }
        sheet.getRange(row, col).setValue(shiftVal);
        updatedCount++;
      } else {
        notFound.push({ nip: targetNip, date: item.dateStr, reason: !row ? "Baris karyawan tidak ditemukan" : "Kolom tanggal tidak ditemukan" });
      }
    }

    // Paksa perubahan tersimpan seketika di Google Sheets
    SpreadsheetApp.flush();

    return responseJson({
      success: true,
      message: updatedCount + " jadwal shift berhasil diperbarui di sheet '" + sheet.getName() + "'.",
      sheetName: sheet.getName(),
      updatedCount: updatedCount,
      totalRequested: updates.length,
      notFoundCount: notFound.length,
      notFoundDetails: notFound.slice(0, 5),
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return responseJson({
      success: false,
      error: err.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return responseJson({
    status: "online",
    service: "Google Sheets Webhook Roster Kerja",
    message: "Webhook siap menerima pembaruan jadwal shift!",
    time: new Date().toISOString()
  });
}

function responseJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export interface PushShiftPayload {
  webhookUrl?: string;
  employeeNip?: string;
  employeeName?: string;
  dateStr: string;
  shift: string;
  reason?: string;
}

export interface PushBatchShiftPayload {
  webhookUrl?: string;
  updates: Array<{
    nip?: string;
    name?: string;
    dateStr: string;
    shift: string;
  }>;
}

export async function pushShiftToGoogleSheets(payload: PushShiftPayload): Promise<{
  success: boolean;
  message?: string;
  notConfigured?: boolean;
}> {
  try {
    const res = await fetch('/api/sync-spreadsheet/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Gagal mengirim data ke webhook',
    };
  }
}

export async function pushBatchShiftsToGoogleSheets(payload: PushBatchShiftPayload): Promise<{
  success: boolean;
  message?: string;
  updatedCount?: number;
  notConfigured?: boolean;
}> {
  try {
    const res = await fetch('/api/sync-spreadsheet/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'batchUpdate',
        webhookUrl: payload.webhookUrl,
        updates: payload.updates,
      }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Gagal mengirim batch ke webhook',
    };
  }
}
