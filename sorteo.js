'use strict';

/* ============================================================
   SORTEO: l¨®gica completa (app.js integrado y re-skinneado)
============================================================ */

const PREMIOS = [
  { id:1, titulo:'Premio #1 ¡¤ Descuento 10% Viajes Nacionales y Caribe', descripcion:'BONO DESCUENTO DE 10% EN SALIDAS PUNTUALES EN TEMPORADA BAJA PARA VIAJES NACIONALES Y POR EL CARIBE (PUNTA CANA, CANC¨²N, ARUBA Y CURAZAO). APLICA DE 1 A 4 PERSONAS EN LA MISMA RESERVA.' },
  { id:2, titulo:'Premio #2 ¡¤ Tour de Cortes¨ªa Punta Cana y Canc¨²n', descripcion:'TOUR DE CORTES¨ªA EN PUNTA CANA Y CANC¨²N PARA 4 PERSONAS EN LA MISMA RESERVA. APLICA S¨®LO PARA RESERVAS DEL PLAN COMPLETO.' },
  { id:3, titulo:'Premio #3 ¡¤ Descuento hasta $700.000 en Turqu¨ªa', descripcion:'DESCUENTO DE HASTA $700.000 EN SALIDAS PUNTUALES DESDE MEDELL¨ªN Y BOGOT¨¢ PARA TURQU¨ªA Y SUS COMBINADOS.' },
  { id:4, titulo:'Premio #4 ¡¤ 2¡Á1 Alojamiento San Andr¨¦s y Santa Marta', descripcion:'2X1 EN ALOJAMIENTO EN SAN ANDR¨¦S Y SANTA MARTA EN FECHAS PUNTUALES EN 2026 Y 2027.' },
  { id:5, titulo:'Premio #5 ¡¤ Hasta 50% 2a y 3a Persona ¡¤ Europa / Asia', descripcion:'DESCUENTOS DE LA SEGUNDA Y TERCERA PERSONA DE HASTA EL 50% EN SALIDAS PUNTUALES DE 2026 Y 2027 PARA EUROPA, MEDIO ORIENTE Y TAILANDIA. APLICA ANTES DE IMPUESTOS.' },
  { id:6, titulo:'Premio #6 ¡¤ Descuento 10% Caribe Colombiano', descripcion:'BONO DESCUENTO DE 10% EN SALIDAS PUNTUALES EN TEMPORADA BAJA PARA VIAJES NACIONALES Y POR EL CARIBE COLOMBIANO (SANTA MARTA, CARTAGENA Y SAN ANDR¨¦S). APLICA DE 1 A 4 PERSONAS EN LA MISMA RESERVA.' },
  { id:7, titulo:'Premio #7 ¡¤ Descuento hasta $200.000 en Suram¨¦rica', descripcion:'DESCUENTO DE HASTA $200.000 EN SALIDAS PUNTUALES DESDE MEDELL¨ªN Y BOGOT¨¢ PARA SURAM¨¦RICA.' },
  { id:8, titulo:'Premio #8 ¡¤ 2¡Á1 Alojamiento Punta Cana y Canc¨²n', descripcion:'2X1 EN ALOJAMIENTO EN PUNTA CANA Y CANC¨²N EN FECHAS PUNTUALES EN 2026 Y 2027.' },
  { id:9, titulo:'Premio #9 ¡¤ Descuento 8% Destinos Culturales', descripcion:'BONO DESCUENTO DE 8% EN SALIDAS TERRESTRES PUNTUALES EN TEMPORADA BAJA PARA VIAJES DE CULTURA (EJE CAFETERO, SANTANDER, BOYAC¨¢ Y MUCHOS DESTINOS M¨¢S). APLICA DE 1 A 4 PERSONAS EN LA MISMA RESERVA.' },
  { id:10, titulo:'Premio #10 ¡¤ Descuento hasta $500.000 en Europa', descripcion:'DESCUENTO DE HASTA $500.000 EN SALIDAS PUNTUALES DESDE MEDELL¨ªN Y BOGOT¨¢ PARA EUROPA.' }
];

const STORAGE_KEY = 'sorteo_viajes_2026';
function obtenerRegistros() { try { const r=localStorage.getItem(STORAGE_KEY); return r?JSON.parse(r):[]; } catch { return []; } }
function guardarRegistros(r) { localStorage.setItem(STORAGE_KEY, JSON.stringify(r)); }
function agregarRegistro(r) { const t=obtenerRegistros(); t.push(r); guardarRegistros(t); }

