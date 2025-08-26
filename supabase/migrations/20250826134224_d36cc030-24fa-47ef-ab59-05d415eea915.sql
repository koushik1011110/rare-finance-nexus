-- Update authenticate_user function to include country_id
DROP FUNCTION IF EXISTS public.authenticate_user(text, text);

CREATE OR REPLACE FUNCTION public.authenticate_user(email_param text, password_param text)
 RETURNS TABLE(user_id bigint, email text, first_name text, last_name text, role user_role, is_active boolean, office_location text, country_id integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email::text,
        u.first_name::text,
        u.last_name::text,
        u.role,
        u.is_active,
        u.office_location::text,
        u.country_id
    FROM users u
    WHERE u.email = email_param 
      AND u.password_hash = crypt(password_param, u.password_hash)
      AND u.is_active = true;
END;
$function$