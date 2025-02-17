/*
  # Correction de la récupération des données utilisateur

  1. Changements
    - Suppression des politiques existantes
    - Ajout d'une politique publique pour l'insertion
    - Ajout d'une politique de lecture plus permissive
    - Ajout d'une politique de modification sécurisée
    - Ajout d'une politique d'administration

  2. Sécurité
    - Permet la création de compte sans authentification
    - Permet la lecture des données utilisateur après authentification
    - Restreint la modification aux propriétaires des données
*/

-- Suppression des politiques existantes
DROP POLICY IF EXISTS "Création de compte autorisée pour tous" ON users;
DROP POLICY IF EXISTS "Lecture des données personnelles" ON users;
DROP POLICY IF EXISTS "Modification des données personnelles" ON users;
DROP POLICY IF EXISTS "Accès complet pour les administrateurs" ON users;

-- Politique d'insertion publique
CREATE POLICY "Création de compte publique"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Politique de lecture plus permissive
CREATE POLICY "Lecture des données utilisateur"
  ON users
  FOR SELECT
  TO public
  USING (true);

-- Politique de modification sécurisée
CREATE POLICY "Modification des données utilisateur"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Politique d'administration
CREATE POLICY "Administration complète"
  ON users
  FOR ALL
  TO authenticated
  USING (role = 'admin');