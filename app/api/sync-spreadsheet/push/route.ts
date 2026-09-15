import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_GAS_WEBHOOK_URL } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { webhookUrl, updates, action, employeeNip, employeeName, dateStr, shift, reason } = body;

    const targetUrl = webhookUrl || process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL || DEFAULT_GAS_WEBHOOK_URL;

    if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
      return NextResponse.json(
        {
          success: false,
          notConfigured: true,
          message: 'URL Google Apps Script Webhook belum dikonfigurasi.',
        },
        { status: 400 }
      );
    }

    const payload = {
      action: action || (updates ? 'batchUpdate' : 'updateShift'),
      employeeNip,
      employeeName,
      dateStr,
      shift,
      reason,
      updates,
      timestamp: new Date().toISOString(),
    };

    // Forward to Google Apps Script Webhook with redirect handling
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
      cache: 'no-store',
    });

    const text = await res.text();
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text);
    } catch {
      jsonResponse = { raw: text };
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          status: res.status,
          message: `Google Apps Script returned status ${res.status}`,
          details: jsonResponse,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Perubahan berhasil dikirim dan tersimpan di Google Spreadsheet!',
      result: jsonResponse,
    });
  } catch (error) {
    console.error('Error forwarding to Google Apps Script webhook:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Gagal menghubungi Google Apps Script Webhook',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url') || process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
  if (!url) {
    return NextResponse.json({ success: false, message: 'URL webhook tidak diberikan' }, { status: 400 });
  }

  try {
    const res = await fetch(url, { redirect: 'follow', cache: 'no-store' });
    const text = await res.text();
    return NextResponse.json({
      success: res.ok,
      status: res.status,
      message: res.ok ? 'Koneksi ke Google Apps Script Webhook Berhasil!' : 'Gagal terhubung ke Webhook',
      response: text.slice(0, 200),
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: err instanceof Error ? err.message : 'Koneksi gagal',
    }, { status: 500 });
  }
}
