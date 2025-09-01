-- =====================================================
-- PART 4: REMAINING FUNCTIONS & AUTHENTICATION
-- =====================================================

-- Authenticate User
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
$function$;

-- Logout User
CREATE OR REPLACE FUNCTION public.logout_user(token_param text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    DELETE FROM user_sessions WHERE token = token_param;
END;
$function$;

-- Cleanup Expired Sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
END;
$function$;

-- Resolve Character Issue
CREATE OR REPLACE FUNCTION public.resolve_character_issue(issue_id integer)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE public.character_issues 
  SET fine_collected = true, 
      resolved_at = now(),
      updated_at = now()
  WHERE id = issue_id;
END;
$function$;

-- Reset Staff Password
CREATE OR REPLACE FUNCTION public.reset_staff_password(staff_id_param bigint)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    new_password text;
    password_hash_val text;
BEGIN
    -- Generate new random password
    new_password := '';
    FOR i IN 1..12 LOOP
        new_password := new_password || substr('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*', floor(random() * 70 + 1)::integer, 1);
    END LOOP;
    
    -- Hash the new password
    password_hash_val := crypt(new_password, gen_salt('bf'));
    
    -- Update the user's password
    UPDATE users 
    SET password_hash = password_hash_val, updated_at = CURRENT_TIMESTAMP
    WHERE id = staff_id_param;
    
    -- Return the plain text password for display
    RETURN new_password;
END;
$function$;

-- Approve Hostel Request
CREATE OR REPLACE FUNCTION public.approve_hostel_request(p_id bigint, p_admin uuid, p_notes text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
AS $function$
declare
  v_student bigint;
  v_hostel  bigint;
begin
  select student_id, hostel_id into v_student, v_hostel
  from hostel_registrations
  where id = p_id
  for update;

  -- Resolve any other active rows for the same pair
  update hostel_registrations
  set status = 'rejected', notes = coalesce(notes,'') || ' (auto-rejected on approval)'
  where student_id = v_student
    and hostel_id = v_hostel
    and id <> p_id
    and status in ('pending','approved');

  -- Approve target row
  update hostel_registrations
  set status = 'approved',
      approved_at = now(),
      approved_by = p_admin,
      notes = coalesce(p_notes, notes)
  where id = p_id;
end;
$function$;

-- Update Application Status
CREATE OR REPLACE FUNCTION public.update_application_status(application_id integer, new_status text)
RETURNS TABLE(id integer, status text)
LANGUAGE plpgsql
AS $function$
BEGIN
  -- For approved status, move to students table
  IF new_status = 'approved' THEN
    -- Insert into students table
    INSERT INTO students (
      first_name, last_name, father_name, mother_name, date_of_birth,
      phone_number, email, university_id, course_id, academic_session_id,
      status, city, country, address, aadhaar_number, passport_number,
      twelfth_marks, seat_number, scores, photo_url, passport_copy_url,
      aadhaar_copy_url, twelfth_certificate_url, agent_id
    )
    SELECT 
      a.first_name, a.last_name, a.father_name, a.mother_name, a.date_of_birth,
      a.phone_number, a.email, a.university_id, a.course_id, a.academic_session_id,
      'active', a.city, a.country, a.address, a.aadhaar_number, a.passport_number,
      a.twelfth_marks, a.seat_number, a.scores, a.photo_url, a.passport_copy_url,
      a.aadhaar_copy_url, a.twelfth_certificate_url, a.agent_id
    FROM apply_students a WHERE a.id = application_id;
    
    -- Delete from apply_students
    DELETE FROM apply_students WHERE apply_students.id = application_id;
    
    -- Return empty result since record is moved
    RETURN;
  ELSE
    -- For other statuses, just update
    UPDATE apply_students 
    SET status = new_status, updated_at = now()
    WHERE apply_students.id = application_id;
    
    -- Return the updated record
    RETURN QUERY
    SELECT a.id, a.status 
    FROM apply_students a 
    WHERE a.id = application_id;
  END IF;
END;
$function$;

-- Generate Admission Number
CREATE OR REPLACE FUNCTION public.generate_admission_number()
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    next_number INTEGER;
    admission_num TEXT;
BEGIN
    next_number := nextval('admission_number_seq');
    admission_num := 'RE-' || LPAD(next_number::TEXT, 3, '0');
    RETURN admission_num;
END;
$function$;

-- Set Admission Number
CREATE OR REPLACE FUNCTION public.set_admission_number()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.admission_number IS NULL THEN
        NEW.admission_number := generate_admission_number();
    END IF;
    RETURN NEW;
END;
$function$;

-- Generate Receipt Number
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    next_number INTEGER;
    receipt_num TEXT;
BEGIN
    next_number := nextval('receipt_number_seq');
    receipt_num := 'REC-' || LPAD(next_number::TEXT, 5, '0');
    RETURN receipt_num;
END;
$function$;

-- Set Receipt Number
CREATE OR REPLACE FUNCTION public.set_receipt_number()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.receipt_number IS NULL THEN
        NEW.receipt_number := generate_receipt_number();
    END IF;
    RETURN NEW;
END;
$function$;

-- Assign Fee Structure To Students
CREATE OR REPLACE FUNCTION public.assign_fee_structure_to_students(structure_id integer)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  assigned_count INTEGER := 0;
  fee_structure_record RECORD;
  active_session_id INTEGER;
BEGIN
  -- Get the fee structure details
  SELECT university_id, course_id INTO fee_structure_record 
  FROM fee_structures 
  WHERE id = structure_id;
  
  -- Get active academic session
  SELECT id INTO active_session_id 
  FROM academic_sessions 
  WHERE is_active = true 
  LIMIT 1;
  
  -- Insert assignments for matching students
  INSERT INTO student_fee_assignments (student_id, fee_structure_id)
  SELECT s.id, structure_id
  FROM students s
  WHERE s.university_id = fee_structure_record.university_id 
    AND s.course_id = fee_structure_record.course_id
    AND s.academic_session_id = active_session_id
    AND s.status = 'active'
    AND NOT EXISTS (
      SELECT 1 FROM student_fee_assignments sfa 
      WHERE sfa.student_id = s.id AND sfa.fee_structure_id = structure_id
    );
  
  GET DIAGNOSTICS assigned_count = ROW_COUNT;
  
  -- Create payment records for each component
  INSERT INTO fee_payments (student_id, fee_structure_component_id, amount_due, due_date)
  SELECT 
    sfa.student_id,
    fsc.id,
    fsc.amount,
    CASE 
      WHEN fsc.frequency = 'one-time' THEN CURRENT_DATE + INTERVAL '30 days'
      WHEN fsc.frequency = 'yearly' THEN CURRENT_DATE + INTERVAL '1 year'
      WHEN fsc.frequency = 'semester-wise' THEN CURRENT_DATE + INTERVAL '6 months'
      ELSE CURRENT_DATE + INTERVAL '30 days'
    END
  FROM student_fee_assignments sfa
  JOIN fee_structure_components fsc ON fsc.fee_structure_id = sfa.fee_structure_id
  WHERE sfa.fee_structure_id = structure_id
    AND NOT EXISTS (
      SELECT 1 FROM fee_payments fp 
      WHERE fp.student_id = sfa.student_id 
        AND fp.fee_structure_component_id = fsc.id
    );
  
  RETURN assigned_count;
END;
$function$;

-- Create Student Credentials (Trigger Function)
CREATE OR REPLACE FUNCTION public.create_student_credentials()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  new_username text;
  new_password text;
  existing_count integer;
BEGIN
  -- Check if credentials already exist for this student
  SELECT COUNT(*) INTO existing_count FROM student_credentials WHERE student_id = NEW.id;
  
  -- Only create credentials if none exist
  IF existing_count = 0 THEN
    -- Generate username
    new_username := generate_username(NEW.first_name, NEW.last_name, NEW.id);
    
    -- Generate random password
    new_password := generate_random_password(10);
    
    -- Insert credentials
    INSERT INTO student_credentials (student_id, username, password)
    VALUES (NEW.id, new_username, new_password);
    
    -- Log the generated credentials
    RAISE NOTICE 'Student credentials created - Username: %, Password: %', new_username, new_password;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Verify Student Login
CREATE OR REPLACE FUNCTION public.verify_student_login(input_username text, input_password text)
RETURNS TABLE(student_id integer, username text, first_name text, last_name text, email text, admission_number text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    sc.username::text,
    s.first_name,
    s.last_name,
    s.email,
    s.admission_number
  FROM students s
  JOIN student_credentials sc ON s.id = sc.student_id
  WHERE sc.username = input_username 
    AND sc.password = input_password;
END;
$function$;

-- Trigger Set Timestamp
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

-- Create User Session
CREATE OR REPLACE FUNCTION public.create_user_session(user_id_param bigint)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    session_token text;
BEGIN
    session_token := encode(gen_random_bytes(32), 'hex');

    -- Make sure column exists (no-op if already present)
    ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS role user_role;

    INSERT INTO user_sessions (user_id, token, expires_at, role)
    VALUES (
        user_id_param,
        session_token,
        NOW() + INTERVAL '24 hours',
        (SELECT role FROM users WHERE id = user_id_param)
    );

    RETURN session_token;
END;
$function$;