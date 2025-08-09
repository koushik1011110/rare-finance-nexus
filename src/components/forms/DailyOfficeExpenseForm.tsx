import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { officeExpensesAPI, officesAPI, type Office } from "@/lib/supabase-database";

interface DailyOfficeExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  office_id: number;
  expense_date: string;
  expense_category: string;
  amount: number;
  notes: string;
}

const expenseCategories = [
  'Rent',
  'Utilities',
  'Internet',
  'Marketing',
  'Travel',
  'Miscellaneous',
  'Office Supplies',
  'Maintenance',
  'Equipment',
  'General'
];

const DailyOfficeExpenseForm: React.FC<DailyOfficeExpenseFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loadingOffices, setLoadingOffices] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      office_id: 0,
      expense_date: new Date().toISOString().split('T')[0],
      expense_category: "General",
      amount: 0,
      notes: "",
    },
  });

  const selectedOfficeId = watch("office_id");

  // Load offices on component mount
  useEffect(() => {
    const loadOffices = async () => {
      try {
        const data = await officesAPI.getAll();
        setOffices(data.filter(office => office.status === 'Active'));
      } catch (error) {
        console.error('Error loading offices:', error);
        toast({
          title: "Error",
          description: "Failed to load offices.",
          variant: "destructive",
        });
      } finally {
        setLoadingOffices(false);
      }
    };
    loadOffices();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const selectedOffice = offices.find(office => office.id === data.office_id);
      if (!selectedOffice) {
        toast({
          title: "Error",
          description: "Please select a valid office.",
          variant: "destructive",
        });
        return;
      }

      const expenseData = {
        location: selectedOffice.name,
        office_id: data.office_id,
        month: data.expense_date, // Keep for compatibility
        expense_date: data.expense_date,
        expense_category: data.expense_category,
        amount: data.amount,
        notes: data.notes,
        // Set other fields to 0 for daily expenses
        rent: 0,
        utilities: 0,
        internet: 0,
        marketing: 0,
        travel: 0,
        miscellaneous: 0,
        monthly_total: data.amount,
      };

      await officeExpensesAPI.create(expenseData);
      
      toast({
        title: "Success",
        description: `Daily expense for ${selectedOffice.name} has been recorded.`,
      });
      
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating expense:', error);
      toast({
        title: "Error",
        description: "Failed to record office expense.",
        variant: "destructive",
      });
    }
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Daily Office Expense</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="office_id">Office *</Label>
            <Select
              value={selectedOfficeId ? selectedOfficeId.toString() : ""}
              onValueChange={(value) => setValue("office_id", parseInt(value))}
              disabled={loadingOffices}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingOffices ? "Loading offices..." : "Select office"} />
              </SelectTrigger>
              <SelectContent>
                {offices.map((office) => (
                  <SelectItem key={office.id} value={office.id.toString()}>
                    {office.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!selectedOfficeId && (
              <p className="text-sm text-destructive">Office selection is required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expense_date">Date *</Label>
            <Input
              id="expense_date"
              type="date"
              {...register("expense_date", { required: "Date is required" })}
            />
            {errors.expense_date && (
              <p className="text-sm text-destructive">{errors.expense_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense_category">Category *</Label>
            <Select
              value={watch("expense_category")}
              onValueChange={(value) => setValue("expense_category", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              {...register("amount", { 
                required: "Amount is required",
                valueAsNumber: true,
                min: { value: 0, message: "Amount must be positive" }
              })}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Add any additional notes about this expense..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedOfficeId}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                'Record Expense'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DailyOfficeExpenseForm;