# Plan: Phase 4 — Host Requests UI, Action Modal & Optimistic Updates

## Objective

Build the Host Dashboard "Requests" section: a Framer-Motion-animated requests panel with status tabs (Pending / Approved / Declined), per-request cards showing traveller details, and an elegant modal flow for approve/decline actions. Implement optimistic UI updates so cards slide from the Pending tab to Approved/Declined without a page reload.

## Requirements Addressed

- [ ] **HOST-01**: Host views all incoming join requests on their dashboard
- [ ] **HOST-02**: Each request shows Traveller name, nationality, message, and selected events
- [ ] **HOST-03**: Host approves a pending request
- [ ] **HOST-04**: Host declines a request (optionally with a reason)
- [ ] **HOST-05**: Dashboard shows summary counts (total / pending / approved / declined)

## Context Files

Read these before starting:
- @[src/hooks/useJoinRequests.ts] — `fetchHostRequests`, `updateRequestStatus` from Plan 04-01
- @[src/lib/types.ts] — `JoinRequestWithTraveller`, `JoinRequestStatus`
- @[src/pages/host/HostDashboard.tsx] — existing dashboard structure; we'll ADD a section
- @[src/components/host/ListingStatusToggle.tsx] — style reference for host components

## Tasks

<task name="request_card_component" type="auto">
**What:** Create `src/components/host/RequestCard.tsx` — a premium card displaying a single incoming join request with traveller details and action buttons.

**How:**
1. Create `src/components/host/RequestCard.tsx`
2. Props interface:
   ```ts
   interface RequestCardProps {
     request: JoinRequestWithTraveller
     onApprove: (request: JoinRequestWithTraveller) => void
     onDecline: (request: JoinRequestWithTraveller) => void
     index: number // for stagger delay
   }
   ```
3. Card layout (dark glassmorphism — `bg-white/5 border border-white/10 rounded-2xl p-5`):
   - **Header row**: Traveller avatar circle (initials, `bg-saffron/20 text-saffron`), Name (`profiles.full_name`), Nationality badge (flag emoji if mappable, else text)
   - **Message block**: `request.message` — truncated to 3 lines (`line-clamp-3`), italic style
   - **Events row**: `request.selected_events.length` events selected — use a small turmeric pill count badge. If `selected_events` is empty show "All events"
   - **Submitted date**: `formatDistanceToNow` from `date-fns` (e.g., "3 days ago")
   - **Status badge**: Color-coded pill — Pending (amber/turmeric), Approved (emerald), Declined (rose)
   - **Action buttons** (only shown when `status === 'pending'`):
     - `✓ Approve` — emerald button, `whileTap={{ scale: 0.97 }}`
     - `✗ Decline` — rose/red ghost button
4. Framer Motion:
   ```tsx
   <motion.div
     layout
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     exit={{ opacity: 0, x: -60, scale: 0.95 }}
     transition={{ delay: index * 0.05, type: 'spring', damping: 22, stiffness: 300 }}
   >
   ```
   - `layout` prop enables smooth repositioning when cards move between tabs
   - `exit` slides card left and scales it out when status changes

**Files to modify:**
- `src/components/host/RequestCard.tsx` — CREATE

**Verification:**
```bash
npx tsc --noEmit src/components/host/RequestCard.tsx
```

**Done when:**
- [ ] Card renders name, nationality, message, events count, status badge, submitted date
- [ ] Approve / Decline buttons only visible on pending requests
- [ ] Stagger animation and exit animation wired up
</task>

<task name="action_modal" type="auto">
**What:** Create `src/components/host/RequestActionModal.tsx` — the approve/decline confirmation modal with an optional reason/message textarea.

**How:**
1. Create `src/components/host/RequestActionModal.tsx`
2. Props:
   ```ts
   interface RequestActionModalProps {
     request: JoinRequestWithTraveller | null
     action: 'approve' | 'decline' | null
     onConfirm: (reason?: string) => Promise<void>
     onClose: () => void
     isLoading: boolean
   }
   ```
3. Modal shell: Reuse the `FormModal` pattern from `HostDashboard.tsx` — `fixed inset-0 z-50 backdrop-blur-sm bg-black/60`, inner panel spring-animates in with the same easing `[0.34, 1.56, 0.64, 1]`
4. Approve variant:
   - Heading: "Welcome them aboard! 🎉" in display font
   - Sub-copy: "Send {traveller_name} a personal welcome note (optional)."
   - `<textarea>` styled with saffron focus ring — placeholder "Write a warm welcome message…"
   - Confirm button: `btn-primary` green tone — "✓ Approve Request"
