'use client';

import React, { useEffect } from 'react';
import {
  X,
  GitPullRequest,
  GitCommit,
  GitBranch,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { PullRequest } from '@/types';
import { PRStatusPill } from '@/components/ui/PRStatusPill';
import { CIStatusBadge } from '@/components/ui/CIStatusBadge';
import { useToast } from '@/components/ui/Toast';

interface PRDetailDrawerProps {
  pr: PullRequest | null;
  onClose: () => void;
}

export function PRDetailDrawer({ pr, onClose }: PRDetailDrawerProps) {
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && pr) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pr, onClose]);

  if (!pr) return null;

  const totalLines = pr.linesAdded + pr.linesDeleted || 1;
  const addedPercent = Math.round((pr.linesAdded / totalLines) * 100);
  const deletedPercent = 100 - addedPercent;

  const handleNudge = (reviewerHandle: string) => {
    toast({
      title: 'Reviewer Nudged',
      description: `Sent review reminder ping on Slack to @${reviewerHandle} for PR #${pr.number}.`,
      type: 'success',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Sheet */}
      <div className="relative z-50 flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-400">
              #{pr.number}
            </span>
            <PRStatusPill status={pr.status} />
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {/* PR Title & Metadata */}
          <div>
            <h2 className="text-sm font-bold text-zinc-100 leading-snug">
              {pr.title}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-zinc-400">
              <img
                src={pr.author.avatarUrl}
                alt=""
                className="h-5 w-5 rounded-full object-cover"
              />
              <span>
                Authored by <strong className="text-zinc-200">@{pr.author.handle}</strong>
              </span>
              <span>•</span>
              <span className="font-mono">{pr.repository}</span>
            </div>
          </div>

          {/* Branch & CI Status */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-medium">Branch Pipeline</span>
              <div className="flex items-center gap-1.5">
                <CIStatusBadge status={pr.ciStatus} />
                <span className="text-[11px] font-mono capitalize text-zinc-300">
                  {pr.ciStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-300 font-mono text-[11px] bg-zinc-900 p-2 rounded-lg border border-zinc-800">
              <GitBranch className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-zinc-200">{pr.branch}</span>
              <span className="text-zinc-500">→</span>
              <span className="text-zinc-400">{pr.targetBranch}</span>
            </div>
          </div>

          {/* Turnaround Stepper */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
            <span className="font-semibold text-zinc-200 block">
              Review Cycle Timeline
            </span>

            <div className="space-y-3 pl-2 border-l-2 border-indigo-500/40">
              <div className="relative pl-3">
                <span className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <div className="font-semibold text-zinc-200">Opened</div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  {new Date(pr.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="relative pl-3">
                <span className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                <div className="font-semibold text-zinc-200">Review In Progress</div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  Cycle latency: {pr.cycleTimeHours}h
                </div>
              </div>

              <div className="relative pl-3">
                <span
                  className={`absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full ${
                    pr.status === 'approved' ? 'bg-emerald-500' : 'bg-zinc-700'
                  }`}
                />
                <div
                  className={`font-semibold ${
                    pr.status === 'approved' ? 'text-zinc-200' : 'text-zinc-500'
                  }`}
                >
                  Merge Ready
                </div>
              </div>
            </div>
          </div>

          {/* Diff Breakdown */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-medium text-zinc-300">Diff Volume</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-emerald-400">+{pr.linesAdded}</span>
                <span className="text-rose-400">-{pr.linesDeleted}</span>
              </div>
            </div>

            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${addedPercent}%` }}
              />
              <div
                className="h-full bg-rose-500"
                style={{ width: `${deletedPercent}%` }}
              />
            </div>
          </div>

          {/* Assigned Reviewers & Quick Actions */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-200">
                Assigned Reviewers ({pr.reviewers.length})
              </span>
            </div>

            <div className="space-y-2">
              {pr.reviewers.map((rev) => (
                <div
                  key={rev.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.avatarUrl}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-zinc-200">
                        {rev.name}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        @{rev.handle} • {rev.avgTurnaroundHours}h avg
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleNudge(rev.handle)}
                    className="inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-[11px] text-zinc-200 hover:bg-zinc-750 transition-colors"
                  >
                    <Send className="h-3 w-3 text-indigo-400" />
                    <span>Ping</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
