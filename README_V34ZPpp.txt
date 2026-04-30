Tournoi de Volley - Version V34ZP++

Corrections appliquées depuis V34ZO :
- APP_VERSION mis à jour en V34ZP++.
- Lors de la saisie d'un score par l'arbitre, le match conserve l'état Match en cours.
- Le score saisi par l'arbitre est conservé dans submittedScoreA/submittedScoreB et reste visible côté Public.
- L'affichage Public exclut explicitement les matchs en cours de la liste des prochains matchs en se basant sur l'id du match.
- Les prochains matchs Public ne sont plus calculés à partir de l'absence de score, mais uniquement à partir du statut A saisir.

Déploiement :
- ZIP source prêt pour Vercel/GitHub.
- Vercel reconstruira le dossier dist via npm run build.
