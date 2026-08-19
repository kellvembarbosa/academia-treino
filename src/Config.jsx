import { useState } from 'react';
import { WORKOUTS, FORMULAS, DAYS_PRESET, DOW_SHORT } from './data.js';
import Modal from './Modal.jsx';

// monta agenda automática: n dias na semana, blocos na ordem da fórmula escolhida
function autoSchedule(nDays, order) {
  const sched = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };
  DAYS_PRESET[nDays].forEach((dow, i) => {
    sched[dow] = order[i % order.length];
  });
  return sched;
}

export default function Config({ schedule, onSave, onClose }) {
  const [draft, setDraft] = useState({ ...schedule });
  const [formula, setFormula] = useState('pernas');
  const nDays = Object.values(draft).filter(Boolean).length;

  const setDay = (dow, val) => setDraft(d => ({ ...d, [dow]: val || null }));

  const applyCount = (n, fid = formula) => {
    const f = FORMULAS.find(x => x.id === fid) || FORMULAS[0];
    setDraft(autoSchedule(n, f.order));
  };

  const applyFormula = fid => {
    setFormula(fid);
    applyCount(nDays >= 2 ? nDays : 5, fid);
  };

  return (
    <Modal onClose={onClose}>
      <h3>Montar minha semana 🗓️</h3>
      <p>Quantos dias por semana você vai treinar? Escolha a quantidade e a fórmula — depois ajuste cada dia como preferir.</p>

      <div className="cfg-count">
        {[2, 3, 4, 5, 6, 7].map(n => (
          <button key={n} className={`cfg-count-btn ${n === nDays ? 'active' : ''}`}
            onClick={() => applyCount(n)}>
            {n}
          </button>
        ))}
      </div>

      <div className="cfg-formulas">
        {FORMULAS.map(f => (
          <button key={f.id} className={`cfg-formula ${f.id === formula ? 'active' : ''}`}
            onClick={() => applyFormula(f.id)}>
            <b>{f.name}</b>
            <small>{f.desc}</small>
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
        {' '}Os selects acima mandam: pode repetir bloco ou montar fora de qualquer fórmula.
      </p>

      <div className="row">
        <button className="btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn-primary" onClick={() => { onSave(draft); onClose(); }}>Salvar semana</button>
      </div>
    </Modal>
  );
}
