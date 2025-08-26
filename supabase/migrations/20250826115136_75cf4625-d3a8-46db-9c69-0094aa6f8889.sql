-- Add country_id foreign key to students table and migrate data
ALTER TABLE public.students ADD COLUMN country_id INTEGER;

-- Create foreign key constraint
ALTER TABLE public.students 
ADD CONSTRAINT fk_students_country 
FOREIGN KEY (country_id) REFERENCES public.countries(id);

-- Migrate existing country data to use foreign keys
UPDATE public.students 
SET country_id = (
  SELECT c.id 
  FROM public.countries c 
  WHERE c.name = students.country
  AND c.is_active = true
)
WHERE students.country IS NOT NULL;

-- Update RLS policy for students to enforce country-based access for staff
DROP POLICY IF EXISTS "Staff can only view students from their assigned country" ON public.students;

CREATE POLICY "Staff can only view students from their assigned country" 
ON public.students 
FOR SELECT 
USING (
  -- Admins can see all students
  (EXISTS (
    SELECT 1 FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token::text = current_setting('app.session_token', true)
    AND us.expires_at > now()
    AND u.role = 'admin'
  ))
  OR
  -- Staff can only see students from their assigned country
  (EXISTS (
    SELECT 1 FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token::text = current_setting('app.session_token', true)
    AND us.expires_at > now()
    AND u.role IN ('staff', 'finance', 'hostel_team')
    AND u.country_id IS NOT NULL
    AND students.country_id = u.country_id
  ))
  OR
  -- Agents can see all students (for now)
  (EXISTS (
    SELECT 1 FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token::text = current_setting('app.session_token', true)
    AND us.expires_at > now()
    AND u.role = 'agent'
  ))
);