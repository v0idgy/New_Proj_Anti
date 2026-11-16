'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { PullRequest, PRStatus, VelocityMetrics } from '@/types';
import { MOCK_PULL_REQUESTS, MOCK_METRICS } from '@/data/mock';

const STORAGE_KEY = 'devpulse_prs_v1';

export type SortField = 'createdAt' | 'title' | 'cycleTimeHours' | 'lines';
export type SortDirection = 'asc' | 'desc';

export interface FilterCriteria {
  searchQuery?: string;
  status?: PRStatus | 'all';
  repository?: string;
}

export function useEntityData(initialData: PullRequest[] = MOCK_PULL_REQUESTS) {
  const [items, setItems] = useState<PullRequest[]>(initialData);
  const [isMounted, setIsMounted] = useState(false);

  // Filter and Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PRStatus | 'all'>('all');
  const [repoFilter, setRepoFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Hydrate from localStorage once mounted on client to prevent SSR mismatches
  useEffect(() => {
    setIsMounted(true);
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load entity data from localStorage fallback:', error);
    }
  }, []);

  // Helper to persist state to localStorage
  const persistItems = useCallback((updatedItems: PullRequest[]) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      }
    } catch (error) {
      console.warn('Failed to persist entity data to localStorage:', error);
    }
  }, []);

  // 1. Add Item Handler
  const addItem = useCallback(
    (newItem: PullRequest) => {
      setItems((prev) => {
        const next = [newItem, ...prev];
        persistItems(next);
        return next;
      });
    },
    [persistItems]
  );

  // 2. Update Item Handler
  const updateItem = useCallback(
    (id: string, updates: Partial<PullRequest>) => {
      setItems((prev) => {
        const next = prev.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
        );
        persistItems(next);
        return next;
      });
    },
    [persistItems]
  );

  // 3. Delete Item Handler
  const deleteItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.filter((item) => item.id !== id);
        persistItems(next);
        return next;
      });
    },
    [persistItems]
  );

  // 4. Batch/Custom Filter Handler
  const filterItems = useCallback((criteria: FilterCriteria) => {
    if (criteria.searchQuery !== undefined) setSearchQuery(criteria.searchQuery);
    if (criteria.status !== undefined) setStatusFilter(criteria.status);
    if (criteria.repository !== undefined) setRepoFilter(criteria.repository);
  }, []);

  // Sorting handler with toggle support
  const toggleSort = useCallback((field: SortField) => {
    setSortField((currentField) => {
      if (currentField === field) {
        setSortDirection((currentDir) => (currentDir === 'asc' ? 'desc' : 'asc'));
        return field;
      }
      setSortField(field);
      setSortDirection('desc');
      return field;
    });
  }, []);

  // Reset helpers
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setRepoFilter('all');
    setSortField('createdAt');
    setSortDirection('desc');
  }, []);

  const resetToMock = useCallback(() => {
    setItems(MOCK_PULL_REQUESTS);
    persistItems(MOCK_PULL_REQUESTS);
  }, [persistItems]);

  // Filtered & Sorted Collection Memo
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Repository filter
    if (repoFilter !== 'all') {
      result = result.filter((item) => item.repository === repoFilter);
    }

    // Text search (matches title, PR number, branch, author name/handle, repository)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.number.toString().includes(q) ||
          item.branch.toLowerCase().includes(q) ||
          item.author.handle.toLowerCase().includes(q) ||
          item.author.name.toLowerCase().includes(q) ||
          item.repository.toLowerCase().includes(q)
        );
      });
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'cycleTimeHours':
          comparison = a.cycleTimeHours - b.cycleTimeHours;
          break;
        case 'lines':
          comparison = a.linesAdded + a.linesDeleted - (b.linesAdded + b.linesDeleted);
          break;
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [items, statusFilter, repoFilter, searchQuery, sortField, sortDirection]);

  // Dynamically derived metrics
  const metrics: VelocityMetrics = useMemo(() => {
    const totalActive = items.length;
    const staleCount = items.filter((p) => p.status === 'stale' || p.isStale).length;
    const avgCycle =
      items.length > 0
        ? Number((items.reduce((acc, curr) => acc + curr.cycleTimeHours, 0) / items.length).toFixed(1))
        : 0;
    const approvedCount = items.filter((p) => p.status === 'approved').length;
    const mergeRate = totalActive > 0 ? Math.round((approvedCount / totalActive) * 100) : 0;

    return {
      activePRs: totalActive,
      activePRsDelta: MOCK_METRICS.activePRsDelta,
      avgCycleTimeHours: avgCycle,
      avgCycleTimeDelta: MOCK_METRICS.avgCycleTimeDelta,
      stalePRCount: staleCount,
      stalePRDelta: MOCK_METRICS.stalePRDelta,
      mergeRatePercent: mergeRate > 0 ? mergeRate : MOCK_METRICS.mergeRatePercent,
      mergeRateDelta: MOCK_METRICS.mergeRateDelta,
      pickupLatencyHours: MOCK_METRICS.pickupLatencyHours,
      reviewCycleHours: MOCK_METRICS.reviewCycleHours,
      mergeLatencyHours: MOCK_METRICS.mergeLatencyHours,
    };
  }, [items]);

  return {
    items,
    filteredItems,
    isMounted,
    metrics,
    // Filter & Search states
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    repoFilter,
    setRepoFilter,
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
    toggleSort,
    // CRUD Handlers
    addItem,
    updateItem,
    deleteItem,
    filterItems,
    resetFilters,
    resetToMock,
  };
}
