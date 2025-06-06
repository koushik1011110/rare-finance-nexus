
import { supabase } from "@/integrations/supabase/client";

export interface StudentHostelAssignment {
  id: number;
  student_id: number;
  hostel_id: number;
  assigned_date: string;
  status: 'Active' | 'Inactive' | 'Transferred';
  created_at: string;
  updated_at: string;
  student?: {
    first_name: string;
    last_name: string;
  };
  hostel?: {
    name: string;
  };
}

export const studentHostelAPI = {
  getAll: async (): Promise<StudentHostelAssignment[]> => {
    // Since we don't have student_hostel_assignments table in the database yet,
    // we'll simulate the assignments from the students table for now
    const { data, error } = await supabase
      .from('students')
      .select('*, academic_sessions:academic_session_id (*)');
    
    if (error) {
      console.error('Error fetching student hostel assignments:', error);
      throw error;
    }
    
    // Convert student data to student-hostel assignments
    // In the real implementation, this would be an actual query to student_hostel_assignments
    const dummyAssignments: StudentHostelAssignment[] = (data || []).map((student, index) => ({
      id: student.id,
      student_id: student.id,
      hostel_id: (index % 3) + 1, // Assign to one of three hostels based on index
      assigned_date: new Date().toISOString().split('T')[0],
      status: 'Active',
      created_at: student.created_at || new Date().toISOString(),
      updated_at: student.updated_at || new Date().toISOString(),
      student: {
        first_name: student.first_name,
        last_name: student.last_name
      }
    }));
    
    return dummyAssignments;
  },

  getByHostel: async (hostelId: number): Promise<StudentHostelAssignment[]> => {
    // For now, simulate assignments based on student data
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .limit(10); // Limit for demo purposes
    
    if (error) {
      console.error('Error fetching students by hostel:', error);
      throw error;
    }
    
    const dummyAssignments: StudentHostelAssignment[] = (data || [])
      .filter((_, index) => index % 3 === (hostelId - 1) % 3) // Only include students that would be assigned to this hostel
      .map(student => ({
        id: student.id,
        student_id: student.id,
        hostel_id: hostelId,
        assigned_date: new Date().toISOString().split('T')[0],
        status: 'Active',
        created_at: student.created_at || new Date().toISOString(),
        updated_at: student.updated_at || new Date().toISOString(),
        student: {
          first_name: student.first_name,
          last_name: student.last_name
        }
      }));
    
    return dummyAssignments;
  },

  assignStudent: async (studentId: number, hostelId: number): Promise<StudentHostelAssignment> => {
    // In a real implementation, this would insert into the student_hostel_assignments table
    // For now, we'll update the student record to simulate the assignment
    
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();
    
    if (studentError) {
      console.error('Error fetching student data:', studentError);
      throw studentError;
    }
    
    const { data: hostel, error: hostelError } = await supabase
      .from('hostels')
      .select('*')
      .eq('id', hostelId)
      .single();
    
    if (hostelError) {
      console.error('Error fetching hostel data:', hostelError);
      throw hostelError;
    }
    
    // Create a dummy assignment
    const assignment: StudentHostelAssignment = {
      id: Date.now(), // Use timestamp as dummy ID
      student_id: studentId,
      hostel_id: hostelId,
      assigned_date: new Date().toISOString().split('T')[0],
      status: 'Active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      student: {
        first_name: student.first_name,
        last_name: student.last_name
      },
      hostel: {
        name: hostel.name
      }
    };
    
    // Update the hostel's occupancy count
    const { error: updateError } = await supabase
      .from('hostels')
      .update({
        current_occupancy: (hostel.current_occupancy || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', hostelId);
    
    if (updateError) {
      console.error('Error updating hostel occupancy:', updateError);
      throw updateError;
    }
    
    return assignment;
  },
  
  removeStudent: async (studentId: number, hostelId: number): Promise<void> => {
    // In a real implementation, this would update the student_hostel_assignments record
    
    const { data: hostel, error: hostelError } = await supabase
      .from('hostels')
      .select('*')
      .eq('id', hostelId)
      .single();
    
    if (hostelError) {
      console.error('Error fetching hostel data:', hostelError);
      throw hostelError;
    }
    
    // Update the hostel's occupancy count
    const { error: updateError } = await supabase
      .from('hostels')
      .update({
        current_occupancy: Math.max(0, (hostel.current_occupancy || 0) - 1),
        updated_at: new Date().toISOString()
      })
      .eq('id', hostelId);
    
    if (updateError) {
      console.error('Error updating hostel occupancy:', updateError);
      throw updateError;
    }
  }
};
