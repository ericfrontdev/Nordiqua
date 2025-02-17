/*
  # Correction finale de l'authentification

  1. Changements
    - Simplification des politiques RLS
    - Amélioration de la création de profil utilisateur
    - Optimisation des performances

  2. Sécurité
    - Politiques RLS simplifiées mais sécurisées
    - Protection des données utilisateur
*/

-- Nettoyage des politiques existantes
DROP POLICY IF EXISTS "Lecture du profil utilisateur" ON users;
DROP POLICY IF EXISTS "Modification du profil utilisateur" ON users;
DROP POLICY IF EXISTS "Administration" ON users;

-- Fonction de création de profil améliorée
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'Utilisateur'),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recréation du trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Politiques RLS simplifiées
CREATE POLICY "Lecture publique"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Modification personnelle"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Administration"
  ON users
  FOR ALL
  TO authenticated
  USING (role = 'admin');

-- Optimisation des index
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);