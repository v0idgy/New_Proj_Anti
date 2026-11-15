# Product Requirements Document (PRD): Phase 2 — Interactive Core & Dynamic State

**Document Version:** 2.0.0  
**Status:** Ready for Architecture Review & Approval  
**Role:** Principal Product Architect  
**Project:** DevPulse — Engineering Team Velocity & PR Tracker  

---

## 1. Overview & Phase 2 Objectives

Phase 1 established the foundational design system, dark-mode shell, route skeletons, and static mock contracts. **Phase 2 transforms DevPulse into a responsive, fully interactive web application** with client-side reactive state, real-time filtering/sorting, modal workflows, optimistic collections, and toast notifications.

### Primary Objectives:
1. **Interactive State & Data Filtering:** Enable real-time filtering, searching, and sorting across pull requests, team rosters, and repository views using React state and custom hooks.
2. **Interactive Modals & Validated Forms:** Implement a "Register New Pull Request / Review Request" modal driven by `react-hook-form` and `zod` validation, updating the local collection with optimistic feedback.
3. **Drill-down Metric Card Interactions:** Transform static summary KPI cards into interactive filter triggers (e.g., clicking "Stale PRs" instantly isolates stale records in the queue).
4. **Actionable Toast Feedback:** Provide lightweight, non-blocking toast notifications for user interactions (PR registration, reviewer assignment, threshold updates).

---

## 2. State Management Strategy

### 2.1 State Architecture & Scope
To maintain zero bloat and preserve Next.js App Router performance, state is organized into **scoped client state** backed by `src/data/mock.ts` seed fixtures:

```
[Server Pre-rendering / Seed Data] (src/data/mock.ts)
                │
                ▼
[Client State Provider / Custom Hook] (usePRStore / useTeamStore)
  ├── prList: PullRequest[]           (Optimistically mutable)
  ├── activeFilter: PRFilterState     (status, repository, search, sort)
  └── selectedPR: PullRequest | null  (Drawer inspection state)
                │
                ├───────► Filter & Search Utility Pipeline
                ├───────► Dynamic KPI Metric Recalculation
                └───────► Form Mutation & Optimistic Collection Insertion
```

### 2.2 Custom Hooks & Filtering Specifications
1. **`usePullRequests(initialData: PullRequest[])`:**
   - **Local State:**
     - `prs`: Array of `PullRequest` initialized from `MOCK_PULL_REQUESTS`.
     - `searchQuery`: Debounced text query matching against PR title, number (e.g., `#1042`), branch name, or author handle.
     - `selectedStatus`: Filter by status (`all` | `needs_review` | `approved` | `changes_requested` | `stale`).
     - `selectedRepo`: Filter by repository (`all` | `frontend-core` | `api-gateway` | `data-pipeline`).
     - `sortBy`: Sorting field (`createdAt` | `cycleTime` | `linesChanged` | `commentsCount`) and direction (`asc` | `desc`).
   - **Exposed Actions:**
     - `addPullRequest(newPR: NewPRInput)`: Optimistically prepends record to local array.
     - `setStatusFilter(status: PRStatus | 'all')`: Updates active filter state.
     - `setRepoFilter(repo: string)`: Updates active repository filter.
     - `setSearch(query: string)`: Updates query.
     - `resetFilters()`: Clears search and filters back to default.

2. **Downstream Recalculation:**
   - Active KPI metrics automatically derive from the filtered collection or overall store, ensuring counts (e.g., active PR badge in the sidebar and header) stay in sync.

---

## 3. Interactive Modals & Forms Specification

### 3.1 "Register New Pull Request" Modal (`CreatePRModal.tsx`)
A clean, accessible modal dialog overlay styled with the zinc/slate aesthetic and hairline borders.

- **Trigger:** "New Pull Request" button in Top Header and Overview dashboard.
- **Form Technology:** `react-hook-form` coupled with `@hookform/resolvers/zod` and `zod` for type-safe client validation.
- **Keyboard & Accessibility:**
  - `Escape` key closes the modal.
  - Backdrop blur click dismissal.
  - Initial input auto-focus and trap focus inside modal container.

### 3.2 Form Schema & Validation Rules (`src/lib/schemas/pr.ts`)

