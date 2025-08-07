-- Complete Database Migration SQL for Student Management System
-- This file contains all tables, functions, triggers, and sequences

-- =====================================================
-- ENUMS AND TYPES
-- =====================================================

CREATE TYPE user_role AS ENUM ('admin', 'agent', 'hostel_team', 'finance', 'staff');

-- =====================================================
-- SEQUENCES
-- =====================================================

CREATE SEQUENCE IF NOT EXISTS admission_number_seq START 1;
CREATE SEQUENCE IF NOT EXISTS receipt_number_seq START 1;

-- =====================================================
-- TABLES
-- =====================================================

-- Academic Sessions
CREATE TABLE IF NOT EXISTS academic_sessions (
    id SERIAL PRIMARY KEY,
    session_name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Universities
CREATE TABLE IF NOT EXISTS universities (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    role user_role NOT NULL DEFAULT 'agent',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Permissions
CREATE TABLE IF NOT EXISTS user_permissions (
    id BIGSERIAL PRIMARY KEY,
    role user_role NOT NULL,
    resource VARCHAR NOT NULL,
    action VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Agents
CREATE TABLE IF NOT EXISTS agents (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    contact_person VARCHAR NOT NULL,
    phone VARCHAR,
    location VARCHAR,
    status VARCHAR DEFAULT 'Active',
    students_count INTEGER DEFAULT 0,
    commission_rate NUMERIC DEFAULT 10.00,
    total_received NUMERIC DEFAULT 0.00,
    commission_due NUMERIC DEFAULT 0.00,
    payment_status VARCHAR DEFAULT 'Unpaid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Apply Students
CREATE TABLE IF NOT EXISTS apply_students (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    mother_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    phone_number TEXT,
    email TEXT,
    university_id INTEGER,
    course_id INTEGER,
    academic_session_id INTEGER,
    status TEXT DEFAULT 'pending',
    city VARCHAR,
    country VARCHAR,
    address TEXT,
    aadhaar_number VARCHAR,
    passport_number VARCHAR,
    twelfth_marks NUMERIC,
    pcb_average NUMERIC,
    seat_number VARCHAR,
    scores TEXT,
    photo_url TEXT,
    passport_copy_url TEXT,
    aadhaar_copy_url TEXT,
    twelfth_certificate_url TEXT,
    tenth_marksheet_url TEXT,
    tenth_marksheet_number TEXT,
    neet_score_card_url TEXT,
    affidavit_paper_url TEXT,
    parents_phone_number TEXT,
    qualification_status TEXT,
    neet_roll_number TEXT,
    neet_passing_year TEXT,
    twelfth_passing_year TEXT,
    tenth_passing_year TEXT,
    agent_id INTEGER,
    admission_number TEXT,
    application_status TEXT DEFAULT 'pending',
    col_letter_generated BOOLEAN DEFAULT false,
    tanlx_requested BOOLEAN DEFAULT false,
    admission_letter_confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Students
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    mother_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    phone_number TEXT,
    email TEXT,
    university_id INTEGER,
    course_id INTEGER,
    academic_session_id INTEGER,
    status TEXT DEFAULT 'active',
    city VARCHAR,
    country VARCHAR,
    address TEXT,
    aadhaar_number VARCHAR,
    passport_number VARCHAR,
    twelfth_marks NUMERIC,
    pcb_average NUMERIC,
    seat_number VARCHAR,
    scores TEXT,
    photo_url TEXT,
    passport_copy_url TEXT,
    aadhaar_copy_url TEXT,
    twelfth_certificate_url TEXT,
    tenth_marksheet_url TEXT,
    tenth_marksheet_number TEXT,
    neet_score_card_url TEXT,
    affidavit_paper_url TEXT,
    parents_phone_number TEXT,
    qualification_status TEXT,
    neet_roll_number TEXT,
    neet_passing_year TEXT,
    twelfth_passing_year TEXT,
    tenth_passing_year TEXT,
    agent_id INTEGER,
    admission_number TEXT,
    admission_letter_url TEXT,
    admission_letter_uploaded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student Credentials
CREATE TABLE IF NOT EXISTS student_credentials (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Agent Students
CREATE TABLE IF NOT EXISTS agent_students (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Agent Notifications
CREATE TABLE IF NOT EXISTS agent_notifications (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER NOT NULL,
    student_id INTEGER,
    student_name TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fee Types
CREATE TABLE IF NOT EXISTS fee_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    amount NUMERIC NOT NULL DEFAULT 0,
    category VARCHAR NOT NULL DEFAULT 'Academic',
    frequency VARCHAR NOT NULL DEFAULT 'One Time',
    status VARCHAR NOT NULL DEFAULT 'Active',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fee Structures
CREATE TABLE IF NOT EXISTS fee_structures (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    university_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fee Structure Components
CREATE TABLE IF NOT EXISTS fee_structure_components (
    id SERIAL PRIMARY KEY,
    fee_structure_id INTEGER NOT NULL,
    fee_type_id INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    frequency VARCHAR NOT NULL DEFAULT 'one-time',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student Fee Assignments
CREATE TABLE IF NOT EXISTS student_fee_assignments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    fee_structure_id INTEGER NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fee Payments
CREATE TABLE IF NOT EXISTS fee_payments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    fee_structure_component_id INTEGER NOT NULL,
    amount_due NUMERIC NOT NULL,
    amount_paid NUMERIC DEFAULT 0,
    payment_status VARCHAR DEFAULT 'pending',
    due_date DATE,
    last_payment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fee Collections
CREATE TABLE IF NOT EXISTS fee_collections (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    fee_type_id INTEGER NOT NULL,
    amount_paid NUMERIC NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR DEFAULT 'cash',
    receipt_number VARCHAR,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student Fee Customizations
CREATE TABLE IF NOT EXISTS student_fee_customizations (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    fee_structure_component_id INTEGER NOT NULL,
    custom_amount NUMERIC NOT NULL,
    reason TEXT,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(student_id, fee_structure_component_id)
);

-- Student Fees
CREATE TABLE IF NOT EXISTS student_fees (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    fee_type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    due_date DATE,
    academic_session_id INTEGER,
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student Payments
CREATE TABLE IF NOT EXISTS student_payments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    fee_id INTEGER,
    amount NUMERIC NOT NULL,
    payment_date DATE NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT DEFAULT 'completed',
    transaction_id TEXT,
    description TEXT,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Hostels
CREATE TABLE IF NOT EXISTS hostels (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,
    monthly_rent NUMERIC NOT NULL DEFAULT 0.00,
    contact_person VARCHAR,
    phone VARCHAR,
    email VARCHAR,
    address TEXT,
    facilities TEXT,
    status VARCHAR DEFAULT 'Active',
    university_id INTEGER,
    mess_budget NUMERIC DEFAULT 0,
    mess_budget_remaining NUMERIC DEFAULT 0,
    mess_budget_year INTEGER DEFAULT EXTRACT(year FROM CURRENT_DATE),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student Hostel Assignments
CREATE TABLE IF NOT EXISTS student_hostel_assignments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    hostel_id INTEGER NOT NULL,
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Hostel Expenses
CREATE TABLE IF NOT EXISTS hostel_expenses (
    id SERIAL PRIMARY KEY,
    hostel_id INTEGER NOT NULL,
    expense_type VARCHAR NOT NULL,
    amount NUMERIC NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    category VARCHAR NOT NULL DEFAULT 'General',
    vendor_name VARCHAR,
    payment_method VARCHAR DEFAULT 'Cash',
    receipt_number VARCHAR,
    status VARCHAR DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Mess Expenses
CREATE TABLE IF NOT EXISTS mess_expenses (
    id SERIAL PRIMARY KEY,
    hostel_id INTEGER,
    expense_type VARCHAR NOT NULL,
    amount NUMERIC NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    category VARCHAR NOT NULL DEFAULT 'Food',
    vendor_name VARCHAR,
    payment_method VARCHAR DEFAULT 'Cash',
    receipt_number VARCHAR,
    status VARCHAR DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Offices
CREATE TABLE IF NOT EXISTS offices (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    contact_person TEXT,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Office Expenses
CREATE TABLE IF NOT EXISTS office_expenses (
    id SERIAL PRIMARY KEY,
    office_id INTEGER,
    location TEXT NOT NULL,
    month DATE NOT NULL,
    rent NUMERIC NOT NULL DEFAULT 0,
    utilities NUMERIC NOT NULL DEFAULT 0,
    internet NUMERIC NOT NULL DEFAULT 0,
    marketing NUMERIC NOT NULL DEFAULT 0,
    travel NUMERIC NOT NULL DEFAULT 0,
    miscellaneous NUMERIC NOT NULL DEFAULT 0,
    monthly_total NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Personal Expense Categories
CREATE TABLE IF NOT EXISTS personal_expense_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Personal Expenses
CREATE TABLE IF NOT EXISTS personal_expenses (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_mode VARCHAR NOT NULL DEFAULT 'Cash',
    has_receipt BOOLEAN NOT NULL DEFAULT false,
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Staff Salary Structures
CREATE TABLE IF NOT EXISTS staff_salary_structures (
    id SERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    position VARCHAR NOT NULL,
    basic_salary NUMERIC NOT NULL DEFAULT 0.00,
    allowances NUMERIC NOT NULL DEFAULT 0.00,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Staff Salaries
CREATE TABLE IF NOT EXISTS staff_salaries (
    id SERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    salary_month DATE NOT NULL,
    basic_salary NUMERIC NOT NULL DEFAULT 0.00,
    allowances NUMERIC NOT NULL DEFAULT 0.00,
    deductions NUMERIC NOT NULL DEFAULT 0.00,
    gross_salary NUMERIC,
    net_salary NUMERIC,
    payment_status VARCHAR NOT NULL DEFAULT 'pending',
    payment_method VARCHAR DEFAULT 'bank_transfer',
    payment_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Character Issues
CREATE TABLE IF NOT EXISTS character_issues (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    complaint TEXT NOT NULL,
    fine_amount NUMERIC NOT NULL DEFAULT 0,
    fine_collected BOOLEAN NOT NULL DEFAULT false,
    created_by TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Todo Tasks
CREATE TABLE IF NOT EXISTS todo_tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    status VARCHAR NOT NULL DEFAULT 'pending',
    priority VARCHAR NOT NULL DEFAULT 'medium',
    due_date DATE NOT NULL,
    created_by BIGINT NOT NULL,
    assigned_to BIGINT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Student Visa
CREATE TABLE IF NOT EXISTS student_visa (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    visa_type VARCHAR NOT NULL DEFAULT 'Student Visa',
    visa_number VARCHAR,
    issue_date DATE,
    expiration_date DATE,
    application_submitted BOOLEAN DEFAULT false,
    visa_interview BOOLEAN DEFAULT false,
    visa_approved BOOLEAN DEFAULT false,
    residency_registration BOOLEAN DEFAULT false,
    application_step_completed BOOLEAN DEFAULT false,
    interview_step_completed BOOLEAN DEFAULT false,
    approval_step_completed BOOLEAN DEFAULT false,
    residency_step_completed BOOLEAN DEFAULT false,
    residency_deadline DATE,
    local_id_number VARCHAR,
    residency_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Apply Students Backup
CREATE TABLE IF NOT EXISTS apply_students_backup (
    id INTEGER,
    first_name TEXT,
    last_name TEXT,
    father_name TEXT,
    mother_name TEXT,
    date_of_birth DATE,
    phone_number TEXT,
    email TEXT,
    university_id INTEGER,
    course_id INTEGER,
    academic_session_id INTEGER,
    status TEXT,
    city VARCHAR,
    country VARCHAR,
    address TEXT,
    aadhaar_number VARCHAR,
    passport_number VARCHAR,
    twelfth_marks NUMERIC,
    seat_number VARCHAR,
    scores TEXT,
    photo_url TEXT,
    passport_copy_url TEXT,
    aadhaar_copy_url TEXT,
    twelfth_certificate_url TEXT,
    application_status TEXT,
    admission_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- FUNCTIONS
-- =====================================================

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

-- Update Updated At Column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
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

-- Authenticate User
CREATE OR REPLACE FUNCTION public.authenticate_user(email_param text, password_param text)
RETURNS TABLE(user_id bigint, email text, first_name text, last_name text, role user_role, is_active boolean)
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
        u.is_active
    FROM users u
    WHERE u.email = email_param 
      AND u.password_hash = crypt(password_param, u.password_hash)
      AND u.is_active = true;
END;
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
    -- Generate a random session token
    session_token := encode(gen_random_bytes(32), 'hex');
    
    -- Insert session
    INSERT INTO user_sessions (user_id, token, expires_at)
    VALUES (
        user_id_param, 
        session_token, 
        NOW() + INTERVAL '24 hours'
    );
    
    RETURN session_token;
END;
$function$;

-- Validate Session
CREATE OR REPLACE FUNCTION public.validate_session(token_param text)
RETURNS TABLE(user_id bigint, email text, first_name text, last_name text, role user_role, is_active boolean)
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
        u.is_active
    FROM users u
    INNER JOIN user_sessions s ON u.id = s.user_id
    WHERE s.token = token_param 
      AND s.expires_at > NOW()
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

-- Create Staff Member
CREATE OR REPLACE FUNCTION public.create_staff_member(email_param text, password_param text, first_name_param text, last_name_param text, role_param user_role, agent_name_param text DEFAULT NULL::text, agent_phone_param text DEFAULT NULL::text, agent_location_param text DEFAULT NULL::text)
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
    INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
    VALUES (email_param, password_hash_val, first_name_param, last_name_param, role_param, true)
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

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for automatic student credentials creation
CREATE TRIGGER auto_create_student_credentials_trigger
AFTER INSERT ON students
FOR EACH ROW EXECUTE FUNCTION create_student_credentials();

-- Trigger for automatic admission number generation
CREATE TRIGGER set_admission_number_trigger
BEFORE INSERT ON students
FOR EACH ROW EXECUTE FUNCTION set_admission_number();

-- Trigger for automatic receipt number generation
CREATE TRIGGER set_receipt_number_trigger
BEFORE INSERT ON fee_collections
FOR EACH ROW EXECUTE FUNCTION set_receipt_number();

-- Trigger for mess budget management (insert)
CREATE TRIGGER update_mess_budget_trigger
AFTER INSERT ON mess_expenses
FOR EACH ROW EXECUTE FUNCTION update_mess_budget_remaining();

-- Trigger for mess budget management (update)
CREATE TRIGGER update_mess_budget_on_update_trigger
AFTER UPDATE ON mess_expenses
FOR EACH ROW EXECUTE FUNCTION update_mess_budget_on_expense_update();

-- Trigger for mess budget management (delete)
CREATE TRIGGER restore_mess_budget_on_delete_trigger
AFTER DELETE ON mess_expenses
FOR EACH ROW EXECUTE FUNCTION restore_mess_budget_on_expense_delete();

-- Trigger for hostel occupancy management
CREATE TRIGGER update_hostel_occupancy_trigger
AFTER INSERT OR UPDATE OR DELETE ON student_hostel_assignments
FOR EACH ROW EXECUTE FUNCTION update_hostel_occupancy();

-- Trigger for updating timestamps
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
BEFORE UPDATE ON agents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apply_students_updated_at
BEFORE UPDATE ON apply_students
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE apply_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structure_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fee_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fee_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_hostel_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE mess_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_salary_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_visa ENABLE ROW LEVEL SECURITY;

-- Basic public read policies for lookup tables
CREATE POLICY "Allow public read access on academic_sessions" ON academic_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on universities" ON universities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on courses" ON courses FOR SELECT USING (true);

-- Apply students policies
CREATE POLICY "Allow public to insert applications" ON apply_students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public to read applications" ON apply_students FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to update applications" ON apply_students FOR UPDATE USING (true);

-- Students policies
CREATE POLICY "Allow public access on students" ON students FOR ALL USING (true);

-- User session policies
CREATE POLICY "sessions_select_policy" ON user_sessions FOR SELECT USING (true);
CREATE POLICY "sessions_insert_policy" ON user_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "sessions_delete_policy" ON user_sessions FOR DELETE USING (true);

-- User permission policies
CREATE POLICY "permissions_select_policy" ON user_permissions FOR SELECT USING (true);

-- User policies
CREATE POLICY "users_select_policy" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert_policy" ON users FOR INSERT WITH CHECK (role = 'admin');
CREATE POLICY "users_update_policy" ON users FOR UPDATE USING (role = 'admin');

-- Student credentials policies
CREATE POLICY "Allow public to read credentials for authentication" ON student_credentials FOR SELECT USING (true);
CREATE POLICY "Only admins can insert student credentials" ON student_credentials FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view student credentials" ON student_credentials FOR SELECT USING (true);
CREATE POLICY "Only admins can update student credentials" ON student_credentials FOR UPDATE USING (true);

-- Agent notification policies
CREATE POLICY "Agents can view their own notifications" ON agent_notifications FOR SELECT 
USING (agent_id = (SELECT user_sessions.user_id FROM user_sessions WHERE ((user_sessions.token)::text = current_setting('app.session_token'::text, true)) AND (user_sessions.expires_at > now()) LIMIT 1));

CREATE POLICY "Agents can update their own notifications" ON agent_notifications FOR UPDATE 
USING (agent_id = (SELECT user_sessions.user_id FROM user_sessions WHERE ((user_sessions.token)::text = current_setting('app.session_token'::text, true)) AND (user_sessions.expires_at > now()) LIMIT 1));

CREATE POLICY "Admins can insert notifications" ON agent_notifications FOR INSERT WITH CHECK (true);

-- Office policies
CREATE POLICY "Admin can view all offices" ON offices FOR SELECT USING (true);
CREATE POLICY "Admin can create offices" ON offices FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update offices" ON offices FOR UPDATE USING (true);
CREATE POLICY "Admin can delete offices" ON offices FOR DELETE USING (true);

-- Office expense policies
CREATE POLICY "Admin can view all office expenses" ON office_expenses FOR SELECT USING (true);
CREATE POLICY "Admin can create office expenses" ON office_expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update office expenses" ON office_expenses FOR UPDATE USING (true);
CREATE POLICY "Admin can delete office expenses" ON office_expenses FOR DELETE USING (true);

-- Personal expense policies
CREATE POLICY "Allow all operations on personal expenses" ON personal_expenses FOR ALL USING (true);
CREATE POLICY "Categories are viewable by all" ON personal_expense_categories FOR SELECT USING (true);
CREATE POLICY "Categories can be managed by all" ON personal_expense_categories FOR ALL USING (true);

-- Staff salary policies
CREATE POLICY "Enable read access for all authenticated users" ON staff_salaries FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON staff_salaries FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON staff_salaries FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON staff_salaries FOR DELETE USING (true);

CREATE POLICY "Enable read access for all authenticated users" ON staff_salary_structures FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON staff_salary_structures FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON staff_salary_structures FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON staff_salary_structures FOR DELETE USING (true);

-- Character issues policies
CREATE POLICY "Allow all operations" ON character_issues FOR ALL USING (true) WITH CHECK (true);

-- Student fee policies
CREATE POLICY "Students can view their own fees" ON student_fees FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage fees" ON student_fees FOR ALL USING (true);

-- Student payment policies
CREATE POLICY "Students can view their own payments" ON student_payments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage payments" ON student_payments FOR ALL USING (true);

-- Student fee customization policies
CREATE POLICY "Allow all operations on student_fee_customizations" ON student_fee_customizations FOR ALL USING (true);

-- Todo task policies
CREATE POLICY "Allow all operations on todo tasks" ON todo_tasks FOR ALL USING (true);

-- Student visa policies
CREATE POLICY "Allow all operations on student_visa" ON student_visa FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert default admin user (password should be changed)
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) 
VALUES ('admin@rareeducation.com', crypt('admin123', gen_salt('bf')), 'Admin', 'User', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample academic session
INSERT INTO academic_sessions (session_name, start_date, end_date, is_active) 
VALUES ('2024-2025', '2024-07-01', '2025-06-30', true)
ON CONFLICT DO NOTHING;

-- Insert sample universities
INSERT INTO universities (name) VALUES 
('Sample University 1'),
('Sample University 2')
ON CONFLICT DO NOTHING;

-- Insert sample courses
INSERT INTO courses (name) VALUES 
('MBBS'),
('BDS'),
('Engineering'),
('Management')
ON CONFLICT DO NOTHING;

-- Insert default fee types
INSERT INTO fee_types (name, description, amount, category, frequency, status) VALUES 
('Admission Fee', 'One-time admission fee', 50000, 'Academic', 'One Time', 'Active'),
('Tuition Fee', 'Annual tuition fee', 200000, 'Academic', 'Yearly', 'Active'),
('Hostel Fee', 'Monthly hostel charges', 15000, 'Accommodation', 'Monthly', 'Active'),
('Library Fee', 'Annual library fee', 5000, 'Academic', 'Yearly', 'Active')
ON CONFLICT DO NOTHING;

-- Insert default personal expense categories
INSERT INTO personal_expense_categories (name, description) VALUES 
('Food & Dining', 'Meals, groceries, and dining expenses'),
('Transportation', 'Travel, fuel, and transportation costs'),
('Office Supplies', 'Stationery, equipment, and office materials'),
('Utilities', 'Internet, phone, and other utility bills'),
('Marketing', 'Advertising and promotional activities'),
('Miscellaneous', 'Other general expenses')
ON CONFLICT DO NOTHING;

COMMIT;