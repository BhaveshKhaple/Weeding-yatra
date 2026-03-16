# Summary: Phase 4 — Plan 01 — Host Requests Data Layer & Hook

**Objective:** Extend `useJoinRequests` with host-specific fetch and mutation capabilities, add host-facing TypeScript types, expose all necessary state.

**Completed:** 2026-03-17

---

## Tasks Completed

### 1. ✅ `extend_types` — JoinRequestStatus + JoinRequestWithTraveller (types.ts)
- **Commit:** d0c5389
- **Files:** `src/lib/types.ts`
- Added `JoinRequestStatus = 'pending' | 'approved' | 'declined'` union type for type-safe mutations
- Fixed `JoinRequestWithTraveller.profiles` to be `| null` — Supabase join correctly returns `null` when no profile row is matched (was previously non-nullable, which would have caused runtime type mismatches)

### 2. ✅ `add_host_fetch` — fetchHostRequests(listingId) (useJoinRequests.ts)
- **Commit:** d0c5389
- **Files:** `src/hooks/useJoinRequests.ts`
- Added `fetchHostRequests(listingId)` — queries `join_requests` with a `profiles` join:
  ```
  .select('*, profiles(full_name, nationality)')
  .eq('listing_id', listingId)
  .order('submitted_at', { ascending: false })
  ```
- Added `loading` state (separate from `submitting`) to track fetch in-progress
- Returns `JoinRequestWithTraveller[]` — each request includes traveller name & nationality

### 3. ✅ `add_update_status` — updateRequestStatus(id, status, reason?) (useJoinRequests.ts)
- **Commit:** d0c5389
- **Files:** `src/hooks/useJoinRequests.ts`
- Added `updateRequestStatus(requestId, status, declineReason?)` mutation
- Only persists `decline_reason` when `status === 'declined'` and reason is non-empty
- Reuses existing `submitting` and `error` states for loading and error tracking
- Returns `{ success: boolean; error?: string }` for optimistic update rollback support

---

## Deviations

**Auto-applied (no permission needed):**
- `JoinRequestWithTraveller.profiles` changed from non-nullable to `| null` — the plan specified this but the type was already in `types.ts` from a previous partial change with the wrong nullability. Corrected to match Supabase join semantics.
- Imports in `useJoinRequests.ts` updated to pull `JoinRequestStatus` and `JoinRequestWithTraveller` from types.ts

**No architectural changes or breaking API changes were made.**

---

## Verification

- ✅ `npx tsc --noEmit` — exits with 0 errors
- ✅ All existing functions (`submitRequest`, `checkExistingRequest`, `fetchMyRequests`) preserved exactly
- ✅ New exports: `fetchHostRequests`, `updateRequestStatus`, `loading`

---

## RLS SQL — Required in Supabase (Checkpoint)

Before executing Plan 04-02, the following two policies must exist on `join_requests` in Supabase:

```sql
-- Policy 1: Host can read all requests for their listing
CREATE POLICY "Host can read own listing requests"
ON join_requests FOR SELECT
USING (
  listing_id IN (
    SELECT id FROM wedding_listings WHERE host_id = auth.uid()
  )
);

-- Policy 2: Host can update request status (approve / decline)
CREATE POLICY "Host can update request status"
ON join_requests FOR UPDATE
USING (
  listing_id IN (
    SELECT id FROM wedding_listings WHERE host_id = auth.uid()
  )
)
WITH CHECK (
  listing_id IN (
    SELECT id FROM wedding_listings WHERE host_id = auth.uid()
  )
);
```

To verify existing policies, run this in Supabase SQL Editor:
```sql
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'join_requests'
ORDER BY policyname;
```

---

## Next Steps

Execute Plan 04-02: Host Requests UI, Action Modal & Optimistic Updates
→ `@[.planning/phases/04-host-request-management-launch/04-02-requests-ui-modal-PLAN.md]`
