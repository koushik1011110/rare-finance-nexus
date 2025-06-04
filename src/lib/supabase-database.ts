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

export const agentsAPI = {
  async getAll(): Promise<Agent[]> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getActive(): Promise<Agent[]> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('status', 'active')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<Agent | null> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(agent: Omit<Agent, 'id' | 'created_at' | 'updated_at'>): Promise<Agent> {
    const { data, error } = await supabase
      .from('agents')
      .insert(agent)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: number, agent: Partial<Agent>): Promise<Agent> {
    const { data, error } = await supabase
      .from('agents')
      .update({ ...agent, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
    return data || [];
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
    return data;
  },

  async create(student: Omit<Student, 'id' | 'created_at' | 'updated_at' | 'admission_number'>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: number, student: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update({ ...student, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
