// persistência em localStorage — mesma chave da versão vanilla, dados antigos sobrevivem
import { DEFAULT_SCHEDULE, WORKOUTS, SHOPPING } from './data.js';

const STORE_KEY = 'academia_v1';

function sanitizeSchedule(raw) {
  const sched = {};
  for (let d = 0; d <= 6; d++) {
    const w = raw?.[d];
    sched[d] = WORKOUTS[w] ? w : null;
  }
  return sched;
}

// versões antigas guardavam owned como lista de nomes ("já tenho tudo")
function migrateOwned(raw) {
  if (raw.ownedQty) return raw.ownedQty;
  if (!Array.isArray(raw.owned)) return {};
  const need = {};
  for (const g of SHOPPING) for (const it of g.items) need[it.name] = it.qty;
  const out = {};
  for (const name of raw.owned) if (need[name] != null) out[name] = need[name];
  return out;
}

export function loadState() {
  let raw = {};
  try { raw = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { /* corrompido → zera */ }
  return {
    sessions: raw.sessions || {},      // 'YYYY-MM-DD' -> { day, duration, ex: { id: { w, done } } }
    lastWeights: raw.lastWeights || {},
    ownedQty: migrateOwned(raw),       // { nome do item: quantidade que já tem }
    active: raw.active || null,        // { date, dow, start }
    schedule: raw.schedule ? sanitizeSchedule(raw.schedule) : { ...DEFAULT_SCHEDULE }
  };
}

export function saveState(state) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

export function isoDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function fmtDur(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  if (h) return `${h}h${String(m).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
