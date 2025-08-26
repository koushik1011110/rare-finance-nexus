import React, { useState } from 'react';
import EditModal from '@/components/shared/EditModal';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Props {
  studentId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onUploaded?: (updated: any) => void;
}

const DocumentsUploadModal: React.FC<Props> = ({ studentId, isOpen, onClose, onUploaded }) => {
  const [files, setFiles] = useState<{ key: string; file: File | null }[]>([
    { key: 'admission_letter_url', file: null },
    { key: 'passport_copy_url', file: null },
    { key: 'aadhaar_copy_url', file: null },
    { key: 'twelfth_certificate_url', file: null },
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (index: number, f: File | null) => {
    setFiles(prev => prev.map((p, i) => i === index ? { ...p, file: f } : p));
  };

  const handleUpload = async () => {
    if (!studentId) return;
    setIsUploading(true);
    try {
      const uploadedUrls: Record<string, string> = {};
      for (const item of files) {
        if (!item.file) continue;
        const fileExt = item.file.name.split('.').pop();
        const dest = `students/${studentId}/${item.key}.${Date.now()}.${fileExt}`;

        const { data, error: upErr } = await supabase.storage
          .from('lovable-uploads')
          .upload(dest, item.file, { cacheControl: '3600', upsert: true });

        if (upErr) throw upErr;

        const { data: publicUrlData } = supabase.storage.from('lovable-uploads').getPublicUrl(dest);
        uploadedUrls[item.key] = publicUrlData.publicUrl;
      }

      // Update student row with uploaded urls
      if (Object.keys(uploadedUrls).length > 0) {
        const { data: updated, error } = await supabase
          .from('students')
          .update({ ...uploadedUrls })
          .eq('id', studentId)
          .select()
          .single();

        if (error) throw error;

        toast({ title: 'Uploaded', description: 'Documents uploaded successfully.' });
        onUploaded?.(updated);
        onClose();
      } else {
        toast({ title: 'No files', description: 'Please select files to upload.' });
      }
    } catch (err: any) {
      console.error('Upload error', err);
      toast({ title: 'Upload failed', description: err?.message || 'Failed to upload documents', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <EditModal title="Upload Documents" isOpen={isOpen} onClose={onClose} fullScreen={false}>
      <div className="space-y-4 p-4">
        {files.map((f, idx) => (
          <div key={f.key} className="flex items-center space-x-3">
            <label className="min-w-[160px]">{f.key.replace(/_/g, ' ')}</label>
            <input type="file" onChange={(e) => handleFileChange(idx, e.target.files?.[0] || null)} />
          </div>
        ))}

        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpload} disabled={isUploading}>{isUploading ? 'Uploading...' : 'Upload'}</Button>
        </div>
      </div>
    </EditModal>
  );
};

export default DocumentsUploadModal;
