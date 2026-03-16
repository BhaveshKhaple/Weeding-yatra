# Plan: Phase 3 — RSVP UI (Modal, Sticky CTA, WhatsApp Handoff)

## Objective

Build the full RSVP user experience on the wedding detail page: a sticky bottom "Request to Join" bar, an elegant slide-over/modal RSVP form, a confirmation screen with WhatsApp deep link handoff, and the cultural greeting message field. Connect everything to the `useJoinRequests` hook from Plan 03-03.

## Requirements Addressed

- [ ] **RSVP-01**: Authenticated Traveller submits "Request to Join" from listing detail page
- [ ] **RSVP-02**: Request form collects: name, nationality, message, selected events (+ guest count per user spec)
- [ ] **RSVP-04**: After submit, Traveller sees confirmation ("Request pending host approval")
- [ ] **BROWSE-05**: Traveller views full detail page (story, events, gallery, join requirements) — enhance with RSVP CTA

## Context Files

Read these before starting:
- @[src/pages/public/WeddingDetail.tsx] — current scrollytelling page (has Phase 3 CTA placeholder at bottom)
- @[src/hooks/useJoinRequests.ts] — hook from Plan 03-03
- @[src/lib/types.ts] — JoinRequest, WeddingEvent types
- @[src/contexts/AuthContext.tsx] — useAuth() for current user role/status
- @[src/components/motion/PageTransition.tsx] — animation wrapper reference

## Tasks

<task name="sticky_rsvp_bar" type="auto">
**What:** Create a sticky bottom CTA bar that appears on the WeddingDetail page for logged-in Travellers (or prompts login for unauthenticated visitors).

**How:**
1. Create `src/components/traveller/RSVPBottomBar.tsx`
2. Behaviour by auth state:
   - **Unauthenticated:** Show "Sign up to request an invite →" linking to `/signup`
   - **Logged in as Host:** Don't show the bar at all (hosts don't RSVP)
   - **Logged in as Traveller, no existing request:** Show "Request to Join 🎊" button that opens the RSVP modal
   - **Logged in as Traveller, already requested:** Show "Request Pending ⏳" or "Approved ✅" status — disable the button
3. Styling:
   - Fixed bottom: `fixed bottom-0 left-0 right-0 z-50`
   - Glassmorphism: `bg-charcoal/80 backdrop-blur-xl border-t border-white/10`
   - Safe area padding for mobile (`pb-safe` or explicit padding)
   - Entrance animation: `motion.div` slides up from bottom with spring transition
4. Props: `listing: WeddingListing`, `onRequestJoin: () => void`, `existingRequest: JoinRequest | null`
5. Use `useAuth()` to determine auth state and role

**Files to modify:**
- `src/components/traveller/RSVPBottomBar.tsx` — CREATE

**Verification:**
```bash
npx tsc --noEmit src/components/traveller/RSVPBottomBar.tsx
```

**Done when:**
- [ ] Bar renders fixed at viewport bottom
- [ ] Shows correct state per auth/role/existing request
- [ ] Glassmorphism styling applied
- [ ] Slide-up entrance animation works
</task>

<task name="rsvp_modal" type="auto">
**What:** Build the RSVP slide-over modal form with guest count, cultural greeting, and event selection.

**How:**
1. Create `src/components/traveller/RSVPModal.tsx`
2. **Overlay**: dark backdrop (`bg-black/60 backdrop-blur-sm`) with click-outside-to-close
3. **Slide-over panel**: slides in from the right on desktop, slides up from bottom on mobile (using Framer Motion `animate` + `initial`)
4. **Form fields** (stagger-animated with Framer Motion):
   - **Guest count**: Number stepper (1 – 10) with + / - buttons, styled with saffron accent
   - **Cultural greeting / message**: Multi-line textarea with placeholder "Write a warm message to the couple…" (maps to `message` field)
   - **Event selection**: Multi-select checkboxes for each event from `WeddingEvent[]`. Show event name + date. Styled as selectable cards with saffron active border.
   - **Nationality**: Pre-filled from user's profile if available, otherwise text input
5. **Submit button**: "Send Request 🙏" with loading spinner state
6. **Validation**: Guest count ≥ 1, message required (min 10 chars), at least 1 event selected
7. On submit: call `submitRequest()` from `useJoinRequests` hook
8. On success: transition the modal content to the confirmation + WhatsApp handoff screen (Task 3)
9. On error (e.g., already requested): show inline error message

**Files to modify:**
- `src/components/traveller/RSVPModal.tsx` — CREATE

**Verification:**
```bash
npx tsc --noEmit src/components/traveller/RSVPModal.tsx
```

**Done when:**
- [ ] Modal slides in/out with Framer Motion
- [ ] All form fields render and validate
- [ ] Event multi-select works
- [ ] Submit calls Supabase via the hook
- [ ] Loading state shows during submission
</task>

<task name="whatsapp_handoff" type="auto">
**What:** Build the post-RSVP confirmation screen with WhatsApp deep link generation.

