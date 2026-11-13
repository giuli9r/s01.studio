/**
 * STUDIO 01 — CLIENT-SIDE ARCHITECTURE & LOGIC
 * Dynamic Calendar, Live CRM Console, Budget Engine & WhatsApp Routing
 */

// ==========================================================================
// 1. CONFIGURATION (Edit your business variables here)
// ==========================================================================
const CONFIG = {
  // Configura tu número de WhatsApp aquí (código de país + número, sin espacios ni '+')
  whatsappNumber: "5493564630777",

  pricing: {
    tierBase: { maxSections: 3, total: 110000, label: "PLAN BASE: HASTA 3 SECCIONES" },
    tierStandard: { maxSections: 6, total: 150000, label: "PLAN ESTÁNDAR: 4 A 6 SECCIONES" },
    tierComplete: { maxSections: 10, total: 200000, label: "PLAN COMPLETO: 7 A 10 SECCIONES" },
    maintenanceBaseUsd: 20,
    supportMonths: 6
  }
};

/**
 * Generador de URLs de WhatsApp codificadas
 */
function buildWhatsAppUrl(message) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message.trim())}`;
}

// ==========================================================================
// 2. ACCESSIBLE THEME ENGINE (Dark / Light)
// ==========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);
}

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
}

function applyTheme(theme) {
  const html = document.documentElement;
  const btn = document.getElementById('theme-toggle-btn');
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');

  html.setAttribute('data-theme', theme);

  if (theme === 'dark') {
    if (icon) icon.innerText = '☀';
    if (label) label.innerText = 'light';
    if (btn) {
      btn.setAttribute('aria-label', 'Cambiar a tema claro');
      btn.setAttribute('aria-pressed', 'false');
    }
  } else {
    if (icon) icon.innerText = '☾';
    if (label) label.innerText = 'dark';
    if (btn) {
      btn.setAttribute('aria-label', 'Cambiar a tema oscuro');
      btn.setAttribute('aria-pressed', 'true');
    }
  }
}

// ==========================================================================
// 3. DYNAMIC CALENDAR ENGINE (Real-Time Current Date)
// ==========================================================================
const MONTH_NAMES_ES = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];
const MONTH_SHORT_ES = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"
];

let currentCalendarDate = new Date();

function renderDynamicCalendar() {
  const grid = document.getElementById('calendar-days');
  const monthTitle = document.getElementById('cal-month-title');
  const dateLabel = document.getElementById('selected-date-label');
  if (!grid || !monthTitle) return;

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth(); // 0 - 11
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const currentDayNum = today.getDate();

  // Actualizar título del mes
  monthTitle.innerText = `${MONTH_NAMES_ES[month]} ${year}`;

  grid.innerHTML = '';

  // Calcular primer día del mes (0: Domingo, 1: Lunes, etc.)
  // Ajustamos a Lunes = 0, Domingo = 6
  const firstDay = new Date(year, month, 1).getDay();
  const startPaddingDays = (firstDay + 6) % 7;

  // Días totales del mes
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Celdas vacías iniciales
  for (let i = 0; i < startPaddingDays; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'cal-day empty';
    emptyCell.setAttribute('aria-hidden', 'true');
    grid.appendChild(emptyCell);
  }

  // Días del mes
  let selectedDay = isCurrentMonth ? currentDayNum : 1;

  for (let day = 1; day <= daysInMonth; day++) {
    const dayBtn = document.createElement('button');
    dayBtn.type = 'button';
    dayBtn.className = 'cal-day';

    if (day === selectedDay) {
      dayBtn.classList.add('active');
    }
    if (isCurrentMonth && day === currentDayNum) {
      dayBtn.classList.add('today');
      dayBtn.title = "Hoy";
    }

    dayBtn.innerText = day;
    dayBtn.setAttribute('aria-label', `Día ${day} de ${MONTH_NAMES_ES[month]}`);

    dayBtn.onclick = function () {
      document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('active'));
      dayBtn.classList.add('active');
      if (dateLabel) {
        dateLabel.innerText = `FECHA SELECCIONADA: ${day} ${MONTH_SHORT_ES[month]}`;
      }
    };

    grid.appendChild(dayBtn);
  }

  if (dateLabel) {
    dateLabel.innerText = `FECHA SELECCIONADA: ${selectedDay} ${MONTH_SHORT_ES[month]}`;
  }
}

function selectSlot(element) {
  document.querySelectorAll('.slot-item').forEach(s => s.classList.remove('active'));
  element.classList.add('active');
}

// ==========================================================================
// 4. INTERACTIVE CRM BENTO CONSOLE SIMULATION (Sección 03)
// ==========================================================================
const CRM_SCENARIOS = [
  {
    leadName: "Clínica Dental San Francisco",
    channel: "WhatsApp Business API",
    time: "Hace 2 min",
    message: "Hola! Tenemos 4 odontólogos en el equipo y perdemos muchos turnos por cancelaciones a última hora. ¿Tienen algo automático?",
    score: "98%",
    tags: ["Prioridad: Alta", "Requerimiento: Turnero", "SLA: Inmediato"],
    response: "¡Hola! Sí, implementamos turneros dinámicos sincronizados 24/7 con recordatorio automático por WhatsApp que reducen ausencias un 40%. ¿Te comparto una demo funcional?"
  },
  {
    leadName: "Taller & Repuestos Oscar",
    channel: "WhatsApp Business API",
    time: "Hace 5 min",
    message: "Buenas tardes, necesito un catálogo con botón directo a WhatsApp para que los clientes consulten stock de repuestos rápido.",
    score: "94%",
    tags: ["Prioridad: Media-Alta", "Requerimiento: Landing + Catálogo", "Presupuesto: Estándar"],
    response: "¡Buenas tardes! Desarrollamos landings de alta conversión con catálogo visual optimizado y cotización en 1 clic directo a WhatsApp. Te paso ejemplos y esquema modular."
  }
];

let activeScenarioIndex = 0;

function switchCrmScenario() {
  activeScenarioIndex = (activeScenarioIndex + 1) % CRM_SCENARIOS.length;
  loadCrmScenario(activeScenarioIndex);
}

function loadCrmScenario(index) {
  const data = CRM_SCENARIOS[index];
  const nameEl = document.getElementById('crm-lead-name');
  const timeEl = document.getElementById('crm-lead-time');
  const msgEl = document.getElementById('crm-lead-message');
  const scoreEl = document.getElementById('crm-lead-score');
  const tagsContainer = document.getElementById('crm-lead-tags');
  const respEl = document.getElementById('crm-lead-response');
  const dispatchBtn = document.getElementById('crm-dispatch-btn');

  if (!nameEl) return;

  nameEl.innerText = data.leadName;
  if (timeEl) timeEl.innerText = data.time;
  if (msgEl) msgEl.innerText = `"${data.message}"`;
  if (scoreEl) scoreEl.innerText = `SCORE IA: ${data.score}`;
  if (respEl) respEl.innerText = `"${data.response}"`;

  if (tagsContainer) {
    tagsContainer.innerHTML = '';
    data.tags.forEach(t => {
      const chip = document.createElement('span');
      chip.className = 'ai-tag-chip';
      chip.innerText = t;
      tagsContainer.appendChild(chip);
    });
  }

  // Resetear botón de despacho
  if (dispatchBtn) {
    dispatchBtn.classList.remove('dispatched');
    dispatchBtn.innerHTML = `<span>⚡</span><span>APROBAR &amp; ENVIAR</span>`;
  }
}

function handleCrmDispatch() {
  const btn = document.getElementById('crm-dispatch-btn');
  if (!btn) return;

  if (btn.classList.contains('dispatched')) {
    // Si ya fue enviado, reiniciar
    btn.classList.remove('dispatched');
    btn.innerHTML = `<span>⚡</span><span>APROBAR &amp; ENVIAR</span>`;
    return;
  }

  btn.innerHTML = `<span>⏳</span><span>DESPACHANDO...</span>`;
  setTimeout(() => {
    btn.classList.add('dispatched');
    btn.innerHTML = `<span>✓</span><span>DESPACHADO · 1.2s</span>`;
  }, 450);
}

// ==========================================================================
// 5. INTERACTIVE BOOKING SLOTS (Sección 02 - Turnero)
// ==========================================================================
let currentSelectedSlot = null;

function selectBookingSlot(element, timeRange) {
  document.querySelectorAll('.slot-row').forEach(row => {
    row.classList.remove('active');
    if (!row.classList.contains('confirmed')) {
      const actionText = row.querySelector('.slot-action-text');
      if (actionText) actionText.innerText = 'DISPONIBLE';
    }
  });

  element.classList.remove('confirmed');
  element.classList.add('active');
  const actionText = element.querySelector('.slot-action-text');
  if (actionText) actionText.innerText = '[ SELECCIONADO ]';

  currentSelectedSlot = element;

  // Resetear estado del botón de confirmación
  const confirmBtn = document.getElementById('confirm-booking-btn');
  if (confirmBtn) {
    confirmBtn.classList.remove('confirmed');
    confirmBtn.innerText = 'CONFIRMAR TURNO';
  }
}

function confirmBookingSlot() {
  const activeSlot = currentSelectedSlot || document.querySelector('.slot-row.active');
  const confirmBtn = document.getElementById('confirm-booking-btn');

  if (!activeSlot) return;

  // Actualizar slot a confirmado con estilo verde
  activeSlot.classList.remove('active');
  activeSlot.classList.add('confirmed');
  const actionText = activeSlot.querySelector('.slot-action-text');
  if (actionText) {
    actionText.innerText = '[ CONFIRMADO ✓ ]';
  }

  // Feedback en el botón de la demo sin redireccionar a WhatsApp
  if (confirmBtn) {
    confirmBtn.classList.add('confirmed');
    confirmBtn.innerText = '✓ TURNO CONFIRMADO (DEMO)';
  }
}

// ==========================================================================
// 6. LIVE BUDGET CALCULATOR (Sección 04 - Sincronizado 100% con HTML)
// ==========================================================================
function toggleChip(element) {
  if (element.classList.contains('locked')) return;

  element.classList.toggle('active');
  const checkbox = element.querySelector('.chip-checkbox');
  if (checkbox) {
    checkbox.innerText = element.classList.contains('active') ? '✓' : '';
  }

  calculateBudget();
}

function calculateBudget() {
  const activeChips = document.querySelectorAll('.section-select-chip.active');
  const count = activeChips.length;

  let total = CONFIG.pricing.tierBase.total;
  let tier = CONFIG.pricing.tierBase.label;

  if (count <= CONFIG.pricing.tierBase.maxSections) {
    total = CONFIG.pricing.tierBase.total;
    tier = CONFIG.pricing.tierBase.label;
  } else if (count <= CONFIG.pricing.tierStandard.maxSections) {
    total = CONFIG.pricing.tierStandard.total;
    tier = CONFIG.pricing.tierStandard.label;
  } else {
    total = CONFIG.pricing.tierComplete.total;
    tier = CONFIG.pricing.tierComplete.label;
  }

  const advance = total / 2;
  const balance = total / 2;

  const countEl = document.getElementById('metric-sections-count');
  const badgeEl = document.getElementById('metric-tier-badge');
  const totalEl = document.getElementById('calc-total-val');
  const advanceEl = document.getElementById('calc-advance-val');
  const balanceEl = document.getElementById('calc-balance-val');

  if (countEl) countEl.innerText = `${count} SECCIONES ACTIVAS`;
  if (badgeEl) badgeEl.innerText = tier;
  if (totalEl) totalEl.innerHTML = `$${total.toLocaleString('es-AR')} <span class="calc-currency">ARS</span>`;
  if (advanceEl) advanceEl.innerText = `$${advance.toLocaleString('es-AR')} ARS`;
  if (balanceEl) balanceEl.innerText = `$${balance.toLocaleString('es-AR')} ARS`;

  // Construir mensaje detallado para WhatsApp
  const selectedNames = [];
  activeChips.forEach(chip => {
    selectedNames.push(chip.dataset.name || 'Sección');
  });

  const message = `Hola Studio 01! Quiero cotizar una Landing Page con la siguiente configuración:

