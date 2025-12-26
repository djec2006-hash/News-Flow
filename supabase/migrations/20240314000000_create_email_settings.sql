-- Migration: Create email_settings table
-- Description: Table dédiée pour les paramètres d'envoi d'emails des utilisateurs

CREATE TABLE IF NOT EXISTS public.email_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT false,
  delivery_days TEXT[] DEFAULT '{}',
  delivery_time TEXT DEFAULT '08:00',
  recipients TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index pour les requêtes par user_id
CREATE INDEX IF NOT EXISTS idx_email_settings_user_id ON public.email_settings(user_id);

-- RLS (Row Level Security)
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir leurs propres settings
CREATE POLICY "Users can view their own email settings"
  ON public.email_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent insérer leurs propres settings
CREATE POLICY "Users can insert their own email settings"
  ON public.email_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent mettre à jour leurs propres settings
CREATE POLICY "Users can update their own email settings"
  ON public.email_settings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent supprimer leurs propres settings
CREATE POLICY "Users can delete their own email settings"
  ON public.email_settings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Fonction pour mettre à jour automatiquement le timestamp updated_at
CREATE OR REPLACE FUNCTION update_email_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour appeler la fonction ci-dessus
CREATE TRIGGER trigger_update_email_settings_updated_at
  BEFORE UPDATE ON public.email_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_email_settings_updated_at();

-- Commentaires pour documentation
COMMENT ON TABLE public.email_settings IS 'Configuration des paramètres d''envoi d''emails pour chaque utilisateur';
COMMENT ON COLUMN public.email_settings.is_enabled IS 'Active ou désactive l''envoi automatique d''emails';
COMMENT ON COLUMN public.email_settings.delivery_days IS 'Jours de la semaine pour l''envoi (ex: ["L", "M", "M", "J", "V"])';
COMMENT ON COLUMN public.email_settings.delivery_time IS 'Heure d''envoi au format HH:MM (ex: "08:00")';
COMMENT ON COLUMN public.email_settings.recipients IS 'Liste des adresses email destinataires (max 3)';


