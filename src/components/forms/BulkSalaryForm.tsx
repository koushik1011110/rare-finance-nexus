import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Users, Search } from "lucide-react";
import { salaryAPI, type SalaryFormData, type StaffMember } from "@/lib/salary-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BulkSalaryFormProps {
  onSubmit: (staffIds: string[], data: Omit<SalaryFormData, 'id' | 'staff_id'>) => Promise<void>;
  isSubmitting: boolean;
}

const BulkSalaryForm: React.FC<BulkSalaryFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [staffSearch, setStaffSearch] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [formData, setFormData] = useState<Omit<SalaryFormData, 'id' | 'staff_id'>>({
    basic_salary: "",
    allowances: "0",
    deductions: "0",
    salary_month: "",
    payment_status: "pending",
    payment_date: "",
    payment_method: "bank_transfer",
    notes: "",
  });

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = async () => {
    try {
      const data = await salaryAPI.getAllStaff();
      setStaffMembers(data);
    } catch (error) {
      console.error("Error loading staff members:", error);
    } finally {
      setLoadingStaff(false);
    }
  };

  const filteredStaff = staffMembers.filter(staff =>
    staff.first_name.toLowerCase().includes(staffSearch.toLowerCase()) ||
    staff.last_name.toLowerCase().includes(staffSearch.toLowerCase()) ||
    staff.role.toLowerCase().includes(staffSearch.toLowerCase())
  );

  const handleStaffSelection = (staffId: string, checked: boolean) => {
    if (checked) {
      setSelectedStaffIds([...selectedStaffIds, staffId]);
    } else {
      setSelectedStaffIds(selectedStaffIds.filter(id => id !== staffId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedStaffIds(filteredStaff.map(staff => staff.id.toString()));
    } else {
      setSelectedStaffIds([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStaffIds.length === 0) {
      alert("Please select at least one staff member");
      return;
    }
    await onSubmit(selectedStaffIds, formData);
  };

  const calculateTotals = () => {
    const basic = parseFloat(formData.basic_salary) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    const gross = basic + allowances;
    const net = gross - deductions;
    
    return { gross, net };
  };

  const { gross, net } = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Staff Selection Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Staff Members ({selectedStaffIds.length} selected)
          </CardTitle>
          <CardDescription>
            Choose the staff members you want to add salaries for
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Select All */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff by name or role..."
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all">Select All</Label>
            </div>
          </div>

          {/* Staff List */}
          {loadingStaff ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading staff...</span>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto border rounded-lg">
              <div className="grid grid-cols-1 divide-y">
                {filteredStaff.map((staff) => (
                  <div key={staff.id} className="flex items-center space-x-3 p-3">
                    <Checkbox
                      id={`staff-${staff.id}`}
                      checked={selectedStaffIds.includes(staff.id.toString())}
                      onCheckedChange={(checked) => 
                        handleStaffSelection(staff.id.toString(), checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={`staff-${staff.id}`}
                        className="cursor-pointer"
                      >
                        <div className="font-medium">
                          {staff.first_name} {staff.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {staff.role} • {staff.email}
                        </div>
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Salary Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Salary Information</CardTitle>
          <CardDescription>
            Enter the salary details that will be applied to all selected staff members
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_month">Salary Month</Label>
              <Input
                id="salary_month"
                type="month"
                value={formData.salary_month}
                onChange={(e) =>
                  setFormData({ ...formData, salary_month: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="basic_salary">Basic Salary</Label>
              <Input
                id="basic_salary"
                type="number"
                step="0.01"
                min="0"
                value={formData.basic_salary}
                onChange={(e) =>
                  setFormData({ ...formData, basic_salary: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allowances">Allowances</Label>
              <Input
                id="allowances"
                type="number"
                step="0.01"
                min="0"
                value={formData.allowances}
                onChange={(e) =>
                  setFormData({ ...formData, allowances: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deductions">Deductions</Label>
              <Input
                id="deductions"
                type="number"
                step="0.01"
                min="0"
                value={formData.deductions}
                onChange={(e) =>
                  setFormData({ ...formData, deductions: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_status">Payment Status</Label>
              <Select
                value={formData.payment_status}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, payment_status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, payment_method: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="payment_date">Payment Date (Optional)</Label>
              <Input
                id="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={(e) =>
                  setFormData({ ...formData, payment_date: e.target.value })
                }
              />
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-foreground">Salary Calculation (per staff member)</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Gross Salary:</span>
                <p className="font-semibold text-foreground">${gross.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Deductions:</span>
                <p className="font-semibold text-red-600">-${(parseFloat(formData.deductions) || 0).toFixed(2)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Net Salary:</span>
                <p className="font-semibold text-green-600">${net.toFixed(2)}</p>
              </div>
            </div>
            <div className="pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                Total payout for {selectedStaffIds.length} staff: 
              </span>
              <span className="font-bold text-primary ml-1">
                ${(net * selectedStaffIds.length).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or comments..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting || selectedStaffIds.length === 0}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Salaries...
            </>
          ) : (
            `Create Salaries for ${selectedStaffIds.length} Staff`
          )}
        </Button>
      </div>
    </form>
  );
};

export default BulkSalaryForm;