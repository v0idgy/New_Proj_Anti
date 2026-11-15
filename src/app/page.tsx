import React from 'react';
import {
  GitPullRequest,
  Clock,
  AlertTriangle,
  CheckCircle2,
  GitCommit,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { PRStatusPill } from '@/components/ui/PRStatusPill';
import { CIStatusBadge } from '@/components/ui/CIStatusBadge';
import { getOverviewMetrics, getPullRequests } from '@/data/mock';

export default async function OverviewPage() {
  const metrics = await getOverviewMetrics();
  const pullRequests = await getPullRequests();

  const blockers = pullRequests.filter(
    (pr) => pr.status === 'stale' || pr.status === 'changes_requested'
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
            Engineering Velocity Overview
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Real-time PR throughput, cycle times, and active review bottlenecks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Sprint W46 (Live)
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Pull Requests"
          value={metrics.activePRs}
          delta={metrics.activePRsDelta}
          icon={GitPullRequest}
          description="Across 3 connected repos"
        />
        <MetricCard
          title="Avg Cycle Time"
          value={`${metrics.avgCycleTimeHours}h`}
          delta={metrics.avgCycleTimeDelta}
          invertedDelta={true}
          icon={Clock}
          description="Open to merge latency"
        />
        <MetricCard
          title="Stale Pull Requests"
          value={metrics.stalePRCount}
          delta={metrics.stalePRDelta}
          invertedDelta={true}
          icon={AlertTriangle}
          description="No activity in >48h"
        />
        <MetricCard
          title="Sprint Merge Rate"
          value={`${metrics.mergeRatePercent}%`}
          delta={metrics.mergeRateDelta}
          icon={CheckCircle2}
          description="Target threshold: >85%"
        />
      </div>

      {/* Main Content Layout: Active PR Queue (2/3) + Review Blockers (1/3) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Pull Request Queue */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <GitPullRequest className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-zinc-200">
                Active Pull Request Queue
              </h2>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                {pullRequests.length}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Filter className="h-3.5 w-3.5 text-zinc-500" />
              <span>Showing all active</span>
            </div>
          </div>

          <div className="divide-y divide-zinc-800/80">
            {pullRequests.map((pr) => (
              <div
                key={pr.id}
                className="group py-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between hover:bg-zinc-850/40 px-2 -mx-2 rounded-lg transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <CIStatusBadge status={pr.ciStatus} />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-medium text-indigo-400">
                        #{pr.number}
                      </span>
                      <span className="text-xs font-semibold text-zinc-200 hover:text-white truncate max-w-md">
                        {pr.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                      <span className="font-mono text-[11px] text-zinc-400">
                        {pr.repository}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-zinc-400 flex items-center gap-1">
                        <GitCommit className="h-3 w-3" />
                        {pr.branch}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-emerald-400">
                        +{pr.linesAdded}
                      </span>
                      <span className="font-mono text-[11px] text-rose-400 -ml-2">
                        -{pr.linesDeleted}
                      </span>
                      {pr.commentsCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                            <MessageSquare className="h-3 w-3" />
                            {pr.commentsCount}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-mono text-zinc-300">
                      {pr.cycleTimeHours}h open
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      by @{pr.author.handle}
                    </div>
                  </div>

                  <PRStatusPill status={pr.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Bottlenecks & Action Center */}
        <div className="space-y-4">
          <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-rose-400 mb-3">
              <ShieldAlert className="h-4 w-4" />
              <h3 className="text-sm font-semibold">Critical Review Blockers</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Pull requests exceeding the 48-hour SLA or blocked on changes requested.
            </p>

            <div className="space-y-3">
              {blockers.map((pr) => (
                <div
                  key={pr.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-3 text-xs space-y-2 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium text-indigo-400">
                      #{pr.number}
                    </span>
                    <PRStatusPill status={pr.status} />
                  </div>
                  <div className="font-medium text-zinc-200 line-clamp-2">
                    {pr.title}
                  </div>
                  <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-zinc-800/80">
                    <span>Assigned to @{pr.reviewers[0]?.handle || 'unassigned'}</span>
                    <span className="font-mono text-rose-400 font-semibold">
                      {pr.cycleTimeHours}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Flow Hint */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs text-zinc-400">
            <span className="font-medium text-zinc-200 block mb-1">
              Workflow Shortcut
            </span>
            <span>
              Use the <strong className="text-zinc-200">Analytics</strong> tab to inspect pickup latency distribution, or <strong className="text-zinc-200">Team</strong> to rebalance reviewer loads.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
