
import { supabase } from "@/integrations/supabase/client";

export interface StudentHostelAssignment {
  id: number;
  student_id: number;
  hostel_id: number;
  assigned_date: string;
  status: 'Active' | 'Inactive' | 'Transferred';
  created_at: string;
  updated_at: string;
  students?: {
    first_name: string;
    last_name: string;
    admission_number: string;
  };
  hostels?: {
    name: string;
  };
}

export interface StudentHostelFormData {
  student_id: string;
  hostel_id: string;
  status: 'Active' | 'Inactive' | 'Transferred';
}

export const studentHostelAPI = {
  getAll: async (): Promise<StudentHostelAssignment[]> => {
    const { data, error } = await supabase
      .from('student_hostel_assignments')
      .select(`
        *,
        students (
          first_name,
          last_name,
          admission_number
        ),
        hostels (
          name
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching student hostel assignments:', error);
      throw error;
    }
    
    return (data || []).map(assignment => ({
      ...assignment,
      status: assignment.status as StudentHostelAssignment['status']
    }));
  },

  create: async (assignmentData: StudentHostelFormData): Promise<StudentHostelAssignment> => {
    const { data, error } = await supabase
      .from('student_hostel_assignments')
      .insert([{
        student_id: parseInt(assignmentData.student_id),
        hostel_id: parseInt(assignmentData.hostel_id),
        status: assignmentData.status,
      }])
      .select(`
        *,
        students (
          first_name,
          last_name,
          admission_number
        ),
        hostels (
          name
        )
      `)
      .single();
    
    if (error) {
      console.error('Error creating student hostel assignment:', error);
      throw error;
    }
    
    return {
      ...data,
      status: data.status as StudentHostelAssignment['status']
    };
  },

  update: async (id: number, assignmentData: Partial<StudentHostelFormData>): Promise<StudentHostelAssignment> => {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (assignmentData.student_id) updateData.student_id = parseInt(assignmentData.student_id);
    if (assignmentData.hostel_id) updateData.hostel_id = parseInt(assignmentData.hostel_id);
    if (assignmentData.status) updateData.status = assignmentData.status;

    const { data, error } = await supabase
      .from('student_hostel_assignments')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        students (
          first_name,
          last_name,
          admission_number
        ),
        hostels (
          name
        )
      `)
      .single();
    
    if (error) {
      console.error('Error updating student hostel assignment:', error);
      throw error;
    }
    
    return {
      ...data,
      status: data.status as StudentHostelAssignment['status']
    };
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('student_hostel_assignments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting student hostel assignment:', error);
      throw error;
    }
  },

  getByHostel: async (hostelId: number): Promise<StudentHostelAssignment[]> => {
    const { data, error } = await supabase
      .from('student_hostel_assignments')
      .select(`
        *,
        students (
          first_name,
          last_name,
          admission_number
        ),
        hostels (
          name
        )
      `)
      .eq('hostel_id', hostelId)
      .eq('status', 'Active')
      .order('assigned_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching assignments by hostel:', error);
      throw error;
    }
    
    return (data || []).map(assignment => ({
      ...assignment,
      status: assignment.status as StudentHostelAssignment['status']
    }));
  },
};
