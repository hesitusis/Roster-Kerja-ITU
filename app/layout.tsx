import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Sistem Roster Kerja Karyawan',
  description: 'Sistem pengaturan dan penjadwalan roster kerja shift (Setting Roster) karyawan dengan integrasi Google Spreadsheet dua arah, audit log perubahan shift, monitoring kualifikasi Kimper, dan ekspor data.',
  openGraph: {
    title: 'Sistem Roster Kerja Karyawan',
    description: 'Sistem pengaturan dan penjadwalan roster kerja shift (Setting Roster) karyawan dengan integrasi Google Spreadsheet dua arah, audit log perubahan shift, monitoring kualifikasi Kimper, dan ekspor data.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sistem Roster Kerja Karyawan',
    description: 'Sistem pengaturan dan penjadwalan roster kerja shift (Setting Roster) karyawan dengan integrasi Google Spreadsheet dua arah, audit log perubahan shift, monitoring kualifikasi Kimper, dan ekspor data.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
