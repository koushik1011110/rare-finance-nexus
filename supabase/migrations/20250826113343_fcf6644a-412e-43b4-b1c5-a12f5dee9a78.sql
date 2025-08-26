-- Add country_id to users table for staff country assignment
ALTER TABLE users ADD COLUMN country_id INTEGER REFERENCES countries(id);

-- Create RLS policy for students based on staff's assigned country
CREATE POLICY "Staff can only view students from their assigned country"
ON students FOR SELECT
USING (
  -- Admin can see all students
  EXISTS (
    SELECT 1 FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token = current_setting('app.session_token', true)
    AND us.expires_at > now()
    AND u.role = 'admin'
  )
  OR
  -- Staff can only see students from their assigned country
  EXISTS (
    SELECT 1 FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token = current_setting('app.session_token', true)
    AND us.expires_at > now()
    AND u.role IN ('staff', 'finance', 'hostel_team')
    AND u.country_id IS NOT NULL
    AND students.country_id = u.country_id
  )
  OR
  -- Agents can see all students (existing behavior)
  EXISTS (
    SELECT 1 FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token = current_setting('app.session_token', true)
    AND us.expires_at > now()
    AND u.role = 'agent'
  )
);

-- Create similar policy for apply_students
CREATE POLICY "Staff can only view applicants from their assigned country"
ON apply_students FOR SELECT
USING (
  -- Admin can see all applicants
  EXISTS (
    SELECT 1 FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token = current_setting('app.session_token', true)
    AND us.expires_at > now()
    AND u.role = 'admin'
  )
  OR
  -- Staff can only see applicants from their assigned country
  EXISTS (
    SELECT 1 FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token = current_setting('app.session_token', true)
    AND us.expires_at > now()
    AND u.role IN ('staff', 'finance', 'hostel_team')
    AND u.country_id IS NOT NULL
    AND apply_students.country_id = u.country_id
  )
  OR
  -- Agents can see all applicants (existing behavior)
  EXISTS (
    SELECT 1 FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token = current_setting('app.session_token', true)
    AND us.expires_at > now()
    AND u.role = 'agent'
  )
);

-- Update the create_staff_member function to include country assignment
CREATE OR REPLACE FUNCTION create_staff_member(
  email_param text, 
  password_param text, 
  first_name_param text, 
  last_name_param text, 
  role_param user_role, 
  agent_name_param text DEFAULT NULL,
  agent_phone_param text DEFAULT NULL,
  agent_location_param text DEFAULT NULL,
  country_id_param integer DEFAULT NULL
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id bigint;
    password_hash_val text;
BEGIN
    -- Hash the password
    password_hash_val := crypt(password_param, gen_salt('bf'));
    
    -- Insert into users table
    INSERT INTO users (email, password_hash, first_name, last_name, role, country_id, is_active)
    VALUES (email_param, password_hash_val, first_name_param, last_name_param, role_param, country_id_param, true)
    RETURNING id INTO new_user_id;
    
    -- If role is agent, also add to agents table
    IF role_param = 'agent' THEN
        INSERT INTO agents (name, email, contact_person, phone, location, status)
        VALUES (
            COALESCE(agent_name_param, first_name_param || ' ' || last_name_param),
            email_param,
            first_name_param || ' ' || last_name_param,
            agent_phone_param,
            agent_location_param,
            'Active'
        );
    END IF;
    
    RETURN new_user_id;
END;
$$;

-- Create function to assign country to staff
CREATE OR REPLACE FUNCTION assign_country_to_staff(
  staff_id_param bigint,
  country_id_param integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE users 
    SET country_id = country_id_param, updated_at = CURRENT_TIMESTAMP
    WHERE id = staff_id_param;
END;
$$;