import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface InvoiceData {
  number: string;
  date: string;
  client: {
    name: string;
    address: string;
    email: string;
  };
  items: {
    description: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

export function generateInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF();
  
  // Add company logo and info
  doc.setFontSize(20);
  doc.text('InvoicePro', 20, 20);
  
  doc.setFontSize(10);
  doc.text('Facture', 20, 30);
  doc.text(`N° ${data.number}`, 20, 35);
  doc.text(`Date: ${new Date(data.date).toLocaleDateString('fr-FR')}`, 20, 40);
  
  // Add client information
  doc.text('Client:', 20, 55);
  doc.text(data.client.name, 20, 60);
  doc.text(data.client.address, 20, 65);
  doc.text(data.client.email, 20, 70);
  
  // Add items table
  const tableData = data.items.map(item => [
    item.description,
    item.quantity.toString(),
    `${item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
    `${(item.quantity * item.price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`
  ]);
  
  doc.autoTable({
    startY: 80,
    head: [['Description', 'Quantité', 'Prix unitaire', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
  });
  
  // Add total
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.text(
    `Total: ${data.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
    150,
    finalY + 20,
    { align: 'right' }
  );
  
  // Add footer
  doc.setFontSize(8);
  const footerText = 'InvoicePro - Système de facturation automatisé';
  doc.text(footerText, 105, 285, { align: 'center' });
  
  return doc;
}