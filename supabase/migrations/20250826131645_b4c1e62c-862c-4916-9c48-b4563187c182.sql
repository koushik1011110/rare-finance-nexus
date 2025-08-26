-- Enable RLS on tables that have policies but don't have RLS enabled
ALTER TABLE apply_students_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for users table (referenced in student policies)
CREATE POLICY "Enable read access for authenticated users" ON users
FOR SELECT TO authenticated
USING (true);

-- Create basic RLS policies for user_sessions table (referenced in student policies)
CREATE POLICY "Enable read access for authenticated users" ON user_sessions
FOR SELECT TO authenticated  
USING (true);