import jsPDF from 'jspdf';

interface StudentData {
  id: number;
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  phone_number?: string;
  email?: string;
  university_name?: string;
  course_name?: string;
  admission_number?: string;
}

export const generateCOLLetter = (student: StudentData): void => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Header - Logo placeholder and date
  doc.setFillColor(52, 152, 219); // Blue color
  doc.rect(20, 20, 170, 15, 'F');
  
  // Organization logo text (placeholder)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('📚 Rare Education', 25, 30);
  
  // Date
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  doc.text(`Date: ${currentDate}`, 150, 30);
  
  // QR Code placeholder (positioned on right side)
  doc.setDrawColor(52, 152, 219);
  doc.setLineWidth(2);
  doc.rect(150, 50, 40, 40);
  doc.setFontSize(8);
  doc.text('QR Code', 165, 70);
  doc.text(`ID: ${student.id}`, 160, 75);
  
  // Title
  doc.setFillColor(52, 152, 219);
  doc.rect(20, 45, 120, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Conditional Offer Letter', 25, 55);
  
  // Student details section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const studentDetailsY = 75;
  const lineHeight = 8;
  
  // Icons and details (using simple text icons)
  doc.setFont('helvetica', 'bold');
  doc.text('👤 Name:', 25, studentDetailsY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${student.first_name} ${student.last_name}`, 50, studentDetailsY);
  
  doc.setFont('helvetica', 'bold');
  doc.text('📅 DoB:', 25, studentDetailsY + lineHeight);
  doc.setFont('helvetica', 'normal');
  const formattedDOB = new Date(student.date_of_birth).toLocaleDateString('en-GB');
  doc.text(formattedDOB, 50, studentDetailsY + lineHeight);
  
  doc.setFont('helvetica', 'bold');
  doc.text('🆔 ID Number:', 25, studentDetailsY + (lineHeight * 2));
  doc.setFont('helvetica', 'normal');
  doc.text(student.admission_number || `RE-${student.id.toString().padStart(3, '0')}`, 65, studentDetailsY + (lineHeight * 2));
  
  doc.setFont('helvetica', 'bold');
  doc.text('🏛️ University:', 25, studentDetailsY + (lineHeight * 3));
  doc.setFont('helvetica', 'normal');
  doc.text(student.university_name || 'Selected University', 65, studentDetailsY + (lineHeight * 3));
  
  // Letter body
  const bodyStartY = 115;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const letterText = [
    `Dear ${student.first_name},`,
    '',
    `We are pleased to inform you that we have received your application for admission to`,
    `${student.university_name || 'University Name'} for the academic session ${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}. Your`,
    `application is currently under review, and we will complete the verification of your`,
    `submitted documents.`,
    '',
    `Upon successful verification, you will be issued the official Admission Letter from`,
    `${student.university_name || 'University Name'} within 3-5 working days. Please note that your admission is conditional`,
    `and subject to the successful verification of all your documents and passing the interview`,
    `exam if needed.`,
    '',
    'Important Note',
    '',
    'This is a computer-generated document and does not require any signature or seal. The',
    'authenticity of this letter can be verified through our website by scanning the QR code',
    'below or using your application number.',
    '',
    'We appreciate your patience and look forward to assisting you with your admission',
    'process. If you have any queries, feel free to contact our support team.',
    '',
    `Thank you for choosing ${student.university_name || 'University Name'}.`,
    '',
    'Best regards,',
  ];
  
  let currentY = bodyStartY;
  letterText.forEach((line, index) => {
    if (line === 'Important Note') {
      doc.setFont('helvetica', 'bold');
      doc.text(line, 25, currentY);
      doc.setFont('helvetica', 'normal');
    } else {
      doc.text(line, 25, currentY);
    }
    currentY += 5;
  });
  
  // Footer
  const footerY = currentY + 10;
  doc.setFillColor(52, 152, 219);
  doc.rect(20, footerY, 170, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('[Your Organization/University Admission Office]', 25, footerY + 8);
  doc.setFont('helvetica', 'normal');
  doc.text('📧 email id', 25, footerY + 15);
  doc.text('www.rareeducation.in', 25, footerY + 20);
  
  doc.setFontSize(8);
  doc.text('📍 36, 2nd floor Ramahari Rd. opposite Metropolitan Girls high school near', 100, footerY + 15);
  doc.text('City College, Sai Mile, Guwahati, Assam 781022, India', 100, footerY + 20);
  
  // Generate filename and download
  const fileName = `COL_Letter_${student.first_name}_${student.last_name}_${currentDate.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};