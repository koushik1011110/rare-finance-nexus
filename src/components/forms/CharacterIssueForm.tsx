import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { characterIssuesAPI, CreateCharacterIssueRequest } from "@/lib/character-issues-api";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  admission_number: string;
}

interface CharacterIssueFormProps {
  onSuccess: () => void;
}

export default function CharacterIssueForm({ onSuccess }: CharacterIssueFormProps) {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState<CreateCharacterIssueRequest>({
    student_id: 0,
    complaint: "",
    fine_amount: 0,
    created_by: ""
  });
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadStudents();
    }
  }, [open]);

  const loadStudents = async () => {
    try {
      setStudentsLoading(true);
      const data = await characterIssuesAPI.getStudents();
      setStudents(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_id || !formData.complaint || formData.fine_amount <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await characterIssuesAPI.create(formData);
      
      toast({
        title: "Success",
        description: "Character issue added successfully",
      });
      
      setFormData({
        student_id: 0,
        complaint: "",
        fine_amount: 0,
        created_by: ""
      });
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add character issue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Character Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Character Issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="student">Student *</Label>
            <Select 
              value={formData.student_id.toString()} 
              onValueChange={(value) => setFormData({ ...formData, student_id: parseInt(value) })}
              disabled={studentsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={studentsLoading ? "Loading students..." : "Select a student"} />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {student.first_name} {student.last_name} ({student.admission_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="complaint">Complaint *</Label>
            <Textarea
              id="complaint"
              placeholder="Describe the issue..."
              value={formData.complaint}
              onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="fine_amount">Fine Amount *</Label>
            <Input
              id="fine_amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter fine amount"
              value={formData.fine_amount || ""}
              onChange={(e) => setFormData({ ...formData, fine_amount: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div>
            <Label htmlFor="created_by">Reported By</Label>
            <Input
              id="created_by"
              placeholder="Enter reporter name (optional)"
              value={formData.created_by}
              onChange={(e) => setFormData({ ...formData, created_by: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Issue
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}