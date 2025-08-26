import { ComprehensiveStudentFormData } from '@/components/forms/ComprehensiveStudentForm';

export const buildStudentInsertPayload = (formData: ComprehensiveStudentFormData, opts?: { defaultCourseId?: number | undefined; defaultSessionId?: number | undefined; forceStatus?: string; agentId?: number | null }) => {
  const defaultCourseId = opts?.defaultCourseId;
  const defaultSessionId = opts?.defaultSessionId;
  const status = opts?.forceStatus || 'active';

  const universityId = formData.university_id && Number(formData.university_id) > 0 ? Number(formData.university_id) : undefined;
  const courseId = formData.course_id && Number(formData.course_id) > 0 ? Number(formData.course_id) : (defaultCourseId || undefined);
  const sessionId = formData.academic_session_id && Number(formData.academic_session_id) > 0 ? Number(formData.academic_session_id) : (defaultSessionId || undefined);
  const agentField = formData.agent_id && Number(formData.agent_id) > 0 ? Number(formData.agent_id) : (opts?.agentId ?? null);

  const payload: Record<string, any> = {
    first_name: formData.first_name,
    last_name: formData.last_name,
    father_name: formData.father_name,
    mother_name: formData.mother_name,
    date_of_birth: formData.date_of_birth,
    phone_number: formData.phone_number || null,
    email: formData.email || null,
    university_id: universityId,
    course_id: courseId,
    academic_session_id: sessionId,
    status,
    agent_id: agentField,
  };

  // Copy optional fields if present (coerce numeric ones)
  const copyIfPresent = (key: keyof ComprehensiveStudentFormData) => {
    const v = formData[key];
    if (v !== undefined && v !== null && v !== '') {
      if (key === 'twelfth_marks' || key === 'pcb_average') {
        payload[key] = Number(v as any);
      } else {
        payload[key] = v;
      }
    }
  };

  [
    'admission_number','city','country','address','aadhaar_number','passport_number','scores','twelfth_marks','photo_url','passport_copy_url','aadhaar_copy_url','twelfth_certificate_url','neet_score_card_url','tenth_marksheet_url','affidavit_paper_url','admission_letter_url','parents_phone_number','tenth_passing_year','twelfth_passing_year','neet_passing_year','tenth_marksheet_number','pcb_average','neet_roll_number','qualification_status'
  ].forEach(k => copyIfPresent(k as keyof ComprehensiveStudentFormData));

  return payload;
};

export default buildStudentInsertPayload;
