'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  GitPullRequest,
  GitCommit,
  MessageSquare,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { PullRequest, PRStatus } from '@/types';
import { PRStatusPill } from '@/components/ui/PRStatusPill';
import { CIStatusBadge } from '@/components/ui/CIStatusBadge';
import { useEntityData, SortField } from '@/hooks/useEntityData';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';

interface EntityTableProps {
  entityState?: ReturnType<typeof useEntityData>;
  onSelectPR?: (pr: PullRequest) => void;
  onOpenCreateModal?: () => void;
}

export function EntityTable({
  entityState: externalState,
  onSelectPR,
  onOpenCreateModal,
}: EntityTableProps) {
  const internalState = useEntityData();
  const state = externalState || internalState;
  const { toast } = useToast();

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    filteredItems,
    items,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    repoFilter,
    setRepoFilter,
    sortField,
    sortDirection,
    toggleSort,
    deleteItem,
    updateItem,
    resetFilters,
  } = state;

  const handleDelete = (id: string, prNumber: number, prTitle: string) => {
    deleteItem(id);
    setDeleteConfirmId(null);
    toast({
      title: 'Pull Request Removed',
      description: `PR #${prNumber} ("${prTitle}") deleted successfully.`,
      type: 'warning',
    });
  };

  const handleQuickApprove = (e: React.MouseEvent, pr: PullRequest) => {
    e.stopPropagation();
    const newStatus: PRStatus = pr.status === 'approved' ? 'needs_review' : 'approved';
    updateItem(pr.id, { status: newStatus });
    toast({
      title: newStatus === 'approved' ? 'PR Approved' : 'PR Status Updated',
      description: `PR #${pr.number} marked as ${newStatus.replace('_', ' ')}.`,
      type: 'success',
    });
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-zinc-500 opacity-60 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-red-400 font-bold" />
    ) : (
      <ArrowDown className="h-3 w-3 text-red-400 font-bold" />
    );
  };

  const categories: { id: PRStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'needs_review', label: 'Needs Review' },
    { id: 'approved', label: 'Approved' },
    { id: 'changes_requested', label: 'Changes Requested' },
    { id: 'stale', label: 'Stale (>48h)' },
  ];

  const repos = [
    { id: 'all', label: 'All Repositories' },
    { id: 'frontend-core', label: 'frontend-core' },
    { id: 'api-gateway', label: 'api-gateway' },
    { id: 'data-pipeline', label: 'data-pipeline' },
  ];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 md:p-6 backdrop-blur-sm shadow-sm space-y-4">
      {/* Table Header: Search, Category Filters, Repo Filter */}
      <div className="flex flex-col gap-3 pb-3 border-b border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            id="entity-search-input"
            name="entitySearch"
            aria-label="Search pull requests by title, number, branch, or author"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, #number, author, branch..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-8 pr-8 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all duration-200 ease-in-out"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Repository Dropdown Filter & Stats */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-[11px] text-zinc-500 tracking-tight">Repo:</span>
          <select
            id="entity-repo-select"
            name="repoFilter"
            aria-label="Filter by repository"
            value={repoFilter}
            onChange={(e) => setRepoFilter(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-300 focus:border-red-500 focus:outline-none transition-all duration-200 ease-in-out"
          >
            {repos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>

          <span className="text-xs font-mono text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-700/50">
            {filteredItems.length} of {items.length}
          </span>
        </div>
      </div>

      {/* Category Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] text-zinc-500 mr-1 flex items-center gap-1 tracking-tight">
          <Filter className="h-3 w-3" /> Category:
        </span>
        {categories.map((cat) => {
          const isSelected = statusFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setStatusFilter(cat.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200 ease-in-out shrink-0 ${
                isSelected
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/25'
                  : 'border border-zinc-700 bg-transparent text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 hover:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}

        {(statusFilter !== 'all' || repoFilter !== 'all' || searchQuery) && (
          <button
            onClick={resetFilters}
            className="ml-auto inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 shrink-0 font-medium cursor-pointer transition-colors duration-200"
          >
            <RotateCcw className="h-3 w-3" /> Reset Filters
          </button>
        )}
      </div>

      {/* Desktop Table View (hidden on mobile, visible on md+) */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-zinc-800/80 bg-zinc-950/40">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 font-medium select-none bg-zinc-900/40">
              <th className="py-3 px-3 w-10">CI</th>

              {/* Sortable: Title */}
              <th
                onClick={() => toggleSort('title')}
                className="py-3 px-3 cursor-pointer hover:text-zinc-100 group transition-colors duration-200"
              >
                <div className="flex items-center gap-1.5 tracking-tight">
                  <span>Pull Request / Title</span>
                  {renderSortIcon('title')}
                </div>
              </th>

              <th className="py-3 px-3 tracking-tight">Repository</th>
              <th className="py-3 px-3 tracking-tight">Author</th>
              <th className="py-3 px-3 tracking-tight">Status</th>

              {/* Sortable: Date */}
              <th
                onClick={() => toggleSort('createdAt')}
                className="py-3 px-3 cursor-pointer hover:text-zinc-100 group transition-colors duration-200"
              >
                <div className="flex items-center gap-1.5 tracking-tight">
                  <span>Created / Latency</span>
                  {renderSortIcon('createdAt')}
                </div>
              </th>

              <th className="py-3 px-3 text-right tracking-tight">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/80">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/60 text-zinc-400 mb-2">
                    <Search className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-semibold text-zinc-300 tracking-tight">
                    No matching pull requests
                  </div>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 tracking-tight">
                    Try adjusting your search query or clear the active category filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-3 btn-secondary"
                  >
                    Reset all filters
                  </button>
                </td>
              </tr>
            ) : (
              filteredItems.map((pr) => (
                <tr
                  key={pr.id}
                  onClick={() => onSelectPR?.(pr)}
                  className="group hover:bg-zinc-800/50 transition-all duration-200 ease-in-out cursor-pointer"
                >
                  {/* CI status icon */}
                  <td className="py-3.5 px-3">
                    <CIStatusBadge status={pr.ciStatus} />
                  </td>

                  {/* Title, Number, Branch, Diff */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-red-400">
                          #{pr.number}
                        </span>
                        <span className="font-semibold text-zinc-200 group-hover:text-white transition-colors duration-200 tracking-tight">
                          {pr.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-mono">
                        <span className="flex items-center gap-1 text-zinc-400">
                          <GitCommit className="h-3 w-3" />
                          {pr.branch}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-400">+{pr.linesAdded}</span>
                        <span className="text-rose-400 -ml-1">-{pr.linesDeleted}</span>
                        {pr.commentsCount > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-zinc-400 font-sans">
                              <MessageSquare className="h-3 w-3" />
                              {pr.commentsCount}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Repository */}
                  <td className="py-3.5 px-3 font-mono text-zinc-300 text-[11px]">
                    {pr.repository}
                  </td>

                  {/* Author */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={pr.author.avatarUrl}
                        alt=""
                        className="h-5 w-5 rounded-full object-cover border border-zinc-700"
                      />
                      <span className="text-zinc-300">@{pr.author.handle}</span>
                    </div>
                  </td>

                  {/* Status Pill */}
                  <td className="py-3.5 px-3">
                    <PRStatusPill status={pr.status} />
                  </td>

                  {/* Date & Cycle Time */}
                  <td className="py-3.5 px-3 font-mono text-zinc-400">
                    <div className="text-zinc-300 text-xs">{pr.cycleTimeHours}h open</div>
                    <div className="text-[10px] text-zinc-500 font-sans">
                      {formatDate(pr.createdAt)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Quick Approve / Toggle button */}
                      <button
                        onClick={(e) => handleQuickApprove(e, pr)}
                        title={pr.status === 'approved' ? 'Mark Needs Review' : 'Quick Approve'}
                        className={`p-1.5 rounded-lg border transition-all duration-200 ease-in-out ${
                          pr.status === 'approved'
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-zinc-800/80'
                        }`}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete button or confirm */}
                      {deleteConfirmId === pr.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(pr.id, pr.number, pr.title)}
                            className="px-2 py-1 rounded bg-rose-600 text-[11px] font-bold text-white hover:bg-rose-500 transition-colors duration-200"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-200 transition-colors duration-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(pr.id)}
                          title="Delete Pull Request"
                          className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-zinc-800/80 transition-all duration-200 ease-in-out"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card List View (max-md:block / visible only on mobile screens) */}
      <div className="block md:hidden space-y-3">
        {filteredItems.length === 0 ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-8 text-center">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/60 text-zinc-400 mb-2">
              <Search className="h-5 w-5" />
            </div>
            <div className="text-sm font-semibold text-zinc-300 tracking-tight">
              No matching pull requests
            </div>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-1 tracking-tight">
              Try adjusting your search query or clear the active category filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-3 btn-secondary"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredItems.map((pr) => (
            <div
              key={pr.id}
              onClick={() => onSelectPR?.(pr)}
              className="group rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-4 transition-all duration-200 ease-in-out hover:border-zinc-700 hover:bg-zinc-900/90 active:scale-[0.99] cursor-pointer space-y-3 shadow-sm"
            >
              {/* Card Header: CI Badge, #number, Status, Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CIStatusBadge status={pr.ciStatus} />
                  <span className="font-mono text-xs font-bold text-red-400">
                    #{pr.number}
                  </span>
                  <PRStatusPill status={pr.status} />
                </div>

                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleQuickApprove(e, pr)}
                    title={pr.status === 'approved' ? 'Mark Needs Review' : 'Quick Approve'}
                    className={`p-1.5 rounded-lg border transition-all duration-200 ease-in-out ${
                      pr.status === 'approved'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30'
                    }`}
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                  </button>

                  {deleteConfirmId === pr.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(pr.id, pr.number, pr.title)}
                        className="px-2 py-1 rounded bg-rose-600 text-[11px] font-bold text-white hover:bg-rose-500 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(pr.id)}
                      title="Delete Pull Request"
                      className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition-all duration-200 ease-in-out"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="font-semibold text-sm text-zinc-100 group-hover:text-red-300 transition-colors duration-200 tracking-tight leading-snug">
                {pr.title}
              </div>

              {/* Branch, Lines Changed, Comments */}
              <div className="flex flex-wrap items-center gap-2 text-zinc-400 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-zinc-300">
                  <GitCommit className="h-3 w-3 text-zinc-500" />
                  {pr.branch}
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">+{pr.linesAdded}</span>
                <span className="text-rose-400 font-medium -ml-1">-{pr.linesDeleted}</span>
                {pr.commentsCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-zinc-400 font-sans">
                      <MessageSquare className="h-3 w-3" />
                      {pr.commentsCount}
                    </span>
                  </>
                )}
                <span className="ml-auto rounded bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-300 font-mono">
                  {pr.repository}
                </span>
              </div>

              {/* Card Footer: Author + Latency / Date */}
              <div className="flex items-center justify-between border-t border-zinc-850 pt-2.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <img
                    src={pr.author.avatarUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover border border-zinc-700"
                  />
                  <span className="text-zinc-300 text-[11px]">@{pr.author.handle}</span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-zinc-300 font-medium">{pr.cycleTimeHours}h open</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-500 font-sans">{formatDate(pr.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
