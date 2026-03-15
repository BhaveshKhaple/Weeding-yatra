# Plan: Phase 2 - Listing Creation (Multi-Step Form)

## Objective

Build the central Wedding Creation flow for Hosts. Implement a polished, highly-animated multi-step form utilizing Framer Motion, enabling hosts to define their couple details, wedding date/time, and basic bio. Restrict the platform to exactly one listing per host account.

## Requirements Addressed

- [ ] **LISTING-01**: Host creates listing
- [ ] **LISTING-02**: Host edits their listing
- [ ] **LISTING-03**: Host toggles listing status Open / Closed
- [ ] **LISTING-04**: One listing per host enforced
- [ ] **LISTING-05**: Immediately appears on public directory

## Context Files

- @[.planning/PROJECT.md] (Decision 3: Single wedding per Host)

## Tasks

<task name="multi_step_form_foundation" type="auto">
**What:** Scaffold the multi-step form architecture with Framer Motion.

**How:**
1. Create `src/components/host/ListingMultiStepForm.tsx`.
2. Define states for steps (1: Couple, 2: Venue/Date, 3: Story).
3. Connect an `<AnimatePresence mode="popLayout">` wrapper around the step contents so `framer-motion` correctly slides previous steps out and new steps in horizontally.
4. Build individual step sub-components (e.g. `CoupleStep.tsx`).

**Files to modify:**
- `src/components/host/ListingMultiStepForm.tsx`
- `src/components/host/steps/*.tsx`

**Done when:**
- [ ] User can walk forward and back through form steps smoothly with slide animations.
</task>

<task name="supabase_listing_mutations" type="auto">
**What:** Save the draft/final listing effectively to `wedding_listings`.

**How:**
1. Write the initial insertion saving the authenticated `user.id` as `host_id`.
2. Provide a React Query mutation (if used) or equivalent `supabase.from('wedding_listings').upsert()` logic.
3. Handle unique constraint violations gracefully to comply with **LISTING-04**.

**Files to modify:**
- `src/hooks/useWeddingListing.ts` (new)
- `src/components/host/ListingMultiStepForm.tsx`

**Done when:**
- [ ] Host submission populates the Supabase Database correctly.
- [ ] Attempting to insert a second listing fails nicely or triggers an update instead.
</task>

<task name="host_dashboard_listing_view" type="auto">
**What:** Render the Host Dashboard reflecting the current listing.

**How:**
1. Update `src/pages/host/Dashboard.tsx` (or equivalent) to fetch the host's existing `wedding_listings` row.
2. If row does NOT exist, show a "Create your Wedding" Call to Action.
3. If it exists, show an overview of their info and an "**Edit Listing**" button (**LISTING-02**).

**Files to modify:**
- `src/pages/host/Dashboard.tsx`

**Done when:**
- [ ] A returning host sees their saved data instantly.
</task>

<task name="open_closed_toggle" type="auto">
**What:** Add a status toggle for the host's listing.

**How:**
1. Embed a UI Switch component in the Host Dashboard.
2. The Switch changes `status` to `'open'` or `'closed'` triggering a Supabase `update`.
3. Reflect saving state visually so host gets feedback.

**Files to modify:**
- `src/components/host/ListingStatusToggle.tsx` (new)

**Done when:**
- [ ] Toggle instantly updates DB and UI.
- [ ] **LISTING-03** is satisfied.
</task>

## Success Criteria

At plan completion:
- [ ] Multi-step form allows smooth, structured entry of wedding data.
- [ ] Host can edit an existing listing directly.
- [ ] Duplicate listings are blocked (enforced one-to-one).
- [ ] Host can toggle their wedding's open/closed state.

## Commit Message Template

```
feat(02-listing): 02-03 Multi-step wedding creation form

Implemented Framer Motion multi-step listing editor for Host role.
Enforced 1:1 listing per host.
Added Open/Closed toggle on host dashboard.

Requirements: LISTING-01, LISTING-02, LISTING-03, LISTING-04, LISTING-05
```
