# Plan: Phase 3 — Directory Filtering (City & Date)

## Objective

Add city and date-range filtering to the `/weddings` directory page. Filters trigger smooth Framer Motion layout transitions as cards are shown/hidden. Filtering is client-side (all open listings are already fetched) for snappy UX.

## Requirements Addressed

- [ ] **BROWSE-03**: Traveller can filter by city
- [ ] **BROWSE-04**: Traveller can filter by date range
- [ ] **BROWSE-06**: Only "Open" listings shown in directory (already enforced in data fetch from 03-01)

## Context Files

Read these before starting:
- @[.planning/phases/03-public-directory-traveller-rsvp/03-01-directory-page-PLAN.md]
- @[src/pages/public/DirectoryPage.tsx] — directory page built in 03-01
- @[src/hooks/useDirectory.ts] — already returns `cities` list
- @[src/lib/types.ts] — WeddingListing type with `wedding_date` and `city` fields

## Tasks

<task name="filter_bar_component" type="auto">
**What:** Create a `DirectoryFilters.tsx` component — a sticky filter bar with city dropdown and date range selector.

**How:**
1. Create `src/components/listing/DirectoryFilters.tsx`
2. Filter bar contains:
   - **City dropdown** — populated from the `cities` array (unique cities from listings), plus an "All Cities" default option. Use a styled `<select>` or custom dropdown with Framer Motion open/close animation.
   - **Date range preset buttons** — "All Dates", "This Month", "Next 3 Months", "Custom Range". For "Custom Range", show two date inputs (from/to).
   - **Active filter pills** — show the currently active filters as removable pill/badge components with a click-to-remove "×" action
3. Props: `cities: string[]`, `onFilterChange: (filters: DirectoryFilters) => void`
4. Define a `DirectoryFilters` interface: `{ city: string | null; dateFrom: string | null; dateTo: string | null }`
5. Style: glassmorphism background (`bg-white/5 backdrop-blur-xl`) on dark charcoal, with saffron/turmeric accents
6. Sticky positioning (`sticky top-0 z-20`) so it stays visible while scrolling
7. Animate filter bar entrance with `motion.div` initial/animate

**Files to modify:**
- `src/components/listing/DirectoryFilters.tsx` — CREATE

**Verification:**
```bash
npx tsc --noEmit src/components/listing/DirectoryFilters.tsx
```

**Done when:**
- [ ] City dropdown renders with all unique cities + "All Cities"
- [ ] Date range buttons work (This Month, Next 3 Months, Custom)
- [ ] Active filter pills appear and are removable
- [ ] Glassmorphism styling applied
- [ ] Sticky positioning works
</task>

<task name="client_side_filter_logic" type="auto">
**What:** Implement client-side filtering logic in DirectoryPage and wire it to the filter bar.

**How:**
1. In `DirectoryPage.tsx`, add state: `const [filters, setFilters] = useState<DirectoryFilters>({ city: null, dateFrom: null, dateTo: null })`
2. Create a `useMemo` that derives `filteredListings` from the full listings array:
   - If `filters.city` is set, filter by `listing.city === filters.city`
   - If `filters.dateFrom` is set, filter by `listing.wedding_date >= filters.dateFrom`
   - If `filters.dateTo` is set, filter by `listing.wedding_date <= filters.dateTo`
3. Render `<DirectoryFilters cities={cities} onFilterChange={setFilters} />`
4. Pass `filteredListings` to the card grid instead of all listings
5. The `AnimatePresence` + `layout` props on cards will automatically animate the layout shift when cards appear/disappear
6. Show a "No weddings match your filters" empty state (different from "No weddings yet")
7. Display a results count: "Showing X of Y weddings"

**Files to modify:**
- `src/pages/public/DirectoryPage.tsx` — UPDATE (add filter state + filtering logic)

**Verification:**
```bash
npm run dev
# Visit /weddings, apply city filter — grid should animate smoothly
# Apply date filter — cards should shrink/expand with layout transitions
```

**Done when:**
- [ ] City filtering works — selecting a city shows only listings in that city
- [ ] Date filtering works — "This Month" shows only weddings in current month
- [ ] Layout animations fire smoothly when filter changes
- [ ] Results count updates
- [ ] "No matches" state shows when filters exclude all listings
- [ ] Removing a filter pill restores full results
</task>

<task name="verify_filters" type="checkpoint:human-verify">
**What to verify:**
- Filter bar is sticky and has glassmorphism style
- City dropdown populates dynamically from existing listings
- Date filters (This Month / Next 3 Months) work correctly
- Cards animate smoothly in/out during filtering
- Active filter pills appear and can be dismissed
- Empty filter state is displayed correctly

**How to verify:**
1. Run `npm run dev`
2. Navigate to `/weddings`
3. Test each filter individually and in combination
4. Verify Framer Motion layout animations are smooth

If approved, continue. If issues, fix before proceeding.
</task>

## Success Criteria

At plan completion:
- [ ] All requirement checkboxes above marked done
- [ ] City and date range filtering both work
- [ ] Layout transitions are smooth and visually impressive
- [ ] No breaking changes to existing features

## Commit Message Template

```
feat(phase3): directory filtering by city and date

03-02: Client-side filters with animated grid transitions
- City dropdown + date range presets
- Framer Motion layout animations on filter change
- Glassmorphism filter bar, active filter pills

Requirements: BROWSE-03, BROWSE-04, BROWSE-06
```
