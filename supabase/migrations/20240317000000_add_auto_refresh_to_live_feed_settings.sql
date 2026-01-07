-- Migration: Add auto_refresh to live_feed_settings
-- Description: Ajoute le champ auto_refresh pour contrôler si le rafraîchissement automatique est activé

ALTER TABLE public.live_feed_settings
ADD COLUMN IF NOT EXISTS auto_refresh BOOLEAN DEFAULT true;

COMMENT ON COLUMN public.live_feed_settings.auto_refresh IS 'Active ou désactive le rafraîchissement automatique du Live Feed';




