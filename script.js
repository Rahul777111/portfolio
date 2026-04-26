// ── Rain Canvas ──
const rainCanvas = document.getElementById('rain-canvas');
const rctx = rainCanvas.getContext('2d');

let drops = [];
const NUM_DROPS = 120;

function resizeRain() {
  rainCanvas.width = window.innerWidth;
  rainCanvas.height = window.innerHeight;
}
resizeRain();
window.addEventListener('resize', resizeRain);

function createDrop() {
  return {
    x: Math.random() * rainCanvas.width,
    y: Math.random() * rainCanvas.height * -1,
    length: Math.random() * 60 + 20,
    speed: Math.random() * 6 + 3,
    opacity: Math.random() * 0.4 + 0.05,
    width: Math.random() * 1.2 + 0.3,
    color: Math.random() > 0.5 ? '130,180,255' : '160,100,255',
  };
}

for (let i = 0; i < NUM_DROPS; i++) {
  drops.push({ ...createDrop(), y: Math.random() * rainCanvas.height });
}

function drawRain() {
  rctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
  drops.forEach((drop) => {
    const grad = rctx.createLinearGradient(drop.x, drop.y, drop.x, drop.y + drop.length);
    grad.addColorStop(0, `rgba(${drop.color},0)`);
    grad.addColorStop(0.5, `rgba(${drop.color},${drop.opacity})`);
    grad.addColorStop(1, `rgba(${drop.color},0)`);
    rctx.beginPath();
    rctx.strokeStyle = grad;
    rctx.lineWidth = drop.width;
    rctx.moveTo(drop.x, drop.y);
    rctx.lineTo(drop.x - drop.length * 0.1, drop.y + drop.length);
    rctx.stroke();
    drop.y += drop.speed;
    if (drop.y > rainCanvas.height + drop.length) {
      Object.assign(drop, createDrop());
    }
  });
  requestAnimationFrame(drawRain);
}
drawRain();

// Splashes on mouse
const splashes = [];
window.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.85) {
    splashes.push({ x: e.clientX, y: e.clientY, r: 0, max: Math.random() * 18 + 8, alpha: 0.5 });
  }
});

function drawSplashes() {
  splashes.forEach((s, i) => {
    rctx.beginPath();
    rctx.strokeStyle = `rgba(160,120,255,${s.alpha})`;
    rctx.lineWidth = 0.8;
    rctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    rctx.stroke();
    s.r += 0.8;
    s.alpha -= 0.03;
    if (s.alpha <= 0) splashes.splice(i, 1);
  });
}

// ── Particle Canvas ──
const pCanvas = document.getElementById('particle-canvas');
const pctx = pCanvas.getContext('2d');
let particles = [];
const NUM_P = 60;

function resizeP() {
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
}
resizeP();
window.addEventListener('resize', resizeP);

function createParticle() {
  const colors = ['124,58,237', '34,211,238', '236,72,153', '255,255,255'];
  return {
    x: Math.random() * pCanvas.width,
    y: Math.random() * pCanvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.6 + 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: Math.random() * 0.5 + 0.1,
  };
}

for (let i = 0; i < NUM_P; i++) particles.push(createParticle());

let mouseParticleX = -9999;
let mouseParticleY = -9999;
window.addEventListener('mousemove', (e) => {
  mouseParticleX = e.clientX;
  mouseParticleY = e.clientY;
});

function drawParticles() {
  pctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  particles.forEach((p) => {
    const dx = mouseParticleX - p.x;
    const dy = mouseParticleY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 130) {
      p.vx -= (dx / dist) * 0.08;
      p.vy -= (dy / dist) * 0.08;
    }
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > pCanvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > pCanvas.height) p.vy *= -1;
    pctx.beginPath();
    pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pctx.fillStyle = `rgba(${p.color},${p.alpha})`;
    pctx.fill();
  });
  // Connect nearby
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        pctx.beginPath();
        pctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 100)})`;
        pctx.lineWidth = 0.5;
        pctx.moveTo(particles[i].x, particles[i].y);
        pctx.lineTo(particles[j].x, particles[j].y);
        pctx.stroke();
      }
    }
  }
  drawSplashes();
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── Custom Cursor ──
const cursor = document.querySelector('.cursor');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) { cursor.style.left = `${mouseX}px`; cursor.style.top = `${mouseY}px`; }
});

function lerpRing() {
  ringX += (mouseX - ringX) * 0.13;
  ringY += (mouseY - ringY) * 0.13;
  if (ring) { ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`; }
  requestAnimationFrame(lerpRing);
}
lerpRing();

[...document.querySelectorAll('a,button,.project-card,.stack-item,.metric')].forEach((el) => {
  el.addEventListener('mouseenter', () => {
    if (!ring) return;
    ring.style.width = '64px'; ring.style.height = '64px';
    ring.style.background = 'rgba(124,58,237,0.1)';
    ring.style.borderColor = 'rgba(196,181,253,0.6)';
  });
  el.addEventListener('mouseleave', () => {
    if (!ring) return;
    ring.style.width = '40px'; ring.style.height = '40px';
    ring.style.background = 'rgba(255,255,255,0.03)';
    ring.style.borderColor = 'rgba(255,255,255,0.3)';
  });
});

// ── Magnetic Buttons ──
document.querySelectorAll('.magnetic').forEach((item) => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.15}px,${y * 0.15}px)`;
  });
  item.addEventListener('mouseleave', () => { item.style.transform = 'translate(0,0)'; });
});

// ── 3D Tilt Cards ──
document.querySelectorAll('.tilt').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotY = ((x / rect.width) - 0.5) * 12;
    const rotX = ((y / rect.height) - 0.5) * -12;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
  });
});

// ── Scroll Reveal ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// ── Click ripple ──
window.addEventListener('click', (e) => {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position:fixed;left:${e.clientX}px;top:${e.clientY}px;
    width:0;height:0;border-radius:50%;
    border:1.5px solid rgba(124,58,237,0.7);
    transform:translate(-50%,-50%);
    pointer-events:none;z-index:99;
    transition:width .6s ease,height .6s ease,opacity .6s ease;
    opacity:1;
  `;
  document.body.appendChild(ripple);
  requestAnimationFrame(() => {
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.opacity = '0';
  });
  setTimeout(() => ripple.remove(), 650);
});