function validarFormulario() {
  let ok=true;
  const nombre=document.getElementById('nombre').value.trim();
  const cedula=document.getElementById('cedula').value.trim();
  const telefono=document.getElementById('telefono').value.trim();
  const email=document.getElementById('email').value.trim();
  limpiarErrores();
  if(!nombre||nombre.length<3){ setError('nombre','error-nombre','Ingresa tu nombre completo (m¨ªnimo 3 caracteres).'); ok=false; } else setValido('nombre');
  if(!cedula||!/^\d{5,12}$/.test(cedula)){ setError('cedula','error-cedula','La c¨¦dula debe tener entre 5 y 12 d¨ªgitos num¨¦ricos.'); ok=false; } else setValido('cedula');
  const tel=telefono.replace(/[\s\-\(\)\.]/g,'');
  if(!tel||!/^(\+?57)?3\d{9}$/.test(tel)){ setError('telefono','error-telefono','Ingresa un n¨²mero celular colombiano v¨¢lido (Ej: 3001234567).'); ok=false; } else setValido('telefono');
  if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){ setError('email','error-email','Ingresa un correo electr¨®nico v¨¢lido.'); ok=false; } else setValido('email');
  return ok;
}
function setError(fId,eId,msg) { const i=document.getElementById(fId),s=document.getElementById(eId); if(i){i.classList.add('input-error');i.classList.remove('input-valid');} if(s)s.textContent=msg; }
function setValido(fId) { const i=document.getElementById(fId); if(i){i.classList.remove('input-error');i.classList.add('input-valid');} }
function limpiarErrores() {
  ['nombre','cedula','telefono','email'].forEach(id=>{ const i=document.getElementById(id); if(i)i.classList.remove('input-error','input-valid'); });
  ['error-nombre','error-cedula','error-telefono','error-email'].forEach(id=>{ const e=document.getElementById(id); if(e)e.textContent=''; });
}
function buscarDuplicado(cedula,email) { const r=obtenerRegistros(),em=email.toLowerCase(); return r.find(x=>x.cedula===cedula||x.email===em)??null; }
function asignarPremioAleatorio() { return PREMIOS[Math.floor(Math.random()*PREMIOS.length)]; }

function mostrarPremio(registro) {
  document.getElementById('ganador-nombre').textContent=registro.nombre;
  document.getElementById('premio-titulo').textContent=registro.premio.titulo;
  document.getElementById('premio-texto').textContent=registro.premio.descripcion;
  document.getElementById('formulario-sorteo').classList.add('hidden');
  const s=document.getElementById('premio-section');
  s.classList.remove('hidden');
  setTimeout(()=>s.scrollIntoView({behavior:'smooth',block:'start'}),80);
  lanzarConfetti();
}

function lanzarConfetti() {
  const c=document.getElementById('confetti-container'); if(!c)return; c.innerHTML='';
  const cols=['#9B9B27','#C8C840','#333333','#FAFAF5','#7A7A1E','#ffffff','#F4F1E8'];
  for(let i=0;i<48;i++){
    const p=document.createElement('div'); p.className='confetti-piece';
    const circ=Math.random()>0.55;
    p.style.cssText=`left:${Math.random()*100}%;top:-15px;width:${5+Math.random()*9}px;height:${5+Math.random()*9}px;background:${cols[Math.floor(Math.random()*cols.length)]};border-radius:${circ?'50%':'2px'};animation-name:lluviConfetti;animation-duration:${1.4+Math.random()*2.2}s;animation-delay:${Math.random()*0.9}s;animation-fill-mode:forwards;animation-timing-function:linear;`;
    c.appendChild(p);
  }
  setTimeout(()=>{c.innerHTML='';},4500);
}

