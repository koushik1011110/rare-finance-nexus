
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image, Download, Eye } from "lucide-react";

interface StudentDocumentsProps {
  student: {
    photo_url?: string;
    passport_copy_url?: string;
    aadhaar_copy_url?: string;
    twelfth_certificate_url?: string;
    neet_score_card_url?: string;
    tenth_marksheet_url?: string;
    affidavit_paper_url?: string;
    admission_letter_url?: string;
  };
}

const documentFields = [
  { key: 'photo_url', label: 'Student Photo', icon: Image },
  { key: 'passport_copy_url', label: 'Passport Copy', icon: FileText },
  { key: 'aadhaar_copy_url', label: 'Aadhaar Copy', icon: FileText },
  { key: 'twelfth_certificate_url', label: '12th Certificate', icon: FileText },
  { key: 'neet_score_card_url', label: 'NEET Score Card', icon: FileText },
  { key: 'tenth_marksheet_url', label: '10th Marksheet', icon: FileText },
  { key: 'affidavit_paper_url', label: 'Affidavit Paper', icon: FileText },
  { key: 'admission_letter_url', label: 'Admission Letter', icon: FileText },
];

export default function StudentDocuments({ student }: StudentDocumentsProps) {
  const handleViewDocument = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadDocument = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const availableDocuments = documentFields.filter(field => 
    student[field.key as keyof typeof student]
  );

  if (availableDocuments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No documents uploaded yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Documents ({availableDocuments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableDocuments.map((field) => {
            const url = student[field.key as keyof typeof student] as string;
            const IconComponent = field.icon;
            
            return (
              <div key={field.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <IconComponent className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium text-sm">{field.label}</span>
                  </div>
                </div>
                
                {field.key === 'photo_url' && (
                  <div className="mb-3">
                    <img 
                      src={url} 
                      alt="Student" 
                      className="w-20 h-20 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDocument(url)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadDocument(url, `${field.label}.pdf`)}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
