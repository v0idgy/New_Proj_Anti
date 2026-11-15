import React from 'react';
import { getOverviewMetrics, getPullRequests } from '@/data/mock';
import { InteractiveOverview } from '@/components/dashboard/InteractiveOverview';

export default async function OverviewPage() {
  const metrics = await getOverviewMetrics();
  const pullRequests = await getPullRequests();

  return (
    <InteractiveOverview
      initialMetrics={metrics}
      initialPullRequests={pullRequests}
    />
  );
}
