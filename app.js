// ---------- estado ----------
const STORE_KEY = 'academia_v1';

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch { return {}; }
}
const state = Object.assign({
  sessions: {},      // 'YYYY-MM-DD' -> { day, duration, ex: { id: { w, done } } }
  lastWeights: {},   // id -> peso
  owned: [],         // itens de compra marcados como "já tenho" (persistidos)
  active: null       // { date, start } sessão em andamento
}, loadState());

function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

// ---------- helpers ----------
const $ = s => document.querySelector(s);
const view = $('#view');
const DOW_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function isoDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function fmtDur(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  if (h) return `${h}h${String(m).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
function esc(t) { return t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

function sessionFor(date, dow) {
  if (!state.sessions[date]) state.sessions[date] = { day: dow, duration: null, ex: {} };
  return state.sessions[date];
}

// ---------- timer ----------
let timerInt = null;
function tickTimer() {
  if (!state.active) return;
  const sec = Math.floor((Date.now() - state.active.start) / 1000);
  $('#timer-text').textContent = fmtDur(sec);
}
function refreshTimerChip() {
  const chip = $('#timer-chip');
  clearInterval(timerInt);
  if (state.active) {
    chip.classList.remove('hidden');
    tickTimer();
    timerInt = setInterval(tickTimer, 1000);
  } else {
    chip.classList.add('hidden');
  }
}

function startSession(dow) {
  state.active = { date: isoDate(), dow, start: Date.now() };
  sessionFor(isoDate(), dow);
  save();
  refreshTimerChip();
  render();
}

function finishSession() {
  if (!state.active) return;
  const sec = Math.floor((Date.now() - state.active.start) / 1000);
  const s = sessionFor(state.active.date, state.active.dow);
  s.duration = (s.duration || 0) + sec;
  state.active = null;
  save();
  refreshTimerChip();
  modal(`
    <h3>Treino concluído! 💪</h3>
    <p>Duração registrada: <b>${fmtDur(sec)}</b>. Dia marcado no calendário.</p>
    <div class="row"><button class="btn-primary" data-close>Fechar</button></div>
  `);
  render();
}

// ---------- modal ----------
function modal(html) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-backdrop"><div class="modal">${html}</div></div>`;
  root.querySelector('.modal-backdrop').addEventListener('click', e => {
    if (e.target.dataset.close !== undefined || e.target.classList.contains('modal-backdrop')) root.innerHTML = '';
  });
  return root;
}

// ---------- aba treino ----------
let selectedDow = null;

