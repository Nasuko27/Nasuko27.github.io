# Portfolio Spectral — squelette scroll

Site statique : un fantôme qui évolue (3 stades) pendant qu'on défile, les décors
se relaient en fondu, et la jauge d'évolution se remplit. Aucun PHP, 100 % client.

## Lancer en local
Ouvre le dossier dans VS Code, installe l'extension **Live Server**, clic droit sur
`index.html` → *Open with Live Server*. Ça tourne déjà **sans aucun asset** (décors
en dégradés de secours + fantômes en SVG) → tu peux tester le scroll tout de suite.

## Où déposer les images Gemini
Garde exactement ces noms :

```
assets/bg/01-plaine.jpg      ← Décor 1 (plaine brumeuse / manoir au loin)
assets/bg/02-manoir.jpg      ← Décor 2 (intérieur du manoir hanté)
assets/bg/03-spectral.jpg    ← Décor 3 (dimension spectrale)

assets/ghost/stade1.png      ← Créature gazeuse   (PNG transparent)
assets/ghost/stade2.png      ← Créature spectrale  (PNG transparent)
assets/ghost/stade3.png      ← Créature ectoplasme (PNG transparent)
```

Dès qu'un fichier est là, il remplace automatiquement son placeholder. Tu peux les
ajouter un par un. (`.jpg` ou `.png` pour les décors — si tu changes l'extension,
mets-la à jour dans `css/style.css` et `js/main.js`.)

## Régler le tempo de l'évolution
Tout est dans `js/main.js`, fonction `updateScene()`. Les nombres sont des **% de
scroll** (0 = haut, 1 = bas) :

- `ramp(p, 0.30, 0.44)` → la plaine se transforme en manoir entre 30 % et 44 %
- `ramp(p, 0.34, 0.48)` → le fantôme passe au stade 2
- `ramp(p, 0.62, 0.76)` → passage au stade 3
- `ramp(p, 0.72, 1)`    → montée des effets spectraux

Décale ces bornes pour synchroniser les évolutions avec tes sections.

## Mettre en ligne (gratuit)
- **GitHub Pages** : push le dossier dans un repo `tonpseudo.github.io`.
- **Netlify** : glisse-dépose le dossier sur netlify.com → URL `xxx.netlify.app`.

## Stack
GSAP + ScrollTrigger (animation au scroll), Lenis (smooth scroll), vanilla JS/CSS.
Tout chargé via CDN, rien à installer.
```
```
