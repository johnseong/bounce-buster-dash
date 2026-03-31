export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          country: string | null
          created_at: string
          device_type: string
          duration_ms: number | null
          event_type: string
          id: string
          metadata: Json
          page_path: string
          page_title: string | null
          referrer: string | null
          session_id: string
          source: string | null
          user_id: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          device_type?: string
          duration_ms?: number | null
          event_type: string
          id?: string
          metadata?: Json
          page_path: string
          page_title?: string | null
          referrer?: string | null
          session_id: string
          source?: string | null
          user_id?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          device_type?: string
          duration_ms?: number | null
          event_type?: string
          id?: string
          metadata?: Json
          page_path?: string
          page_title?: string | null
          referrer?: string | null
          session_id?: string
          source?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dashboard_preferences: {
        Row: {
          created_at: string
          date_range: string
          id: string
          layout: Json
          pinned_metrics: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_range?: string
          id?: string
          layout?: Json
          pinned_metrics?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_range?: string
          id?: string
          layout?: Json
          pinned_metrics?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      funnel_events: {
        Row: {
          completed: boolean
          created_at: string
          funnel_id: string
          id: string
          session_id: string
          source: string | null
          step_index: number
          step_name: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string
          funnel_id: string
          id?: string
          session_id: string
          source?: string | null
          step_index?: number
          step_name: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string
          funnel_id?: string
          id?: string
          session_id?: string
          source?: string | null
          step_index?: number
          step_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funnel_events_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "saved_funnels"
            referencedColumns: ["id"]
          },
        ]
      }
      insight_actions: {
        Row: {
          applied_at: string | null
          created_at: string
          description: string
          id: string
          insight_id: string
          projected_impact: Json
          status: string
          title: string
        }
        Insert: {
          applied_at?: string | null
          created_at?: string
          description: string
          id?: string
          insight_id: string
          projected_impact?: Json
          status?: string
          title: string
        }
        Update: {
          applied_at?: string | null
          created_at?: string
          description?: string
          id?: string
          insight_id?: string
          projected_impact?: Json
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "insight_actions_insight_id_fkey"
            columns: ["insight_id"]
            isOneToOne: false
            referencedRelation: "insights"
            referencedColumns: ["id"]
          },
        ]
      }
      insights: {
        Row: {
          created_at: string
          description: string
          id: string
          impact: string | null
          is_read: boolean
          metadata: Json
          related_funnel_id: string | null
          related_page_path: string | null
          severity: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          impact?: string | null
          is_read?: boolean
          metadata?: Json
          related_funnel_id?: string | null
          related_page_path?: string | null
          severity: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          impact?: string | null
          is_read?: boolean
          metadata?: Json
          related_funnel_id?: string | null
          related_page_path?: string | null
          severity?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insights_related_funnel_id_fkey"
            columns: ["related_funnel_id"]
            isOneToOne: false
            referencedRelation: "saved_funnels"
            referencedColumns: ["id"]
          },
        ]
      }
      page_analytics: {
        Row: {
          bounce_count: number
          created_at: string
          date: string
          id: string
          page_path: string
          page_title: string | null
          total_duration_ms: number
          unique_visitors: number
          views: number
        }
        Insert: {
          bounce_count?: number
          created_at?: string
          date: string
          id?: string
          page_path: string
          page_title?: string | null
          total_duration_ms?: number
          unique_visitors?: number
          views?: number
        }
        Update: {
          bounce_count?: number
          created_at?: string
          date?: string
          id?: string
          page_path?: string
          page_title?: string | null
          total_duration_ms?: number
          unique_visitors?: number
          views?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_funnels: {
        Row: {
          created_at: string
          id: string
          name: string
          steps: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          steps?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          steps?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_reports: {
        Row: {
          config: Json
          created_at: string
          id: string
          report_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          report_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          report_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduled_reports: {
        Row: {
          created_at: string
          frequency: string
          id: string
          is_active: boolean
          last_run_at: string | null
          next_run_at: string
          report_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          frequency: string
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          next_run_at: string
          report_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          next_run_at?: string
          report_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_reports_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "saved_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      user_segments: {
        Row: {
          color_class: string
          created_at: string
          filter_rules: Json
          icon_key: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color_class?: string
          created_at?: string
          filter_rules?: Json
          icon_key?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color_class?: string
          created_at?: string
          filter_rules?: Json
          icon_key?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      owns_funnel: {
        Args: { _funnel_id: string; _user_id: string }
        Returns: boolean
      }
      owns_insight: {
        Args: { _insight_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
