# Plan: Phase 3 — Traveller Dashboard (My Requests)

## Objective

Build the Traveller dashboard at `/traveller` that shows all submitted join requests with their status (Pending / Approved / Declined). Includes a premium card-based layout with status indicators, links back to the wedding listing, and the overall Phase 3 polish pass.

## Requirements Addressed

- [ ] **RSVP-05**: Traveller dashboard shows status of all submitted requests (Pending / Approved / Declined)

## Context Files

Read these before starting:
- @[src/pages/traveller/TravellerDashboard.tsx] — current placeholder, replace
- @[src/hooks/useJoinRequests.ts] — `fetchMyRequests()` function from Plan 03-03
- @[src/lib/types.ts] — JoinRequest, WeddingListing types
- @[src/contexts/AuthContext.tsx] — useAuth()

## Tasks

<task name="request_status_card" type="auto">
**What:** Create `RequestStatusCard.tsx` — a card component displaying a single join request with its status.

**How:**
1. Create `src/components/traveller/RequestStatusCard.tsx`
2. Card displays:
   - **Wedding info**: Bride & Groom names (fetched via a join or separate query on the listing), city, date
   - **Status badge**: Color-coded pill — Pending (turmeric/amber), Approved (green), Declined (rose/red)
   - **Guest count**: "X guests"
   - **Message preview**: Truncated greeting message
   - **Submitted date**: Relative time ("2 days ago") or formatted date
   - **Link**: "View Wedding →" linking to `/weddings/:slug`
   - **Decline reason**: If status is "declined" and `decline_reason` is set, show in a subtle red callout
3. Framer Motion:
   - `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}` with stagger delay based on index
   - Hover: subtle lift (`y: -4`) with shadow
4. Style: dark card (`bg-white/5 border border-white/10`) on charcoal background

**Files to modify:**
- `src/components/traveller/RequestStatusCard.tsx` — CREATE

**Verification:**
```bash
npx tsc --noEmit src/components/traveller/RequestStatusCard.tsx
```

**Done when:**
- [ ] Card renders request info with status badge
- [ ] Decline reason shown when applicable
- [ ] Links to wedding detail page
- [ ] Stagger animation works
</task>

<task name="traveller_dashboard_page" type="auto">
**What:** Replace the TravellerDashboard placeholder with a full implementation showing all submitted requests.

**How:**
1. Overwrite `src/pages/traveller/TravellerDashboard.tsx`
2. Structure:
   - **Header**: "My Wedding Requests" heading with traveller's name, a "Browse Weddings →" CTA link
   - **Summary stats bar**: Total requests / Pending / Approved / Declined counts in mini stat cards (similar to host dashboard pattern)
   - **Status filter tabs**: "All", "Pending", "Approved", "Declined" — client-side filter with Framer Motion `layoutId` underline animation on active tab
   - **Request cards grid**: Responsive grid of `RequestStatusCard` components
   - **Empty state**: Beautiful "No requests yet — start exploring!" with a link to `/weddings`
   - **Loading skeleton**: Pulsing card grid placeholder
3. Data fetching:
   - Use `useJoinRequests().fetchMyRequests()` to get all requests for the current user
   - For each request, also fetch the associated `wedding_listings` row to display couple names and city (or do a Supabase join in the hook: `.select('*, wedding_listings(*)')`)
4. Navigation: "Log Out" button (from useAuth), "Browse Weddings" link
5. Wrap in `motion.div` for page entrance animation

**Files to modify:**
- `src/pages/traveller/TravellerDashboard.tsx` — OVERWRITE

**Verification:**
```bash
npm run dev
# Sign in as Traveller → navigates to /traveller
# Should see all submitted requests with status
```

**Done when:**
- [ ] Dashboard shows all submitted requests
- [ ] Status badges are color-coded (Pending/Approved/Declined)
- [ ] Summary stat counts are accurate
- [ ] Status filter tabs work
- [ ] Empty state renders when no requests
- [ ] Links to wedding detail pages work
</task>

<task name="enhance_join_requests_hook" type="auto">
**What:** Update `useJoinRequests.ts` to support joined queries (fetching listing info with each request).

