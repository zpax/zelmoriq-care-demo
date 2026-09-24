import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Zelmoriq Care | Admissions workspace', description: 'A sample admissions workspace with fictional referral data.', icons: { icon: '/icon.svg' } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
