
import { supabase } from "@/integrations/supabase/client";

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  phone_number?: string;
  email?: string;
  university_id: number;
  course_id: number;
  academic_session_id: number;
  status: 'active' | 'inactive' | 'completed';
  admission_number?: string;
  created_at: string;
  updated_at: string;
}

export interface University {
  id: number;
  name: string;
  created_at: string;
}

export interface Course {
  id: number;
  name: string;
  created_at: string;
}

export interface AcademicSession {
  id: number;
  session_name: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
}

export interface FeeType {
  id: number;
  name: string;
  description?: string;
  amount: number;
  is_active: boolean;
  created_at: string;
}

export interface FeeCollection {
  id: number;
  student_id: number;
  fee_type_id: number;
  amount_paid: number;
  payment_date: string;
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'cheque';
  receipt_number: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Students API
export const studentsAPI = {
  getAll: async (): Promise<Student[]> => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
    
    return (data || []).map(student => ({
      ...student,
      status: student.status as 'active' | 'inactive' | 'completed'
    }));
  },

  create: async (studentData: Omit<Student, 'id' | 'created_at' | 'updated_at' | 'admission_number'>): Promise<Student> => {
    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating student:', error);
      throw error;
    }
    
    return {
      ...data,
      status: data.status as 'active' | 'inactive' | 'completed'
    };
  },

  update: async (id: number, studentData: Partial<Omit<Student, 'id' | 'created_at' | 'updated_at' | 'admission_number'>>): Promise<Student> => {
    const { data, error } = await supabase
      .from('students')
      .update({ ...studentData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating student:', error);
      throw error;
    }
    
    return {
      ...data,
      status: data.status as 'active' | 'inactive' | 'completed'
    };
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },
};

// Universities API
export const universitiesAPI = {
  getAll: async (): Promise<University[]> => {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching universities:', error);
      throw error;
    }
    
    return data || [];
  },
};

// Courses API
export const coursesAPI = {
  getAll: async (): Promise<Course[]> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
    
    return data || [];
  },
};

// Academic Sessions API
export const academicSessionsAPI = {
  getAll: async (): Promise<AcademicSession[]> => {
    const { data, error } = await supabase
      .from('academic_sessions')
      .select('*')
      .order('session_name');
    
    if (error) {
      console.error('Error fetching academic sessions:', error);
      throw error;
    }
    
    return data || [];
  },
};

// Fee Types API
export const feeTypesAPI = {
  getAll: async (): Promise<FeeType[]> => {
    const { data, error } = await supabase
      .from('fee_types')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching fee types:', error);
      throw error;
    }
    
    return data || [];
  },

  create: async (feeTypeData: Omit<FeeType, 'id' | 'created_at'>): Promise<FeeType> => {
    const { data, error } = await supabase
      .from('fee_types')
      .insert([feeTypeData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating fee type:', error);
      throw error;
    }
    
    return data;
  },

  update: async (id: number, feeTypeData: Partial<Omit<FeeType, 'id' | 'created_at'>>): Promise<FeeType> => {
    const { data, error } = await supabase
      .from('fee_types')
      .update(feeTypeData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating fee type:', error);
      throw error;
    }
    
    return data;
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('fee_types')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting fee type:', error);
      throw error;
    }
  },
};

// Fee Collections API
export const feeCollectionsAPI = {
  getAll: async (): Promise<FeeCollection[]> => {
    const { data, error } = await supabase
      .from('fee_collections')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching fee collections:', error);
      throw error;
    }
    
    return data || [];
  },

  getByStudent: async (studentId: number): Promise<FeeCollection[]> => {
    const { data, error } = await supabase
      .from('fee_collections')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching student fee collections:', error);
      throw error;
    }
    
    return data || [];
  },

  create: async (feeCollectionData: Omit<FeeCollection, 'id' | 'created_at' | 'updated_at' | 'receipt_number'>): Promise<FeeCollection> => {
    const { data, error } = await supabase
      .from('fee_collections')
      .insert([feeCollectionData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating fee collection:', error);
      throw error;
    }
    
    return data;
  },

  update: async (id: number, feeCollectionData: Partial<Omit<FeeCollection, 'id' | 'created_at' | 'updated_at' | 'receipt_number'>>): Promise<FeeCollection> => {
    const { data, error } = await supabase
      .from('fee_collections')
      .update({ ...feeCollectionData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating fee collection:', error);
      throw error;
    }
    
    return data;
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('fee_collections')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting fee collection:', error);
      throw error;
    }
  },
};
