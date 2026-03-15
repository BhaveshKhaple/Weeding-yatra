# Plan: Phase 2 - Public Profile Preview (Scrollytelling)

## Objective

Combine the host's created listing details, events timeline, and gallery into a visually stunning, immersive public-facing page (`/weddings/:slug`). This page will prove out the "Scrollytelling" architectural requirement using Lenis, GSAP ScrollTrigger, Framer Motion, and our 3D/Lottie placeholders to create a premium cultural experience.

## Requirements Addressed

- [ ] **GALLERY-03**: Photos shown in responsive grid on public detail page
- [ ] **EVENT-05**: Events shown chronologically on public page
- [ ] UI/UX Vision: "Scrollytelling" mandate from `PROJECT.md`

## Context Files

- @[.planning/PROJECT.md] (UI/UX Vision - Immersive Indian Cultural Aesthetic)

## Tasks

<task name="setup_public_detail_route" type="auto">
**What:** Create the public `WeddingDetail.tsx` page and route.

**How:**
1. Configure `App.tsx` or `router.tsx` to serve `src/pages/public/WeddingDetail.tsx` at `/weddings/:slug` (or by ID if slugs aren't live).
2. Fetch the listing, its associated events (sorted chronologically), and gallery photos from Supabase.
3. If not found, show a beautiful `<NotFound />` component adorned with a Lottie folk-art motif.

**Files to modify:**
- `src/pages/public/WeddingDetail.tsx`
- `src/App.tsx` (ensure route is public)

**Done when:**
- [ ] Navigating to a host's wedding slug fetches the correct aggregated data.
</task>

<task name="scrollytelling_hero_section" type="auto">
**What:** Build the immersive hero section incorporating 3D and smooth scroll.

**How:**
1. Ensure the page container is wrapped by the global Lenis smooth scroll provider.
2. Render the `SplineHero` component (from Plan 2) behind the couple's names using fixed positioning or ScrollTrigger pinning.
3. Implement GSAP ScrollTrigger or Framer Motion `useScroll` to fade/scale the hero text out as the user scrolls down natively into the Story section.

**Files to modify:**
- `src/pages/public/WeddingDetail.tsx`
- `src/components/listing/HeroSection.tsx`

**Verification:**
```bash
# Visually verify scroll inertia and 3D lazy loading
```

**Done when:**
- [ ] The landing section feels expansive, animated, and silky smooth to scroll past.
</task>

<task name="story_and_timeline_sections" type="auto">
**What:** Render the Host description and the chronological events timeline.

**How:**
1. Map over the fetched events. 
2. Use GSAP ScrollTrigger to reveal each event sequentially as they enter the viewport ("scrub" or simple trigger). 
3. Place `LottieDivider.tsx` components gracefully between the Story and Timeline sections to create cultural flavor.

**Files to modify:**
- `src/components/listing/EventsTimeline.tsx`
- `src/components/listing/StorySection.tsx`

**Done when:**
- [ ] Scrolling down reveals the events elegantly.
</task>

<task name="public_gallery_grid" type="auto">
**What:** Fulfill **GALLERY-03** by showing the responsive grid on the detail page.

**How:**
1. Render the fetched `gallery_photos` in an elegant masonry or CSS Grid configuration.
2. Ensure images have a hover state via Framer Motion.
3. Apply `object-cover` to prevent distorted images.

**Files to modify:**
- `src/components/listing/PublicGallery.tsx`

**Done when:**
- [ ] Minimum 5 photos load gracefully into the grid.
</task>

## Success Criteria

At plan completion:
- [ ] The public detail page is fully operable at `/weddings/:slug`.
- [ ] Lenis scrolling is noticeably active on this route.
- [ ] Spline 3D and Lottie assets load successfully.
- [ ] GSAP or Framer Motion scroll reveals are functional.
- [ ] Required MVP read data (Events + Gallery) is elegantly displayed.

## Commit Message Template

```
feat(02-preview): 02-06 Public profile scrollytelling view

Created the public /weddings/:slug detail route.
Integrated Lenis, GSAP ScrollTrigger, Spline 3D, and Lottie dividers.
Constructed the chronologic events timeline component.
Constructed the public masonry gallery grid.

Requirements: GALLERY-03, EVENT-05, UI/UX Scrollytelling
```
