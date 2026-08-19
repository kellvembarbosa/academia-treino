import { useState } from 'react';
import { WORKOUTS, WORKOUT_CYCLE, DAYS_PRESET, DOW_SHORT } from './data.js';
import Modal from './Modal.jsx';

// monta agenda automática: n dias na semana, blocos em rotação A→B→C→D
function autoSchedule(nDays) {
  const sched = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };
  DAYS_PRESET[nDays].forEach((dow, i) => {
    sched[dow] = WORKOUT_CYCLE[i % WORKOUT_CYCLE.length];
  });
  return sched;
}

export default function Config({ schedule, onSave, onClose }) {
  const [draft, setDraft] = useState({ ...schedule });
  const nDays = Object.values(draft).filter(Boolean).length;

  const setDay = (dow, val) => setDraft(d => ({ ...d, [dow]: val || null }));

  return (
    <Modal onClose={onClose}>
      <h3>Montar minha semana 🗓️</h3>
      <p>Quantos dias por semana você vai treinar? Escolha para distribuir automaticamente, depois ajuste cada dia como preferir.</p>

      <div className="cfg-count">
        {[2, 3, 4, 5, 6, 7].map(n => (
          <button key={n} className={`cfg-count-btn ${n === nDays ? 'active' : ''}`}
            onClick={() => setDraft(autoSchedule(n))}>
            {n}
          </button>
        ))}
      </div>

      <div className="cfg-days">
        {[1, 2, 3, 4, 5, 6, 0].map(dow => (
          <label key={dow} className={`cfg-day ${draft[dow] ? '' : 'rest'}`}>
            <span className="cfg-day-name">{DOW_SHORT[dow]}</span>
            <select value={draft[dow] || ''} onChange={e => setDay(dow, e.target.value)}>
              <option value="">😴 Descanso</option>
              {Object.entries(WORKOUTS).map(([id, w]) => (
                <option key={id} value={id}>Treino {w.letter} — {w.title}</option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <p className="cfg-hint">
        {nDays === 0
          ? 'Nenhum dia de treino selecionado.'
          : `${nDays} dia${nDays > 1 ? 's' : ''} de treino por semana.`}
        {' '}Pode repetir bloco (ex.: Quadríceps 2×) ou começar a semana pelo que preferir.
      </p>

      <div className="row">
        <button className="btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn-primary" onClick={() => { onSave(draft); onClose(); }}>Salvar semana</button>
      </div>
    </Modal>
  );
}
