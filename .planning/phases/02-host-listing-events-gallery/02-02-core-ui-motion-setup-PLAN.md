# Plan: Phase 2 - Core UI & Scrollytelling Framework

## Objective

Establish the animation and scrollytelling infrastructure needed to meet our high-end aesthetic mandates. Set up Framer Motion page transitions, global Lenis smooth scrolling for immersive pages, and create robust placeholder components for 3D (React Spline) and SVGs (Lottie).

## Requirements Addressed

- Architectural/UI Constraints (See `PROJECT.md`)

## Context Files

Read these before starting:
- @[.planning/PROJECT.md] (Animation Architecture)

## Tasks

<task name="setup_lenis_smooth_scroll" type="auto">
**What:** Set up Lenis smooth scrolling.

**How:**
1. Install `@studio-freight/lenis`.
2. Create a `src/lib/lenis.ts` utility or a React custom hook `useSmoothScroll.ts` following current best practices to instantiate Lenis globally, hooking into `requestAnimationFrame`.
3. Wrap required parts of the app routing so that immersive public pages benefit from Lenis, while keeping Dashboards clean as defined in our Performance Contract.

**Files to modify:**
- `src/lib/lenis.ts` or `src/hooks/useLenis.ts`
- `src/App.tsx` (or layouts)
- `package.json` (add dependency)

**Done when:**
- [ ] Lenis is instantiated correctly.
- [ ] Scrolling on public pages has an inertia effect.
</task>

<task name="framer_motion_page_transitions" type="auto">
**What:** Add Framer Motion to the app routing for fade/slide transitions.

**How:**
1. Install `framer-motion`.
2. Wrap React Router's outlets or main components in an `<AnimatePresence mode="wait">`.
3. Create a `<PageTransition>` wrapper component that fades and optionally slides content in when routes change.
4. Ensure `useReducedMotion` is respected.

**Files to modify:**
- `src/components/motion/PageTransition.tsx`
- `src/App.tsx` (or specific Route boundaries)
- `package.json`

**Done when:**
- [ ] Navigating between routes triggers smooth animations.
</task>

<task name="create_spline_asset_placeholder" type="auto">
**What:** Build a reusable, lazy-loaded component to display Spline 3D assets (`@splinetool/react-spline`).

**How:**
1. Install `@splinetool/react-spline`.
2. Create `src/components/three/SplineHero.tsx`.
3. Use `React.lazy` and `Suspense` so and large WebGL dependencies do not block initial loading.
4. Supply a fallback UI (like a skeleton loader or a lightweight CSS spinner) while Spline loads.

**Files to modify:**
- `src/components/three/SplineHero.tsx`

**Done when:**
- [ ] `<SplineHero splineUrl="..." />` successfully mounts.
- [ ] Fallback UI appears natively before 3D loads.
</task>

<task name="create_lottie_placeholder" type="auto">
**What:** Build a reusable placeholder component for folk-art Lottie animations.

**How:**
1. Install `lottie-react`.
2. Create `src/components/ui/LottieDivider.tsx` and `LottieLoader.tsx`.
3. Ensure it runs consistently in an infinite loop by default.
4. Download a generic open-source loading Lottie JSON file as a baseline test.

**Files to modify:**
- `src/components/ui/LottieLoader.tsx`
- `src/components/ui/LottieDivider.tsx`

**Done when:**
- [ ] `<LottieLoader animationData={someJson} loop={true} />` works without runtime errors.
</task>

## Success Criteria

- [ ] Lenis inertia scroll functions on immersive pages.
- [ ] Route transitions feature Framer Motion animations.
- [ ] `SplineHero` component manages its own `Suspense` loading states gracefully without blanking the screen.
- [ ] `LottieLoader` successfully renders JSON animations dynamically.

## Commit Message Template

```
feat(02-core): 02-02 UI motion and scrollytelling infrastructure

Set up Lenis smooth scroll for public pages.
Integrated Framer Motion AnimatePresence for router.
Created Spline 3D Suspense wrapper placeholders.
Created Lottie React component wrappers.

Requirements: UI/UX Aesthetic constraints
```
