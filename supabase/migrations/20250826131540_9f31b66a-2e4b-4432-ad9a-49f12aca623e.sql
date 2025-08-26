-- First, drop the overly permissive policy that allows unrestricted access
DROP POLICY IF EXISTS "Allow public access on students" ON students;

-- Update the existing country-based policy to be more clear and comprehensive
DROP POLICY IF EXISTS "Staff can only view students from their assigned country" ON students;

-- Create new comprehensive policies for different user roles

-- Policy 1: Admins can do everything (no restrictions)
CREATE POLICY "Admin full access to students" 
ON students 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token::text = current_setting('app.session_token', true)
      AND us.expires_at > now()
      AND u.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token::text = current_setting('app.session_token', true)
      AND us.expires_at > now()
      AND u.role = 'admin'
  )
);

-- Policy 2: Staff can only view/edit students from their assigned country
CREATE POLICY "Staff country-based access to students"
ON students
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token::text = current_setting('app.session_token', true)
      AND us.expires_at > now()
      AND u.role IN ('staff', 'finance', 'hostel_team')
      AND u.country_id IS NOT NULL
      AND students.country_id = u.country_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token::text = current_setting('app.session_token', true)
      AND us.expires_at > now()
      AND u.role IN ('staff', 'finance', 'hostel_team')
      AND u.country_id IS NOT NULL
      AND students.country_id = u.country_id
  )
);

-- Policy 3: Agents can view all students (for their work)
CREATE POLICY "Agent access to students"
ON students
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token::text = current_setting('app.session_token', true)
      AND us.expires_at > now()
      AND u.role = 'agent'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token::text = current_setting('app.session_token', true)
      AND us.expires_at > now()
      AND u.role = 'agent'
  )
);