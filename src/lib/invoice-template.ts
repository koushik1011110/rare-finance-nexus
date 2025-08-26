export interface InvoiceRenderItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface InvoiceRenderData {
  invoiceNumber: string;
  student: {
    first_name?: string;
    last_name?: string;
    email?: string | null;
    phone_number?: string | null;
    universities?: { name?: string } | null;
    courses?: { name?: string } | null;
    academic_sessions?: { session_name?: string } | null;
  } | null;
  currentDate?: string | null;
  dueDate?: string | null;
  status?: 'Paid' | 'Unpaid' | 'Due';
  items?: InvoiceRenderItem[];
  subtotal?: number;
  discountAmount?: number;
  gstAmount?: number;
  total?: number;
  terms?: string | null;
}

export const generateInvoiceHTML = (data: InvoiceRenderData) => {
  const { invoiceNumber, student, currentDate, dueDate, status, items = [], subtotal = 0, discountAmount = 0, gstAmount = 0, total = 0, terms = '' } = data;

  return `
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
            .student-details { margin-top: 10px }
            .student-details p { margin: 5px 0; font-size: 14px }
            @media print {
              body { margin: 0; padding: 15px; -webkit-print-color-adjust: exact; print-color-adjust: exact }
              .no-print { display: none }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${typeof window !== 'undefined' ? window.location.origin : ''}/rare.png" alt="Rare Education" class="logo" />
            <div class="company-name">Rare Education</div>
            <div class="invoice-title">INVOICE</div>
          </div>
          <div class="invoice-details">
            <div class="invoice-info">
              <h3>Invoice Information</h3>
              <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
              ${status === 'Paid' ? `<p><strong>Status:</strong> <span style="color:green; font-weight:bold">PAID</span></p>` : `<p><strong>Status:</strong> <span style="color:#dc2626; font-weight:bold">UNPAID</span></p>`}
              <p><strong>Date Issued:</strong> ${currentDate ? new Date(currentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
              <p><strong>Due Date:</strong> ${dueDate ? new Date(dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
            </div>
            <div class="student-info">
              <h3>Bill To</h3>
              <div class="student-details">
                <p><strong>${student?.first_name || ''} ${student?.last_name || ''}</strong></p>
                ${student?.email ? `<p>${student.email}</p>` : ''}
                ${student?.phone_number ? `<p>${student.phone_number}</p>` : ''}
                ${student?.universities?.name ? `<p>${student.universities.name}</p>` : ''}
                ${student?.courses?.name ? `<p>${student.courses.name}</p>` : ''}
                ${student?.academic_sessions?.session_name ? `<p>${student.academic_sessions.session_name}</p>` : ''}
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
                  <td>${item.description}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">$${item.unit_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td class="text-right">$${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
                <span>Discount: </span>
                <span>-$${discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            ` : ''}
            ${gstAmount > 0 ? `
              <div class="gst" style="margin-bottom: 10px; color: #1e40af; font-size: 14px;">
                <span>GST: </span>
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
            <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">Invoice generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">Print Invoice</button>
            <button onclick="window.close()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">Close</button>
          </div>
        </body>
      </html>
  `;
}

export default generateInvoiceHTML;
