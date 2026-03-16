# Plan: Phase 3 — RSVP Database Schema & Hook

## Objective

Create the `join_requests` table in Supabase (if not already present as a migration), update TypeScript types, build the `useJoinRequests.ts` hook for creating and fetching RSVP join requests, and enforce the one-request-per-listing constraint.

## Requirements Addressed

- [ ] **RSVP-01**: Authenticated Traveller submits "Request to Join" from listing detail page
- [ ] **RSVP-03**: One request per Traveller per listing (enforced)

## Context Files

Read these before starting:
- @[.planning/PROJECT.md] — `join_requests` schema definition
- @[src/types/supabase.ts] — current DB types (no join_requests yet)
- @[src/lib/types.ts] — JoinRequest interface already defined
- @[src/lib/supabase.ts] — Supabase client
- @[src/hooks/useWeddingListing.ts] — reference pattern for hooks

## Tasks

<task name="join_requests_migration" type="auto">
**What:** Create a SQL migration to add the `join_requests` table to the Supabase database.

**How:**
1. Create `supabase/migrations/004_join_requests.sql`
2. Table schema (from PROJECT.md):
   ```sql
   create table if not exists public.join_requests (
     id          uuid primary key default gen_random_uuid(),
     listing_id  uuid not null references public.wedding_listings(id) on delete cascade,
     traveller_id uuid not null references public.profiles(id) on delete cascade,
     message     text not null default '',
     nationality text not null default '',
     guest_count integer not null default 1,
     selected_events uuid[] default '{}',
     status      text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
     decline_reason text,
     submitted_at timestamptz not null default now(),
     unique(listing_id, traveller_id)
   );
   ```
3. Add RLS policies:
   - `SELECT` for travellers: `traveller_id = auth.uid()`
   - `SELECT` for hosts: via listing ownership (`listing_id IN (SELECT id FROM wedding_listings WHERE host_id = auth.uid())`)
   - `INSERT` for authenticated travellers only: `auth.uid() IS NOT NULL` and role check
   - `UPDATE` for hosts only: update `status` and `decline_reason` where listing belongs to host
4. Add the unique constraint `(listing_id, traveller_id)` to enforce one request per traveller per listing
5. Note: Added `guest_count` column (not in original schema) per user's RSVP form requirement for specifying number of guests

**Files to modify:**
- `supabase/migrations/004_join_requests.sql` — CREATE

**Verification:**
```bash
# Apply migration via Supabase Dashboard SQL editor or CLI
# Verify table exists with: SELECT * FROM join_requests LIMIT 0;
```

**Done when:**
- [ ] `join_requests` table exists in Supabase
- [ ] Unique constraint on `(listing_id, traveller_id)` enforced
- [ ] RLS policies restrict access properly
- [ ] `guest_count` column is included
</task>

<task name="update_typescript_types" type="auto">
**What:** Update `supabase.ts` types and `types.ts` to include `join_requests` table and `guest_count` field.

**How:**
1. Add `join_requests` table definition to `src/types/supabase.ts` under `Tables`
2. Update `JoinRequest` interface in `src/lib/types.ts` to include `guest_count: number`
3. Add a convenience type `JoinRequestInsert` for form submit payloads

**Files to modify:**
- `src/types/supabase.ts` — UPDATE (add join_requests table)
- `src/lib/types.ts` — UPDATE (add guest_count to JoinRequest)

**Verification:**
```bash
npx tsc --noEmit
```

**Done when:**
- [ ] `join_requests` in `Database` interface
- [ ] `JoinRequest` includes `guest_count`
- [ ] No TypeScript errors
</task>

<task name="join_requests_hook" type="auto">
**What:** Create `useJoinRequests.ts` hook for RSVP operations.

**How:**
1. Create `src/hooks/useJoinRequests.ts`
2. Functions:
   - `submitRequest(data: JoinRequestInsert): Promise<{ success: boolean; error?: string }>` — inserts into `join_requests`. Handle the unique constraint violation gracefully (return "You've already requested to join this wedding")
   - `checkExistingRequest(listingId: string, travellerId: string): Promise<JoinRequest | null>` — checks if a request already exists for this user + listing combo
   - `fetchMyRequests(travellerId: string): Promise<JoinRequest[]>` — fetches all requests by the current traveller (for dashboard in 03-05)
3. Use `useAuth()` context to get the current user ID
4. Return `{ submitRequest, checkExistingRequest, fetchMyRequests, submitting, error }`

**Files to modify:**
- `src/hooks/useJoinRequests.ts` — CREATE

**Verification:**
```bash
npx tsc --noEmit src/hooks/useJoinRequests.ts
```

**Done when:**
- [ ] Hook compiles without errors
- [ ] `submitRequest` handles duplicate constraint error gracefully
- [ ] `checkExistingRequest` returns existing request or null
- [ ] `fetchMyRequests` returns all requests for a traveller
</task>

## Success Criteria

At plan completion:
- [ ] `join_requests` table created in Supabase with RLS
- [ ] Unique constraint prevents duplicate requests
- [ ] TypeScript types updated
- [ ] Hook ready for use by RSVP form component
- [ ] No breaking changes to existing features

## Commit Message Template

```
feat(phase3): RSVP database schema and hook

03-03: join_requests table + useJoinRequests hook
- Migration with RLS policies and unique constraint
- TypeScript types updated for join_requests
- Hook: submit, check existing, fetch my requests

Requirements: RSVP-01, RSVP-03
```
