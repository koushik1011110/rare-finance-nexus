-- Update user_role enum to include office-specific roles
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'office_guwahati';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'office_delhi';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'office_mumbai';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'office_bangalore';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'office_kolkata';

-- Add office_location column to users table to store which office they belong to
ALTER TABLE users ADD COLUMN IF NOT EXISTS office_location character varying;

-- Update existing office roles to have office_location set
UPDATE users 
SET office_location = CASE 
  WHEN role::text = 'office_guwahati' THEN 'Guwahati'
  WHEN role::text = 'office_delhi' THEN 'Delhi'
  WHEN role::text = 'office_mumbai' THEN 'Mumbai'
  WHEN role::text = 'office_bangalore' THEN 'Bangalore'
  WHEN role::text = 'office_kolkata' THEN 'Kolkata'
  ELSE NULL
END
WHERE role::text LIKE 'office_%';

-- Create function to get user's office location
CREATE OR REPLACE FUNCTION public.get_user_office_location(user_id_param bigint)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT office_location FROM users WHERE id = user_id_param;
$$;