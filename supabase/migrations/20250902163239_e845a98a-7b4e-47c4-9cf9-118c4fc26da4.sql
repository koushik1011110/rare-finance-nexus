-- Fix the student credentials trigger issue
-- Drop the conflicting trigger first
DROP TRIGGER IF EXISTS auto_create_student_credentials_trigger ON students;

-- Recreate the trigger with proper error handling
CREATE OR REPLACE FUNCTION public.auto_create_student_credentials()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Only try to create credentials if they don't already exist
    IF NOT EXISTS (SELECT 1 FROM student_credentials WHERE student_id = NEW.id) THEN
        -- Use the existing create_student_credentials function
        PERFORM create_student_credentials(NEW.id);
    END IF;
    RETURN NEW;
EXCEPTION
    -- If there's any error, just return NEW to allow the student insert to succeed
    WHEN OTHERS THEN
        RAISE NOTICE 'Failed to create student credentials for student %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$function$;

-- Recreate the trigger
CREATE TRIGGER auto_create_student_credentials_trigger
    AFTER INSERT ON students
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_student_credentials();

-- Also update the create_student_credentials function to handle duplicates better
CREATE OR REPLACE FUNCTION public.create_student_credentials(student_id_param integer)
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
    new_username TEXT;
    new_password TEXT;
BEGIN
    -- Check if credentials already exist
    IF EXISTS (SELECT 1 FROM student_credentials WHERE student_id = student_id_param) THEN
        RETURN; -- Exit early if credentials already exist
    END IF;
    
    -- Generate username and password
    new_username := generate_student_username(student_id_param);
    new_password := generate_student_password();
    
    -- Insert credentials with ON CONFLICT handling
    INSERT INTO student_credentials (student_id, username, password)
    VALUES (student_id_param, new_username, new_password)
    ON CONFLICT (student_id) DO NOTHING;
END;
$function$;