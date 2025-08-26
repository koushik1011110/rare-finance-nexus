import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import generateInvoiceHTML from '@/lib/invoice-template';
import { invoicesAPI } from '@/lib/invoices-api';
import { useQuery } from '@tanstack/react-query';

const AllInvoices = () => {
  const { data: invoices = [], refetch, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: invoicesAPI.getAll,
  });

  const viewInvoice = (inv: any) => {
    const items = Array.isArray(inv.items) ? inv.items : [];
    const itemsForTemplate = items.map((it: any) => ({ description: it.description || it.feeTypeName || '', quantity: it.quantity || 1, unit_price: it.unit_price || it.unitPrice || 0, amount: it.amount || (it.quantity * (it.unit_price || it.unitPrice || 0)) }));

    const html = generateInvoiceHTML({
      invoiceNumber: inv.invoice_number,
      student: inv.students || null,
      currentDate: inv.invoice_date || null,
      dueDate: inv.due_date || null,
      status: inv.status,
      items: itemsForTemplate,
      subtotal: inv.subtotal || 0,
      discountAmount: inv.discount_amount || 0,
      gstAmount: inv.gst_amount || 0,
      total: inv.total_amount || 0,
      terms: inv.terms || null,
    });

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
  };

  const whatsappInvoice = (inv: any) => {
    const studentPhone = inv.students?.phone_number || '';
    const studentName = inv.students ? `${inv.students.first_name} ${inv.students.last_name}` : 'Customer';
    const lines = [];
    lines.push(`Invoice: ${inv.invoice_number}`);
    lines.push(`To: ${studentName}`);
    if (inv.invoice_date) lines.push(`Date: ${new Date(inv.invoice_date).toLocaleDateString()}`);
    lines.push(`Total: $${(inv.total_amount || 0).toFixed(2)}`);
    lines.push('Thank you for your business.');

    const text = encodeURIComponent(lines.join('\n'));

    // Use wa.me if phone is available, otherwise open WhatsApp web with message only
    if (studentPhone) {
      // Ensure phone number is in international format without + or spaces for wa.me
      const clean = studentPhone.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${clean}?text=${text}`;
      window.open(waUrl, '_blank');
    } else {
      const waUrl = `https://web.whatsapp.com/send?text=${text}`;
      window.open(waUrl, '_blank');
    }
  };

  return (
    <MainLayout>
      <PageHeader title="All Invoices" description="List of generated invoices" />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left">
                    <th className="px-4 py-2">Invoice #</th>
                    <th className="px-4 py-2">Student</th>
                    <th className="px-4 py-2">Created By</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Due Date</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoices as any[]).map((inv: any) => (
                    <tr key={inv.id} className="border-t">
                      <td className="px-4 py-2">{inv.invoice_number}</td>
                      <td className="px-4 py-2">{inv.students ? `${inv.students.first_name} ${inv.students.last_name}` : 'N/A'}</td>
                      <td className="px-4 py-2">{inv.created_by || 'N/A'}</td>
                      <td className="px-4 py-2">{inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString() : ''}</td>
                      <td className="px-4 py-2">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : ''}</td>
                      <td className="px-4 py-2">{inv.status}</td>
                      <td className="px-4 py-2">${inv.total_amount?.toFixed(2) || '0.00'}</td>
                      <td className="px-4 py-2">{/* view / whatsapp */}
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => viewInvoice(inv)}>
                            <FileText className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button size="sm" onClick={() => whatsappInvoice(inv)} aria-label="Send via WhatsApp">
                            {/* simple WhatsApp SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone">
                              <path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 1 4.18 2 2 0 0 1 3 2h4.09a2 2 0 0 1 2 1.72c.12.9.38 1.77.78 2.59a2 2 0 0 1-.45 2.11L8.91 10.91a16 16 0 0 0 6 6l1.48-1.48a2 2 0 0 1 2.11-.45c.82.4 1.69.66 2.59.78A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AllInvoices;
