
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image, Download, Eye, ExternalLink } from "lucide-react";

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

            const filename = (() => {
              try {
                const parts = url.split('/');
                return decodeURIComponent(parts[parts.length - 1] || url);
              } catch {
                return url;
              }
            })();

            const isImage = /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url) || field.key === 'photo_url';

            return (
              <div key={field.key} className="border rounded-lg p-4 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <IconComponent className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium text-sm">{field.label}</span>
                  </div>
                </div>

                {isImage ? (
                  <div className="mb-3 flex items-center">
                    <img
                      src={url}
                      alt={field.label}
                      className="w-28 h-36 object-cover rounded border cursor-pointer"
                      loading="lazy"
                      onClick={() => handleViewDocument(url)}
                      onError={(e) => {
                        // show a simple placeholder if image fails
                        (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="ml-4">
                      <p className="text-sm font-medium">{filename}</p>
                      <p className="text-xs text-muted-foreground">Click image to open full size</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{filename}</p>
                      <p className="text-xs text-muted-foreground">{new URL(url).pathname.split('/').pop()}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDocument(url)}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open
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
