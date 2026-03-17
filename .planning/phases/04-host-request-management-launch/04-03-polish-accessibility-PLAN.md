# Plan: Phase 4 — Final Polish (Mobile, Accessibility, Animation)

## Objective

A comprehensive quality sweep across the entire app: mobile responsiveness at 375px, WCAG accessibility basics, Lenis/GSAP animation smoothness audit, loading and error states where missing, and cross-browser verification. This plan produces no new features — only polish that makes the MVP feel production-ready.

## Requirements Addressed

- (Launch polish — not a named HOST requirement but a Phase 4 exit condition per ROADMAP.md)
- [x] **Phase 4 Success Criterion 5**: Entire app usable from mobile browser at 375px
- [x] **Phase 4 Success Criterion 4**: Dashboard summary counts accurate and update on change

## Context Files

Read these before starting:
- @[.planning/ROADMAP.md] — Phase 4 success criteria §5 (mobile) and §4 (counts)
- @[.planning/PROJECT.md] — Performance Contract (Lenis/GSAP lazy-load) + Colour Palette
- @[.planning/STATE.md] — Key Decisions (Lenis scope, AnimatePresence in AppLayout)
- @[src/lib/lenis.ts] — Lenis singleton
- @[src/pages/host/HostDashboard.tsx] — Dashboard layout
- @[src/pages/traveller/TravellerDashboard.tsx] — Traveller dashboard

## Tasks

<task name="mobile_responsiveness" type="auto">
**What:** Audit and fix mobile layout at 375px viewport width across all pages.

**How:**
Open Chrome DevTools → Device toolbar → iPhone SE (375×667). Go through every route:

1. **`/` (Homepage)**
   - Hero section: heading must not overflow; font-size reduced via `text-4xl sm:text-7xl`
   - Hero CTA buttons: stack vertically on mobile (`flex-col sm:flex-row`)
   - Lottie/3D decorative sections: verify no horizontal overflow (`overflow-x: hidden` on `<body>`)

2. **`/weddings` (Directory)**
   - Filter bar: horizontally scrollable (`overflow-x: auto scrollbar-hide flex gap-2 flex-nowrap`)
   - Listing grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — verify single column
   - City filter pill buttons: minimum touch target 44px (`min-h-[44px]`)

3. **`/weddings/:slug` (Listing Detail)**
   - RSVP sticky bar: full-width, action button stacks below countdown on mobile
   - RSVP modal: `sm:max-w-lg mx-auto` → on mobile: `fixed inset-0 rounded-t-3xl` (bottom sheet)
   - Gallery grid: `grid-cols-2` on mobile (not 3)
   - Events list: single column cards

4. **`/host` (Host Dashboard)**
   - Header: hide profile name on mobile (`hidden sm:block` already set — verify)
   - Listing overview card: action buttons stack vertically on mobile
   - Events and gallery sections: full-width on mobile
   - **HostRequestsSection**: Status tabs should be horizontally scrollable on mobile
   - `RequestCard`: full-width, action buttons (`flex-row` on cards, stacked if needed)

5. **`/traveller` (Traveller Dashboard)**
   - Stats bar: `grid-cols-2 sm:grid-cols-4`
   - Request cards: single column, full-width
   - Status filter tabs: horizontally scrollable

**Files to modify:**
- Various component and page files — minor Tailwind class tweaks

**Verification:**
```bash
npm run dev
# Open Chrome DevTools → 375px width
# Walk through every route listed above
# Screenshot any overflow or broken layout
```

**Done when:**
- [x] No horizontal overflow on any page at 375px
- [x] Touch targets ≥ 44px on all buttons
- [x] RSVP modal slides up as bottom sheet on mobile
- [x] All grids correctly collapse to single/double column
- [x] Tabs horizontally scrollable on mobile
</task>

<task name="accessibility_audit" type="auto">
**What:** Ensure all interactive elements are keyboard-navigable and screen-reader friendly.

**How:**
1. **Focus rings**: Tailwind's default `focus:ring` may be removed by `outline-none`. Add a clear focus ring to all interactive elements:
   ```css
   /* In index.css, in the @layer components block */
   .focus-visible-ring {
     @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal;
   }
   ```
   Apply `.focus-visible-ring` to all `<button>` and `<a>` elements across the app.

