export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          brand_settings: Json | null
          code: string
          company_id: string | null
          created_at: string | null
          domain: string
          id: string
          is_active: boolean | null
          name: string
          separation_readiness: Json | null
          updated_at: string | null
        }
        Insert: {
          brand_settings?: Json | null
          code?: string
          company_id?: string | null
          created_at?: string | null
          domain?: string
          id?: string
          is_active?: boolean | null
          name?: string
          separation_readiness?: Json | null
          updated_at?: string | null
        }
        Update: {
          brand_settings?: Json | null
          code?: string
          company_id?: string | null
          created_at?: string | null
          domain?: string
          id?: string
          is_active?: boolean | null
          name?: string
          separation_readiness?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          name: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      dashboard_access_permissions: {
        Row: {
          brand_dashboard_permissions: Json | null
          can_access_brand_dashboard: boolean | null
          can_access_company_dashboard: boolean | null
          company_dashboard_permissions: Json | null
          created_at: string | null
          cross_platform_access: Json | null
          hybrid_permissions: Json | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          brand_dashboard_permissions?: Json | null
          can_access_brand_dashboard?: boolean | null
          can_access_company_dashboard?: boolean | null
          company_dashboard_permissions?: Json | null
          created_at?: string | null
          cross_platform_access?: Json | null
          hybrid_permissions?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          brand_dashboard_permissions?: Json | null
          can_access_brand_dashboard?: boolean | null
          can_access_company_dashboard?: boolean | null
          company_dashboard_permissions?: Json | null
          created_at?: string | null
          cross_platform_access?: Json | null
          hybrid_permissions?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dashboard_sessions: {
        Row: {
          brand_context: string | null
          brand_switches: Json | null
          created_at: string | null
          dashboard_type: Database["public"]["Enums"]["dashboard_type_enum"]
          expires_at: string | null
          id: string
          is_active: boolean | null
          session_token: string
          started_at: string | null
          user_id: string | null
        }
        Insert: {
          brand_context?: string | null
          brand_switches?: Json | null
          created_at?: string | null
          dashboard_type: Database["public"]["Enums"]["dashboard_type_enum"]
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          session_token: string
          started_at?: string | null
          user_id?: string | null
        }
        Update: {
          brand_context?: string | null
          brand_switches?: Json | null
          created_at?: string | null
          dashboard_type?: Database["public"]["Enums"]["dashboard_type_enum"]
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          session_token?: string
          started_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_sessions_brand_context_fkey"
            columns: ["brand_context"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      permission_audit_logs: {
        Row: {
          action: string
          brandContext: string | null
          change_reason: string | null
          changed_by: string | null
          created_at: string | null
          dashboard_type:
            | Database["public"]["Enums"]["dashboard_type_enum"]
            | null
          fromDashboard: string | null
          id: string
          ipAddress: string | null
          new_permissions: Json | null
          old_permissions: Json | null
          permission_type: string
          reason: string | null
          timestamp: string
          toDashboard: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          brandContext?: string | null
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string | null
          dashboard_type?:
            | Database["public"]["Enums"]["dashboard_type_enum"]
            | null
          fromDashboard?: string | null
          id?: string
          ipAddress?: string | null
          new_permissions?: Json | null
          old_permissions?: Json | null
          permission_type: string
          reason?: string | null
          timestamp?: string
          toDashboard?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          brandContext?: string | null
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string | null
          dashboard_type?:
            | Database["public"]["Enums"]["dashboard_type_enum"]
            | null
          fromDashboard?: string | null
          id?: string
          ipAddress?: string | null
          new_permissions?: Json | null
          old_permissions?: Json | null
          permission_type?: string
          reason?: string | null
          timestamp?: string
          toDashboard?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: Json | null
          brand_id: string | null
          code: string
          contact_info: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          operating_hours: Json | null
          store_type: Database["public"]["Enums"]["store_type_enum"] | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          brand_id?: string | null
          code?: string
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          operating_hours?: Json | null
          store_type?: Database["public"]["Enums"]["store_type_enum"] | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          brand_id?: string | null
          code?: string
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          operating_hours?: Json | null
          store_type?: Database["public"]["Enums"]["store_type_enum"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          role: string | null
          company_id: string | null
          brand_id: string | null
          is_active: boolean | null
          last_login: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          role?: string | null
          company_id?: string | null
          brand_id?: string | null
          is_active?: boolean | null
          last_login?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          role?: string | null
          company_id?: string | null
          brand_id?: string | null
          is_active?: boolean | null
          last_login?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
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
      dashboard_type_enum: "company" | "brand"
      store_type_enum: "direct" | "franchise" | "partner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

// 권한 관련 타입 정의
export interface DashboardPermissions {
  role: string;
  modules: {
    [moduleName: string]: {
      read: boolean;
      write: boolean;
      delete: boolean;
      admin: boolean;
    };
  };
  actions: {
    [actionName: string]: boolean;
  };
}

export interface HybridPermissions {
  canSwitchBetweenDashboards: boolean;
  crossPlatformDataAccess: boolean;
  brandContextSwitching: boolean;
  globalAdminAccess: boolean;
}

export interface UserPermissions {
  userId: string;
  canAccessCompanyDashboard: boolean;
  canAccessBrandDashboard: boolean;
  hybridPermissions: HybridPermissions;
  companyDashboardPermissions: DashboardPermissions;
  brandDashboardPermissions: DashboardPermissions;
  crossPlatformAccess: {
    allowedBrands: string[];
    allowedStores: string[];
    dataSharing: boolean;
  };
}

export interface DashboardSession {
  id: string;
  userId: string;
  dashboardType: 'company' | 'brand';
  brandContext?: string;
  sessionToken: string;
  brandSwitches: {
    fromBrand: string;
    toBrand: string;
    timestamp: string;
    reason?: string;
  }[];
  isActive: boolean;
  startedAt: string;
  expiresAt?: string;
  createdAt: string;
}

export interface PermissionAuditLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  fromDashboard?: string;
  toDashboard?: string;
  brandContext?: string;
  reason?: string;
  ipAddress?: string;
  changedBy?: string;
  permissionType: string;
  oldPermissions?: any;
  newPermissions?: any;
  changeReason?: string;
  dashboardType?: 'company' | 'brand';
  createdAt: string;
}

// User 타입 정의
export interface User {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: string;
  company_id?: string;
  brand_id?: string;
  is_active?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}