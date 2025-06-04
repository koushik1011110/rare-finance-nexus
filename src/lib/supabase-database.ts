import { supabase } from "@/integrations/supabase/client";

export interface University {
  id: number;
  created_at?: string;
  name: string;
}

export interface Course {
  id: number;
  created_at?: string;
  name: string;
}

export interface AcademicSession {
  id: number;
  created_at?: string;
  session_name: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export interface Agent {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone?: string;
  location?: string;
  commission_rate?: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  phone_number?: string;
  email?: string;
  university_id?: number;
  course_id?: number;
  academic_session_id?: number;
  city?: string;
  address?: string;
  marks_12th?: number;
  seat_number?: string;
  scores?: string;
  passport_number?: string;
  aadhaar_number?: string;
  photo_url?: string;
  passport_url?: string;
  aadhaar_url?: string;
  certificate_12th_url?: string;
  submitted_by?: 'admin' | 'agent';
  agent_id?: number;
  status: 'active' | 'inactive' | 'completed';
  admission_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FeeType {
  id: number;
  name: string;
  description?: string;
  category: string;
  amount: number;
  frequency: string;
  status: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FeeStructure {
  id: number;
  name: string;
  university_id: number;
  course_id: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FeeStructureComponent {
  id: number;
  fee_structure_id: number;
  fee_type_id: number;
  amount: number;
  frequency: string;
  created_at?: string;
  updated_at?: string;
}

export interface FeePayment {
  id: number;
  student_id: number;
  fee_structure_component_id: number;
  amount_due: number;
  amount_paid?: number;
  due_date?: string;
  last_payment_date?: string;
  payment_status?: string;
  created_at?: string;
  updated_at?: string;
}

export const universitiesAPI = {
  async getAll(): Promise<University[]> {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<University | null> {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(university: Omit<University, 'id' | 'created_at'>): Promise<University> {
    const { data, error } = await supabase
      .from('universities')
      .insert(university)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: number, university: Partial<University>): Promise<University> {
    const { data, error } = await supabase
      .from('universities')
      .update({ ...university, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('universities')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const coursesAPI = {
  async getAll(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(course: Omit<Course, 'id' | 'created_at'>): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: number, course: Partial<Course>): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .update({ ...course, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const academicSessionsAPI = {
  async getAll(): Promise<AcademicSession[]> {
    const { data, error } = await supabase
      .from('academic_sessions')
      .select('*')
      .order('session_name');
    
    if (error) throw error;
    return data || [];
  },

   async getActive(): Promise<AcademicSession[]> {
    const { data, error } = await supabase
      .from('academic_sessions')
      .select('*')
      .eq('is_active', true)
      .order('session_name');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<AcademicSession | null> {
    const { data, error } = await supabase
      .from('academic_sessions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(academicSession: Omit<AcademicSession, 'id' | 'created_at'>): Promise<AcademicSession> {
    const { data, error } = await supabase
      .from('academic_sessions')
      .insert(academicSession)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: number, academicSession: Partial<AcademicSession>): Promise<AcademicSession> {
    const { data, error } = await supabase
      .from('academic_sessions')
      .update({ ...academicSession, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('academic_sessions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const agentsAPI = {
  async getAll(): Promise<Agent[]> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return (data || []).map(agent => ({
      ...agent,
      status: agent.status as 'active' | 'inactive'
    }));
  },

  async getActive(): Promise<Agent[]> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('status', 'active')
      .order('name');
    
    if (error) throw error;
    return (data || []).map(agent => ({
      ...agent,
      status: agent.status as 'active' | 'inactive'
    }));
  },

  async getById(id: number): Promise<Agent | null> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? {
      ...data,
      status: data.status as 'active' | 'inactive'
    } : null;
  },

  async create(agent: Omit<Agent, 'id' | 'created_at' | 'updated_at'>): Promise<Agent> {
    const { data, error } = await supabase
      .from('agents')
      .insert(agent)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      status: data.status as 'active' | 'inactive'
    };
  },

  async update(id: number, agent: Partial<Agent>): Promise<Agent> {
    const { data, error } = await supabase
      .from('agents')
      .update({ ...agent, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      status: data.status as 'active' | 'inactive'
    };
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const studentsAPI = {
  async getAll(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        universities(name),
        courses(name),
        academic_sessions(session_name),
        agents(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(student => ({
      ...student,
      submitted_by: student.submitted_by as 'admin' | 'agent',
      status: student.status as 'active' | 'inactive' | 'completed'
    }));
  },

  async getById(id: number): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        universities(name),
        courses(name),
        academic_sessions(session_name),
        agents(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? {
      ...data,
      submitted_by: data.submitted_by as 'admin' | 'agent',
      status: data.status as 'active' | 'inactive' | 'completed'
    } : null;
  },

  async create(student: Omit<Student, 'id' | 'created_at' | 'updated_at' | 'admission_number'>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      submitted_by: data.submitted_by as 'admin' | 'agent',
      status: data.status as 'active' | 'inactive' | 'completed'
    };
  },

  async update(id: number, student: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update({ ...student, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      submitted_by: data.submitted_by as 'admin' | 'agent',
      status: data.status as 'active' | 'inactive' | 'completed'
    };
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const feeTypesAPI = {
  async getAll(): Promise<FeeType[]> {
    const { data, error } = await supabase
      .from('fee_types')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<FeeType | null> {
    const { data, error } = await supabase
      .from('fee_types')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(feeType: Omit<FeeType, 'id' | 'created_at' | 'updated_at'>): Promise<FeeType> {
    const { data, error } = await supabase
      .from('fee_types')
      .insert(feeType)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: number, feeType: Partial<FeeType>): Promise<FeeType> {
    const { data, error } = await supabase
      .from('fee_types')
      .update({ ...feeType, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('fee_types')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const feeStructuresAPI = {
  async getAll(): Promise<FeeStructure[]> {
    const { data, error } = await supabase
      .from('fee_structures')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<FeeStructure | null> {
    const { data, error } = await supabase
      .from('fee_structures')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(feeStructure: Omit<FeeStructure, 'id' | 'created_at' | 'updated_at'>): Promise<FeeStructure> {
    const { data, error } = await supabase
      .from('fee_structures')
      .insert(feeStructure)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: number, feeStructure: Partial<FeeStructure>): Promise<FeeStructure> {
    const { data, error } = await supabase
      .from('fee_structures')
      .update({ ...feeStructure, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('fee_structures')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async assignToStudents(structureId: number): Promise<number> {
    const { data, error } = await supabase.rpc('assign_fee_structure_to_students', {
      structure_id: structureId
    });
    
    if (error) throw error;
    return data || 0;
  }
};

export const feeStructureComponentsAPI = {
  async getAll(): Promise<FeeStructureComponent[]> {
    const { data, error } = await supabase
      .from('fee_structure_components')
      .select('*')
      .order('id');
    
    if (error) throw error;
    return data || [];
  },

  async getByStructureId(structureId: number): Promise<FeeStructureComponent[]> {
    const { data, error } = await supabase
      .from('fee_structure_components')
      .select('*')
      .eq('fee_structure_id', structureId)
      .order('id');
    
    if (error) throw error;
    return data || [];
  },

  async create(component: Omit<FeeStructureComponent, 'id' | 'created_at' | 'updated_at'>): Promise<FeeStructureComponent> {
    const { data, error } = await supabase
      .from('fee_structure_components')
      .insert(component)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: number, component: Partial<FeeStructureComponent>): Promise<FeeStructureComponent> {
    const { data, error } = await supabase
      .from('fee_structure_components')
      .update({ ...component, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('fee_structure_components')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const feePaymentsAPI = {
  async getAll(): Promise<FeePayment[]> {
    const { data, error } = await supabase
      .from('fee_payments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByStudentId(studentId: number): Promise<FeePayment[]> {
    const { data, error } = await supabase
      .from('fee_payments')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(payment: Omit<FeePayment, 'id' | 'created_at' | 'updated_at'>): Promise<FeePayment> {
    const { data, error } = await supabase
      .from('fee_payments')
      .insert(payment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: number, payment: Partial<FeePayment>): Promise<FeePayment> {
    const { data, error } = await supabase
      .from('fee_payments')
      .update({ ...payment, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('fee_payments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getStudentsWithFeeStructures(): Promise<any[]> {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        universities(name),
        courses(name),
        academic_sessions(session_name),
        student_fee_assignments(
          fee_structures(
            name,
            fee_structure_components(
              fee_types(name),
              amount,
              frequency
            )
          )
        )
      `)
      .eq('status', 'active');
    
    if (error) throw error;
    return data || [];
  },

  async updatePayment(paymentId: number, amountPaid: number, paymentMethod: string): Promise<FeePayment> {
    const { data, error } = await supabase
      .from('fee_payments')
      .update({
        amount_paid: amountPaid,
        last_payment_date: new Date().toISOString().split('T')[0],
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getPaymentHistory(dateRange: any, paymentMethodFilter: string): Promise<any[]> {
    let query = supabase
      .from('fee_payments')
      .select(`
        *,
        students(first_name, last_name, admission_number, phone_number),
        fee_structure_components(
          fee_types(name),
          fee_structures(name)
        )
      `)
      .not('amount_paid', 'is', null)
      .order('last_payment_date', { ascending: false });

    if (dateRange.from) {
      query = query.gte('last_payment_date', dateRange.from);
    }
    if (dateRange.to) {
      query = query.lte('last_payment_date', dateRange.to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getFeeReports(dateRange: any, statusFilter: string): Promise<any[]> {
    let query = supabase
      .from('fee_payments')
      .select(`
        *,
        students(first_name, last_name, admission_number, phone_number),
        fee_structure_components(
          fee_types(name),
          fee_structures(name),
          amount,
          frequency
        )
      `)
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('payment_status', statusFilter);
    }

    if (dateRange.from) {
      query = query.gte('due_date', dateRange.from);
    }
    if (dateRange.to) {
      query = query.lte('due_date', dateRange.to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
};
