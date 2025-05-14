
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

export interface AgentStudentFormData {
  id?: string;
  studentName: string;
  agentName: string;
  university: string;
  course: string;
  totalFee: string;
  paidAmount: string;
  dueAmount: string;
  commission: string;
  commissionDue: string;
  status: "Active" | "Completed" | "Inactive";
  remarks?: string;
}

interface AgentStudentFormProps {
  initialData?: AgentStudentFormData;
  onSubmit: (data: AgentStudentFormData) => void;
  isSubmitting?: boolean;
  universities?: string[];
  agents?: string[];
}

const AgentStudentForm: React.FC<AgentStudentFormProps> = ({
  initialData = {
    studentName: "",
    agentName: "",
    university: "",
    course: "",
    totalFee: "",
    paidAmount: "",
    dueAmount: "",
    commission: "",
    commissionDue: "",
    status: "Active",
    remarks: "",
  },
  onSubmit,
  isSubmitting = false,
  universities = ["London University", "Oxford University", "Cambridge University", "Harvard University"],
  agents = ["Global Education", "Academic Horizon", "Future Scholars", "Education First"],
}) => {
  const [formData, setFormData] = React.useState<AgentStudentFormData>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const recalculate = () => {
    // Calculate due amount
    const total = formData.totalFee.replace(/[^0-9.]/g, "") || "0";
    const paid = formData.paidAmount.replace(/[^0-9.]/g, "") || "0";
    const totalNum = parseFloat(total);
    const paidNum = parseFloat(paid);
    const due = totalNum - paidNum;
    
    // Calculate commission and due commission
    const commissionRate = parseFloat(formData.commission.replace(/[^0-9.]/g, "")) || 10;
    const totalCommission = (totalNum * commissionRate) / 100;
    const paidRatio = paidNum / totalNum;
    const commissionDue = totalCommission * (1 - paidRatio);
    
    return {
      dueAmount: `$${due.toLocaleString()}`,
      commissionDue: `$${commissionDue.toLocaleString()}`
    };
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      const calculated = recalculate();
      return { 
        ...newData, 
        dueAmount: calculated.dueAmount, 
        commissionDue: calculated.commissionDue 
      };
    });
  };

  const handleCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      const calculated = recalculate();
      return { ...newData, commissionDue: calculated.commissionDue };
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
          <Label htmlFor="studentName">Student Name</Label>
          <Input
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter student name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="agentName">Agent Name</Label>
          <Select
            value={formData.agentName}
            onValueChange={(value) => handleSelectChange("agentName", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent} value={agent}>
                  {agent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            onChange={handleAmountChange}
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
            onChange={handleAmountChange}
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
          <Label htmlFor="commission">Commission Rate (%)</Label>
          <Input
            id="commission"
            name="commission"
            value={formData.commission}
            onChange={handleCommissionChange}
            placeholder="Enter commission rate (e.g., 10%)"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="commissionDue">Commission Due</Label>
          <Input
            id="commissionDue"
            name="commissionDue"
            value={formData.commissionDue}
            readOnly
            placeholder="Commission due will be calculated"
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

export default AgentStudentForm;
