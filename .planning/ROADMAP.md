# Wedding Yatra — Roadmap
**Created:** 2026-03-16  
**Depth:** Quick (4 phases)  
**Total v1 Requirements:** 37 across 7 categories  
**Milestone:** v1.0 MVP

---

## Phase Overview

| # | Phase | Requirements | Status |
|---|---|---|---|
| 1 | Foundation & Auth | AUTH-01 → AUTH-05 + SETUP | ✅ Complete |
| 2 | Host: Listing, Events & Gallery | LISTING-01→05, EVENT-01→05, GALLERY-01→04 | 🏃 Next |
| 3 | Public Directory & Traveller RSVP | BROWSE-01→06, RSVP-01→05 | 🔲 Not Started |
| 4 | Host Request Management & Launch | HOST-01→05 + deploy | 🔲 Not Started |

---

## Phase 1: Foundation & Auth

**Goal:** Project is running locally and deployed to Vercel. Both user roles can sign up, log in, and log out. Route protection is in place.

**Depends on:** Nothing (first phase)

**Requirements:**
- AUTH-01: User can sign up with email/password, selecting role (Host or Traveller)
- AUTH-02: User can log in with email/password
- AUTH-03: User can log out, session cleared
- AUTH-04: Session persists across browser refreshes
- AUTH-05: Unauthenticated users redirected to login from protected routes

**Also includes (project scaffolding — not in REQUIREMENTS.md, part of this phase):**
- Vite + React + TypeScript + Tailwind CSS project initialized
- Supabase project created; `profiles` table + RLS policies applied
- Environment variables configured (`.env.local` + Vercel)
- React Router v6 with role-based route guards (`/host/*`, `/traveller/*`)
- Vercel deployment linked to Git repository

**Success Criteria (what must be TRUE when Phase 1 completes):**
1. ✅ Running `npm run dev` starts the app locally without errors
2. ✅ A new user can sign up as Host or Traveller and land on their respective dashboard
3. ✅ A logged-in user can log out; visiting `/host` redirects them to `/login`
4. ✅ App is deployed and accessible on Vercel via a public URL
5. ✅ `profiles` table exists in Supabase with RLS enabled; row is created on sign-up

**Research flag:** Unlikely (well-understood stack)

---

## Phase 2: Host — Listing, Events & Gallery

**Goal:** A Host can fully build their public wedding listing: create couple details, add events (Haldi, Mehendi, etc.), upload gallery photos, and control whether the listing is Open or Closed.

**Depends on:** Phase 1 (Auth, scaffold, Supabase)

**Requirements:**
- LISTING-01: Host creates listing (couple names, date, city, venue, description, cover photo)
- LISTING-02: Host edits their listing
- LISTING-03: Host toggles listing status Open / Closed
- LISTING-04: One listing per host (enforced)
- LISTING-05: Listing immediately appears on the public directory when created
- EVENT-01: Host adds event (name, date, time, venue)
- EVENT-02: Host edits event
- EVENT-03: Host deletes event
- EVENT-04: Multiple events per listing
- EVENT-05: Events shown chronologically on public page
- GALLERY-01: Host uploads photos (Supabase Storage)
- GALLERY-02: Host deletes photos
- GALLERY-03: Photos shown in responsive grid on public detail page
- GALLERY-04: Upload restricted to JPG, PNG, WebP

**Success Criteria:**
1. ✅ Host can create a listing and see it appear in the public directory immediately
2. ✅ Host can add 3+ events and see them displayed in chronological order
3. ✅ Host can upload at least 5 photos and see them displayed in a grid on the listing detail page
4. ✅ Host can toggle the listing to "Closed" and it disappears from the public directory
5. ✅ All data is correctly scoped by RLS — host cannot modify another host's listing

**Research flag:** Unlikely (Supabase Storage + RLS is documented pattern)

---

## Phase 3: Public Directory & Traveller RSVP

**Goal:** Any visitor can browse the public wedding directory, filter by city and date, view a listing's full detail page, and (if logged in as Traveller) submit a "Request to Join" selecting specific events to attend.

**Depends on:** Phase 2 (listings must exist to browse)

**Requirements:**
- BROWSE-01: Unauthenticated visitor can browse the public directory
- BROWSE-02: Directory shows listing cards with couple names, cover photo, city, date, status
- BROWSE-03: Traveller can filter by city
- BROWSE-04: Traveller can filter by date range
- BROWSE-05: Traveller views full detail page (story, events, gallery, join requirements)
- BROWSE-06: Only "Open" listings shown in directory by default
- RSVP-01: Authenticated Traveller submits "Request to Join" from listing detail page
- RSVP-02: Request form collects: name, nationality, message, selected events
- RSVP-03: One request per Traveller per listing (enforced)
- RSVP-04: After submit, Traveller sees confirmation ("Request pending host approval")
- RSVP-05: Traveller dashboard shows status of all submitted requests (Pending/Approved/Declined)

