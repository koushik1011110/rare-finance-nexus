import React, { useState, useEffect } from "react";
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
import { Plus, Trash, FileText, Percent } from "lucide-react";
import { feeTypesAPI, type FeeType } from "@/lib/supabase-database";
import InvoiceGenerator from "@/components/fees/InvoiceGenerator";

interface InvoiceItem {
  feeTypeId: number;
  feeTypeName: string;
  amount: number;
  quantity: number;
}

const Invoice = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");

  const { data: feeTypes = [] } = useQuery({
    queryKey: ['feeTypes'],
    queryFn: feeTypesAPI.getAll,
  });

  useEffect(() => {
    // Set current date
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
    
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
    return Math.max(0, subtotal - discountAmount);
  };

  const generateInvoice = () => {
    if (!studentName || items.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in student name and add at least one item.",
        variant: "destructive",
      });
      return;
    }

    // Create invoice data for the generator
    const invoiceData = {
      student: {
        id: 1,
        first_name: studentName.split(' ')[0] || '',
        last_name: studentName.split(' ').slice(1).join(' ') || '',
        phone_number: studentPhone,
        email: studentEmail,
        universities: { name: 'N/A' },
        courses: { name: 'N/A' },
        academic_sessions: { session_name: 'N/A' }
      },
      payment: {
        id: 1,
        amount_paid: calculateTotal(),
        fee_structure_components: {
          fee_types: { name: items.map(item => item.feeTypeName).join(', ') },
          fee_structures: { name: 'Invoice Services' }
        }
      },
      receiptNumber: invoiceNumber
    };

    // Create a custom invoice window
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;

    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
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
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 10px;
              background: #3b82f6;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 24px;
              font-weight: bold;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin: 10px 0;
            }
            .invoice-title {
              font-size: 20px;
              color: #666;
              margin: 5px 0;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin: 30px 0;
            }
            .invoice-info, .student-info {
              flex: 1;
            }
            .invoice-info h3, .student-info h3 {
              color: #333;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
            }
            .details-table th, .details-table td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            .details-table th {
              background-color: #f8f9fa;
              font-weight: bold;
            }
            .text-right {
              text-align: right;
            }
            .total-section {
              text-align: right;
              margin: 30px 0;
              font-size: 18px;
            }
            .total-amount {
              font-weight: bold;
              color: #333;
              font-size: 24px;
            }
            .footer {
              text-align: center;
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">RE</div>
            <div class="company-name">Student Management System</div>
            <div class="invoice-title">INVOICE</div>
          </div>
          
          <div class="invoice-details">
            <div class="invoice-info">
              <h3>Invoice Information</h3>
              <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
              <p><strong>Invoice Date:</strong> ${new Date(currentDate).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
            </div>
            <div class="student-info">
              <h3>Bill To</h3>
              <p><strong>Name:</strong> ${studentName}</p>
              <p><strong>Email:</strong> ${studentEmail || 'N/A'}</p>
              <p><strong>Phone:</strong> ${studentPhone || 'N/A'}</p>
            </div>
          </div>
          
          <table class="details-table">
            <thead>
              <tr>
                <th>Service</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.feeTypeName}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">$${item.amount.toLocaleString()}</td>
                  <td class="text-right">$${(item.amount * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <p>Subtotal: $${subtotal.toLocaleString()}</p>
            ${discountAmount > 0 ? `<p>Discount (${discountType === 'percentage' ? discount + '%' : '$' + discount}): -$${discountAmount.toLocaleString()}</p>` : ''}
            <p class="total-amount">Total: $${total.toLocaleString()}</p>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>This invoice was generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Print Invoice</button>
            <button onclick="window.close()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentEmail">Email</Label>
                <Input
                  id="studentEmail"
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentPhone">Phone</Label>
                <Input
                  id="studentPhone"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
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