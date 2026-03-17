-- 004_join_requests.sql
-- Create join_requests table for travellers RSVP flow

create table if not exists public.join_requests (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid not null references public.wedding_listings(id) on delete cascade,
    traveller_id uuid not null references public.profiles(id) on delete cascade,
    message text not null default '',
    nationality text not null default '',
    guest_count integer not null default 1,
    selected_events uuid[] default '{}',
    status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
    decline_reason text,
    submitted_at timestamptz not null default now(),
    
    -- Enforce one request per traveller per listing
    unique(listing_id, traveller_id)
);

-- Enable RLS
alter table public.join_requests enable row level security;

-- Policies for join_requests

-- 1. Travellers can read their own requests
create policy "Travellers can view their own requests"
on public.join_requests for select
to authenticated
using (traveller_id = auth.uid());

-- 2. Hosts can read requests for their listings
create policy "Hosts can view requests for their listings"
on public.join_requests for select
to authenticated
using (
    listing_id in (
        select id from public.wedding_listings
        where host_id = auth.uid()
    )
);

-- 3. Travellers can insert requests
create policy "Travellers can insert requests"
on public.join_requests for insert
to authenticated
with check (
    traveller_id = auth.uid() and
    -- Ensure they don't spoof being a host
    exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'traveller'
    )
);

-- 4. Hosts can update requests for their listings (e.g. status)
create policy "Hosts can update requests"
on public.join_requests for update
to authenticated
using (
    listing_id in (
        select id from public.wedding_listings
        where host_id = auth.uid()
    )
)
with check (
    -- Only allow updating status and reason, they shouldn't change who the request is from
    listing_id in (
        select id from public.wedding_listings
        where host_id = auth.uid()
    )
);
