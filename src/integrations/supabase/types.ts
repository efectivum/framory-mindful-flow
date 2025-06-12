export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_insights: {
        Row: {
          confidence_score: number | null
          content: string
          created_at: string
          id: string
          insight_type: string
          metadata: Json | null
          source_id: string | null
          source_type: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          content: string
          created_at?: string
          id?: string
          insight_type: string
          metadata?: Json | null
          source_id?: string | null
          source_type: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          content?: string
          created_at?: string
          id?: string
          insight_type?: string
          metadata?: Json | null
          source_id?: string | null
          source_type?: string
          user_id?: string
        }
        Relationships: []
      }
      coaching_interactions: {
        Row: {
          confidence_score: number | null
          created_at: string
          entry_id: string | null
          id: string
          pattern_detected: string | null
          response_content: string
          response_level: number
          response_type: string
          user_engaged: boolean | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          entry_id?: string | null
          id?: string
          pattern_detected?: string | null
          response_content: string
          response_level: number
          response_type: string
          user_engaged?: boolean | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          entry_id?: string | null
          id?: string
          pattern_detected?: string | null
          response_content?: string
          response_level?: number
          response_type?: string
          user_engaged?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaching_interactions_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      coaching_state: {
        Row: {
          id: string
          last_level_2_response: string | null
          last_level_3_response: string | null
          level_2_count_this_week: number
          level_3_count_this_week: number
          updated_at: string
          user_id: string
          week_start_date: string
        }
        Insert: {
          id?: string
          last_level_2_response?: string | null
          last_level_3_response?: string | null
          level_2_count_this_week?: number
          level_3_count_this_week?: number
          updated_at?: string
          user_id: string
          week_start_date?: string
        }
        Update: {
          id?: string
          last_level_2_response?: string | null
          last_level_3_response?: string | null
          level_2_count_this_week?: number
          level_3_count_this_week?: number
          updated_at?: string
          user_id?: string
          week_start_date?: string
        }
        Relationships: []
      }
      entry_quick_analysis: {
        Row: {
          action_suggestions: string[] | null
          confidence_score: number | null
          created_at: string
          emotional_insights: string[] | null
          entry_id: string
          growth_indicators: string[] | null
          id: string
          quick_takeaways: string[]
          user_id: string
        }
        Insert: {
          action_suggestions?: string[] | null
          confidence_score?: number | null
          created_at?: string
          emotional_insights?: string[] | null
          entry_id: string
          growth_indicators?: string[] | null
          id?: string
          quick_takeaways?: string[]
          user_id: string
        }
        Update: {
          action_suggestions?: string[] | null
          confidence_score?: number | null
          created_at?: string
          emotional_insights?: string[] | null
          entry_id?: string
          growth_indicators?: string[] | null
          id?: string
          quick_takeaways?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entry_quick_analysis_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_completions: {
        Row: {
          completed_at: string
          habit_id: string
          id: string
          mood_rating: number | null
          notes: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          habit_id: string
          id?: string
          mood_rating?: number | null
          notes?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          habit_id?: string
          id?: string
          mood_rating?: number | null
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          created_at: string
          current_streak: number
          description: string | null
          frequency_type: string
          frequency_value: number
          id: string
          is_active: boolean
          longest_streak: number
          target_days: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          description?: string | null
          frequency_type?: string
          frequency_value?: number
          id?: string
          is_active?: boolean
          longest_streak?: number
          target_days?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          description?: string | null
          frequency_type?: string
          frequency_value?: number
          id?: string
          is_active?: boolean
          longest_streak?: number
          target_days?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          ai_confidence_level: number | null
          ai_detected_emotions: string[] | null
          ai_detected_mood: number | null
          ai_sentiment_score: number | null
          content: string
          created_at: string
          id: string
          mood_after: number | null
          mood_alignment_score: number | null
          mood_before: number | null
          tags: string[] | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_confidence_level?: number | null
          ai_detected_emotions?: string[] | null
          ai_detected_mood?: number | null
          ai_sentiment_score?: number | null
          content: string
          created_at?: string
          id?: string
          mood_after?: number | null
          mood_alignment_score?: number | null
          mood_before?: number | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_confidence_level?: number | null
          ai_detected_emotions?: string[] | null
          ai_detected_mood?: number | null
          ai_sentiment_score?: number | null
          content?: string
          created_at?: string
          id?: string
          mood_after?: number | null
          mood_alignment_score?: number | null
          mood_before?: number | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pending_signups: {
        Row: {
          completed: boolean | null
          created_at: string
          expires_at: string
          id: string
          name: string
          phone_number: string
          timezone: string | null
          token: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          expires_at?: string
          id?: string
          name: string
          phone_number: string
          timezone?: string | null
          token: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          expires_at?: string
          id?: string
          name?: string
          phone_number?: string
          timezone?: string | null
          token?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          daily_reminder_time: string | null
          id: string
          phone_number: string | null
          timezone: string | null
          updated_at: string
          weekly_reminder_day: number | null
          whatsapp_active: boolean | null
        }
        Insert: {
          created_at?: string
          daily_reminder_time?: string | null
          id: string
          phone_number?: string | null
          timezone?: string | null
          updated_at?: string
          weekly_reminder_day?: number | null
          whatsapp_active?: boolean | null
        }
        Update: {
          created_at?: string
          daily_reminder_time?: string | null
          id?: string
          phone_number?: string | null
          timezone?: string | null
          updated_at?: string
          weekly_reminder_day?: number | null
          whatsapp_active?: boolean | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          source: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          source: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          source?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_patterns: {
        Row: {
          confidence_level: number
          created_at: string
          id: string
          last_detected_at: string
          occurrence_count: number
          pattern_key: string
          pattern_type: string
          pattern_value: Json
          user_id: string
        }
        Insert: {
          confidence_level?: number
          created_at?: string
          id?: string
          last_detected_at?: string
          occurrence_count?: number
          pattern_key: string
          pattern_type: string
          pattern_value?: Json
          user_id: string
        }
        Update: {
          confidence_level?: number
          created_at?: string
          id?: string
          last_detected_at?: string
          occurrence_count?: number
          pattern_key?: string
          pattern_type?: string
          pattern_value?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          growth_focus: string
          id: string
          notification_frequency: string
          notification_time: string | null
          push_notifications_enabled: boolean
          tone_of_voice: string
          updated_at: string
          user_id: string
          whatsapp_enabled: boolean
        }
        Insert: {
          created_at?: string
          growth_focus?: string
          id?: string
          notification_frequency?: string
          notification_time?: string | null
          push_notifications_enabled?: boolean
          tone_of_voice?: string
          updated_at?: string
          user_id: string
          whatsapp_enabled?: boolean
        }
        Update: {
          created_at?: string
          growth_focus?: string
          id?: string
          notification_frequency?: string
          notification_time?: string | null
          push_notifications_enabled?: boolean
          tone_of_voice?: string
          updated_at?: string
          user_id?: string
          whatsapp_enabled?: boolean
        }
        Relationships: []
      }
      weekly_insights: {
        Row: {
          average_mood: number | null
          created_at: string
          emotional_summary: string | null
          entry_count: number
          growth_observations: string[] | null
          id: string
          insights: Json
          key_patterns: string[] | null
          recommendations: string[] | null
          updated_at: string
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          average_mood?: number | null
          created_at?: string
          emotional_summary?: string | null
          entry_count?: number
          growth_observations?: string[] | null
          id?: string
          insights?: Json
          key_patterns?: string[] | null
          recommendations?: string[] | null
          updated_at?: string
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Update: {
          average_mood?: number | null
          created_at?: string
          emotional_summary?: string | null
          entry_count?: number
          growth_observations?: string[] | null
          id?: string
          insights?: Json
          key_patterns?: string[] | null
          recommendations?: string[] | null
          updated_at?: string
          user_id?: string
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          created_at: string
          direction: string
          id: string
          message_content: string
          message_type: string | null
          phone_number: string
          processed: boolean | null
          user_id: string
          whatsapp_message_id: string | null
        }
        Insert: {
          created_at?: string
          direction: string
          id?: string
          message_content: string
          message_type?: string | null
          phone_number: string
          processed?: boolean | null
          user_id: string
          whatsapp_message_id?: string | null
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          message_content?: string
          message_type?: string | null
          phone_number?: string
          processed?: boolean | null
          user_id?: string
          whatsapp_message_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_signups: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_weekly_coaching_counts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_habit_streak: {
        Args: { habit_id_param: string }
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
