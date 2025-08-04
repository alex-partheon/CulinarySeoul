export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string
          name: string
          code: string
          domain: string
          company_id: string
          business_category: string
          description: string | null
          brand_settings: Json | null
          separation_readiness: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          domain: string
          company_id: string
          business_category: string
          description?: string | null
          brand_settings?: Json | null
          separation_readiness?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          domain?: string
          company_id?: string
          business_category?: string
          description?: string | null
          brand_settings?: Json | null
          separation_readiness?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// Brand related types
export type BrandRow = Database['public']['Tables']['brands']['Row']
export type BrandInsert = Database['public']['Tables']['brands']['Insert']
export type BrandUpdate = Database['public']['Tables']['brands']['Update']