function renderTreino() {
  const today = new Date().getDay();
  if (selectedDow === null) selectedDow = PLAN[today] ? today : 1;
  const plan = PLAN[selectedDow];
  const date = isoDate();
  const isToday = selectedDow === today;
  const sess = state.sessions[date];

  let html = `<div class="day-picker">` + [1, 2, 3, 4, 5].map(d =>
    `<button class="day-btn ${d === selectedDow ? 'active' : ''} ${d === today ? 'today-mark' : ''}" data-dow="${d}">${DOW_SHORT[d]}</button>`
  ).join('') + `</div>`;

  if (!plan) {
    html += `<div class="rest-note">Hoje é dia de descanso 😴<br>Escolha um dia acima para ver o treino.</div>`;
    view.innerHTML = html;
    bindDayPicker();
    return;
  }

  const exDone = id => isToday && sess?.ex?.[id]?.done;
  const doneCount = plan.ex.filter(exDone).length;
  const pct = Math.round(doneCount / plan.ex.length * 100);
  const activeToday = state.active && state.active.date === date;
  const finishedToday = isToday && sess?.duration != null && !activeToday;

  html += `
    <div class="workout-head">
      <div>
        <h2>${plan.title}</h2>
        <div class="sub">${DOW_SHORT[selectedDow]} • ${plan.ex.length} exercícios</div>
      </div>
      ${isToday ? (activeToday
        ? `<button class="session-btn stop" id="btn-session">■ Finalizar</button>`
        : `<button class="session-btn" id="btn-session">▶ Iniciar treino</button>`) : ''}
    </div>`;

  if (finishedToday) {
    html += `<div class="done-banner">✅ Treino de hoje registrado — duração <b>${fmtDur(sess.duration)}</b>. Pode iniciar de novo para somar tempo.</div>`;
  }

  if (isToday) {
    html += `
      <div class="progress-wrap">
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="progress-label">${doneCount}/${plan.ex.length} exercícios concluídos</div>
      </div>`;
  } else {
    html += `<p class="section-sub">Visualizando outro dia — pesos e conclusão são registrados apenas no dia do treino (hoje: ${DOW_SHORT[today]}).</p>`;
  }

  html += plan.ex.map((id, i) => {
    const ex = EXERCISES[id];
    const rec = isToday ? sess?.ex?.[id] : null;
    const w = rec?.w ?? state.lastWeights[id] ?? '';
    const done = !!rec?.done;
    const media = ex.gif2
      ? `<div class="ex-media duo"><img loading="lazy" src="${ex.gif}" alt="${esc(ex.name)}"><img loading="lazy" src="${ex.gif2}" alt=""></div>`
      : `<div class="ex-media"><img loading="lazy" src="${ex.gif}" alt="${esc(ex.name)}"></div>`;
    return `
    <div class="ex-card ${done ? 'done' : ''}" id="card-${id}">
      ${media}
      <div class="ex-body">
        <div class="ex-num">EXERCÍCIO ${i + 1}</div>
        <h3>${esc(ex.name)}</h3>
        <div class="ex-proto">${esc(ex.proto)}</div>
        <div class="ex-controls">
          <label class="weight-field">
            <input type="number" inputmode="decimal" step="0.5" min="0" placeholder="Peso"
              value="${w}" data-weight="${id}" ${isToday ? '' : 'disabled'}>
            <span>kg</span>
          </label>
          <button class="done-btn ${done ? 'checked' : ''}" data-done="${id}" ${isToday ? '' : 'disabled'}>
            ${done ? '✓ Feito' : 'Concluir'}
          </button>
        </div>
      </div>
    </div>`;
  }).join('');

  view.innerHTML = html;
  bindDayPicker();

  $('#btn-session')?.addEventListener('click', () => {
    if (state.active) finishSession(); else startSession(selectedDow);
  });

  view.querySelectorAll('[data-weight]').forEach(inp => {
    inp.addEventListener('change', () => {
      const id = inp.dataset.weight;
      const val = parseFloat(inp.value);
      const s = sessionFor(date, selectedDow);
      if (!s.ex[id]) s.ex[id] = {};
      s.ex[id].w = isNaN(val) ? null : val;
      if (!isNaN(val)) state.lastWeights[id] = val;
      save();
    });
  });

  view.querySelectorAll('[data-done]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.done;
      const s = sessionFor(date, selectedDow);
      if (!s.ex[id]) s.ex[id] = {};
      s.ex[id].done = !s.ex[id].done;
      const winp = view.querySelector(`[data-weight="${id}"]`);
      const val = parseFloat(winp.value);
      if (!isNaN(val)) { s.ex[id].w = val; state.lastWeights[id] = val; }
      save();
      renderTreino();
    });
  });
}

function bindDayPicker() {
  view.querySelectorAll('.day-btn').forEach(b =>
    b.addEventListener('click', () => { selectedDow = +b.dataset.dow; renderTreino(); }));
}

// ---------- aba calendário ----------
let calCursor = new Date();

