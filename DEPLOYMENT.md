# Déploiement DotsDaily

## ✅ Configuration Supabase (DÉJÀ FAIT)

Tout est déjà configuré et déployé :
- ✅ Base de données créée avec les tables `wallpaper_configs` et `wallpaper_cache`
- ✅ Edge Functions déployées :
  - `save-wallpaper` : Sauvegarde les configurations
  - `wallpaper` : Redirige vers Vercel pour la génération PNG
- ✅ Aucune action manuelle requise

## Architecture

DotsDaily utilise une architecture hybride :

- **Supabase** : Base de données PostgreSQL + Edge Functions pour sauvegarder les configs et rediriger
- **Vercel** : API Node.js pour la génération des images PNG avec Sharp

## Ce qu'il reste à faire : Déployer sur Vercel

### 1. Connecter le repo à Vercel

Depuis le dashboard Vercel (vercel.com) :
1. Clique sur "Add New Project"
2. Importe ton repo GitHub/GitLab
3. Vercel détectera automatiquement la configuration

### 2. Configurer les variables d'environnement

Dans les settings du projet Vercel, ajoute ces 4 variables :

| Variable | Valeur |
|----------|--------|
| `SUPABASE_URL` | `https://rgmiykvhddqwyqhprvkf.supabase.co` |
| `SUPABASE_ANON_KEY` | Ta clé Supabase (dans le fichier `.env`) |
| `VITE_SUPABASE_URL` | `https://rgmiykvhddqwyqhprvkf.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | La même clé Supabase |

### 3. Déployer

Vercel déploiera automatiquement à chaque push. Le premier déploiement se lance dès que tu cliques sur "Deploy".

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

### L'URL ne fonctionne pas encore

Si tu vois une erreur en testant l'URL, c'est normal ! Le wallpaper ne fonctionnera que quand :
1. Le code sera déployé sur Vercel
2. Les variables d'environnement seront configurées
3. Le domaine `dotsdaily.app` pointera vers Vercel

En attendant, Supabase est déjà configuré et prêt.
