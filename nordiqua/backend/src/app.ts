import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clientRoutes } from './routes/client.routes';
import { invoiceRoutes } from './routes/invoice.routes';
import { authRoutes } from './routes/auth.routes';
import { testRoutes } from './routes/test.routes';
import { errorHandler } from './middleware/error.middleware';

// Charger les variables d'environnement avant tout
dotenv.config();

const app = express();

// Configuration CORS détaillée
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware de logging pour le débogage
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Middleware CORS
app.use(cors(corsOptions));
app.use(express.json());

// Route racine pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ 
    message: 'Serveur Nordiqua opérationnel',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Routes de test en premier pour le diagnostic
app.use('/test', testRoutes);

// Routes principales de l'API
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);

// Error handling
app.use(errorHandler);

// Récupérer le port depuis les variables d'environnement
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3200;

const startServer = async () => {
  try {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`
=================================
🚀 Serveur Nordiqua démarré
📍 URL: http://localhost:${PORT}
🔧 Environnement: ${process.env.NODE_ENV}
=================================
      `);
    });

    // Gestion propre de l'arrêt du serveur
    const cleanup = () => {
      console.info('Signal d\'arrêt reçu. Fermeture du serveur HTTP...');
      server.close(() => {
        console.log('Serveur HTTP arrêté');
        process.exit(0);
      });
    };

    process.on('SIGTERM', cleanup);
    process.on('SIGINT', cleanup);

  } catch (err) {
    console.error('Erreur fatale lors du démarrage du serveur:', err);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer().catch(err => {
  console.error('Erreur non gérée lors du démarrage:', err);
  process.exit(1);
});

export default app;