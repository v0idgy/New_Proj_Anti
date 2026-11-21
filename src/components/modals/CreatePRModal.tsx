'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, GitPullRequest, GitBranch, Plus, AlertCircle } from 'lucide-react';
import { CreatePRSchema, CreatePRFormValues } from '@/lib/schemas/pr';
import { PullRequest } from '@/types';
import { MOCK_DEVELOPERS } from '@/data/mock';

interface CreatePRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePR: (pr: PullRequest) => void;
}

export function CreatePRModal({ isOpen, onClose, onCreatePR }: CreatePRModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePRFormValues>({
    resolver: zodResolver(CreatePRSchema),
    defaultValues: {
      title: '',
      repository: 'frontend-core',
      branch: 'feat/',
      targetBranch: 'main',
      authorId: MOCK_DEVELOPERS[0].id,
      reviewerIds: [MOCK_DEVELOPERS[1].id],
      linesAdded: 150,
      linesDeleted: 25,
    },
  });

  const selectedReviewerIds = watch('reviewerIds') || [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleReviewer = (devId: string) => {
    if (selectedReviewerIds.includes(devId)) {
      if (selectedReviewerIds.length > 1) {
        setValue(
          'reviewerIds',
          selectedReviewerIds.filter((id) => id !== devId),
          { shouldValidate: true }
        );
      }
    } else {
      if (selectedReviewerIds.length < 3) {
        setValue('reviewerIds', [...selectedReviewerIds, devId], {
          shouldValidate: true,
        });
      }
    }
  };

  const onFormSubmit: SubmitHandler<CreatePRFormValues> = (data) => {
    const author =
      MOCK_DEVELOPERS.find((d) => d.id === data.authorId) || MOCK_DEVELOPERS[0];
    const reviewers = MOCK_DEVELOPERS.filter((d) =>
      data.reviewerIds.includes(d.id)
    );
    const newNumber = Math.floor(1000 + Math.random() * 9000);

    const newPR: PullRequest = {
      id: `pr-${newNumber}`,
      number: newNumber,
      title: data.title,
      author,
      branch: data.branch,
      targetBranch: data.targetBranch,
      status: 'needs_review',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      linesAdded: data.linesAdded,
      linesDeleted: data.linesDeleted,
      commentsCount: 0,
      ciStatus: 'running',
      reviewers,
      repository: data.repository,
      cycleTimeHours: 0.1,
      isStale: false,
    };

    onCreatePR(newPR);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl p-6 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 border border-red-500/30 text-red-400">
              <GitPullRequest className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-zinc-100">
                Register New Pull Request
              </h2>
              <p className="text-xs text-zinc-400">
                Register an active branch into DevPulse velocity tracking.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 text-xs">
          {/* PR Title */}
          <div>
            <label className="block font-medium text-zinc-200 mb-1">
              Pull Request Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              id="pr-title-input"
              {...register('title')}
              placeholder="e.g. feat(auth): add passkey authentication support"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
            />
            {errors.title && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400 font-mono">
                <AlertCircle className="h-3 w-3" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Repo & Branch Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block font-medium text-zinc-200 mb-1">
                Target Repository <span className="text-rose-400">*</span>
              </label>
              <select
                {...register('repository')}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors font-mono"
              >
                <option value="frontend-core">frontend-core</option>
                <option value="api-gateway">api-gateway</option>
                <option value="data-pipeline">data-pipeline</option>
              </select>
              {errors.repository && (
                <p className="mt-1 text-[11px] text-rose-400 font-mono">
                  {errors.repository.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium text-zinc-200 mb-1">
                Base Branch <span className="text-rose-400">*</span>
              </label>
              <select
                {...register('targetBranch')}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors font-mono"
              >
                <option value="main">main</option>
                <option value="master">master</option>
                <option value="develop">develop</option>
              </select>
            </div>
          </div>

          {/* Source Branch */}
          <div>
            <label className="block font-medium text-zinc-200 mb-1">
              Source Branch Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <GitBranch className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                id="pr-branch-input"
                {...register('branch')}
                placeholder="feat/my-new-feature"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-8 pr-3 py-2 font-mono text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>
            {errors.branch && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400 font-mono">
                <AlertCircle className="h-3 w-3" />
                {errors.branch.message}
              </p>
            )}
          </div>

          {/* Author Selection */}
          <div>
            <label className="block font-medium text-zinc-200 mb-1">
              Author <span className="text-rose-400">*</span>
            </label>
            <select
              {...register('authorId')}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
            >
              {MOCK_DEVELOPERS.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name} (@{dev.handle}) — {dev.role}
                </option>
              ))}
            </select>
          </div>

          {/* Reviewers Multi-select Pills */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-medium text-zinc-200">
                Assign Reviewers (1-3) <span className="text-rose-400">*</span>
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">
                {selectedReviewerIds.length}/3 selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {MOCK_DEVELOPERS.map((dev) => {
                const isSelected = selectedReviewerIds.includes(dev.id);
                return (
                  <button
                    type="button"
                    key={dev.id}
                    onClick={() => toggleReviewer(dev.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-all duration-200 ${
                      isSelected
                        ? 'border-red-500 bg-red-600 text-white shadow-sm shadow-red-500/30 font-medium'
                        : 'border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <img
                      src={dev.avatarUrl}
                      alt=""
                      className="h-3.5 w-3.5 rounded-full object-cover"
                    />
                    <span>@{dev.handle}</span>
                  </button>
                );
              })}
            </div>
            {errors.reviewerIds && (
              <p className="mt-1 text-[11px] text-rose-400 font-mono">
                {errors.reviewerIds.message}
              </p>
            )}
          </div>

          {/* Lines Added / Deleted */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-medium text-zinc-200 mb-1">
                Lines Added (+) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                {...register('linesAdded', { valueAsNumber: true })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-emerald-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
              />
              {errors.linesAdded && (
                <p className="mt-1 text-[11px] text-rose-400 font-mono">
                  {errors.linesAdded.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium text-zinc-200 mb-1">
                Lines Deleted (-) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                {...register('linesDeleted', { valueAsNumber: true })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-rose-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
              />
              {errors.linesDeleted && (
                <p className="mt-1 text-[11px] text-rose-400 font-mono">
                  {errors.linesDeleted.message}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-pr-btn"
              disabled={isSubmitting}
              className="btn-primary"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Register Pull Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
