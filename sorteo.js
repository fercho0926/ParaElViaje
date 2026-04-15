'use strict';

/* ============================================================
   SORTEO: lógica completa — Backend Google Sheets
   Versión sincronizada entre dispositivos
============================================================ */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzByO8k_GjVjm_9FozdpO99wsepIRlXmvukSe0Mr549In6PlEU-boXNNW3JhXOqY_zs/exec';

const PREMIOS = [
  { id:1,  titulo:'Premio #1 ✈️ Descuento 10% Viajes Nacionales y Caribe',       descripcion:'BONO DESCUENTO DE 10% EN SALIDAS PUNTUALES EN TEMPORADA BAJA PARA VIAJES NACIONALES Y POR EL CARIBE (PUNTA CANA, CANCÚN, ARUBA Y CURAZAO). APLICA DE 1 A 4 PERSONAS EN LA MISMA RESERVA.' },
  { id:2,  titulo:'Premio #2 🌴 Tour de Cortesía Punta Cana y Cancún',            descripcion:'TOUR DE CORTESÍA EN PUNTA CANA Y CANCÚN PARA 4 PERSONAS EN LA MISMA RESERVA. APLICA SOLO PARA RESERVAS DEL PLAN COMPLETO.' },
  { id:3,  titulo:'Premio #3 🇹🇷 Descuento hasta $700.000 en Turquía',            descripcion:'DESCUENTO DE HASTA $700.000 EN SALIDAS PUNTUALES DESDE MEDELLÍN Y BOGOTÁ PARA TURQUÍA Y SUS COMBINADOS.' },
  { id:4,  titulo:'Premio #4 🏖️ 2×1 Alojamiento San Andrés y Santa Marta',       descripcion:'2X1 EN ALOJAMIENTO EN SAN ANDRÉS Y SANTA MARTA EN FECHAS PUNTUALES EN 2026 Y 2027.' },
  { id:5,  titulo:'Premio #5 🌍 Hasta 50% 2a y 3a Persona — Europa / Asia',      descripcion:'DESCUENTOS DE LA SEGUNDA Y TERCERA PERSONA DE HASTA EL 50% EN SALIDAS PUNTUALES DE 2026 Y 2027 PARA EUROPA, MEDIO ORIENTE Y TAILANDIA. APLICA ANTES DE IMPUESTOS.' },
  { id:6,  titulo:'Premio #6 🐠 Descuento 10% Caribe Colombiano',                descripcion:'BONO DESCUENTO DE 10% EN SALIDAS PUNTUALES EN TEMPORADA BAJA PARA VIAJES NACIONALES Y POR EL CARIBE COLOMBIANO (SANTA MARTA, CARTAGENA Y SAN ANDRÉS). APLICA DE 1 A 4 PERSONAS EN LA MISMA RESERVA.' },
  { id:7,  titulo:'Premio #7 🗺️ Descuento hasta $200.000 en Suramérica',         descripcion:'DESCUENTO DE HASTA $200.000 EN SALIDAS PUNTUALES DESDE MEDELLÍN Y BOGOTÁ PARA SURAMÉRICA.' },
  { id:8,  titulo:'Premio #8 🌅 2×1 Alojamiento Punta Cana y Cancún',            descripcion:'2X1 EN ALOJAMIENTO EN PUNTA CANA Y CANCÚN EN FECHAS PUNTUALES EN 2026 Y 2027.' },
  { id:9,  titulo:'Premio #9 🏞️ Descuento 8% Destinos Culturales',               descripcion:'BONO DESCUENTO DE 8% EN SALIDAS TERRESTRES PUNTUALES EN TEMPORADA BAJA PARA VIAJES DE CULTURA (EJE CAFETERO, SANTANDER, BOYACÁ Y MUCHOS DESTINOS MÁS). APLICA DE 1 A 4 PERSONAS EN LA MISMA RESERVA.' },
  { id:10, titulo:'Premio #10 🏛️ Descuento hasta $500.000 en Europa',             descripcion:'DESCUENTO DE HASTA $500.000 EN SALIDAS PUNTUALES DESDE MEDELLÍN Y BOGOTÁ PARA EUROPA.' }
];

/* ---------- API helper ---------- */
async function api(data) {
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return res.json();
}

/* ---------- Validación ---------- */
function validarFormulario() {
  let ok = true;
  const nombre   = document.getElementById('nombre').value.trim();
  const cedula   = document.getElementById('cedula').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const email    = document.getElementById('email').value.trim();
  limpiarErrores();
  if (!nombre || nombre.length < 3)          { setError('nombre',   'error-nombre',   'Ingresa tu nombre completo (mínimo 3 caracteres).'); ok = false; } else setValido('nombre');
  if (!cedula || !/^\d{5,12}$/.test(cedula)) { setError('cedula',   'error-cedula',   'La cédula debe tener entre 5 y 12 dígitos numéricos.'); ok = false; } else setValido('cedula');
  const tel = telefono.replace(/[\s\-\(\)\.]/g, '');
  if (!tel || !/^(\+?57)?3\d{9}$/.test(tel)) { setError('telefono', 'error-telefono', 'Ingresa un número celular colombiano válido (Ej: 3001234567).'); ok = false; } else setValido('telefono');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setError('email', 'error-email', 'Ingresa un correo electrónico válido.'); ok = false; } else setValido('email');
  return ok;
}
function setError(fId, eId, msg) {
  const i = document.getElementById(fId), s = document.getElementById(eId);
  if (i) { i.classList.add('input-error'); i.classList.remove('input-valid'); }
  if (s) s.textContent = msg;
}
function setValido(fId) {
  const i = document.getElementById(fId);
  if (i) { i.classList.remove('input-error'); i.classList.add('input-valid'); }
}
function limpiarErrores() {
  ['nombre','cedula','telefono','email'].forEach(id => {
    const i = document.getElementById(id); if (i) i.classList.remove('input-error','input-valid');
  });
  ['error-nombre','error-cedula','error-telefono','error-email'].forEach(id => {
    const e = document.getElementById(id); if (e) e.textContent = '';
  });
}

