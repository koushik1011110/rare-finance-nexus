import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { officesAPI, type Office } from "@/lib/supabase-database";

interface OfficeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  address: string;
  contact_person: string;
  phone: string;
  email: string;
  password: string;
  status: string;
}

const OfficeForm: React.FC<OfficeFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      address: "",
      contact_person: "",
      phone: "",
      email: "",
      password: "",
      status: "Active",
    },
  });

  const status = watch("status");

  const onSubmit = async (data: FormData) => {
    try {
      const officeData: Omit<Office, 'id' | 'created_at' | 'updated_at'> = {
        name: data.name,
        address: data.address || null,
        contact_person: data.contact_person || null,
        phone: data.phone || null,
        email: data.email || null,
        status: data.status,
      };

      await officesAPI.create(officeData);

      // Create user account for office login
      if (data.email && data.password) {
        try {
          await officesAPI.createOfficeUser(data.email, data.password, data.name);
        } catch (userError) {
          console.error('Error creating office user:', userError);
          toast({
            title: "Warning",
            description: "Office created but failed to create user account. Please create manually.",
            variant: "destructive",
          });
        }
      }
      
      toast({
        title: "Success",
        description: `Office ${data.name} has been created with login credentials.`,
      });
      
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating office:', error);
      toast({
        title: "Error",
        description: "Failed to create office.",
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
          <DialogTitle>Add Office</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Office Name *</Label>
              <Input
                id="name"
                {...register("name", { required: "Office name is required" })}
                placeholder="e.g., London Office"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setValue("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register("address")}
              placeholder="Office address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                {...register("contact_person")}
                placeholder="Contact person name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required for login access" })}
              placeholder="office@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: "Password is required for login access" })}
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
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
                'Create Office'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OfficeForm;