function renderCalendario() {
  const y = calCursor.getFullYear(), m = calCursor.getMonth();
  const first = new Date(y, m, 1);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const todayIso = isoDate();
  const monthName = first.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  let cells = '';
  for (let i = 0; i < first.getDay(); i++) cells += `<div class="cal-cell empty"></div>`;
  let went = 0, missed = 0, totalSec = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(y, m, d);
    const iso = isoDate(dt);
    const dow = dt.getDay();
    const sess = state.sessions[iso];
    const trained = sess && (sess.duration != null || Object.values(sess.ex || {}).some(e => e.done));
    const scheduled = !!PLAN[dow];
    const past = iso < todayIso;
    let cls = '', extra = '';
    if (trained) {
      cls = 'went'; went++;
      if (sess.duration) { totalSec += sess.duration; extra = `<span class="dur">${fmtDur(sess.duration)}</span>`; }
      else extra = `<span class="dur">✓</span>`;
    } else if (scheduled && past) {
      cls = 'missed'; missed++; extra = `<span class="mark">faltou</span>`;
    }
    if (iso === todayIso) cls += ' today';
    cells += `<div class="cal-cell ${cls}"><span>${d}</span>${extra}</div>`;
  }

  view.innerHTML = `
    <div class="cal-head">
      <h2>${monthName}</h2>
      <div class="cal-nav">
        <button id="cal-prev">‹</button>
        <button id="cal-next">›</button>
      </div>
    </div>
    <div class="cal-grid">
      ${['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => `<div class="cal-dow">${d}</div>`).join('')}
      ${cells}
    </div>
    <div class="cal-legend">
      <span><i style="background:var(--green)"></i>Fui treinar</span>
      <span><i style="background:var(--red)"></i>Dia de treino perdido</span>
      <span><i style="border:2px solid var(--accent)"></i>Hoje</span>
    </div>
    <div class="cal-stats">
      <div class="stat-card"><b>${went}</b><span>treinos no mês</span></div>
      <div class="stat-card"><b>${missed}</b><span>faltas</span></div>
      <div class="stat-card"><b>${totalSec ? fmtDur(totalSec) : '—'}</b><span>tempo total</span></div>
    </div>`;

  $('#cal-prev').addEventListener('click', () => { calCursor = new Date(y, m - 1, 1); renderCalendario(); });
  $('#cal-next').addEventListener('click', () => { calCursor = new Date(y, m + 1, 1); renderCalendario(); });
}

// ---------- aba dieta ----------
function renderDieta() {
  view.innerHTML = `
    <h2 class="section-title">Plano alimentar</h2>
    <p class="section-sub">Team Ferreira — Consultoria Esportiva</p>
    ${DIET.map(m => `
      <div class="meal-card">
        <h3>${m.icon} ${m.meal}</h3>
        <ul>${m.items.map(i => `<li>${i}</li>`).join('')}</ul>
        ${m.note ? `<div class="meal-note">💡 ${m.note}</div>` : ''}
      </div>`).join('')}`;
}

// ---------- aba compras ----------
let ownedDraft = null; // Set em edição (só persiste se o usuário quiser)

