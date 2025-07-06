-- Create storage bucket for student documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('student-documents', 'student-documents', false, 20480, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']);

-- Create policies for student documents bucket
CREATE POLICY "Authenticated users can upload student documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'student-documents' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can view student documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'student-documents' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Only admins can delete student documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'student-documents' AND
  auth.jwt() ->> 'role' = 'admin'
);