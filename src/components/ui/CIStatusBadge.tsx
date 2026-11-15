import React from 'react';
import { CIStatus } from '@/types';
import { Check, X, Loader2 } from 'lucide-react';

interface CIStatusBadgeProps {
  status: CIStatus;
}

export function CIStatusBadge({ status }: CIStatusBadgeProps) {
  switch (status) {
    case 'passing':
      return (
        <span
          title="CI checks passed"
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        >
          <Check className="h-3 w-3" />
        </span>
      );
    case 'failing':
      return (
        <span
          title="CI checks failed"
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20"
        >
          <X className="h-3 w-3" />
        </span>
      );
    case 'running':
      return (
        <span
          title="CI checks running"
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
        >
          <Loader2 className="h-3 w-3 animate-spin" />
        </span>
      );
    default:
      return null;
  }
}
