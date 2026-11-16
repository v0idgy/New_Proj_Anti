import React from 'react';
import {
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  GitPullRequest,
  CheckCheck,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { getTeamMembers } from '@/data/mock';

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
            Team Review Capacity & Workload Balance
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Monitor review distribution, turnaround times, and prevent developer burnout.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300">
            <Users className="h-3.5 w-3.5 text-indigo-400" />
            {members.length} Active Engineers
          </span>
        </div>
      </div>

      {/* Review Capacity Alert Banner */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 backdrop-blur-sm flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-300 space-y-1">
          <span className="font-semibold text-amber-400 block">
            Load Imbalance Detected
          </span>
          <p className="text-zinc-400">
            1 engineer is currently exceeding the maximum review concurrency threshold (&gt;4 active PRs). Reassign pending reviews to engineers marked as <strong className="text-emerald-400">Available</strong> to maintain low pickup latency.
          </p>
        </div>
      </div>

      {/* Team Load Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((dev) => {
          const isOverloaded = dev.loadStatus === 'overloaded';
          const isAvailable = dev.loadStatus === 'available';

          return (
            <div
              key={dev.id}
              className={`rounded-xl border p-5 backdrop-blur-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/20 bg-zinc-900/60 ${
                isOverloaded
                  ? 'border-rose-500/30 hover:border-rose-500/50'
                  : isAvailable
                  ? 'border-emerald-500/30 hover:border-emerald-500/50'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={dev.avatarUrl}
                      alt={dev.name}
                      className="h-10 w-10 rounded-full object-cover border border-zinc-700"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 ${
                        isOverloaded
                          ? 'bg-rose-500'
                          : isAvailable
                          ? 'bg-emerald-500'
                          : 'bg-indigo-500'
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
                      {dev.name}
                    </h3>
                    <p className="text-xs text-zinc-500">@{dev.handle}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider transition-colors duration-200 ${
                    isOverloaded
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : isAvailable
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}
                >
                  {dev.loadStatus}
                </span>
              </div>

              <div className="mt-2 text-xs text-zinc-400 font-medium">
                {dev.role}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-zinc-800/80 pt-3 text-center">
                <div>
                  <div className="text-lg font-mono font-bold text-zinc-200">
                    {dev.activeReviewsCount}
                  </div>
                  <div className="text-[10px] text-zinc-500 uppercase">
                    Active Rev
                  </div>
                </div>

                <div>
                  <div className="text-lg font-mono font-bold text-zinc-200">
                    {dev.authoredPRsCount}
                  </div>
                  <div className="text-[10px] text-zinc-500 uppercase">
                    Authored
                  </div>
                </div>

                <div>
                  <div className="text-lg font-mono font-bold text-indigo-400">
                    {dev.avgTurnaroundHours}h
                  </div>
                  <div className="text-[10px] text-zinc-500 uppercase">
                    Turnaround
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Roster & Balance Matrix Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-200">
            Workload Distribution Matrix
          </h2>
          <span className="text-xs text-zinc-400">Sorted by Queue Pressure</span>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-medium">
                <th className="py-2.5">Engineer</th>
                <th className="py-2.5">Role</th>
                <th className="py-2.5">Open Reviews</th>
                <th className="py-2.5">Authored PRs</th>
                <th className="py-2.5">Review/Author Ratio</th>
                <th className="py-2.5">Avg Turnaround</th>
                <th className="py-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {members.map((dev) => {
                const ratio = (dev.activeReviewsCount / (dev.authoredPRsCount || 1)).toFixed(1);
                return (
                  <tr key={dev.id} className="hover:bg-zinc-800/50 transition-all duration-200 ease-in-out">
                    <td className="py-3 text-zinc-200 font-medium flex items-center gap-2">
                      <img
                        src={dev.avatarUrl}
                        alt=""
                        className="h-6 w-6 rounded-full object-cover border border-zinc-700"
                      />
                      <span>{dev.name}</span>
                    </td>
                    <td className="py-3 text-zinc-400">{dev.role}</td>
                    <td className="py-3 font-mono font-semibold text-zinc-200">
                      {dev.activeReviewsCount}
                    </td>
                    <td className="py-3 font-mono text-zinc-400">
                      {dev.authoredPRsCount}
                    </td>
                    <td className="py-3 font-mono text-zinc-300">
                      {ratio}x
                    </td>
                    <td className="py-3 font-mono text-indigo-400">
                      {dev.avgTurnaroundHours}h
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${
                          dev.loadStatus === 'overloaded'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : dev.loadStatus === 'available'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        }`}
                      >
                        {dev.loadStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
