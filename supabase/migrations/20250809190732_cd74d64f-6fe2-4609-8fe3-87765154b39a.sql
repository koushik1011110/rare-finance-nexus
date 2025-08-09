-- Drop existing functions
DROP FUNCTION IF EXISTS public.validate_session(text);
DROP FUNCTION IF EXISTS public.authenticate_user(text, text);

-- Recreate the validate_session function to include office_location
CREATE OR REPLACE FUNCTION public.validate_session(token_param text)
 RETURNS TABLE(user_id bigint, email text, first_name text, last_name text, role user_role, is_active boolean, office_location text)
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
        u.office_location::text
    FROM users u
    INNER JOIN user_sessions s ON u.id = s.user_id
    WHERE s.token = token_param 
      AND s.expires_at > NOW()
      AND u.is_active = true;
END;
$function$;

-- Recreate the authenticate_user function to include office_location
CREATE OR REPLACE FUNCTION public.authenticate_user(email_param text, password_param text)
 RETURNS TABLE(user_id bigint, email text, first_name text, last_name text, role user_role, is_active boolean, office_location text)
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
        u.office_location::text
    FROM users u
    WHERE u.email = email_param 
      AND u.password_hash = crypt(password_param, u.password_hash)
      AND u.is_active = true;
END;
$function$;