/*
  # Création de la table users et configuration de la sécurité

  1. Nouvelle Table
    - `users`
      - `id` (uuid, clé primaire)
      - `email` (text, unique)
      - `name` (text)
      - `created_at` (timestamp)
      - `last_login` (timestamp)
      - `role` (text)

  2. Sécurité
    - Activation de RLS sur la table `users`
    - Politique pour permettre aux utilisateurs authentifiés de lire leurs propres données
    - Politique pour permettre aux administrateurs de tout lire
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  role text DEFAULT 'user'
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent lire leurs propres données"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Les administrateurs peuvent tout modifier"
  ON users
  FOR ALL
  TO authenticated
  USING (role = 'admin');