```typescript
import { z } from 'zod';

export const CreatePRSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  repository: z.enum(['frontend-core', 'api-gateway', 'data-pipeline'], {
    required_error: 'Please select a repository',
  }),
  branch: z
    .string()
    .min(3, 'Branch name must be at least 3 characters')
    .regex(/^[a-z0-9._/-]+$/, 'Branch name must follow standard Git slug format (e.g., feat/auth-fix)'),
  targetBranch: z.enum(['main', 'master', 'develop']),
  authorId: z.string().min(1, 'Please select a PR author'),
  reviewerIds: z
    .array(z.string())
    .min(1, 'At least one reviewer must be assigned')
    .max(3, 'A maximum of 3 reviewers can be assigned'),
  linesAdded: z.coerce.number().int().min(1, 'Lines added must be at least 1'),
  linesDeleted: z.coerce.number().int().min(0, 'Lines deleted cannot be negative'),
});

export type CreatePRFormValues = z.infer<typeof CreatePRSchema>;
```

### 3.3 Optimistic UI Updates
1. Upon submit button click:
   - Form validates inputs via Zod schema.
   - If invalid, displays inline error badges (`text-rose-400 text-xs font-mono`).
   - If valid, modal instantly closes, a new `PullRequest` record is constructed with a generated ID (`pr-1046`), timestamp (`now`), and initial status `needs_review`.
   - The new PR is optimistically prepended to the top of the queue with a subtle pulse/highlight animation.
   - Triggers a success toast notification.

---

## 4. Interactive UI Enhancements

### 4.1 Clickable Metric Cards as Viewport Filters
KPI cards on `/` (Overview) transition from static display cards into interactive filter toggles:
- **Click "Active Pull Requests":** Resets status filter to display all active PRs.
- **Click "Avg Cycle Time":** Toggles sort order by `cycleTimeHours` (descending to inspect slowest PRs first).
- **Click "Stale Pull Requests":** Filters active queue strictly to records with `status === 'stale'`.
- **Visual Feedback:**
  - Active card receives an indigo border halo (`ring-1 ring-indigo-500 border-indigo-500/60 bg-zinc-800/80`).
  - Active filter pill appears above the table with a "Clear filter (`✕`)" chip.

### 4.2 Lightweight Toast Notification System (`ToastProvider.tsx`)
A dependency-free or ultra-lightweight toast system:
- **Position:** Bottom-right corner (`fixed bottom-4 right-4 z-50`).
- **Variants:**
  - `success`: Emerald accent border with `CheckCircle2` icon (e.g., *"PR #1046 created successfully"*).
  - `info`: Indigo accent border with `Info` icon (e.g., *"Filter applied: Stale PRs"*).
  - `warning`: Amber accent border with `AlertTriangle` icon (e.g., *"Reviewer load threshold exceeded"*).
- **Behavior:** Auto-dismisses after 4 seconds; supports manual close button.

### 4.3 Contextual PR Detail Drawer (`PRDetailDrawer.tsx`)
- Clicking any PR card/row opens a slide-over right sheet (drawer) displaying:
  - Full title, Git commit hash, branch tags.
  - Review status stepper: `Opened` $\rightarrow$ `First Review` $\rightarrow$ `Approved` $\rightarrow$ `Merged`.
  - Reviewer list with quick "Nudge Reviewer" or "Reassign" button.
  - Lines of code diff breakdown bar.

---

## 5. Acceptance Criteria & Verification Matrix

| Area | Acceptance Criteria |
| :--- | :--- |
| **Type Safety & Build** | - `npm run typecheck` (`tsc --noEmit`) passes with zero errors.<br>- Form inputs strictly typed to `CreatePRFormValues` without `any`. |
| **Form Validation** | - Submitting an empty form blocks submission and displays inline field errors.<br>- Submitting with valid data closes modal, clears form fields, and inserts the item into the queue. |
| **Metric Card Filtering** | - Clicking "Stale PRs" card filters list to only stale items (count matches card number).<br>- Active card highlights with visual state; "Clear Filter" button resets list. |
| **Search & Sort** | - Search input immediately filters PRs by title, author handle, or PR number.<br>- Selecting sort options (Cycle Time, Lines Changed) reorders rows accurately. |
| **Toast Notifications** | - Creating a PR triggers a persistent toast for 4 seconds in the bottom right corner.<br>- Toast contains title, description, and close button. |
| **Responsive Shell** | - Modal and drawer adapt gracefully to mobile screens ($< 768px$) without horizontal scroll or clipping.<br>- Esc key and backdrop clicks dismiss open overlays. |
| **Zero Console Errors** | - Zero hydration mismatch warnings and zero React unhandled exceptions in browser console. |

---

*Awaiting product review and approval before beginning Phase 2 implementation.*
