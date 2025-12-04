-- =====================================================
-- Migration: Live Feed Settings Table
-- Description: Permet aux utilisateurs de configurer leur flux d'actualités
-- =====================================================

-- Création de la table live_feed_settings
CREATE TABLE IF NOT EXISTS public.live_feed_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL DEFAULT 'auto' CHECK (mode IN ('auto', 'custom')),
  custom_domains TEXT[] DEFAULT '{}',
  custom_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index pour les requêtes par user_id
CREATE INDEX IF NOT EXISTS idx_live_feed_settings_user_id ON public.live_feed_settings(user_id);

-- RLS (Row Level Security) - Les utilisateurs ne peuvent accéder qu'à leurs propres settings
ALTER TABLE public.live_feed_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir leurs propres settings
CREATE POLICY "Users can view their own live feed settings"
  ON public.live_feed_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent insérer leurs propres settings
CREATE POLICY "Users can insert their own live feed settings"
  ON public.live_feed_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent mettre à jour leurs propres settings
CREATE POLICY "Users can update their own live feed settings"
  ON public.live_feed_settings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent supprimer leurs propres settings
CREATE POLICY "Users can delete their own live feed settings"
  ON public.live_feed_settings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Fonction pour mettre à jour automatiquement le timestamp updated_at
CREATE OR REPLACE FUNCTION update_live_feed_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour appeler la fonction ci-dessus
CREATE TRIGGER trigger_update_live_feed_settings_updated_at
  BEFORE UPDATE ON public.live_feed_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_live_feed_settings_updated_at();

-- Commentaires pour documentation
COMMENT ON TABLE public.live_feed_settings IS 'Configuration personnalisée du flux Live Feed pour chaque utilisateur';
COMMENT ON COLUMN public.live_feed_settings.mode IS 'Mode de génération: auto (IA basée sur projets) ou custom (règles manuelles)';
COMMENT ON COLUMN public.live_feed_settings.custom_domains IS 'Domaines sélectionnés pour le mode custom (Finance, Crypto, Tech, etc.)';
COMMENT ON COLUMN public.live_feed_settings.custom_instructions IS 'Instructions personnalisées pour affiner la recherche';



