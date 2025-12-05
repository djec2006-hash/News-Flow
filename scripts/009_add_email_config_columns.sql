-- Migration : Ajout des colonnes de configuration email à content_preferences
-- À exécuter dans le SQL Editor de Supabase

-- 1. Ajouter les colonnes pour la configuration email
ALTER TABLE content_preferences 
ADD COLUMN IF NOT EXISTS email_recipients TEXT[] DEFAULT '{}';

ALTER TABLE content_preferences 
ADD COLUMN IF NOT EXISTS email_time TEXT DEFAULT '08:00';

ALTER TABLE content_preferences 
ADD COLUMN IF NOT EXISTS email_active BOOLEAN DEFAULT false;

ALTER TABLE content_preferences 
ADD COLUMN IF NOT EXISTS email_days INTEGER[] DEFAULT '{1,2,3,4,5}';

-- 2. Ajouter des commentaires pour documenter
COMMENT ON COLUMN content_preferences.email_recipients IS 'Liste des adresses email destinataires (max 3)';
COMMENT ON COLUMN content_preferences.email_time IS 'Heure d''envoi au format HH:MM';
COMMENT ON COLUMN content_preferences.email_active IS 'Indique si l''envoi automatique est activé';
COMMENT ON COLUMN content_preferences.email_days IS 'Jours de la semaine pour l''envoi (0=Dimanche, 1=Lundi, etc.)';

-- 3. Créer la table code_redemptions si elle n'existe pas (pour le système de codes promo)
CREATE TABLE IF NOT EXISTS code_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  plan_activated TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  redeemed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, code)
);

-- 4. Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_code_redemptions_user_id 
ON code_redemptions(user_id);

-- 5. RLS (Row Level Security) pour code_redemptions
ALTER TABLE code_redemptions ENABLE ROW LEVEL SECURITY;

-- Politique : les utilisateurs ne peuvent voir que leurs propres redemptions
CREATE POLICY "Users can view own redemptions" 
ON code_redemptions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Politique : le serveur peut insérer des redemptions
CREATE POLICY "Server can insert redemptions" 
ON code_redemptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 6. Vérification de la migration
SELECT 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'content_preferences' 
AND column_name IN ('email_recipients', 'email_time', 'email_active', 'email_days');

