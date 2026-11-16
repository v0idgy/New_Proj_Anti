'use client';

import React, { useState, useMemo } from 'react';
import {
  GitPullRequest,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Plus,
} from 'lucide-react';
import { PullRequest, VelocityMetrics } from '@/types';
import { MetricCard } from '@/components/ui/MetricCard';
import { PRStatusPill } from '@/components/ui/PRStatusPill';
import { CreatePRModal } from '@/components/modals/CreatePRModal';
import { PRDetailDrawer } from '@/components/modals/PRDetailDrawer';
import { EntityTable } from '@/components/features/EntityTable';
import { useEntityData } from '@/hooks/useEntityData';
import { useToast } from '@/components/ui/Toast';

interface InteractiveOverviewProps {
  initialMetrics: VelocityMetrics;
  initialPullRequests: PullRequest[];
}

export function InteractiveOverview({
  initialMetrics,
  initialPullRequests,
}: InteractiveOverviewProps) {
  const { toast } = useToast();
  const entityState = useEntityData(initialPullRequests);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState<PullRequest | null>(null);

  const {
    items,
    statusFilter,
    setStatusFilter,
    sortField,
    toggleSort,
    addItem,
    metrics,
  } = entityState;

  // Real-time blockers derived from entityState
  const blockers = useMemo(() => {
    return items.filter(
      (pr) => pr.status === 'stale' || pr.status === 'changes_requested'
    );
  }, [items]);

  const handleCardFilterClick = (filter: string) => {
    if (statusFilter === filter) {
      setStatusFilter('all');
      toast({
        title: 'Filter Reset',
        description: 'Showing all active pull requests.',
        type: 'info',
      });
    } else {
      setStatusFilter(filter as any);
      toast({
        title: 'Filter Applied',
        description: `Filtered view by: ${filter.replace('_', ' ')}`,
        type: 'info',
      });
    }
  };

  const handleCreatePR = (newPR: PullRequest) => {
    addItem(newPR);
    toast({
      title: 'Pull Request Registered',
      description: `PR #${newPR.number} ("${newPR.title}") added to queue and synced.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header section with Create Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
            Engineering Velocity Overview
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Real-time PR throughput, cycle times, and active review bottlenecks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            id="register-pr-btn"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 hover:shadow-indigo-500/25 hover:shadow-sm active:scale-[0.98] transition-all duration-200 ease-in-out cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Pull Request</span>
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Sprint W46 (Live)
          </span>
        </div>
      </div>

      {/* Interactive KPI Cards Grid connected to entityState */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          onClick={() => handleCardFilterClick('all')}
          className={`cursor-pointer rounded-xl transition-all ${
            statusFilter === 'all'
              ? 'ring-2 ring-indigo-500/70 border-indigo-500/80 shadow-md shadow-indigo-500/10'
              : ''
          }`}
          title="Click to view all active PRs"
        >
          <MetricCard
            title="Active Pull Requests"
            value={metrics.activePRs}
            delta={initialMetrics.activePRsDelta}
            icon={GitPullRequest}
            description="Click to reset filters"
          />
        </div>

        <div
          onClick={() => {
            toggleSort('cycleTimeHours');
            toast({
              title: sortField === 'cycleTimeHours' ? 'Sorted by Latency' : 'Toggled Sort',
              type: 'info',
            });
          }}
          className={`cursor-pointer rounded-xl transition-all ${
            sortField === 'cycleTimeHours'
              ? 'ring-2 ring-indigo-500/70 border-indigo-500/80 shadow-md shadow-indigo-500/10'
              : ''
          }`}
          title="Click to sort by cycle time"
        >
          <MetricCard
            title="Avg Cycle Time"
            value={`${metrics.avgCycleTimeHours}h`}
            delta={initialMetrics.avgCycleTimeDelta}
            invertedDelta={true}
            icon={Clock}
            description="Click to sort by latency"
          />
        </div>

        <div
          onClick={() => handleCardFilterClick('stale')}
          id="stale-kpi-card"
          className={`cursor-pointer rounded-xl transition-all ${
            statusFilter === 'stale'
              ? 'ring-2 ring-rose-500/80 border-rose-500/80 shadow-md shadow-rose-500/10'
              : ''
          }`}
          title="Click to filter stale PRs"
        >
          <MetricCard
            title="Stale Pull Requests"
            value={metrics.stalePRCount}
            delta={initialMetrics.stalePRDelta}
            invertedDelta={true}
            icon={AlertTriangle}
            description="Click to isolate stale items"
          />
        </div>

        <div
          onClick={() => handleCardFilterClick('approved')}
          className={`cursor-pointer rounded-xl transition-all ${
            statusFilter === 'approved'
              ? 'ring-2 ring-emerald-500/70 border-emerald-500/80 shadow-md shadow-emerald-500/10'
              : ''
          }`}
          title="Click to filter approved PRs"
        >
          <MetricCard
            title="Sprint Merge Rate"
            value={`${metrics.mergeRatePercent}%`}
            delta={initialMetrics.mergeRateDelta}
            icon={CheckCircle2}
            description="Click to filter approved"
          />
        </div>
      </div>

      {/* Main Content Layout: Interactive EntityTable (2/3) + Review Blockers (1/3) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Interactive Entity Table */}
        <div className="lg:col-span-2">
          <EntityTable
            entityState={entityState}
            onSelectPR={setSelectedPR}
            onOpenCreateModal={() => setIsModalOpen(true)}
          />
        </div>

        {/* Priority Bottlenecks & Action Center */}
        <div className="space-y-4">
          <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-rose-400 mb-3">
              <ShieldAlert className="h-4 w-4" />
              <h3 className="text-sm font-semibold">Critical Review Blockers</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Pull requests exceeding SLA or blocked on changes requested. Click to inspect.
            </p>

            <div className="space-y-3">
              {blockers.length === 0 ? (
                <div className="p-4 text-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-500">
                  No active review blockers. Excellent velocity!
                </div>
              ) : (
                blockers.map((pr) => (
                  <div
                    key={pr.id}
                    onClick={() => setSelectedPR(pr)}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-3 text-xs space-y-2 hover:border-zinc-700/80 hover:bg-zinc-850/80 hover:-translate-y-0.5 transition-all duration-200 ease-in-out cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-medium text-indigo-400">
                        #{pr.number}
                      </span>
                      <PRStatusPill status={pr.status} />
                    </div>
                    <div className="font-medium text-zinc-200 line-clamp-2 tracking-tight">
                      {pr.title}
                    </div>
                    <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-zinc-800/80">
                      <span>Assigned to @{pr.reviewers[0]?.handle || 'unassigned'}</span>
                      <span className="font-mono text-rose-400 font-semibold">
                        {pr.cycleTimeHours}h
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Flow Hint */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs text-zinc-400">
            <span className="font-medium text-zinc-200 block mb-1">
              Local State Persistence Active
            </span>
            <span>
              All additions, status toggles, and deletions are persisted to local storage. Sort by clicking column headers in the table above.
            </span>
          </div>
        </div>
      </div>

      {/* Modals & Overlays */}
      <CreatePRModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePR={handleCreatePR}
      />

      <PRDetailDrawer
        pr={selectedPR}
        onClose={() => setSelectedPR(null)}
      />
    </div>
  );
}
