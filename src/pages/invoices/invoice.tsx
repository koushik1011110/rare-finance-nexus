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
import { invoicesAPI, type CreateInvoiceData } from '@/lib/invoices-api';
import generateInvoiceHTML from '@/lib/invoice-template';
import { useAuth } from '@/contexts/AuthContext';
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
  const [status, setStatus] = useState<'Paid' | 'Unpaid'>('Unpaid');
  const [student, setStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [applyGST, setApplyGST] = useState(false);
  const [gstPercentage, setGstPercentage] = useState(18); // Default GST percentage in India is 18%
  const [terms, setTerms] = useState(DEFAULT_TERMS);
  const [isSaving, setIsSaving] = useState(false);
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

  const { user } = useAuth();

  const generateInvoice = async () => {
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
  status,
      terms
    };

    // Persist invoice to database
    try {
      const invoiceData: CreateInvoiceData = {
        invoice_number: invoiceNumber,
        student_id: student.id,
        created_by: user ? `${user.firstName} ${user.lastName} <${user.email}>` : null,
        status,
        invoice_date: currentDate || new Date().toISOString().split('T')[0],
        due_date: dueDate || null,
        subtotal: calculateSubtotal(),
        discount_amount: calculateDiscount(),
        gst_amount: calculateGSTAmount(),
        total_amount: calculateTotal(),
        items: items.map(i => ({ description: i.feeTypeName, quantity: i.quantity, unit_price: i.amount, amount: i.amount * i.quantity })),
        terms,
      };
      await invoicesAPI.create(invoiceData);
    } catch (err) {
      console.error('Failed to save invoice:', err);
      toast({ title: 'Error', description: 'Failed to save invoice to database', variant: 'destructive' });
      // continue to open print view even if save fails
    }

    // Create a custom invoice window
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;

    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const gstAmount = calculateGSTAmount();
    const total = calculateTotal();

    const itemsForTemplate = items.map(item => ({ description: item.feeTypeName, quantity: item.quantity, unit_price: item.amount, amount: item.amount * item.quantity }));
    const invoiceHTML = generateInvoiceHTML({
      invoiceNumber,
      student,
      currentDate,
      dueDate,
      status,
      items: itemsForTemplate,
      subtotal,
      discountAmount,
      gstAmount,
      total,
      terms,
    });

    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();

    toast({
      title: "Invoice Generated",
      description: `Invoice ${invoiceNumber} has been generated successfully.`,
    });
  };

  const saveInvoice = async () => {
    if (!student || items.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select a student and add at least one item before saving.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const invoiceData: CreateInvoiceData = {
        invoice_number: invoiceNumber,
        student_id: student.id,
        created_by: user ? `${user.firstName} ${user.lastName} <${user.email}>` : null,
        status,
        invoice_date: currentDate || new Date().toISOString().split('T')[0],
        due_date: dueDate || null,
        subtotal: calculateSubtotal(),
        discount_amount: calculateDiscount(),
        gst_amount: calculateGSTAmount(),
        total_amount: calculateTotal(),
        items: items.map(i => ({ description: i.feeTypeName, quantity: i.quantity, unit_price: i.amount, amount: i.amount * i.quantity })),
        terms,
      };
      await invoicesAPI.create(invoiceData);

      toast({ title: 'Saved', description: `Invoice ${invoiceNumber} saved to database.` });
    } catch (err) {
      console.error('Error saving invoice:', err);
      toast({ title: 'Error', description: 'Failed to save invoice. See console for details.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="space-y-2 flex items-end">
                <div className="w-full">
                  <Label>Status</Label>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {status}
                      </span>
                    </div>
                    <div>
                      <Button size="sm" onClick={() => setStatus(prev => prev === 'Paid' ? 'Unpaid' : 'Paid')}>{status === 'Paid' ? 'Mark Unpaid' : 'Mark Paid'}</Button>
                    </div>
                  </div>
                </div>
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

        <div className="flex justify-end items-center gap-3">
          <Button onClick={saveInvoice} size="lg" className="flex items-center gap-2" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
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
