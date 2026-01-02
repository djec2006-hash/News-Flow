# 💳 Configuration Stripe pour NewsFlow

Ce guide vous explique comment configurer Stripe Checkout pour gérer les abonnements automatiquement.

---

## 📋 PRÉREQUIS

1. **Compte Stripe** : Créez un compte sur [stripe.com](https://stripe.com)
2. **Clés API Stripe** : Récupérez vos clés dans le Dashboard Stripe

---

## 🔧 ÉTAPE 1 : CONFIGURER LES VARIABLES D'ENVIRONNEMENT

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# Clés API Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx  # Clé secrète (test ou live)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx  # Secret du webhook (à récupérer après création)

# IDs des prix Stripe (à créer dans Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC=price_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_xxxxxxxxxxxxxxxxxxxxx

# URL de base de l'application (pour les URLs de retour)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # En production : https://votredomaine.com

# Service Role Key Supabase (pour le webhook)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # ⚠️ À NE JAMAIS exposer côté client
```

---

## 💰 ÉTAPE 2 : CRÉER LES PRIX DANS STRIPE

### 2.1 Dans le Dashboard Stripe

1. Allez dans **Produits** → **Créer un produit**
2. Créez 2 produits (Basic et Pro) :

#### Produit Basic :
- **Nom** : NewsFlow Basic
- **Prix** : 9,90 € / mois
- **Type** : Récurrent
- **Période** : Mensuel
- **Copiez l'ID du prix** (commence par `price_`)

#### Produit Pro :
- **Nom** : NewsFlow Pro
- **Prix** : 16,90 € / mois
- **Type** : Récurrent
- **Période** : Mensuel
- **Copiez l'ID du prix** (commence par `price_`)

### 2.2 Ajouter les IDs dans votre code

Une fois que vous avez les IDs, ajoutez-les dans `lib/plans.ts` ou directement dans `.env.local` :

```env
NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_xxxxx
```

---

## 🔔 ÉTAPE 3 : CONFIGURER LE WEBHOOK

Le webhook permet à Stripe d'activer automatiquement l'abonnement après le paiement.

### 3.1 Créer le webhook dans Stripe

1. Allez dans **Développeurs** → **Webhooks** → **Ajouter un endpoint**
2. **URL** : `https://votredomaine.com/api/stripe/webhook` (en production)
   - Pour le développement local, utilisez [Stripe CLI](https://stripe.com/docs/stripe-cli) :
     ```bash
     stripe listen --forward-to localhost:3000/api/stripe/webhook
     ```
3. **Événements à écouter** :
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

4. **Copiez le secret du webhook** (commence par `whsec_`) et ajoutez-le dans `.env.local` :
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
   ```

### 3.2 Tester le webhook en local

Utilisez Stripe CLI pour forwarder les événements :

```bash
# Installer Stripe CLI
# Windows: choco install stripe
# Mac: brew install stripe/stripe-cli/stripe
# Linux: voir docs Stripe

# Se connecter
stripe login

# Forwarder les événements vers votre serveur local
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Le terminal affichera un secret du webhook que vous pourrez utiliser en local :
```
> Ready! Your webhook signing secret is whsec_xxxxx
```

---

## 🔑 ÉTAPE 4 : SERVICE ROLE KEY SUPABASE

Pour que le webhook puisse modifier les profils utilisateurs, vous devez configurer la **Service Role Key** Supabase.

### 4.1 Récupérer la clé

1. Allez dans votre projet Supabase Dashboard
2. **Settings** → **API**
3. Dans la section **Project API keys**, copiez la **`service_role` key** (⚠️ NE JAMAIS l'exposer côté client !)

### 4.2 Ajouter dans .env.local

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✅ ÉTAPE 5 : TESTER LE FLUX COMPLET

### Test 1 : Checkout

1. Allez sur `/pricing`
2. Cliquez sur "Passer à Basic" ou "Passer à Pro"
3. Vous devez être redirigé vers Stripe Checkout

### Test 2 : Webhook

1. Complétez le paiement avec une carte de test :
   - Numéro : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres
2. Après le paiement, vous êtes redirigé vers `/dashboard?success=true`
3. Vérifiez dans la base Supabase que le profil utilisateur a été mis à jour :
   ```sql
   SELECT id, plan_type, plan_expires_at FROM profiles WHERE id = 'user_id';
   ```

### Test 3 : Logs

Consultez les logs dans votre terminal :
- `[Stripe Checkout]` - Création de session
- `[Stripe Webhook]` - Réception et traitement des événements

---

## 🐛 DÉPANNAGE

### Le webhook ne se déclenche pas

1. Vérifiez que `STRIPE_WEBHOOK_SECRET` est bien configuré
2. Vérifiez que l'URL du webhook est correcte dans Stripe Dashboard
3. Consultez les logs dans **Stripe Dashboard** → **Développeurs** → **Webhooks** → **Logs**

### L'abonnement ne s'active pas

1. Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est configuré
2. Vérifiez les logs du webhook dans votre terminal
3. Vérifiez que les métadonnées sont bien passées (`client_reference_id`, `planType`)

### Erreur "Signature verification failed"

- Vérifiez que `STRIPE_WEBHOOK_SECRET` correspond au secret de votre endpoint webhook
- En local, utilisez le secret affiché par Stripe CLI
- En production, utilisez le secret de votre endpoint webhook Stripe

---

## 📚 RESSOURCES

- [Documentation Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

## 🔒 SÉCURITÉ

⚠️ **IMPORTANT** :
- Ne jamais exposer `STRIPE_SECRET_KEY` côté client
- Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` côté client
- Ne jamais exposer `STRIPE_WEBHOOK_SECRET` côté client
- Ces clés doivent être UNIQUEMENT dans `.env.local` (qui est dans `.gitignore`)

---

## 🚀 MISE EN PRODUCTION

1. Passez en mode **Live** dans Stripe Dashboard
2. Récupérez vos clés **Live** (commencent par `sk_live_`)
3. Mettez à jour les variables d'environnement dans votre hébergeur (Vercel, etc.)
4. Créez un webhook en production avec l'URL : `https://votredomaine.com/api/stripe/webhook`
5. Testez avec une vraie carte en petit montant avant de lancer

---

**Bon setup ! 💳✨**








