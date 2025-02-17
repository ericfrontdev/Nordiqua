/*
  # Correction des politiques d'authentification

  1. Changements
    - Suppression des politiques existantes
    - Ajout d'une politique permettant l'insertion sans authentification
    - Ajout d'une politique de lecture pour les utilisateurs authentifiés
    - Ajout d'une politique de modification pour les utilisateurs authentifiés
    - Ajout d'une politique d'administration

  2. Sécurité
    - Permet la création de compte sans authentification préalable
    - Restreint la lecture et la modification aux propriétaires des données
    - Donne un accès complet aux administrateurs
*/

-- Suppression des politiques existantes
DROP POLICY IF EXISTS "Les utilisateurs peuvent lire leurs propres données" ON users;
DROP POLICY IF EXISTS "Tout le monde peut créer un profil initial" ON users;
DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leurs propres données" ON users;
DROP POLICY IF EXISTS "Les administrateurs peuvent tout modifier" ON users;

-- Politique permettant à tous de créer un compte
CREATE POLICY "Création de compte autorisée pour tous"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Politique de lecture pour les utilisateurs authentifiés
CREATE POLICY "Lecture des données personnelles"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR role = 'admin');

-- Politique de modification pour les utilisateurs authentifiés
CREATE POLICY "Modification des données personnelles"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Politique pour les administrateurs
CREATE POLICY "Accès complet pour les administrateurs"
  ON users
  FOR ALL
  TO authenticated
  USING (role = 'admin');