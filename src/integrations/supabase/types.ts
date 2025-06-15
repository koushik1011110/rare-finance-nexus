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
      agent_students: {
        Row: {
          agent_id: number
          created_at: string | null
          id: number
          student_id: number
        }
        Insert: {
          agent_id: number
          created_at?: string | null
          id?: number
          student_id: number
        }
        Update: {
          agent_id?: number
          created_at?: string | null
          id?: number
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_students_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          commission_due: number | null
          commission_rate: number | null
          contact_person: string
          created_at: string | null
          email: string
          id: number
          location: string | null
          name: string
          payment_status: string | null
          phone: string | null
          status: string | null
          students_count: number | null
          total_received: number | null
          updated_at: string | null
        }
        Insert: {
          commission_due?: number | null
          commission_rate?: number | null
          contact_person: string
          created_at?: string | null
          email: string
          id?: number
          location?: string | null
          name: string
          payment_status?: string | null
          phone?: string | null
          status?: string | null
          students_count?: number | null
          total_received?: number | null
          updated_at?: string | null
        }
        Update: {
          commission_due?: number | null
          commission_rate?: number | null
          contact_person?: string
          created_at?: string | null
          email?: string
          id?: number
          location?: string | null
          name?: string
          payment_status?: string | null
          phone?: string | null
          status?: string | null
          students_count?: number | null
          total_received?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      apply_students: {
        Row: {
          aadhaar_copy_url: string | null
          aadhaar_number: string | null
          academic_session_id: number | null
          address: string | null
          admission_number: string | null
          application_status: string | null
          city: string | null
          country: string | null
          course_id: number | null
          created_at: string | null
          date_of_birth: string
          email: string | null
          father_name: string
          first_name: string
          id: number
          last_name: string
          mother_name: string
          passport_copy_url: string | null
          passport_number: string | null
          phone_number: string | null
          photo_url: string | null
          scores: string | null
          seat_number: string | null
          status: string | null
          twelfth_certificate_url: string | null
          twelfth_marks: number | null
          university_id: number | null
          updated_at: string | null
        }
        Insert: {
          aadhaar_copy_url?: string | null
          aadhaar_number?: string | null
          academic_session_id?: number | null
          address?: string | null
          admission_number?: string | null
          application_status?: string | null
          city?: string | null
          country?: string | null
          course_id?: number | null
          created_at?: string | null
          date_of_birth: string
          email?: string | null
          father_name: string
          first_name: string
          id?: number
          last_name: string
          mother_name: string
          passport_copy_url?: string | null
          passport_number?: string | null
          phone_number?: string | null
          photo_url?: string | null
          scores?: string | null
          seat_number?: string | null
          status?: string | null
          twelfth_certificate_url?: string | null
          twelfth_marks?: number | null
          university_id?: number | null
          updated_at?: string | null
        }
        Update: {
          aadhaar_copy_url?: string | null
          aadhaar_number?: string | null
          academic_session_id?: number | null
          address?: string | null
          admission_number?: string | null
          application_status?: string | null
          city?: string | null
          country?: string | null
          course_id?: number | null
          created_at?: string | null
          date_of_birth?: string
          email?: string | null
          father_name?: string
          first_name?: string
          id?: number
          last_name?: string
          mother_name?: string
          passport_copy_url?: string | null
          passport_number?: string | null
          phone_number?: string | null
          photo_url?: string | null
          scores?: string | null
          seat_number?: string | null
          status?: string | null
          twelfth_certificate_url?: string | null
          twelfth_marks?: number | null
          university_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "apply_students_academic_session_id_fkey"
            columns: ["academic_session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apply_students_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apply_students_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      apply_students_backup: {
        Row: {
          aadhaar_copy_url: string | null
          aadhaar_number: string | null
          academic_session_id: number | null
          address: string | null
          admission_number: string | null
          application_status: string | null
          city: string | null
          country: string | null
          course_id: number | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          father_name: string | null
          first_name: string | null
          id: number | null
          last_name: string | null
          mother_name: string | null
          passport_copy_url: string | null
          passport_number: string | null
          phone_number: string | null
          photo_url: string | null
          scores: string | null
          seat_number: string | null
          status: string | null
          twelfth_certificate_url: string | null
          twelfth_marks: number | null
          university_id: number | null
          updated_at: string | null
        }
        Insert: {
          aadhaar_copy_url?: string | null
          aadhaar_number?: string | null
          academic_session_id?: number | null
          address?: string | null
          admission_number?: string | null
          application_status?: string | null
          city?: string | null
          country?: string | null
          course_id?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          father_name?: string | null
          first_name?: string | null
          id?: number | null
          last_name?: string | null
          mother_name?: string | null
          passport_copy_url?: string | null
          passport_number?: string | null
          phone_number?: string | null
          photo_url?: string | null
          scores?: string | null
          seat_number?: string | null
          status?: string | null
          twelfth_certificate_url?: string | null
          twelfth_marks?: number | null
          university_id?: number | null
          updated_at?: string | null
        }
        Update: {
          aadhaar_copy_url?: string | null
          aadhaar_number?: string | null
          academic_session_id?: number | null
          address?: string | null
          admission_number?: string | null
          application_status?: string | null
          city?: string | null
          country?: string | null
          course_id?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          father_name?: string | null
          first_name?: string | null
          id?: number | null
          last_name?: string | null
          mother_name?: string | null
          passport_copy_url?: string | null
          passport_number?: string | null
          phone_number?: string | null
          photo_url?: string | null
          scores?: string | null
          seat_number?: string | null
          status?: string | null
          twelfth_certificate_url?: string | null
          twelfth_marks?: number | null
          university_id?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      character_issues: {
        Row: {
          complaint: string
          created_at: string
          created_by: string | null
          fine_amount: number
          fine_collected: boolean
          id: number
          resolved_at: string | null
          student_id: number
          updated_at: string
        }
        Insert: {
          complaint: string
          created_at?: string
          created_by?: string | null
          fine_amount?: number
          fine_collected?: boolean
          id?: number
          resolved_at?: string | null
          student_id: number
          updated_at?: string
        }
        Update: {
          complaint?: string
          created_at?: string
          created_by?: string | null
          fine_amount?: number
          fine_collected?: boolean
          id?: number
          resolved_at?: string | null
          student_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_character_issues_student_id"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
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
      hostel_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string | null
          expense_date: string
          expense_type: string
          hostel_id: number
          id: number
          notes: string | null
          payment_method: string | null
          receipt_number: string | null
          status: string | null
          updated_at: string | null
          vendor_name: string | null
        }
        Insert: {
          amount: number
          category?: string
          created_at?: string | null
          description?: string | null
          expense_date?: string
          expense_type: string
          hostel_id: number
          id?: number
          notes?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string | null
          expense_date?: string
          expense_type?: string
          hostel_id?: number
          id?: number
          notes?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hostel_expenses_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      hostels: {
        Row: {
          address: string | null
          capacity: number
          contact_person: string | null
          created_at: string | null
          current_occupancy: number | null
          email: string | null
          facilities: string | null
          id: number
          location: string
          monthly_rent: number
          name: string
          phone: string | null
          status: string | null
          university_id: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          capacity?: number
          contact_person?: string | null
          created_at?: string | null
          current_occupancy?: number | null
          email?: string | null
          facilities?: string | null
          id?: number
          location: string
          monthly_rent?: number
          name: string
          phone?: string | null
          status?: string | null
          university_id?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          capacity?: number
          contact_person?: string | null
          created_at?: string | null
          current_occupancy?: number | null
          email?: string | null
          facilities?: string | null
          id?: number
          location?: string
          monthly_rent?: number
          name?: string
          phone?: string | null
          status?: string | null
          university_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hostels_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      mess_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string | null
          expense_date: string
          expense_type: string
          hostel_id: number | null
          id: number
          notes: string | null
          payment_method: string | null
          receipt_number: string | null
          status: string | null
          updated_at: string | null
          vendor_name: string | null
        }
        Insert: {
          amount: number
          category?: string
          created_at?: string | null
          description?: string | null
          expense_date?: string
          expense_type: string
          hostel_id?: number | null
          id?: number
          notes?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string | null
          expense_date?: string
          expense_type?: string
          hostel_id?: number | null
          id?: number
          notes?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mess_expenses_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      student_credentials: {
        Row: {
          created_at: string | null
          id: number
          password: string
          student_id: number
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          password: string
          student_id: number
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: number
          password?: string
          student_id?: number
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_credentials_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
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
      student_hostel_assignments: {
        Row: {
          assigned_date: string
          created_at: string | null
          hostel_id: number
          id: number
          status: string
          student_id: number
          updated_at: string | null
        }
        Insert: {
          assigned_date?: string
          created_at?: string | null
          hostel_id: number
          id?: number
          status?: string
          student_id: number
          updated_at?: string | null
        }
        Update: {
          assigned_date?: string
          created_at?: string | null
          hostel_id?: number
          id?: number
          status?: string
          student_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_hostel_assignments_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_hostel_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_visa: {
        Row: {
          application_submitted: boolean | null
          created_at: string | null
          expiration_date: string | null
          id: number
          issue_date: string | null
          local_id_number: string | null
          residency_address: string | null
          residency_deadline: string | null
          residency_registration: boolean | null
          student_id: number
          updated_at: string | null
          visa_approved: boolean | null
          visa_interview: boolean | null
          visa_number: string | null
          visa_type: string
        }
        Insert: {
          application_submitted?: boolean | null
          created_at?: string | null
          expiration_date?: string | null
          id?: number
          issue_date?: string | null
          local_id_number?: string | null
          residency_address?: string | null
          residency_deadline?: string | null
          residency_registration?: boolean | null
          student_id: number
          updated_at?: string | null
          visa_approved?: boolean | null
          visa_interview?: boolean | null
          visa_number?: string | null
          visa_type?: string
        }
        Update: {
          application_submitted?: boolean | null
          created_at?: string | null
          expiration_date?: string | null
          id?: number
          issue_date?: string | null
          local_id_number?: string | null
          residency_address?: string | null
          residency_deadline?: string | null
          residency_registration?: boolean | null
          student_id?: number
          updated_at?: string | null
          visa_approved?: boolean | null
          visa_interview?: boolean | null
          visa_number?: string | null
          visa_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_visa_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          aadhaar_copy_url: string | null
          aadhaar_number: string | null
          academic_session_id: number | null
          address: string | null
          admission_number: string | null
          agent_id: number | null
          city: string | null
          country: string | null
          course_id: number | null
          created_at: string | null
          date_of_birth: string
          email: string | null
          father_name: string
          first_name: string
          id: number
          last_name: string
          mother_name: string
          passport_copy_url: string | null
          passport_number: string | null
          phone_number: string | null
          photo_url: string | null
          scores: string | null
          seat_number: string | null
          status: string | null
          twelfth_certificate_url: string | null
          twelfth_marks: number | null
          university_id: number | null
          updated_at: string | null
        }
        Insert: {
          aadhaar_copy_url?: string | null
          aadhaar_number?: string | null
          academic_session_id?: number | null
          address?: string | null
          admission_number?: string | null
          agent_id?: number | null
          city?: string | null
          country?: string | null
          course_id?: number | null
          created_at?: string | null
          date_of_birth: string
          email?: string | null
          father_name: string
          first_name: string
          id?: number
          last_name: string
          mother_name: string
          passport_copy_url?: string | null
          passport_number?: string | null
          phone_number?: string | null
          photo_url?: string | null
          scores?: string | null
          seat_number?: string | null
          status?: string | null
          twelfth_certificate_url?: string | null
          twelfth_marks?: number | null
          university_id?: number | null
          updated_at?: string | null
        }
        Update: {
          aadhaar_copy_url?: string | null
          aadhaar_number?: string | null
          academic_session_id?: number | null
          address?: string | null
          admission_number?: string | null
          agent_id?: number | null
          city?: string | null
          country?: string | null
          course_id?: number | null
          created_at?: string | null
          date_of_birth?: string
          email?: string | null
          father_name?: string
          first_name?: string
          id?: number
          last_name?: string
          mother_name?: string
          passport_copy_url?: string | null
          passport_number?: string | null
          phone_number?: string | null
          photo_url?: string | null
          scores?: string | null
          seat_number?: string | null
          status?: string | null
          twelfth_certificate_url?: string | null
          twelfth_marks?: number | null
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
      user_permissions: {
        Row: {
          action: string
          created_at: string | null
          id: number
          resource: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: number
          resource: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: number
          resource?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: number
          token: string
          user_id: number
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: number
          token: string
          user_id: number
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: number
          token?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_sessions_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: number
          is_active: boolean
          last_name: string
          password_hash: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: number
          is_active?: boolean
          last_name: string
          password_hash: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: number
          is_active?: boolean
          last_name?: string
          password_hash?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_student_application: {
        Args: { application_id: number }
        Returns: undefined
      }
      assign_fee_structure_to_students: {
        Args: { structure_id: number }
        Returns: number
      }
      authenticate_user: {
        Args: { email_param: string; password_param: string }
        Returns: {
          user_id: number
          email: string
          first_name: string
          last_name: string
          role: Database["public"]["Enums"]["user_role"]
          is_active: boolean
        }[]
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_staff_member: {
        Args: {
          email_param: string
          password_param: string
          first_name_param: string
          last_name_param: string
          role_param: Database["public"]["Enums"]["user_role"]
          agent_name_param?: string
          agent_phone_param?: string
          agent_location_param?: string
        }
        Returns: number
      }
      create_student_credentials: {
        Args: { student_id_param: number }
        Returns: undefined
      }
      create_user_session: {
        Args: { user_id_param: number }
        Returns: string
      }
      generate_admission_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_random_password: {
        Args: { length?: number }
        Returns: string
      }
      generate_receipt_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_student_password: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_student_username: {
        Args: { student_id_param: number }
        Returns: string
      }
      generate_username: {
        Args: { first_name: string; last_name: string; student_id: number }
        Returns: string
      }
      logout_user: {
        Args: { token_param: string }
        Returns: undefined
      }
      recalculate_all_hostel_occupancies: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      resolve_character_issue: {
        Args: { issue_id: number }
        Returns: undefined
      }
      update_application_status: {
        Args: { application_id: number; new_status: string }
        Returns: {
          id: number
          status: string
        }[]
      }
      validate_session: {
        Args: { token_param: string }
        Returns: {
          user_id: number
          email: string
          first_name: string
          last_name: string
          role: Database["public"]["Enums"]["user_role"]
          is_active: boolean
        }[]
      }
      verify_student_login: {
        Args: { input_username: string; input_password: string }
        Returns: {
          student_id: number
          username: string
          first_name: string
          last_name: string
          email: string
          admission_number: string
        }[]
      }
    }
    Enums: {
      user_role: "admin" | "agent" | "hostel_team" | "finance" | "staff"
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
    Enums: {
      user_role: ["admin", "agent", "hostel_team", "finance", "staff"],
    },
  },
} as const
