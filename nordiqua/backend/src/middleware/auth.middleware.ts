import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET non défini');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    
    // Vérifier que l'utilisateur existe toujours dans Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    (req as any).user = {
      userId: decoded.userId,
      role: user.role
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userRole = (req as any).user?.role;
  
  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }

  next();
};