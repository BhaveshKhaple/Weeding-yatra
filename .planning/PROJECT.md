# Wedding Yatra — Project Brief

**Type:** Two-Sided Cultural Tourism Marketplace (Solo MVP)  
**Updated:** 2026-03-16  
**Status:** Discovery Complete (Revised)  
**Confidence:** HIGH

---

## One-Liner

> A cultural tourism marketplace that connects foreign and regional travellers with authentic Indian wedding experiences — inspired by joinmywedding.com.

---

## Core Value

**The ONE thing that must work:**  
Hosts can publish an authentic Indian wedding experience. Travellers can discover, explore, and request to join — all from a mobile browser.

---

## Problem Statement

### For Travellers (Foreigners / Regional Visitors)
- Discovering genuine Indian cultural experiences (like attending a real wedding) is nearly impossible through generic travel platforms
- No dedicated marketplace exists for this niche cultural exchange
- Travellers have no trusted, structured way to request to join a private celebration

### For Hosts (Indian Couples / Families)
- Sharing their celebration with international guests is a meaningful gesture, but there's no platform designed for it
- No structured way to screen, approve, or manage requests from interested travellers
- Existing wedding tools are purely invite-management, not discovery-oriented

**Inspiration:** [joinmywedding.com](https://joinmywedding.com) — validates market and concept.

---

## User Roles

### Host (Supplier Side)
An Indian couple or their family representative who:
- Creates a public wedding listing on the platform
- Adds events (Haldi, Mehendi, Sangeet, etc.) with dates, times, and venues
- Uploads gallery photos to attract travellers
- Reviews, approves, or declines incoming traveller join requests
- Controls listing status (Open / Closed)

### Traveller (Demand Side)
A foreign or regional visitor who:
- Browses the public wedding directory (no account required to view)
- Filters by city and date
- Views full wedding detail pages
- Creates an account and submits a "Request to Join" with a personal introduction

---

## Technical Stack

### Frontend
| Concern | Choice | Rationale |
|---|---|---|
| Framework | React 18 | Component model ideal for dual-role dashboard + public directory |
| Build Tool | Vite | Instant HMR, minimal config, fast dev iteration for solo dev |
| Styling | Tailwind CSS v3 | Utility-first, mobile-first responsive, rapid iteration |
| Language | TypeScript | Type safety with Supabase client; catches role/permission bugs early |
| Routing | React Router v6 | `createBrowserRouter`, role-based nested routes |

### Backend / BaaS
| Concern | Choice | Rationale |
|---|---|---|
| Primary BaaS | Supabase | PostgreSQL + Auth + Storage + RLS — complete backend with zero backend code |
| Database | Supabase PostgreSQL | Relational model fits listings / events / requests / approvals |
| Authentication | Supabase Auth (email/password) | Role stored in `user_metadata` at sign-up |
| File Storage | Supabase Storage | Wedding gallery photos; public bucket with CDN delivery |
| Row-Level Security | Enabled on all tables | Hosts own their listing data; travellers can only INSERT requests |

### Deployment
| Concern | Choice | Rationale |
|---|---|---|
| Frontend Hosting | Vercel | Zero-config Vite deployment, global CDN, preview deployments |
| Environment Variables | Vercel + `.env.local` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| CI/CD | Vercel Git integration | Auto-deploy on push to `main` |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vercel (CDN)                             │
│         React + Vite + Tailwind SPA                            │
│                                                                 │
│  Public Routes              Host Dashboard    Traveller Dash   │
│  ├── /                      ├── /host         ├── /traveller   │
│  ├── /weddings (directory)  ├── /host/listing ├── /traveller/  │
│  ├── /weddings/:slug        ├── /host/events  │    requests    │
│  ├── /login                 ├── /host/gallery └── /traveller/  │
│  └── /signup                └── /host/requests    browse      │
└────────────────────────────┬────────────────────────────────────┘
                             │  @supabase/supabase-js
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Supabase                                │
│                                                                 │
│  Auth              Database (PostgreSQL)       Storage          │
│  ──────────        ──────────────────────────  ──────────────   │
│  email/pass        profiles (role: host|       wedding-photos/  │
│  sessions           traveller)                 (public bucket)  │
│  role stored       wedding_listings                             │
│  in metadata       wedding_events                               │
│                    join_requests                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (Planned)

### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, FK → `auth.users` |
| `role` | `text` | `'host'` or `'traveller'` |
| `full_name` | `text` | |
| `nationality` | `text` | Traveller-relevant; optional for host |
| `created_at` | `timestamptz` | |

### `wedding_listings`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `host_id` | `uuid` | FK → `profiles.id`, unique (one listing per host) |
| `slug` | `text` | Unique, URL-safe (auto-generated) |
| `bride_name` | `text` | |
| `groom_name` | `text` | |
| `wedding_date` | `date` | |
| `city` | `text` | Used for directory filtering |
| `venue_name` | `text` | |
| `description` | `text` | Host's story / couple description |
| `cover_photo_url` | `text` | CDN URL from Supabase Storage |
| `status` | `text` | `'open'` or `'closed'` |
| `created_at` | `timestamptz` | |

### `wedding_events`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `listing_id` | `uuid` | FK → `wedding_listings.id` |
| `name` | `text` | "Haldi", "Mehendi", etc. |
| `event_date` | `date` | |
| `event_time` | `time` | |
| `venue` | `text` | |
| `description` | `text` | Optional |

### `gallery_photos`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `listing_id` | `uuid` | FK → `wedding_listings.id` |
| `storage_path` | `text` | Supabase Storage object path |
| `public_url` | `text` | CDN URL |
| `created_at` | `timestamptz` | |

### `join_requests`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `listing_id` | `uuid` | FK → `wedding_listings.id` |
| `traveller_id` | `uuid` | FK → `profiles.id` |
| `message` | `text` | Traveller's introduction |
| `nationality` | `text` | Submitted with request |
| `selected_events` | `uuid[]` | Array of `wedding_events.id` |
| `status` | `text` | `'pending'`, `'approved'`, `'declined'` |
| `decline_reason` | `text` | Optional, set by host on decline |
| `submitted_at` | `timestamptz` | |

---

## Row-Level Security Policies (Critical)

| Table | Operation | Policy |
|---|---|---|
| `profiles` | SELECT own | `auth.uid() = id` |
| `profiles` | UPDATE own | `auth.uid() = id` |
| `wedding_listings` | SELECT | Public (all roles, including anon) |
| `wedding_listings` | INSERT / UPDATE / DELETE | Host only (`host_id = auth.uid()`) |
| `wedding_events` | SELECT | Public |
| `wedding_events` | INSERT / UPDATE / DELETE | Via listing ownership |
| `gallery_photos` | SELECT | Public |
| `gallery_photos` | INSERT / DELETE | Host only (via listing ownership) |
| `join_requests` | INSERT | Authenticated Traveller only |
| `join_requests` | SELECT own (traveller) | `traveller_id = auth.uid()` |
| `join_requests` | SELECT all (host) | Via listing ownership |
| `join_requests` | UPDATE status | Host only (via listing ownership) |

---

## Key Technical Decisions

### Decision 1: Role stored in `user_metadata` + `profiles` table
**Chosen:** Role assigned at sign-up, written to both Supabase `user_metadata` and a `profiles` table  
**Reason:** `user_metadata` is accessible in RLS policies via `auth.jwt() -> 'user_metadata' -> 'role'` for fine-grained access control. The `profiles` table allows relational joins for displaying traveller info on host's request dashboard.

### Decision 2: Public directory, no auth required to browse
**Chosen:** `wedding_listings` and `wedding_events` are publicly readable; Supabase anon key allowed on SELECT  
**Reason:** Maximises discovery. Travellers should be able to browse before deciding to sign up. Reduces friction for the demand side.

### Decision 3: Single wedding listing per Host (one-to-one)
**Chosen:** Each host account maps to exactly one listing  
**Reason:** Simplifies RLS, dashboard UX, and data model for MVP. Multi-listing support is a clear v2 upgrade.

### Decision 4: Join requests reference event IDs (not just attend/not attend)
**Chosen:** `selected_events uuid[]` array in `join_requests`  
**Reason:** Indian weddings are multi-ceremony. Travellers may want to attend only specific events (e.g., only Haldi). This enables hosts to make more informed approval decisions.

### Decision 5: Vite SPA (not Next.js)
**Chosen:** Vite React SPA with client-side routing  
**Reason:** Faster to scaffold, no SSR complexity for MVP. Public directory pages fetch data client-side — acceptable for MVP scale. Upgrade path to Next.js exists post-MVP for SEO.

### Decision 6: No real-time notifications for v1
**Chosen:** Dashboard polling / manual refresh for request status  
**Reason:** Supabase Realtime adds complexity and subscription overhead. At MVP scale (< 100 listings), manual refresh is perfectly acceptable.

---

## Constraints & Assumptions

### Hard Constraints
- Solo developer — no backend team
- No payments in MVP
- No custom domains
- No native mobile apps — responsive web only
- Vercel free/hobby tier deployment
- Supabase free tier (500MB DB, 1GB storage, 50k auth users)

### Assumptions
- Target scale: < 200 weddings and < 1,000 traveller accounts at MVP launch
- Primary browsing device: mobile (WhatsApp-discoverable via social sharing)
- Hosts are tech-comfortable enough to fill out a web form
- English-first for v1 (travellers are international)
- "Request to Join" is non-transactional — host–traveller coordination happens offline after approval

---

## Success Metrics (MVP)

| Metric | Target |
|---|---|
| Host listing creation time | < 10 minutes end-to-end |
| Traveller join request submission | < 3 minutes from landing on listing page |
| Mobile Lighthouse score (public listing page) | ≥ 80 |
| Core Web Vitals (LCP) on directory page | < 2.5s |

---

## Folder Structure (Target)

```
wedding-yatra/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/               # Base design system (Button, Input, Card, Badge, etc.)
│   │   ├── listing/          # Wedding listing display components
│   │   ├── host/             # Host-specific dashboard components
│   │   └── traveller/        # Traveller-specific components
│   ├── pages/
│   │   ├── auth/             # Login, SignUp (with role selection)
│   │   ├── public/           # Directory, Listing detail page
│   │   ├── host/             # Host dashboard pages
│   │   └── traveller/        # Traveller dashboard pages
│   ├── hooks/                # useWedding, useJoinRequests, useGallery
│   ├── lib/
│   │   └── supabase.ts       # Supabase client init
│   ├── types/                # TypeScript types matching DB schema
│   └── utils/                # slug generation, date formatting, etc.
├── .env.local
├── .planning/                # GSD planning artifacts
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Open Questions (Resolved)

| Question | Decision |
|---|---|
| Can anyone browse without signing up? | Yes — public directory is unauthenticated |
| Can a Traveller submit multiple requests to the same wedding? | No — one request per listing enforced at DB + UI level |
| Is the listing tied to one host forever? | Yes — host_id is immutable on the listing |
| How are events selected in the request? | Multi-select checkboxes from the listing's event list |
| Can a host reject without reason? | Yes — decline_reason is optional |

---

## Discovery Confidence

**Overall:** HIGH  
**Sources:** Supabase RLS docs, React Router v6 patterns, joinmywedding.com product analysis, Vercel deployment best practices

**Verified:**
- ✅ Supabase supports role-based RLS via `auth.jwt()` metadata
- ✅ Public SELECT policies allow unauthenticated browsing
- ✅ Array columns (`uuid[]`) supported natively in Supabase PostgreSQL
- ✅ Supabase Storage public bucket CDN pattern works for gallery
- ✅ Vite + React Router v6 `createBrowserRouter` is standard SPA routing pattern

---

## Next Step

```
Create project roadmap:
@[create-roadmap.md] (depth=quick)
```
