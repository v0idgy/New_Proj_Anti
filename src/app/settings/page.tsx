import React from 'react';
import {
  Settings,
  GitBranch,
  Clock,
  Bell,
  Shield,
  Key,
  Database,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { getRepositories, getSettingsConfig } from '@/data/mock';

export default async function SettingsPage() {
  const repos = await getRepositories();
  const config = await getSettingsConfig();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
            Settings & Pipeline Configuration
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Define SLA thresholds, repository webhooks, and team alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Config Synchronized
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Settings Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* SLA Thresholds Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
              <Clock className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-zinc-200">
                PR Turnaround & SLA Thresholds
              </h2>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-zinc-200 block">
                    Stale PR Grace Period
                  </label>
                  <p className="text-[11px] text-zinc-400">
                    Flag PRs as stale when no reviewer activity occurs within this window.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-mono font-medium text-zinc-200">
                    {config.staleThresholdHours} hours
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-200 block">
                    Target Pickup Latency (First Review)
                  </label>
                  <p className="text-[11px] text-zinc-400">
                    Expected maximum time from creation until first constructive review.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-mono font-medium text-zinc-200">
                    {config.targetPickupHours} hours
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-200 block">
                    Max Reviewer Concurrency Limit
                  </label>
                  <p className="text-[11px] text-zinc-400">
                    Maximum open active reviews assigned before marking engineer as overloaded.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-mono font-medium text-zinc-200">
                    {config.maxReviewerLoad} reviews
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Repositories */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-zinc-200">
                  Connected Source Repositories
                </h2>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                {repos.length} Connected
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-zinc-200">
                        {repo.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                        {repo.defaultBranch}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">{repo.description}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono text-indigo-400 font-medium">
                      {repo.openPRCount} open PRs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Integrations & Webhook Info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
              <Database className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-zinc-200">
                Data Layer Architecture
              </h3>
            </div>

            <div className="space-y-3 text-xs text-zinc-400">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-zinc-200">Current Source:</span>
                  <span className="font-mono text-emerald-400">src/data/mock.ts</span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Fully typed asynchronous mock layer simulating real network latency.
                </p>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-zinc-200">Phase 2 Ready:</span>
                  <span className="font-mono text-indigo-400">GitHub App / Webhook</span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Zero schema breaking changes required when replacing mock providers with live REST or Octokit webhooks.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
              <Bell className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-zinc-200">
                Alert Dispatch Channels
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/80">
                <span className="text-zinc-300 font-medium">Slack (#eng-velocity)</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/80">
                <span className="text-zinc-300 font-medium">Email Digest</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  Daily 9AM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
