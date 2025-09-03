-- =====================================================
-- PART 6B: ADDITIONAL RLS POLICIES & INITIAL DATA (FINAL)
-- =====================================================

-- Insert initial data
INSERT INTO academic_sessions (session_name, start_date, end_date, is_active) VALUES
('2024-2025', '2024-07-01', '2025-06-30', true),
('2023-2024', '2023-07-01', '2024-06-30', false)
ON CONFLICT DO NOTHING;

INSERT INTO universities (name) VALUES
('Sample University'),
('Test Medical College'),
('Demo Engineering College')
ON CONFLICT DO NOTHING;

INSERT INTO courses (name) VALUES
('MBBS'),
('B.Tech Computer Science'),
('B.Tech Mechanical Engineering'),
('BDS'),
('B.Pharm')
ON CONFLICT DO NOTHING;

INSERT INTO countries (name, code, is_active) VALUES
('India', 'IN', true),
('United States', 'US', true),
('United Kingdom', 'UK', true),
('Canada', 'CA', true)
ON CONFLICT DO NOTHING;

INSERT INTO fee_types (name, description, amount, category, frequency, status) VALUES
('Tuition Fee', 'Annual tuition fee', 100000, 'Academic', 'Yearly', 'Active'),
('Hostel Fee', 'Accommodation charges', 50000, 'Accommodation', 'Yearly', 'Active'),
('Lab Fee', 'Laboratory usage fee', 15000, 'Academic', 'Semester', 'Active'),
('Exam Fee', 'Examination fee', 5000, 'Academic', 'Semester', 'Active'),
('Library Fee', 'Library access fee', 2000, 'Academic', 'Yearly', 'Active')
ON CONFLICT DO NOTHING;

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
('Miscellaneous', 'Other business expenses')
ON CONFLICT DO NOTHING;

-- Create default admin user
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES
('admin@example.com', crypt('admin123', gen_salt('bf')), 'System', 'Administrator', 'admin', true)
ON CONFLICT (email) DO NOTHING;