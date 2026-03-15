-- ============================================================
-- Wedding Yatra — Full Database Schema & RLS Policies
-- Run this entire script in the Supabase SQL Editor
-- ============================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role         text NOT NULL CHECK (role IN ('host', 'traveller')),
  full_name    text NOT NULL DEFAULT '',
  nationality  text,
  created_at   timestamptz DEFAULT now() NOT NULL
);

-- 2. WEDDING LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.wedding_listings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id          uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug             text NOT NULL UNIQUE,
  bride_name       text NOT NULL DEFAULT '',
  groom_name       text NOT NULL DEFAULT '',
  wedding_date     date NOT NULL,
  city             text NOT NULL DEFAULT '',
  venue_name       text NOT NULL DEFAULT '',
  description      text,
  cover_photo_url  text,
  status           text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at       timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_wedding_listings_city   ON public.wedding_listings(city);
CREATE INDEX IF NOT EXISTS idx_wedding_listings_date   ON public.wedding_listings(wedding_date);
CREATE INDEX IF NOT EXISTS idx_wedding_listings_status ON public.wedding_listings(status);

-- 3. WEDDING EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.wedding_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id   uuid NOT NULL REFERENCES public.wedding_listings(id) ON DELETE CASCADE,
  name         text NOT NULL,
  event_date   date NOT NULL,
  event_time   time NOT NULL,
  venue        text NOT NULL DEFAULT '',
  description  text
);

CREATE INDEX IF NOT EXISTS idx_wedding_events_listing ON public.wedding_events(listing_id);

-- 4. GALLERY PHOTOS TABLE
CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id    uuid NOT NULL REFERENCES public.wedding_listings(id) ON DELETE CASCADE,
  storage_path  text NOT NULL,
  public_url    text NOT NULL,
  created_at    timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_gallery_photos_listing ON public.gallery_photos(listing_id);

-- 5. JOIN REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.join_requests (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id       uuid NOT NULL REFERENCES public.wedding_listings(id) ON DELETE CASCADE,
  traveller_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message          text NOT NULL DEFAULT '',
  nationality      text NOT NULL DEFAULT '',
  selected_events  uuid[] NOT NULL DEFAULT '{}',
  status           text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
  decline_reason   text,
  submitted_at     timestamptz DEFAULT now() NOT NULL,
  UNIQUE (listing_id, traveller_id)
);

CREATE INDEX IF NOT EXISTS idx_join_requests_listing    ON public.join_requests(listing_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_traveller  ON public.join_requests(traveller_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_status     ON public.join_requests(status);


-- ============================================================
-- Row-Level Security Policies
-- ============================================================

ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests    ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ──
CREATE POLICY "profiles: select own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles: update own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles: insert own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ── WEDDING LISTINGS ──
CREATE POLICY "listings: public read" ON public.wedding_listings FOR SELECT USING (true);
CREATE POLICY "listings: host insert" ON public.wedding_listings FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "listings: host update" ON public.wedding_listings FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "listings: host delete" ON public.wedding_listings FOR DELETE USING (auth.uid() = host_id);

-- ── WEDDING EVENTS ──
CREATE POLICY "events: public read" ON public.wedding_events FOR SELECT USING (true);
CREATE POLICY "events: host insert" ON public.wedding_events FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.wedding_listings WHERE id = listing_id AND host_id = auth.uid()));
CREATE POLICY "events: host update" ON public.wedding_events FOR UPDATE USING (EXISTS (SELECT 1 FROM public.wedding_listings WHERE id = listing_id AND host_id = auth.uid()));
CREATE POLICY "events: host delete" ON public.wedding_events FOR DELETE USING (EXISTS (SELECT 1 FROM public.wedding_listings WHERE id = listing_id AND host_id = auth.uid()));

-- ── GALLERY PHOTOS ──
CREATE POLICY "gallery: public read" ON public.gallery_photos FOR SELECT USING (true);
CREATE POLICY "gallery: host insert" ON public.gallery_photos FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.wedding_listings WHERE id = listing_id AND host_id = auth.uid()));
CREATE POLICY "gallery: host delete" ON public.gallery_photos FOR DELETE USING (EXISTS (SELECT 1 FROM public.wedding_listings WHERE id = listing_id AND host_id = auth.uid()));

-- ── JOIN REQUESTS ──
CREATE POLICY "requests: traveller insert" ON public.join_requests FOR INSERT WITH CHECK (auth.uid() = traveller_id);
CREATE POLICY "requests: traveller select own" ON public.join_requests FOR SELECT USING (auth.uid() = traveller_id);
CREATE POLICY "requests: host select all" ON public.join_requests FOR SELECT USING (EXISTS (SELECT 1 FROM public.wedding_listings WHERE id = listing_id AND host_id = auth.uid()));
CREATE POLICY "requests: host update status" ON public.join_requests FOR UPDATE USING (EXISTS (SELECT 1 FROM public.wedding_listings WHERE id = listing_id AND host_id = auth.uid()));


-- ============================================================
-- Auto-create profile trigger
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, nationality)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'traveller'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'nationality'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
