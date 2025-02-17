import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { loginValidation, registerValidation, updateProfileValidation } from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

// Routes publiques
router.post('/login', loginValidation, validate, authController.login);
router.post('/register', registerValidation, validate, authController.register);

// Routes protégées
router.get('/me', authMiddleware, authController.getCurrentUser);
router.patch('/profile', authMiddleware, updateProfileValidation, validate, authController.updateProfile);

export const authRoutes = router;