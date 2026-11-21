# DevPulse — Engineering Team Velocity & PR Tracker

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.x-EC5990?style=flat-square&logo=react-hook-form)](https://react-hook-form.com/)
[![Zod](https://img.shields.io/badge/Zod-3.x-3068B7?style=flat-square&logo=zod)](https://zod.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#license)

**DevPulse** is a modern, high-performance engineering intelligence dashboard built for engineering managers, tech leads, and software teams. It provides real-time visibility into pull request (PR) health, code review turnaround times, reviewer workload balance, and sprint delivery velocity.

DevPulse turns opaque Git metadata into actionable workflow insights, helping teams isolate review bottlenecks before they delay release trains.

---

## Table of Contents

- [Core User Workflows](#core-user-workflows)
- [Key Features](#key-features)
- [Design System & UI/UX](#design-system--uiux)
- [System Architecture](#system-architecture)
- [Information Architecture & Route Map](#information-architecture--route-map)
- [Project Directory Structure](#project-directory-structure)
- [Technical Requirements](#technical-requirements)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Phase 2 API Integration Guide](#phase-2-api-integration-guide)
- [Contributing & License](#license)

---

## Core User Workflows

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             DevPulse Core Workflows                              │
└──────────────────────────────────────────────────────────────────────────────────┘

 [Workflow 1: Triage & Unblock]
 Dashboard (/) ──> Filter Stale PRs (>48h) ──> Inspect Review Bottleneck ──> Ping Reviewer

 [Workflow 2: Velocity & Cycle Time Analysis]
 Analytics (/analytics) ──> Select Sprint ──> Compare Pickup vs Merge Latency ──> Diagnose

 [Workflow 3: Review Load Balancing]
 Team (/team) ──> Inspect Concurrency Matrix ──> Identify Overloaded Devs ──> Rebalance Routing
```

1. **Stalled PR Triage & Bottleneck Resolution (`/`)**: Identifies high-friction pull requests stuck in review, flagging items exceeding SLAs (>48 hours) or blocked on changes requested.
2. **Velocity & Turnaround Funnel (`/analytics`)**: Breaks down cycle times into three discrete stages: pickup latency (first human review), review cycle (first review to approval), and merge latency (approval to branch merge).
3. **Review Capacity Balancing (`/team`)**: Monitors open reviews per engineer, tracks median turnaround times, and alerts leads when team members exceed concurrency limits (>4 open reviews) to prevent developer burnout.

---

## Key Features

- **Real-Time Interactive KPI Cards**: Metric cards displaying Active PRs, Average Cycle Time, Stale PR Count, and Sprint Merge Rate with dynamic period-over-period deltas. Clicking a card instantly filters the downstream queue or triggers latency sorting.
- **Interactive Pull Request DataTable**:
  - Full-text search across titles, PR `#number`, author handles, and Git branch names.
  - Multi-facet status filter chips (`All`, `Needs Review`, `Approved`, `Changes Requested`, `Stale (>48h)`).
  - Multi-column sort by title or created date with clear directional visual indicators.
  - Inline quick actions: single-click approval status toggling and two-step confirmation deletions.
- **Responsive Table-to-Card Collapse**:
  - **Desktop / Tablet (`md:block`)**: Crisp multi-column table layout with sortable headers and action controls.
  - **Mobile (`max-md:block` / `block md:hidden`)**: Gracefully collapses into touch-friendly stacked cards showing CI badges, diff counts (`+LOC -LOC`), comments, cycle latency, and action buttons.
- **Validated PR Registration Modal**: Built using **React Hook Form** + **Zod** schema validation (`CreatePRSchema`). Validates repository selection, branch naming standards, reviewer allocation constraints (1-3 reviewers), and positive line diff counts with optimistic UI updates.
- **Slide-Over Detail Drawer**: Contextual drawer displaying detailed review history, branch pipeline targets (`feat/branch → main`), visual line diff distribution bars, and direct reviewer ping shortcuts.
- **Local State & Persistence Fallback**: Powered by the custom `useEntityData` hook. All mutations (create, status toggle, delete) immediately update in-memory state and persist to browser `localStorage` (`devpulse_prs_v1`) with deterministic hydration guards.
- **Lightweight Toast Notifications**: Built-in, accessible toast notification center providing immediate feedback on user actions (e.g., item creation, filter changes, reviewer pings).

---

## Design System & UI/UX

DevPulse features an editorial, dark-mode-first aesthetic with strict attention to typography, spatial cadence, and micro-interactions:

- **Typography**: Powered by **Plus Jakarta Sans** (with **Inter** and system sans-serif fallbacks). Section headers and titles strictly employ `font-semibold` and `tracking-tight` paired with neutral slate body text (`text-zinc-400`).
- **Brand Palette (Crimson Red)**:
  - **Primary Brand Color (`red-600` / `#DC2626`)**: Solid fills for primary buttons (`.btn-primary`), active category filters, and active badge selections.
  - **Vibrant Hover (`red-500` / `#EF4444`)**: Button hover states, illuminated active route indicator bars (`shadow-[0_0_8px_rgba(239,68,68,0.7)]`), and input focus rings (`focus:ring-red-500`).
  - **Accent Highlights (`red-400` / `#F87171`)**: Pull request number identifiers (`#1045`), sort icons, branch arrows, and latency counters.
  - **Elevated Shadows (`shadow-red-500/25`)**: Subtle crimson glow on interactive elevation surfaces.
- **Neutral Surface Palette**: Crisp border hairlines (`border-zinc-800`), translucent elevated containers (`bg-zinc-900/60 backdrop-blur-sm`), and deep canvas foundation (`bg-zinc-950`).
- **Button System**:
  - Primary (`.btn-primary` / `<Button variant="primary">`): Solid red fill with 200ms ease transitions, subtle shadow, and active press scale (`active:scale-[0.98]`).
  - Secondary (`.btn-secondary` / `<Button variant="secondary">`): Bordered ghost style (`border border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800`).
- **Mobile Navigation Drawer**: Fixed overlay with `z-50` stacking, smooth slide-in animation, and an ambient `bg-black/80 backdrop-blur-md` dismissible backdrop.

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            DevPulse Architecture                                 │
└──────────────────────────────────────────────────────────────────────────────────┘

  Next.js App Router (Server-First Shell)
  └── RootLayout (src/app/layout.tsx)
      ├── ToastProvider (src/components/ui/Toast.tsx)
      └── AppShell (src/components/shell/AppShell.tsx)
          ├── Sidebar (src/components/shell/Sidebar.tsx)
          ├── TopHeader (src/components/shell/TopHeader.tsx)
          └── Page Views:
              ├── Overview:  src/app/page.tsx ──> InteractiveOverview.tsx
              ├── Analytics: src/app/analytics/page.tsx
              ├── Team:      src/app/team/page.tsx
              └── Settings:  src/app/settings/page.tsx

  Interactive & State Layer (Client Islands)
  ├── useEntityData (src/hooks/useEntityData.ts)
  │   ├── In-Memory Reactive State (items, filters, sorting)
  │   ├── Optimistic Mutations (addItem, updateItem, deleteItem)
  │   └── Persistence Engine (localStorage fallback + hydration guard)
  ├── Forms & Schemas (src/lib/schemas/pr.ts)
  │   └── Zod CreatePRSchema + React Hook Form resolver
  └── Data Layer (src/data/mock.ts)
      └── Typed Promise-wrapped fixtures ready for Octokit / REST API swap
```

### Key Architectural Tenets
1. **Server-First by Default**: Layout shells, metadata definitions, and heavy data fetching run in React Server Components. Interactive controls (search inputs, filters, modals, drawers) are isolated into client components (`'use client'`).
2. **Zero SSR Hydration Discrepancies**: All timestamps and date strings are formatted via deterministic helpers (`formatDate()` in `src/lib/utils.ts`), avoiding locale mismatches between server prerendering and browser hydration.
3. **Optimistic Local Mutations**: User actions (creating a PR, approving, deleting) trigger immediate state updates in React memory with automatic localStorage synchronization, ensuring zero interface lag.
4. **No Heavy UI Bloat**: Built purely with semantic HTML, Tailwind CSS, and Lucide icons—eschewing heavy third-party component libraries to guarantee sub-90KB initial bundle transfers.

---

## Information Architecture & Route Map

| Route | Type | Purpose | Primary Components |
| :--- | :--- | :--- | :--- |
| **`/`** | Server + Client Island | Engineering Velocity Overview & Live Triage Queue | `InteractiveOverview`, `EntityTable`, `MetricCard`, `CreatePRModal`, `PRDetailDrawer` |
| **`/analytics`** | Server Component | Cycle time funnel breakdown & PR size correlation | `MetricCard`, `CycleTimeSLAChart`, `ThroughputTable` |
| **`/team`** | Server Component | Review capacity, active workload balance & developer roster | `CapacityAlertBanner`, `TeamMemberCard`, `WorkloadDistributionMatrix` |
| **`/settings`** | Server Component | Turnaround SLAs, connected repositories & webhook specs | `SLAThresholdsCard`, `RepositoryList`, `DataArchitectureCard` |

---

## Project Directory Structure

```
New_Proj_Anti/
├── .antigravity/            # Workspace rules and development guidelines
├── src/
│   ├── app/                 # Next.js App Router root
│   │   ├── analytics/       # /analytics route view
│   │   │   └── page.tsx
│   │   ├── team/            # /team route view
│   │   │   └── page.tsx
│   │   ├── settings/        # /settings route view
│   │   │   └── page.tsx
│   │   ├── globals.css      # Tailwind directives, fonts, button components
│   │   ├── icon.svg         # Application favicon
│   │   ├── layout.tsx       # Root layout wrapping AppShell & ToastProvider
│   │   └── page.tsx         # / route view entry point
│   ├── components/
│   │   ├── dashboard/       # Interactive dashboard orchestrators
│   │   │   └── InteractiveOverview.tsx
│   │   ├── features/        # Core business feature components
│   │   │   └── EntityTable.tsx
│   │   ├── modals/          # Dialogs and slide-over drawers
│   │   │   ├── CreatePRModal.tsx
│   │   │   └── PRDetailDrawer.tsx
│   │   ├── shell/           # Persistent layout framing
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopHeader.tsx
│   │   └── ui/              # Atom / Design system primitives
│   │       ├── Button.tsx
│   │       ├── CIStatusBadge.tsx
│   │       ├── MetricCard.tsx
│   │       ├── PRStatusPill.tsx
│   │       └── Toast.tsx
│   ├── data/                # Seed data & async mock providers
│   │   └── mock.ts
│   ├── hooks/               # Custom React state hooks
│   │   └── useEntityData.ts
│   ├── lib/                 # Shared utilities and validation schemas
│   │   ├── schemas/
│   │   │   └── pr.ts        # Zod validation schema
│   │   └── utils.ts         # Deterministic date and string formatting
│   └── types/               # TypeScript domain model definitions
│       └── index.ts
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind configuration & brand tokens
├── tsconfig.json            # Strict TypeScript configuration
└── package.json             # Project dependencies & scripts
```

---

## Technical Requirements

Before running DevPulse, ensure you have the following installed on your machine:

- **Node.js**: `v18.17.0` or higher (Node `v20.x` LTS recommended)
- **Package Manager**: `npm` (v9+), `pnpm` (v8+), or `yarn` (v1.22+)
- **Operating System**: macOS, Linux, or Windows (WSL recommended for Windows)
- **Browser**: Modern evergreen browser (Chrome, Firefox, Safari, Edge)

---

## Getting Started

### 1. Clone & Enter Repository
```bash
git clone <repository-url>
cd New_Proj_Anti
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The application will hot-reload automatically as you edit files.

### 4. Build for Production
To generate an optimized production bundle:
```bash
npm run build
```

### 5. Run Production Server
```bash
npm run start
```
The production server will start on [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

In the project root, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with hot-module replacement |
| `npm run build` | Compiles the TypeScript application and creates an optimized production build |
| `npm run start` | Runs the compiled production server on port `3000` |
| `npm run typecheck` | Executes `tsc --noEmit` to validate strict TypeScript type compliance |

---

## Phase 2 API Integration Guide

DevPulse was intentionally architected to allow replacing the mock layer with live GitHub or GitLab APIs without modifying UI components:

1. **Data Layer Contract (`src/data/mock.ts`)**:
   - The query functions (`getOverviewMetrics()`, `getPullRequests()`, `getTeamMembers()`, `getRepositories()`) return Promises matching the domain interfaces defined in `src/types/index.ts`.
2. **Replacing Mock Queries with Octokit / REST**:
   - Swap the in-memory array queries in `src/data/mock.ts` with calls to `@octokit/rest` or the GitHub GraphQL API.
   - Example mapper:
     ```ts
     import { Octokit } from '@octokit/rest';
     import { PullRequest } from '@/types';

     const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

     export async function getPullRequests(): Promise<PullRequest[]> {
       const { data } = await octokit.pulls.list({ owner: 'org', repo: 'repo' });
       return data.map(mapGitHubPRToDomain);
     }
     ```
3. **Webhook Subscriptions**:
   - Route GitHub Webhook events (`pull_request.opened`, `pull_request.closed`, `pull_request_review.submitted`) to a Next.js API route (`src/app/api/webhooks/route.ts`) to invalidate or push real-time updates.

---

## License

This project is licensed under the [MIT License](LICENSE).
