// Repris de Bara (app.js) : apparitions, fils de soie, bouton clair / sombre ; plus le menu sur téléphone
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Apparition au défilement */
const io = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* Canvas net sur écrans haute densité ; renvoie le contexte et la taille CSS */
function fitCanvas(canvas) {
  const dpr = Math.min(devicePixelRatio || 1, 2), r = canvas.getBoundingClientRect();
  canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
  const ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: r.width, h: r.height };
}
/* N'anime un canvas que lorsqu'il est visible */
function animateWhenVisible(canvas, frame) {
  let visible = false, raf = 0;
  addEventListener("resize", () => frame(performance.now()));
  const loop = t => { frame(t); if (visible && !reduceMotion) raf = requestAnimationFrame(loop); };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) raf = requestAnimationFrame(loop);
  }).observe(canvas);
  frame(0);
}

/* Fils de soie : vagues de lignes fines */
document.querySelectorAll("canvas.silk").forEach(canvas => {
  let S = fitCanvas(canvas);
  addEventListener("resize", () => { S = fitCanvas(canvas); });
  const STRANDS = 34;
  animateWhenVisible(canvas, t => {
    const { ctx, w, h } = S, time = t * .00025;
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    for (let i = 0; i < STRANDS; i++) {
      const k = i / STRANDS;
      ctx.strokeStyle = `rgba(255,${190 - k * 70},${150 - k * 60},${.07 + .22 * Math.sin(k * Math.PI)})`;  // pêche → corail
      ctx.beginPath();
      for (let x = -20; x <= w + 20; x += 14) {
        const u = x / w;
        const y = h * (.58 + k * .22)
          + Math.sin(u * 5.2 + time * 2 + k * 2.4) * h * .09
          + Math.sin(u * 2.1 - time * 1.3 + k * 4) * h * .07
          + Math.cos(u * 9 + time + k * 6) * h * .015;
        x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  });
});

/* Bouton clair / sombre */
document.querySelectorAll(".theme-toggle").forEach(btn => btn.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("portfolio-theme", next); } catch (e) {}
}));

/* Menu sur téléphone */
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", e => {
  if (e.target.tagName === "A") { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", false); }
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
