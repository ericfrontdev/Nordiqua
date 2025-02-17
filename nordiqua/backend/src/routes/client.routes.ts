import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { clientValidation } from '../validators/client.validator';

const router = Router();
const clientController = new ClientController();

router.use(authMiddleware);

router.get('/', clientController.getClients);
router.get('/:id', clientController.getClientById);
router.post('/', clientValidation, validate, clientController.createClient);
router.put('/:id', clientValidation, validate, clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

export const clientRoutes = router;