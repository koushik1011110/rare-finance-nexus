-- =====================================================
-- PART 5: TRIGGERS AND RLS SETUP
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE hostel_registrations ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create triggers for automatic student credentials creation
DROP TRIGGER IF EXISTS auto_create_student_credentials_trigger ON students;
CREATE TRIGGER auto_create_student_credentials_trigger
AFTER INSERT ON students
FOR EACH ROW EXECUTE FUNCTION create_student_credentials();

-- Create triggers for automatic admission number generation
DROP TRIGGER IF EXISTS set_admission_number_trigger ON students;
CREATE TRIGGER set_admission_number_trigger
BEFORE INSERT ON students
FOR EACH ROW EXECUTE FUNCTION set_admission_number();

-- Create triggers for automatic receipt number generation
DROP TRIGGER IF EXISTS set_receipt_number_trigger ON fee_collections;
CREATE TRIGGER set_receipt_number_trigger
BEFORE INSERT ON fee_collections
FOR EACH ROW EXECUTE FUNCTION set_receipt_number();

-- Create triggers for mess budget management (insert)
DROP TRIGGER IF EXISTS update_mess_budget_trigger ON mess_expenses;
CREATE TRIGGER update_mess_budget_trigger
AFTER INSERT ON mess_expenses
FOR EACH ROW EXECUTE FUNCTION update_mess_budget_remaining();

-- Create triggers for mess budget management (update)
DROP TRIGGER IF EXISTS update_mess_budget_on_update_trigger ON mess_expenses;
CREATE TRIGGER update_mess_budget_on_update_trigger
AFTER UPDATE ON mess_expenses
FOR EACH ROW EXECUTE FUNCTION update_mess_budget_on_expense_update();

-- Create triggers for mess budget management (delete)
DROP TRIGGER IF EXISTS restore_mess_budget_on_delete_trigger ON mess_expenses;
CREATE TRIGGER restore_mess_budget_on_delete_trigger
AFTER DELETE ON mess_expenses
FOR EACH ROW EXECUTE FUNCTION restore_mess_budget_on_expense_delete();

-- Create triggers for hostel occupancy management
DROP TRIGGER IF EXISTS update_hostel_occupancy_trigger ON student_hostel_assignments;
CREATE TRIGGER update_hostel_occupancy_trigger
AFTER INSERT OR UPDATE OR DELETE ON student_hostel_assignments
FOR EACH ROW EXECUTE FUNCTION update_hostel_occupancy();

-- Create triggers for automatic fee structure assignment
DROP TRIGGER IF EXISTS auto_assign_fee_structure_trigger ON students;
CREATE TRIGGER auto_assign_fee_structure_trigger
AFTER INSERT ON students
FOR EACH ROW EXECUTE FUNCTION auto_assign_fee_structure_to_new_student();

-- Create trigger for hostel registration approval
DROP TRIGGER IF EXISTS handle_approved_hostel_registration_trigger ON hostel_registrations;
CREATE TRIGGER handle_approved_hostel_registration_trigger
AFTER UPDATE ON hostel_registrations
FOR EACH ROW EXECUTE FUNCTION handle_approved_hostel_registration();

-- Create triggers for updating timestamps
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
CREATE TRIGGER update_agents_updated_at
BEFORE UPDATE ON agents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_apply_students_updated_at ON apply_students;
CREATE TRIGGER update_apply_students_updated_at
BEFORE UPDATE ON apply_students
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();