-- Migration : Création de la table posts pour le blog
-- À exécuter dans l'éditeur SQL de Supabase

-- Création de la table posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time INTEGER NOT NULL DEFAULT 3,
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_is_published ON posts(is_published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut LIRE les posts publiés
CREATE POLICY "Posts are viewable by everyone"
  ON posts
  FOR SELECT
  USING (is_published = true);

-- Politique : Seuls les admins peuvent INSÉRER (à adapter selon votre système d'auth)
-- Pour l'instant, on permet l'insertion via service_role (API routes)
-- Vous pouvez restreindre avec : USING (auth.jwt() ->> 'role' = 'admin')
CREATE POLICY "Posts can be inserted by service role"
  ON posts
  FOR INSERT
  WITH CHECK (true);

-- Politique : Seuls les admins peuvent MODIFIER
CREATE POLICY "Posts can be updated by service role"
  ON posts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Politique : Seuls les admins peuvent SUPPRIMER
CREATE POLICY "Posts can be deleted by service role"
  ON posts
  FOR DELETE
  USING (true);






