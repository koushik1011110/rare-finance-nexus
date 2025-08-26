-- Update validate_session function to include country_id
CREATE OR REPLACE FUNCTION public.validate_session(token_param text)
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
    INNER JOIN user_sessions s ON u.id = s.user_id
    WHERE s.token = token_param 
      AND s.expires_at > NOW()
      AND u.is_active = true;
END;
$function$