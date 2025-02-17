import { Router } from 'express';
import { supabase } from '../config/database';

const router = Router();

// Route de test simple
router.get('/', (req, res) => {
  res.json({ message: 'API de test fonctionnelle' });
});

// Test de la connexion à la base de données
router.get('/test-db', async (req, res) => {
  try {
    // Test de connexion basique
    const { data: healthCheck, error: healthError } = await supabase.from('users').select('count');
    
    if (healthError) {
      console.error('Erreur de connexion à Supabase:', healthError);
      return res.status(500).json({
        success: false,
        message: 'Erreur de connexion à la base de données',
        error: healthError.message,
        details: {
          code: healthError.code,
          hint: healthError.hint,
          details: healthError.details
        }
      });
    }

    // Test des variables d'environnement
    const envCheck = {
      supabaseUrl: !!process.env.SUPABASE_URL,
      supabaseKey: !!process.env.SUPABASE_ANON_KEY,
      supabaseKeyLength: process.env.SUPABASE_ANON_KEY?.length
    };

    res.json({
      success: true,
      message: 'Connexion à Supabase établie avec succès',
      data: healthCheck,
      environment: envCheck
    });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur inattendue lors du test de connexion',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

// Test des variables d'environnement
router.get('/env', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL ? 'Défini' : 'Non défini',
    supabaseKeyPresent: process.env.SUPABASE_ANON_KEY ? 'Défini' : 'Non défini',
    port: process.env.PORT
  });
});

// Test de l'authentification
router.post('/auth', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Test de création d'un utilisateur
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      return res.status(400).json({
        success: false,
        message: 'Erreur lors de la création de l\'utilisateur',
        error: signUpError.message
      });
    }

    res.json({
      success: true,
      message: 'Test d\'authentification réussi',
      data: {
        user: signUpData.user,
        session: signUpData.session
      }
    });
  } catch (error) {
    console.error('Erreur lors du test d\'authentification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur inattendue lors du test d\'authentification',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

export const testRoutes = router;