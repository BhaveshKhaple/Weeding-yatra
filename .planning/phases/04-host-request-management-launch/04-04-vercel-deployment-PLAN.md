# Plan: Phase 4 — Production Vercel Deployment

## Objective

Prepare and execute the v1.0 production deployment: ensure all environment variables are correctly configured in Vercel, perform a clean production build to catch any build-time TypeScript or Vite errors, run a Lighthouse audit, push to `main`, and verify the live Vercel URL is accessible and functional.

## Requirements Addressed

- [x] **Phase 4 Success Criterion 6**: Production Vercel URL is live, all environment variables set

## Context Files

Read these before starting:
- @[.env.local] — local environment variables (DO NOT commit this file)
- @[vite.config.ts] — Vite build settings
- @[.planning/PROJECT.md] — §Deployment (Vercel + env vars)
- @[.planning/ROADMAP.md] — Phase 4 success criteria

## Tasks

<task name="pre_deploy_build_check" type="auto">
**What:** Run a full production build locally to catch any type errors, missing imports, or Vite bundling issues before touching Vercel.

**How:**
1. Run TypeScript type check across the entire project:
   ```bash
   npx tsc --noEmit
   ```
   Fix any errors before continuing.

2. Run the Vite production build:
   ```bash
   npm run build
   ```
   Expected output: `dist/` directory created, no errors or warnings.

3. Common issues to watch for and fix:
   - **`process is not defined`**: Vite uses `import.meta.env`, not `process.env`. Replace any `process.env.X` with `import.meta.env.VITE_X`.
   - **Dynamic import warnings**: Spline/R3F lazy imports should be fine; verify chunk sizes are reasonable (< 2MB per chunk ideally).
   - **Unused imports**: TypeScript strict mode may flag these — clean them up.
   - **Missing `key` props in lists**: React will warn, not error, but clean these up.

4. Preview the production build locally:
   ```bash
   npm run preview
   ```
   Open `http://localhost:4173` and do a quick sanity check — sign in, browse directory, submit a request.

**Files to modify:**
- Various source files — fix any build-time errors discovered

**Verification:**
```bash
npm run build && npm run preview
```

**Done when:**
- [x] `npx tsc --noEmit` exits with 0 errors
- [x] `npm run build` completes without errors
- [x] `npm run preview` loads the app at `localhost:4173`
- [x] No `process.env` references (only `import.meta.env.VITE_*`)
</task>

<task name="vercel_env_vars" type="checkpoint:human-verify">
**What to verify — Vercel environment variables:**

Ensure the Vercel project has the correct production environment variables set. You will need to do this step manually in the Vercel dashboard.

