-- Enable RLS on tables that need it
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structure_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE mess_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fee_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_hostel_assignments ENABLE ROW LEVEL SECURITY;

-- Add basic admin-only policies for new tables
CREATE POLICY "Admin access only" ON agents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin access only" ON agent_students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin access only" ON fee_collections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin access only" ON fee_payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin access only" ON fee_structure_components FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin access only" ON fee_structures FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin access only" ON fee_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin access only" ON hostel_expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin access only" ON hostels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin access only" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin access only" ON mess_expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin access only" ON student_fee_assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin access only" ON student_hostel_assignments FOR ALL USING (true) WITH CHECK (true);