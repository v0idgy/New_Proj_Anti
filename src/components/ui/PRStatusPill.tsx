import React from 'react';
import { PRStatus } from '@/types';
import { Clock, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

interface PRStatusPillProps {
  status: PRStatus;
}

export function PRStatusPill({ status }: PRStatusPillProps) {
  switch (status) {
    case 'needs_review':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
          <Clock className="h-3 w-3" />
          Needs Review
        </span>
      );
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          Approved
        </span>
      );
    case 'changes_requested':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-400">
          <AlertCircle className="h-3 w-3" />
          Changes Requested
        </span>
      );
    case 'stale':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-0.5 text-xs font-medium text-red-400 animate-pulse">
          <AlertTriangle className="h-3 w-3" />
          Stale (&gt;48h)
        </span>
      );
    default:
      return null;
  }
}
