// persistência em localStorage — mesma chave da versão vanilla, dados antigos sobrevivem
const STORE_KEY = 'academia_v1';

export function loadState() {
  let raw = {};
  try { raw = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { /* corrompido → zera */ }
  return {
    sessions: raw.sessions || {},      // 'YYYY-MM-DD' -> { day, duration, ex: { id: { w, done } } }
    lastWeights: raw.lastWeights || {},
    owned: raw.owned || [],
    active: raw.active || null         // { date, dow, start }
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
