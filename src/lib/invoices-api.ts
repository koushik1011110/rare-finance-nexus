import { supabase } from '@/integrations/supabase/client';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface InvoiceRecord {
  id: number;
  invoice_number: string;
  student_id?: number | null;
  created_by?: string | null;
  status: 'Paid' | 'Unpaid' | 'Due';
  invoice_date?: string | null;
  due_date?: string | null;
  subtotal?: number;
  discount_amount?: number;
  gst_amount?: number;
  total_amount?: number;
  items?: InvoiceItem[];
  terms?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const invoicesAPI = {
  create: async (payload: Omit<InvoiceRecord, 'id' | 'created_at' | 'updated_at'>): Promise<InvoiceRecord> => {
    const { data, error } = await supabase
      .from('invoices')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }

    return data as InvoiceRecord;
  },

  getAll: async (): Promise<InvoiceRecord[]> => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, students(id, first_name, last_name, admission_number, email)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }

    return data || [];
  },

  getById: async (id: number): Promise<InvoiceRecord | null> => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching invoice by id:', error);
      throw error;
    }

    return data || null;
  },

  update: async (id: number, payload: Partial<InvoiceRecord>): Promise<InvoiceRecord> => {
    const { data, error } = await supabase
      .from('invoices')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }

    return data as InvoiceRecord;
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }
};
