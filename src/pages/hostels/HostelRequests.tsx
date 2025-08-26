import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';

interface RequestRow {
  id: number;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  notes: string | null;
  students?: { id: number; first_name?: string | null; last_name?: string | null } | null;
  hostels?: { id: number; name: string } | null;
}

const HostelRequests: React.FC = () => {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await (supabase as any)
      .from('hostel_registrations')
      .select('id, status, requested_at, notes, students(id, first_name, last_name), hostels(id, name)')
      .eq('status', 'pending')
      .order('requested_at', { ascending: false });
    if (error) {
      setError(error.message);
    }
    setRows((data as any) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const doAction = async (id: number, newStatus: 'approved' | 'rejected') => {
    setActionId(id);
    setError(null);
    const payload: any = { status: newStatus };
    if (newStatus === 'approved') {
      payload.approved_at = new Date().toISOString();
      payload.approved_by = null; // set to current user id if available in your auth mapping
    }
    const { error } = await (supabase as any)
      .from('hostel_registrations')
      .update(payload)
      .eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      await load();
    }
    setActionId(null);
  };

  return (
    <MainLayout>
      <PageHeader title="Student Requests" description="Approve or reject student hostel applications" />
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : rows.length === 0 ? (
        <div>No pending requests.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-2 border">Student</th>
                <th className="text-left p-2 border">Hostel</th>
                <th className="text-left p-2 border">Requested At</th>
                <th className="text-left p-2 border">Notes</th>
                <th className="text-left p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-2 border">
                    {r.students ? `${r.students.first_name || ''} ${r.students.last_name || ''}`.trim() : `Student #${r.id}`}
                  </td>
                  <td className="p-2 border">{r.hostels?.name || '-'}</td>
                  <td className="p-2 border">{r.requested_at ? format(new Date(r.requested_at), 'yyyy-MM-dd HH:mm') : '-'}</td>
                  <td className="p-2 border">{r.notes || '-'}</td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <Button variant="default" disabled={actionId === r.id} onClick={() => doAction(r.id, 'approved')}>
                        {actionId === r.id ? 'Working...' : 'Approve'}
                      </Button>
                      <Button variant="destructive" disabled={actionId === r.id} onClick={() => doAction(r.id, 'rejected')}>
                        {actionId === r.id ? 'Working...' : 'Reject'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
};

export default HostelRequests;
