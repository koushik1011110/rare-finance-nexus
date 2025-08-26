import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { salaryAPI, type SalaryStructureFormData, type StaffMember } from '@/lib/salary-api';

interface Props {
  defaultValues?: Partial<SalaryStructureFormData>;
  onSubmit: (data: SalaryStructureFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const SalaryStructureForm: React.FC<Props> = ({ defaultValues, onSubmit, isSubmitting }) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [form, setForm] = useState<SalaryStructureFormData>({
    staff_id: defaultValues?.staff_id || '',
    position: defaultValues?.position || '',
    basic_salary: defaultValues?.basic_salary || '0',
    allowances: defaultValues?.allowances || '0',
    effective_from: defaultValues?.effective_from || '',
    effective_to: defaultValues?.effective_to || '',
    is_active: defaultValues?.is_active ?? true,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await salaryAPI.getAllStaff();
        setStaffMembers(data);
      } catch (err) {
        console.error('Error loading staff for structure form', err);
      }
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Staff Member</Label>
        <Select value={form.staff_id} onValueChange={(v) => setForm(prev => ({ ...prev, staff_id: v }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select staff" />
          </SelectTrigger>
          <SelectContent>
            {staffMembers.map(s => (
              <SelectItem key={s.id} value={s.id.toString()}>
                {s.first_name} {s.last_name} - {s.role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Position</Label>
        <Input value={form.position} onChange={(e) => setForm(prev => ({ ...prev, position: e.target.value }))} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Basic Salary</Label>
          <Input type="number" value={form.basic_salary} onChange={(e) => setForm(prev => ({ ...prev, basic_salary: e.target.value }))} />
        </div>
        <div>
          <Label>Allowances</Label>
          <Input type="number" value={form.allowances} onChange={(e) => setForm(prev => ({ ...prev, allowances: e.target.value }))} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Effective From</Label>
          <Input type="date" value={form.effective_from} onChange={(e) => setForm(prev => ({ ...prev, effective_from: e.target.value }))} />
        </div>
        <div>
          <Label>Effective To (optional)</Label>
          <Input type="date" value={form.effective_to} onChange={(e) => setForm(prev => ({ ...prev, effective_to: e.target.value }))} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Structure'}</Button>
      </div>
    </form>
  );
};

export default SalaryStructureForm;
