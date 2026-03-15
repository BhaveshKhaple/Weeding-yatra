# Wedding Yatra — v1 Requirements
**Updated:** 2026-03-16  
**Status:** Revised (Scope Pivot — two-sided marketplace)  
**Core Value:** Connect foreign and regional travellers with authentic Indian weddings — hosts create public listings, travellers discover and request to join.

---

## User Roles

| Role | Description |
|---|---|
| **Host** | A local Indian couple or family that creates a public wedding listing and manages incoming join requests |
| **Traveller** | A foreign or regional visitor who browses public wedding listings and submits a "Request to Join" |

> Guests are always Travellers in the marketplace model. The Host approves or declines each request.

---

## v1 Requirements

### Authentication (Both Roles)

- [ ] **AUTH-01**: User (Host or Traveller) can sign up with email and password, selecting their role at registration
- [ ] **AUTH-02**: User can log in with email and password
- [ ] **AUTH-03**: User can log out and their session is fully cleared
- [ ] **AUTH-04**: User session persists across browser refreshes (Supabase session management)
- [ ] **AUTH-05**: Unauthenticated users attempting to access protected routes are redirected to the login page

---

### Wedding Listing (Host Role)

- [ ] **LISTING-01**: Authenticated Host can create a public wedding listing containing: couple names (Bride & Groom), wedding date, city/location, venue name, optional description/story, and cover photo
- [ ] **LISTING-02**: Authenticated Host can edit their wedding listing at any time
- [ ] **LISTING-03**: Host can toggle the listing between "Open" (accepting join requests) and "Closed" (no new requests)
- [ ] **LISTING-04**: Each Host account is associated with exactly one wedding listing (one-to-one for MVP)
- [ ] **LISTING-05**: The wedding listing is immediately visible on the public wedding directory once created

---

### Wedding Events (Host Role)

- [ ] **EVENT-01**: Authenticated Host can add wedding events to their listing, each with: event name (e.g., Haldi, Mehendi, Sangeet, Phera, Reception), date, time, and venue
- [ ] **EVENT-02**: Authenticated Host can edit the details of any existing event
- [ ] **EVENT-03**: Authenticated Host can delete an event from their listing
- [ ] **EVENT-04**: Multiple events can be added to a single wedding listing
- [ ] **EVENT-05**: Events are displayed in chronological order on the public wedding detail page

---

### Public Wedding Directory (Traveller Role)

- [ ] **BROWSE-01**: Any unauthenticated visitor can browse the public directory of upcoming weddings
- [ ] **BROWSE-02**: Directory shows wedding listings as cards with: couple names, cover photo, city, wedding date, and status (Open / Closed)
- [ ] **BROWSE-03**: Traveller can filter the directory by city
- [ ] **BROWSE-04**: Traveller can filter the directory by date range (upcoming / this month / custom)
- [ ] **BROWSE-05**: Traveller can view a wedding detail page showing the full listing: couple story, all events, photo gallery, and host-defined join requirements
- [ ] **BROWSE-06**: Only "Open" listings are displayed in the directory by default; closed listings are hidden

---

### Request to Join / RSVP (Traveller Role)

- [ ] **RSVP-01**: Authenticated Traveller can submit a "Request to Join" a wedding from the listing detail page
- [ ] **RSVP-02**: The request form collects: Traveller's full name, nationality, a brief message/introduction, and which events they wish to attend (multi-select from the listing's events)
- [ ] **RSVP-03**: A Traveller cannot submit more than one request per wedding listing
- [ ] **RSVP-04**: After submitting a request, the Traveller sees a confirmation message stating the request is pending host approval
- [ ] **RSVP-05**: Traveller can view the status of all their submitted requests (Pending / Approved / Declined) from their dashboard

---

### Host Request Management (Host Role)

- [ ] **HOST-01**: Authenticated Host can view all incoming "Request to Join" submissions on their dashboard
- [ ] **HOST-02**: Each request shows the Traveller's name, nationality, message, and selected events
- [ ] **HOST-03**: Host can approve a pending request
- [ ] **HOST-04**: Host can decline a pending request (optionally adding a short reason)
- [ ] **HOST-05**: Dashboard shows a summary count: total requests, pending, approved, declined

---

### Photo Gallery (Host Role)

- [ ] **GALLERY-01**: Authenticated Host can upload photos to their wedding gallery (via Supabase Storage)
- [ ] **GALLERY-02**: Authenticated Host can delete individual photos from their gallery
- [ ] **GALLERY-03**: Photos are displayed in a responsive grid on the public wedding detail page
- [ ] **GALLERY-04**: Photo uploads are restricted to JPG, PNG, and WebP formats

---

## v2 (Deferred — Post-MVP)

### Authentication
- **AUTH-v2-01**: Google OAuth / social login
- **AUTH-v2-02**: Magic link (passwordless) login
- **AUTH-v2-03**: Email verification on sign-up

