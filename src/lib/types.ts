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
  selected_events: string[]   // array of WeddingEvent.id
  status:          'pending' | 'approved' | 'declined'
  decline_reason:  string | null
  submitted_at:    string
}

// Derived / joined types used in UI
export interface WeddingListingWithEvents extends WeddingListing {
  wedding_events: WeddingEvent[]
}

export interface JoinRequestWithTraveller extends JoinRequest {
  profiles: Pick<Profile, 'full_name' | 'nationality'>
}
