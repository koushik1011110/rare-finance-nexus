
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { toast } from "@/hooks/use-toast";
import EnhancedStudentAdmissionForm, { EnhancedStudentFormData } from "@/components/forms/EnhancedStudentAdmissionForm";
import { studentsAPI } from "@/lib/supabase-database";

interface FileData {
  photo?: File;
  passport?: File;
  aadhaar?: File;
  certificate_12th?: File;
}

const StudentAdmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: EnhancedStudentFormData, files: FileData) => {
    setIsSubmitting(true);

    try {
      // TODO: Upload files to storage and get URLs
      // For now, we'll submit without file URLs
      const studentData = {
        ...formData,
        // File URLs would be set here after upload
        photo_url: undefined,
        passport_url: undefined,
        aadhaar_url: undefined,
        certificate_12th_url: undefined,
      };

      await studentsAPI.create(studentData);
      
      toast({
        title: "Student Admission Submitted",
        description: `${formData.first_name} ${formData.last_name} has been successfully admitted.`,
      });

      // Reset form by reloading the page
      window.location.reload();
      
    } catch (error) {
      console.error('Error submitting student admission:', error);
      toast({
        title: "Error",
        description: "Failed to submit student admission. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Student Admission"
        description="Admit new students with comprehensive information"
      />
      
      <div className="max-w-4xl mx-auto">
        <EnhancedStudentAdmissionForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </MainLayout>
  );
};

export default StudentAdmission;
