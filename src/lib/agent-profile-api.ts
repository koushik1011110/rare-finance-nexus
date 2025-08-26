import { supabase } from "@/integrations/supabase/client";

export interface AgentStats {
  totalStudents: number;
  activeStudents: number;
  totalReceivable: number;
  paidAmount: number;
  pendingAmount: number;
}

export const agentProfileAPI = {
  getAgentStats: async (agentEmail: string): Promise<AgentStats> => {
    try {
      // Get agent ID first
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('id')
        .eq('email', agentEmail)
        .single();

      if (agentError || !agentData) {
        throw new Error('Agent not found');
      }

      // Get students count
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, status')
        .eq('agent_id', agentData.id);

      if (studentsError) throw studentsError;

      const totalStudents = studentsData?.length || 0;
      const activeStudents = studentsData?.filter(s => s.status === 'active').length || 0;

      // Get fee payments data for receivable calculations
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('fee_payments')
        .select(`
          amount_due,
          amount_paid,
          payment_status,
          students!inner(agent_id)
        `)
        .eq('students.agent_id', agentData.id);

      if (paymentsError) throw paymentsError;

      let totalReceivable = 0;
      let paidAmount = 0;
      let pendingAmount = 0;

      paymentsData?.forEach(payment => {
        const due = Number(payment.amount_due) || 0;
        const paid = Number(payment.amount_paid) || 0;
        
        totalReceivable += due;
        paidAmount += paid;
        pendingAmount += (due - paid);
      });

      return {
        totalStudents,
        activeStudents,
        totalReceivable,
        paidAmount,
        pendingAmount
      };

    } catch (error) {
      console.error('Error loading agent stats:', error);
      return {
        totalStudents: 0,
        activeStudents: 0,
        totalReceivable: 0,
        paidAmount: 0,
        pendingAmount: 0
      };
    }
  },

  updateAgentProfile: async (agentEmail: string, profileData: {
    name: string;
    contact_person: string;
    phone?: string;
    location?: string;
  }) => {
    const { error } = await supabase
      .from('agents')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('email', agentEmail);

    if (error) throw error;
    return true;
  }
};