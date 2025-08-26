import { supabase } from "@/integrations/supabase/client";

export interface Country {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchCountries = async (): Promise<Country[]> => {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }

  return data || [];
};

export const fetchAllCountries = async (): Promise<Country[]> => {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching all countries:', error);
    throw error;
  }

  return data || [];
};

export const createCountry = async (country: { name: string; code: string }): Promise<Country> => {
  const { data, error } = await supabase
    .from('countries')
    .insert([country])
    .select()
    .single();

  if (error) {
    console.error('Error creating country:', error);
    throw error;
  }

  return data;
};

export const updateCountry = async (id: number, updates: Partial<Country>): Promise<Country> => {
  const { data, error } = await supabase
    .from('countries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating country:', error);
    throw error;
  }

  return data;
};

export const deleteCountry = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('countries')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deleting country:', error);
    throw error;
  }
};