# Déploiement DotsDaily

## Architecture

DotsDaily utilise maintenant une architecture hybride :

- **Supabase** : Base de données PostgreSQL + Edge Function pour sauvegarder les configs
- **Vercel** : API Node.js pour la génération des images PNG

### Pourquoi ce changement ?

L'architecture précédente utilisait Supabase Edge Functions (Deno) pour tout, mais la conversion SVG → PNG dans Deno est problématique :
- Bibliothèques natives non supportées
- APIs externes coûteuses et fragiles (API Ninjas)
- Limitations de l'environnement Edge

**Solution** : Utiliser Node.js (Vercel) pour la conversion d'images avec `sharp`, une bibliothèque robuste et battle-tested.

## Structure du projet

```
/api/wallpaper.ts          → API Vercel (Node) - Génération PNG
/supabase/functions/
  save-wallpaper/          → Edge Function - Sauvegarde config
  wallpaper/               → ❌ SUPPRIMÉ (obsolète)
```

## Déploiement sur Vercel

1. **Connecter le repo à Vercel**
   ```bash
   vercel
   ```

2. **Variables d'environnement**

   Dans le dashboard Vercel, configurer :
   - `SUPABASE_URL` : URL de votre projet Supabase (ex: `https://xxx.supabase.co`)
   - `SUPABASE_ANON_KEY` : Clé anonyme Supabase
   - `VITE_SUPABASE_URL` : Même URL (pour le frontend)
   - `VITE_SUPABASE_ANON_KEY` : Même clé (pour le frontend)

3. **Déployer**
   ```bash
   vercel --prod
   ```

## Configuration Supabase

### Edge Function à déployer

Seule la fonction `save-wallpaper` doit être déployée :

```bash
# Si l'ancienne fonction wallpaper est encore déployée, la supprimer
supabase functions delete wallpaper

# Déployer save-wallpaper
supabase functions deploy save-wallpaper
```

### Base de données

Les tables nécessaires sont déjà créées via les migrations :
- `wallpaper_configs` : Configuration des wallpapers
- `wallpaper_cache` : Cache des PNG générés (1 par jour par config)

## Comment ça fonctionne

1. **Génération d'URL**
   - User configure son wallpaper → Frontend appelle `/functions/v1/save-wallpaper`
   - Config sauvegardée dans `wallpaper_configs` avec ID unique
   - URL générée : `https://dotsdaily.app/w/{id}`

2. **Accès au wallpaper**
   - iOS Shortcuts appelle `https://dotsdaily.app/w/{id}`
   - Vercel routing (`vercel.json`) redirige vers `/api/wallpaper?id={id}`
   - API Vercel (Node + Sharp) :
     - Récupère la config depuis Supabase
     - Check le cache (`wallpaper_cache`)
     - Si cache valide → retourne PNG
     - Sinon → génère SVG → convertit en PNG → cache → retourne PNG

3. **Cache**
   - Clé : `{id}-{date}` (ex: `abc12345-2026-01-23`)
   - Expire à minuit (timezone du user)
   - 1 génération par jour par user

## Coûts

- **Vercel** : 0€ jusqu'à 100GB bandwidth/mois (largement suffisant pour des milliers d'users)
- **Supabase** : Plan gratuit suffisant (500MB DB, 2GB bandwidth)

## Tests locaux

### Option 1 : Utiliser Vercel Dev

```bash
vercel dev
```

L'API sera accessible sur `http://localhost:3000/api/wallpaper?id={id}`

### Option 2 : Tester uniquement le frontend

```bash
npm run dev
```

Le frontend sera sur `http://localhost:5173` mais les URLs générées pointeront vers la prod.

## Troubleshooting

### Erreur "API Ninjas key not configured"

Cela signifie que l'ancienne Edge Function `wallpaper` est encore déployée sur Supabase. Pour résoudre :

```bash
supabase functions delete wallpaper
```

### L'image ne se génère pas

1. Vérifier que l'API Vercel est bien déployée
2. Vérifier les variables d'environnement Vercel
3. Checker les logs Vercel : `vercel logs`

### Cache ne fonctionne pas

Vérifier que la table `wallpaper_cache` existe :
```sql
SELECT * FROM wallpaper_cache LIMIT 1;
```
