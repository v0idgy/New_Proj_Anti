'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState('all');

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 font-sans antialiased">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ease-in-out"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close mobile sidebar backdrop"
          />
          <div className="relative z-50 flex h-full shadow-2xl shadow-black animate-in slide-in-from-left duration-200">
            <Sidebar
              collapsed={false}
              onToggleCollapse={() => {}}
              isMobile={true}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          selectedRepo={selectedRepo}
          onSelectRepo={setSelectedRepo}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
