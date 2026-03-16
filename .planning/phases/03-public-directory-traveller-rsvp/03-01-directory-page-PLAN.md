# Plan: Phase 3 — Public Wedding Directory Page

## Objective

Build the stunning, fully functional `/weddings` directory page that displays all "Open" wedding listings as animated cards in a responsive grid. Fetches listings from Supabase with public (anon) SELECT and renders them with Framer Motion layout transitions and premium cultural aesthetics.

## Requirements Addressed

- [ ] **BROWSE-01**: Unauthenticated visitor can browse the public directory
- [ ] **BROWSE-02**: Directory shows listing cards with couple names, cover photo, city, date, status
- [ ] **BROWSE-06**: Only "Open" listings shown in the directory by default

## Context Files

Read these before starting:
- @[.planning/STATE.md]
- @[.planning/ROADMAP.md]
- @[src/pages/public/DirectoryPage.tsx] — current placeholder, replace
- @[src/lib/supabase.ts] — Supabase client
- @[src/lib/types.ts] — WeddingListing type
- @[src/components/motion/PageTransition.tsx] — existing page wrapper
- @[src/index.css] — colour tokens (saffron, turmeric, charcoal, ivory, etc.)

## Tasks

<task name="directory_data_hook" type="auto">
**What:** Create a `useDirectory.ts` hook that fetches all open wedding listings from Supabase.

**How:**
1. Create `src/hooks/useDirectory.ts`
2. Fetch from `wedding_listings` with `.eq('status', 'open')` and order by `wedding_date` ascending
3. Return `{ listings, loading, error, cities }` — `cities` is a deduplicated array of all cities from the returned listings (for the filter dropdown in Plan 03-02)
4. Use `useState` + `useEffect` — no real-time subscription needed for MVP

**Files to modify:**
- `src/hooks/useDirectory.ts` — CREATE

**Verification:**
```bash
# Verify the hook compiles correctly
npx tsc --noEmit src/hooks/useDirectory.ts
```

**Done when:**
- [ ] Hook fetches only open listings from Supabase
- [ ] Returns listings array, loading state, error, and cities list
- [ ] TypeScript types are correct
</task>

<task name="listing_card_component" type="auto">
**What:** Build a `WeddingCard.tsx` component — the card shown in the directory grid.

**How:**
1. Create `src/components/listing/WeddingCard.tsx`
2. Card displays: cover photo (full card background with gradient overlay), couple names (Bride & Groom), city, wedding date (formatted), and "Open" status badge
3. Use `motion.div` with `layout` prop for smooth re-positioning when the grid filters change
4. Add `whileHover={{ y: -8, scale: 1.02 }}` with a spring transition for an interactive hover lift
5. Wrap with `<Link to={/weddings/${listing.slug}>` for navigation
6. Handle missing cover photos with a gradient placeholder using the cultural colour palette (saffron → rose)
7. Date formatting: "12 Apr 2026" style using `toLocaleDateString`
8. Responsive: full-width on mobile, card-like on desktop

**Files to modify:**
- `src/components/listing/WeddingCard.tsx` — CREATE

**Verification:**
```bash
npx tsc --noEmit src/components/listing/WeddingCard.tsx
```

**Done when:**
- [ ] Card renders couple names, city, date, cover photo
- [ ] motion.div has `layout` prop
- [ ] Hover lift animation works
- [ ] Links to `/weddings/:slug`
- [ ] Graceful fallback when no cover photo
</task>

<task name="directory_page" type="auto">
**What:** Replace the DirectoryPage placeholder with a full implementation — hero header, listing grid with `AnimatePresence` + `layout` transitions.

**How:**
1. Overwrite `src/pages/public/DirectoryPage.tsx`
2. Structure:
   - **Hero header** — cultural motif background with "Discover Weddings" heading and sub-text, animated in with Framer Motion
   - **Filter bar placeholder** — empty container that Plan 03-02 will populate (include a simple "All Weddings" heading for now)
   - **Listing grid** — CSS Grid (responsive: 1 col mobile → 2 cols tablet → 3 cols desktop) wrapped in `<AnimatePresence mode="popLayout">` so cards animate in/out when filtering is applied later
   - **Empty state** — beautiful "No weddings yet" message with cultural emoji
   - **Loading skeleton** — grid of pulsing card skeletons
3. Each `WeddingCard` must have `key={listing.id}` for AnimatePresence tracking
4. Use `useDirectory()` hook to fetch data
5. Add a "Back to Home" link and a "Browse all" header
6. Wrap entire page in `<PageTransition>` for route animation

**Files to modify:**
- `src/pages/public/DirectoryPage.tsx` — OVERWRITE

**Verification:**
```bash
npm run dev
# Visit http://localhost:5173/weddings — should render listing cards or empty state
```

**Done when:**
- [ ] Directory page loads and renders all open listings from Supabase
- [ ] Cards are animated with Framer Motion layout transitions
- [ ] Empty state is displayed when no listings exist
- [ ] Loading skeleton is shown during data fetch
- [ ] Responsive grid works across breakpoints
- [ ] Page wrapped in PageTransition for route animation
</task>

<task name="verify_integration" type="checkpoint:human-verify">
**What to verify:**
- Visit `/weddings` — cards load for any existing open listings
- Cards link to `/weddings/:slug` detail page
- Empty state shows if no listings exist
- Hover animations work on cards
- Page transitions smoothly from homepage

**How to verify:**
1. Run `npm run dev`
2. Navigate to `http://localhost:5173/weddings`
3. Check that listing cards render correctly
4. Verify hover effects and layout animations
5. Click a card and confirm it navigates to the detail page

If approved, continue. If issues, fix before proceeding.
</task>

## Success Criteria

At plan completion:
- [ ] All requirement checkboxes above marked done
- [ ] All task verifications pass
- [ ] Public directory page renders open listings
- [ ] No breaking changes to existing features

## Commit Message Template

```
feat(phase3): public wedding directory page

03-01: Directory page with animated card grid
- Fetches open listings from Supabase
- Framer Motion layout transitions on cards
- Responsive grid, loading skeletons, empty state

Requirements: BROWSE-01, BROWSE-02, BROWSE-06
```
