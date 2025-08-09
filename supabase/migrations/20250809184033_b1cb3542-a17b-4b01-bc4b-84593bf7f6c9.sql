-- Enable RLS on office_expenses table
ALTER TABLE office_expenses ENABLE ROW LEVEL SECURITY;

-- Keep existing RLS policies
-- The current policies allow admin operations which should remain