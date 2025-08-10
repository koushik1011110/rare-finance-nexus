-- Add 'office' role to user_role enum if it doesn't exist
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'office';

-- Create a function to create office users with proper role and office location
CREATE OR REPLACE FUNCTION public.create_office_user(
  email_param text,
  password_param text,
  office_name_param text
) RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id bigint;
    password_hash_val text;
BEGIN
    -- Hash the password
    password_hash_val := crypt(password_param, gen_salt('bf'));
    
    -- Insert into users table with office role
    INSERT INTO users (email, password_hash, first_name, last_name, role, office_location, is_active)
    VALUES (email_param, password_hash_val, office_name_param, 'Office', 'office', office_name_param, true)
    RETURNING id INTO new_user_id;
    
    RETURN new_user_id;
END;
$$;