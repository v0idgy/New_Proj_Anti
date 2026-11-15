import {
  PullRequest,
  Developer,
  VelocityMetrics,
  Repository,
  CycleTimeMetric,
  ThroughputMetric,
  SettingsConfig,
} from '@/types';

export const MOCK_DEVELOPERS: Developer[] = [
  {
    id: 'dev-1',
    name: 'Elena Rostova',
    handle: 'erostova',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Staff Systems Engineer',
    activeReviewsCount: 5,
    authoredPRsCount: 3,
    avgTurnaroundHours: 3.2,
    loadStatus: 'overloaded',
  },
  {
    id: 'dev-2',
    name: 'Marcus Vance',
    handle: 'mvance',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Senior Backend Engineer',
    activeReviewsCount: 2,
    authoredPRsCount: 4,
    avgTurnaroundHours: 5.8,
    loadStatus: 'optimal',
  },
  {
    id: 'dev-3',
    name: 'Sarah Chen',
    handle: 'schen',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Principal Frontend Architect',
    activeReviewsCount: 1,
    authoredPRsCount: 6,
    avgTurnaroundHours: 2.4,
    loadStatus: 'available',
  },
  {
    id: 'dev-4',
    name: 'Tariq Al-Mansoor',
    handle: 'talmansoor',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Platform & Infra Lead',
    activeReviewsCount: 4,
    authoredPRsCount: 2,
    avgTurnaroundHours: 8.5,
    loadStatus: 'optimal',
  },
  {
    id: 'dev-5',
    name: 'Aisha Patel',
    handle: 'apatel',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Full Stack Engineer',
    activeReviewsCount: 0,
    authoredPRsCount: 5,
    avgTurnaroundHours: 4.1,
    loadStatus: 'available',
  },
];

export const MOCK_REPOSITORIES: Repository[] = [
  {
    id: 'repo-1',
    name: 'frontend-core',
    description: 'Next.js App Router client application and design system',
    defaultBranch: 'main',
    openPRCount: 12,
  },
  {
    id: 'repo-2',
    name: 'api-gateway',
    description: 'High-throughput Go & gRPC service gateway',
    defaultBranch: 'main',
    openPRCount: 9,
  },
  {
    id: 'repo-3',
    name: 'data-pipeline',
    description: 'Real-time telemetry ingestion and Apache Kafka consumers',
    defaultBranch: 'master',
    openPRCount: 7,
  },
];

export const MOCK_PULL_REQUESTS: PullRequest[] = [
  {
    id: 'pr-1042',
    number: 1042,
    title: 'perf(cache): implement tiered edge memory cache with stale-while-revalidate',
    author: MOCK_DEVELOPERS[0],
    branch: 'feat/edge-cache-tier',
    targetBranch: 'main',
    status: 'needs_review',
    createdAt: '2026-11-15T10:14:00Z',
    updatedAt: '2026-11-15T15:20:00Z',
    linesAdded: 412,
    linesDeleted: 89,
    commentsCount: 6,
    ciStatus: 'passing',
    reviewers: [MOCK_DEVELOPERS[1], MOCK_DEVELOPERS[2]],
    repository: 'frontend-core',
    cycleTimeHours: 8.2,
    isStale: false,
  },
  {
    id: 'pr-1039',
    number: 1039,
    title: 'fix(auth): prevent race condition during session token rotation on concurrent requests',
    author: MOCK_DEVELOPERS[1],
    branch: 'fix/token-refresh-race',
    targetBranch: 'main',
    status: 'approved',
    createdAt: '2026-11-14T18:00:00Z',
    updatedAt: '2026-11-15T12:00:00Z',
    linesAdded: 84,
    linesDeleted: 26,
    commentsCount: 11,
    ciStatus: 'passing',
    reviewers: [MOCK_DEVELOPERS[0]],
    repository: 'api-gateway',
    cycleTimeHours: 18.0,
    isStale: false,
  },
  {
    id: 'pr-1035',
    number: 1035,
    title: 'refactor(telemetry): decouple ClickHouse ingest workers from HTTP dispatcher pool',
    author: MOCK_DEVELOPERS[3],
    branch: 'refactor/clickhouse-workers',
    targetBranch: 'master',
    status: 'stale',
    createdAt: '2026-11-12T08:30:00Z',
    updatedAt: '2026-11-13T09:15:00Z',
    linesAdded: 1250,
    linesDeleted: 840,
    commentsCount: 19,
    ciStatus: 'failing',
    reviewers: [MOCK_DEVELOPERS[0]],
    repository: 'data-pipeline',
    cycleTimeHours: 72.5,
    isStale: true,
  },
  {
    id: 'pr-1044',
    number: 1044,
    title: 'feat(ui): add accessible command palette shell with fuzzy route navigation',
    author: MOCK_DEVELOPERS[2],
    branch: 'feat/command-palette',
    targetBranch: 'main',
    status: 'changes_requested',
    createdAt: '2026-11-15T09:00:00Z',
    updatedAt: '2026-11-15T14:45:00Z',
    linesAdded: 310,
    linesDeleted: 14,
    commentsCount: 8,
    ciStatus: 'running',
    reviewers: [MOCK_DEVELOPERS[4]],
    repository: 'frontend-core',
    cycleTimeHours: 9.2,
    isStale: false,
  },
  {
    id: 'pr-1031',
    number: 1031,
    title: 'chore(deps): bump gRPC protocol buffers runtime and optimize serialization buffers',
    author: MOCK_DEVELOPERS[4],
    branch: 'chore/bump-protobuf',
    targetBranch: 'main',
    status: 'stale',
    createdAt: '2026-11-11T14:20:00Z',
    updatedAt: '2026-11-12T16:00:00Z',
    linesAdded: 62,
    linesDeleted: 48,
    commentsCount: 3,
    ciStatus: 'passing',
    reviewers: [MOCK_DEVELOPERS[3]],
    repository: 'api-gateway',
    cycleTimeHours: 96.0,
    isStale: true,
  },
  {
    id: 'pr-1045',
    number: 1045,
    title: 'feat(metrics): add real-time review turnaround histogram query endpoint',
    author: MOCK_DEVELOPERS[1],
    branch: 'feat/review-latency-hist',
    targetBranch: 'main',
    status: 'needs_review',
    createdAt: '2026-11-15T14:10:00Z',
    updatedAt: '2026-11-15T16:00:00Z',
    linesAdded: 180,
    linesDeleted: 12,
    commentsCount: 1,
    ciStatus: 'passing',
    reviewers: [MOCK_DEVELOPERS[2]],
    repository: 'frontend-core',
    cycleTimeHours: 4.1,
    isStale: false,
  },
];