📌 Secciones seleccionadas (${count}):
- ${selectedNames.join('\n- ')}

💰 Inversión Total: $${total.toLocaleString('es-AR')} ARS
💳 Anticipo 50%: $${advance.toLocaleString('es-AR')} ARS
💳 Saldo 50%: $${balance.toLocaleString('es-AR')} ARS
🛠️ Mantenimiento base desde: ${CONFIG.pricing.maintenanceBaseUsd} USD/mes
🛠️ Incluye: ${CONFIG.pricing.supportMonths} meses de soporte y capacitación.

¿Coordinamos para arrancar?`;

  const orderBtn = document.getElementById('whatsapp-order-btn');
  if (orderBtn) {
    orderBtn.href = buildWhatsAppUrl(message);
  }
}

// ==========================================================================
// 7. DIRECT ARTIFACT ROUTING (CTAs para Artefactos B, C y D)
// ==========================================================================
function setupDirectArtifactCtas() {
  // Artefacto B: Turnero
  const btnTurnero = document.getElementById('cta-artefacto-turnero');
  if (btnTurnero) {
    btnTurnero.href = buildWhatsAppUrl("Hola Studio 01! Me interesa ver una demo funcional de turnos para mi negocio.");
  }

  // Artefacto C: CRM IA
  const btnCrm = document.getElementById('cta-artefacto-crm');
  if (btnCrm) {
    btnCrm.href = buildWhatsAppUrl("Hola Studio 01! Quiero automatizar mis prospectos de WhatsApp con un CRM personalizado con IA.");
  }

  // Artefacto D: QR Cards
  const btnQr = document.getElementById('cta-artefacto-qr');
  if (btnQr) {
    btnQr.href = buildWhatsAppUrl("Hola Studio 01! Tengo un evento y quiero ver cómo funciona la acreditación con QR Pass.");
  }

  // Sticky Mobile Bar
  const btnSticky = document.getElementById('sticky-whatsapp-btn');
  if (btnSticky) {
    btnSticky.href = buildWhatsAppUrl("Hola Studio 01! Quisiera consultar por el desarrollo de software para mi negocio.");
  }
}

// ==========================================================================
// 8. STICKY MOBILE BAR OBSERVER
// ==========================================================================
function setupStickyMobileBar() {
  const bar = document.getElementById('mobile-sticky-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    if (window.innerWidth < 768) {
      if (window.scrollY > 380) {
        bar.classList.add('visible');
      } else {
        bar.classList.remove('visible');
      }
    } else {
      bar.classList.remove('visible');
    }
  }, { passive: true });
}

// ==========================================================================
// 9. INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderDynamicCalendar();
  loadCrmScenario(0);
  calculateBudget();
  setupDirectArtifactCtas();
  setupStickyMobileBar();
});
