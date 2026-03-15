# Summary: 1 — 01-02: Supabase Setup

**Objective:** Create and configure the Supabase project: apply the full database schema (5 tables), enable Row-Level Security with correct policies on every table, create the gallery Storage bucket, and wire up real environment variables in `.env.local` and Vercel.

**Completed:** 2026-03-16

## Tasks Completed

1. ✅ **create_supabase_project**
   - User manually created `wedding-yatra-dev` Supabase project
   - Real `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` added to `.env.local`
2. ✅ **apply_database_schema**
   - Applied SQL to create 5 tables: `profiles`, `wedding_listings`, `wedding_events`, `gallery_photos`, `join_requests`
   - All foreign keys and indexes created
3. ✅ **apply_rls_policies**
   - RLS enabled on all 5 tables
   - 17 total policies created for granular, role-based, owner-based, and public access per PROJECT.md matrix
4. ✅ **create_profile_trigger**
   - Custom PL/pgSQL function `handle_new_user` created
   - Attached to `on_auth_user_created` trigger for automatic profile row creation
5. ✅ **create_storage_bucket**
   - Public storage bucket `wedding-photos` created
   - INSERT policies configured for authenticated hosts
6. ✅ **configure_vercel_deployment**
   - Confirmed by user

## Deviations

**Auto-applied:**
- Consolidated the schema, RLS policies, and profile trigger into a single deployable SQL script (`supabase_setup.sql`) to streamline the manual copy-paste workflow for the user.

## Verification

✅ Supabase project live and accessible
✅ Environment variables populated locally
✅ SQL execution reported successful by user approval

## Next Steps

[More plans] → Execute plan 01-03 (Authentication Flows & Role-Based Route Guards)
