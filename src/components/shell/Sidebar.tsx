'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  GitPullRequest,
  Activity,
  Layers,
  X,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  isMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: '28',
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      href: '/team',
      label: 'Team Workload',
      icon: Users,
      badge: '5',
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`flex flex-col h-full bg-zinc-900 border-r border-zinc-800 transition-all duration-300 ease-in-out select-none ${
        isMobile
          ? 'w-64'
          : collapsed
          ? 'w-16'
          : 'w-60'
      }`}
    >
      {/* Brand & Workspace Header */}
      <div className="flex h-14 items-center justify-between border-b border-zinc-800 px-3.5">
        <Link
          href="/"
          className={`flex items-center gap-2.5 overflow-hidden ${
            collapsed && !isMobile ? 'justify-center w-full' : ''
          }`}
          onClick={isMobile ? onCloseMobile : undefined}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
            <Activity className="h-4 w-4" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold tracking-tight text-zinc-100 flex items-center gap-1.5">
                DevPulse
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v1.0
                </span>
              </span>
              <span className="text-[11px] text-zinc-500 truncate">Core Engineering</span>
            </div>
          )}
        </Link>

        {isMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            aria-label="Close mobile navigation"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        <div className="px-2 py-1.5">
          {(!collapsed || isMobile) && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Platform
            </span>
          )}
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onCloseMobile : undefined}
              title={collapsed && !isMobile ? item.label : undefined}
              className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-zinc-800/90 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200'
              } ${collapsed && !isMobile ? 'justify-center px-0' : ''}`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-indigo-500" />
              )}
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-300'
                }`}
              />

              {(!collapsed || isMobile) && (
                <span className="flex-1 truncate">{item.label}</span>
              )}

              {(!collapsed || isMobile) && item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-750'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Summary Pill & Collapse Action */}
      <div className="border-t border-zinc-800 p-2">
        {(!collapsed || isMobile) ? (
          <div className="mb-2 rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-2.5">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span className="flex items-center gap-1.5 font-medium">
                <GitPullRequest className="h-3 w-3 text-emerald-400" />
                Active Sprint
              </span>
              <span className="font-mono text-zinc-300">W46</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '72%' }} />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>89.2% merged</span>
              <span>4 stale</span>
            </div>
          </div>
        ) : null}

        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800/80 bg-zinc-900 px-2 py-1.5 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
}
