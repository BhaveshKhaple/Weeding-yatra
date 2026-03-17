export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'host' | 'traveller'
          full_name: string
          nationality: string | null
          created_at: string
        }
        Insert: {
          id: string
          role: 'host' | 'traveller'
          full_name: string
          nationality?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'host' | 'traveller'
          full_name?: string
          nationality?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      wedding_listings: {
        Row: {
          id: string
          host_id: string
          slug: string
          bride_name: string
          groom_name: string
          wedding_date: string
          city: string
          venue_name: string
          description: string | null
          cover_photo_url: string | null
          status: 'open' | 'closed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          host_id: string
          slug: string
          bride_name: string
          groom_name: string
          wedding_date: string
          city: string
          venue_name: string
          description?: string | null
          cover_photo_url?: string | null
          status?: 'open' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          slug?: string
          bride_name?: string
          groom_name?: string
          wedding_date?: string
          city?: string
          venue_name?: string
          description?: string | null
          cover_photo_url?: string | null
          status?: 'open' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_listings_host_id_fkey"
            columns: ["host_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      wedding_events: {
        Row: {
          id: string
          listing_id: string
          name: string
          event_date: string
          event_time: string
          venue: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          name: string
          event_date: string
          event_time: string
          venue: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          name?: string
          event_date?: string
          event_time?: string
          venue?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_events_listing_id_fkey"
            columns: ["listing_id"]
            referencedRelation: "wedding_listings"
            referencedColumns: ["id"]
          }
        ]
      }
      gallery_photos: {
        Row: {
          id: string
          listing_id: string
          storage_path: string
          public_url: string
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          storage_path: string
          public_url: string
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          storage_path?: string
          public_url?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_photos_listing_id_fkey"
            columns: ["listing_id"]
            referencedRelation: "wedding_listings"
            referencedColumns: ["id"]
          }
        ]
      }
      join_requests: {
        Row: {
          id: string
          listing_id: string
          traveller_id: string
          message: string
          nationality: string
          guest_count: number
          selected_events: string[]
          status: 'pending' | 'approved' | 'declined'
          decline_reason: string | null
          submitted_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          traveller_id: string
          message?: string
          nationality?: string
          guest_count?: number
          selected_events?: string[]
          status?: 'pending' | 'approved' | 'declined'
          decline_reason?: string | null
          submitted_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          traveller_id?: string
          message?: string
          nationality?: string
          guest_count?: number
          selected_events?: string[]
          status?: 'pending' | 'approved' | 'declined'
          decline_reason?: string | null
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "join_requests_listing_id_fkey"
            columns: ["listing_id"]
            referencedRelation: "wedding_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "join_requests_traveller_id_fkey"
            columns: ["traveller_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