**How:**
1. Update `fetchMyRequests()` to use a Supabase joined select:
   ```ts
   .from('join_requests')
   .select('*, wedding_listings(bride_name, groom_name, city, wedding_date, slug, cover_photo_url)')
   .eq('traveller_id', userId)
   .order('submitted_at', { ascending: false })
   ```
2. Add a derived type `JoinRequestWithListing` to `src/lib/types.ts`:
   ```ts
   export interface JoinRequestWithListing extends JoinRequest {
     wedding_listings: Pick<WeddingListing, 'bride_name' | 'groom_name' | 'city' | 'wedding_date' | 'slug' | 'cover_photo_url'>
   }
   ```
3. Update return type of `fetchMyRequests` to use `JoinRequestWithListing[]`

**Files to modify:**
- `src/hooks/useJoinRequests.ts` — UPDATE
- `src/lib/types.ts` — UPDATE (add JoinRequestWithListing)

**Verification:**
```bash
npx tsc --noEmit
```

**Done when:**
- [ ] `fetchMyRequests` returns listing info with each request
- [ ] TypeScript types are correct
- [ ] No compilation errors
</task>

<task name="phase_3_polish" type="auto">
**What:** Final polish pass for all Phase 3 features.

**How:**
1. **Navigation links**: Ensure the homepage and directory have navigation links to each other. Check that the "Browse Weddings" CTA on the homepage links to `/weddings`.
2. **Back navigation**: Directory page has "← Home" link. Wedding detail has "← Back to directory" link.
3. **Mobile responsiveness**: Test all new pages at 375px viewport:
   - Directory grid: single column
   - Filter bar: horizontally scrollable on mobile
   - RSVP modal: full-screen slide-up on mobile
   - Traveller dashboard: single column cards
4. **Accessibility**: All interactive elements have focus states, buttons have `aria-label` where needed, modal traps focus
5. **Performance**: Ensure Lenis is NOT active on `/traveller` dashboard (it's not an immersive page). Verify via the `useSmoothScroll(isImmersive)` check in `router.tsx`.

**Files to modify:**
- Various components — minor tweaks for responsiveness, nav links, accessibility

**Verification:**
```bash
npm run dev
# Test at 375px viewport width in Chrome DevTools
# Tab through all interactive elements
# Verify smooth scroll only on immersive pages
```

**Done when:**
- [ ] Navigation links work across all pages
- [ ] Mobile responsive at 375px
- [ ] Focus states and accessibility basics in place
- [ ] Lenis not active on dashboard
</task>

<task name="final_verification" type="checkpoint:human-verify">
**What to verify — full Phase 3 end-to-end:**
1. **Directory** (`/weddings`): Shows all open listings, filters by city and date, cards animate
2. **Detail** (`/weddings/:slug`): Scrollytelling page with RSVP bar and modal
3. **RSVP Flow**: Traveller submits request → confirmation → WhatsApp link → request appears on dashboard
4. **Duplicate prevention**: Second request to same listing is blocked
5. **Traveller Dashboard** (`/traveller`): Shows all requests with status badges
6. **Auth states**: Unauthenticated browsing works, RSVP requires login, hosts see no RSVP bar
7. **Mobile**: All pages work at 375px

**How to verify:**
1. `npm run dev`
2. Browse `/weddings` as unauthenticated user
3. Click a listing → view detail page
4. Sign up as Traveller → submit RSVP → check WhatsApp link
5. Visit `/traveller` → see request as "Pending"
6. Do everything again at 375px

If approved, Phase 3 is complete. If issues, fix before marking done.
</task>

## Success Criteria

At plan completion:
- [ ] All requirement checkboxes above marked done
- [ ] Traveller dashboard shows all submitted requests with status
- [ ] Full Phase 3 feature set working end-to-end
- [ ] Mobile responsive
- [ ] No breaking changes to existing features

## Commit Message Template

```
feat(phase3): traveller dashboard and Phase 3 polish

03-05: My Requests dashboard + polish
- Status cards with color-coded badges
- Summary stats and filter tabs
- Joined Supabase queries for listing info
- Mobile responsiveness and accessibility pass

Requirements: RSVP-05
```
