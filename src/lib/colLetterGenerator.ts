
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
  
  // Header with logo text (since image loading is problematic)
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 144, 255);
  doc.text('Rare Education', 20, 35);
  
  // Date - positioned on right
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  doc.text(`Date: ${currentDate}`, 150, 30);
  
  // Header line
  doc.setDrawColor(30, 144, 255);
  doc.setLineWidth(2);
  doc.line(20, 45, 190, 45);
  
  // Title - Conditional Offer Letter
  doc.setTextColor(30, 144, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CONDITIONAL OFFER LETTER', 20, 60);
  
  // Decorative line under title  
  doc.setDrawColor(255, 165, 0);
  doc.setLineWidth(1);
  doc.line(20, 65, 140, 65);
  
  // Add QR code placeholder on the right side
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(245, 245, 245);
  doc.rect(150, 75, 35, 35, 'FD');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text('QR CODE', 159, 95);
  
  // Student details section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const studentDetailsY = 85;
  const lineHeight = 8;
  
  // Student details with better icon representation using Unicode symbols
  
  // Student Name with person icon
  doc.setFillColor(30, 144, 255);
  doc.circle(27, studentDetailsY - 1, 2.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text('P', 25.8, studentDetailsY + 0.5);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Name:', 35, studentDetailsY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${student.first_name} ${student.last_name}`, 80, studentDetailsY);
  
  // Date of Birth with calendar icon
  doc.setFillColor(30, 144, 255);
  doc.circle(27, studentDetailsY + lineHeight - 1, 2.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text('D', 25.8, studentDetailsY + lineHeight + 0.5);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Date of Birth:', 35, studentDetailsY + lineHeight);
  doc.setFont('helvetica', 'normal');
  const formattedDOB = new Date(student.date_of_birth).toLocaleDateString('en-GB');
  doc.text(formattedDOB, 80, studentDetailsY + lineHeight);
  
  // Application ID with ID icon
  doc.setFillColor(30, 144, 255);
  doc.circle(27, studentDetailsY + (lineHeight * 2) - 1, 2.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text('ID', 25.2, studentDetailsY + (lineHeight * 2) + 0.5);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Application ID:', 35, studentDetailsY + (lineHeight * 2));
  doc.setFont('helvetica', 'normal');
  doc.text(student.admission_number || `RE-${student.id.toString().padStart(3, '0')}`, 80, studentDetailsY + (lineHeight * 2));
  
  // University with building icon
  doc.setFillColor(30, 144, 255);
  doc.circle(27, studentDetailsY + (lineHeight * 3) - 1, 2.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text('U', 25.8, studentDetailsY + (lineHeight * 3) + 0.5);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('University:', 35, studentDetailsY + (lineHeight * 3));
  doc.setFont('helvetica', 'normal');
  doc.text(student.university_name || 'Selected University', 80, studentDetailsY + (lineHeight * 3));
  
  // Course with book icon
  doc.setFillColor(30, 144, 255);
  doc.circle(27, studentDetailsY + (lineHeight * 4) - 1, 2.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text('C', 25.8, studentDetailsY + (lineHeight * 4) + 0.5);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Course:', 35, studentDetailsY + (lineHeight * 4));
  doc.setFont('helvetica', 'normal');
  doc.text(student.course_name || 'Selected Course', 80, studentDetailsY + (lineHeight * 4));
  
  // Letter body
  const bodyStartY = 130;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  let currentY = bodyStartY;
  
  // Greeting
  doc.setFont('helvetica', 'normal');
  doc.text(`Dear ${student.first_name} ${student.last_name},`, 20, currentY);
  currentY += 10;
  
  // Main content paragraphs
  const paragraphs = [
    `We are pleased to inform you that we have received your application for admission to ${student.university_name || 'the selected university'} for the ${student.course_name || 'selected course'} program for the academic session ${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}.`,
    
    `Your application is currently under review, and we will complete the verification of your submitted documents within the next few business days.`,
    
    `Upon successful verification of all required documents, you will be issued the official Admission Letter from ${student.university_name || 'the university'} within 3-5 working days. Please note that your admission is conditional and subject to:`,
    
    `• Successful verification of all submitted documents
• Meeting all academic requirements
• Completion of any required entrance examinations or interviews
• Payment of applicable fees as per university guidelines`,
    
    `This Conditional Offer Letter serves as confirmation that your application has been received and is being processed. We will notify you immediately once the verification process is complete.`
  ];
  
  paragraphs.forEach((paragraph, index) => {
    const lines = doc.splitTextToSize(paragraph, 170);
    lines.forEach((line: string) => {
      doc.text(line, 20, currentY);
      currentY += 5;
    });
    currentY += 3; // Space between paragraphs
  });
  
  // Important Note section
  currentY += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 144, 255);
  doc.text('IMPORTANT NOTE:', 20, currentY);
  currentY += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  const importantText = 'This is a computer-generated document and does not require any signature or seal. The authenticity of this letter can be verified through our official website using your application number.';
  const importantLines = doc.splitTextToSize(importantText, 170);
  importantLines.forEach((line: string) => {
    doc.text(line, 20, currentY);
    currentY += 5;
  });
  
  currentY += 10;
  doc.text('We appreciate your patience and look forward to assisting you with your admission process.', 20, currentY);
  currentY += 8;
  doc.text(`Thank you for choosing ${student.university_name || 'our services'}.`, 20, currentY);
  
  currentY += 15;
  doc.text('Best regards,', 20, currentY);
  currentY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Rare Education Team', 20, currentY);
  
  // Footer
  const footerY = currentY + 15;
  doc.setFillColor(248, 249, 250);
  doc.rect(20, footerY, 170, 30, 'F');
  doc.setDrawColor(30, 144, 255);
  doc.setLineWidth(2);
  doc.line(20, footerY, 190, footerY);
  
  doc.setTextColor(30, 144, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Rare Education', 25, footerY + 10);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Email: info@rareeducation.in | Website: www.rareeducation.in', 25, footerY + 18);
  doc.text('Address: 36, 2nd floor Ramahari Rd. opposite Metropolitan Girls high school', 25, footerY + 24);
  doc.text('near City College, Sai Mile, Guwahati, Assam 781022, India', 25, footerY + 28);
  
  // Generate filename and download
  const fileName = `COL_Letter_${student.first_name}_${student.last_name}_${currentDate.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
