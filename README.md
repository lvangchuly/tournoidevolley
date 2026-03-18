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