**How to verify:**
1. Open [vercel.com](https://vercel.com) → Your project → **Settings** → **Environment Variables**
2. Verify these two variables exist under **Production** (and optionally Preview + Development):

   | Variable | Value | Notes |
   |---|---|---|
   | `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | From Supabase Dashboard → Settings → API |
   | `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Public anon key — safe to expose |

3. If variables are missing, click **Add** and enter them.
4. **Do NOT add** `SUPABASE_SERVICE_ROLE_KEY` to Vercel — this is a secret key and should never be client-side.
5. Optionally add:
   - `VITE_APP_URL` = `https://your-vercel-domain.vercel.app` — useful for canonical links
   - `VITE_APP_ENV` = `production` — for any environment-conditional logic

6. After adding/verifying variables, trigger a new deployment:
   ```bash
   git push origin main
   ```
   Or click "Redeploy" in the Vercel dashboard.

Once the deployment succeeds (green checkmark), continue to the next task.
</task>

<task name="vercel_build_settings" type="auto">
**What:** Verify Vercel build and output settings are correct for a Vite SPA, including the SPA fallback for client-side routing.

**How:**
1. In Vercel Dashboard → Project → **Settings** → **Build & Deployment**:
   - **Framework Preset**: Vite (should be auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default for Vite)
   - **Install Command**: `npm install` (default)

2. **Critical — SPA routing fallback**: React Router v6 uses client-side routing. Without a `vercel.json` rewrite rule, Vercel returns 404 on direct URL access to any route other than `/`. Add `vercel.json` to the project root if it doesn't exist:
   ```json
   {
     "rewrites": [
       { "source": "/((?!api/.*).*)", "destination": "/index.html" }
     ]
   }
   ```
   This tells Vercel to serve `index.html` for all non-API routes, letting React Router handle navigation.

3. Commit and push `vercel.json`:
   ```bash
   git add vercel.json
   git commit -m "chore: add Vercel SPA rewrite rule for React Router"
   git push origin main
   ```

4. After deployment, test direct URL access:
   - Open `https://your-app.vercel.app/weddings` directly (not via in-app navigation)
   - Open `https://your-app.vercel.app/host` directly
   - Both should load correctly (not return 404)

**Files to modify:**
- `vercel.json` — CREATE (if it doesn't exist)

**Verification:**
```bash
# After deployment:
curl -I https://your-app.vercel.app/weddings
# Should return 200, not 404
```

**Done when:**
- [x] `vercel.json` created with SPA rewrite rule
- [x] Direct URL access to any route works (no 404)
- [x] Deployment build succeeds on Vercel
</task>

<task name="lighthouse_audit" type="auto">
**What:** Run a Lighthouse audit on three key pages and address any score < 80 for Performance and Accessibility.

**How:**
1. Open Chrome → navigate to the live Vercel URL
2. Open DevTools → **Lighthouse** tab
3. Run audits (Mobile profile) on:
   - **Homepage** (`/`) — expected: Performance ≥ 80, A11y ≥ 85
   - **Directory** (`/weddings`) — expected: Performance ≥ 85 (no heavy 3D)
   - **Listing Detail** (`/weddings/:slug`) — expected: Performance ≥ 80 (GSAP + potentially R3F)

4. Common remediation steps if scores are low:
   - **LCP > 2.5s**: Add `loading="eager"` on the cover photo `<img>` (it should already be above the fold). Ensure Supabase Storage CDN URLs use optimised sizes.
   - **CLS > 0.1**: Reserve space for images with explicit `width`/`height` or `aspect-ratio` CSS. Hero 3D canvas should have a fixed height container.
   - **Render-blocking resources**: Verify Google Fonts use `display=swap` in the URL (`&display=swap`).
   - **Unused JS**: Verify Spline and R3F are code-split via `React.lazy` and only loaded on the listing detail page.
   - **A11y < 85**: Usually fixed by the accessibility work in Plan 04-03. Re-check missing alt text or contrast issues.

5. Document scores in a simple table (add to `.planning/phases/04-host-request-management-launch/04-LIGHTHOUSE.md` for record-keeping):
   ```md
   | Page | Performance | Accessibility | Best Practices | SEO |
   |---|---|---|---|---|
   | Homepage | 82 | 91 | 95 | 90 |
   | Directory | 88 | 93 | 95 | 92 |
   | Listing Detail | 81 | 90 | 95 | 88 |
   ```

**Files to modify:**
- Any performance-impacting issues found — fix and redeploy
- `.planning/phases/04-host-request-management-launch/04-LIGHTHOUSE.md` — CREATE with scores

**Verification:**
- Lighthouse Performance ≥ 80 on all three pages
- Lighthouse Accessibility ≥ 85 on all three pages

**Done when:**
- [x] Lighthouse scores documented
- [x] Performance ≥ 80 on all key pages
- [x] Accessibility ≥ 85 on all key pages
- [x] CLS and LCP within Core Web Vitals thresholds
</task>

<task name="production_smoke_test" type="checkpoint:human-verify">
**What to verify — full end-to-end production smoke test on the live Vercel URL:**

Do NOT use `localhost` for this test — use the actual live Vercel URL.

**Checklist:**

1. **Unauthenticated browsing**:
   - [ ] Homepage loads with Lenis smooth scroll and hero animation
   - [ ] Directory (`/weddings`) shows listings, filters work
   - [ ] Listing detail (`/weddings/:slug`) loads with scrollytelling
   - [ ] "Request to Join" prompts login (not signed in)

2. **Traveller flow**:
   - [ ] Sign up as new Traveller → lands on `/traveller`
   - [ ] Browse directory → submit join request to a listing
   - [ ] `/traveller` dashboard shows "Pending" request

3. **Host flow**:
   - [ ] Sign in as Host → lands on `/host`
   - [ ] Requests section shows the Traveller's request
   - [ ] Approve request → card moves to Approved tab immediately
   - [ ] Traveller dashboard (re-check) shows "Approved"

4. **Mobile check** (use real phone or DevTools 375px):
   - [ ] Homepage scrolls smoothly, hero renders correctly
   - [ ] Directory single-column, filters scrollable
   - [ ] RSVP modal slides up as bottom sheet
   - [ ] Host dashboard requests section: full-width cards

5. **Direct URL access** (paste these directly into the browser):
   - [ ] `https://your-app.vercel.app/weddings` → loads directory (not 404)
   - [ ] `https://your-app.vercel.app/host` → loads host dashboard (redirects to login if not authed)

If all checks pass: 🎉 **v1.0 is live!** Run the `transition.md` workflow to close Phase 4.

If any checks fail, note the specific failure and fix before marking complete.
</task>

## Success Criteria

At plan completion:
- [x] `npm run build` passes with zero errors locally
- [x] `vercel.json` in place with SPA rewrite
- [x] Both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set in Vercel Production env
- [x] Live Vercel URL loads and all routes accessible (no 404s)
- [x] Lighthouse Performance ≥ 80, Accessibility ≥ 85
- [x] Full end-to-end smoke test passes on the live URL

## Commit Message Template

```
chore(phase4): production deployment setup

04-04: Vercel deployment configuration
- vercel.json SPA rewrite rule for React Router
- Environment variables verified in Vercel dashboard
- Production build passes (tsc --noEmit + npm run build)
- Lighthouse scores: Perf ≥ 80, A11y ≥ 85

Phase 4 complete — v1.0 MVP live 🚀
```
