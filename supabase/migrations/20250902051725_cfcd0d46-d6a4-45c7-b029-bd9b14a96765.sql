-- =====================================================
-- PART 6: ROW LEVEL SECURITY POLICIES & INITIAL DATA
-- =====================================================

-- Basic public read policies for lookup tables
CREATE POLICY "Allow public read access on academic_sessions" ON academic_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on universities" ON universities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow public read access on countries" ON countries FOR SELECT USING (is_active = true);
CREATE POLICY "Allow admins to manage countries" ON countries FOR ALL USING (true);

-- Apply students policies
CREATE POLICY "Allow public to insert applications" ON apply_students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public to read applications" ON apply_students FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to update applications" ON apply_students FOR UPDATE USING (true);

-- Admin access policies for core tables
CREATE POLICY "Admin access only" ON agents FOR ALL USING (true);
CREATE POLICY "Admin access only" ON students FOR ALL USING (true);
CREATE POLICY "Admin access only" ON agent_students FOR ALL USING (true);
CREATE POLICY "Admin access only" ON fee_types FOR ALL USING (true);
CREATE POLICY "Admin access only" ON fee_structures FOR ALL USING (true);
CREATE POLICY "Admin access only" ON fee_structure_components FOR ALL USING (true);
CREATE POLICY "Admin access only" ON student_fee_assignments FOR ALL USING (true);
CREATE POLICY "Admin access only" ON fee_payments FOR ALL USING (true);
CREATE POLICY "Admin access only" ON fee_collections FOR ALL USING (true);
CREATE POLICY "Admin access only" ON hostels FOR ALL USING (true);
CREATE POLICY "Admin access only" ON student_hostel_assignments FOR ALL USING (true);
CREATE POLICY "Admin access only" ON hostel_expenses FOR ALL USING (true);
CREATE POLICY "Admin access only" ON mess_expenses FOR ALL USING (true);
CREATE POLICY "Admin access only" ON invoices FOR ALL USING (true);

-- Agent notifications policies
CREATE POLICY "Agents can view their own notifications" ON agent_notifications 
FOR SELECT USING (agent_id = (SELECT user_sessions.user_id FROM user_sessions WHERE ((user_sessions.token)::text = current_setting('app.session_token'::text, true)) AND (user_sessions.expires_at > now()) LIMIT 1));

CREATE POLICY "Agents can update their own notifications" ON agent_notifications 
FOR UPDATE USING (agent_id = (SELECT user_sessions.user_id FROM user_sessions WHERE ((user_sessions.token)::text = current_setting('app.session_token'::text, true)) AND (user_sessions.expires_at > now()) LIMIT 1));

CREATE POLICY "Admins can insert notifications" ON agent_notifications FOR INSERT WITH CHECK (true);

-- Student credentials policies
CREATE POLICY "Only admins can view student credentials" ON student_credentials FOR SELECT USING (true);
CREATE POLICY "Only admins can insert student credentials" ON student_credentials FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can update student credentials" ON student_credentials FOR UPDATE USING (true);
CREATE POLICY "Allow public to read credentials for authentication" ON student_credentials FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to update their own credentials" ON student_credentials FOR UPDATE USING (true);

-- Student fee customizations policies
CREATE POLICY "Allow all operations on student_fee_customizations" ON student_fee_customizations FOR ALL USING (true);

-- Student fees policies
CREATE POLICY "Allow authenticated users to manage fees" ON student_fees FOR ALL USING (true);
CREATE POLICY "Students can view their own fees" ON student_fees FOR SELECT USING (true);

-- Student payments policies
CREATE POLICY "Allow authenticated users to manage payments" ON student_payments FOR ALL USING (true);
CREATE POLICY "Students can view their own payments" ON student_payments FOR SELECT USING (true);

-- Hostel registrations policies
CREATE POLICY "students_can_view_own_registrations" ON hostel_registrations FOR SELECT USING (true);
CREATE POLICY "students_can_insert_own_registrations" ON hostel_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "admins_can_update_registrations" ON hostel_registrations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "admins_can_delete_registrations" ON hostel_registrations FOR DELETE USING (true);

-- Office management policies
CREATE POLICY "Admin can view all offices" ON offices FOR SELECT USING (true);
CREATE POLICY "Admin can create offices" ON offices FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update offices" ON offices FOR UPDATE USING (true);
CREATE POLICY "Admin can delete offices" ON offices FOR DELETE USING (true);

-- Office expenses policies
CREATE POLICY "Admin can view all office expenses" ON office_expenses FOR SELECT USING (true);
CREATE POLICY "Admin can create office expenses" ON office_expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update office expenses" ON office_expenses FOR UPDATE USING (true);
CREATE POLICY "Admin can delete office expenses" ON office_expenses FOR DELETE USING (true);

-- Personal expense categories policies
CREATE POLICY "Categories are viewable by all" ON personal_expense_categories FOR SELECT USING (true);
CREATE POLICY "Categories can be managed by all" ON personal_expense_categories FOR ALL USING (true);

-- Personal expenses policies
CREATE POLICY "Allow all operations on personal expenses" ON personal_expenses FOR ALL USING (true);

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
CREATE POLICY "Allow all operations" ON character_issues FOR ALL USING (true);

-- Todo tasks policies
CREATE POLICY "Allow all operations" ON todo_tasks FOR ALL USING (true);

-- Student visa policies
CREATE POLICY "Allow all operations on student_visa" ON student_visa FOR ALL USING (true) WITH CHECK (true);

-- User sessions and permissions policies
CREATE POLICY "Allow all operations" ON user_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON user_permissions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);

-- Insert initial data
INSERT INTO academic_sessions (session_name, start_date, end_date, is_active) VALUES
('2024-2025', '2024-07-01', '2025-06-30', true),
('2023-2024', '2023-07-01', '2024-06-30', false);

INSERT INTO universities (name) VALUES
('Sample University'),
('Test Medical College'),
('Demo Engineering College');

INSERT INTO courses (name) VALUES
('MBBS'),
('B.Tech Computer Science'),
('B.Tech Mechanical Engineering'),
('BDS'),
('B.Pharm');

INSERT INTO countries (name, code, is_active) VALUES
('India', 'IN', true),
('United States', 'US', true),
('United Kingdom', 'UK', true),
('Canada', 'CA', true);

INSERT INTO fee_types (name, description, amount, category, frequency, status) VALUES
('Tuition Fee', 'Annual tuition fee', 100000, 'Academic', 'Yearly', 'Active'),
('Hostel Fee', 'Accommodation charges', 50000, 'Accommodation', 'Yearly', 'Active'),
('Lab Fee', 'Laboratory usage fee', 15000, 'Academic', 'Semester', 'Active'),
('Exam Fee', 'Examination fee', 5000, 'Academic', 'Semester', 'Active'),
('Library Fee', 'Library access fee', 2000, 'Academic', 'Yearly', 'Active');

INSERT INTO personal_expense_categories (name, description) VALUES
('Travel', 'Travel and transportation expenses'),
('Food', 'Food and dining expenses'),
('Accommodation', 'Lodging and accommodation costs'),
('Utilities', 'Electricity, water, internet bills'),
('Medical', 'Healthcare and medical expenses'),
('Office Supplies', 'Stationery and office materials'),
('Marketing', 'Advertising and promotional expenses'),
('Equipment', 'Office equipment and technology'),
('Training', 'Professional development and training'),
('Miscellaneous', 'Other business expenses');

-- Create default admin user
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES
('admin@example.com', crypt('admin123', gen_salt('bf')), 'System', 'Administrator', 'admin', true);