# Configuration Stripe pour Abonnements

## Problème Actuel

L'erreur "You must provide at least one recurring price in `subscription` mode" signifie que le `STRIPE_PRICE_ID` configuré dans votre fichier `.env` **n'est pas un prix d'abonnement récurrent**, mais probablement un prix one-time (paiement unique).

## Solution : Créer un Prix Récurrent

### 1. Accédez au Dashboard Stripe

Rendez-vous sur : https://dashboard.stripe.com/test/products

### 2. Créez un Nouveau Produit (ou utilisez un existant)

- Cliquez sur **"+ Add product"**
- Nom du produit : `DotsDaily Premium` (ou le nom de votre choix)
- Description : `Abonnement premium mensuel`

### 3. Configurez le Prix Récurrent

**TRÈS IMPORTANT** : Dans la section "Pricing", vous devez :

- **Model de prix** : Sélectionnez **"Recurring"** (pas "One time")
- **Montant** : `2.99` EUR
- **Période de facturation** : **"Monthly"**
- **Type de facturation** : "Standard pricing"

### 4. Copiez le Price ID

Une fois le produit créé, vous verrez un **Price ID** qui commence par `price_...`

Ce Price ID ressemble à : `price_1StXB9RJDyL4jhPnXXXXXXXX`

### 5. Mettez à Jour le Fichier .env

Remplacez la ligne suivante dans votre fichier `.env` :

```
STRIPE_PRICE_ID=price_1StXB9RJDyL4jhPnSDlrakM9
```

Par votre nouveau Price ID récurrent :

```
STRIPE_PRICE_ID=price_VOTRE_NOUVEAU_PRICE_ID
```

### 6. Configurez le Webhook (Important)

Pour que les abonnements fonctionnent correctement, vous devez configurer un webhook Stripe :

1. Allez sur : https://dashboard.stripe.com/test/webhooks
2. Cliquez sur **"+ Add endpoint"**
3. URL du webhook : `https://rgmiykvhddqwyqhprvkf.supabase.co/functions/v1/stripe-webhook`
4. Sélectionnez ces événements :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copiez le **Signing secret** (commence par `whsec_...`)
6. Ajoutez-le dans votre `.env` :
   ```
   STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET
   ```

## Vérification

Pour vérifier que votre Price ID est bien récurrent :

1. Allez sur https://dashboard.stripe.com/test/products
2. Trouvez votre produit
3. Dans la colonne "Pricing", vous devriez voir : **"€2.99 / month"** (pas juste "€2.99")

## Redémarrage

Après avoir mis à jour le `.env` :

1. Les Edge Functions Supabase utilisent automatiquement les nouvelles variables
2. Rechargez votre page web
3. Testez à nouveau le bouton d'abonnement

## Mode Test vs Production

N'oubliez pas que vous êtes en **mode test**. Vous pouvez tester avec la carte de test Stripe :

- Numéro : `4242 4242 4242 4242`
- Date : N'importe quelle date future
- CVC : N'importe quel code à 3 chiffres

Quand vous serez prêt pour la production, vous devrez :
1. Créer le même produit en mode **live**
2. Obtenir un nouveau Price ID live
3. Mettre à jour toutes vos clés Stripe (secret key, price ID, webhook secret)
