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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      aptitude_tests: {
        Row: {
          career_title: string
          created_at: string | null
          id: string
          questions: Json
          test_name: string
        }
        Insert: {
          career_title: string
          created_at?: string | null
          id?: string
          questions: Json
          test_name: string
        }
        Update: {
          career_title?: string
          created_at?: string | null
          id?: string
          questions?: Json
          test_name?: string
        }
        Relationships: []
      }
      career_recommendations: {
        Row: {
          career_title: string
          confidence_score: number
          created_at: string | null
          description: string | null
          id: string
          ranking: number
          required_skills: string[] | null
          user_id: string
        }
        Insert: {
          career_title: string
          confidence_score: number
          created_at?: string | null
          description?: string | null
          id?: string
          ranking: number
          required_skills?: string[] | null
          user_id: string
        }
        Update: {
          career_title?: string
          confidence_score?: number
          created_at?: string | null
          description?: string | null
          id?: string
          ranking?: number
          required_skills?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      iq_test_results: {
        Row: {
          completed_at: string | null
          feedback: string | null
          id: string
          max_score: number
          total_score: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          feedback?: string | null
          id?: string
          max_score: number
          total_score: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          feedback?: string | null
          id?: string
          max_score?: number
          total_score?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string | null
          education_background: string | null
          email: string
          full_name: string | null
          gender: string | null
          id: string
          interests: string[] | null
          qualification: string | null
          skills: string[] | null
          updated_at: string | null
          work_style: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          education_background?: string | null
          email: string
          full_name?: string | null
          gender?: string | null
          id: string
          interests?: string[] | null
          qualification?: string | null
          skills?: string[] | null
          updated_at?: string | null
          work_style?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          education_background?: string | null
          email?: string
          full_name?: string | null
          gender?: string | null
          id?: string
          interests?: string[] | null
          qualification?: string | null
          skills?: string[] | null
          updated_at?: string | null
          work_style?: string | null
        }
        Relationships: []
      }
      test_results: {
        Row: {
          career_title: string
          completed_at: string | null
          feedback: string | null
          id: string
          max_score: number
          section_scores: Json | null
          total_score: number
          user_id: string
        }
        Insert: {
          career_title: string
          completed_at?: string | null
          feedback?: string | null
          id?: string
          max_score: number
          section_scores?: Json | null
          total_score: number
          user_id: string
        }
        Update: {
          career_title?: string
          completed_at?: string | null
          feedback?: string | null
          id?: string
          max_score?: number
          section_scores?: Json | null
          total_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
