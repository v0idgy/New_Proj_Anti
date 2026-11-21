import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/shell/AppShell';
import { ToastProvider } from '@/components/ui/Toast';

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
      <body className="min-h-screen bg-zinc-950 text-zinc-400 font-sans antialiased selection:bg-red-500/20 selection:text-red-300">
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
