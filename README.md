# tournoidevolley-react-vite

Application web React/Vite prête à déployer pour `tournoidevolley.fr`.

## Fonctionnalités

- 18 équipes avec niveaux `N / NP / R / D / L`
- Brassage 1 : 6 poules de 3 selon le niveau
- Brassage 2 : 6 poules de 3 selon les points cumulés du brassage 1
- Principale : 12 équipes, 4 poules de 3, puis quarts, demies, finale et petite finale
- Consolante : 6 équipes, 2 poules de 3, puis demi-finales, finale et petite finale
- Méthode serpent pour la répartition des poules
- Règles de score paramétrables par phase :
  - `sec`
  - `avec 2 points d'écart`
- Classements automatiques
- Export / import JSON
- Affichage public intégré

## Prérequis

- Node.js 20.19+ ou 22.12+
- npm

## Installation

```bash
npm install
npm run dev
```

Application locale :

- `http://localhost:5173/`

## Build de production

```bash
npm run build
```

Le site statique généré sera dans `dist/`.

## Déploiement

### Vercel / Netlify / Cloudflare Pages

- commande de build : `npm run build`
- dossier publié : `dist`

### Hébergement OVH / Apache

- lance `npm run build`
- envoie le contenu du dossier `dist/` sur le dossier web du domaine
- le fichier `public/.htaccess` sera copié dans `dist/` pour gérer le fallback SPA

## Structure

- `src/App.jsx` : interface et logique tournoi
- `src/styles.css` : styles
- `src/main.jsx` : point d'entrée React
- `vite.config.js` : configuration Vite
- `public/.htaccess` : fallback SPA pour Apache

## Remarques

Cette version sauvegarde les données dans le navigateur via `localStorage`.
Pour un partage temps réel entre plusieurs appareils, ajoute ensuite une base distante comme Supabase ou Firebase.


## Sauvegarde OVHcloud partagée (v15)

Cette version ajoute une sauvegarde JSON partagée sur **OVHcloud Object Storage** via une **Function Vercel** (`api/shared-tournament.js`).

### Préparer OVHcloud

Crée un bucket Object Storage et un utilisateur Object Storage disposant d'une **Access key** et d'une **Secret key**. OVHcloud indique que ces clés se récupèrent depuis l'onglet **Object Storage users**, et que l'endpoint de bucket se récupère dans les détails du bucket.

### Variables d'environnement Vercel

Ajoute ces variables dans **Project Settings > Environment Variables** sur Vercel :

- `OVH_S3_ENDPOINT`
- `OVH_S3_REGION`
- `OVH_S3_BUCKET`
- `OVH_S3_ACCESS_KEY`
- `OVH_S3_SECRET_KEY`
- `OVH_S3_PREFIX` (optionnel)

Un exemple est fourni dans `.env.example`.

### Comportement

- **Sauvegarder sur OVHcloud** écrit un JSON partagé dans le bucket
- **Charger depuis OVHcloud** recharge le tournoi partagé
- le **QR code arbitres** embarque l'identifiant partagé du tournoi, ce qui permet au téléphone arbitre de charger automatiquement le tournoi distant après scan

### Important

Le zip `dist` reste un build **statique**. La sauvegarde OVHcloud fonctionne lorsque le projet source est déployé sur **Vercel** avec le dossier `api/` et les variables d'environnement configurées.
