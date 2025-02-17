/*
  # Correction de la gestion des utilisateurs

  1. Changements
    - Amélioration du trigger de création de profil
    - Optimisation des politiques de sécurité
    - Ajout d'index pour de meilleures performances

  2. Sécurité
    - Politiques RLS plus claires et robustes
    - Meilleure gestion des permissions
*/

-- Amélioration de la fonction de création de profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Attendre un court instant pour s'assurer que l'utilisateur est bien créé
  -- dans auth.users avant de créer son profil
  PERFORM pg_sleep(0.1);
  
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'Utilisateur'),
    'user'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    updated_at = now();
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ajout d'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Optimisation des politiques de sécurité
CREATE POLICY "Lecture du profil utilisateur"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    OR role = 'admin'
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = users.id
      AND auth.users.email = users.email
    )
  );

CREATE POLICY "Modification du profil utilisateur"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Administration"
  ON users
  FOR ALL
  TO authenticated
  USING (role = 'admin');