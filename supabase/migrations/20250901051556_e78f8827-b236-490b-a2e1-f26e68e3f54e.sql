-- =====================================================
-- PART 2: DATABASE FUNCTIONS
-- =====================================================

-- Enable the pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update Updated At Column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Get User Office Location
CREATE OR REPLACE FUNCTION public.get_user_office_location(user_id_param bigint)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT office_location FROM users WHERE id = user_id_param;
$function$;

-- Update Mess Budget Remaining
CREATE OR REPLACE FUNCTION public.update_mess_budget_remaining()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Only process if hostel_id is not null
  IF NEW.hostel_id IS NOT NULL THEN
    -- Update the remaining budget by subtracting the expense amount
    UPDATE hostels
    SET mess_budget_remaining = mess_budget_remaining - NEW.amount
    WHERE id = NEW.hostel_id;
  END IF;
  RETURN NEW;
END;
$function$;

-- Apply Student Fee Customizations
CREATE OR REPLACE FUNCTION public.apply_student_fee_customizations(p_student_id integer, p_fee_structure_component_id integer, p_custom_amount numeric)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Update the fee_payments table with the custom amount
  UPDATE public.fee_payments
  SET amount_due = p_custom_amount,
      updated_at = NOW()
  WHERE student_id = p_student_id 
    AND fee_structure_component_id = p_fee_structure_component_id;
    
  -- Insert or update the customization record
  INSERT INTO public.student_fee_customizations (student_id, fee_structure_component_id, custom_amount)
  VALUES (p_student_id, p_fee_structure_component_id, p_custom_amount)
  ON CONFLICT (student_id, fee_structure_component_id)
  DO UPDATE SET 
    custom_amount = p_custom_amount,
    updated_at = NOW();
END;
$function$;

-- Update Mess Budget On Expense Update
CREATE OR REPLACE FUNCTION public.update_mess_budget_on_expense_update()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Only process if hostel_id is not null
  IF NEW.hostel_id IS NOT NULL THEN
    -- If this is an update (not an insert), adjust for the old amount
    IF TG_OP = 'UPDATE' THEN
      -- Add back the old amount and subtract the new amount
      UPDATE hostels
      SET mess_budget_remaining = mess_budget_remaining + OLD.amount - NEW.amount
      WHERE id = NEW.hostel_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Restore Mess Budget On Expense Delete
CREATE OR REPLACE FUNCTION public.restore_mess_budget_on_expense_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Only process if hostel_id is not null
  IF OLD.hostel_id IS NOT NULL THEN
    -- Add back the deleted expense amount to the budget
    UPDATE hostels
    SET mess_budget_remaining = mess_budget_remaining + OLD.amount
    WHERE id = OLD.hostel_id;
  END IF;
  RETURN OLD;
END;
$function$;

-- Update Hostel Occupancy
CREATE OR REPLACE FUNCTION public.update_hostel_occupancy()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- For INSERT operations
  IF TG_OP = 'INSERT' THEN
    -- Increment the hostel's current_occupancy
    UPDATE public.hostels
    SET current_occupancy = current_occupancy + 1
    WHERE id = NEW.hostel_id;
  
  -- For DELETE operations
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement the hostel's current_occupancy, but ensure it doesn't go below 0
    UPDATE public.hostels
    SET current_occupancy = GREATEST(current_occupancy - 1, 0)
    WHERE id = OLD.hostel_id;
  
  -- For UPDATE operations that change the hostel_id
  ELSIF TG_OP = 'UPDATE' AND OLD.hostel_id <> NEW.hostel_id THEN
    -- Decrement the old hostel's current_occupancy
    UPDATE public.hostels
    SET current_occupancy = GREATEST(current_occupancy - 1, 0)
    WHERE id = OLD.hostel_id;
    
    -- Increment the new hostel's current_occupancy
    UPDATE public.hostels
    SET current_occupancy = current_occupancy + 1
    WHERE id = NEW.hostel_id;
  END IF;
  
  RETURN NULL;
END;
$function$;