function renderCompras() {
  if (!ownedDraft) ownedDraft = new Set(state.owned);
  const total = SHOPPING.reduce((n, g) => n + g.items.length, 0);
  const toBuy = total - ownedDraft.size;

  view.innerHTML = `
    <h2 class="section-title">Lista de compras</h2>
    <p class="shop-intro">Baseada no plano alimentar. Marque o que <b>já tem em casa</b> — esses itens ficam fora do PDF. Ao gerar, você escolhe se salva as marcações para a próxima vez.</p>
    ${SHOPPING.map(g => `
      <div class="shop-group">
        <h3>${g.group}</h3>
        ${g.items.map(item => {
          const owned = ownedDraft.has(item);
          return `<div class="shop-item ${owned ? 'owned' : ''}" data-item="${esc(item)}">
            <span class="box">${owned ? '✓' : ''}</span>
            <span class="lbl">${esc(item)}</span>
          </div>`;
        }).join('')}
      </div>`).join('')}
    <div class="shop-actions">
      <button class="btn-ghost" id="btn-share">📤 Compartilhar</button>
      <button class="btn-primary" id="btn-pdf">🧾 Gerar PDF (${toBuy} itens)</button>
    </div>`;

  view.querySelectorAll('.shop-item').forEach(el => {
    el.addEventListener('click', () => {
      const item = el.dataset.item;
      ownedDraft.has(item) ? ownedDraft.delete(item) : ownedDraft.add(item);
      renderCompras();
    });
  });

  $('#btn-pdf').addEventListener('click', () => {
    const changed = JSON.stringify([...ownedDraft].sort()) !== JSON.stringify([...state.owned].sort());
    if (!changed) return generatePdf();
    modal(`
      <h3>Salvar marcações?</h3>
      <p>Você marcou itens como "já tenho". Quer salvar essas marcações para a próxima lista, ou usar só neste PDF?</p>
      <div class="row">
        <button class="btn-ghost" data-act="once">Só neste PDF</button>
        <button class="btn-primary" data-act="save">Salvar e gerar</button>
      </div>
      <div class="row"><button class="btn-ghost" data-close>Cancelar</button></div>
    `).querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.act === 'save') { state.owned = [...ownedDraft]; save(); }
      $('#modal-root').innerHTML = '';
      generatePdf();
    }));
  });

  $('#btn-share').addEventListener('click', async () => {
    const text = shoppingText();
    if (navigator.share) {
      try { await navigator.share({ title: 'Lista de Compras', text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      modal(`<h3>Copiado! 📋</h3><p>A lista foi copiada — é só colar no WhatsApp.</p>
        <div class="row"><button class="btn-primary" data-close>Fechar</button></div>`);
    }
  });
}

function shoppingText() {
  let out = '🛒 LISTA DE COMPRAS — Plano alimentar\n';
  for (const g of SHOPPING) {
    const items = g.items.filter(i => !ownedDraft.has(i));
    if (!items.length) continue;
    out += `\n${g.group.toUpperCase()}\n` + items.map(i => `• ${i}`).join('\n') + '\n';
  }
  return out;
}

function generatePdf() {
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const groups = SHOPPING
    .map(g => ({ ...g, items: g.items.filter(i => !ownedDraft.has(i)) }))
    .filter(g => g.items.length);

  document.getElementById('pdf-frame')?.remove();
  const frame = document.createElement('iframe');
  frame.id = 'pdf-frame';
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  doc.open();
  doc.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
  <title>Lista de Compras</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color:#222; padding:36px 40px; }
    header { border-bottom: 3px solid #ff8a1e; padding-bottom: 14px; margin-bottom: 22px; }
    h1 { font-size: 24px; }
    header small { color:#777; }
    h2 { font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; color:#d96f0a; margin: 20px 0 8px; }
    ul { list-style:none; }
    li { padding: 7px 0; border-bottom: 1px solid #eee; font-size: 15px; }
    li::before { content:'☐  '; color:#bbb; }
    footer { margin-top: 30px; font-size: 11px; color:#999; }
    @media print { body { padding: 10px 0; } }
  </style></head><body>
    <header><h1>🛒 Lista de Compras</h1><small>Plano alimentar — Team Ferreira • ${dateStr}</small></header>
    ${groups.map(g => `<h2>${g.group}</h2><ul>${g.items.map(i => `<li>${i}</li>`).join('')}</ul>`).join('')}
    ${groups.length ? '' : '<p>Tudo em casa — nada para comprar! 🎉</p>'}
    <footer>Gerado pelo app de treino • use "Salvar como PDF" na tela de impressão para compartilhar.</footer>
  </body></html>`);
  doc.close();
  setTimeout(() => {
    frame.contentWindow.focus();
    frame.contentWindow.print();
  }, 300);
}

// ---------- navegação ----------
const RENDERERS = { treino: renderTreino, calendario: renderCalendario, dieta: renderDieta, compras: renderCompras };
let currentTab = 'treino';

function render() { RENDERERS[currentTab](); }

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    currentTab = btn.dataset.tab;
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b === btn));
    if (currentTab !== 'compras') ownedDraft = null; // recarrega marcações salvas ao voltar
    render();
  });
});

// timer chip clicável → volta pra aba treino
$('#timer-chip').addEventListener('click', () => {
  document.querySelector('[data-tab="treino"]').click();
});

// ---------- PWA ----------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

refreshTimerChip();
render();
