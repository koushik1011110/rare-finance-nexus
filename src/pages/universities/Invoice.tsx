import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash, FileText, Percent, Search } from "lucide-react";
import { feeTypesAPI, type FeeType } from "@/lib/supabase-database";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

// Define student type
interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  academic_session_id: number;
  university_id: number;
  course_id: number;
  universities?: { name: string };
  courses?: { name: string };
  academic_sessions?: { session_name: string };
}

interface InvoiceItem {
  feeTypeId: number;
  feeTypeName: string;
  amount: number;
  quantity: number;
}

// Default terms and conditions
const DEFAULT_TERMS = `1. Payment is due within 30 days of invoice date.
2. A 1.5% late fee will be applied to the invoice total for every 30 days that the invoice is overdue.
3. All payments should be made in full unless otherwise agreed in writing.
4. For any disputes or questions regarding this invoice, please contact our billing department within 7 days of receipt.`;

const Invoice = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [applyGST, setApplyGST] = useState(false);
  const [gstPercentage, setGstPercentage] = useState(18); // Default GST percentage in India is 18%
  const [terms, setTerms] = useState(DEFAULT_TERMS);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Student[]>([]);

  // Fetch fee types
  const { data: feeTypes = [] } = useQuery({
    queryKey: ['feeTypes'],
    queryFn: feeTypesAPI.getAll,
  });

  // Search for students
  const searchStudents = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          universities (name),
          courses (name),
          academic_sessions (session_name)
        `)
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone_number.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching students:', error);
      toast({
        title: "Error",
        description: "Failed to search for students. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timerId = setTimeout(() => {
      searchStudents(searchQuery);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Handle student selection
  const handleStudentSelect = (student: Student) => {
    setStudent(student);
    setSearchQuery(`${student.first_name} ${student.last_name}`);
    setSearchResults([]);
  };

  useEffect(() => {
    // Set current date
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
  // Default due date to 30 days after invoice date
  const due = new Date();
  due.setDate(due.getDate() + 30);
  setDueDate(due.toISOString().split('T')[0]);
    
    // Generate invoice number (simple increment - in real app, use database sequence)
    const invoiceNum = `INV-${Date.now().toString().slice(-6)}`;
    setInvoiceNumber(invoiceNum);
  }, []);

  const addItem = () => {
    setItems([...items, { feeTypeId: 0, feeTypeName: "", amount: 0, quantity: 1 }]);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...items];
    if (field === "feeTypeId") {
      const selectedFeeType = feeTypes.find(ft => ft.id === Number(value));
      if (selectedFeeType) {
        updated[index] = {
          ...updated[index],
          feeTypeId: selectedFeeType.id,
          feeTypeName: selectedFeeType.name,
          amount: selectedFeeType.amount,
        };
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === "percentage") {
      return (subtotal * discount) / 100;
    }
    return discount;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const afterDiscount = Math.max(0, subtotal - discountAmount);
    
    // Apply GST if enabled
    if (applyGST && gstPercentage > 0) {
      const gstAmount = (afterDiscount * gstPercentage) / 100;
      return afterDiscount + gstAmount;
    }
    
    return afterDiscount;
  };
  
  const calculateGSTAmount = () => {
    if (!applyGST || gstPercentage <= 0) return 0;
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const afterDiscount = Math.max(0, subtotal - discountAmount);
    return (afterDiscount * gstPercentage) / 100;
  };

  const generateInvoice = () => {
    if (!student || items.length === 0) {
      toast({
        title: "Error",
        description: "Please select a student and add at least one item.",
        variant: "destructive",
      });
      return;
    }

    // Create invoice data for the generator
    const invoiceData = {
      student: {
        ...student,
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        phone_number: student.phone_number || '',
        email: student.email || '',
        universities: student.universities || { name: 'N/A' },
        courses: student.courses || { name: 'N/A' },
        academic_sessions: student.academic_sessions || { session_name: 'N/A' }
      },
      payment: {
        id: 1,
        amount_paid: calculateTotal(),
        fee_structure_components: {
          fee_types: { name: items.map(item => item.feeTypeName).join(', ') },
          fee_structures: { name: 'Invoice Services' }
        }
      },
      receiptNumber: invoiceNumber,
  dueDate,
      terms
    };

    // Create a custom invoice window
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;

    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const gstAmount = calculateGSTAmount();
    const total = calculateTotal();

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoiceNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background: white;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              width: 120px;
              height: auto;
              margin: 0 auto 5px;
              display: block;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #1e40af;
              margin: 10px 0 5px;
            }
            .invoice-title {
              font-size: 20px;
              color: #4b5563;
              margin: 5px 0;
              letter-spacing: 1px;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 11px;
            }
            .invoice-info, .student-info {
              flex: 1;
              min-width: 250px;
              background: #f9fafb;
              padding: 15px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .invoice-info h3, .student-info h3 {
              color: #1e40af;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 8px;
              margin-top: 0;
              font-size: 16px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
              font-size: 11px;
            }
            .details-table th, .details-table td {
              border: 1px solid #e5e7eb;
              padding: 12px 15px;
              text-align: left;
            }
            .details-table th {
              background-color: #f3f4f6;
              font-weight: 600;
              color: #374151;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 0.5px;
            }
            .total-section {
              text-align: right;
              margin: 30px 0;
              font-size: 16px;
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .total-amount {
              font-weight: bold;
              color: #1e40af;
              font-size: 20px;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 1px solid #e5e7eb;
            }
            .footer {
              margin-top: 15px;
              padding-top: 5px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 10px;
              color: #6b7280;
            }
            .terms {
              margin-top: 15px;
              padding-top: 5px;
              font-size: 10px;
              border-top: 1px solid #e5e7eb;
            }
            .terms h3 {
              color: #1e40af;
              margin-top: 0;
              padding-bottom: 8px;
              border-bottom: 1px solid #e5e7eb;
            }
            .terms-content {
              white-space: pre-line;
              font-size: 13px;
              line-height: 1.6;
              color: #4b5563;
            }
            .student-details {
              margin-top: 10px;
            }
            .student-details p {
              margin: 5px 0;
              font-size: 14px;
            }
            @media print {
              body { 
                margin: 0;
                padding: 15px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .no-print { 
                display: none; 
              }
              .header {
                margin-bottom: 20px;
              }
              .invoice-details {
                margin: 20px 0;
              }
              .details-table {
                font-size: 12px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${window.location.origin}/rare.png" alt="Rare Education" class="logo" />
            <div class="company-name">Rare Education</div>
            <div class="invoice-title">INVOICE</div>
          </div>
          
          <div class="invoice-details">
            <div class="invoice-info">
              <h3>Invoice Information</h3>
              <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
              <p><strong>Date Issued:</strong> ${currentDate ? new Date(currentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
              <p><strong>Due Date:</strong> ${dueDate ? new Date(dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div class="student-info">
              <h3>Bill To</h3>
              <div class="student-details">
                <p><strong>${student.first_name} ${student.last_name}</strong></p>
                ${student.email ? `<p>${student.email}</p>` : ''}
                ${student.phone_number ? `<p>${student.phone_number}</p>` : ''}
                ${student.universities?.name ? `<p>${student.universities.name}</p>` : ''}
                ${student.courses?.name ? `<p>${student.courses.name}</p>` : ''}
                ${student.academic_sessions?.session_name ? `<p>${student.academic_sessions.session_name}</p>` : ''}
              </div>
            </div>
          </div>
          
          <table class="details-table">
            <thead>
              <tr>
                <th>Service Description</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.feeTypeName}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">$${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td class="text-right">$${(item.amount * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div style="margin-bottom: 10px;">
              <span>Subtotal: </span>
              <span>$${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            ${discountAmount > 0 ? `
              <div style="margin-bottom: 10px; color: #dc2626;">
                <span>Discount (${discountType === 'percentage' ? discount + '%' : '$' + discount}): </span>
                <span>-$${discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            ` : ''}
            ${applyGST && gstAmount > 0 ? `
              <div class="gst" style="margin-bottom: 10px; color: #1e40af; font-size: 14px;">
                <span>GST (${gstPercentage}%): </span>
                <span>$${gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
             ` : ''}
            <div class="total-amount">
              <span>Total Due: </span>
              <span>$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          ${terms ? `
            <div class="terms">
              <h3>Terms & Conditions</h3>
              <div class="terms-content">${terms}</div>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>Thank you for choosing Rare Education. Please make payment by the due date to avoid any late fees.</p>
            <p>For any inquiries, please contact our billing department at billing@rare-education.com</p>
            <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
              Invoice generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          
          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
              Print Invoice
            </button>
            <button onclick="window.close()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">
              Close
            </button>
          </div>
        </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();

    toast({
      title: "Invoice Generated",
      description: `Invoice ${invoiceNumber} has been generated successfully.`,
    });
  };

  const subtotal = calculateSubtotal();
  const discountAmount = calculateDiscount();
  const total = calculateTotal();

  return (
    <MainLayout>
      <PageHeader
        title="Create Invoice"
        description="Generate invoices for student services"
      />
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceNumber}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentDate">Invoice Date</Label>
                <Input
                  id="currentDate"
                  type="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Search Student *</Label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value === '') {
                        setStudent(null);
                      }
                    }}
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-60 overflow-auto">
                    {searchResults.map((student) => (
                      <div
                        key={student.id}
                        className="cursor-pointer px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleStudentSelect(student)}
                      >
                        <div className="font-medium">{student.first_name} {student.last_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {student.email} • {student.phone_number}
                        </div>
                        {student.universities?.name && (
                          <div className="text-xs text-muted-foreground">
                            {student.universities.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {student && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm">{student.first_name} {student.last_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm">{student.email || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm">{student.phone_number || 'N/A'}</p>
                </div>
                {student.universities?.name && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">University</p>
                    <p className="text-sm">{student.universities.name}</p>
                  </div>
                )}
                {student.courses?.name && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Course</p>
                    <p className="text-sm">{student.courses.name}</p>
                  </div>
                )}
                {student.academic_sessions?.session_name && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Academic Session</p>
                    <p className="text-sm">{student.academic_sessions.session_name}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Services
              <Button onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Service Type *</Label>
                  <Select
                    value={item.feeTypeId.toString()}
                    onValueChange={(value) => updateItem(index, "feeTypeId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {feeTypes.map((feeType) => (
                        <SelectItem key={feeType.id} value={feeType.id.toString()}>
                          {feeType.name} - ${feeType.amount}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unit Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.amount}
                    onChange={(e) => updateItem(index, "amount", parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Total</Label>
                  <div className="p-2 bg-muted rounded">
                    ${(item.amount * item.quantity).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Terms and Conditions</Label>
              <Textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="min-h-[120px]"
                placeholder="Enter terms and conditions for this invoice..."
              />
              <p className="text-sm text-muted-foreground">
                These terms will be displayed at the bottom of the invoice.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Discount & Total</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={discountType}
                  onValueChange={(value: "percentage" | "fixed") => setDiscountType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  placeholder={discountType === "percentage" ? "Enter percentage" : "Enter amount"}
                />
              </div>
            </div>

            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label>GST Options</Label>
                <Select
                  value={applyGST ? "gst" : "without-gst"}
                  onValueChange={(value) => setApplyGST(value === "gst")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="without-gst">Without GST</SelectItem>
                    <SelectItem value="gst">GST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {applyGST && (
                <div className="space-y-2">
                  <Label>GST Percentage (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={gstPercentage}
                    onChange={(e) => setGstPercentage(parseFloat(e.target.value) || 0)}
                    placeholder="Enter GST percentage"
                  />
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2 text-right">
              <div className="text-lg">
                <span>Subtotal: </span>
                <span className="font-semibold">${subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="text-lg text-red-600">
                  <span>Discount: </span>
                  <span className="font-semibold">-${discountAmount.toLocaleString()}</span>
                </div>
              )}
              {applyGST && gstPercentage > 0 && (
                <div className="text-lg text-blue-600">
                  <span>GST ({gstPercentage}%): </span>
                  <span className="font-semibold">${calculateGSTAmount().toLocaleString()}</span>
                </div>
              )}
              <div className="text-2xl font-bold">
                <span>Total: </span>
                <span className="text-primary">${total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={generateInvoice} size="lg" className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Invoice
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Invoice;