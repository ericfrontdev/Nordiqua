/*
  # Mise à jour des politiques RLS pour la table users

  1. Modifications
    - Suppression des politiques existantes avant leur recréation
    - Ajout d'une politique permettant l'insertion pour les utilisateurs authentifiés
    - Mise à jour de la politique de lecture pour inclure l'utilisateur lui-même

  2. Sécurité
    - Maintien de la RLS
    - Permissions granulaires basées sur le rôle et l'identité
*/

-- Suppression des politiques existantes
DROP POLICY IF EXISTS "Les utilisateurs peuvent lire leurs propres données" ON users;
DROP POLICY IF EXISTS "Les utilisateurs peuvent créer leur profil" ON users;
DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leurs propres données" ON users;
DROP POLICY IF EXISTS "Les administrateurs peuvent tout modifier" ON users;

-- Recréation des politiques
CREATE POLICY "Les utilisateurs peuvent lire leurs propres données"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Les utilisateurs peuvent créer leur profil"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres données"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Les administrateurs peuvent tout modifier"
  ON users
  FOR ALL
  TO authenticated
  USING (role = 'admin');