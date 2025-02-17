import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Variables d\'environnement manquantes:', {
    SUPABASE_URL: !!supabaseUrl,
    SUPABASE_ANON_KEY: !!supabaseKey
  });
  throw new Error('Les variables d\'environnement SUPABASE_URL et SUPABASE_ANON_KEY sont requises');
}

console.log('Tentative de connexion à Supabase avec:', {
  url: supabaseUrl,
  keyLength: supabaseKey.length
});

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// Test immédiat de la connexion
(async () => {
  try {
    const { data, error } = await supabase.from('users').select('count');
    if (error) {
      console.error('Erreur lors du test de connexion à Supabase:', error);
    } else {
      console.log('Connexion à Supabase établie avec succès');
    }
  } catch (err) {
    console.error('Erreur inattendue lors du test de connexion:', err);
  }
})();