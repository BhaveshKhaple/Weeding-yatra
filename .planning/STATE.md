# Project State — Wedding Yatra

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-03-16)

**Core value:** A cultural tourism marketplace that connects foreign and regional travellers with authentic Indian wedding experiences — hosts publish listings, travellers discover and request to join.  
**Current focus:** Phase 1 — Foundation & Auth

---

## Current Position

Phase: **2 of 4** (Host features)  
Plan: **Not started**  
Status: **Ready to plan Phase 2**  
Last activity: 2026-03-16 — Phase 1 complete (Foundation & Auth fully built and verified)

Progress: `░░░░░░░░░░ 0%`

---

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total Time | Avg/Plan |
|-------|-------|------------|----------|
| 1 — Foundation & Auth | — | — | — |
| 2 — Host: Listing, Events & Gallery | — | — | — |
| 3 — Public Directory & Traveller RSVP | — | — | — |
| 4 — Host Request Mgmt & Launch | — | — | — |

**Recent Trend:**
- Last 5 plans: —
- Trend: —

---

## Accumulated Context

### Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| Role model | Host + Traveller stored in `profiles.role` + `user_metadata` | Enables RLS and role-gated routing |
| Auth | Supabase email/password | Zero SMTP setup; OAuth is v2 |
| Browse auth | Public (anon) SELECT on listings | Maximises discovery; reduces sign-up friction |
| Listing cardinality | One per host | Simplifies RLS and UX for MVP |
| Join requests | Event-specific (`uuid[]`) | Multi-ceremony selection for informed host decisions |
| Real-time | None (manual refresh) | Sufficient at MVP scale; avoids Realtime overhead |
| Frontend | Vite SPA (not Next.js) | Faster scaffold; no SSR needed for MVP |

### Pending Todos

- [ ] Create Supabase project (dev env)
- [ ] Initialize Vite + React + TypeScript + Tailwind project
- [ ] Configure Vercel deployment with env vars

### Blockers/Concerns

None yet.

---

## Session Continuity

Last session: 2026-03-16  
Stopped at: Roadmap created — ready to plan Phase 1  
Resume with: `@[plan-phase.md] 1`
