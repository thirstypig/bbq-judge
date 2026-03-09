# Testing

## Unit Tests

Run with Vitest:

```bash
npm test          # single run
npm run test:watch # watch mode
```

### Test Coverage

| Module | File | Tests |
|--------|------|-------|
| competition | `utils/__tests__/validateNoRepeatCompetitor.test.ts` | BR-2 repeat competitor validation |
| tabulation | `utils/__tests__/tabulateCategory.test.ts` | Average calc, ranking, DQ flagging, outlier detection |
| judging | `schemas/__tests__/scorecardSchema.test.ts` | Score range 0-9, integer enforcement, DQ detection |

## Integration Smoke Test (Manual)

### Auth & Login
- [ ] Organizer can log in with `organizer@bbq-judge.test` / `organizer123`
- [ ] Judge CBJ-001 can log in with CBJ number `CBJ-001` / PIN `1234`
- [ ] Judge CBJ-007 can log in as table captain
- [ ] Unauthenticated user is redirected to `/login`
- [ ] Role mismatch redirects to correct dashboard (e.g., judge can't access `/organizer`)

### Competition Management (Organizer)
- [ ] Organizer can create a new competition
- [ ] Organizer can add competitors with unique 3-digit anonymous numbers
- [ ] System rejects duplicate anonymous number within same competition
- [ ] Organizer can assign judges to tables (6 seats max)
- [ ] System rejects duplicate seat assignment
- [ ] System rejects assigning same judge to same table twice

### Judging (Judge)
- [ ] Judge CBJ-002 sees Chicken as active category
- [ ] Judge sees anonymous numbers only — no team names (BR-4)
- [ ] Judge cannot see other judges' scores (BR-5)
- [ ] Judge can score a submission (appearance, taste, texture: 0-9)
- [ ] Submitted score card is locked (BR-3)
- [ ] Judge cannot edit a locked card directly
- [ ] Judge can request correction on locked card with reason (20+ chars)
- [ ] Score of 0 shows DQ warning but does not block submission

### Table Captain
- [ ] Captain CBJ-001 sees all 6 judges' scoring status for Table 1
- [ ] Captain sees progress bars per judge
- [ ] Captain can view all score cards in review table
- [ ] Captain can approve a correction request (unlocks the score card)
- [ ] Captain can deny a correction request
- [ ] Captain cannot submit Chicken until all judges have submitted all score cards
- [ ] Captain cannot submit if pending correction requests exist (BR-6)
- [ ] Captain can submit Chicken when all conditions met

### Category Advancement (Organizer)
- [ ] Organizer sees Table 1 Chicken as submitted on status page
- [ ] Organizer can advance to Pork Ribs only when no active category exists
- [ ] System prevents skipping categories (BR-1)
- [ ] After advancement, judges see new active category

### Tabulation & Results (Organizer)
- [ ] Results page shows live progress per category
- [ ] After all tables submit Chicken, tabulation runs and shows ranked results
- [ ] DQ entries appear at bottom of rankings
- [ ] Outlier scores are highlighted (>2 pts from average)
- [ ] Organizer can declare a winner
- [ ] Winner declaration is logged in audit log
- [ ] Export results as CSV includes de-anonymized team names
- [ ] Export results as JSON includes all score breakdowns

### Seed Data Verification
- [ ] Competition "American Royal Open 2026" exists with ACTIVE status
- [ ] 12 judges across 2 tables (6 each)
- [ ] 6 competitors (101-106)
- [ ] Chicken round is ACTIVE, others are PENDING
- [ ] Table 1 has pre-submitted score cards for competitors 101-104
- [ ] Competitor 104 has a DQ score (appearance=0) with pending correction
- [ ] Competitors 105-106 have no scores yet
- [ ] Table 2 has no scores yet
