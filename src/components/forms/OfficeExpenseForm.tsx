import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { officeExpensesAPI, type OfficeExpense } from "@/lib/supabase-database";

interface OfficeExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  location: string;
  month: string;
  rent: number;
  utilities: number;
  internet: number;
  marketing: number;
  travel: number;
  miscellaneous: number;
}

const OfficeExpenseForm: React.FC<OfficeExpenseFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      location: "",
      month: "",
      rent: 0,
      utilities: 0,
      internet: 0,
      marketing: 0,
      travel: 0,
      miscellaneous: 0,
    },
  });

  const watchedValues = watch();

  // Calculate monthly total automatically
  const monthlyTotal = 
    (watchedValues.rent || 0) +
    (watchedValues.utilities || 0) +
    (watchedValues.internet || 0) +
    (watchedValues.marketing || 0) +
    (watchedValues.travel || 0) +
    (watchedValues.miscellaneous || 0);

  const onSubmit = async (data: FormData) => {
    try {
      const expenseData: Omit<OfficeExpense, 'id' | 'created_at' | 'updated_at'> = {
        location: data.location,
        month: data.month,
        rent: data.rent,
        utilities: data.utilities,
        internet: data.internet,
        marketing: data.marketing,
        travel: data.travel,
        miscellaneous: data.miscellaneous,
        monthly_total: monthlyTotal,
      };

      await officeExpensesAPI.create(expenseData);
      
      toast({
        title: "Success",
        description: `Office expense for ${data.location} has been created.`,
      });
      
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating expense:', error);
      toast({
        title: "Error",
        description: "Failed to create office expense.",
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Office Expense</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Office Location *</Label>
              <Input
                id="location"
                {...register("location", { required: "Office location is required" })}
                placeholder="e.g., London Office"
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="month">Month *</Label>
              <Input
                id="month"
                type="date"
                {...register("month", { required: "Month is required" })}
              />
              {errors.month && (
                <p className="text-sm text-destructive">{errors.month.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rent">Rent</Label>
              <Input
                id="rent"
                type="number"
                step="0.01"
                min="0"
                {...register("rent", { 
                  valueAsNumber: true,
                  min: { value: 0, message: "Amount must be positive" }
                })}
                placeholder="0.00"
              />
              {errors.rent && (
                <p className="text-sm text-destructive">{errors.rent.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="utilities">Utilities</Label>
              <Input
                id="utilities"
                type="number"
                step="0.01"
                min="0"
                {...register("utilities", { 
                  valueAsNumber: true,
                  min: { value: 0, message: "Amount must be positive" }
                })}
                placeholder="0.00"
              />
              {errors.utilities && (
                <p className="text-sm text-destructive">{errors.utilities.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="internet">Internet</Label>
              <Input
                id="internet"
                type="number"
                step="0.01"
                min="0"
                {...register("internet", { 
                  valueAsNumber: true,
                  min: { value: 0, message: "Amount must be positive" }
                })}
                placeholder="0.00"
              />
              {errors.internet && (
                <p className="text-sm text-destructive">{errors.internet.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="marketing">Marketing</Label>
              <Input
                id="marketing"
                type="number"
                step="0.01"
                min="0"
                {...register("marketing", { 
                  valueAsNumber: true,
                  min: { value: 0, message: "Amount must be positive" }
                })}
                placeholder="0.00"
              />
              {errors.marketing && (
                <p className="text-sm text-destructive">{errors.marketing.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="travel">Travel</Label>
              <Input
                id="travel"
                type="number"
                step="0.01"
                min="0"
                {...register("travel", { 
                  valueAsNumber: true,
                  min: { value: 0, message: "Amount must be positive" }
                })}
                placeholder="0.00"
              />
              {errors.travel && (
                <p className="text-sm text-destructive">{errors.travel.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="miscellaneous">Miscellaneous</Label>
              <Input
                id="miscellaneous"
                type="number"
                step="0.01"
                min="0"
                {...register("miscellaneous", { 
                  valueAsNumber: true,
                  min: { value: 0, message: "Amount must be positive" }
                })}
                placeholder="0.00"
              />
              {errors.miscellaneous && (
                <p className="text-sm text-destructive">{errors.miscellaneous.message}</p>
              )}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">Monthly Total:</span>
              <span className="text-lg font-bold">${monthlyTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Expense'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OfficeExpenseForm;