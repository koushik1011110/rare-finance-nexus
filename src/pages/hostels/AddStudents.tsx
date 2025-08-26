import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';

interface Student { id: number; first_name?: string; last_name?: string; full_name?: string }
interface Hostel { id: number; name: string }

const AddStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [studentId, setStudentId] = useState<number | ''>('');
  const [hostelId, setHostelId] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const [stRes, hoRes] = await Promise.all([
        supabase.from('students').select('id, first_name, last_name'),
        supabase.from('hostels').select('id, name')
      ]);
      if (stRes.error) console.error(stRes.error);
      if (hoRes.error) console.error(hoRes.error);
      setStudents((stRes.data || []).map(s => ({ id: s.id as number, first_name: (s as any).first_name, last_name: (s as any).last_name, full_name: `${(s as any).first_name || ''} ${(s as any).last_name || ''}`.trim() })));
      setHostels((hoRes.data || []) as Hostel[]);
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!studentId || !hostelId) {
      setMessage('Please select both student and hostel.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await (supabase as any).from('hostel_registrations').insert({
        student_id: studentId,
        hostel_id: hostelId,
        status: 'approved',
        requested_by: 'admin',
        notes: notes || null,
        approved_at: new Date().toISOString(),
        approved_by: null,
      });
      if (error) throw error;
      setMessage('Student successfully added to the hostel.');
      setStudentId('');
      setHostelId('');
      setNotes('');
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Failed to add student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Add Students" description="Add a student directly to a hostel" />
      <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div>
          <label className="block text-sm font-medium mb-1">Student</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name || `Student #${s.id}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hostel</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={hostelId}
            onChange={(e) => setHostelId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Select hostel</option>
            {hostels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes (optional)</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add to Hostel'}</Button>
          {message && <span className="text-sm text-muted-foreground">{message}</span>}
        </div>
      </form>
      </div>
    </MainLayout>
  );
};

export default AddStudents;
