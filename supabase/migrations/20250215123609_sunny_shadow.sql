/*
  # Optimisation des politiques de sécurité et du trigger de création de profil

  1. Changements
    - Amélioration du trigger de création de profil
    - Optimisation des index
    - Nettoyage des politiques existantes

  2. Sécurité
    - Gestion robuste des profils utilisateur
    - Protection contre les doublons
    - Optimisation des performances
*/

-- Amélioration du trigger de création de profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  profile_exists boolean;
BEGIN
  -- Vérifier si le profil existe déjà
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = new.id
  ) INTO profile_exists;

  -- Si le profil n'existe pas, le créer
  IF NOT profile_exists THEN
    INSERT INTO public.users (id, email, name, role)
    VALUES (
      new.id,
      new.email,
      COALESCE(new.raw_user_meta_data->>'name', 'Utilisateur'),
      'user'
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recréation du trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ajout d'index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);