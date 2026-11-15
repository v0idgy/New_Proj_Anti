export type PRStatus = 'needs_review' | 'approved' | 'changes_requested' | 'stale';

export type CIStatus = 'passing' | 'failing' | 'running';

export type WorkloadStatus = 'optimal' | 'overloaded' | 'available';

export interface Developer {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  role: string;
  activeReviewsCount: number;
  authoredPRsCount: number;
  avgTurnaroundHours: number;
  loadStatus: WorkloadStatus;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  author: Developer;
  branch: string;
  targetBranch: string;
  status: PRStatus;
  createdAt: string;
  updatedAt: string;
  linesAdded: number;
  linesDeleted: number;
  commentsCount: number;
  ciStatus: CIStatus;
  reviewers: Developer[];
  repository: string;
  cycleTimeHours: number;
  isStale: boolean;
}

export interface VelocityMetrics {
  activePRs: number;
  activePRsDelta: number;
  avgCycleTimeHours: number;
  avgCycleTimeDelta: number;
  stalePRCount: number;
  stalePRDelta: number;
  mergeRatePercent: number;
  mergeRateDelta: number;
  pickupLatencyHours: number;
  reviewCycleHours: number;
  mergeLatencyHours: number;
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  defaultBranch: string;
  openPRCount: number;
}

export interface CycleTimeMetric {
  category: 'Pickup' | 'Review' | 'Merge';
  avgHours: number;
  targetHours: number;
  trend: 'improving' | 'degrading' | 'steady';
}

export interface ThroughputMetric {
  week: string;
  mergedCount: number;
  openedCount: number;
  medianCycleHours: number;
}

export interface SettingsConfig {
  staleThresholdHours: number;
  targetPickupHours: number;
  targetReviewHours: number;
  maxReviewerLoad: number;
  notificationsEnabled: boolean;
  activeRepo: string;
}
