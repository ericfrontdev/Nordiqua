/*
  # Correction de la création des données utilisateur

  1. Changements
    - Ajout d'une fonction trigger pour créer automatiquement le profil utilisateur
    - Modification des politiques pour une meilleure gestion des données

  2. Sécurité
    - Création automatique du profil lors de l'inscription
    - Politiques de sécurité ajustées pour une meilleure gestion des données
*/

-- Suppression des politiques existantes
DROP POLICY IF EXISTS "Création de compte publique" ON users;
DROP POLICY IF EXISTS "Lecture des données utilisateur" ON users;
DROP POLICY IF EXISTS "Modification des données utilisateur" ON users;
DROP POLICY IF EXISTS "Administration complète" ON users;

-- Fonction pour créer automatiquement le profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', 'Utilisateur'), 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement le profil utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Nouvelles politiques de sécurité
CREATE POLICY "Lecture des données utilisateur"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Modification des données utilisateur"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Administration complète"
  ON users
  FOR ALL
  TO authenticated
  USING (role = 'admin');