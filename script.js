const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const moonIcon = themeBtn.querySelector('.moon-icon');
let isDark = true;
function setTheme(dark) {
  isDark = dark;
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  moonIcon.innerHTML = dark ? '&#9790;' : '&#9790;';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}
const saved = localStorage.getItem('theme');
if (saved) setTheme(saved === 'dark');
themeBtn.addEventListener('click', () => setTheme(!isDark));

const starCanvas = document.getElementById('star-canvas');
const sctx = starCanvas.getContext('2d');
let stars = [];
const NUM_STARS = 220;
function resizeStar() { starCanvas.width = window.innerWidth; starCanvas.height = window.innerHeight; }
function initStars() {
  stars = [];
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({ x: Math.random() * starCanvas.width, y: Math.random() * starCanvas.height, z: Math.random() * 1.5 + 0.4, r: Math.random() * 1.4 + 0.2, alpha: Math.random(), speed: Math.random() * 0.012 + 0.003, dir: Math.random() > 0.5 ? 1 : -1, color: Math.random() > 0.7 ? '196,181,253' : Math.random() > 0.5 ? '186,230,253' : '255,255,255' });
  }
}
resizeStar(); initStars();
window.addEventListener('resize', () => { resizeStar(); initStars(); resizeRain(); resizeP(); });
let viewportMX = 0, viewportMY = 0;
window.addEventListener('mousemove', (e) => { viewportMX = (e.clientX / window.innerWidth - 0.5); viewportMY = (e.clientY / window.innerHeight - 0.5); });
function drawStars() {
  sctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  stars.forEach((s) => {
    s.alpha += s.speed * s.dir;
    if (s.alpha >= 1) s.dir = -1;
    if (s.alpha <= 0) s.dir = 1;
    const px = s.x + viewportMX * 20 * s.z;
    const py = s.y + viewportMY * 20 * s.z;
    const grd = sctx.createRadialGradient(px, py, 0, px, py, s.r * 4);
    grd.addColorStop(0, `rgba(${s.color},${s.alpha})`);
    grd.addColorStop(1, `rgba(${s.color},0)`);
    sctx.beginPath(); sctx.arc(px, py, s.r * 4, 0, Math.PI * 2); sctx.fillStyle = grd; sctx.fill();
    sctx.beginPath(); sctx.arc(px, py, s.r, 0, Math.PI * 2); sctx.fillStyle = `rgba(${s.color},${Math.min(s.alpha + 0.3, 1)})`; sctx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

const rainCanvas = document.getElementById('rain-canvas');
const rctx = rainCanvas.getContext('2d');
let drops = [];
const NUM_DROPS = 130;
function resizeRain() { rainCanvas.width = window.innerWidth; rainCanvas.height = window.innerHeight; }
function createDrop() {
  return { x: Math.random() * rainCanvas.width, y: Math.random() * rainCanvas.height * -1, z: Math.random() * 1.5 + 0.5, length: Math.random() * 60 + 20, speed: Math.random() * 6 + 3, opacity: Math.random() * 0.4 + 0.05, width: Math.random() * 1.2 + 0.3, color: Math.random() > 0.5 ? '130,180,255' : '160,100,255' };
}
resizeRain();
for (let i = 0; i < NUM_DROPS; i++) drops.push({ ...createDrop(), y: Math.random() * rainCanvas.height });
const splashes = [];
window.addEventListener('mousemove', (e) => { if (Math.random() > 0.86) splashes.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.5 }); });
function drawRain() {
  rctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
  drops.forEach((drop) => {
    const px = drop.x + viewportMX * 14 * drop.z;
    const py = drop.y + viewportMY * 8 * drop.z;
    const grad = rctx.createLinearGradient(px, py, px, py + drop.length);
    grad.addColorStop(0, `rgba(${drop.color},0)`);
    grad.addColorStop(0.5, `rgba(${drop.color},${drop.opacity})`);
    grad.addColorStop(1, `rgba(${drop.color},0)`);
    rctx.beginPath(); rctx.strokeStyle = grad; rctx.lineWidth = drop.width * drop.z; rctx.moveTo(px, py); rctx.lineTo(px - drop.length * 0.1, py + drop.length); rctx.stroke();
    drop.y += drop.speed * drop.z;
    if (drop.y > rainCanvas.height + drop.length) Object.assign(drop, createDrop());
  });
  splashes.forEach((s, i) => {
    rctx.beginPath(); rctx.strokeStyle = `rgba(160,120,255,${s.alpha})`; rctx.lineWidth = 0.8; rctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); rctx.stroke(); s.r += 0.8; s.alpha -= 0.03; if (s.alpha <= 0) splashes.splice(i, 1);
  });
  requestAnimationFrame(drawRain);
}
drawRain();

