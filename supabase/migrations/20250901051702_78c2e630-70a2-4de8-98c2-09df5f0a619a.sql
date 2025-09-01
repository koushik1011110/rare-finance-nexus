-- =====================================================
-- PART 3: ADDITIONAL FUNCTIONS
-- =====================================================

-- Move Approved Application
CREATE OR REPLACE FUNCTION public.move_approved_application()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Insert into students table
    INSERT INTO students (
      first_name, last_name, father_name, mother_name, date_of_birth,
      phone_number, email, university_id, course_id, academic_session_id,
      status, city, country, address, aadhaar_number, passport_number,
      twelfth_marks, seat_number, scores, photo_url, passport_copy_url,
      aadhaar_copy_url, twelfth_certificate_url
    ) VALUES (
      NEW.first_name, NEW.last_name, NEW.father_name, NEW.mother_name, NEW.date_of_birth,
      NEW.phone_number, NEW.email, NEW.university_id, NEW.course_id, NEW.academic_session_id,
      'active', NEW.city, NEW.country, NEW.address, NEW.aadhaar_number, NEW.passport_number,
      NEW.twelfth_marks, NEW.seat_number, NEW.scores, NEW.photo_url, NEW.passport_copy_url,
      NEW.aadhaar_copy_url, NEW.twelfth_certificate_url
    );
    
    -- Delete from apply_students table
    DELETE FROM apply_students WHERE id = NEW.id;
    
    -- Return NULL to prevent the update (since we deleted the row)
    RETURN NULL;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create Staff Member
CREATE OR REPLACE FUNCTION public.create_staff_member(email_param text, password_param text, first_name_param text, last_name_param text, role_param user_role, agent_name_param text DEFAULT NULL::text, agent_phone_param text DEFAULT NULL::text, agent_location_param text DEFAULT NULL::text, country_id_param integer DEFAULT NULL::integer)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$;

