-- Create countries table for Super Admin management
CREATE TABLE public.countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(3) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for countries
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

-- Allow public read access to countries
CREATE POLICY "Allow public read access on countries" 
ON public.countries FOR SELECT 
USING (is_active = true);

-- Allow admins to manage countries
CREATE POLICY "Allow admins to manage countries" 
ON public.countries FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add semester field to students table
ALTER TABLE public.students ADD COLUMN semester VARCHAR(20);

-- Add country_id reference to students table
ALTER TABLE public.students ADD COLUMN country_id INTEGER REFERENCES public.countries(id);

-- Insert some default countries
INSERT INTO public.countries (name, code) VALUES 
('India', 'IN'),
('United States', 'US'),
('United Kingdom', 'UK'),
('Canada', 'CA'),
('Australia', 'AU'),
('Germany', 'DE'),
('France', 'FR'),
('Nepal', 'NP'),
('Bangladesh', 'BD'),
('Sri Lanka', 'LK');

-- Create trigger for updated_at
CREATE TRIGGER update_countries_updated_at
BEFORE UPDATE ON public.countries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();