2. **Modal focus trap** — `RequestActionModal` and the RSVP modal:
   - On modal open, call `firstFocusableRef.current?.focus()`
   - Add `onKeyDown` to modal overlay: close on `Escape`
   - Trap Tab key within modal (or use a library: `focus-trap-react` if already installed)

3. **ARIA roles**:
   - Status badges: `role="status"` + `aria-label="Status: Pending"`
   - Loading skeletons: `aria-busy="true"` on the parent container
   - Tab buttons: `role="tab"`, `aria-selected`, `aria-controls` linking to their tab panel `<div role="tabpanel">`
   - Approve/decline buttons: `aria-label="Approve request from {name}"`, `aria-label="Decline request from {name}"`

4. **Image alt text**: All `<img>` tags should have descriptive `alt`. Gallery photos: `alt="{bride} & {groom} wedding photo"`. Cover photos: `alt="Cover photo for {bride} & {groom}'s wedding"`.

5. **Reduced motion**: Verify `framer-motion`'s `useReducedMotion()` is respected:
   - In `PageTransition` wrapper and all heavy animation components, detect `shouldReduceMotion` and skip or simplify animations.
   - Example:
     ```tsx
     const shouldReduceMotion = useReducedMotion()
     const variants = shouldReduceMotion
       ? { initial: {}, animate: {}, exit: {} }
       : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 } }
     ```

6. **Colour contrast**: Verify `ivory/50` opacity text on dark backgrounds meets WCAG AA (4.5:1). If it fails at 50% opacity, bump to `ivory/60` or `ivory/70`.

**Files to modify:**
- `src/index.css` — ADD focus ring utility
- Multiple component files — ADD aria attributes, alt text, focus ring classes, `useReducedMotion`

**Verification:**
```bash
# In Chrome: open DevTools → Accessibility panel → run audit on each page
# Tab through the entire app keyboard-only — all elements reachable in logical order
# Press Escape inside modal — it should close
```

**Done when:**
- [x] All buttons have visible focus ring when tabbed to
- [x] Modals trap focus and close on Escape
- [x] ARIA roles on tabs, badges, skeletons
- [x] Reduced motion respected in all animation components
- [x] Images have alt text
</task>

<task name="lenis_gsap_audit" type="auto">
**What:** Verify Lenis smooth scroll and GSAP ScrollTrigger are ONLY active on immersive public pages and are cleanly destroyed on route change. Confirm dashboards are completely free of these.

**How:**
1. Open `src/lib/lenis.ts` — verify the singleton is created with the right options:
   ```ts
   // Correct options for Lenis v1.x
   const lenis = new Lenis({
     duration: 1.2,
     easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
     touchMultiplier: 2,
     infinite: false,
   })
   ```
2. Open `src/hooks/useSmoothScroll.ts` (or wherever Lenis is activated):
   - Confirm Lenis is **only started** when `isImmersive === true`
   - Confirm the `useEffect` cleanup function calls `lenis.destroy()` on route change
   - Confirm `ScrollTrigger.refresh()` is called after Lenis is started (needed for correct pin positions)
   ```ts
   useEffect(() => {
     if (!isImmersive) return
     lenis.start()
     ScrollTrigger.refresh()
     return () => {
       lenis.stop()
       ScrollTrigger.getAll().forEach(t => t.kill())
     }
   }, [isImmersive])
   ```
3. Navigate from `/weddings/some-slug` (immersive) to `/host` (dashboard):
   - Open Chrome DevTools → Console
   - Confirm no Lenis RAF callbacks firing on the dashboard (no `lenis tick` logs if verbose logging was enabled)
   - Confirm native scroll works normally on the dashboard

4. On the `/weddings` directory page, ensure the filter bar does NOT interfere with Lenis scroll-jacking. If horizontal filter bar scroll conflicts, add `data-lenis-prevent` attribute to the filter bar's scrollable container:
   ```tsx
   <div className="overflow-x-auto scrollbar-hide" data-lenis-prevent>
     {/* filter pills */}
   </div>
   ```

5. Test GSAP ScrollTrigger on `/weddings/:slug`:
   - Scroll slowly through the listing detail page — pinned scenes should activate correctly
   - No "jumpy" scroll behaviour or phantom pins after navigating away and back
   - If GSAP pins persist after navigation, ensure `ScrollTrigger.getAll().forEach(t => t.kill())` is in the cleanup

