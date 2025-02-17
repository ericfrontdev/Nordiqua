import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoice.service';

export class InvoiceController {
  private invoiceService: InvoiceService;

  constructor() {
    this.invoiceService = new InvoiceService();
  }

  getInvoices = async (req: Request, res: Response) => {
    try {
      const invoices = await this.invoiceService.getAll();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching invoices' });
    }
  };

  getInvoiceById = async (req: Request, res: Response) => {
    try {
      const invoice = await this.invoiceService.getById(req.params.id);
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching invoice' });
    }
  };

  createInvoice = async (req: Request, res: Response) => {
    try {
      const invoice = await this.invoiceService.create(req.body);
      res.status(201).json(invoice);
    } catch (error) {
      res.status(400).json({ message: 'Error creating invoice' });
    }
  };

  updateInvoice = async (req: Request, res: Response) => {
    try {
      const invoice = await this.invoiceService.update(req.params.id, req.body);
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      res.status(400).json({ message: 'Error updating invoice' });
    }
  };

  deleteInvoice = async (req: Request, res: Response) => {
    try {
      await this.invoiceService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting invoice' });
    }
  };

  generatePDF = async (req: Request, res: Response) => {
    try {
      const pdf = await this.invoiceService.generatePDF(req.params.id);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
      res.send(pdf);
    } catch (error) {
      res.status(500).json({ message: 'Error generating PDF' });
    }
  };
}