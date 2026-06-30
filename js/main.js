/* =========================================================
   PORTFOLIO SPECTRAL — moteur
   - Préchargement avec compteur %
   - Smooth scroll (Lenis) + ScrollTrigger (GSAP)
   - Évolution décor + créature pilotée par la progression du scroll
   ========================================================= */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- petites maths ---------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// rampe linéaire : 0 avant `a`, 1 après `b`, interpolé entre les deux
const ramp = (p, a, b) => clamp((p - a) / (b - a), 0, 1);

/* =========================================================
   1) PRÉCHARGEMENT
   On précharge les images d'assets. Qu'elles existent (load)
   ou pas encore (error), on compte pareil → le site démarre
   même avant que tu aies déposé les fichiers Gemini.
   ========================================================= */
const ASSETS = [
  'assets/bg/01-plaine.jpg',
  'assets/bg/02-manoir.jpg',
  'assets/bg/03-spectral.jpg',
  'assets/ghost/stade1.png',
  'assets/ghost/stade2.png',
  'assets/ghost/stade3.png',
];

const loaderEl = document.getElementById('loader');
const numEl = document.getElementById('loaderNum');

function preload() {
  return new Promise((resolve) => {
    let done = 0;
    const total = ASSETS.length;
    let shown = 0;
    const target = () => Math.round((done / total) * 100);

    // anime le compteur en douceur vers la valeur réelle
    const tick = setInterval(() => {
      if (shown < target()) shown++;
      numEl.textContent = shown;
      if (shown >= 100) { clearInterval(tick); resolve(); }
    }, 14);

    ASSETS.forEach((src) => {
      const img = new Image();
      const onDone = () => { done++; };
      img.onload = onDone;
      img.onerror = onDone;   // asset manquant = on n'attend pas
      img.src = src;
    });

    // garde-fou : si tout charge instantané (cache), on force 100
    setTimeout(() => { done = total; }, 2500);
  });
}

/* =========================================================
   2) BRANCHE LES VRAIS PNG DE LA CRÉATURE
   Chaque forme a un <img data-src>. Quand le PNG charge, il
   recouvre le SVG de secours. S'il manque, le SVG reste.
   ========================================================= */
function wireGhostImages() {
  document.querySelectorAll('.ghost__img').forEach((img) => {
    const src = img.getAttribute('data-src');
    const probe = new Image();
    probe.onload = () => { img.src = src; img.classList.add('is-loaded'); };
    probe.src = src;   // s'il 404, on ne fait rien → fallback SVG visible
  });
}

/* =========================================================
   3) MOTEUR DE SCÈNE
   Une seule progression globale (0 → 1) pilote tout :
   crossfade des décors, relais des 3 formes, effets de fin,
   et la jauge d'évolution.
   ----- Règle les seuils ici pour ajuster le tempo -----
   ========================================================= */
const bg1 = document.querySelector('.bg--1');
const bg2 = document.querySelector('.bg--2');
const bg3 = document.querySelector('.bg--3');
const forms = document.querySelectorAll('.ghost__form');     // index 0,1,2 = stades 1,2,3
const ghostEl = document.getElementById('ghost');
const spectralEl = document.getElementById('spectral');
const meterFill = document.getElementById('meterFill');
const meterStages = document.querySelectorAll('.meter__stage');

function updateScene(p) {
  // --- décors (crossfade en 2 transitions) ---
  const toManoir   = ramp(p, 0.30, 0.44);   // plaine → manoir
  const toSpectral = ramp(p, 0.66, 0.80);   // manoir → dimension spectrale
  bg1.style.opacity = 1 - toManoir;
  bg2.style.opacity = toManoir * (1 - toSpectral);
  bg3.style.opacity = toSpectral;

  // --- créature : relais des 3 formes ---
  const to2 = ramp(p, 0.34, 0.48);          // gazeux → spectral
  const to3 = ramp(p, 0.62, 0.76);          // spectral → ectoplasme
  forms[0].style.opacity = 1 - to2;
  forms[1].style.opacity = to2 * (1 - to3);
  forms[2].style.opacity = to3;

  // grossit légèrement à chaque palier (l'évolution se "sent")
  const scale = 1 + to2 * 0.12 + to3 * 0.16;
  ghostEl.style.scale = scale.toFixed(3);

  // --- effets spectraux : montent sur la fin ---
  spectralEl.style.opacity = ramp(p, 0.72, 1) * 0.9;

  // --- jauge ---
  meterFill.style.height = (p * 100).toFixed(1) + '%';
  const stageIdx = p < 0.42 ? 0 : p < 0.70 ? 1 : 2;
  meterStages.forEach((el, i) => el.classList.toggle('is-active', i === stageIdx));
}

/* =========================================================
   4) DÉMARRAGE
   ========================================================= */
async function start() {
  wireGhostImages();
  await preload();
  loaderEl.classList.add('is-done');

  gsap.registerPlugin(ScrollTrigger);

  /* --- Smooth scroll Lenis (désactivé si reduced-motion) --- */
  if (!REDUCED) {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* --- progression globale → updateScene --- */
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => updateScene(self.progress),
  });
  updateScene(0);

  /* --- apparitions des éléments .reveal --- */
  if (!REDUCED) {
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });
  }

  ScrollTrigger.refresh();
}

document.addEventListener('DOMContentLoaded', start);
