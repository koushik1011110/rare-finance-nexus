
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { hostelsAPI, Hostel } from "@/lib/hostels-api";

export interface MessFormData {
  id?: number;
  name: string;
  hostel_id: string;
  location: string;
  capacity: string;
  monthly_rate: string;
  meal_types: string;
  operating_hours: string;
  contact_person: string;
  phone: string;
  email: string;
  facilities: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
}

interface MessFormProps {
  defaultValues?: MessFormData;
  onSubmit: (data: MessFormData) => void;
  isSubmitting?: boolean;
}

const MessForm: React.FC<MessFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<MessFormData>({
    name: defaultValues?.name || "",
    hostel_id: defaultValues?.hostel_id || "",
    location: defaultValues?.location || "",
    capacity: defaultValues?.capacity || "",
    monthly_rate: defaultValues?.monthly_rate || "",
    meal_types: defaultValues?.meal_types || "",
    operating_hours: defaultValues?.operating_hours || "",
    contact_person: defaultValues?.contact_person || "",
    phone: defaultValues?.phone || "",
    email: defaultValues?.email || "",
    facilities: defaultValues?.facilities || "",
    status: defaultValues?.status || "Active",
    ...defaultValues,
  });

  const [hostels, setHostels] = useState<Hostel[]>([]);

  useEffect(() => {
    const loadHostels = async () => {
      try {
        const hostelData = await hostelsAPI.getAll();
        setHostels(hostelData);
      } catch (error) {
        console.error('Error loading hostels:', error);
      }
    };
    loadHostels();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof MessFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Mess Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hostel_id">Associated Hostel</Label>
          <Select value={formData.hostel_id} onValueChange={(value) => handleChange("hostel_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a hostel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No hostel</SelectItem>
              {hostels.map((hostel) => (
                <SelectItem key={hostel.id} value={hostel.id.toString()}>
                  {hostel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity *</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => handleChange("capacity", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthly_rate">Monthly Rate *</Label>
          <Input
            id="monthly_rate"
            type="number"
            step="0.01"
            value={formData.monthly_rate}
            onChange={(e) => handleChange("monthly_rate", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meal_types">Meal Types *</Label>
          <Input
            id="meal_types"
            value={formData.meal_types}
            onChange={(e) => handleChange("meal_types", e.target.value)}
            placeholder="e.g., Breakfast, Lunch, Dinner"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="operating_hours">Operating Hours</Label>
          <Input
            id="operating_hours"
            value={formData.operating_hours}
            onChange={(e) => handleChange("operating_hours", e.target.value)}
            placeholder="e.g., 6:00 AM - 10:00 PM"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_person">Contact Person</Label>
          <Input
            id="contact_person"
            value={formData.contact_person}
            onChange={(e) => handleChange("contact_person", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="facilities">Facilities</Label>
        <Textarea
          id="facilities"
          value={formData.facilities}
          onChange={(e) => handleChange("facilities", e.target.value)}
          rows={3}
          placeholder="List available facilities..."
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : defaultValues?.id ? "Update Mess" : "Add Mess"}
        </Button>
      </div>
    </form>
  );
};

export default MessForm;
