-- Migration: Add email_frequency and alert_keywords to user preferences
-- Description: Ajoute les champs manquants pour la persistance complète des préférences utilisateur

-- =====================================================
-- 1. Ajouter email_frequency à email_settings
-- =====================================================
ALTER TABLE public.email_settings
ADD COLUMN IF NOT EXISTS email_frequency TEXT DEFAULT 'DAILY' 
  CHECK (email_frequency IN ('INSTANT', 'DAILY', 'WEEKLY'));

COMMENT ON COLUMN public.email_settings.email_frequency IS 'Fréquence d''envoi des emails: INSTANT (immédiat), DAILY (quotidien), WEEKLY (hebdomadaire)';

-- =====================================================
-- 2. Ajouter alert_keywords à email_settings
-- =====================================================
ALTER TABLE public.email_settings
ADD COLUMN IF NOT EXISTS alert_keywords TEXT;

COMMENT ON COLUMN public.email_settings.alert_keywords IS 'Mots-clés pour les alertes (séparés par virgules, ex: "crypto,finance,tech")';

-- =====================================================
-- 3. Mettre à jour les valeurs par défaut si nécessaire
-- =====================================================
-- Les valeurs par défaut sont déjà définies dans les ALTER TABLE ci-dessus
-- Mais on peut aussi mettre à jour les enregistrements existants qui ont NULL
UPDATE public.email_settings
SET email_frequency = 'DAILY'
WHERE email_frequency IS NULL;