**Files to modify:**
- `src/lib/lenis.ts` — verify/fix options
- `src/hooks/useSmoothScroll.ts` (or similar) — verify lifecycle
- Filter bar component — ADD `data-lenis-prevent` attribute

**Verification:**
```bash
npm run dev
# Navigate: / → /weddings → /weddings/:slug → /host → back to /weddings/:slug
# Lenis should be silky on immersive pages, completely absent on dashboard
```

**Done when:**
- [x] Lenis active only on `/`, `/weddings`, `/weddings/:slug`
- [x] Lenis + ScrollTrigger cleaned up on route change (no phantom behaviour)
- [x] `data-lenis-prevent` on horizontal scroll containers
- [x] GSAP pins execute and clean up correctly
</task>

<task name="error_and_loading_states" type="auto">
**What:** Audit and add missing loading skeletons and error states across all pages and components.

**How:**
1. **Global error boundary**: If no `ErrorBoundary` exists, create a simple one in `src/components/ui/ErrorBoundary.tsx`:
   ```tsx
   class ErrorBoundary extends React.Component<...> {
     // catches unhandled render errors, shows a friendly "Something went wrong" UI
   }
   ```
   Wrap `<RouterProvider>` in `main.tsx` with it.
2. **Network error states**: In every hook that fetches data (useWeddingListing, useDirectory, useJoinRequests, etc.), add an `error` state and expose it. In the consuming component, show an error card if `error` is non-null:
   ```tsx
   {error && (
     <div className="bg-rose/10 border border-rose/20 rounded-xl p-4 text-rose text-sm">
       ⚠️ {error} — <button onClick={refetch} className="underline">Try again</button>
     </div>
   )}
   ```
3. **Button loading state**: Any mutation button (Save, Approve, Decline, Submit Request) must be visually disabled and show a spinner while the network call is in flight. If not already done, add `disabled={isLoading}` and an inline spinner:
   ```tsx
   <button disabled={isLoading} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
     {isLoading ? <Spinner /> : 'Save'}
   </button>
   ```
4. **Empty states audit**: Verify every list/grid has an empty state with helpful copy:
   - Directory (`/weddings`): "No weddings found — try adjusting your filters" with clear filters button
   - Host Events section: "No events yet — add your first event!" with add button visible
   - Host Gallery: "No photos yet — upload your first gallery photo"
   - Host Requests → Pending tab: "No pending requests — share your listing!" (from Plan 04-02)
   - Traveller Dashboard: "No requests yet — start exploring!" with link to `/weddings`

**Files to modify:**
- `src/components/ui/ErrorBoundary.tsx` — CREATE
- `src/main.tsx` — wrap with ErrorBoundary
- Various hooks — ensure `error` state exposed
- Various components — add error states and loading button states

**Verification:**
```bash
# Simulate network error: in Supabase client, temporarily pass a bad URL
# Verify error state renders (not a blank screen)
# Restore Supabase URL
npm run dev
```

**Done when:**
- [x] ErrorBoundary wraps the app
- [x] All data-fetching hooks expose an `error` state
- [x] Error cards appear where data fails to load
- [x] All mutation buttons disabled + show spinner in flight
- [x] All empty states present with helpful copy
</task>

## Success Criteria

At plan completion:
- [x] App is fully usable at 375px viewport width (no overflow, no broken layouts)
- [x] All interactive elements keyboard-focusable with visible focus ring
- [x] Modals trap focus and close on Escape
- [x] Reduced motion preference respected
- [x] Lenis and GSAP are correctly scoped to immersive pages only
- [x] Error states and loading spinners present throughout
- [x] Empty states with helpful messaging on all lists
- [x] `npm run dev` — no console errors or warnings

## Commit Message Template

```
chore(phase4): final polish pass — mobile, a11y, animations

04-03: Comprehensive quality sweep
- Mobile responsive at 375px across all pages
- Focus rings, ARIA roles, modal focus trap, reduced motion
- Lenis + GSAP lifecycle audit and cleanup
- ErrorBoundary, error states, loading spinners, empty states

Phase 4 success criteria: mobile (#5), counts (#4)
```
