
import { supabase } from "@/integrations/supabase/client";

export interface Agent {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone?: string;
  location?: string;
  students_count: number;
  commission_rate: number;
  total_received: number;
  commission_due: number;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface AgentFormData {
  id?: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  commission: string;
  status: "Active" | "Inactive";
}

// Agents API
export const agentsAPI = {
  getAll: async (): Promise<Agent[]> => {
    // First get all agents
    const { data: agentsData, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (agentsError) {
      console.error('Error fetching agents:', agentsError);
      throw agentsError;
    }

    // Then get student counts for each agent
    const agentsWithCounts = await Promise.all(
      (agentsData || []).map(async (agent) => {
        const { count, error: countError } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })
          .eq('agent_id', agent.id);
        
        if (countError) {
          console.error('Error counting students for agent:', agent.id, countError);
        }
        
        return {
          ...agent,
          students_count: count || 0,
          status: agent.status as 'Active' | 'Inactive'
        };
      })
    );

    return agentsWithCounts;
  },

  create: async (agentData: Omit<AgentFormData, 'id'>): Promise<Agent> => {
    const { data, error } = await supabase
      .from('agents')
      .insert([{
        name: agentData.name,
        contact_person: agentData.contactPerson,
        email: agentData.email,
        phone: agentData.phone,
        location: agentData.location,
        commission_rate: parseFloat(agentData.commission.replace('%', '')),
        status: agentData.status,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
    
    return {
      ...data,
      status: data.status as 'Active' | 'Inactive'
    };
  },

  update: async (id: number, agentData: Partial<Omit<AgentFormData, 'id'>>): Promise<Agent> => {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (agentData.name) updateData.name = agentData.name;
    if (agentData.contactPerson) updateData.contact_person = agentData.contactPerson;
    if (agentData.email) updateData.email = agentData.email;
    if (agentData.phone) updateData.phone = agentData.phone;
    if (agentData.location) updateData.location = agentData.location;
    if (agentData.commission) updateData.commission_rate = parseFloat(agentData.commission.replace('%', ''));
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
    
    return {
      ...data,
      status: data.status as 'Active' | 'Inactive'
    };
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
