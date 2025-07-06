import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Eye, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type ApplyStudent = Tables<"apply_students">;

interface DocumentViewerProps {
  student: ApplyStudent | null;
  isOpen: boolean;
  onClose: () => void;
}

interface DocumentItem {
  label: string;
  url?: string | null;
  fileName?: string;
}

export default function DocumentViewer({ student, isOpen, onClose }: DocumentViewerProps) {
  if (!student) return null;

  const documents: DocumentItem[] = [
    { label: "Student Photo", url: student.photo_url, fileName: "student_photo" },
    { label: "Passport Copy", url: student.passport_copy_url, fileName: "passport_copy" },
    { label: "Aadhaar Copy", url: student.aadhaar_copy_url, fileName: "aadhaar_copy" },
    { label: "12th Certificate", url: student.twelfth_certificate_url, fileName: "twelfth_certificate" },
    { label: "NEET Score Card", url: student.neet_score_card_url, fileName: "neet_score_card" },
    { label: "10th Marksheet", url: student.tenth_marksheet_url, fileName: "tenth_marksheet" },
    { label: "Affidavit Paper", url: student.affidavit_paper_url, fileName: "affidavit_paper" },
  ];

  const uploadedDocuments = documents.filter(doc => doc.url);

  const handleViewDocument = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadDocument = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Documents - {student.first_name} {student.last_name}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p>{student.first_name} {student.last_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Application ID</p>
                  <p>{student.admission_number || `RE-${student.id.toString().padStart(3, '0')}`}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={student.status === 'approved' ? 'default' : 'secondary'}>
                    {student.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Uploaded Documents ({uploadedDocuments.length}/{documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">No documents uploaded yet</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {uploadedDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{doc.label}</p>
                          <p className="text-sm text-muted-foreground">
                            Document uploaded
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(doc.url!)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(doc.url!, `${doc.fileName}_${student.first_name}_${student.last_name}`)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Missing Documents */}
          {uploadedDocuments.length < documents.length && (
            <Card>
              <CardHeader>
                <CardTitle className="text-amber-600">Missing Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {documents
                    .filter(doc => !doc.url)
                    .map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <X className="h-4 w-4 text-destructive" />
                        <span className="text-sm">{doc.label}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}