### Marketplace Discovery
- **BROWSE-v2-01**: Full-text search across listings by keyword
- **BROWSE-v2-02**: Filter by cultural ceremony type (Hindu, Muslim, Sikh, etc.)
- **BROWSE-v2-03**: Map view of listings by city
- **BROWSE-v2-04**: Host-defined maximum traveller count per event

### Communication
- **COMM-v2-01**: In-app messaging between Host and approved Traveller
- **COMM-v2-02**: Email notification to Traveller when request is approved or declined
- **COMM-v2-03**: Email notification to Host when a new join request is submitted

### Host Tools
- **HOST-v2-01**: Host can set a cultural exchange fee or donation suggestion per approved traveller
- **HOST-v2-02**: Host can add a list of "what to expect / cultural etiquette" guidelines on their listing

### Traveller Profile
- **TRVL-v2-01**: Traveller can build a public profile with their photo, home country, languages, and travel history
- **TRVL-v2-02**: Host can view a Traveller's profile before approving their request

---

## Out of Scope (MVP)

| Feature | Reason |
|---|---|
| Personal (private) invite-only weddings | Different product; MVP is public marketplace only |
| Custom domains for listings | Infrastructure overhead; not MVP-critical |
| Admin / super-admin panel | Not needed for solo MVP |
| Payments / transaction processing | Complex; deferred |
| Native mobile apps (iOS / Android) | Web is mobile-first for MVP |
| Multi-language / i18n | English first |
| WhatsApp share button | Replaced by public directory as discovery mechanism |
| Real-time notifications (WebSockets) | Polling sufficient at MVP scale |

---

## Traceability

**Coverage: 35/35 requirements mapped** ✓

| REQ-ID | Phase | Status |
|--------|-------|--------|
| AUTH-01 | Phase 1 — Foundation & Auth | Pending |
| AUTH-02 | Phase 1 — Foundation & Auth | Pending |
| AUTH-03 | Phase 1 — Foundation & Auth | Pending |
| AUTH-04 | Phase 1 — Foundation & Auth | Pending |
| AUTH-05 | Phase 1 — Foundation & Auth | Pending |
| LISTING-01 | Phase 2 — Host: Listing, Events & Gallery | Pending |
| LISTING-02 | Phase 2 — Host: Listing, Events & Gallery | Pending |
| LISTING-03 | Phase 2 — Host: Listing, Events & Gallery | Pending |
| LISTING-04 | Phase 2 — Host: Listing, Events & Gallery | Pending |
| LISTING-05 | Phase 2 — Host: Listing, Events & Gallery | Pending |
| EVENT-01 | Phase 2 — Host: Listing, Events & Gallery | Pending |
| EVENT-02 | Phase 2 — Host: Listing, Events & Gallery | Pending |
| EVENT-03 | Phase 2 — Host: Listing, Events & Gallery | Pending |
| EVENT-04 | Phase 2 — Host: Listing, Events & Gallery | Pending |
| EVENT-05 | Phase 2 — Host: Listing, Events & Gallery | Pending |
| GALLERY-01 | Phase 2 — Host: Listing, Events & Gallery | Pending |
| GALLERY-02 | Phase 2 — Host: Listing, Events & Gallery | Pending |
| GALLERY-03 | Phase 2 — Host: Listing, Events & Gallery | Pending |
| GALLERY-04 | Phase 2 — Host: Listing, Events & Gallery | Pending |
| BROWSE-01 | Phase 3 — Public Directory & Traveller RSVP | Pending |
| BROWSE-02 | Phase 3 — Public Directory & Traveller RSVP | Pending |
| BROWSE-03 | Phase 3 — Public Directory & Traveller RSVP | Pending |
| BROWSE-04 | Phase 3 — Public Directory & Traveller RSVP | Pending |
| BROWSE-05 | Phase 3 — Public Directory & Traveller RSVP | Pending |
| BROWSE-06 | Phase 3 — Public Directory & Traveller RSVP | Pending |
| RSVP-01 | Phase 3 — Public Directory & Traveller RSVP | Pending |
| RSVP-02 | Phase 3 — Public Directory & Traveller RSVP | Pending |
| RSVP-03 | Phase 3 — Public Directory & Traveller RSVP | Pending |
| RSVP-04 | Phase 3 — Public Directory & Traveller RSVP | Pending |
| RSVP-05 | Phase 3 — Public Directory & Traveller RSVP | Pending |
| HOST-01 | Phase 4 — Host Request Management & Launch | Pending |
| HOST-02 | Phase 4 — Host Request Management & Launch | Pending |
| HOST-03 | Phase 4 — Host Request Management & Launch | Pending |
| HOST-04 | Phase 4 — Host Request Management & Launch | Pending |
| HOST-05 | Phase 4 — Host Request Management & Launch | Pending |
