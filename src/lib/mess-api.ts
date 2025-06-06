
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
      .from('hostels')
      .select('*, hostels:id (name)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching mess data:', error);
      throw error;
    }
    
    // Convert hostel data to mess format
    const messData: Mess[] = (data || []).map(hostel => ({
      id: hostel.id,
      name: `${hostel.name} Mess`,
      hostel_id: hostel.id,
      location: hostel.location || '',
      capacity: hostel.capacity || 0,
      monthly_rate: hostel.monthly_rent || 0,
      meal_types: 'Breakfast, Lunch, Dinner',
      operating_hours: '6:00 AM - 9:00 PM',
      contact_person: hostel.contact_person || '',
      phone: hostel.phone || '',
      email: hostel.email || '',
      facilities: hostel.facilities || '',
      status: hostel.status as 'Active' | 'Inactive' | 'Maintenance',
      created_at: hostel.created_at || new Date().toISOString(),
      updated_at: hostel.updated_at || new Date().toISOString(),
      hostels: {
        name: hostel.name
      }
    }));
    
    return messData;
  },

  create: async (messData: Omit<MessFormData, 'id'>): Promise<Mess> => {
    // For now, creating a mess means updating a hostel with mess-specific information
    const { data, error } = await supabase
      .from('hostels')
      .insert([{
        name: messData.name,
        location: messData.location,
        capacity: parseInt(messData.capacity),
        monthly_rent: parseFloat(messData.monthly_rate),
        contact_person: messData.contact_person,
        phone: messData.phone,
        email: messData.email,
        facilities: messData.facilities,
        status: messData.status,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating mess:', error);
      throw error;
    }
    
    // Convert to mess format
    const mess: Mess = {
      id: data.id,
      name: data.name,
      hostel_id: data.id,
      location: data.location || '',
      capacity: data.capacity || 0,
      monthly_rate: data.monthly_rent || 0,
      meal_types: messData.meal_types,
      operating_hours: messData.operating_hours,
      contact_person: data.contact_person || '',
      phone: data.phone || '',
      email: data.email || '',
      facilities: data.facilities || '',
      status: data.status as 'Active' | 'Inactive' | 'Maintenance',
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
      hostels: {
        name: data.name
      }
    };
    
    return mess;
  },

  update: async (id: number, messData: Partial<Omit<MessFormData, 'id'>>): Promise<Mess> => {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (messData.name) updateData.name = messData.name;
    if (messData.location) updateData.location = messData.location;
    if (messData.capacity) updateData.capacity = parseInt(messData.capacity);
    if (messData.monthly_rate) updateData.monthly_rent = parseFloat(messData.monthly_rate);
    if (messData.contact_person) updateData.contact_person = messData.contact_person;
    if (messData.phone) updateData.phone = messData.phone;
    if (messData.email) updateData.email = messData.email;
    if (messData.facilities) updateData.facilities = messData.facilities;
    if (messData.status) updateData.status = messData.status;

    const { data, error } = await supabase
      .from('hostels')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating mess:', error);
      throw error;
    }
    
    // Convert to mess format
    const mess: Mess = {
      id: data.id,
      name: data.name,
      hostel_id: data.id,
      location: data.location || '',
      capacity: data.capacity || 0,
      monthly_rate: data.monthly_rent || 0,
      meal_types: messData.meal_types || 'Breakfast, Lunch, Dinner',
      operating_hours: messData.operating_hours || '6:00 AM - 9:00 PM',
      contact_person: data.contact_person || '',
      phone: data.phone || '',
      email: data.email || '',
      facilities: data.facilities || '',
      status: data.status as 'Active' | 'Inactive' | 'Maintenance',
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
      hostels: {
        name: data.name
      }
    };
    
    return mess;
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('hostels')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting mess:', error);
      throw error;
    }
  },
};
