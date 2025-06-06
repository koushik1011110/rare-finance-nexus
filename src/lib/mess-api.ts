
import { supabase } from "@/integrations/supabase/client";

export interface Mess {
  id: number;
  name: string;
  hostel_id?: number;
  location: string;
  capacity: number;
  monthly_rate: number;
  meal_types: string;
  operating_hours: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  facilities?: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  created_at: string;
  updated_at: string;
  hostels?: {
    name: string;
  };
}

export interface MessFormData {
  id?: number;
  name: string;
  hostel_id: string;
  location: string;
  capacity: string;
  monthly_rate: string;
  meal_types: string;
  operating_hours: string;
  contact_person: string;
  phone: string;
  email: string;
  facilities: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
}

export const messAPI = {
  getAll: async (): Promise<Mess[]> => {
    const { data, error } = await supabase
      .from('mess')
      .select('*, hostels:hostel_id (name)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching mess data:', error);
      throw error;
    }
    
    return (data || []) as Mess[];
  },

  create: async (messData: Omit<MessFormData, 'id'>): Promise<Mess> => {
    const { data, error } = await supabase
      .from('mess')
      .insert([{
        name: messData.name,
        hostel_id: messData.hostel_id ? parseInt(messData.hostel_id) : null,
        location: messData.location,
        capacity: parseInt(messData.capacity),
        monthly_rate: parseFloat(messData.monthly_rate),
        meal_types: messData.meal_types,
        operating_hours: messData.operating_hours,
        contact_person: messData.contact_person,
        phone: messData.phone,
        email: messData.email,
        facilities: messData.facilities,
        status: messData.status,
      }])
      .select('*, hostels:hostel_id (name)')
      .single();
    
    if (error) {
      console.error('Error creating mess:', error);
      throw error;
    }
    
    return data as Mess;
  },

  update: async (id: number, messData: Partial<Omit<MessFormData, 'id'>>): Promise<Mess> => {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (messData.name) updateData.name = messData.name;
    if (messData.hostel_id) updateData.hostel_id = parseInt(messData.hostel_id);
    if (messData.location) updateData.location = messData.location;
    if (messData.capacity) updateData.capacity = parseInt(messData.capacity);
    if (messData.monthly_rate) updateData.monthly_rate = parseFloat(messData.monthly_rate);
    if (messData.meal_types) updateData.meal_types = messData.meal_types;
    if (messData.operating_hours) updateData.operating_hours = messData.operating_hours;
    if (messData.contact_person) updateData.contact_person = messData.contact_person;
    if (messData.phone) updateData.phone = messData.phone;
    if (messData.email) updateData.email = messData.email;
    if (messData.facilities) updateData.facilities = messData.facilities;
    if (messData.status) updateData.status = messData.status;

    const { data, error } = await supabase
      .from('mess')
      .update(updateData)
      .eq('id', id)
      .select('*, hostels:hostel_id (name)')
      .single();
    
    if (error) {
      console.error('Error updating mess:', error);
      throw error;
    }
    
    return data as Mess;
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('mess')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting mess:', error);
      throw error;
    }
  },
};
