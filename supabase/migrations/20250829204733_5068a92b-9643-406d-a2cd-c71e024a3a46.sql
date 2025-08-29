-- =====================================================
-- COMPLETE DATABASE SCHEMA MIGRATION FOR STUDENT MANAGEMENT SYSTEM
-- Part 1: Core Schema (Enums, Sequences, Tables)
-- =====================================================

-- Create enums
CREATE TYPE user_role AS ENUM ('admin', 'agent', 'hostel_team', 'finance', 'staff', 'office');
CREATE TYPE hostel_registration_status AS ENUM ('pending', 'approved', 'rejected');

-- Create sequences
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

-- Countries
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    code VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    role user_role NOT NULL DEFAULT 'agent',
    office_location TEXT,
    country_id INTEGER REFERENCES countries(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR NOT NULL,
    role user_role,
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
    university_id INTEGER REFERENCES universities(id),
    course_id INTEGER REFERENCES courses(id),
    academic_session_id INTEGER REFERENCES academic_sessions(id),
    status TEXT DEFAULT 'pending',
    city VARCHAR,
    country VARCHAR,
    country_id INTEGER REFERENCES countries(id),
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
    agent_id INTEGER REFERENCES agents(id),
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
    university_id INTEGER REFERENCES universities(id),
    course_id INTEGER REFERENCES courses(id),
    academic_session_id INTEGER REFERENCES academic_sessions(id),
    status TEXT DEFAULT 'active',
    city VARCHAR,
    country VARCHAR,
    country_id INTEGER REFERENCES countries(id),
    address TEXT,
    aadhaar_number VARCHAR,
    passport_number VARCHAR,
    twelfth_marks NUMERIC,
    pcb_average NUMERIC,
    semester VARCHAR,
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
    agent_id INTEGER REFERENCES agents(id),
    admission_number TEXT,
    admission_letter_url TEXT,
    admission_letter_uploaded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student Credentials
CREATE TABLE IF NOT EXISTS student_credentials (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Agent Students
CREATE TABLE IF NOT EXISTS agent_students (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER NOT NULL REFERENCES agents(id),
    student_id INTEGER NOT NULL REFERENCES students(id),
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
    university_id INTEGER NOT NULL REFERENCES universities(id),
    course_id INTEGER NOT NULL REFERENCES courses(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fee Structure Components
CREATE TABLE IF NOT EXISTS fee_structure_components (
    id SERIAL PRIMARY KEY,
    fee_structure_id INTEGER NOT NULL REFERENCES fee_structures(id),
    fee_type_id INTEGER NOT NULL REFERENCES fee_types(id),
    amount NUMERIC NOT NULL,
    frequency VARCHAR NOT NULL DEFAULT 'one-time',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student Fee Assignments
CREATE TABLE IF NOT EXISTS student_fee_assignments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    fee_structure_id INTEGER NOT NULL REFERENCES fee_structures(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(student_id, fee_structure_id)
);

-- Fee Payments
CREATE TABLE IF NOT EXISTS fee_payments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    fee_structure_component_id INTEGER NOT NULL REFERENCES fee_structure_components(id),
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
    student_id INTEGER NOT NULL REFERENCES students(id),
    fee_type_id INTEGER NOT NULL REFERENCES fee_types(id),
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
    student_id INTEGER NOT NULL REFERENCES students(id),
    fee_structure_component_id INTEGER NOT NULL REFERENCES fee_structure_components(id),
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
    student_id INTEGER NOT NULL REFERENCES students(id),
    fee_type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    due_date DATE,
    academic_session_id INTEGER REFERENCES academic_sessions(id),
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student Payments
CREATE TABLE IF NOT EXISTS student_payments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    fee_id INTEGER REFERENCES student_fees(id),
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
    capacity INTEGER NOT NULL DEFAULT 0,
    current_occupancy INTEGER DEFAULT 0,
    monthly_rent NUMERIC NOT NULL DEFAULT 0.00,
    contact_person VARCHAR,
    phone VARCHAR,
    email VARCHAR,
    address TEXT,
    facilities TEXT,
    status VARCHAR DEFAULT 'Active',
    university_id INTEGER REFERENCES universities(id),
    mess_budget NUMERIC DEFAULT 0,
    mess_budget_remaining NUMERIC DEFAULT 0,
    mess_budget_year INTEGER DEFAULT EXTRACT(year FROM CURRENT_DATE),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student Hostel Assignments
CREATE TABLE IF NOT EXISTS student_hostel_assignments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    hostel_id INTEGER NOT NULL REFERENCES hostels(id),
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(student_id)
);

-- Hostel Registrations
CREATE TABLE IF NOT EXISTS hostel_registrations (
    id BIGSERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    hostel_id INTEGER NOT NULL REFERENCES hostels(id),
    status hostel_registration_status NOT NULL DEFAULT 'pending',
    requested_by TEXT NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Hostel Expenses
CREATE TABLE IF NOT EXISTS hostel_expenses (
    id SERIAL PRIMARY KEY,
    hostel_id INTEGER NOT NULL REFERENCES hostels(id),
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
    hostel_id INTEGER REFERENCES hostels(id),
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
    password TEXT,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Office Expenses
CREATE TABLE IF NOT EXISTS office_expenses (
    id SERIAL PRIMARY KEY,
    office_id INTEGER REFERENCES offices(id),
    location TEXT NOT NULL,
    month DATE NOT NULL,
    expense_date DATE DEFAULT CURRENT_DATE,
    expense_category VARCHAR DEFAULT 'general',
    amount NUMERIC DEFAULT 0,
    rent NUMERIC NOT NULL DEFAULT 0,
    utilities NUMERIC NOT NULL DEFAULT 0,
    internet NUMERIC NOT NULL DEFAULT 0,
    marketing NUMERIC NOT NULL DEFAULT 0,
    travel NUMERIC NOT NULL DEFAULT 0,
    miscellaneous NUMERIC NOT NULL DEFAULT 0,
    monthly_total NUMERIC NOT NULL DEFAULT 0,
    notes TEXT,
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
    category_id INTEGER NOT NULL REFERENCES personal_expense_categories(id),
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
    student_id INTEGER NOT NULL REFERENCES students(id),
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
    student_id INTEGER NOT NULL REFERENCES students(id),
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

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id BIGINT PRIMARY KEY,
    invoice_number TEXT NOT NULL,
    student_id BIGINT REFERENCES students(id),
    invoice_date DATE,
    due_date DATE,
    subtotal NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    gst_amount NUMERIC DEFAULT 0,
    total_amount NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Unpaid',
    items JSONB,
    terms TEXT,
    notes TEXT,
    created_by TEXT,
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