Configuration V21P prête pour Vercel

Contenu :
- .npmrc : force l'utilisation du registre npm public
- package.json : engines npm ajoutée (10.x)
- vercel.json : configuration simple pour projet Vite

Étapes :
1. Copier ces fichiers à la racine du projet.
2. Commit/push sur GitHub.
3. Dans Vercel, relancer un déploiement sans cache.
4. Vérifier Node.js 20.x dans les settings du projet.

Remarque :
Ce pack ne contient pas le code complet du projet, seulement la configuration
nécessaire pour sécuriser le build Vercel à partir des fichiers actuellement fournis.