const WA_NUMERO='573217505345';
function reclamarPremio() {
  const nombre=document.getElementById('ganador-nombre').textContent;
  const pt=document.getElementById('premio-titulo').textContent;
  const pd=document.getElementById('premio-texto').textContent;
  const msg=`?? *RECLAMO DE PREMIO - Sorteo paraeviaje 2026*\n\n?? *Nombre:* ${nombre}\n?? *Premio ganado:* ${pt}\n\n?? *Detalle:*\n${pd}\n\n? Aplica para compras ¡Ý $25.000 ¡¤ V¨¢lido 2026¨C2027\n\n_Mensaje generado autom¨¢ticamente desde el sorteo._`;
  window.open(`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
}

function compartirPremio() {
  const pd=document.getElementById('premio-texto').textContent;
  const texto=`?? ?Gan¨¦ un premio de viajes con paraeviaje!\n\n${pd}\n\n? Aplica para compras ¡Ý $25.000 ¡¤ V¨¢lido 2026¨C2027`;
  if(navigator.share){ navigator.share({title:'?Gan¨¦ con paraeviaje!',text:texto}).catch(()=>{}); }
  else if(navigator.clipboard){ navigator.clipboard.writeText(texto).then(()=>mostrarToast('? Texto copiado al portapapeles','success')).catch(()=>mostrarToast('No se pudo copiar. Toma una captura.','warn')); }
  else { mostrarToast('Comparte tu pantalla o toma una captura.','warn'); }
}

function toggleAdmin() {
  const s=document.getElementById('admin-section');
  if(s.classList.contains('hidden')){ s.classList.remove('hidden'); renderizarTablaAdmin(); setTimeout(()=>s.scrollIntoView({behavior:'smooth',block:'start'}),80); }
  else { s.classList.add('hidden'); }
}

function renderizarTablaAdmin() {
  const regs=obtenerRegistros(), tbody=document.getElementById('admin-tbody'), noR=document.getElementById('no-records'), stats=document.getElementById('admin-stats');
  const ultima=regs.length>0?new Date(regs[regs.length-1].fecha).toLocaleDateString('es-CO'):'¡ª';
  stats.innerHTML=`<div class="stat-box"><span class="admin-stat-number">${regs.length}</span><span class="admin-stat-label">Participantes</span></div><div class="stat-box"><span class="admin-stat-number">${new Set(regs.map(r=>r.premio.id)).size}</span><span class="admin-stat-label">Premios distintos</span></div><div class="stat-box"><span class="admin-stat-number">${ultima}</span><span class="admin-stat-label">¨²ltimo registro</span></div>`;
  if(regs.length===0){ tbody.innerHTML=''; noR.classList.remove('hidden'); return; }
  noR.classList.add('hidden');
  tbody.innerHTML=[...regs].reverse().map((r,i)=>`<tr><td>${regs.length-i}</td><td>${esc(r.nombre)}</td><td>${esc(r.cedula)}</td><td>${esc(r.telefono)}</td><td>${esc(r.email)}</td><td style="max-width:180px;font-size:0.7rem;line-height:1.4;">${esc(r.premio.titulo)}</td><td>${new Date(r.fecha).toLocaleString('es-CO',{dateStyle:'short',timeStyle:'short'})}</td></tr>`).join('');
}

function esc(s){ return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

function exportarJSON() {
  const r=obtenerRegistros();
  if(!r.length){ mostrarToast('No hay registros para exportar.','warn'); return; }
  const blob=new Blob([JSON.stringify({evento:'Sorteo paraeviaje 2026',exportado_en:new Date().toISOString(),total_participantes:r.length,registros:r},null,2)],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob), a=document.createElement('a');
  a.href=url; a.download=`registros_sorteo_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  mostrarToast(`? ${r.length} registro(s) exportados correctamente.`,'success');
}

function limpiarRegistros() {
  if(!confirm('?? ?Seguro que deseas eliminar TODOS los registros?\n\nEsta acci¨®n no se puede deshacer.'))return;
  localStorage.removeItem(STORAGE_KEY); renderizarTablaAdmin();
  mostrarToast('??? Todos los registros han sido eliminados.','warn');
}

function mostrarToast(msg, tipo='info') {
  document.querySelector('.toast')?.remove();
  const t=document.createElement('div'); t.className=`toast toast-${tipo}`; t.textContent=msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('show')));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),420); },3500);
}

// FORM SUBMIT
document.getElementById('registroForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if(!validarFormulario()){ mostrarToast('Por favor corrige los errores antes de continuar.','error'); return; }
  const nombre=document.getElementById('nombre').value.trim();
  const cedula=document.getElementById('cedula').value.trim();
  const telefono=document.getElementById('telefono').value.trim();
  const email=document.getElementById('email').value.trim().toLowerCase();
  const dup=buscarDuplicado(cedula,email);
  if(dup){ const campo=dup.cedula===cedula?'c¨¦dula':'correo electr¨®nico'; mostrarToast(`?? Ya participaste con este ${campo}. Tu premio: "${dup.premio.titulo}"`, 'warn'); setTimeout(()=>mostrarPremio(dup),600); return; }
  const premio=asignarPremioAleatorio();
  const registro={ id:`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`, nombre, cedula, telefono, email, premio, fecha:new Date().toISOString() };
  agregarRegistro(registro);
  mostrarPremio(registro);
});

// INIT
window.addEventListener('DOMContentLoaded', () => {
  window.verRegistros = function() {
    const r = obtenerRegistros();
    if (!r.length) {
      console.info('No hay registros.');
      return [];
    }
    console.table(r.map(x => ({
      Nombre: x.nombre,
      Cedula: x.cedula,
      Email: x.email,
      Premio: x.premio.titulo,
      Fecha: new Date(x.fecha).toLocaleString('es-CO')
    })));
  };
});