5. Decline variant:
   - Heading: "Decline Request" in display font
   - Sub-copy: "Let {traveller_name} know why (optional — they will see this)."
   - `<textarea>` styled with rose focus ring — placeholder "Reason for declining…"
   - Confirm button: rose-tinted button — "✗ Decline Request"
6. Loading state: Disable buttons and show a spinner inside the confirm button while `isLoading`
7. Accessibility: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` heading id, focus trap (use a `useEffect` that focuses the textarea on mount)
8. AnimatePresence: wrap parent call site (in HostRequestsSection) so modal has proper enter/exit

**Files to modify:**
- `src/components/host/RequestActionModal.tsx` — CREATE

**Verification:**
```bash
npx tsc --noEmit src/components/host/RequestActionModal.tsx
```

**Done when:**
- [ ] Approve and Decline variants render correctly
- [ ] Textile message captured in `reason` state and passed to `onConfirm`
- [ ] Spring animation for modal open/close
- [ ] Loading/disabled state during mutation
- [ ] Focus trapped inside modal
</task>

<task name="host_requests_section" type="auto">
**What:** Create `src/components/host/HostRequestsSection.tsx` — the full requests panel that manages its own state (fetching, optimistic updates, modal). This component will be dropped into `HostDashboard.tsx`.

**How:**
1. Create `src/components/host/HostRequestsSection.tsx`
2. Props: `{ listingId: string }`
3. **State:**
   ```ts
   const [requests, setRequests] = useState<JoinRequestWithTraveller[]>([])
   const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'declined' | 'all'>('pending')
   const [selectedRequest, setSelectedRequest] = useState<JoinRequestWithTraveller | null>(null)
   const [actionType, setActionType] = useState<'approve' | 'decline' | null>(null)
   const [actionLoading, setActionLoading] = useState(false)
   ```
4. **Data fetch:** Call `fetchHostRequests(listingId)` in a `useEffect` on mount. Store results in `requests` state.
5. **Summary counts** (derived with `useMemo`):
   ```ts
   const counts = useMemo(() => ({
     total:    requests.length,
     pending:  requests.filter(r => r.status === 'pending').length,
     approved: requests.filter(r => r.status === 'approved').length,
     declined: requests.filter(r => r.status === 'declined').length,
   }), [requests])
   ```
6. **Summary stat bar:** 4 mini stat cards (Total / Pending / Approved / Declined) above the tabs — use the warm aesthetic from the existing dashboard (saffron numbers, ivory labels).
7. **Status tabs:** "All", "Pending", "Approved", "Declined" with animated underline using `layoutId="tab-underline"` on the active indicator. Each tab shows the count in a small badge.
8. **Filtered list** (`useMemo`): filter `requests` by `activeTab`. When `activeTab === 'all'`, no filter.
9. **Optimistic update on approve/decline:**
   ```ts
   async function handleConfirm(reason?: string) {
     if (!selectedRequest || !actionType) return
     setActionLoading(true)

     // 1. Optimistically update local state FIRST
     const newStatus: JoinRequestStatus = actionType === 'approve' ? 'approved' : 'declined'
     setRequests(prev =>
       prev.map(r =>
         r.id === selectedRequest.id
           ? { ...r, status: newStatus, decline_reason: reason ?? r.decline_reason }
           : r
       )
     )

     // 2. Close modal immediately (card will slide away in the UI)
     setSelectedRequest(null)
     setActionType(null)

     // 3. Persist to Supabase in background
     const { success, error } = await updateRequestStatus(selectedRequest.id, newStatus, reason)

     // 4. If it fails, roll back
     if (!success) {
       setRequests(prev =>
         prev.map(r =>
           r.id === selectedRequest.id
             ? { ...r, status: 'pending', decline_reason: undefined }
             : r
         )
       )
       // TODO: show a toast error — use a simple alert for now
       console.error('Failed to update request:', error)
     }
     setActionLoading(false)
   }
   ```
10. **Card list rendering:**
    ```tsx
    <AnimatePresence mode="popLayout">
      {filtered.map((req, i) => (
        <RequestCard
          key={req.id}
          request={req}
          index={i}
          onApprove={r => { setSelectedRequest(r); setActionType('approve') }}
          onDecline={r => { setSelectedRequest(r); setActionType('decline') }}
        />
      ))}
    </AnimatePresence>
    ```
    The `mode="popLayout"` ensures pending cards visually "pop" out of the list into their new position instead of snapping.
11. **Empty state** (when `filtered.length === 0`): Per-tab messaging:
    - `pending`: "No pending requests yet — share your listing to start receiving enquiries 🌸"
    - `approved`: "No approved guests yet."
    - `declined`: "No declined requests."
    - `all`: "No requests yet."
    Animate empty state with a gentle `initial={{ opacity: 0, y: 10 }}` fade-in.
12. **Loading skeleton** while data is being fetched: 3 pulsing card-shaped skeletons.

**Files to modify:**
- `src/components/host/HostRequestsSection.tsx` — CREATE

**Verification:**
```bash
npx tsc --noEmit src/components/host/HostRequestsSection.tsx
```

**Done when:**
- [ ] Summary counts display correctly
- [ ] Status tabs filter cards correctly
- [ ] Optimistic update moves card immediately without network wait
- [ ] Rollback occurs if Supabase update fails
- [ ] `AnimatePresence mode="popLayout"` used for smooth card exit
- [ ] Empty states per tab
- [ ] Loading skeleton shown during fetch
</task>

<task name="integrate_into_dashboard" type="auto">
**What:** Wire `HostRequestsSection` into `HostDashboard.tsx` below the Gallery Manager section. Add a "Requests" navigation anchor/tab to make it easy to jump to.

**How:**
1. Open `src/pages/host/HostDashboard.tsx`
2. Import `HostRequestsSection`:
   ```ts
   import { HostRequestsSection } from '../../components/host/HostRequestsSection'
   ```
3. In the "has listing" branch, after `<GalleryManager>`, add:
   ```tsx
   {/* ── Request Management ─── */}
   <hr className="border-white/10" />
   <section id="requests" aria-label="Join Requests">
     <HostRequestsSection listingId={listing.id} />
   </section>
   ```
4. In the dashboard header, add a quick-jump anchor link "📩 Requests" (visible on desktop, hidden on mobile under a `≡` menu if desired). Use `href="#requests"` for simple scroll-to-section.
5. Wrap the action modal render: `<AnimatePresence>` must wrap `<RequestActionModal>` in `HostRequestsSection` — confirm `AnimatePresence` is present around the modal.

**Files to modify:**
- `src/pages/host/HostDashboard.tsx` — ADD import + section + nav link

**Verification:**
```bash
npm run dev
# Sign in as Host → dashboard shows "Requests" section below Gallery
# If Host listing has incoming join_requests in DB, they appear
```

**Done when:**
- [ ] `HostRequestsSection` renders in the dashboard
- [ ] No console errors
- [ ] Existing dashboard sections (Listing, Events, Gallery) unaffected
</task>

<task name="verify_approve_decline_flow" type="checkpoint:human-verify">
**What to verify — full approve/decline flow:**

1. Sign in as **Traveller** → submit a join request to the test listing
2. Sign out → sign in as **Host** → navigate to Host Dashboard
3. Scroll to "Requests" section → the new request should appear under the "Pending" tab
4. Click "Approve" on the request:
   - Modal opens with welcome message textarea
   - Click "✓ Approve Request"
   - Modal closes; card immediately disappears from "Pending" (optimistic update)
   - Switch to "Approved" tab → card appears there
5. Repeat the test for "Decline" — add a reason in the textarea; confirm reason persists
6. Sign back in as **Traveller** → visit `/traveller` dashboard → status shows "Approved" / "Declined" correctly

If all steps pass, continue to Plan 04-03 (Polish). If any step fails, debug before proceeding.
</task>

## Success Criteria

At plan completion:
- [ ] `RequestCard` renders traveller details with status badge and action buttons
- [ ] `RequestActionModal` springs open/closed with Framer Motion
- [ ] Optimistic update moves card immediately; rollback on failure
- [ ] `HostRequestsSection` shows summary counts and status tabs
- [ ] Dashboard shows full requests flow end-to-end
- [ ] `AnimatePresence mode="popLayout"` used for list exit animations
- [ ] No TypeScript errors (`npx tsc --noEmit`)

## Commit Message Template

```
feat(phase4): host request management UI

04-02: RequestCard, RequestActionModal, HostRequestsSection
- Animated request cards with traveller info
- Spring modal for approve/decline with optional reason
- Optimistic UI update + rollback on failure
- AnimatePresence popLayout for smooth card transitions
- Summary counts + status tabs

Requirements: HOST-01, HOST-02, HOST-03, HOST-04, HOST-05
```
