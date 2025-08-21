-- Create function to auto-assign fee structures to new students
CREATE OR REPLACE FUNCTION auto_assign_fee_structure_to_new_student()
RETURNS TRIGGER AS $$
DECLARE
  matching_structures RECORD;
  active_session_id INTEGER;
BEGIN
  -- Get active academic session
  SELECT id INTO active_session_id 
  FROM academic_sessions 
  WHERE is_active = true 
  LIMIT 1;
  
  -- Only proceed if student has university, course and matches active session
  IF NEW.university_id IS NOT NULL AND NEW.course_id IS NOT NULL AND NEW.academic_session_id = active_session_id THEN
    
    -- Find matching fee structures for this university and course
    FOR matching_structures IN 
      SELECT id FROM fee_structures 
      WHERE university_id = NEW.university_id 
        AND course_id = NEW.course_id 
        AND is_active = true
    LOOP
      
      -- Create fee assignment if it doesn't already exist
      INSERT INTO student_fee_assignments (student_id, fee_structure_id)
      SELECT NEW.id, matching_structures.id
      WHERE NOT EXISTS (
        SELECT 1 FROM student_fee_assignments 
        WHERE student_id = NEW.id AND fee_structure_id = matching_structures.id
      );
      
      -- Create payment records for each component
      INSERT INTO fee_payments (student_id, fee_structure_component_id, amount_due, due_date)
      SELECT 
        NEW.id,
        fsc.id,
        fsc.amount,
        CASE 
          WHEN fsc.frequency = 'one-time' THEN CURRENT_DATE + INTERVAL '30 days'
          WHEN fsc.frequency = 'yearly' THEN CURRENT_DATE + INTERVAL '1 year'
          WHEN fsc.frequency = 'semester-wise' THEN CURRENT_DATE + INTERVAL '6 months'
          ELSE CURRENT_DATE + INTERVAL '30 days'
        END
      FROM fee_structure_components fsc
      WHERE fsc.fee_structure_id = matching_structures.id
        AND NOT EXISTS (
          SELECT 1 FROM fee_payments fp 
          WHERE fp.student_id = NEW.id 
            AND fp.fee_structure_component_id = fsc.id
        );
        
    END LOOP;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run the function when a new student is inserted
CREATE TRIGGER trigger_auto_assign_fee_structure
  AFTER INSERT ON students
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_fee_structure_to_new_student();