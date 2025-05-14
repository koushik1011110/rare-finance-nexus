
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export interface DirectStudentFormData {
  id?: string;
  name: string;
  university: string;
  course: string;
  totalFee: string;
  paidAmount: string;
  dueAmount: string;
  status: "Active" | "Completed" | "Inactive";
  remarks?: string;
}

interface DirectStudentFormProps {
  initialData?: DirectStudentFormData;
  onSubmit: (data: DirectStudentFormData) => void;
  isSubmitting?: boolean;
  universities?: string[];
}

const DirectStudentForm: React.FC<DirectStudentFormProps> = ({
  initialData = {
    name: "",
    university: "",
    course: "",
    totalFee: "",
    paidAmount: "",
    dueAmount: "",
    status: "Active",
    remarks: "",
  },
  onSubmit,
  isSubmitting = false,
  universities = ["London University", "Oxford University", "Cambridge University", "Harvard University"],
}) => {
  const [formData, setFormData] = React.useState<DirectStudentFormData>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateDueAmount = () => {
    const total = formData.totalFee.replace(/[^0-9.]/g, "");
    const paid = formData.paidAmount.replace(/[^0-9.]/g, "");
    const totalNum = parseFloat(total) || 0;
    const paidNum = parseFloat(paid) || 0;
    const due = totalNum - paidNum;
    return `$${due.toLocaleString()}`;
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, totalFee: value };
      return { ...newData, dueAmount: calculateDueAmount() };
    });
  };

  const handlePaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, paidAmount: value };
      return { ...newData, dueAmount: calculateDueAmount() };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Student Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter student name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="university">University</Label>
          <Select
            value={formData.university}
            onValueChange={(value) => handleSelectChange("university", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select university" />
            </SelectTrigger>
            <SelectContent>
              {universities.map((university) => (
                <SelectItem key={university} value={university}>
                  {university}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="course">Course</Label>
          <Input
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="Enter course name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalFee">Total Fee</Label>
          <Input
            id="totalFee"
            name="totalFee"
            value={formData.totalFee}
            onChange={handleTotalChange}
            placeholder="Enter total fee (e.g., $10,000)"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paidAmount">Paid Amount</Label>
          <Input
            id="paidAmount"
            name="paidAmount"
            value={formData.paidAmount}
            onChange={handlePaidChange}
            placeholder="Enter paid amount (e.g., $5,000)"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueAmount">Due Amount</Label>
          <Input
            id="dueAmount"
            name="dueAmount"
            value={formData.dueAmount}
            readOnly
            placeholder="Due amount will be calculated"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Enter any remarks or notes"
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Student"}
      </Button>
    </form>
  );
};

export default DirectStudentForm;
