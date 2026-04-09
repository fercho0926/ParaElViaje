'use strict';

/* ============================================================
   LANDING: NAV SCROLL
============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (document.getElementById('page-landing').classList.contains('active')) {
    navbar.classList.toggle('scrolled', window.scrollY > 70);
  }
});

// HAMBURGER
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
document.getElementById('mobileClose').addEventListener('click', () => mobileMenu.classList.remove('open'));
hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));

// HERO SLIDER
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.dot');
const counter = document.getElementById('heroCounter');
const locations = ['📍 En algún lugar del mundo','📍 Noruega, Europa del Norte','📍 Kioto, Japón','📍 Bali, Indonesia','📍 Patagonia, Sudamérica'];
let current = 0;
function goTo(i) {
  slides[current].classList.remove('active'); dots[current].classList.remove('active');
  current = (i + slides.length) % slides.length;
  slides[current].classList.add('active'); dots[current].classList.add('active');
  counter.textContent = String(current+1).padStart(2,'0') + ' / ' + String(slides.length).padStart(2,'0');
  document.getElementById('slideLocation').textContent = locations[current];
}
dots.forEach(d => d.addEventListener('click', () => { clearInterval(si); goTo(parseInt(d.dataset.i)); si = setInterval(() => goTo(current+1), 5500); }));
let si = setInterval(() => goTo(current+1), 5500);

// CARRUSEL DESTINOS
const track = document.getElementById('cardsTrack');
const dCards = track.querySelectorAll('.dest-card');
let tPos = 0;
function cardW() { return dCards[0] ? dCards[0].offsetWidth + 12 : 0; }
function maxOff() { return Math.max(0, dCards.length * cardW() - track.parentElement.offsetWidth); }
document.getElementById('nextBtn').addEventListener('click', () => { tPos = Math.min(tPos+cardW(), maxOff()); track.style.transform=`translateX(-${tPos}px)`; });
document.getElementById('prevBtn').addEventListener('click', () => { tPos = Math.max(tPos-cardW(), 0); track.style.transform=`translateX(-${tPos}px)`; });
let sX = 0;
track.addEventListener('touchstart', e => { sX = e.touches[0].clientX; }, {passive:true});
track.addEventListener('touchend', e => { const d=sX-e.changedTouches[0].clientX; if(Math.abs(d)>50){tPos=d>0?Math.min(tPos+cardW(),maxOff()):Math.max(tPos-cardW(),0);track.style.transform=`translateX(-${tPos}px)`;} }, {passive:true});

// REVEAL
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);} });
}, {threshold:0.08});
reveals.forEach(r => io.observe(r));

// COUNTERS
function animateCounter(el, target) {
  const steps = 1800/16, inc = target/steps; let val=0;
  const t=setInterval(()=>{ val=Math.min(val+inc,target); el.textContent=Math.floor(val).toLocaleString('es')+(el.dataset.target=='98'?'%':'+'); if(val>=target)clearInterval(t); },16);
}
const sio = new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){animateCounter(e.target,parseInt(e.target.dataset.target));sio.unobserve(e.target);}});},{threshold:0.5});
document.querySelectorAll('.stat-number[data-target]').forEach(n=>sio.observe(n));

// CTA EMAIL
document.getElementById('ctaBtn').addEventListener('click', () => {
  const email = document.getElementById('emailInput').value.trim();
  if (!email || !email.includes('@')) { document.getElementById('emailInput').style.borderColor='#c44'; setTimeout(()=>document.getElementById('emailInput').style.borderColor='',1500); return; }
  const notif = document.getElementById('notif'); notif.classList.add('show');
  document.getElementById('emailInput').value='';
  setTimeout(()=>notif.classList.remove('show'),4500);
});