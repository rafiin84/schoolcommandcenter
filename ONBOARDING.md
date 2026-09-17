# School Command Center

A Next.js dashboard for the Zoho Classes / Tamil Nadu school-deployment team to track onboarding progress, exceptions, and district-level rollout health. All data is currently mock/illustrative — there is no live backend yet.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**, shadcn-style components (`src/components/ui`), Phosphor/Lucide icons
- **Zustand** for client state (`src/store`), **TanStack Query** for data fetching hooks (`src/hooks`)
- **Zod** + **react-hook-form** for schemas/forms, **sonner** for toasts
- Mock data layer under `src/lib/mock-data` (deterministic PRNG-based factories) backing an in-memory `database.ts`

## Getting started

```bash
npm install
npm run dev      # starts on http://localhost:3411 by convention in this project
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Project structure

- `src/app/(dashboard)/` — routed pages: `overview`, `education-map`, `alerts` (+ `[alertId]` detail), `zoho-access`, `directory`, `notifications`
- `src/components/` — organized by domain: `dashboard/`, `alerts/`, `map/`, `directory/`, `zoho/`, `notifications/`, `ai/`, plus shared `layout/`, `shared/`, and base `ui/` primitives
- `src/lib/api/` — typed fetch/query functions per domain, all backed by mock data (no real network calls yet)
- `src/lib/mock-data/` — factories generating districts, contacts, alerts, KPIs, notifications, etc.
- `src/store/` — Zustand stores: map filters, scope (geography selection), UI state
- `src/types/` — shared TypeScript types per domain

## Current state / conventions

- All write actions (e.g. changing an alert's status) are **simulated only** — they show a toast confirming the change but do not persist anywhere. This is intentional and surfaced in the UI itself ("This change is illustrative only and is not persisted to a backend").
- No backend/API integration yet — everything reads from the mock factories in `src/lib/mock-data`.
- No git history yet; the repo was scaffolded and built up locally before first commit.
- Repo lives at `/Users/rafi-9540/Vibe Coding/School Command Center`.

## Where to look for X

- Adding a new dashboard page → follow the pattern in `src/app/(dashboard)/alerts/` (page + hook in `src/hooks/use-alerts.ts` + api in `src/lib/api/alerts.ts` + mock factory in `src/lib/mock-data/alert-factory.ts`)
- Nav items → `src/components/navigation/nav-items.tsx`
- Design tokens / global styles → `src/app/globals.css`
