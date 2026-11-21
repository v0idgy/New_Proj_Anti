import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: number;
  trendPeriod?: string;
  icon: LucideIcon;
  description?: string;
  invertedDelta?: boolean; // if true, negative delta is good (e.g., cycle time reduction)
}

export function MetricCard({
  title,
  value,
  delta,
  trendPeriod = 'vs last sprint',
  icon: Icon,
  description,
  invertedDelta = false,
}: MetricCardProps) {
  const isPositive = delta !== undefined ? delta >= 0 : undefined;
  // If inverted (like latency), negative is good (green), positive is bad (red)
  const isFavorable = invertedDelta ? !isPositive : isPositive;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-zinc-700/80 hover:bg-zinc-900/90 hover:shadow-md hover:shadow-black/20">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          {title}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/60 text-zinc-400 group-hover:text-red-400 group-hover:border-red-500/30 transition-all duration-200 ease-in-out">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-zinc-100 font-mono">
          {value}
        </span>

        {delta !== undefined && (
          <span
            className={`inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded transition-colors duration-200 ${
              isFavorable
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-0.5" />
            )}
            {Math.abs(delta)}%
          </span>
        )}
      </div>

      <div className="mt-2 text-xs text-zinc-500 tracking-tight">
        {description || trendPeriod}
      </div>
    </div>
  );
}
