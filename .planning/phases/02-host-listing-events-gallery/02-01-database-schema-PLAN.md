# Plan: Phase 2 - Database & Storage Setup

## Objective

Set up the core data infrastructure for Phase 2. Create the necessary Supabase PostgreSQL tables for listings, events, and gallery photos, along with the Supabase Storage bucket. Configure strict Row-Level Security (RLS) to ensure only hosts can modify their listings while the public can view them.

## Requirements Addressed

- [ ] **LISTING-01** (partial - DB structure)
- [ ] **EVENT-01** (partial - DB structure)
- [ ] **GALLERY-01** (partial - bucket)

## Context Files

Read these before starting:
- @[.planning/STATE.md]
- @[.planning/PROJECT.md] (for DB Schema architecture)

## Tasks

<task name="create_tables_sql" type="auto">
**What:** Write and apply migration for `wedding_listings`, `wedding_events`, and `gallery_photos`.

**How:**
1. Create a `migration.sql` script (use Supabase dashboard or local migration, prefer local migration via `supabase migration new` if configured natively).
2. Create `wedding_listings` table with unique constraint on `host_id`.
3. Create `wedding_events` and `gallery_photos` with foreign keys to `listing_id` ON DELETE CASCADE.
4. Ensure `updated_at` triggers exist.

**Files to modify:**
- `supabase/migrations/XXX_add_wedding_tables.sql`

**Verification:**
```bash
# Check the DB using supabase studio or psql to verify table structures
npm run test --if-configured
```

**Done when:**
- [ ] The three tables are created in the database schema.
- [ ] Constraints and foreign keys are intact.
</task>

<task name="setup_storage_bucket" type="auto">
**What:** Create the public `wedding-photos` bucket in Supabase Storage.

**How:**
1. Extend the SQL migration to create a new storage bucket `wedding-photos` (via `storage.buckets`).
2. Set it to `public` so images can be delivered without signed URLs.

**Files to modify:**
- `supabase/migrations/XXX_add_wedding_tables.sql`

**Done when:**
- [ ] `wedding-photos` bucket exists in `storage.buckets`.
- [ ] Bucket is public.
</task>

<task name="apply_rls_policies" type="auto">
**What:** Apply Row-Level Security to all new tables and the storage bucket.

**How:**
1. Enable RLS on `wedding_listings`, `wedding_events`, and `gallery_photos`.
2. Add PUBLIC read access to all three tables.
3. Add INSERT/UPDATE/DELETE access to `wedding_listings` where `auth.uid() = host_id`.
4. Add INSERT/UPDATE/DELETE access to `wedding_events` and `gallery_photos` matching listing owner.
5. Create RLS policies for `storage.objects` for the `wedding-photos` bucket (Insert/Delete restricted to host).

**Files to modify:**
- `supabase/migrations/XXX_add_wedding_tables.sql`

**Done when:**
- [ ] RLS is active on all new tables and the storage bucket.
- [ ] Anonymous read is permitted.
- [ ] Host write is scoped correctly.
</task>

<task name="generate_types" type="auto">
**What:** Generate TypeScript definitions from the new Supabase schema.

**How:**
1. Run `supabase gen types typescript --local > src/types/supabase.ts` (assuming local workflow, else cloud URL).
2. Validate there are no TS errors in the app after updating types.

**Files to modify:**
- `src/types/supabase.ts`

**Verification:**
```bash
npm run build # Ensure no typecheck errors
```

**Done when:**
- [ ] Types perfectly match the DB schema.
</task>

## Success Criteria

At plan completion:
- [ ] `wedding_listings`, `wedding_events`, and `gallery_photos` tables exist.
- [ ] `wedding-photos` storage bucket exists and is public.
- [ ] Strict RLS prevents unauthorized writes but allows public reads.
- [ ] Types are fully generated.

## Commit Message Template

```
feat(02-host): 02-01 database schema and storage

Requirements: LISTING-01, EVENT-01, GALLERY-01
```
