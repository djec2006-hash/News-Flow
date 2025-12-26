-- Migration : Ajout de la colonne plan_expires_at pour gérer l'expiration des abonnements temporaires
-- À exécuter dans le SQL Editor de Supabase

-- 1. Ajouter la colonne plan_expires_at à la table profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;

-- 2. Ajouter un commentaire pour documenter
COMMENT ON COLUMN profiles.plan_expires_at IS 'Date d''expiration du plan actuel (pour les codes promos temporaires)';

-- 3. Créer un index pour optimiser les requêtes de vérification d'expiration
CREATE INDEX IF NOT EXISTS idx_profiles_plan_expires_at 
ON profiles(plan_expires_at) 
WHERE plan_expires_at IS NOT NULL;

-- 4. (Optionnel) Fonction pour vérifier et révoquer les plans expirés
-- Cette fonction peut être appelée périodiquement (via un cron job Supabase)
CREATE OR REPLACE FUNCTION revoke_expired_plans()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET 
    plan_type = 'free',
    plan_expires_at = NULL,
    updated_at = NOW()
  WHERE 
    plan_expires_at IS NOT NULL 
    AND plan_expires_at < NOW()
    AND plan_type != 'free';
    
  RAISE NOTICE 'Expired plans revoked';
END;
$$;

-- 5. (Optionnel) Créer une Edge Function trigger ou un cron job
-- Pour exécuter revoke_expired_plans() automatiquement chaque jour
-- Ceci est à configurer dans l'interface Supabase (Database > Cron Jobs)
-- Exemple de configuration cron : 0 0 * * * (chaque jour à minuit)







