# 📧 Setup Email avec Resend

## 1. Installation des packages

```bash
npm install resend react-email @react-email/components
```

## 2. Variables d'environnement

Ajouter dans `.env.local` :

```env
# Resend API Key (obtenir sur https://resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email "From" (doit être vérifié sur Resend)
RESEND_FROM_EMAIL=NewsFlow <notifications@votredomaine.com>

# Pour le dev, utiliser un domaine de test Resend
# RESEND_FROM_EMAIL=NewsFlow <onboarding@resend.dev>
```

## 3. Configuration Resend

1. Créer un compte sur https://resend.com
2. Obtenir une API Key dans Settings → API Keys
3. Pour la production : Ajouter votre domaine dans Domains
4. Pour le dev : Utiliser `onboarding@resend.dev` (fourni par Resend)

## 4. Test de l'email

Une fois configuré, vous pouvez tester l'envoi depuis le Dashboard.

## 5. Limite Resend (Plan Gratuit)

- 3,000 emails/mois gratuits
- 100 emails/jour max
- Parfait pour commencer !















