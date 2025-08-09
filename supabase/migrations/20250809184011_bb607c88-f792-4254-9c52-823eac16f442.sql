-- Modify office_expenses table to support daily expenses with notes
ALTER TABLE office_expenses 
ADD COLUMN IF NOT EXISTS expense_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS expense_category VARCHAR(50) DEFAULT 'general',
ADD COLUMN IF NOT EXISTS amount NUMERIC(10,2) DEFAULT 0;

-- Update existing records to have expense_date as the first day of the month
UPDATE office_expenses 
SET expense_date = month::date
WHERE expense_date IS NULL;

-- Create index for better performance on date queries
CREATE INDEX IF NOT EXISTS idx_office_expenses_date ON office_expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_office_expenses_office_id ON office_expenses(office_id);