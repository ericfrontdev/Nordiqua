import { body } from 'express-validator';

export const clientValidation = [
  body('name').notEmpty().withMessage('Nom requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('phone').optional(),
  body('address').notEmpty().withMessage('Adresse requise'),
];