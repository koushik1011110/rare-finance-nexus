import { supabase } from "@/integrations/supabase/client";

export interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadFile = async (
  file: File,
  folder: string,
  studentId?: number
): Promise<FileUploadResult> => {
  try {
    // Check file size (20KB limit)
    const maxSize = 20 * 1024; // 20KB in bytes
    if (file.size > maxSize) {
      return {
        success: false,
        error: `File size must be less than 20KB. Current size: ${Math.round(file.size / 1024)}KB`
      };
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/pdf'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Only JPEG, PNG, and PDF files are allowed'
      };
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = studentId 
      ? `${studentId}/${folder}/${timestamp}.${fileExtension}`
      : `${folder}/${timestamp}.${fileExtension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('student-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('student-documents')
      .getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl
    };

  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: 'Upload failed due to an unexpected error'
    };
  }
};

export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('student-documents')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('File delete error:', error);
    return false;
  }
};

export const getFileUrl = (filePath: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from('student-documents')
    .getPublicUrl(filePath);

  return publicUrl;
};