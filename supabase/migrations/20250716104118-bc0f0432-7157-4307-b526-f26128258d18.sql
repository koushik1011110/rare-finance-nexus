-- Create storage bucket for student documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('student-documents', 'student-documents', false, 52428800, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for student documents
CREATE POLICY "Admin can view all student documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'student-documents');

CREATE POLICY "Admin can upload student documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'student-documents');

CREATE POLICY "Admin can update student documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'student-documents');

CREATE POLICY "Admin can delete student documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'student-documents');