export const MOCK_METRICS: VelocityMetrics = {
  activePRs: 28,
  activePRsDelta: -4.5,
  avgCycleTimeHours: 18.4,
  avgCycleTimeDelta: -12.3,
  stalePRCount: 4,
  stalePRDelta: -25.0,
  mergeRatePercent: 89.2,
  mergeRateDelta: +3.8,
  pickupLatencyHours: 3.4,
  reviewCycleHours: 11.8,
  mergeLatencyHours: 3.2,
};

export const MOCK_CYCLE_TIME_METRICS: CycleTimeMetric[] = [
  { category: 'Pickup', avgHours: 3.4, targetHours: 4.0, trend: 'improving' },
  { category: 'Review', avgHours: 11.8, targetHours: 12.0, trend: 'improving' },
  { category: 'Merge', avgHours: 3.2, targetHours: 2.5, trend: 'degrading' },
];

export const MOCK_THROUGHPUT: ThroughputMetric[] = [
  { week: 'W44 (Oct 28)', mergedCount: 34, openedCount: 38, medianCycleHours: 22.4 },
  { week: 'W45 (Nov 04)', mergedCount: 41, openedCount: 39, medianCycleHours: 19.8 },
  { week: 'W46 (Nov 11)', mergedCount: 46, openedCount: 42, medianCycleHours: 18.4 },
];

export const MOCK_SETTINGS: SettingsConfig = {
  staleThresholdHours: 48,
  targetPickupHours: 4,
  targetReviewHours: 12,
  maxReviewerLoad: 4,
  notificationsEnabled: true,
  activeRepo: 'all',
};

// Async Data Accessor Layer (Ready for API drop-in swap)
export async function getOverviewMetrics(): Promise<VelocityMetrics> {
  return Promise.resolve(MOCK_METRICS);
}

export async function getPullRequests(filter?: { status?: string; repository?: string }): Promise<PullRequest[]> {
  let list = [...MOCK_PULL_REQUESTS];
  if (filter?.status) {
    list = list.filter((pr) => pr.status === filter.status);
  }
  if (filter?.repository && filter.repository !== 'all') {
    list = list.filter((pr) => pr.repository === filter.repository);
  }
  return Promise.resolve(list);
}

export async function getTeamMembers(): Promise<Developer[]> {
  return Promise.resolve(MOCK_DEVELOPERS);
}

export async function getRepositories(): Promise<Repository[]> {
  return Promise.resolve(MOCK_REPOSITORIES);
}

export async function getAnalyticsData(): Promise<{
  metrics: VelocityMetrics;
  cycleTime: CycleTimeMetric[];
  throughput: ThroughputMetric[];
}> {
  return Promise.resolve({
    metrics: MOCK_METRICS,
    cycleTime: MOCK_CYCLE_TIME_METRICS,
    throughput: MOCK_THROUGHPUT,
  });
}

export async function getSettingsConfig(): Promise<SettingsConfig> {
  return Promise.resolve(MOCK_SETTINGS);
}
