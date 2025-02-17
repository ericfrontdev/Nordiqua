/*
  # Création de la table clients et configuration de la sécurité

  1. Nouvelle Table
    - `clients`
      - `id` (uuid, clé primaire)
      - `name` (text)
      - `contact` (text)
      - `email` (text)
      - `phone` (text)
      - `website` (text, optionnel)
      - `address` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, référence users)
      - `status` (text)

  2. Sécurité
    - Activation de RLS sur la table `clients`
    - Politique pour permettre aux utilisateurs authentifiés de lire leurs propres clients
    - Politique pour permettre aux utilisateurs authentifiés de créer des clients
    - Politique pour permettre aux utilisateurs authentifiés de modifier leurs propres clients
*/

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact text NOT NULL,
  email text NOT NULL,
  phone text,
  website text,
  address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id) NOT NULL,
  status text DEFAULT 'active'
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent lire leurs propres clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Les utilisateurs peuvent créer des clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();