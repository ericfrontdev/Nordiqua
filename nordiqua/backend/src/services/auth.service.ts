import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database';

export class AuthService {
  async login(email: string, password: string) {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (!user) {
        throw new Error('Identifiants invalides');
      }

      // Récupérer les informations supplémentaires de l'utilisateur depuis la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      const token = this.generateToken(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: userData.name,
          role: userData.role
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }

  async register(email: string, password: string, name: string) {
    try {
      // Créer l'utilisateur dans Supabase Auth
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;
      if (!user) throw new Error('Erreur lors de la création de l\'utilisateur');

      // Ajouter les informations supplémentaires dans la table users
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email,
            name,
            role: 'user'
          }
        ]);

      if (userError) throw userError;

      return {
        message: 'Utilisateur enregistré avec succès',
        user: {
          id: user.id,
          email: user.email,
          name,
          role: 'user'
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(userId: string) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (!user) throw new Error('Utilisateur non trouvé');

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    try {
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', userId);

      if (error) throw error;

      return { message: 'Profil mis à jour avec succès' };
    } catch (error) {
      throw error;
    }
  }

  private generateToken(userId: string) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET non défini');
    }

    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
  }
}