
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface AgentFormData {
  name: string;
  contact_person: string;
  email: string;
  phone?: string;
  location?: string;
  commission_rate?: number;
  status: 'active' | 'inactive';
}

interface AgentFormProps {
  onSubmit?: (data: AgentFormData) => void;
  defaultValues?: Partial<AgentFormData>;
  isSubmitting?: boolean;
}

const AgentForm: React.FC<AgentFormProps> = ({
  onSubmit,
  defaultValues,
  isSubmitting = false
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AgentFormData>({
    defaultValues: {
      name: defaultValues?.name || "",
      contact_person: defaultValues?.contact_person || "",
      email: defaultValues?.email || "",
      phone: defaultValues?.phone || "",
      location: defaultValues?.location || "",
      commission_rate: defaultValues?.commission_rate || 10,
      status: defaultValues?.status || 'active',
    }
  });

  const status = watch('status');

  const onFormSubmit = (data: AgentFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Agent Name *</Label>
          <Input
            id="name"
            {...register("name", { required: "Agent name is required" })}
            placeholder="Enter agent name"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_person">Contact Person *</Label>
          <Input
            id="contact_person"
            {...register("contact_person", { required: "Contact person is required" })}
            placeholder="Enter contact person name"
          />
          {errors.contact_person && (
            <p className="text-sm text-red-600">{errors.contact_person.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address"
              }
            })}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="Enter phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="Enter location"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="commission_rate">Commission Rate (%)</Label>
          <Input
            id="commission_rate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register("commission_rate", { valueAsNumber: true })}
            placeholder="Enter commission rate"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={status} onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Save Agent"}
      </Button>
    </form>
  );
};

export default AgentForm;
