import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ 
        message: 'Authentification échouée',
        error: error.message 
      });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;
      const result = await this.authService.register(email, password, name);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ 
        message: 'Inscription échouée',
        error: error.message 
      });
    }
  };

  getCurrentUser = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const user = await this.authService.getCurrentUser(userId);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ 
        message: 'Utilisateur non trouvé',
        error: error.message 
      });
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const result = await this.authService.updateProfile(userId, req.body);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ 
        message: 'Mise à jour échouée',
        error: error.message 
      });
    }
  };
}