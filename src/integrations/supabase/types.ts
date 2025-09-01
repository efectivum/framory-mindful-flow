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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      adaptive_coaching_rules: {
        Row: {
          coaching_adjustments: Json
          condition_criteria: Json
          created_at: string
          id: string
          is_active: boolean | null
          priority_level: number | null
          rule_name: string
          success_threshold: number | null
        }
        Insert: {
          coaching_adjustments: Json
          condition_criteria: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          priority_level?: number | null
          rule_name: string
          success_threshold?: number | null
        }
        Update: {
          coaching_adjustments?: Json
          condition_criteria?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          priority_level?: number | null
          rule_name?: string
          success_threshold?: number | null
        }
        Relationships: []
      }
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          details: Json | null
          id: string
          target_user_email: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_email?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_email?: string | null
        }
        Relationships: []
      }
      admin_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
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
      billing_events: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          event_data: Json | null
          event_type: string
          id: string
          processed_at: string | null
          stripe_event_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          processed_at?: string | null
          stripe_event_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          processed_at?: string | null
          stripe_event_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      challenge_completions: {
        Row: {
          challenge_id: string
          completed_at: string
          completion_method: string
          day_number: number
          id: string
          mood_rating: number | null
          notes: string | null
          source_id: string | null
          user_challenge_id: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string
          completion_method?: string
          day_number: number
          id?: string
          mood_rating?: number | null
          notes?: string | null
          source_id?: string | null
          user_challenge_id: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string
          completion_method?: string
          day_number?: number
          id?: string
          mood_rating?: number | null
          notes?: string | null
          source_id?: string | null
          user_challenge_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_completions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_completions_user_challenge_id_fkey"
            columns: ["user_challenge_id"]
            isOneToOne: false
            referencedRelation: "user_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          benefits: string[]
          category: string
          challenge_type: string
          completion_criteria: Json | null
          created_at: string
          daily_prompts: string[] | null
          description: string
          difficulty: string
          duration_days: number
          id: string
          is_active: boolean
          participant_count: number
          success_rate: number | null
          tips: string[] | null
          title: string
          updated_at: string
          what_included: string[]
        }
        Insert: {
          benefits?: string[]
          category?: string
          challenge_type?: string
          completion_criteria?: Json | null
          created_at?: string
          daily_prompts?: string[] | null
          description: string
          difficulty: string
          duration_days?: number
          id?: string
          is_active?: boolean
          participant_count?: number
          success_rate?: number | null
          tips?: string[] | null
          title: string
          updated_at?: string
          what_included?: string[]
        }
        Update: {
          benefits?: string[]
          category?: string
          challenge_type?: string
          completion_criteria?: Json | null
          created_at?: string
          daily_prompts?: string[] | null
          description?: string
          difficulty?: string
          duration_days?: number
          id?: string
          is_active?: boolean
          participant_count?: number
          success_rate?: number | null
          tips?: string[] | null
          title?: string
          updated_at?: string
          what_included?: string[]
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          session_id: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_session_context: {
        Row: {
          context_key: string
          context_value: Json
          created_at: string
          id: string
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context_key: string
          context_value: Json
          created_at?: string
          id?: string
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context_key?: string
          context_value?: Json
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_session_context_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          context_data: Json | null
          context_type: string
          created_at: string
          id: string
          is_active: boolean
          last_message_at: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          context_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_message_at?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context_data?: Json | null
          context_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_message_at?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coaching_effectiveness: {
        Row: {
          baseline_value: number | null
          created_at: string
          follow_up_value: number | null
          id: string
          improvement_percentage: number | null
          interaction_id: string | null
          intervention_type: string
          measured_at: string | null
          success_metric: string
          time_to_improvement: unknown | null
          user_id: string
          user_satisfaction_rating: number | null
        }
        Insert: {
          baseline_value?: number | null
          created_at?: string
          follow_up_value?: number | null
          id?: string
          improvement_percentage?: number | null
          interaction_id?: string | null
          intervention_type: string
          measured_at?: string | null
          success_metric: string
          time_to_improvement?: unknown | null
          user_id: string
          user_satisfaction_rating?: number | null
        }
        Update: {
          baseline_value?: number | null
          created_at?: string
          follow_up_value?: number | null
          id?: string
          improvement_percentage?: number | null
          interaction_id?: string | null
          intervention_type?: string
          measured_at?: string | null
          success_metric?: string
          time_to_improvement?: unknown | null
          user_id?: string
          user_satisfaction_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "coaching_effectiveness_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "coaching_interactions"
            referencedColumns: ["id"]
          },
        ]
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
      coaching_learning_profiles: {
        Row: {
          effective_intervention_types: Json | null
          id: string
          last_updated: string
          learning_confidence: number | null
          optimal_timing_preferences: Json | null
          preferred_communication_styles: Json | null
          protocol_success_rates: Json | null
          response_patterns: Json | null
          successful_interventions: number | null
          total_interactions: number | null
          user_id: string
        }
        Insert: {
          effective_intervention_types?: Json | null
          id?: string
          last_updated?: string
          learning_confidence?: number | null
          optimal_timing_preferences?: Json | null
          preferred_communication_styles?: Json | null
          protocol_success_rates?: Json | null
          response_patterns?: Json | null
          successful_interventions?: number | null
          total_interactions?: number | null
          user_id: string
        }
        Update: {
          effective_intervention_types?: Json | null
          id?: string
          last_updated?: string
          learning_confidence?: number | null
          optimal_timing_preferences?: Json | null
          preferred_communication_styles?: Json | null
          protocol_success_rates?: Json | null
          response_patterns?: Json | null
          successful_interventions?: number | null
          total_interactions?: number | null
          user_id?: string
        }
        Relationships: []
      }
      coaching_protocol_applications: {
        Row: {
          adherence_percentage: number | null
          applied_at: string
          id: string
          interaction_id: string | null
          notes: string | null
          outcome_measured: boolean | null
          outcome_value: number | null
          protocol_id: string
          user_feedback_rating: number | null
          user_id: string
        }
        Insert: {
          adherence_percentage?: number | null
          applied_at?: string
          id?: string
          interaction_id?: string | null
          notes?: string | null
          outcome_measured?: boolean | null
          outcome_value?: number | null
          protocol_id: string
          user_feedback_rating?: number | null
          user_id: string
        }
        Update: {
          adherence_percentage?: number | null
          applied_at?: string
          id?: string
          interaction_id?: string | null
          notes?: string | null
          outcome_measured?: boolean | null
          outcome_value?: number | null
          protocol_id?: string
          user_feedback_rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaching_protocol_applications_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "coaching_interactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_protocol_applications_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "scientific_protocols"
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
      data_exports: {
        Row: {
          created_at: string
          expires_at: string
          export_type: string
          file_url: string | null
          format: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          export_type: string
          file_url?: string | null
          format: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          export_type?: string
          file_url?: string | null
          format?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      deep_reflections: {
        Row: {
          created_at: string
          entry_id: string
          id: string
          probing_question: string
          reflection_content: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_id: string
          id?: string
          probing_question: string
          reflection_content: string
          user_id: string
        }
        Update: {
          created_at?: string
          entry_id?: string
          id?: string
          probing_question?: string
          reflection_content?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deep_reflections_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      email_subscribers: {
        Row: {
          email: string
          id: string
          metadata: Json | null
          resend_contact_id: string | null
          source: string
          status: string
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          metadata?: Json | null
          resend_contact_id?: string | null
          source?: string
          status?: string
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          metadata?: Json | null
          resend_contact_id?: string | null
          source?: string
          status?: string
          subscribed_at?: string
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
      error_logs: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          message: string
          resolved: boolean | null
          severity: string
          stack: string | null
          updated_at: string
          url: string
          user_agent: string
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          message: string
          resolved?: boolean | null
          severity: string
          stack?: string | null
          updated_at?: string
          url: string
          user_agent: string
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          message?: string
          resolved?: boolean | null
          severity?: string
          stack?: string | null
          updated_at?: string
          url?: string
          user_agent?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feature_limits: {
        Row: {
          created_at: string
          feature_name: string
          id: string
          limit_type: string
          limit_value: number
          reset_period: string | null
          subscription_tier: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          feature_name: string
          id?: string
          limit_type?: string
          limit_value: number
          reset_period?: string | null
          subscription_tier: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          feature_name?: string
          id?: string
          limit_type?: string
          limit_value?: number
          reset_period?: string | null
          subscription_tier?: string
          updated_at?: string
        }
        Relationships: []
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
      habit_steps: {
        Row: {
          created_at: string
          description: string | null
          estimated_duration_minutes: number | null
          id: string
          is_optional: boolean
          prompt_question: string | null
          step_order: number
          template_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_optional?: boolean
          prompt_question?: string | null
          step_order: number
          template_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_optional?: boolean
          prompt_question?: string | null
          step_order?: number
          template_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_steps_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "habit_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_templates: {
        Row: {
          category: string
          coach_context: string | null
          created_at: string
          description: string | null
          difficulty_level: string
          estimated_duration_minutes: number | null
          id: string
          is_coach_recommended: boolean
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          coach_context?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string
          estimated_duration_minutes?: number | null
          id?: string
          is_coach_recommended?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          coach_context?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string
          estimated_duration_minutes?: number | null
          id?: string
          is_coach_recommended?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
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
          deleted_at: string | null
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
          deleted_at?: string | null
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
          deleted_at?: string | null
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
      notification_templates: {
        Row: {
          channel: string
          content_template: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_system: boolean
          name: string
          subject_template: string | null
          type: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          channel: string
          content_template: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          name: string
          subject_template?: string | null
          type: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          channel?: string
          content_template?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          name?: string
          subject_template?: string | null
          type?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          channel: string
          content: string
          created_at: string
          error_message: string | null
          id: string
          scheduled_for: string
          sent_at: string | null
          status: string
          template_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          channel: string
          content: string
          created_at?: string
          error_message?: string | null
          id?: string
          scheduled_for: string
          sent_at?: string | null
          status?: string
          template_id?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          channel?: string
          content?: string
          created_at?: string
          error_message?: string | null
          id?: string
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          template_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
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
      premium_feature_usage: {
        Row: {
          created_at: string
          feature_category: string
          feature_name: string
          id: string
          session_id: string | null
          usage_context: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_category: string
          feature_name: string
          id?: string
          session_id?: string | null
          usage_context?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          feature_category?: string
          feature_name?: string
          id?: string
          session_id?: string | null
          usage_context?: Json | null
          user_id?: string
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
      rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          request_count: number
          user_id: string
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          request_count?: number
          user_id: string
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          request_count?: number
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      routine_completions: {
        Row: {
          completed_at: string
          id: string
          mood_rating: number | null
          notes: string | null
          total_steps_completed: number
          user_id: string
          user_routine_id: string | null
        }
        Insert: {
          completed_at?: string
          id?: string
          mood_rating?: number | null
          notes?: string | null
          total_steps_completed?: number
          user_id: string
          user_routine_id?: string | null
        }
        Update: {
          completed_at?: string
          id?: string
          mood_rating?: number | null
          notes?: string | null
          total_steps_completed?: number
          user_id?: string
          user_routine_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routine_completions_user_routine_id_fkey"
            columns: ["user_routine_id"]
            isOneToOne: false
            referencedRelation: "user_habit_routines"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_templates: {
        Row: {
          category: string | null
          content: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          sort_order: number | null
          title: string
          type: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title: string
          type: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      scientific_protocols: {
        Row: {
          category: string
          contraindications: Json | null
          created_at: string
          description: string
          evidence_level: string | null
          expected_timeline: string | null
          id: string
          implementation_steps: Json
          is_active: boolean | null
          protocol_name: string
          source: string
          success_metrics: Json
          target_conditions: Json
        }
        Insert: {
          category: string
          contraindications?: Json | null
          created_at?: string
          description: string
          evidence_level?: string | null
          expected_timeline?: string | null
          id?: string
          implementation_steps: Json
          is_active?: boolean | null
          protocol_name: string
          source: string
          success_metrics: Json
          target_conditions: Json
        }
        Update: {
          category?: string
          contraindications?: Json | null
          created_at?: string
          description?: string
          evidence_level?: string | null
          expected_timeline?: string | null
          id?: string
          implementation_steps?: Json
          is_active?: boolean | null
          protocol_name?: string
          source?: string
          success_metrics?: Json
          target_conditions?: Json
        }
        Relationships: []
      }
      step_completions: {
        Row: {
          completed_at: string
          duration_minutes: number | null
          id: string
          reflection_response: string | null
          routine_completion_id: string | null
          step_id: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          duration_minutes?: number | null
          id?: string
          reflection_response?: string | null
          routine_completion_id?: string | null
          step_id?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          duration_minutes?: number | null
          id?: string
          reflection_response?: string | null
          routine_completion_id?: string | null
          step_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "step_completions_routine_completion_id_fkey"
            columns: ["routine_completion_id"]
            isOneToOne: false
            referencedRelation: "routine_completions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step_completions_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "habit_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_analytics: {
        Row: {
          created_at: string
          date_recorded: string
          id: string
          metric_data: Json | null
          metric_type: string
          metric_value: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date_recorded?: string
          id?: string
          metric_data?: Json | null
          metric_type: string
          metric_value: number
          user_id: string
        }
        Update: {
          created_at?: string
          date_recorded?: string
          id?: string
          metric_data?: Json | null
          metric_type?: string
          metric_value?: number
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_key: string
          achievement_type: string
          category: string | null
          description: string | null
          earned_at: string
          icon: string | null
          id: string
          is_seen: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          achievement_key: string
          achievement_type: string
          category?: string | null
          description?: string | null
          earned_at?: string
          icon?: string | null
          id?: string
          is_seen?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          achievement_key?: string
          achievement_type?: string
          category?: string | null
          description?: string | null
          earned_at?: string
          icon?: string | null
          id?: string
          is_seen?: boolean | null
          title?: string
          user_id?: string
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
      user_challenges: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string
          current_day: number
          daily_completions: Json | null
          enrolled_at: string
          id: string
          notes: string | null
          status: string
          total_completions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string
          current_day?: number
          daily_completions?: Json | null
          enrolled_at?: string
          id?: string
          notes?: string | null
          status?: string
          total_completions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string
          current_day?: number
          daily_completions?: Json | null
          enrolled_at?: string
          id?: string
          notes?: string | null
          status?: string
          total_completions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback: {
        Row: {
          created_at: string
          feature_context: string | null
          feedback_type: string
          id: string
          message: string | null
          rating: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_context?: string | null
          feedback_type: string
          id?: string
          message?: string | null
          rating?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          feature_context?: string | null
          feedback_type?: string
          id?: string
          message?: string | null
          rating?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_habit_routines: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          is_active: boolean
          longest_streak: number
          scheduled_time: string | null
          template_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          is_active?: boolean
          longest_streak?: number
          scheduled_time?: string | null
          template_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          is_active?: boolean
          longest_streak?: number
          scheduled_time?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_habit_routines_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "habit_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding: {
        Row: {
          completed_steps: string[] | null
          completion_percentage: number | null
          created_at: string
          current_step: string | null
          id: string
          onboarding_completed: boolean | null
          tour_completed: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_steps?: string[] | null
          completion_percentage?: number | null
          created_at?: string
          current_step?: string | null
          id?: string
          onboarding_completed?: boolean | null
          tour_completed?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_steps?: string[] | null
          completion_percentage?: number | null
          created_at?: string
          current_step?: string | null
          id?: string
          onboarding_completed?: boolean | null
          tour_completed?: boolean | null
          updated_at?: string
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
          marketing_emails: boolean
          notification_frequency: string
          notification_time: string | null
          push_notifications_enabled: boolean
          security_alerts_email: boolean
          tone_of_voice: string
          updated_at: string
          user_id: string
          weekly_insights_email: boolean
          whatsapp_enabled: boolean
        }
        Insert: {
          created_at?: string
          growth_focus?: string
          id?: string
          marketing_emails?: boolean
          notification_frequency?: string
          notification_time?: string | null
          push_notifications_enabled?: boolean
          security_alerts_email?: boolean
          tone_of_voice?: string
          updated_at?: string
          user_id: string
          weekly_insights_email?: boolean
          whatsapp_enabled?: boolean
        }
        Update: {
          created_at?: string
          growth_focus?: string
          id?: string
          marketing_emails?: boolean
          notification_frequency?: string
          notification_time?: string | null
          push_notifications_enabled?: boolean
          security_alerts_email?: boolean
          tone_of_voice?: string
          updated_at?: string
          user_id?: string
          weekly_insights_email?: boolean
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
      check_achievements: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      cleanup_expired_exports: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_signups: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_current_user_admin_status: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      initialize_user_onboarding: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      log_security_event: {
        Args: { details?: Json; event_type: string; user_id_param?: string }
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
      update_routine_streak: {
        Args: { user_routine_id_param: string }
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
