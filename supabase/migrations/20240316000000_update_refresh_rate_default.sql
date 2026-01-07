-- Migration: Update refresh_rate default to 900 seconds (15 minutes)
-- Description: Change the default refresh rate from 60 seconds to 900 seconds (15 minutes)

-- Drop the existing constraint
ALTER TABLE public.live_feed_settings
DROP CONSTRAINT IF EXISTS live_feed_settings_refresh_rate_check;

-- Add the column with new default and constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'live_feed_settings' 
    AND column_name = 'refresh_rate'
  ) THEN
    ALTER TABLE public.live_feed_settings
    ADD COLUMN refresh_rate INTEGER DEFAULT 900 CHECK (refresh_rate IN (10, 30, 60, 120, 900));
  ELSE
    -- Column exists, just update the default and constraint
    ALTER TABLE public.live_feed_settings
    ALTER COLUMN refresh_rate SET DEFAULT 900;
    
    ALTER TABLE public.live_feed_settings
    ADD CONSTRAINT live_feed_settings_refresh_rate_check 
    CHECK (refresh_rate IN (10, 30, 60, 120, 900));
  END IF;
END $$;

-- Update the comment
COMMENT ON COLUMN public.live_feed_settings.refresh_rate IS 'Rythme de rafraîchissement en secondes: 10 (Temps réel), 30 (Intensif), 60 (Normal), 120 (Mode Zen), 900 (15 min)';




