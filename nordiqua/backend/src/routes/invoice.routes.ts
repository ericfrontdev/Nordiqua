import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { invoiceValidation } from '../validators/invoice.validator';

const router = Router();
const invoiceController = new InvoiceController();

router.use(authMiddleware);

router.get('/', invoiceController.getInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.post('/', invoiceValidation, validate, invoiceController.createInvoice);
router.put('/:id', invoiceValidation, validate, invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);
router.get('/:id/pdf', invoiceController.generatePDF);

export const invoiceRoutes = router;