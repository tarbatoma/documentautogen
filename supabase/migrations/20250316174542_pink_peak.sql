-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Create new storage policies with proper access control
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can access their own documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'documents' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'documents' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);