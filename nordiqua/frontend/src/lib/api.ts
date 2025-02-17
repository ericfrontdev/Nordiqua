import axios from 'axios';

// Récupérer l'URL de l'API depuis les variables d'environnement ou utiliser une valeur par défaut
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3200';

console.log('API URL:', API_URL);

// Créer une instance axios avec la configuration de base
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  // Augmenter le timeout pour le développement
  timeout: 10000,
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  console.log('Making request to:', config.url);
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
      });

      if (error.code === 'ECONNABORTED') {
        console.error('La requête a expiré. Vérifiez que le serveur backend est en cours d\'exécution.');
      }
      
      if (error.code === 'ERR_NETWORK') {
        console.error('Erreur réseau. Vérifiez que le serveur backend est accessible.');
      }

      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    } else {
      console.error('Erreur non-Axios:', error);
    }
    return Promise.reject(error);
  }
);

// Fonction de test de connexion
export const testConnection = async () => {
  try {
    console.log('Testing connection to:', `${API_URL}/test`);
    const response = await api.get('/test');
    console.log('Test connection successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Test connection failed:', error);
    throw error;
  }
};