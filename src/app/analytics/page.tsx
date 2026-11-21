import React from 'react';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Clock,
  Layers,
  Zap,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { getAnalyticsData } from '@/data/mock';

export default async function AnalyticsPage() {
  const { metrics, cycleTime, throughput } = await getAnalyticsData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
            Velocity & Cycle Time Analytics
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Granular breakdown of pickup latency, review turnarounds, and merge cadence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            Last 30 Days (Rolling)
          </span>
        </div>
      </div>

      {/* Cycle Time Funnel Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Pickup Latency"
          value={`${metrics.pickupLatencyHours}h`}
          delta={-14.2}
          invertedDelta={true}
          icon={Zap}
          description="Creation to first human review"
        />
        <MetricCard
          title="Review Cycle Time"
          value={`${metrics.reviewCycleHours}h`}
          delta={-8.5}
          invertedDelta={true}
          icon={Clock}
          description="First review to final approval"
        />
        <MetricCard
          title="Merge Latency"
          value={`${metrics.mergeLatencyHours}h`}
          delta={+5.1}
          invertedDelta={true}
          icon={Layers}
          description="Approval to target branch merge"
        />
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Cycle Time SLA Health Breakdown */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-red-400" />
              <h2 className="text-sm font-semibold tracking-tight text-zinc-200">
                Cycle Time SLA Health
              </h2>
            </div>
            <span className="text-xs text-zinc-400">Target vs Actual</span>
          </div>

          <div className="mt-4 space-y-4">
            {cycleTime.map((item) => {
              const percentage = Math.min(
                Math.round((item.avgHours / item.targetHours) * 100),
                100
              );
              const isHealthy = item.avgHours <= item.targetHours;

              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-200">
                      {item.category} Phase
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-zinc-300">
                        {item.avgHours}h{' '}
                        <span className="text-zinc-500">/ {item.targetHours}h SLA</span>
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                          isHealthy
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {isHealthy ? 'Within SLA' : 'Exceeding SLA'}
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isHealthy ? 'bg-red-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-3 text-xs text-zinc-400">
            <span className="font-semibold text-zinc-300">Bottleneck Insight: </span>
            Merge latency degraded slightly (+5.1%) due to prolonged staging environment regression testing runs.
          </div>
        </div>

        {/* PR Size Distribution & Velocity Correlation */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold tracking-tight text-zinc-200">
                PR Size vs. Turnaround Correlation
              </h2>
            </div>
            <span className="text-xs text-zinc-400">Lines Changed</span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:border-zinc-700/80 hover:bg-zinc-850/60 transition-all duration-200 ease-in-out">
              <div>
                <div className="text-xs font-semibold text-zinc-200 tracking-tight">
                  Small (&lt;200 LOC)
                </div>
                <div className="text-[11px] text-zinc-400">
                  Quick bugfixes, dependency bumps
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-bold text-emerald-400">
                  4.2h avg
                </div>
                <div className="text-[10px] text-zinc-500">62% of all PRs</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:border-zinc-700/80 hover:bg-zinc-850/60 transition-all duration-200 ease-in-out">
              <div>
                <div className="text-xs font-semibold text-zinc-200 tracking-tight">
                  Medium (200 - 500 LOC)
                </div>
                <div className="text-[11px] text-zinc-400">
                  Standard feature implementations
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-bold text-red-400">
                  14.6h avg
                </div>
                <div className="text-[10px] text-zinc-500">28% of all PRs</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:border-zinc-700/80 hover:bg-zinc-850/60 transition-all duration-200 ease-in-out">
              <div>
                <div className="text-xs font-semibold text-zinc-200 tracking-tight">
                  Large (&gt;500 LOC)
                </div>
                <div className="text-[11px] text-zinc-400">
                  Architectural refactors & deep systems
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-bold text-rose-400">
                  48.8h avg
                </div>
                <div className="text-[10px] text-zinc-500">10% of all PRs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Throughput Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-200">
            Sprint-over-Sprint Throughput Cadence
          </h2>
          <span className="text-xs text-zinc-400">Completed Batches</span>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-medium">
                <th className="py-2.5">Sprint Window</th>
                <th className="py-2.5">Opened</th>
                <th className="py-2.5">Merged</th>
                <th className="py-2.5">Throughput Rate</th>
                <th className="py-2.5 text-right">Median Cycle Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-mono">
              {throughput.map((item) => (
                <tr key={item.week} className="hover:bg-zinc-850/40 transition-colors">
                  <td className="py-3 text-zinc-200 font-sans font-medium">
                    {item.week}
                  </td>
                  <td className="py-3 text-zinc-400">{item.openedCount}</td>
                  <td className="py-3 text-emerald-400 font-bold">{item.mergedCount}</td>
                  <td className="py-3 text-zinc-300">
                    {Math.round((item.mergedCount / item.openedCount) * 100)}%
                  </td>
                  <td className="py-3 text-right text-red-400">
                    {item.medianCycleHours}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
