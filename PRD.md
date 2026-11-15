# Product Requirements Document (PRD): DevPulse

**Document Version:** 1.0.0  
**Status:** Ready for Review & Approval  
**Role:** Principal Product Architect  
**Project:** DevPulse — Engineering Team Velocity & PR Tracker  

---

## 1. Product Overview & Core User Flows

### 1.1 Product Mission & Overview
**DevPulse** is a modern, high-performance web dashboard tailored for engineering managers, tech leads, and software teams. It provides real-time visibility into pull request (PR) health, code review cycle times, review capacity distribution, and sprint velocity. DevPulse isolates bottlenecks before they stall releases, turning opaque Git metadata into actionable engineering insights.

### 1.2 Core User Flows (Primary 3 Workflows)

```
[Workflow 1: Triage & Unblock]
Dashboard (/) ──> Filter Stale PRs (>48h) ──> Inspect Reviewer Bottleneck ──> Ping / Reassign Reviewer

[Workflow 2: Velocity & Cycle Time Analysis]
Navigation (/analytics) ──> Select Sprint / Date Window ──> Analyze Time-to-First-Review vs Merge Latency ──> Export Report

[Workflow 3: Team Workload & Review Load Balancing]
Navigation (/team) ──> View Reviewer Allocation Grid ──> Identify Overloaded vs Underutilized Engineers ──> Rebalance Review Routing
```

1. **Workflow 1: Stalled PR Triage & Bottleneck Resolution**
   - **User:** Tech Lead / Engineering Manager
   - **Goal:** Surface high-friction PRs stuck in review and resolve blockers.
   - **Step-by-Step Flow:**
     1. User lands on `/` (Overview Dashboard).
     2. Views the **Critical PR Queue** widget with pre-filtered tags: `Stale (>48h)`, `Changes Requested`, and `Missing Reviewer`.
     3. Clicks on an individual PR card/row to expand the contextual drawer with reviewer assignment history, comment count, and CI/CD status.
     4. Takes action (copies reviewer nudge link or flags as blocker).

2. **Workflow 2: Sprint Velocity & Cycle Time Trend Analysis**
   - **User:** Engineering Director / Scrum Lead
   - **Goal:** Measure continuous delivery efficiency and identify structural process delays.
   - **Step-by-Step Flow:**
     1. User navigates to `/analytics`.
     2. Selects the target repository and sprint date range using the top filter controls.
     3. Evaluates four key composite metrics:
        - **Pickup Latency:** Time from PR creation to first human review.
        - **Review Cycle Time:** Time from first review to final approval.
        - **Merge Time:** Time from approval to merge into target branch.
        - **PR Size vs. Review Speed Correlation:** Velocity by lines of code changed.
     4. Drills down into outliers to diagnose whether slow review was caused by PR complexity, CI failures, or reviewer availability.

3. **Workflow 3: Review Capacity & Workload Balance Inspection**
   - **User:** Engineering Manager
   - **Goal:** Prevent developer burnout and eliminate review debt by distributing code review loads fairly.
   - **Step-by-Step Flow:**
     1. User navigates to `/team`.
     2. Views the **Reviewer Load Matrix** detailing:
        - Active open review requests per engineer.
        - Average turnaround time (median hours to review).
        - Total authored PRs vs total reviewed PRs.
     3. Flags uneven distribution (e.g., senior engineers assigned 80% of critical reviews) to inform team assignment policies.

---

## 2. Tech Stack & Strict Constraints