**Success Criteria:**
1. ✅ An unauthenticated visitor can open the site, browse the directory, and view a listing detail page without logging in
2. ✅ Filtering by city returns only listings in that city; filtering by date returns listings in range
3. ✅ A Traveller can submit a join request to a specific listing and see their request on their dashboard as "Pending"
4. ✅ A Traveller cannot submit a second request to the same listing
5. ✅ Closed listings do not appear in the directory

**Research flag:** Unlikely (standard Supabase query patterns + React Router)

---

## Phase 4: Host Request Management & Launch

**Goal:** Hosts can review incoming join requests, see Traveller details, approve or decline requests, and the full marketplace loop is closed. App is polished for mobile and publicly shipped.

**Depends on:** Phase 3 (join requests must exist to manage)

**Requirements:**
- HOST-01: Host views all incoming join requests on their dashboard
- HOST-02: Each request shows Traveller name, nationality, message, and selected events
- HOST-03: Host approves a pending request
- HOST-04: Host declines a request (optionally with a reason)
- HOST-05: Dashboard shows summary counts (total / pending / approved / declined)

**Also includes (launch polish — not in REQUIREMENTS.md):**
- Mobile responsiveness audit and Tailwind breakpoint polish
- Loading states, empty states, and error handling throughout
- Final Vercel production deployment with custom `.env` configured

**Success Criteria:**
1. ✅ Host sees all pending requests on their dashboard with all submitted Traveller details
2. ✅ Host can approve a request; Traveller's dashboard immediately reflects "Approved" status on next load
3. ✅ Host can decline a request with an optional reason; Traveller sees "Declined"
4. ✅ Dashboard summary counts are accurate and update when requests change
5. ✅ The entire app is usable from a mobile browser at 375px viewport width
6. ✅ Production Vercel URL is live and all environment variables are set

**Research flag:** Unlikely (Supabase row UPDATE with RLS is standard)

---

## Requirement Coverage Verification

**Total v1 requirements: 37**

| REQ-ID | Category | Phase |
|---|---|---|
| AUTH-01 | Authentication | Phase 1 |
| AUTH-02 | Authentication | Phase 1 |
| AUTH-03 | Authentication | Phase 1 |
| AUTH-04 | Authentication | Phase 1 |
| AUTH-05 | Authentication | Phase 1 |
| LISTING-01 | Wedding Listing | Phase 2 |
| LISTING-02 | Wedding Listing | Phase 2 |
| LISTING-03 | Wedding Listing | Phase 2 |
| LISTING-04 | Wedding Listing | Phase 2 |
| LISTING-05 | Wedding Listing | Phase 2 |
| EVENT-01 | Wedding Events | Phase 2 |
| EVENT-02 | Wedding Events | Phase 2 |
| EVENT-03 | Wedding Events | Phase 2 |
| EVENT-04 | Wedding Events | Phase 2 |
| EVENT-05 | Wedding Events | Phase 2 |
| GALLERY-01 | Photo Gallery | Phase 2 |
| GALLERY-02 | Photo Gallery | Phase 2 |
| GALLERY-03 | Photo Gallery | Phase 2 |
| GALLERY-04 | Photo Gallery | Phase 2 |
| BROWSE-01 | Public Directory | Phase 3 |
| BROWSE-02 | Public Directory | Phase 3 |
| BROWSE-03 | Public Directory | Phase 3 |
| BROWSE-04 | Public Directory | Phase 3 |
| BROWSE-05 | Public Directory | Phase 3 |
| BROWSE-06 | Public Directory | Phase 3 |
| RSVP-01 | Traveller RSVP | Phase 3 |
| RSVP-02 | Traveller RSVP | Phase 3 |
| RSVP-03 | Traveller RSVP | Phase 3 |
| RSVP-04 | Traveller RSVP | Phase 3 |
| RSVP-05 | Traveller RSVP | Phase 3 |
| HOST-01 | Host Requests | Phase 4 |
| HOST-02 | Host Requests | Phase 4 |
| HOST-03 | Host Requests | Phase 4 |
| HOST-04 | Host Requests | Phase 4 |
| HOST-05 | Host Requests | Phase 4 |

**Coverage: 35/35 named requirements mapped** ✓  
*(Plus scaffolding + launch polish tasks in Phases 1 and 4)*

---

## Dependencies

```
Phase 1 → Phase 2 → Phase 3 → Phase 4
```

Each phase depends on the previous. No parallel tracks for MVP.
