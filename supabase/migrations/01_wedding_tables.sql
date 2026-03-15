-- 1. Create `wedding_listings` table
CREATE TABLE IF NOT EXISTS public.wedding_listings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  slug text UNIQUE NOT NULL,
  bride_name text NOT NULL,
  groom_name text NOT NULL,
  wedding_date date NOT NULL,
  city text NOT NULL,
  venue_name text NOT NULL,
  description text,
  cover_photo_url text,
  status text NOT NULL DEFAULT 'closed' CHECK (status IN ('open', 'closed')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Create `wedding_events` table
CREATE TABLE IF NOT EXISTS public.wedding_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid NOT NULL REFERENCES public.wedding_listings(id) ON DELETE CASCADE,
  name text NOT NULL,
  event_date date NOT NULL,
  event_time time NOT NULL,
  venue text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Create `gallery_photos` table
CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid NOT NULL REFERENCES public.wedding_listings(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Note: In order for this `moddatetime` extension to work, it is usually created automatically
-- in Supabase, but we can make sure the trigger functions exist.
CREATE OR REPLACE FUNCTION public.handle_updated_at() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_updated_at_wedding_listings ON public.wedding_listings;
CREATE TRIGGER handle_updated_at_wedding_listings
  BEFORE UPDATE ON public.wedding_listings
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_wedding_events ON public.wedding_events;
CREATE TRIGGER handle_updated_at_wedding_events
  BEFORE UPDATE ON public.wedding_events
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- 4. Enable RLS
ALTER TABLE public.wedding_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for `wedding_listings`
DROP POLICY IF EXISTS "Public listings are viewable by everyone." ON public.wedding_listings;
CREATE POLICY "Public listings are viewable by everyone." 
  ON public.wedding_listings FOR SELECT 
  USING ( true );

DROP POLICY IF EXISTS "Hosts can insert their own listing." ON public.wedding_listings;
CREATE POLICY "Hosts can insert their own listing." 
  ON public.wedding_listings FOR INSERT 
  WITH CHECK ( auth.uid() = host_id );

DROP POLICY IF EXISTS "Hosts can update their own listing." ON public.wedding_listings;
CREATE POLICY "Hosts can update their own listing." 
  ON public.wedding_listings FOR UPDATE
  USING ( auth.uid() = host_id );

DROP POLICY IF EXISTS "Hosts can delete their own listing." ON public.wedding_listings;
CREATE POLICY "Hosts can delete their own listing." 
  ON public.wedding_listings FOR DELETE
  USING ( auth.uid() = host_id );

-- 6. RLS Policies for `wedding_events`
DROP POLICY IF EXISTS "Public events are viewable by everyone." ON public.wedding_events;
CREATE POLICY "Public events are viewable by everyone." 
  ON public.wedding_events FOR SELECT 
  USING ( true );

DROP POLICY IF EXISTS "Hosts can insert events for their listing." ON public.wedding_events;
CREATE POLICY "Hosts can insert events for their listing." 
  ON public.wedding_events FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.wedding_listings wl
      WHERE wl.id = listing_id AND wl.host_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Hosts can update events for their listing." ON public.wedding_events;
CREATE POLICY "Hosts can update events for their listing." 
  ON public.wedding_events FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.wedding_listings wl
      WHERE wl.id = listing_id AND wl.host_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Hosts can delete events for their listing." ON public.wedding_events;
CREATE POLICY "Hosts can delete events for their listing." 
  ON public.wedding_events FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.wedding_listings wl
      WHERE wl.id = listing_id AND wl.host_id = auth.uid()
    )
  );

-- 7. RLS Policies for `gallery_photos`
DROP POLICY IF EXISTS "Public gallery photos are viewable by everyone." ON public.gallery_photos;
CREATE POLICY "Public gallery photos are viewable by everyone." 
  ON public.gallery_photos FOR SELECT 
  USING ( true );

DROP POLICY IF EXISTS "Hosts can insert photos for their listing." ON public.gallery_photos;
CREATE POLICY "Hosts can insert photos for their listing." 
  ON public.gallery_photos FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.wedding_listings wl
      WHERE wl.id = listing_id AND wl.host_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Hosts can delete photos for their listing." ON public.gallery_photos;
CREATE POLICY "Hosts can delete photos for their listing." 
  ON public.gallery_photos FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.wedding_listings wl
      WHERE wl.id = listing_id AND wl.host_id = auth.uid()
    )
  );

-- 8. Setup Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-photos', 'wedding-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 9. RLS Policies for Storage Bucket `wedding-photos`
DROP POLICY IF EXISTS "Public can view wedding photos" ON storage.objects;
CREATE POLICY "Public can view wedding photos"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'wedding-photos' );

DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'wedding-photos' AND 
    auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Users can update their own photos" ON storage.objects;
CREATE POLICY "Users can update their own photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'wedding-photos' AND 
    auth.uid() = owner
  );

DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;
CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'wedding-photos' AND 
    auth.uid() = owner
  );
