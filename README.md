# BBQ Judge

A web application for managing KCBS-style BBQ competitions. Organizers create competitions, register competitors, assign judges to tables, and advance through judging rounds. Judges score entries on appearance, taste, and texture. Table captains oversee scoring at their table.

## Setup

Install dependencies:

```bash
npm install
```

Set up the database:

```bash
cp .env.example .env  # or create .env with DATABASE_URL and AUTH_SECRET
npm run db:migrate
npm run db:seed
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3030](http://localhost:3030).

## Environment Variables

Create a `.env` file (see `.env.example`):

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret-here"
```

## Login Credentials (Dev Seed)

| Role | Login | Password |
|------|-------|----------|
| Organizer | organizer@bbq-judge.test | organizer123 |
| Table 1 Captain | CBJ-001 | 1234 |
| Table 2 Captain | CBJ-007 | 1234 |
| Judges 2–6 | CBJ-002 through CBJ-006 | 1234 |
| Judges 8–12 | CBJ-008 through CBJ-012 | 1234 |

### Seed Data Summary

- **Competition**: American Royal Open 2026 (ACTIVE)
- **12 judges** across 2 tables (6 per table)
- **6 competitors**: anonymous numbers 101–106
- **Chicken round** is ACTIVE with pre-submitted scores for Table 1 (competitors 101–104)
- **Competitor 104** has a DQ score (appearance=0) with a pending correction request
- **Competitors 105–106** and all of Table 2 await scoring

## Tech Stack

- [Next.js 14](https://nextjs.org) (App Router)
- [TypeScript](https://typescriptlang.org) (strict mode)
- [Tailwind CSS v3](https://tailwindcss.com)
- [Prisma 5](https://prisma.io) + SQLite
- [next-auth v5](https://authjs.dev) (beta)
- [Zustand](https://zustand.docs.pmnd.rs)
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- [Vitest](https://vitest.dev) for unit testing

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed development data |
| `npm run db:reset` | Reset database and re-seed |

## Project Structure

```
src/
  app/                    — Next.js App Router pages
    (auth)/login/         — Two-tab login (Judge / Organizer)
    (dashboard)/          — Dashboard shell (sidebar, top bar, mobile drawer)
      organizer/          — Competition management pages
      judge/              — Judge scoring dashboard
      captain/            — Table captain review dashboard
  features/               — Feature modules
    competition/          — Competition CRUD, CompetitionProvider context
    judging/              — Judge scoring
    scoring/              — Table captain scoring review
    tabulation/           — Results tabulation
    users/                — User management (planned)
  shared/                 — Shared code
    components/           — Design system + UI primitives
    constants/            — KCBS rules and enums
    lib/                  — Auth, Prisma, utilities
  middleware.ts           — Role-based route protection
prisma/
  schema.prisma           — Database schema
  seed.ts                 — Development seed data
```

## Features

### Auth & Navigation

- Two-tab login page: Judge (CBJ number + PIN) / Organizer (email + password)
- Role-based routing: middleware redirects to `/judge`, `/captain`, or `/organizer`
- Protected routes with callback URL redirect
- Dashboard shell with collapsible sidebar (Sheet drawer on mobile)
- Role-filtered navigation, competition selector, theme toggle, user menu

### Competition Management

- Create competitions with name, date, and location
- Register competitors with anonymous 3-digit numbers
- Assign judges to tables (6 seats per table) with captain designation
- Visual status stepper for category round progression
- Sequential category advancement (Chicken → Pork Ribs → Pork → Brisket)

### Judging

- Active category banner with progress ring
- Submission queue with pending/in-progress/submitted status
- Score card entry via slide-in Sheet panel (0–9 per dimension)
- DQ warning when any dimension scores 0
- Score cards lock on submission; corrections via table captain
- Anonymous numbers only — team names never shown to judges (BR-4)
- Other judges' scores never visible during active judging (BR-5)

### Table Captain / Scoring

- Per-judge progress tracking with status badges
- Score review table with DQ highlighting
- Correction request management (approve unlocks card, deny keeps lock)
- Submit category to organizer with validation (all judges done, no pending corrections)

### Tabulation & Results

- Live progress dashboard per category
- Ranked leaderboard with expandable per-judge score breakdowns
- Outlier detection (>2 pts from average)
- Winner declaration with confirmation and audit logging
- Export results as CSV or JSON
- Audit log viewer with filtering

## KCBS Rules

- **Categories**: Chicken, Pork Ribs, Pork, Brisket (mandatory)
- **Scoring**: 0 (DQ) to 9 (Outstanding) on appearance, taste, and texture
- **Sequential rounds**: Categories must be judged in order (BR-1)
- **No repeat competitors**: Same competitor cannot appear at the same table twice (BR-2)
- **Locked scores**: Submitted cards are locked; corrections via table captain (BR-3)
- **Captain gate**: Cannot submit until all judges done and corrections resolved (BR-6)
