import { useState } from 'react';
import { WORKOUTS } from './data.js';
import { isoDate, fmtDur } from './store.js';

export default function Calendario({ state }) {
  const [cursor, setCursor] = useState(() => new Date());
  const y = cursor.getFullYear(), m = cursor.getMonth();
  const first = new Date(y, m, 1);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const todayIso = isoDate();
  const monthName = first.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const cells = [];
  for (let i = 0; i < first.getDay(); i++) cells.push(<div key={`e${i}`} className="cal-cell empty" />);

  let went = 0, missed = 0, totalSec = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(y, m, d);
    const iso = isoDate(dt);
    const dow = dt.getDay();
    const sess = state.sessions[iso];
    const trained = sess && (sess.duration != null || Object.values(sess.ex || {}).some(e => e.done));
    const scheduled = !!state.schedule[dow];
    const past = iso < todayIso;

    let cls = '', extra = null;
    if (trained) {
      cls = 'went'; went++;
      if (sess.duration) { totalSec += sess.duration; extra = <span className="dur">{fmtDur(sess.duration)}</span>; }
      else extra = <span className="dur">✓</span>;
    } else if (scheduled && past) {
      cls = 'missed'; missed++; extra = <span className="mark">faltou</span>;
    }
    if (iso === todayIso) cls += ' today';
    cells.push(<div key={d} className={`cal-cell ${cls}`}><span>{d}</span>{extra}</div>);
  }

  return (
    <>
      <div className="cal-head">
        <h2>{monthName}</h2>
        <div className="cal-nav">
          <button onClick={() => setCursor(new Date(y, m - 1, 1))}>‹</button>
          <button onClick={() => setCursor(new Date(y, m + 1, 1))}>›</button>
        </div>
      </div>
      <div className="cal-grid">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={i} className="cal-dow">{d}</div>)}
        {cells}
      </div>
      <div className="cal-legend">
        <span><i style={{ background: 'var(--green)' }} />Fui treinar</span>
        <span><i style={{ background: 'var(--red)' }} />Dia de treino perdido</span>
        <span><i style={{ border: '2px solid var(--accent)' }} />Hoje</span>
      </div>
      <div className="cal-stats">
        <div className="stat-card"><b>{went}</b><span>treinos no mês</span></div>
        <div className="stat-card"><b>{missed}</b><span>faltas</span></div>
        <div className="stat-card"><b>{totalSec ? fmtDur(totalSec) : '—'}</b><span>tempo total</span></div>
      </div>
    </>
  );
}