-- Recalculate All Hostel Occupancies
CREATE OR REPLACE FUNCTION public.recalculate_all_hostel_occupancies()
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Reset all occupancies to 0
  UPDATE public.hostels SET current_occupancy = 0;
  
  -- Update occupancies based on current assignments
  UPDATE public.hostels h
  SET current_occupancy = (
    SELECT COUNT(*)
    FROM public.student_hostel_assignments sha
    WHERE sha.hostel_id = h.id AND sha.status = 'Active'
  );
  
  RETURN;
END;
$function$;

-- Get Student Financial Summary
CREATE OR REPLACE FUNCTION public.get_student_financial_summary(input_student_id integer)
RETURNS TABLE(total_fees numeric, paid_amount numeric, pending_amount numeric, next_payment_amount numeric, next_payment_date date)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  total_fees_calc DECIMAL := 0;
  paid_amount_calc DECIMAL := 0;
  pending_amount_calc DECIMAL := 0;
  next_payment_amount_calc DECIMAL := 0;
  next_payment_date_calc DATE;
BEGIN
  -- Calculate total fees
  SELECT COALESCE(SUM(amount), 0) INTO total_fees_calc
  FROM student_fees
  WHERE student_id = input_student_id;
  
  -- Calculate paid amount
  SELECT COALESCE(SUM(amount), 0) INTO paid_amount_calc
  FROM student_payments
  WHERE student_id = input_student_id AND status = 'completed';
  
  -- Calculate pending amount
  pending_amount_calc := total_fees_calc - paid_amount_calc;
  
  -- Get next payment info (earliest unpaid fee)
  SELECT sf.amount, sf.due_date INTO next_payment_amount_calc, next_payment_date_calc
  FROM student_fees sf
  LEFT JOIN student_payments sp ON sf.id = sp.fee_id AND sp.status = 'completed'
  WHERE sf.student_id = input_student_id AND sp.id IS NULL
  ORDER BY sf.due_date ASC
  LIMIT 1;
  
  RETURN QUERY SELECT 
    total_fees_calc,
    paid_amount_calc,
    pending_amount_calc,
    COALESCE(next_payment_amount_calc, 0::DECIMAL),
    next_payment_date_calc;
END;
$function$;

