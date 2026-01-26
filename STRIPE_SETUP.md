# Configuration Stripe pour Paiement Unique (Lifetime Access)

## Vue d'ensemble

DotsDaily utilise un **paiement unique** (one-time payment) pour déverrouiller l'accès premium à vie. Ce n'est **pas un abonnement**.

## Configuration Actuelle

Votre configuration dans `.env` est correcte :
- `STRIPE_PRICE_ID=price_1StXB9RJDyL4jhPnSDlrakM9`

Ce Price ID doit être configuré dans Stripe comme un **prix one-time** (pas recurring).

## Vérifier votre Price ID dans Stripe

1. Allez sur https://dashboard.stripe.com/test/products
2. Trouvez votre produit "DotsDaily Premium" (ou similaire)
3. Vérifiez que le prix est affiché comme **"€2.99"** et non **"€2.99 / month"**
4. Si c'est un prix récurrent, vous devez créer un nouveau prix one-time

## Créer un Prix One-Time (si nécessaire)

Si votre Price ID actuel est récurrent, créez-en un nouveau :

1. Accédez à https://dashboard.stripe.com/test/products
2. Créez un nouveau produit ou éditez l'existant
3. Cliquez sur **"Add another price"**
4. **Type de prix** : Sélectionnez **"One time"** (PAS "Recurring")
5. **Montant** : `2.99` EUR
6. Cliquez sur **"Add price"**
7. Copiez le nouveau Price ID (commence par `price_...`)
8. Mettez à jour `.env` :
   ```
   STRIPE_PRICE_ID=price_VOTRE_NOUVEAU_ID
   ```

## Configuration du Webhook Stripe

Pour que les paiements soient correctement enregistrés, vous devez configurer un webhook :

### 1. Créer le Webhook

1. Allez sur https://dashboard.stripe.com/test/webhooks
2. Cliquez sur **"+ Add endpoint"**
3. **URL du webhook** :
   ```
   https://rgmiykvhddqwyqhprvkf.supabase.co/functions/v1/stripe-webhook
   ```
4. Cliquez sur **"Select events"**

### 2. Sélectionner les Événements

Cochez ces événements :
- ✅ `checkout.session.completed` - Quand le paiement est complété
- ✅ `payment_intent.succeeded` - Quand le paiement réussit

### 3. Récupérer le Signing Secret

1. Après avoir créé le webhook, cliquez dessus
2. Dans la section **"Signing secret"**, cliquez sur **"Reveal"**
3. Copiez le secret (commence par `whsec_...`)
4. Ajoutez-le dans votre fichier `.env` :
   ```
   STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET
   ```

## Fonctionnement

1. L'utilisateur clique sur "S'abonner" dans la page Pricing
2. Il est redirigé vers Stripe Checkout
3. Il paie 2,99€ en one-time
4. Stripe envoie un webhook à votre application
5. L'utilisateur reçoit le statut `lifetime` dans la base de données
6. Il a accès premium à vie

## Test du Paiement

Pour tester en mode test Stripe, utilisez cette carte :

- **Numéro** : `4242 4242 4242 4242`
- **Date d'expiration** : N'importe quelle date future
- **CVC** : N'importe quel code à 3 chiffres
- **Code postal** : N'importe lequel

## Passer en Production

Quand vous serez prêt pour la production :

1. Créez le même produit en mode **Live** (pas Test)
2. Créez un prix one-time pour ce produit
3. Récupérez le nouveau Price ID live
4. Configurez le webhook en mode Live
5. Mettez à jour tous vos secrets :
   - `STRIPE_SECRET_KEY` (live key, commence par `sk_live_...`)
   - `STRIPE_PUBLIC_KEY` (live key, commence par `pk_live_...`)
   - `STRIPE_PRICE_ID` (live price ID)
   - `STRIPE_WEBHOOK_SECRET` (live webhook secret)

## Vérification

Pour vérifier que tout fonctionne :

1. Testez un paiement avec la carte de test
2. Vérifiez dans https://dashboard.stripe.com/test/payments que le paiement apparaît
3. Vérifiez dans votre base de données Supabase que l'utilisateur a :
   - `status = 'lifetime'`
   - `plan = 'lifetime'`
   - `stripe_customer_id` rempli
