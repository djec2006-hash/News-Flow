# Migration Blog vers Supabase

## Étape 1 : Créer la table dans Supabase

1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**
3. Copiez-collez le contenu de `create_blog_posts_table.sql`
4. Exécutez la requête

## Étape 2 : Migrer les données existantes (Optionnel)

Si vous voulez migrer les articles existants de `lib/blog-data.ts` vers Supabase :

```sql
-- Exemple d'insertion manuelle (à adapter selon vos données)
INSERT INTO posts (slug, title, excerpt, content, date, category, read_time, image_url, is_published)
VALUES 
  ('agents-ia-finance-2025', '2025 : L''année des Agents IA Autonomes', '...', '...', '12 Jan 2025', 'Tech', 3, '/images/blog/ai-agent.jpg', true);
```

## Étape 3 : Configuration des variables d'environnement

Ajoutez dans votre `.env.local` :

```env
# Clé secrète pour l'API de génération automatique
CRON_SECRET_KEY=votre_cle_secrete_tres_longue_et_aleatoire

# Optionnel : Service Role Key pour bypass RLS (si vous l'utilisez)
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

## Étape 4 : Tester l'API de génération

```bash
# Test manuel
curl -X POST http://localhost:3000/api/cron/generate-daily-post \
  -H "Authorization: Bearer votre_cle_secrete_tres_longue_et_aleatoire"
```

## Étape 5 : Automatisation avec un Cron Job

### Option A : Vercel Cron (si déployé sur Vercel)

Ajoutez dans `vercel.json` :

```json
{
  "crons": [{
    "path": "/api/cron/generate-daily-post",
    "schedule": "0 9 * * *"
  }]
}
```

### Option B : Service externe (cron-job.org, etc.)

Configurez un cron job qui appelle votre URL avec le header Authorization.

## Notes importantes

- Le système utilise un **fallback automatique** : si Supabase n'est pas configuré, il utilise les données statiques de `lib/blog-data.ts`
- Les politiques RLS permettent la lecture publique mais nécessitent le service_role pour l'écriture
- La clé secrète doit être longue et aléatoire (générez-la avec `openssl rand -hex 32`)