**How:**
1. Create `src/utils/whatsapp.ts` with a `generateWhatsAppLink(phoneNumber: string | null, params: { brideName: string; groomName: string; travellerName: string; message: string }): string` function
2. Generate deep link format: `https://wa.me/?text=...` (without phone number since we don't collect host phone in MVP — the traveller manually shares the link or finds the host)
   - Alternative: If we want to include host phone, add an optional `whatsapp_number` field to the listing (future enhancement). For now, use `https://wa.me/?text={encodedMessage}`
3. Pre-formatted message: 
   ```
   🎊 Wedding Yatra — Join Request
   
   Hi! I'm {travellerName} and I've requested to join {brideName} & {groomName}'s wedding celebration on Wedding Yatra.
   
   My message: "{message}"
   
   Looking forward to being part of your special day! 🙏
   ```
4. Create `src/components/traveller/RSVPConfirmation.tsx` — shown inside the RSVPModal after successful submit:
   - ✅ Success illustration/emoji animation
   - "Your request has been sent!" heading
   - "Request pending host approval" sub-text
   - **WhatsApp CTA**: Big green WhatsApp button linking to the generated deep link (opens wa.me in new tab)
   - "View My Requests" link to `/traveller` dashboard
   - "Close" button to dismiss the modal
5. Use Framer Motion `AnimatePresence` to transition from form → confirmation inside the modal

**Files to modify:**
- `src/utils/whatsapp.ts` — CREATE
- `src/components/traveller/RSVPConfirmation.tsx` — CREATE

**Verification:**
```bash
npx tsc --noEmit src/utils/whatsapp.ts
npx tsc --noEmit src/components/traveller/RSVPConfirmation.tsx
```

**Done when:**
- [ ] WhatsApp link generates correctly with URL-encoded message
- [ ] Confirmation screen renders with success animation
- [ ] WhatsApp CTA opens wa.me in new tab
- [ ] "View My Requests" navigates to Traveller dashboard
- [ ] Smooth transition from form to confirmation inside modal
</task>

<task name="wire_into_wedding_detail" type="auto">
**What:** Integrate the RSVP bottom bar and modal into the WeddingDetail page.

**How:**
1. Update `src/pages/public/WeddingDetail.tsx`:
   - Import `RSVPBottomBar`, `RSVPModal`
   - Add state: `showRSVPModal`, `existingRequest`
   - On mount, if user is a logged-in Traveller, call `checkExistingRequest()` to see if they already submitted
   - Render `<RSVPBottomBar>` at the bottom of the page
   - Render `<RSVPModal>` conditionally when `showRSVPModal` is true
   - Pass the listing's events list to the modal for event selection
2. Replace the current "Footer CTA" placeholder (lines 198–224 of WeddingDetail.tsx) with the `<RSVPBottomBar>` component
3. Remove the status filter `.eq('status', 'open')` from the WeddingDetail query — allow viewing closed listings too (they just won't appear in the directory and the RSVP bar will show "This wedding is closed")
4. Add bottom padding to the page content so the sticky bar doesn't overlap the last section

**Files to modify:**
- `src/pages/public/WeddingDetail.tsx` — UPDATE

**Verification:**
```bash
npm run dev
# Visit /weddings/:slug as a Traveller
# See sticky RSVP bar at bottom
# Click "Request to Join" — modal opens
# Fill form and submit — confirmation + WhatsApp link shown
```

**Done when:**
- [ ] RSVP bar renders at bottom of wedding detail page
- [ ] Modal opens on CTA click
- [ ] Form submits to Supabase
- [ ] Confirmation with WhatsApp link shows after submit
- [ ] Existing request detected and bar shows "Pending" status
- [ ] No RSVP bar for hosts or when listing is closed
</task>

<task name="verify_rsvp_flow" type="checkpoint:human-verify">
**What to verify:**
- RSVP bar shows for unauthenticated users (with signup prompt)
- RSVP bar shows for logged-in Travellers
- RSVP bar hidden for logged-in Hosts
- Modal form validates inputs
- Submission creates a row in `join_requests`
- Duplicate request prevented (try submitting again)
- WhatsApp link opens correctly
- Confirmation screen shows

**How to verify:**
1. Run `npm run dev`
2. Test each auth state scenario on `/weddings/:slug`
3. Submit an RSVP as a Traveller
4. Check Supabase Table Editor for the new row
5. Try submitting again — should be blocked
6. Click WhatsApp link — should open wa.me

If approved, continue. If issues, fix before proceeding.
</task>

## Success Criteria

At plan completion:
- [ ] All requirement checkboxes above marked done
- [ ] Full RSVP flow works end-to-end
- [ ] WhatsApp handoff generates correct deep link
- [ ] Duplicate request prevention works
- [ ] No breaking changes to existing features

## Commit Message Template

```
feat(phase3): RSVP modal, sticky CTA bar, and WhatsApp handoff

03-04: Full RSVP UI for Travellers
- Sticky bottom bar with auth-aware state
- Slide-over modal with guest count, message, event selection
- Post-submit confirmation with WhatsApp deep link
- Wired into WeddingDetail page

Requirements: RSVP-01, RSVP-02, RSVP-04, BROWSE-05
```
