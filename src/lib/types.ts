/**
 * Wedding Yatra — Shared TypeScript types.
 * These match the Supabase PostgreSQL schema exactly.
 */

export type UserRole = 'host' | 'traveller'

export interface Profile {
  id:          string
  role:        UserRole
  full_name:   string
  nationality: string | null
  created_at:  string
}

export interface WeddingListing {
  id:               string
  host_id:          string
  slug:             string
  bride_name:       string
  groom_name:       string
  wedding_date:     string   // ISO date string 'YYYY-MM-DD'
  city:             string
  venue_name:       string
  description:      string | null
  cover_photo_url:  string | null
  status:           'open' | 'closed'
  created_at:       string
}

export interface WeddingEvent {
  id:          string
  listing_id:  string
  name:        string
  event_date:  string   // ISO date string
  event_time:  string   // 'HH:MM:SS'
  venue:       string
  description: string | null
}

export interface GalleryPhoto {
  id:           string
  listing_id:   string
  storage_path: string
  public_url:   string
  created_at:   string
}

export interface JoinRequest {
  id:              string
  listing_id:      string
  traveller_id:    string
  message:         string
  nationality:     string
  guest_count:     number
  selected_events: string[]   // array of WeddingEvent.id
  status:          'pending' | 'approved' | 'declined'
  decline_reason:  string | null
  submitted_at:    string
}

export type JoinRequestInsert = Omit<JoinRequest, 'id' | 'status' | 'decline_reason' | 'submitted_at'>

export interface JoinRequestWithListing extends JoinRequest {
  wedding_listings: Pick<WeddingListing, 'bride_name' | 'groom_name' | 'city' | 'wedding_date' | 'slug' | 'cover_photo_url'>
}

// Derived / joined types used in UI
export interface WeddingListingWithEvents extends WeddingListing {
  wedding_events: WeddingEvent[]
}

// Status union — used for type-safe approve/decline mutations
export type JoinRequestStatus = 'pending' | 'approved' | 'declined'

// Host-facing: join request enriched with traveller profile info
// profiles is nullable — Supabase join returns null when no profile row is matched
export interface JoinRequestWithTraveller extends JoinRequest {
  profiles: Pick<Profile, 'full_name' | 'nationality'> | null
}
