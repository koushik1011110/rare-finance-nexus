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
      academic_sessions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: number
          is_active: boolean | null
          session_name: string
          start_date: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: number
          is_active?: boolean | null
          session_name: string
          start_date?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: number
          is_active?: boolean | null
          session_name?: string
          start_date?: string | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          commission_rate: number | null
          contact_person: string
          created_at: string | null
          email: string
          id: number
          location: string | null
          name: string
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          commission_rate?: number | null
          contact_person: string
          created_at?: string | null
          email: string
          id?: number
          location?: string | null
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          commission_rate?: number | null
          contact_person?: string
          created_at?: string | null
          email?: string
          id?: number
          location?: string | null
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      fee_collections: {
        Row: {
          amount_paid: number
          created_at: string | null
          fee_type_id: number
          id: number
          notes: string | null
          payment_date: string
          payment_method: string | null
          receipt_number: string | null
          student_id: number
          updated_at: string | null
        }
        Insert: {
          amount_paid: number
          created_at?: string | null
          fee_type_id: number
          id?: number
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          receipt_number?: string | null
          student_id: number
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number
          created_at?: string | null
          fee_type_id?: number
          id?: number
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          receipt_number?: string | null
          student_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_collections_fee_type_id_fkey"
            columns: ["fee_type_id"]
            isOneToOne: false
            referencedRelation: "fee_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_collections_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_payments: {
        Row: {
          amount_due: number
          amount_paid: number | null
          created_at: string | null
          due_date: string | null
          fee_structure_component_id: number
          id: number
          last_payment_date: string | null
          payment_status: string | null
          student_id: number
          updated_at: string | null
        }
        Insert: {
          amount_due: number
          amount_paid?: number | null
          created_at?: string | null
          due_date?: string | null
          fee_structure_component_id: number
          id?: number
          last_payment_date?: string | null
          payment_status?: string | null
          student_id: number
          updated_at?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          created_at?: string | null
          due_date?: string | null
          fee_structure_component_id?: number
          id?: number
          last_payment_date?: string | null
          payment_status?: string | null
          student_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_fee_structure_component_id_fkey"
            columns: ["fee_structure_component_id"]
            isOneToOne: false
            referencedRelation: "fee_structure_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structure_components: {
        Row: {
          amount: number
          created_at: string | null
          fee_structure_id: number
          fee_type_id: number
          frequency: string
          id: number
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          fee_structure_id: number
          fee_type_id: number
          frequency?: string
          id?: number
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          fee_structure_id?: number
          fee_type_id?: number
          frequency?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_structure_components_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_structure_components_fee_type_id_fkey"
            columns: ["fee_type_id"]
            isOneToOne: false
            referencedRelation: "fee_types"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structures: {
        Row: {
          course_id: number
          created_at: string | null
          id: number
          is_active: boolean | null
          name: string
          university_id: number
          updated_at: string | null
        }
        Insert: {
          course_id: number
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          university_id: number
          updated_at?: string | null
        }
        Update: {
          course_id?: number
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          university_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_structures_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_structures_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_types: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string | null
          frequency: string
          id: number
          is_active: boolean | null
          name: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string | null
          frequency?: string
          id?: number
          is_active?: boolean | null
          name: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string | null
          frequency?: string
          id?: number
          is_active?: boolean | null
          name?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_fee_assignments: {
        Row: {
          assigned_at: string | null
          fee_structure_id: number
          id: number
          student_id: number
        }
        Insert: {
          assigned_at?: string | null
          fee_structure_id: number
          id?: number
          student_id: number
        }
        Update: {
          assigned_at?: string | null
          fee_structure_id?: number
          id?: number
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_fee_assignments_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_fee_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          aadhaar_number: string | null
          aadhaar_url: string | null
          academic_session_id: number | null
          address: string | null
          admission_number: string | null
          agent_id: number | null
          certificate_12th_url: string | null
          city: string | null
          course_id: number | null
          created_at: string | null
          date_of_birth: string
          email: string | null
          father_name: string
          first_name: string
          id: number
          last_name: string
          marks_12th: number | null
          mother_name: string
          passport_number: string | null
          passport_url: string | null
          phone_number: string | null
          photo_url: string | null
          scores: string | null
          seat_number: string | null
          status: string | null
          submitted_by: string | null
          university_id: number | null
          updated_at: string | null
        }
        Insert: {
          aadhaar_number?: string | null
          aadhaar_url?: string | null
          academic_session_id?: number | null
          address?: string | null
          admission_number?: string | null
          agent_id?: number | null
          certificate_12th_url?: string | null
          city?: string | null
          course_id?: number | null
          created_at?: string | null
          date_of_birth: string
          email?: string | null
          father_name: string
          first_name: string
          id?: number
          last_name: string
          marks_12th?: number | null
          mother_name: string
          passport_number?: string | null
          passport_url?: string | null
          phone_number?: string | null
          photo_url?: string | null
          scores?: string | null
          seat_number?: string | null
          status?: string | null
          submitted_by?: string | null
          university_id?: number | null
          updated_at?: string | null
        }
        Update: {
          aadhaar_number?: string | null
          aadhaar_url?: string | null
          academic_session_id?: number | null
          address?: string | null
          admission_number?: string | null
          agent_id?: number | null
          certificate_12th_url?: string | null
          city?: string | null
          course_id?: number | null
          created_at?: string | null
          date_of_birth?: string
          email?: string | null
          father_name?: string
          first_name?: string
          id?: number
          last_name?: string
          marks_12th?: number | null
          mother_name?: string
          passport_number?: string | null
          passport_url?: string | null
          phone_number?: string | null
          photo_url?: string | null
          scores?: string | null
          seat_number?: string | null
          status?: string | null
          submitted_by?: string | null
          university_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_academic_session_id_fkey"
            columns: ["academic_session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_fee_structure_to_students: {
        Args: { structure_id: number }
        Returns: number
      }
      generate_admission_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_receipt_number: {
        Args: Record<PropertyKey, never>
        Returns: string
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