| Layer | Selection | Specification / Constraint |
| :--- | :--- | :--- |
| **Framework** | **Next.js (App Router)** | TypeScript strictly enforced (`strict: true` in `tsconfig.json`). Server Components by default; Client Components (`'use client'`) strictly limited to interactive leaf nodes (sidebar toggles, filter controls, modals). |
| **Language** | **TypeScript 5.x** | Comprehensive domain interfaces for all entities (`PullRequest`, `Developer`, `VelocityMetrics`, `Repository`). No use of `any`. |
| **Styling** | **Tailwind CSS** | Pure utility-first styling. Zero runtime CSS-in-JS. No heavyweight component library bloat (avoiding Material UI, Chakra, AntD). All UI elements built with lightweight semantic HTML and Tailwind utility classes. |
| **Icons** | **Lucide Icons (`lucide-react`)** | Standardized tree-shakable icon set. Strict icon bounding box (`h-4 w-4` or `h-5 w-5`). |
| **State & Data Layer** | **Typed Mock Data Layer** | Located strictly in `src/data/mock.ts`. Export typed async repository query functions (e.g., `getOverviewMetrics()`, `getPullRequests()`, `getTeamMembers()`) returning Promise-wrapped fixtures to simulate network latency and ensure zero-friction swap with real GitHub/GitLab/REST/GraphQL APIs in Phase 2. |
| **Bundle & Perf Budget** | **Zero UI Bloat** | First load JS budget < 90KB gzip. No unnecessary heavy charting dependencies until evaluated; initial visualizations utilize responsive SVG/Tailwind bar charts and sparklines. |

---

## 3. Information Architecture & Route Map

### 3.1 Route Hierarchy

```
app/
├── layout.tsx                # Global Shell (Root HTML, Dark Mode font classes, Metadata)
├── (dashboard)/
│   ├── layout.tsx            # Dashboard Shell (Sidebar + Top Command Header + Main Viewport)
│   ├── page.tsx              # Route: / (Overview Dashboard)
│   ├── analytics/
│   │   └── page.tsx          # Route: /analytics (Velocity & Cycle Time Analytics)
│   ├── team/
│   │   └── page.tsx          # Route: /team (Team Review Load & Engineer Roster)
│   └── settings/
│       └── page.tsx          # Route: /settings (Repo Connections & Metric Thresholds)
```

### 3.2 Route Specifications

| Route Path | Page Title | Primary Purpose & Layout Elements |
| :--- | :--- | :--- |
| `/` | **Overview** | Executive snapshot: 4 key KPI stat cards (Active PRs, Avg Cycle Time, Stale PRs, Merge Rate), Active PR Queue table with status pill indicators, and High-Priority Blockers panel. |
| `/analytics` | **Analytics** | Deep-dive velocity metrics: Time-to-First-Review distribution, Cycle Time trends by week, PR size classification (Small/Medium/Large), and throughput breakdown. |
| `/team` | **Team Workload** | Reviewer load distribution table, individual velocity stats, PRs authored vs. reviewed balance, median review turnaround times. |
| `/settings` | **Settings** | Configuration for repository sync, stale PR thresholds (e.g., 24h vs 48h), alerting preferences, and team roster groupings. |

---

## 4. Component Hierarchy & UI Shell Specification

### 4.1 Shell Architecture & Layout Wireframe

```
+-----------------------------------------------------------------------------------+
|  [Sidebar]       |  [Top Command Header]                                          |
|  DevPulse Logo   |  Breadcrumb  |  Repo Selector  |  Search (Cmd+K)  | Profile     |
|  --------------- +----------------------------------------------------------------+
|  [ ] Overview    |  [Main Content Viewport]                                       |
|  [ ] Analytics   |  +------------------+ +------------------+ +------------------+|
|  [ ] Team        |  | KPI Metric Card  | | KPI Metric Card  | | KPI Metric Card  ||
|  [ ] Settings    |  +------------------+ +------------------+ +------------------+|
|  --------------- |                                                                |
|  [Collapse <]    |  +------------------------------------------------------------+|
|  v1.0.0 (Mock)   |  | Data Table / Interactive View Container                    ||
|                  |  +------------------------------------------------------------+|
+-----------------------------------------------------------------------------------+
```

### 4.2 Component Decomposition

1. **Persistent Left Sidebar (`src/components/layout/Sidebar.tsx`)**
   - States: Expanded (240px width) vs. Collapsed (64px icon-only width).
   - Navigation links with active route highlighting (`bg-zinc-850 text-white font-medium` with active left indicator bar).
   - Collapsible chevron trigger at bottom with state persistence.
   - Workspace/Organization badge at the top.

2. **Top Command Header (`src/components/layout/TopHeader.tsx`)**
   - Sticky top bar (`h-14`, hairline border bottom).
   - Breadcrumb navigation dynamically mirroring current route.
   - Quick filters: Active Repository dropdown and Date Window selector.
   - Global search input placeholder with keyboard shortcut cue (`⌘K`).
   - Status beacon (e.g. `● Mock Engine Active`).

