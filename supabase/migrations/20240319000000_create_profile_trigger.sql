-- Migration: Créer un trigger pour créer automatiquement un profil lors de la création d'un utilisateur
-- Description: Ce trigger s'assure qu'un profil est créé dans public.profiles quand un utilisateur est créé dans auth.users
-- IMPORTANT: Il ne casse pas les profils existants lors d'un login OAuth (utilise INSERT ... ON CONFLICT DO NOTHING)

-- 1. Fonction pour créer automatiquement un profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insérer un profil seulement s'il n'existe pas déjà
  -- ON CONFLICT DO NOTHING évite d'écraser un profil existant lors d'un login OAuth
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 2. Trigger qui s'exécute après l'insertion d'un utilisateur dans auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Commentaire pour documentation
COMMENT ON FUNCTION public.handle_new_user() IS 'Crée automatiquement un profil dans public.profiles lors de la création d''un utilisateur dans auth.users. Utilise ON CONFLICT DO NOTHING pour ne pas écraser les profils existants lors d''un login OAuth.';





