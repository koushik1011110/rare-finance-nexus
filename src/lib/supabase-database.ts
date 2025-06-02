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

export interface FeeStructure {
  id: number;
  university_id: number;
  course_id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeeStructureComponent {
  id: number;
  fee_structure_id: number;
  fee_type_id: number;
  amount: number;
  frequency: 'one-time' | 'yearly' | 'semester-wise';
  created_at: string;
  updated_at: string;
}

export interface StudentFeeAssignment {
  id: number;
  student_id: number;
  fee_structure_id: number;
  assigned_at: string;
}

export interface StudentFeePayment {
  id: number;
  student_id: number;
  fee_structure_component_id: number;
  amount_due: number;
  amount_paid: number;
  payment_status: 'pending' | 'partial' | 'paid';
  due_date?: string;
  last_payment_date?: string;
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
    
    return (data || []).map(collection => ({
      ...collection,
      payment_method: collection.payment_method as 'cash' | 'card' | 'bank_transfer' | 'cheque'
    }));
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
    
    return (data || []).map(collection => ({
      ...collection,
      payment_method: collection.payment_method as 'cash' | 'card' | 'bank_transfer' | 'cheque'
    }));
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
    
    return {
      ...data,
      payment_method: data.payment_method as 'cash' | 'card' | 'bank_transfer' | 'cheque'
    };
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
    
    return {
      ...data,
      payment_method: data.payment_method as 'cash' | 'card' | 'bank_transfer' | 'cheque'
    };
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

// Fee Structures API
export const feeStructuresAPI = {
  getAll: async (): Promise<FeeStructure[]> => {
    const { data, error } = await supabase
      .from('fee_structures')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching fee structures:', error);
      throw error;
    }
    
    return data || [];
  },

  getByUniversityAndCourse: async (universityId: number, courseId: number): Promise<FeeStructure[]> => {
    const { data, error } = await supabase
      .from('fee_structures')
      .select('*')
      .eq('university_id', universityId)
      .eq('course_id', courseId)
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching fee structures:', error);
      throw error;
    }
    
    return data || [];
  },