-- Assign Country to Staff
CREATE OR REPLACE FUNCTION public.assign_country_to_staff(staff_id_param bigint, country_id_param integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    UPDATE users 
    SET country_id = country_id_param, updated_at = CURRENT_TIMESTAMP
    WHERE id = staff_id_param;
END;
$function$;

-- Generate Student Username
CREATE OR REPLACE FUNCTION public.generate_student_username(student_id_param integer)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    base_username TEXT;
    final_username TEXT;
    counter INTEGER := 1;
    student_record RECORD;
BEGIN
    -- Get student details
    SELECT first_name, last_name, admission_number INTO student_record
    FROM students 
    WHERE id = student_id_param;
    
    -- Create base username from first name + last name (first 3 chars each) + last 4 chars of admission number
    base_username := LOWER(
        SUBSTRING(student_record.first_name FROM 1 FOR 3) || 
        SUBSTRING(student_record.last_name FROM 1 FOR 3) ||
        COALESCE(RIGHT(student_record.admission_number, 4), LPAD(student_id_param::TEXT, 4, '0'))
    );
    
    -- Remove any non-alphanumeric characters
    base_username := REGEXP_REPLACE(base_username, '[^a-z0-9]', '', 'g');
    
    final_username := base_username;
    
    -- Check if username exists and increment if needed
    WHILE EXISTS (SELECT 1 FROM student_credentials WHERE username = final_username) LOOP
        final_username := base_username || counter::TEXT;
        counter := counter + 1;
    END LOOP;
    
    RETURN final_username;
END;
$function$;

-- Generate Student Password
CREATE OR REPLACE FUNCTION public.generate_student_password()
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    password TEXT := '';
    i INTEGER;
BEGIN
    -- Generate 8 character password
    FOR i IN 1..8 LOOP
        password := password || SUBSTRING(chars FROM (FLOOR(RANDOM() * LENGTH(chars)) + 1)::INTEGER FOR 1);
    END LOOP;
    
    RETURN password;
END;
$function$;

-- Create Student Credentials (Function)
CREATE OR REPLACE FUNCTION public.create_student_credentials(student_id_param integer)
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
    new_username TEXT;
    new_password TEXT;
BEGIN
    -- Generate username and password
    new_username := generate_student_username(student_id_param);
    new_password := generate_student_password();
    
    -- Insert credentials
    INSERT INTO student_credentials (student_id, username, password)
    VALUES (student_id_param, new_username, new_password);
END;
$function$;

-- Auto Create Student Credentials
CREATE OR REPLACE FUNCTION public.auto_create_student_credentials()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Create credentials for the new student
    PERFORM create_student_credentials(NEW.id);
    RETURN NEW;
END;
$function$;

-- Get Agent Profile
CREATE OR REPLACE FUNCTION public.get_agent_profile(agent_id_param bigint)
RETURNS TABLE(id bigint, name text, email text, phone text, location text, status text, total_students bigint, total_receivable numeric, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    COALESCE(a.name, u.first_name || ' ' || u.last_name) as name,
    u.email,
    COALESCE(a.phone, 'Not provided') as phone,
    COALESCE(a.location, 'Not provided') as location,
    COALESCE(a.status, 'Active') as status,
    COUNT(s.id)::bigint as total_students,
    COALESCE(SUM(f.amount - COALESCE(f.paid_amount, 0)), 0) as total_receivable,
    u.created_at
  FROM 
    users u
    LEFT JOIN agents a ON u.id = a.user_id
    LEFT JOIN students s ON s.agent_id = a.id
    LEFT JOIN fees f ON f.student_id = s.id
  WHERE 
    u.id = agent_id_param
    AND u.role = 'agent'
  GROUP BY 
    a.id, u.id, u.email, u.first_name, u.last_name, u.created_at;
END;
$function$;

-- Generate Random Password
CREATE OR REPLACE FUNCTION public.generate_random_password(length integer DEFAULT 8)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$function$;

-- Generate Username
CREATE OR REPLACE FUNCTION public.generate_username(first_name text, last_name text, student_id integer)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  base_username text;
  final_username text;
  counter integer := 1;
BEGIN
  -- Create base username from first name + last name + student ID
  base_username := lower(
    regexp_replace(
      concat(
        substr(first_name, 1, 3),
        substr(last_name, 1, 3),
        student_id::text
      ),
      '[^a-zA-Z0-9]', '', 'g'
    )
  );
  
  final_username := base_username;
  
  -- Check if username exists and increment if needed
  WHILE EXISTS (SELECT 1 FROM student_credentials WHERE username = final_username) LOOP
    final_username := base_username || counter::text;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_username;
END;
$function$;

-- Change Password
CREATE OR REPLACE FUNCTION public.change_password(current_password text, new_password text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  user_record RECORD;
  user_id_var BIGINT;
  hashed_password TEXT;
BEGIN
  -- Get the current user's ID from the session
  SELECT user_id INTO user_id_var 
  FROM user_sessions 
  WHERE token = current_setting('app.session_token', true) 
  AND expires_at > NOW() 
  LIMIT 1;
  
  IF user_id_var IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- Get the user's current password hash
  SELECT id, password_hash INTO user_record
  FROM users
  WHERE id = user_id_var;
  
  IF user_record.id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Verify current password
  IF user_record.password_hash != crypt(current_password, user_record.password_hash) THEN
    RAISE EXCEPTION 'Current password is incorrect';
  END IF;
  
  -- Update to new password
  hashed_password := crypt(new_password, gen_salt('bf'));
  
  UPDATE users
  SET password_hash = hashed_password,
      updated_at = NOW()
  WHERE id = user_id_var;
  
  -- Invalidate all sessions except the current one
  DELETE FROM user_sessions
  WHERE user_id = user_id_var
  AND token != current_setting('app.session_token', true);
  
  RETURN;
END;
$function$;

-- Validate Session
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
$function$;