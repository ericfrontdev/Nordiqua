/*
  # Création de la table invoices et configuration de la sécurité

  1. Nouvelles Tables
    - `invoices`
      - `id` (uuid, clé primaire)
      - `number` (text, unique)
      - `client_id` (uuid, référence clients)
      - `amount` (decimal)
      - `status` (text)
      - `due_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, référence users)

    - `invoice_items`
      - `id` (uuid, clé primaire)
      - `invoice_id` (uuid, référence invoices)
      - `description` (text)
      - `quantity` (decimal)
      - `price` (decimal)
      - `created_at` (timestamp)

  2. Sécurité
    - Activation de RLS sur les tables `invoices` et `invoice_items`
    - Politiques pour permettre aux utilisateurs authentifiés de gérer leurs propres factures
*/

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text UNIQUE NOT NULL,
  client_id uuid REFERENCES clients(id) NOT NULL,
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  due_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  quantity decimal(10,2) NOT NULL,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Politiques pour invoices
CREATE POLICY "Les utilisateurs peuvent lire leurs propres factures"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Les utilisateurs peuvent créer des factures"
  ON invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres factures"
  ON invoices
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Politiques pour invoice_items
CREATE POLICY "Les utilisateurs peuvent lire leurs propres items de facture"
  ON invoice_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.created_by = auth.uid()
    )
  );

CREATE POLICY "Les utilisateurs peuvent créer des items de facture"
  ON invoice_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.created_by = auth.uid()
    )
  );

-- Trigger pour mettre à jour updated_at sur invoices
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();