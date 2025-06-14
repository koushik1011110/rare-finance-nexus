import { supabase } from "@/integrations/supabase/client";

export interface CharacterIssue {
  id: number;
  student_id: number;
  complaint: string;
  fine_amount: number;
  fine_collected: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  resolved_at?: string;
  student?: {
    first_name: string;
    last_name: string;
    admission_number: string;
    email: string;
  };
}

export interface CreateCharacterIssueRequest {
  student_id: number;
  complaint: string;
  fine_amount: number;
  created_by?: string;
}

export const characterIssuesApi = {
  // Get all unresolved character issues
  async getAll(): Promise<CharacterIssue[]> {
    const { data, error } = await supabase
      .from('character_issues')
      .select(`
        *,
        student:students(
          first_name,
          last_name,
          admission_number,
          email
        )
      `)
      .eq('fine_collected', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching character issues:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new character issue
  async create(data: CreateCharacterIssueRequest): Promise<CharacterIssue> {
    const { data: newIssue, error } = await supabase
      .from('character_issues')
      .insert([data])
      .select(`
        *,
        student:students(
          first_name,
          last_name,
          admission_number,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Error creating character issue:', error);
      throw error;
    }

    return newIssue;
  },

  // Mark fine as collected and resolve issue
  async resolveFine(id: number): Promise<void> {
    const { error } = await supabase.rpc('resolve_character_issue', {
      issue_id: id
    });

    if (error) {
      console.error('Error resolving character issue:', error);
      throw error;
    }
  },

  // Update character issue
  async update(id: number, updates: Partial<CreateCharacterIssueRequest>): Promise<CharacterIssue> {
    const { data, error } = await supabase
      .from('character_issues')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        student:students(
          first_name,
          last_name,
          admission_number,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Error updating character issue:', error);
      throw error;
    }

    return data;
  },

  // Delete character issue
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('character_issues')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting character issue:', error);
      throw error;
    }
  }
};