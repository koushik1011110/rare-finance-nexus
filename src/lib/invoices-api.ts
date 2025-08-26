import { supabase } from '@/integrations/supabase/client';

export interface Invoice {
  id?: number;
  invoice_number: string;
  student_id: number;
  created_by: string | null;
  status: string;
  invoice_date: string;
  due_date: string | null;
  subtotal: number;
  discount_amount: number;
  gst_amount: number;
  total_amount: number;
  items: any;
  terms: string | null;
  created_at?: string;
  updated_at?: string;
  students?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface CreateInvoiceData {
  invoice_number: string;
  student_id: number;
  created_by: string | null;
  status: 'Paid' | 'Unpaid';
  invoice_date: string;
  due_date: string | null;
  subtotal: number;
  discount_amount: number;
  gst_amount: number;
  total_amount: number;
  items: InvoiceItem[];
  terms: string | null;
}

export const invoicesAPI = {
  async getAll(): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        students (
          id,
          first_name,
          last_name,
          email,
          phone_number
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }

    return data as Invoice[] || [];
  },

  async getById(id: number): Promise<Invoice | null> {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        students (
          id,
          first_name,
          last_name,
          email,
          phone_number
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }

    return data as Invoice;
  },

  async create(invoice: CreateInvoiceData): Promise<Invoice> {
    const invoiceData = {
      ...invoice,
      items: JSON.stringify(invoice.items)
    };

    const { data, error } = await supabase
      .from('invoices')
      .insert(invoiceData)
      .select()
      .single();

    if (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }

    return data as Invoice;
  },

  async update(id: number, invoice: Partial<CreateInvoiceData>): Promise<Invoice> {
    const updateData = {
      ...invoice,
      items: invoice.items ? JSON.stringify(invoice.items) : undefined
    };

    const { data, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }

    return data as Invoice;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },
};