-- Get Student Payment History
CREATE OR REPLACE FUNCTION public.get_student_payment_history(input_student_id integer)
RETURNS TABLE(id integer, description text, amount numeric, payment_date date, status text, payment_method text, receipt_url text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    COALESCE(sp.description, sf.fee_type) as description,
    sp.amount,
    sp.payment_date,
    sp.status,
    sp.payment_method,
    sp.receipt_url
  FROM student_payments sp
  LEFT JOIN student_fees sf ON sp.fee_id = sf.id
  WHERE sp.student_id = input_student_id
  ORDER BY sp.payment_date DESC;
END;
$function$;

-- Get Student Upcoming Payments
CREATE OR REPLACE FUNCTION public.get_student_upcoming_payments(input_student_id integer)
RETURNS TABLE(id integer, description text, amount numeric, due_date date, status text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    sf.id,
    sf.fee_type as description,
    sf.amount,
    sf.due_date,
    'Pending'::TEXT as status
  FROM student_fees sf
  LEFT JOIN student_payments sp ON sf.id = sp.fee_id AND sp.status = 'completed'
  WHERE sf.student_id = input_student_id AND sp.id IS NULL
  ORDER BY sf.due_date ASC;
END;
$function$;

-- Create Office User
CREATE OR REPLACE FUNCTION public.create_office_user(email_param text, password_param text, office_name_param text)
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
    
    -- Insert into users table with office role
    INSERT INTO users (email, password_hash, first_name, last_name, role, office_location, is_active)
    VALUES (email_param, password_hash_val, office_name_param, 'Office', 'office', office_name_param, true)
    RETURNING id INTO new_user_id;
    
    RETURN new_user_id;
END;
$function$;

-- Handle Approved Hostel Registration
CREATE OR REPLACE FUNCTION public.handle_approved_hostel_registration()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Only create hostel assignment when status changes to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Insert into student_hostel_assignments
    INSERT INTO student_hostel_assignments (
      student_id,
      hostel_id,
      assigned_date,
      status
    ) VALUES (
      NEW.student_id,
      NEW.hostel_id,
      CURRENT_DATE,
      'Active'
    )
    ON CONFLICT (student_id) 
    DO UPDATE SET 
      hostel_id = NEW.hostel_id,
      assigned_date = CURRENT_DATE,
      status = 'Active',
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Auto Assign Fee Structure To New Student
CREATE OR REPLACE FUNCTION public.auto_assign_fee_structure_to_new_student()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  matching_structures RECORD;
  active_session_id INTEGER;
BEGIN
  -- Get active academic session
  SELECT id INTO active_session_id 
  FROM academic_sessions 
  WHERE is_active = true 
  LIMIT 1;
  
  -- Only proceed if student has university, course and matches active session
  IF NEW.university_id IS NOT NULL AND NEW.course_id IS NOT NULL AND NEW.academic_session_id = active_session_id THEN
    
    -- Find matching fee structures for this university and course
    FOR matching_structures IN 
      SELECT id FROM fee_structures 
      WHERE university_id = NEW.university_id 
        AND course_id = NEW.course_id 
        AND is_active = true
    LOOP
      
      -- Create fee assignment if it doesn't already exist
      INSERT INTO student_fee_assignments (student_id, fee_structure_id)
      SELECT NEW.id, matching_structures.id
      WHERE NOT EXISTS (
        SELECT 1 FROM student_fee_assignments 
        WHERE student_id = NEW.id AND fee_structure_id = matching_structures.id
      );
      
      -- Create payment records for each component
      INSERT INTO fee_payments (student_id, fee_structure_component_id, amount_due, due_date)
      SELECT 
        NEW.id,
        fsc.id,
        fsc.amount,
        CASE 
          WHEN fsc.frequency = 'one-time' THEN CURRENT_DATE + INTERVAL '30 days'
          WHEN fsc.frequency = 'yearly' THEN CURRENT_DATE + INTERVAL '1 year'
          WHEN fsc.frequency = 'semester-wise' THEN CURRENT_DATE + INTERVAL '6 months'
          ELSE CURRENT_DATE + INTERVAL '30 days'
        END
      FROM fee_structure_components fsc
      WHERE fsc.fee_structure_id = matching_structures.id
        AND NOT EXISTS (
          SELECT 1 FROM fee_payments fp 
          WHERE fp.student_id = NEW.id 
            AND fp.fee_structure_component_id = fsc.id
        );
        
    END LOOP;
    
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Approve Student Application
CREATE OR REPLACE FUNCTION public.approve_student_application(application_id bigint)
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
  application_data RECORD;
BEGIN
  -- Get application data
  SELECT * INTO application_data
  FROM apply_students
  WHERE id = application_id;

  -- Insert into students table
  INSERT INTO students (
    first_name,
    last_name,
    father_name,
    mother_name,
    date_of_birth,
    phone_number,
    email,
    university_id,
    course_id,
    academic_session_id,
    status,
    city,
    country,
    address,
    aadhaar_number,
    passport_number,
    twelfth_marks,
    seat_number,
    scores,
    photo_url,
    passport_copy_url,
    aadhaar_copy_url,
    twelfth_certificate_url
  ) VALUES (
    application_data.first_name,
    application_data.last_name,
    application_data.father_name,
    application_data.mother_name,
    application_data.date_of_birth,
    application_data.phone_number,
    application_data.email,
    application_data.university_id,
    application_data.course_id,
    application_data.academic_session_id,
    'active',
    application_data.city,
    application_data.country,
    application_data.address,
    application_data.aadhaar_number,
    application_data.passport_number,
    application_data.twelfth_marks,
    application_data.seat_number,
    application_data.scores,
    application_data.photo_url,
    application_data.passport_copy_url,
    application_data.aadhaar_copy_url,
    application_data.twelfth_certificate_url
  );

  -- Delete from apply_students table
  DELETE FROM apply_students WHERE id = application_id;
END;
$function$;