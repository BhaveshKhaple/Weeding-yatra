# Plan: Phase 2 - Photo Gallery Upload

## Objective

Build the media capability for Host listings. Implement a multiple image uploader that directly streams to the Supabase `wedding-photos` Storage bucket. Present these in a manageable grid interface for the host.

## Requirements Addressed

- [ ] **GALLERY-01**: Host uploads photos
- [ ] **GALLERY-02**: Host deletes photos
- [ ] **GALLERY-03**: Responsive grid display logic (partial/host view)
- [ ] **GALLERY-04**: JPG, PNG, WebP constraints

## Context Files

- @[.planning/PROJECT.md] (File Storage constraints)

## Tasks

<task name="storage_upload_component" type="auto">
**What:** Build the photo dropzone/uploader.

**How:**
1. Create `src/components/host/gallery/PhotoUploader.tsx`.
2. Configure a native file input or `react-dropzone` restricted explicitly to `accept="image/jpeg, image/png, image/webp"`.
3. Add client-side size constraints (e.g., max 5MB).
4. Perform the Supabase Storage upload: `supabase.storage.from('wedding-photos').upload(filePath, file)`.
5. Upon successful Storage upload, extract the public URL and INSERT a row into `gallery_photos` with the listing ID.

**Files to modify:**
- `src/components/host/gallery/PhotoUploader.tsx`

**Done when:**
- [ ] Selecting accepted files uploads them to Supabase Storage and populates `gallery_photos`.
- [ ] Trying to upload `.pdf` or `.gif` gets rejected client-side.
</task>

<task name="host_gallery_manager" type="auto">
**What:** Present the Host Gallery management grid.

**How:**
1. Build `src/pages/host/GalleryManager.tsx`.
2. Fetch the host's photos from `gallery_photos`.
3. Present them in an overlapping CSS Grid using `aspect-square` with `object-cover`.
4. Include a prominent hover-state "Trash" button.
5. On trash, perform a two-step deletion:
  - Delete `storage.remove()`
  - Delete `gallery_photos.delete()`

**Files to modify:**
- `src/pages/host/GalleryManager.tsx`
- `src/components/host/gallery/PhotoGridItem.tsx`

**Done when:**
- [ ] Hosts can cleanly visualize their uploaded assets.
- [ ] Deletions correctly wipe the DB row AND the storage blob.
</task>

<task name="cover_photo_integration" type="auto">
**What:** Guarantee the host's selected cover photo is handled seamlessly by listing forms.

**How:**
1. Connect the existing `ListingMultiStepForm` photo step to upload to the same bucket (if not done already).
2. Save its public URL to `wedding_listings.cover_photo_url`.

**Files to modify:**
- `src/components/host/steps/CoverPhotoStep.tsx`

**Done when:**
- [ ] The core listing cover image uses the secure storage bucket instead of external placeholder URLs.
</task>

## Success Criteria

At plan completion:
- [ ] Host can upload constrained image files directly bridging Storage and the relational Database.
- [ ] Database and Storage rows delete in synchronicity.
- [ ] Grid system scales down to mobile widths beautifully.

## Commit Message Template

```
feat(02-gallery): 02-05 Media upload and gallery manager

Added strictly-typed image dropzone for WebP/JPG/PNG.
Synced Supabase Storage blobs with gallery_photos PostgreSQL rows.
Implemented Host Gallery grid with cascading deletes.

Requirements: GALLERY-01, GALLERY-02, GALLERY-03, GALLERY-04
```
