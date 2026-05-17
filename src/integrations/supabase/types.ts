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
      billing_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          created_at: string
          details: Json
          id: string
          lead_id: string
          type: string
        }
        Insert: {
          created_at?: string
          details?: Json
          id?: string
          lead_id: string
          type: string
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          lead_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_notes: {
        Row: {
          body: string
          created_at: string
          id: string
          lead_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          lead_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          biggest_pain: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          name: string
          preferred_time: string | null
          source: string
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          biggest_pain?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          preferred_time?: string | null
          source?: string
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          biggest_pain?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          preferred_time?: string | null
          source?: string
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      nora_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nora_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "nora_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      nora_chat_sessions: {
        Row: {
          chat_kind: string
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          chat_kind?: string
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          chat_kind?: string
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nora_chat_sessions_workspace_fk"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      nora_query_logs: {
        Row: {
          agent_type: string | null
          created_at: string
          id: string
          query_text: string | null
          user_id: string
        }
        Insert: {
          agent_type?: string | null
          created_at?: string
          id?: string
          query_text?: string | null
          user_id: string
        }
        Update: {
          agent_type?: string | null
          created_at?: string
          id?: string
          query_text?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          default_audience: string | null
          display_name: string | null
          id: string
          preferred_tone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          default_audience?: string | null
          display_name?: string | null
          id?: string
          preferred_tone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          default_audience?: string | null
          display_name?: string | null
          id?: string
          preferred_tone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_connections: {
        Row: {
          access_token_encrypted: string | null
          account_label: string | null
          connected_at: string
          expires_at: string | null
          id: string
          provider: string
          provider_account_id: string | null
          refresh_token_encrypted: string | null
          refresh_token_iv: string | null
          scopes: string[]
          status: string
          token_iv: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token_encrypted?: string | null
          account_label?: string | null
          connected_at?: string
          expires_at?: string | null
          id?: string
          provider: string
          provider_account_id?: string | null
          refresh_token_encrypted?: string | null
          refresh_token_iv?: string | null
          scopes?: string[]
          status?: string
          token_iv?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token_encrypted?: string | null
          account_label?: string | null
          connected_at?: string
          expires_at?: string | null
          id?: string
          provider?: string
          provider_account_id?: string | null
          refresh_token_encrypted?: string | null
          refresh_token_iv?: string | null
          scopes?: string[]
          status?: string
          token_iv?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_custom_agents: {
        Row: {
          created_at: string
          guardrails: string | null
          id: string
          interview_summary: string | null
          mission: string | null
          name: string
          output_deliverables: string | null
          raw_inputs: string | null
          starter_prompt: string | null
          target_user: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          guardrails?: string | null
          id?: string
          interview_summary?: string | null
          mission?: string | null
          name: string
          output_deliverables?: string | null
          raw_inputs?: string | null
          starter_prompt?: string | null
          target_user?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          guardrails?: string | null
          id?: string
          interview_summary?: string | null
          mission?: string | null
          name?: string
          output_deliverables?: string | null
          raw_inputs?: string | null
          starter_prompt?: string | null
          target_user?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_custom_agents_workspace_fk"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          focus_killer: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          focus_killer?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          focus_killer?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      workflow_items: {
        Row: {
          ai_draft: string | null
          created_at: string
          due_date: string | null
          id: string
          input_text: string | null
          metadata: Json
          platform: string | null
          run_id: string | null
          source_output_id: string | null
          stage: string
          title: string | null
          type: string
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          ai_draft?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          input_text?: string | null
          metadata?: Json
          platform?: string | null
          run_id?: string | null
          source_output_id?: string | null
          stage?: string
          title?: string | null
          type?: string
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          ai_draft?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          input_text?: string | null
          metadata?: Json
          platform?: string | null
          run_id?: string | null
          source_output_id?: string | null
          stage?: string
          title?: string | null
          type?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_items_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "workflow_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_items_source_output_id_fkey"
            columns: ["source_output_id"]
            isOneToOne: false
            referencedRelation: "workflow_outputs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_items_workspace_fk"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_outputs: {
        Row: {
          content: string
          created_at: string
          id: string
          output_type: string
          position: number
          run_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          output_type: string
          position?: number
          run_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          output_type?: string
          position?: number
          run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_outputs_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "workflow_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_runs: {
        Row: {
          archived_at: string | null
          completed_at: string | null
          created_at: string
          current_step: string | null
          custom_agent_id: string | null
          estimated_minutes_saved: number | null
          goal: string | null
          id: string
          input_text: string
          status: string
          template_id: string
          tone: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          archived_at?: string | null
          completed_at?: string | null
          created_at?: string
          current_step?: string | null
          custom_agent_id?: string | null
          estimated_minutes_saved?: number | null
          goal?: string | null
          id?: string
          input_text: string
          status?: string
          template_id: string
          tone?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          archived_at?: string | null
          completed_at?: string | null
          created_at?: string
          current_step?: string | null
          custom_agent_id?: string | null
          estimated_minutes_saved?: number | null
          goal?: string | null
          id?: string
          input_text?: string
          status?: string
          template_id?: string
          tone?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_runs_custom_agent_id_fkey"
            columns: ["custom_agent_id"]
            isOneToOne: false
            referencedRelation: "user_custom_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_runs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_runs_workspace_fk"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_step_logs: {
        Row: {
          created_at: string
          debug_info: Json
          id: string
          item_id: string | null
          narration: string | null
          run_id: string
          status: string
          step_name: string
        }
        Insert: {
          created_at?: string
          debug_info?: Json
          id?: string
          item_id?: string | null
          narration?: string | null
          run_id: string
          status?: string
          step_name: string
        }
        Update: {
          created_at?: string
          debug_info?: Json
          id?: string
          item_id?: string | null
          narration?: string | null
          run_id?: string
          status?: string
          step_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_step_logs_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "workflow_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_step_logs_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "workflow_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_templates: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          status: string
          steps: Json
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string
          id?: string
          name: string
          status?: string
          steps?: Json
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          status?: string
          steps?: Json
        }
        Relationships: []
      }
      workspace_invites: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["workspace_role"]
          token: string
          workspace_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          role?: Database["public"]["Enums"]["workspace_role"]
          token?: string
          workspace_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["workspace_role"]
          token?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_invites_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string
          role: Database["public"]["Enums"]["workspace_role"]
          user_id: string
          workspace_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          role?: Database["public"]["Enums"]["workspace_role"]
          user_id: string
          workspace_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          role?: Database["public"]["Enums"]["workspace_role"]
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          plan: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          plan?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          plan?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_custom_agent_run_count_today: {
        Args: { p_custom_agent_id: string; p_user_id: string }
        Returns: number
      }
      get_daily_query_count: { Args: { p_user_id: string }; Returns: number }
      get_nora_chat_usage_this_month: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_template_run_count_this_month: {
        Args: { p_template_id: string; p_user_id: string }
        Returns: number
      }
      get_workflow_run_count_this_month: {
        Args: { p_user_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_workspace_role: {
        Args: {
          _roles: Database["public"]["Enums"]["workspace_role"][]
          _user_id: string
          _workspace_id: string
        }
        Returns: boolean
      }
      is_workspace_member: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
      my_nora_chat_usage_this_month: { Args: never; Returns: number }
      my_workflow_run_count_this_month: { Args: never; Returns: number }
    }
    Enums: {
      app_role: "admin" | "user"
      workspace_role: "owner" | "editor" | "viewer"
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
    Enums: {
      app_role: ["admin", "user"],
      workspace_role: ["owner", "editor", "viewer"],
    },
  },
} as const