const pCanvas = document.getElementById('particle-canvas');
const pctx = pCanvas.getContext('2d');
let particles = [];
const NUM_P = 70;
function resizeP() { pCanvas.width = window.innerWidth; pCanvas.height = window.innerHeight; }
function createParticle() {
  const colors = ['124,58,237', '34,211,238', '236,72,153', '255,255,255'];
  return { x: Math.random() * pCanvas.width, y: Math.random() * pCanvas.height, z: Math.random() * 1.5 + 0.4, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.3, color: colors[Math.floor(Math.random() * colors.length)], alpha: Math.random() * 0.5 + 0.1 };
}
resizeP();
for (let i = 0; i < NUM_P; i++) particles.push(createParticle());
let mpx = -9999, mpy = -9999;
window.addEventListener('mousemove', (e) => { mpx = e.clientX; mpy = e.clientY; });
function drawParticles() {
  pctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  particles.forEach((p) => {
    const dx = mpx - p.x, dy = mpy - p.y, dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 130) { p.vx -= (dx / dist) * 0.08; p.vy -= (dy / dist) * 0.08; }
    p.vx *= 0.98; p.vy *= 0.98; p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > pCanvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > pCanvas.height) p.vy *= -1;
    const px = p.x + viewportMX * 16 * p.z;
    const py = p.y + viewportMY * 16 * p.z;
    pctx.beginPath(); pctx.arc(px, py, p.r * p.z, 0, Math.PI * 2); pctx.fillStyle = `rgba(${p.color},${p.alpha})`; pctx.fill();
  });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const ax = particles[i].x + viewportMX * 16 * particles[i].z;
      const ay = particles[i].y + viewportMY * 16 * particles[i].z;
      const bx = particles[j].x + viewportMX * 16 * particles[j].z;
      const by = particles[j].y + viewportMY * 16 * particles[j].z;
      const dx = ax - bx, dy = ay - by, dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        pctx.beginPath(); pctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 100)})`; pctx.lineWidth = 0.5; pctx.moveTo(ax, ay); pctx.lineTo(bx, by); pctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

const cursor = document.querySelector('.cursor');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; if (cursor) { cursor.style.left = `${mouseX}px`; cursor.style.top = `${mouseY}px`; } });
function lerpRing() { ringX += (mouseX - ringX) * 0.13; ringY += (mouseY - ringY) * 0.13; if (ring) { ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`; } requestAnimationFrame(lerpRing); }
lerpRing();
[...document.querySelectorAll('a,button,.project-card,.stack-item,.metric')].forEach((el) => {
  el.addEventListener('mouseenter', () => { if (!ring) return; ring.style.width = '64px'; ring.style.height = '64px'; ring.style.background = 'rgba(124,58,237,0.1)'; ring.style.borderColor = 'rgba(196,181,253,0.6)'; });
  el.addEventListener('mouseleave', () => { if (!ring) return; ring.style.width = '40px'; ring.style.height = '40px'; ring.style.background = 'rgba(255,255,255,0.03)'; ring.style.borderColor = 'rgba(124,58,237,0.5)'; });
});

document.querySelectorAll('.magnetic').forEach((item) => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.15}px,${y * 0.15}px)`;
  });
  item.addEventListener('mouseleave', () => { item.style.transform = 'translate(0,0)'; });
});

document.querySelectorAll('.tilt').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotY = ((x / rect.width) - 0.5) * 14;
    const rotX = ((y / rect.height) - 0.5) * -14;
    card.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-12px) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateY(0) scale(1)'; });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => { if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), i * 60); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

window.addEventListener('click', (e) => {
  const r = document.createElement('div');
  r.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:0;height:0;border-radius:50%;border:1.5px solid rgba(124,58,237,0.7);transform:translate(-50%,-50%);pointer-events:none;z-index:99;transition:width .6s ease,height .6s ease,opacity .6s ease;opacity:1;`;
  document.body.appendChild(r);
  requestAnimationFrame(() => { r.style.width = '100px'; r.style.height = '100px'; r.style.opacity = '0'; });
  setTimeout(() => r.remove(), 650);
});

const depthLayers = document.querySelectorAll('.depth-layer');
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5);
  const y = (e.clientY / window.innerHeight - 0.5);
  depthLayers.forEach((layer) => {
    const depth = Number(layer.dataset.depth || 10);
    const tx = x * depth;
    const ty = y * depth;
    const existing = layer.classList.contains('reveal') && !layer.classList.contains('visible') ? ' translateY(30px)' : '';
    layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)${existing}`;
  });
});
