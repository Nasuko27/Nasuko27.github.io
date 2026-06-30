# Nasuko — Portfolio

Portfolio personnel en scroll narratif : un fantôme évolue en trois stades au fil
du défilement, pendant que les décors se relaient en fondu derrière lui. Inspiré
de l'esthétique des sites "scrollytelling" modernes, sans framework — du HTML/CSS/JS
pur, 100 % statique.

🔗 **Site en ligne :** https://nasuko27.github.io

## Le concept

Une seule progression de scroll (0 → 100 %) pilote toute la scène :

| Étape         | Décor                          | Créature   |
|---------------|---------------------------------|------------|
| 0 – 30 %      | Plaine brumeuse, manoir au loin | Fantominus |
| 30 % – 65 %   | Intérieur du manoir hanté       | Spectrum   |
| 65 % – 100 %  | Dimension spectrale             | Ectoplasma |

Le décor fait un fondu enchaîné entre les trois illustrations, le fantôme change
de forme et grossit légèrement à chaque palier, et des effets spectraux (scanlines,
lueurs) montent en intensité vers la fin. Une jauge d'évolution sur le côté droit
indique la progression en temps réel.

## Stack technique

- **GSAP + ScrollTrigger** — orchestration des animations liées au scroll
- **Lenis** — smooth scroll
- **Vanilla JS/CSS** — aucun framework, aucune dépendance à installer (tout est
  chargé via CDN)
- Respecte `prefers-reduced-motion` (désactive les animations si l'utilisateur le demande)

## Structure du projet

```
index.html
css/style.css
js/main.js
assets/
  bg/        → décors (01-plaine, 02-manoir, 03-spectral)
  ghost/     → les 3 stades du fantôme (PNG transparents)
  cv.pdf     → CV téléchargeable
  tinyicon.png → favicon
```

## Lancer en local

Ouvre le dossier dans VS Code, installe l'extension **Live Server**, puis clic
droit sur `index.html` → *Open with Live Server*.

## Régler le tempo de l'évolution

Tout se passe dans `js/main.js`, fonction `updateScene()`. Les bornes sont des
pourcentages de scroll (0 = haut de page, 1 = bas) qui contrôlent les fondus de
décor, le relais des formes du fantôme et la montée des effets spectraux.

## Note

Les créatures sont des illustrations originales générées (IA), dans l'esprit
d'une ligne d'évolution fantomatique — projet personnel non commercial.
