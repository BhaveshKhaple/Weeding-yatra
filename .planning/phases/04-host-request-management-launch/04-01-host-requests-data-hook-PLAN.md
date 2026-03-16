# Plan: Phase 4 — Host Requests Data Layer & Hook

## Objective

Extend the `useJoinRequests` hook with host-specific capabilities: fetching all incoming requests for a host's listing (with traveller profile info joined), and mutating request status (approve / decline with optional reason). Add the `updateRequestStatus` function and new derived types. This is the data foundation every other Phase 4 plan depends on.

## Requirements Addressed

- [ ] **HOST-01**: Host views all incoming join requests on their dashboard
- [ ] **HOST-02**: Each request shows Traveller name, nationality, message, and selected events
- [ ] **HOST-03**: Host approves a pending request
- [ ] **HOST-04**: Host declines a request (optionally with a reason)
- [ ] **HOST-05**: Dashboard shows summary counts (total / pending / approved / declined)

## Context Files

Read these before starting:
- @[src/hooks/useJoinRequests.ts] — existing hook; we are EXTENDING it
- @[src/lib/types.ts] — JoinRequest, JoinRequestWithListing; we'll add JoinRequestWithTraveller
- @[.planning/PROJECT.md] — `join_requests` schema + RLS policies (see §Database Schema and §RLS)
- @[.planning/STATE.md] — key decisions log

## Tasks

<task name="extend_types" type="auto">
**What:** Add `JoinRequestWithTraveller` type to `src/lib/types.ts` — a join request enriched with the traveller's profile info (name + nationality). Used exclusively by the host-side request view.

**How:**
1. Open `src/lib/types.ts`
2. Add the following after the existing `JoinRequestWithListing` interface:
   ```ts
   // Host-facing: join request enriched with traveller profile info
   export interface JoinRequestWithTraveller extends JoinRequest {
     profiles: Pick<Profile, 'full_name' | 'nationality'> | null
   }
   ```
3. Also add a `JoinRequestStatus` union type for type-safe status updates:
   ```ts
   export type JoinRequestStatus = 'pending' | 'approved' | 'declined'
   ```

**Files to modify:**
- `src/lib/types.ts` — ADD two new types

**Verification:**
```bash
npx tsc --noEmit
```

**Done when:**
- [ ] `JoinRequestWithTraveller` type exported from `types.ts`
- [ ] `JoinRequestStatus` union type exported
- [ ] No TS compilation errors
</task>

<task name="add_host_fetch" type="auto">
**What:** Add `fetchHostRequests(listingId)` function to `useJoinRequests`. This fetches all join requests for a given listing joined with the traveller's `profiles` row.

**How:**
1. Open `src/hooks/useJoinRequests.ts`
2. Add a new state variable for loading: `const [loading, setLoading] = useState(false)`
3. Add the `fetchHostRequests` function:
   ```ts
   const fetchHostRequests = async (
     listingId: string
   ): Promise<JoinRequestWithTraveller[]> => {
     setLoading(true)
     try {
       const { data, error: dbError } = await supabase
         .from('join_requests')
         .select(`
           *,
           profiles (
             full_name,
             nationality
           )
         `)
         .eq('listing_id', listingId)
         .order('submitted_at', { ascending: false })

       if (dbError) throw dbError
       return (data as JoinRequestWithTraveller[]) ?? []
     } catch (err) {
       console.error('Error fetching host requests:', err)
       return []
     } finally {
       setLoading(false)
     }
   }
   ```
4. Expose `fetchHostRequests` and `loading` in the returned object.

> **Important — RLS note:** The Supabase policy on `join_requests` allows hosts to SELECT requests where the request's `listing_id` points to a listing they own (`host_id = auth.uid()`). Confirm this policy exists in the Supabase dashboard before testing. If it's missing, add the following policy in SQL Editor:
> ```sql
> CREATE POLICY "Host can read own listing requests"
> ON join_requests FOR SELECT
> USING (
>   listing_id IN (
>     SELECT id FROM wedding_listings WHERE host_id = auth.uid()
>   )
> );
> ```

**Files to modify:**
- `src/hooks/useJoinRequests.ts` — ADD `fetchHostRequests` + `loading` state

**Verification:**
```bash
npx tsc --noEmit
```

**Done when:**
- [ ] `fetchHostRequests(listingId)` compiles without errors
- [ ] Returns `JoinRequestWithTraveller[]`
- [ ] `loading` state exposed from hook
</task>

