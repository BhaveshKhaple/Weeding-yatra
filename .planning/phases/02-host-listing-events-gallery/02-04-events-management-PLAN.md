# Plan: Phase 2 - Events Management

## Objective

Empower Hosts to construct the chronological narrative of their wedding by managing individual events (Haldi, Mehendi, Sangeet, etc.). The interface must easily add, edit, and delete items from a sequential timeline.

## Requirements Addressed

- [ ] **EVENT-01**: Add event
- [ ] **EVENT-02**: Edit event
- [ ] **EVENT-03**: Delete event
- [ ] **EVENT-04**: Multiple events allowed
- [ ] **EVENT-05**: Shown chronologically

## Tasks

<task name="events_crud_ui" type="auto">
**What:** Create the Host Dashboard Events manager.

**How:**
1. Build `src/pages/host/Events.tsx` (or incorporate into Dashboard).
2. Fetch current `wedding_events` where `listing_id` matches user's listing.
3. Build a modal or inline form: `EventFormModal` to add or edit fields (Name, Date, Time, Venue, Description).
4. Build a delete confirmation modal.

**Files to modify:**
- `src/pages/host/Events.tsx`
- `src/components/host/events/EventFormModal.tsx`
- `src/components/host/events/EventListItem.tsx`

**Verification:**
```bash
# Add a mocked event via the UI and verify network request
```

**Done when:**
- [ ] Host can successfully Create, Read, Update, and Delete individual events attached to their listing ID.
</task>

<task name="chronological_timeline_sorting" type="auto">
**What:** Ensure events are requested and displayed strictly chronologically (Date + Time).

**How:**
1. In the Supabase fetch query `supabase.from('wedding_events').select('*').eq('listing_id', ID).order('event_date', { ascending: true }).order('event_time', { ascending: true })`.
2. Map these into a visually satisfying list using Framer Motion (e.g. stagger list animation) `framer-motion` `<motion.li variants={item}>`.

**Files to modify:**
- `src/hooks/useEvents.ts` (query logic)
- `src/pages/host/Events.tsx`

**Done when:**
- [ ] Irrespective of insertion order, the UI naturally displays Sangeet before Reception if scheduled chronologically.
</task>

## Success Criteria

At plan completion:
- [ ] Host can fully manage N events for their single listing.
- [ ] The dashboard list faithfully respects chronological constraints.
- [ ] Validations guarantee events must have both dates and times to function properly.

## Commit Message Template

```
feat(02-events): 02-04 Wedding events management

Added CRUD operations for event timeline building.
Ensured query responses sort chronologically.

Requirements: EVENT-01, EVENT-02, EVENT-03, EVENT-04, EVENT-05
```