  create: async (feeStructureData: Omit<FeeStructure, 'id' | 'created_at' | 'updated_at'>): Promise<FeeStructure> => {
    const { data, error } = await supabase
      .from('fee_structures')
      .insert([feeStructureData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating fee structure:', error);
      throw error;
    }
    
    return data;
  },

  update: async (id: number, feeStructureData: Partial<Omit<FeeStructure, 'id' | 'created_at' | 'updated_at'>>): Promise<FeeStructure> => {
    const { data, error } = await supabase
      .from('fee_structures')
      .update({ ...feeStructureData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating fee structure:', error);
      throw error;
    }
    
    return data;
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('fee_structures')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting fee structure:', error);
      throw error;
    }
  },

  assignToStudents: async (structureId: number): Promise<number> => {
    // Get the fee structure details first
    const { data: feeStructure, error: structureError } = await supabase
      .from('fee_structures')
      .select('university_id, course_id')
      .eq('id', structureId)
      .single();

    if (structureError) {
      console.error('Error fetching fee structure:', structureError);
      throw structureError;
    }

    // Get active academic session
    const { data: activeSession, error: sessionError } = await supabase
      .from('academic_sessions')
      .select('id')
      .eq('is_active', true)
      .single();

    if (sessionError) {
      console.error('Error fetching active session:', sessionError);
      throw sessionError;
    }

    // Get students that match the criteria
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id')
      .eq('university_id', feeStructure.university_id)
      .eq('course_id', feeStructure.course_id)
      .eq('academic_session_id', activeSession.id)
      .eq('status', 'active');

    if (studentsError) {
      console.error('Error fetching students:', studentsError);
      throw studentsError;
    }

    let assignedCount = 0;

    // Assign fee structure to each student
    for (const student of students || []) {
      // Check if assignment already exists
      const { data: existingAssignment } = await supabase
        .from('student_fee_assignments')
        .select('id')
        .eq('student_id', student.id)
        .eq('fee_structure_id', structureId)
        .single();

      if (!existingAssignment) {
        // Create assignment
        const { error: assignmentError } = await supabase
          .from('student_fee_assignments')
          .insert({
            student_id: student.id,
            fee_structure_id: structureId
          });

        if (!assignmentError) {
          assignedCount++;

          // Get fee structure components
          const { data: components } = await supabase
            .from('fee_structure_components')
            .select('*')
            .eq('fee_structure_id', structureId);

          // Create payment records for each component
          for (const component of components || []) {
            let dueDate = new Date();
            switch (component.frequency) {
              case 'one-time':
                dueDate.setDate(dueDate.getDate() + 30);
                break;
              case 'yearly':
                dueDate.setFullYear(dueDate.getFullYear() + 1);
                break;
              case 'semester-wise':
                dueDate.setMonth(dueDate.getMonth() + 6);
                break;
            }

            await supabase
              .from('student_fee_payments')
              .insert({
                student_id: student.id,
                fee_structure_component_id: component.id,
                amount_due: component.amount,
                due_date: dueDate.toISOString().split('T')[0],
                payment_status: 'pending'
              });
          }
        }
      }
    }

    return assignedCount;
  },
};

// Fee Structure Components API
export const feeStructureComponentsAPI = {
  getByStructure: async (feeStructureId: number): Promise<FeeStructureComponent[]> => {
    const { data, error } = await supabase
      .from('fee_structure_components')
      .select('*')
      .eq('fee_structure_id', feeStructureId)
      .order('created_at');
    
    if (error) {
      console.error('Error fetching fee structure components:', error);
      throw error;
    }
    
    return (data || []).map(component => ({
      ...component,
      frequency: component.frequency as 'one-time' | 'yearly' | 'semester-wise'
    }));
  },

  create: async (componentData: Omit<FeeStructureComponent, 'id' | 'created_at' | 'updated_at'>): Promise<FeeStructureComponent> => {
    const { data, error } = await supabase
      .from('fee_structure_components')
      .insert([componentData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating fee structure component:', error);
      throw error;
    }
    
    return {
      ...data,
      frequency: data.frequency as 'one-time' | 'yearly' | 'semester-wise'
    };
  },

  update: async (id: number, componentData: Partial<Omit<FeeStructureComponent, 'id' | 'created_at' | 'updated_at'>>): Promise<FeeStructureComponent> => {
    const { data, error } = await supabase
      .from('fee_structure_components')
      .update({ ...componentData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating fee structure component:', error);
      throw error;
    }
    
    return {
      ...data,
      frequency: data.frequency as 'one-time' | 'yearly' | 'semester-wise'
    };
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('fee_structure_components')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting fee structure component:', error);
      throw error;
    }
  },
};

// Student Fee Payments API
export const studentFeePaymentsAPI = {
  getByStudent: async (studentId: number): Promise<StudentFeePayment[]> => {
    const { data, error } = await supabase
      .from('student_fee_payments')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching student fee payments:', error);
      throw error;
    }
    
    return (data || []).map(payment => ({
      ...payment,
      payment_status: payment.payment_status as 'pending' | 'partial' | 'paid'
    }));
  },

  updatePayment: async (id: number, amountPaid: number, paymentStatus: 'pending' | 'partial' | 'paid'): Promise<StudentFeePayment> => {
    const { data, error } = await supabase
      .from('student_fee_payments')
      .update({
        amount_paid: amountPaid,
        payment_status: paymentStatus,
        last_payment_date: paymentStatus !== 'pending' ? new Date().toISOString().split('T')[0] : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating student fee payment:', error);
      throw error;
    }
    
    return {
      ...data,
      payment_status: data.payment_status as 'pending' | 'partial' | 'paid'
    };
  },

  getStudentsWithFeeStructures: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        universities(name),
        courses(name),
        academic_sessions(session_name),
        student_fee_payments(
          *,
          fee_structure_components(
            *,
            fee_types(name),
            fee_structures(name)
          )
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching students with fee structures:', error);
      throw error;
    }
    
    return data || [];
  },
};
