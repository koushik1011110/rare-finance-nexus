
import { supabase } from "@/integrations/supabase/client";

export interface Agent {
  id: number;
  name: string;
  email: string;
  contact_person: string;
  phone?: string;
  location?: string;
  status?: 'Active' | 'Inactive';
  students_count?: number;
  total_received?: number;
  payment_status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AgentFormData {
  id?: number;
  name: string;
  email: string;
  contact_person: string;
  phone: string;
  location: string;
  status: 'Active' | 'Inactive';
}

export const agentsAPI = {
  getAll: async (): Promise<Agent[]> => {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
    
    return data || [];
  },

  getById: async (id: number): Promise<Agent> => {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching agent:', error);
      throw error;
    }
    
    return data;
  },

  create: async (agentData: Omit<AgentFormData, 'id'>): Promise<Agent> => {
    const { data, error } = await supabase
      .from('agents')
      .insert([{
        name: agentData.name,
        email: agentData.email,
        contact_person: agentData.contact_person,
        phone: agentData.phone,
        location: agentData.location,
        status: agentData.status,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
    
    return data;
  },

  update: async (id: number, agentData: Partial<Omit<AgentFormData, 'id'>>): Promise<Agent> => {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (agentData.name) updateData.name = agentData.name;
    if (agentData.email) updateData.email = agentData.email;
    if (agentData.contact_person) updateData.contact_person = agentData.contact_person;
    if (agentData.phone) updateData.phone = agentData.phone;
    if (agentData.location) updateData.location = agentData.location;
    if (agentData.status) updateData.status = agentData.status;

    const { data, error } = await supabase
      .from('agents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating agent:', error);
      throw error;
    }
    
    return data;
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting agent:', error);
      throw error;
    }
  },
};
