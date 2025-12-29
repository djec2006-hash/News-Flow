-- Migration : Ajout de la colonne has_seen_onboarding pour gérer le statut de l'onboarding interactif
-- À exécuter dans le SQL Editor de Supabase

-- 1. Ajouter la colonne has_seen_onboarding à la table profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS has_seen_onboarding BOOLEAN DEFAULT false;

-- 2. Ajouter un commentaire pour documenter
COMMENT ON COLUMN profiles.has_seen_onboarding IS 'Indique si l''utilisateur a complété la visite guidée interactive du dashboard';

-- 3. Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_profiles_has_seen_onboarding 
ON profiles(has_seen_onboarding) 
WHERE has_seen_onboarding = false;

