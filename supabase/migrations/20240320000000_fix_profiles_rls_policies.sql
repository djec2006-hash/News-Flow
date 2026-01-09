-- Migration: Fix RLS Policies pour la table profiles
-- Description: Assure que les utilisateurs peuvent lire leur propre profil et que le middleware peut fonctionner

-- 1. Activer RLS sur la table profiles (si pas déjà fait)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes policies si elles existent (pour éviter les conflits)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- 3. Policy pour SELECT : Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 4. Policy pour UPDATE : Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Policy pour INSERT : Les utilisateurs peuvent créer leur propre profil
-- (utile pour la création différée depuis le middleware)
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 6. Commentaires pour documentation
COMMENT ON POLICY "Users can view own profile" ON public.profiles IS 'Permet aux utilisateurs de lire leur propre profil. Essentiel pour le middleware et les vérifications d''onboarding.';
COMMENT ON POLICY "Users can update own profile" ON public.profiles IS 'Permet aux utilisateurs de mettre à jour leur propre profil.';
COMMENT ON POLICY "Users can insert own profile" ON public.profiles IS 'Permet aux utilisateurs de créer leur propre profil. Utilisé pour la création différée si le trigger a échoué.';