/* ---------- Premio aleatorio ---------- */
function asignarPremioAleatorio() { return PREMIOS[Math.floor(Math.random() * PREMIOS.length)]; }

/* ---------- Mostrar premio ---------- */
function mostrarPremio(registro) {
  document.getElementById('ganador-nombre').textContent = registro.nombre;
  document.getElementById('premio-titulo').textContent  = registro.premio.titulo;
  document.getElementById('premio-texto').textContent   = registro.premio.descripcion;

  const numWrap = document.getElementById('numero-participante-wrap');
  const numEl   = document.getElementById('numero-participante');
  if (numWrap && numEl && registro.numero && registro.numero <= 100) {
    numEl.textContent = '#' + String(registro.numero).padStart(3,'0');
    numWrap.classList.remove('hidden');
  } else if (numWrap) {
    numWrap.classList.add('hidden');
  }

  document.getElementById('formulario-sorteo').classList.add('hidden');
  const s = document.getElementById('premio-section');
  s.classList.remove('hidden');
  setTimeout(() => s.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  lanzarConfetti();
}

/* ---------- Confetti ---------- */
function lanzarConfetti() {
  const c = document.getElementById('confetti-container'); if (!c) return; c.innerHTML = '';
  const cols = ['#9B9B27','#C8C840','#333333','#FAFAF5','#7A7A1E','#ffffff','#F4F1E8'];
  for (let i = 0; i < 48; i++) {
    const p = document.createElement('div'); p.className = 'confetti-piece';
    const circ = Math.random() > 0.55;
    p.style.cssText = 'left:' + (Math.random()*100) + '%;top:-15px;width:' + (5+Math.random()*9) + 'px;height:' + (5+Math.random()*9) + 'px;background:' + cols[Math.floor(Math.random()*cols.length)] + ';border-radius:' + (circ?'50%':'2px') + ';animation-name:lluviConfetti;animation-duration:' + (1.4+Math.random()*2.2) + 's;animation-delay:' + (Math.random()*0.9) + 's;animation-fill-mode:forwards;animation-timing-function:linear;';
    c.appendChild(p);
  }
  setTimeout(() => { c.innerHTML = ''; }, 4500);
}

/* ---------- WhatsApp ---------- */
const WA_NUMERO = '573174027066';
function reclamarPremio() {
  const nombre  = document.getElementById('ganador-nombre').textContent;
  const pt      = document.getElementById('premio-titulo').textContent;
  const pd      = document.getElementById('premio-texto').textContent;
  const numEl   = document.getElementById('numero-participante');
  const numWrap = document.getElementById('numero-participante-wrap');
  const numTxt  = numEl && numWrap && !numWrap.classList.contains('hidden')
    ? '\n\uD83D\uDD22 *Número de participante:* ' + numEl.textContent : '';

  const msg = '\u2708\uFE0F *RECLAMO DE PREMIO - Sorteo paraelviaje 2026*\n\nHola, me gustaría cotizar la mejor experiencia para el viaje!\n\n\uD83D\uDC64 *Nombre:* ' + nombre + numTxt + '\n\uD83C\uDF81 *Premio ganado:* ' + pt + '\n\n\uD83D\uDCCB *Detalle:*\n' + pd + '\n\n_Mensaje generado automáticamente desde el sorteo._';
  window.open('https://wa.me/' + WA_NUMERO + '?text=' + encodeURIComponent(msg), '_blank', 'noopener,noreferrer');
}

/* ---------- Toast ---------- */
function mostrarToast(msg, tipo) {
  tipo = tipo || 'info';
  document.querySelector('.toast') && document.querySelector('.toast').remove();
  const t = document.createElement('div'); t.className = 'toast toast-' + tipo; t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 420); }, 3500);
}

/* ---------- Botón con loading ---------- */
function setBtnLoading(loading) {
  const btn = document.getElementById('btnSubmit');
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Guardando\u2026';
    btn.querySelector('.btn-icon').textContent = '\u23F3';
  } else {
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = '\u00A1Descubrir mi Premio!';
    btn.querySelector('.btn-icon').textContent = '\uD83C\uDF81';
  }
}

/* ---------- Submit ---------- */
document.getElementById('registroForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!validarFormulario()) { mostrarToast('Por favor corrige los errores antes de continuar.', 'error'); return; }

  const nombre   = document.getElementById('nombre').value.trim();
  const cedula   = document.getElementById('cedula').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const email    = document.getElementById('email').value.trim().toLowerCase();

  setBtnLoading(true);

  try {
    const premio = asignarPremioAleatorio();
    const res = await api({ action: 'register', nombre, cedula, telefono, email, premio });

    if (!res.ok) throw new Error(res.error || 'Error del servidor');

    if (res.duplicate) {
      const campo = res.registro.cedula === cedula ? 'cédula' : 'correo electrónico';
      mostrarToast('\u26A0\uFE0F Ya participaste con este ' + campo + '. Tu premio: "' + res.registro.premio.titulo + '"', 'warn');
      setTimeout(() => mostrarPremio(res.registro), 600);
    } else {
      mostrarPremio(res.registro);
    }
  } catch (err) {
    console.error(err);
    mostrarToast('\u274C Error de conexión. Intenta de nuevo.', 'error');
  } finally {
    setBtnLoading(false);
  }
});

/* ---------- Init ---------- */
window.addEventListener('DOMContentLoaded', () => {
  window.reclamarPremio = reclamarPremio;
});
