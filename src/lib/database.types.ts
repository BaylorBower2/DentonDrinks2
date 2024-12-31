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
      venues: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string
          address: string
          type: 'bar' | 'brewery'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url: string
          address: string
          type: 'bar' | 'brewery'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          address?: string
          type?: 'bar' | 'brewery'
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          venue_id: string
          rating: number
          comment: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          venue_id: string
          rating: number
          comment: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          venue_id?: string
          rating?: number
          comment?: string
          image_url?: string | null
          created_at?: string
        }
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
  }
}