<task name="add_update_status" type="auto">
**What:** Add `updateRequestStatus(requestId, status, declineReason?)` function to `useJoinRequests`. This is the mutation used when a host approves or declines a request.

**How:**
1. In `src/hooks/useJoinRequests.ts`, add:
   ```ts
   const updateRequestStatus = async (
     requestId: string,
     status: JoinRequestStatus,
     declineReason?: string
   ): Promise<{ success: boolean; error?: string }> => {
     setSubmitting(true)
     setError(null)
     try {
       const updatePayload: Partial<JoinRequest> = { status }
       if (status === 'declined' && declineReason?.trim()) {
         updatePayload.decline_reason = declineReason.trim()
       }

       const { error: dbError } = await supabase
         .from('join_requests')
         .update(updatePayload)
         .eq('id', requestId)

       if (dbError) throw dbError
       return { success: true }
     } catch (err: any) {
       console.error('Error updating request status:', err)
       const message = err.message || 'Failed to update request.'
       setError(message)
       return { success: false, error: message }
     } finally {
       setSubmitting(false)
     }
   }
   ```
2. Add `updateRequestStatus` to the hook's return object.
3. Import `JoinRequestStatus` and `JoinRequestWithTraveller` from `../lib/types`.

> **RLS note:** The `join_requests` UPDATE policy must allow the host to update status. The project's planned policy is:
> ```sql
> CREATE POLICY "Host can update request status"
> ON join_requests FOR UPDATE
> USING (
>   listing_id IN (
>     SELECT id FROM wedding_listings WHERE host_id = auth.uid()
>   )
> )
> WITH CHECK (
>   listing_id IN (
>     SELECT id FROM wedding_listings WHERE host_id = auth.uid()
>   )
> );
> ```
> Verify this exists in Supabase or create it before testing.

**Files to modify:**
- `src/hooks/useJoinRequests.ts` — ADD `updateRequestStatus`

**Verification:**
```bash
npx tsc --noEmit
```

**Done when:**
- [ ] `updateRequestStatus` compiled and returned from hook
- [ ] Handles `decline_reason` correctly (only set on `declined` status)
- [ ] Returns `{ success, error? }` shape
</task>

<task name="verify_rls_checkpoint" type="checkpoint:human-verify">
**What to verify — Supabase RLS policies for Phase 4:**

Before building the UI, confirm these two RLS policies exist on the `join_requests` table in your Supabase project (Dashboard → Table Editor → `join_requests` → RLS Policies):

1. **Host SELECT policy** — "Host can read own listing requests" using the `listing_id IN (SELECT id FROM wedding_listings WHERE host_id = auth.uid())` predicate
2. **Host UPDATE policy** — "Host can update request status" with the same predicate (both USING and WITH CHECK)

**How to verify:**
1. Open Supabase Dashboard → Authentication → Policies → `join_requests` table
2. Confirm both policies appear and are enabled
3. Alternatively run in SQL Editor:
   ```sql
   SELECT policyname, cmd
   FROM pg_policies
   WHERE tablename = 'join_requests'
   ORDER BY policyname;
   ```
   Expected rows: at least `Host can read own listing requests` (SELECT) and `Host can update request status` (UPDATE).

If policies are missing, add them via the Supabase SQL Editor using the SQL snippets in the tasks above. Then click "Apply" and continue.

Once confirmed, continue to Plan 04-02.
</task>

## Success Criteria

At plan completion:
- [ ] `JoinRequestWithTraveller` and `JoinRequestStatus` exported from `types.ts`
- [ ] `fetchHostRequests(listingId)` returns requests with traveller profile embedded
- [ ] `updateRequestStatus(id, status, reason?)` updates the DB row via Supabase
- [ ] Both RLS policies verified in Supabase dashboard
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] No breaking changes to existing `submitRequest`, `checkExistingRequest`, `fetchMyRequests`

## Commit Message Template

```
feat(phase4): host requests data layer

04-01: Extend useJoinRequests with host-side capabilities
- JoinRequestWithTraveller + JoinRequestStatus types
- fetchHostRequests(listingId) with profiles join
- updateRequestStatus(id, status, reason?) mutation
- RLS policies verified for host SELECT + UPDATE

Requirements: HOST-01, HOST-02, HOST-03, HOST-04
```
