-- Create table to manage student registrations to specific hostels within a university
-- Supports admin-direct assignments and student-submitted requests with approval workflow

BEGIN;

-- 1) Enum for registration status (if not already present)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hostel_registration_status') THEN
    CREATE TYPE hostel_registration_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END$$;

-- 2) Create hostel_registrations table
CREATE TABLE IF NOT EXISTS public.hostel_registrations (
  id BIGSERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  hostel_id INTEGER NOT NULL REFERENCES public.hostels(id) ON DELETE RESTRICT,
  status hostel_registration_status NOT NULL DEFAULT 'pending',
  requested_by TEXT NOT NULL CHECK (requested_by IN ('admin', 'student')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ NULL,
  approved_by UUID NULL, -- optionally link to auth.users if desired
  notes TEXT NULL,
);

-- 3) Helpful indexes
CREATE INDEX IF NOT EXISTS idx_hostel_registrations_student_id ON public.hostel_registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_hostel_registrations_hostel_id ON public.hostel_registrations(hostel_id);
CREATE INDEX IF NOT EXISTS idx_hostel_registrations_status ON public.hostel_registrations(status);
CREATE INDEX IF NOT EXISTS idx_hostel_registrations_requested_at ON public.hostel_registrations(requested_at);

-- Prevent multiple active (pending/approved) registrations for the same student-hostel pair
CREATE UNIQUE INDEX IF NOT EXISTS uq_hostel_reg_active
  ON public.hostel_registrations(student_id, hostel_id)
  WHERE status IN ('pending','approved');

-- 4) Optional view to fetch the latest registration per student (convenience)
CREATE OR REPLACE VIEW public.v_latest_hostel_registration AS
SELECT DISTINCT ON (student_id)
  hr.*
FROM public.hostel_registrations hr
ORDER BY hr.student_id, hr.requested_at DESC;

-- 5) (Optional) If RLS is enabled in your project, set policies here.
-- ALTER TABLE public.hostel_registrations ENABLE ROW LEVEL SECURITY;
-- Create your policies based on your app roles (admin, hostel_team, student) as needed.

COMMIT;
