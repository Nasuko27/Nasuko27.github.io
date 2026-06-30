const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ramp = (p, a, b) => clamp((p - a) / (b - a), 0, 1);

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

    const tick = setInterval(() => {
      if (shown < target()) shown++;
      numEl.textContent = shown;
      if (shown >= 100) { clearInterval(tick); resolve(); }
    }, 14);

    ASSETS.forEach((src) => {
      const img = new Image();
      const onDone = () => { done++; };
      img.onload = onDone;
      img.onerror = onDone;  
      img.src = src;
    });
    setTimeout(() => { done = total; }, 2500);
  });
}

function wireGhostImages() {
  document.querySelectorAll('.ghost__img').forEach((img) => {
    const src = img.getAttribute('data-src');
    const probe = new Image();
    probe.onload = () => { img.src = src; img.classList.add('is-loaded'); };
    probe.src = src;   // s'il 404, on ne fait rien → fallback SVG visible
  });
}

const bg1 = document.querySelector('.bg--1');
const bg2 = document.querySelector('.bg--2');
const bg3 = document.querySelector('.bg--3');
const forms = document.querySelectorAll('.ghost__form');     // index 0,1,2 = stades 1,2,3
const ghostEl = document.getElementById('ghost');
const spectralEl = document.getElementById('spectral');
const meterFill = document.getElementById('meterFill');
const meterStages = document.querySelectorAll('.meter__stage');

function updateScene(p) {

  const toManoir   = ramp(p, 0.30, 0.44);  
  const toSpectral = ramp(p, 0.66, 0.80);   
  bg1.style.opacity = 1 - toManoir;
  bg2.style.opacity = toManoir * (1 - toSpectral);
  bg3.style.opacity = toSpectral;
  const to2 = ramp(p, 0.34, 0.48);   
  const to3 = ramp(p, 0.62, 0.76);       
  forms[0].style.opacity = 1 - to2;
  forms[1].style.opacity = to2 * (1 - to3);
  forms[2].style.opacity = to3;

  const scale = 1 + to2 * 0.12 + to3 * 0.16;
  ghostEl.style.scale = scale.toFixed(3);

  spectralEl.style.opacity = ramp(p, 0.72, 1) * 0.9;

  meterFill.style.height = (p * 100).toFixed(1) + '%';
  const stageIdx = p < 0.42 ? 0 : p < 0.70 ? 1 : 2;
  meterStages.forEach((el, i) => el.classList.toggle('is-active', i === stageIdx));
}

async function start() {
  wireGhostImages();
  await preload();
  loaderEl.classList.add('is-done');

  gsap.registerPlugin(ScrollTrigger);

  if (!REDUCED) {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => updateScene(self.progress),
  });
  updateScene(0);

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
