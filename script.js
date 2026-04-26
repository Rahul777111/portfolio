const cursor = document.querySelector('.cursor');
const ring = document.querySelector('.cursor-ring');
const magneticItems = document.querySelectorAll('.magnetic');
const revealItems = document.querySelectorAll('.reveal');
const tiltCards = document.querySelectorAll('.tilt');

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  }
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  if (ring) {
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
  }
  requestAnimationFrame(animateRing);
}
animateRing();

[...document.querySelectorAll('a, button, .project-card, .stack-item')].forEach((el) => {
  el.addEventListener('mouseenter', () => {
    if (!cursor || !ring) return;
    cursor.style.width = '16px';
    cursor.style.height = '16px';
    ring.style.width = '62px';
    ring.style.height = '62px';
    ring.style.background = 'rgba(124,58,237,0.12)';
    ring.style.borderColor = 'rgba(196,181,253,0.55)';
  });
  el.addEventListener('mouseleave', () => {
    if (!cursor || !ring) return;
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    ring.style.width = '38px';
    ring.style.height = '38px';
    ring.style.background = 'rgba(255,255,255,0.04)';
    ring.style.borderColor = 'rgba(255,255,255,0.35)';
  });
});

magneticItems.forEach((item) => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = 'translate(0, 0)';
  });
});

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 60}ms`;
  observer.observe(item);
});
