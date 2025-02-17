import { body } from 'express-validator';

export const invoiceValidation = [
  body('clientId').notEmpty().withMessage('Client requis'),
  body('amount').isNumeric().withMessage('Montant invalide'),
  body('items').isArray().withMessage('Items requis'),
  body('items.*.description').notEmpty().withMessage('Description requise'),
  body('items.*.quantity').isNumeric().withMessage('Quantité invalide'),
  body('items.*.price').isNumeric().withMessage('Prix invalide'),
];