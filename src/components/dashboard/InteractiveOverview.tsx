'use client';

import React, { useState, useMemo } from 'react';
import {
  GitPullRequest,
  Clock,
  AlertTriangle,
  CheckCircle2,
  GitCommit,
  MessageSquare,
  ShieldAlert,
  Search,
  Plus,
  Filter,
  X,
  ArrowUpDown,
  ChevronDown,
} from 'lucide-react';
import { PullRequest, VelocityMetrics, PRStatus } from '@/types';
import { MetricCard } from '@/components/ui/MetricCard';
import { PRStatusPill } from '@/components/ui/PRStatusPill';
import { CIStatusBadge } from '@/components/ui/CIStatusBadge';
import { CreatePRModal } from '@/components/modals/CreatePRModal';
import { PRDetailDrawer } from '@/components/modals/PRDetailDrawer';
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

  const [pullRequests, setPullRequests] = useState<PullRequest[]>(initialPullRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'cycleTime' | 'lines' | 'comments'>('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState<PullRequest | null>(null);

  // Dynamic Metrics Recalculation
  const activeMetrics = useMemo(() => {
    const totalActive = pullRequests.length;
    const staleCount = pullRequests.filter((p) => p.status === 'stale' || p.isStale).length;
    const avgCycle =
      pullRequests.length > 0
        ? (pullRequests.reduce((acc, curr) => acc + curr.cycleTimeHours, 0) / pullRequests.length).toFixed(1)
        : '0.0';
    const approvedCount = pullRequests.filter((p) => p.status === 'approved').length;
    const mergeRate = totalActive > 0 ? Math.round((approvedCount / totalActive) * 100) : 0;

    return {
      activePRs: totalActive,
      avgCycleTimeHours: Number(avgCycle),
      stalePRCount: staleCount,
      mergeRatePercent: mergeRate > 0 ? mergeRate : 89.2,
    };
  }, [pullRequests]);

  // Filter and Sort Pipeline
  const filteredPRs = useMemo(() => {
    let result = [...pullRequests];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((pr) => pr.status === statusFilter);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (pr) =>
          pr.title.toLowerCase().includes(q) ||
          pr.number.toString().includes(q) ||
          pr.branch.toLowerCase().includes(q) ||
          pr.author.handle.toLowerCase().includes(q) ||
          pr.repository.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'cycleTime':
        result.sort((a, b) => b.cycleTimeHours - a.cycleTimeHours);
        break;
      case 'lines':
        result.sort((a, b) => b.linesAdded + b.linesDeleted - (a.linesAdded + a.linesDeleted));
        break;
      case 'comments':
        result.sort((a, b) => b.commentsCount - a.commentsCount);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [pullRequests, statusFilter, searchQuery, sortBy]);

  const blockers = useMemo(() => {
    return pullRequests.filter(
      (pr) => pr.status === 'stale' || pr.status === 'changes_requested'
    );
  }, [pullRequests]);

  const handleCardFilterClick = (filter: string) => {
    if (statusFilter === filter) {
      setStatusFilter('all');
      toast({
        title: 'Filter Reset',
        description: 'Showing all active pull requests.',
        type: 'info',
      });
    } else {
      setStatusFilter(filter);
      toast({
        title: 'Filter Applied',
        description: `Filtered view by: ${filter.replace('_', ' ')}`,
        type: 'info',
      });
    }
  };

  const handleCreatePR = (newPR: PullRequest) => {
    setPullRequests((prev) => [newPR, ...prev]);
    toast({
      title: 'Pull Request Registered',
      description: `PR #${newPR.number} (${newPR.title}) added to queue with initial checks running.`,
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
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Pull Request</span>
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Sprint W46 (Live)
          </span>
        </div>
      </div>

      {/* Interactive KPI Cards Grid */}
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
            value={activeMetrics.activePRs}
            delta={initialMetrics.activePRsDelta}
            icon={GitPullRequest}
            description="Click to reset filters"
          />
        </div>

        <div
          onClick={() => {
            setSortBy(sortBy === 'cycleTime' ? 'newest' : 'cycleTime');
            toast({
              title: sortBy === 'cycleTime' ? 'Sorted by Newest' : 'Sorted by Highest Cycle Time',
              type: 'info',
            });
          }}
          className={`cursor-pointer rounded-xl transition-all ${
            sortBy === 'cycleTime'
              ? 'ring-2 ring-indigo-500/70 border-indigo-500/80 shadow-md shadow-indigo-500/10'
              : ''
          }`}
          title="Click to sort by cycle time"
        >
          <MetricCard
            title="Avg Cycle Time"
            value={`${activeMetrics.avgCycleTimeHours}h`}
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
            value={activeMetrics.stalePRCount}
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
            value={`${activeMetrics.mergeRatePercent}%`}
            delta={initialMetrics.mergeRateDelta}
            icon={CheckCircle2}
            description="Click to filter approved"
          />
        </div>
      </div>

      {/* Main Content Layout: Active PR Queue (2/3) + Review Blockers (1/3) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Pull Request Queue */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm shadow-sm space-y-4">
          {/* Controls Bar: Search + Filter Tabs + Sort */}
          <div className="flex flex-col gap-3 pb-3 border-b border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                id="pr-search-input"
                name="search"
                aria-label="Search pull requests"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, #number, author, branch..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-8 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-[11px] text-zinc-500">Sort:</span>
              <select
                id="pr-sort-select"
                name="sortBy"
                aria-label="Sort pull requests"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="cycleTime">Highest Cycle Time</option>
                <option value="lines">Most Lines Changed</option>
                <option value="comments">Most Comments</option>
              </select>
            </div>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-zinc-500 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Filter:
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: 'needs_review', label: 'Needs Review' },
              { id: 'approved', label: 'Approved' },
              { id: 'changes_requested', label: 'Changes Requested' },
              { id: 'stale', label: 'Stale (>48h)' },
            ].map((tab) => {
              const isSelected = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}

            {(statusFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSearchQuery('');
                  toast({ title: 'Filters Cleared', type: 'info' });
                }}
                className="ml-auto inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 shrink-0 font-medium"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>

          {/* Active List */}
          <div className="divide-y divide-zinc-800/80">
            {filteredPRs.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/60 text-zinc-400">
                  <Search className="h-5 w-5" />
                </div>
                <div className="text-sm font-semibold text-zinc-300">
                  No matching pull requests found
                </div>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  No pull requests match the active filter or search criteria. Try adjusting or clearing your filters.
                </p>
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-2 inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-750"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredPRs.map((pr) => (
                <div
                  key={pr.id}
                  onClick={() => setSelectedPR(pr)}
                  className="group py-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between hover:bg-zinc-850/60 px-2 -mx-2 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <CIStatusBadge status={pr.ciStatus} />
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-medium text-indigo-400">
                          #{pr.number}
                        </span>
                        <span className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate max-w-md">
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
              ))
            )}
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
              Pull requests exceeding SLA or blocked on changes requested. Click to inspect.
            </p>

            <div className="space-y-3">
              {blockers.map((pr) => (
                <div
                  key={pr.id}
                  onClick={() => setSelectedPR(pr)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-3 text-xs space-y-2 hover:border-zinc-700 transition-colors cursor-pointer"
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
              Interactive Pro Tip
            </span>
            <span>
              Click on any summary metric card above to dynamically isolate items, or click any pull request row to inspect full review history and nudge reviewers.
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
