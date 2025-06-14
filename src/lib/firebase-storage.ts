import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase-config';

export interface UploadOptions {
  folder?: string;
  customName?: string;
}

export const uploadFile = async (
  file: File, 
  options: UploadOptions = {}
): Promise<string> => {
  try {
    const { folder = 'uploads', customName } = options;
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileName = customName || `${timestamp}-${file.name}`;
    const filePath = `${folder}/${fileName}`;
    
    // Create a reference to the file location
    const storageRef = ref(storage, filePath);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};

export const uploadStudentDocument = async (
  file: File,
  studentId: string,
  documentType: 'photo' | 'passport' | 'aadhaar' | 'certificate'
): Promise<string> => {
  const folder = `students/${studentId}/${documentType}`;
  return uploadFile(file, { folder });
};

export const deleteFile = async (downloadURL: string): Promise<void> => {
  try {
    const fileRef = ref(storage, downloadURL);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
};

export const validateFile = (file: File, options: {
  maxSize?: number; // in MB
  allowedTypes?: string[];
}): { isValid: boolean; error?: string } => {
  const { maxSize = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] } = options;
  
  // Check file size
  if (file.size > maxSize * 1024 * 1024) {
    return { isValid: false, error: `File size must be less than ${maxSize}MB` };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type' };
  }
  
  return { isValid: true };
};