3. **Metric Card Grid (`src/components/dashboard/MetricCard.tsx`)**
   - Reusable card component accepting: `title`, `value`, `delta` (+/- percentage), `trendPeriod`, and Lucide `icon`.
   - Subtle positive (emerald) vs negative (rose) visual badges.
   - Hairline border container with hover micro-elevation.

4. **PR Table & Card Modules (`src/components/dashboard/PRTable.tsx`)**
   - Column layout: PR Title & Branch, Author Avatar + Handle, Review Status Badge, CI/CD Status, Age / Cycle Time Counter, and Reviewer Avatars.
   - Status badge variants:
     - `Needs Review`: Amber pill (`bg-amber-500/10 text-amber-400 border-amber-500/20`)
     - `Approved`: Emerald pill (`bg-emerald-500/10 text-emerald-400 border-emerald-500/20`)
     - `Changes Requested`: Rose pill (`bg-rose-500/10 text-rose-400 border-rose-500/20`)
     - `Stale (>48h)`: Red highlight indicator

### 4.3 Color Palette & Aesthetic Guidelines
- **Aesthetic:** Minimalist, engineering-grade, dark-mode-first slate/zinc styling with high-density tabular typography and crisp hairline borders (`1px`).
- **Base Canvas:** `bg-zinc-950` (#09090b)
- **Card & Sidebar Background:** `bg-zinc-900` (#18181b) / `bg-zinc-900/50` with `backdrop-blur`
- **Card Hover / Active State:** `bg-zinc-800/60` (#27272a)
- **Borders & Dividers:** `border-zinc-800` (#27272a) and `border-zinc-800/80`
- **Typography:**
  - Primary text: `text-zinc-100` (High readability, font-sans)
  - Secondary/Muted: `text-zinc-400`
  - Sub-labels & Timestamps: `text-zinc-500`
  - Monospace (PR hashes, branch names, metrics): `font-mono text-xs text-zinc-300`
- **Status Accents:**
  - Success/Merged: `emerald-400` / `emerald-500`
  - Warning/Pending: `amber-400` / `amber-500`
  - Critical/Blocked: `rose-400` / `rose-500`
  - Primary Accent/Focus: `indigo-400` / `indigo-500`

---

## 5. Phase 1 Scaffolding Acceptance Criteria

Upon completion of Phase 1 scaffolding, the application must meet every criterion below:

- [ ] **Build & Type Safety:**
  - Clean execution of `npm run build` with zero TypeScript errors under strict mode.
  - Zero Next.js runtime or hydration console warnings/errors.
- [ ] **Structural Architecture & Shell:**
  - Root layout properly hosts the persistent collapsible sidebar and top header.
  - Sidebar smoothly toggles between expanded (240px) and collapsed (64px) modes without layout shifts.
  - Active routes are accurately highlighted in the navigation bar.
- [ ] **Complete Route Implementations:**
  - Route `/`: Displays the 4 metric cards, active PR list, and priority triage queue.
  - Route `/analytics`: Renders cycle time distribution widgets and velocity breakdown panels.
  - Route `/team`: Renders the engineer roster with reviewer load balance indicators.
  - Route `/settings`: Displays configuration sections for thresholds and repo sync.
- [ ] **Mock Data Layer Verification:**
  - `src/data/mock.ts` provides strictly typed, fully populated mock data contracts for PRs, developers, velocity stats, and repositories.
  - Data displays realistically across all views (realistic Git handles, branch names, commit hashes, cycle times).
- [ ] **Design System Fidelity:**
  - Dark mode aesthetic consistently applied across all viewports with precise 1px zinc borders (`border-zinc-800`).
  - Mobile/responsive viewport support: Sidebar collapses automatically on smaller viewports with graceful layout stacking.
- [ ] **Zero-Bloat Verification:**
  - Package dependencies limited strictly to `next`, `react`, `react-dom`, `lucide-react`, `tailwindcss`, and necessary build tooling. No third-party UI framework bloat.

---

*Awaiting user approval before initiating Phase 1 scaffolding.*
