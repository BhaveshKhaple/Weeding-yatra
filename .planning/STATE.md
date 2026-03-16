# Project State — Wedding Yatra

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-03-16)

**Core value:** A cultural tourism marketplace that connects foreign and regional travellers with authentic Indian wedding experiences — hosts publish listings, travellers discover and request to join.  
**Current focus:** Phase 2 — Host: Listing, Events & Gallery

---

## Current Position

Phase: **3 of 4** (Public Directory & Traveller RSVP) — **🏗️ IN PROGRESS**  
Plan: **03-03-rsvp-database-hook-PLAN.md (Completed)**  
Status: **Plan 03-03 done. Ready for 03-04.**  
Last activity: 2026-03-17 — Phase 3 Plan 3 complete (RSVP Database & Hook)

Progress: `██████████ 100% Phase 2 | ██████░░░░ 60% Phase 3 | 70% Overall`

---

## Performance Metrics

**Velocity:**
- Total plans completed: 9
- Average duration: ~1 day
- Total execution time: < 2 days

**By Phase:**

| Phase | Plans | Total Time | Avg/Plan |
|-------|-------|------------|----------|
| 1 — Foundation & Auth | 3/3 ✅ | < 1d | ~1h |
| 2 — Host: Listing, Events & Gallery | 6/6 ✅ | < 1d | ~1h |
| 3 — Public Directory & Traveller RSVP | — | — | — |
| 4 — Host Request Mgmt & Launch | — | — | — |

**Recent Trend:**
- Last 5 plans: 02-03, 02-04, 02-05, 02-06
- Trend: Blazing fast — Phase 2 completed in a single session!

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

Last session: 2026-03-17  
Stopped at: **Phase 3 Plan 3 complete**. Next: Execute 03-04-rsvp-ui-whatsapp-PLAN.md.  
Resume file: `.planning/phases/03-public-directory-traveller-rsvp/03-04-rsvp-ui-whatsapp-PLAN.md`
