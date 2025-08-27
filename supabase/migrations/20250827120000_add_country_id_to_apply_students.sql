-- Add country_id column to apply_students and migrate existing values
BEGIN;

-- Add nullable country_id column if missing
ALTER TABLE public.apply_students
ADD COLUMN IF NOT EXISTS country_id INTEGER;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_apply_students_country' 
        AND table_name = 'apply_students'
    ) THEN
        ALTER TABLE public.apply_students 
        ADD CONSTRAINT fk_apply_students_country 
        FOREIGN KEY (country_id) REFERENCES public.countries(id);
    END IF;
END $$;

-- Migrate existing country text values to country_id using countries.name
UPDATE public.apply_students
SET country_id = (
  SELECT c.id FROM public.countries c
  WHERE c.name = apply_students.country
  AND c.is_active = true
)
WHERE apply_students.country IS NOT NULL AND apply_students.country_id IS NULL;

COMMIT;
