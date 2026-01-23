# Déploiement DotsDaily

## ✅ Configuration Supabase (DÉJÀ FAIT)

Tout est déjà configuré :
- ✅ Base de données avec les tables `wallpaper_configs` et `wallpaper_cache`
- ✅ Edge Function `save-wallpaper` déployée pour sauvegarder les configurations
- Rien à faire manuellement

## Architecture

- **Supabase** : Base de données + sauvegarde des configs
- **Vercel** : Frontend + API pour générer les PNG avec Sharp

## Déployer sur Vercel

### 1. Créer le projet Vercel

1. Va sur [vercel.com](https://vercel.com)
2. Clique sur "Add New Project"
3. Importe ton repo GitHub/GitLab
4. Vercel détectera automatiquement la config

### 2. Variables d'environnement

Dans les settings Vercel, ajoute ces 4 variables :

| Variable | Valeur |
|----------|--------|
| `SUPABASE_URL` | `https://rgmiykvhddqwyqhprvkf.supabase.co` |
| `SUPABASE_ANON_KEY` | Dans ton fichier `.env` local |
| `VITE_SUPABASE_URL` | `https://rgmiykvhddqwyqhprvkf.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Même valeur que `SUPABASE_ANON_KEY` |

### 3. Déployer

Clique sur "Deploy". C'est tout !

## Ton URL

Après le déploiement, Vercel te donnera une URL comme :
- `https://ton-projet.vercel.app`

L'app générera automatiquement les bons liens :
- `https://ton-projet.vercel.app/w/{id}`

### Domaine custom (optionnel)

Si tu veux utiliser `dotsdaily.app` :
1. Dans Vercel, va dans Settings > Domains
2. Ajoute `dotsdaily.app`
3. Configure le DNS chez ton registrar selon les instructions Vercel

## Comment ça marche

1. **Tu configures ton wallpaper** → L'app sauvegarde la config dans Supabase
2. **Tu reçois une URL** → Exemple : `https://ton-projet.vercel.app/w/abc123`
3. **L'URL génère le PNG** → Vercel crée l'image à la demande avec tes paramètres
4. **Le PNG est mis en cache** → Généré 1 fois par jour, réutilisé ensuite

## Tester localement

```bash
npm run dev
```

L'app sera sur `http://localhost:5173`

Pour tester l'API de génération PNG localement :
```bash
vercel dev
```

## C'est gratuit ?

Oui, dans les limites :
- Vercel : 100GB bandwidth/mois gratuit
- Supabase : 500MB stockage + 2GB bandwidth gratuit

Largement suffisant pour des milliers d'utilisateurs.
