
import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  url: string | null;
  error: string | null;
}

export const uploadFileToSupabase = async (
  file: File,
  bucket: string,
  path: string
): Promise<UploadResult> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: null, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Upload error:', error);
    return { url: null, error: 'Failed to upload file' };
  }
};

export const uploadStudentDocument = async (
  file: File,
  documentType: string,
  studentId?: number
): Promise<UploadResult> => {
  const path = studentId ? `student-${studentId}` : 'temp';
  return uploadFileToSupabase(file, 'student-documents', `${path}/${documentType}`);
};
