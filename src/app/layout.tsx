import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/shell/AppShell';

export const metadata: Metadata = {
  title: 'DevPulse — Engineering Team Velocity & PR Tracker',
  description: 'Real-time pull request velocity, bottleneck analysis, and team review health tracker.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500/20 selection:text-indigo-300">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
