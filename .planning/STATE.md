# Project State — Wedding Yatra

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-03-16)

**Core value:** A cultural tourism marketplace that connects foreign and regional travellers with authentic Indian wedding experiences — hosts publish listings, travellers discover and request to join.  
**Current focus:** Phase 2 — Host: Listing, Events & Gallery

---

## Current Position

Phase: **2 of 4** (Host features)  
Plan: **02-04-events-management-PLAN.md (Completed)**  
Status: **Executing Phase 2 plans**  
Last activity: 2026-03-16 — Phase 2 Plan 4 complete (Events Timeline CRUD)

Progress: `████████░░ 75%`

---

## Performance Metrics

**Velocity:**
- Total plans completed: 7
- Average duration: ~1 day
- Total execution time: < 1.5 days

**By Phase:**

| Phase | Plans | Total Time | Avg/Plan |
|-------|-------|------------|----------|
| 1 — Foundation & Auth | 3 | < 1d | ~1h |
| 2 — Host: Listing, Events & Gallery | 4/6 | < 1d | ~1h |
| 3 — Public Directory & Traveller RSVP | — | — | — |
| 4 — Host Request Mgmt & Launch | — | — | — |

**Recent Trend:**
- Last 5 plans: 02-02, 02-03, 02-04
- Trend: Consistent and stable

---

## Accumulated Context

### Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| Role model | Host + Traveller stored in `profiles.role` + `user_metadata` | Enables RLS and role-gated routing |
| Auth | Supabase email/password | Zero SMTP setup |
| Browse auth | Public (anon) SELECT on listings | Maximises discovery |
| UI/UX | Framer Motion + Lenis | Scrollytelling aesthetic for marketing & listing pages |
| Component UI | Tailwind CSS v3 | Rapid responsive development |
| Lenis scope | Only activated on immersive public pages (`/`, `/weddings*`) | Prevents conflict with fixed dashboard elements |
| AnimatePresence | Root `AppLayout` in `router.tsx` wraps `<Outlet>` | Ensures motion works correctly on route swap |

### Pending Todos

None

### Blockers/Concerns

None yet.

---

## Session Continuity

Last session: 2026-03-16  
Stopped at: Phase 2 Plan 4 complete. Next: 02-05-gallery-upload-PLAN.md  
Resume file: None
