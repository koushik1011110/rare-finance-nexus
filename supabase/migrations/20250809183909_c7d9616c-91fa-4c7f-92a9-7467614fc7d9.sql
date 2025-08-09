-- Modify office_expenses table to support daily expenses with notes
ALTER TABLE office_expenses 
ADD COLUMN expense_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN notes TEXT,
ADD COLUMN expense_category VARCHAR(50) DEFAULT 'general',
ADD COLUMN amount NUMERIC(10,2) DEFAULT 0;

-- Update existing records to have expense_date as the first day of the month
UPDATE office_expenses 
SET expense_date = DATE_TRUNC('month', month::date)
WHERE expense_date IS NULL;

-- Create index for better performance on date queries
CREATE INDEX IF NOT EXISTS idx_office_expenses_date ON office_expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_office_expenses_office_month ON office_expenses(office_id, DATE_TRUNC('month', expense_date));