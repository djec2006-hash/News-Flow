-- Migration: Add refresh_rate to live_feed_settings
-- Description: Ajoute le champ refresh_rate pour contrôler le rythme de rafraîchissement du Live Feed

ALTER TABLE public.live_feed_settings
ADD COLUMN IF NOT EXISTS refresh_rate INTEGER DEFAULT 60 CHECK (refresh_rate IN (10, 30, 60, 120));

COMMENT ON COLUMN public.live_feed_settings.refresh_rate IS 'Rythme de rafraîchissement en secondes: 10 (Temps réel), 30 (Intensif), 60 (Normal), 120 (Mode Zen)';



