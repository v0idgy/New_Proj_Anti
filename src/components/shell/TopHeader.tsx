'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Search,
  GitBranch,
  ChevronDown,
  Bell,
  Sparkles,
  Command,
} from 'lucide-react';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  selectedRepo: string;
  onSelectRepo: (repo: string) => void;
}

export function TopHeader({
  onOpenMobileMenu,
  selectedRepo,
  onSelectRepo,
}: TopHeaderProps) {
  const pathname = usePathname();
  const [isRepoOpen, setIsRepoOpen] = useState(false);

  // Derive route title for breadcrumbs
  const getRouteLabel = (path: string) => {
    switch (path) {
      case '/':
        return 'Overview';
      case '/analytics':
        return 'Analytics & Velocity';
      case '/team':
        return 'Team Workload & Capacity';
      case '/settings':
        return 'Settings & Configuration';
      default:
        return 'Dashboard';
    }
  };

  const repos = [
    { id: 'all', name: 'All Repositories' },
    { id: 'frontend-core', name: 'frontend-core' },
    { id: 'api-gateway', name: 'api-gateway' },
    { id: 'data-pipeline', name: 'data-pipeline' },
  ];

  const currentRepoName =
    repos.find((r) => r.id === selectedRepo)?.name || 'All Repositories';

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 backdrop-blur-md">
      {/* Left: Mobile hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <nav className="flex items-center gap-2 text-xs font-medium">
          <span className="text-zinc-500 hidden sm:inline">Workspace</span>
          <span className="text-zinc-600 hidden sm:inline">/</span>
          <span className="text-zinc-200 font-semibold">{getRouteLabel(pathname)}</span>
        </nav>
      </div>

      {/* Right Controls: Repo Selector, Search cue, Engine Beacon, User */}
      <div className="flex items-center gap-2.5">
        {/* Repo Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRepoOpen(!isRepoOpen)}
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 transition-colors"
          >
            <GitBranch className="h-3.5 w-3.5 text-indigo-400" />
            <span className="max-w-[130px] truncate">{currentRepoName}</span>
            <ChevronDown className="h-3 w-3 text-zinc-500" />
          </button>

          {isRepoOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsRepoOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-48 rounded-lg border border-zinc-800 bg-zinc-900 p-1 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Select Scope
                </div>
                {repos.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onSelectRepo(r.id);
                      setIsRepoOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition-colors ${
                      selectedRepo === r.id
                        ? 'bg-indigo-600/15 text-indigo-300 font-medium'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{r.name}</span>
                    {selectedRepo === r.id && (
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Global Search Cue */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-400">
          <Search className="h-3.5 w-3.5 text-zinc-500" />
          <span>Quick search...</span>
          <kbd className="ml-2 inline-flex items-center gap-0.5 rounded border border-zinc-700/60 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </div>

        {/* Engine Status Beacon */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Mock Engine</span>
        </div>

        {/* Notification Bell */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 transition-colors"
          aria-label="View notifications"
        >
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
        </button>

        {/* Profile Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-800 text-xs font-bold text-zinc-200">
          VP
        </div>
      </div>
    </header>
  );
}
