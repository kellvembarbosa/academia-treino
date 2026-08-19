import { useEffect, useRef, useState } from 'react';
import { EXERCISES } from './data.js';
import { fmtDur } from './store.js';

function beep() {
  try {
    const c = new (window.AudioContext || window.webkitAudioContext)();
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.frequency.value = 880; g.gain.value = 0.25;
    o.start(); o.stop(c.currentTime + 0.3);
  } catch { /* sem áudio */ }
  navigator.vibrate?.([200, 100, 200]);
}

const EXEC_EST = 40; // estimativa de execução de 1 série (s)

// fases: work (executando série) | partner (vez do parceiro) | rest (descanso cronometrado)
export default function Player({ workout, duo, session, lastWeights, timerSec, onWeight, onMarkDone, onFinishAll, onExit }) {
  const firstPending = Math.max(0, workout.ex.findIndex(id => !session?.ex?.[id]?.done));
  const [exIdx, setExIdx] = useState(firstPending === -1 ? 0 : firstPending);
  const [setIdx, setSetIdx] = useState(0);
  const [phase, setPhase] = useState('work');
  const [restLeft, setRestLeft] = useState(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const exId = workout.ex[exIdx];
  const ex = EXERCISES[exId];
  const sets = ex.sets || [{ r: '—', d: 40 }];
  const set = sets[Math.min(setIdx, sets.length - 1)];
  const isLastSet = setIdx >= sets.length - 1;
  const isLastEx = exIdx >= workout.ex.length - 1;
  const weight = session?.ex?.[exId]?.w ?? lastWeights[exId] ?? '';

  // fullscreen de verdade quando o navegador deixa
  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => { if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); };
  }, []);

  // contagem de descanso (também roda na vez do parceiro, como referência)
  useEffect(() => {
    if (phase !== 'rest' && phase !== 'partner') return;
    const t = setInterval(() => {
      setRestLeft(prev => {
        if (prev <= 1) {
          if (phaseRef.current === 'rest') {
            beep();
            setPhase('work');
            setSetIdx(i => i + 1);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  const nextExercise = () => {
    onMarkDone(exId);
    if (isLastEx) { onFinishAll(); return; }
    setExIdx(i => i + 1); setSetIdx(0); setPhase('work');
  };

  const completeSet = () => {
    if (duo) { setRestLeft(set.d || 30); setPhase('partner'); return; }
    if (isLastSet) { nextExercise(); return; }
    if (!set.d) { setSetIdx(i => i + 1); return; }
    setRestLeft(set.d); setPhase('rest');
  };

  const partnerDone = () => {
    // você descansou enquanto o parceiro treinava → segue direto
    if (isLastSet) { nextExercise(); return; }
    setSetIdx(i => i + 1); setPhase('work');
  };

  const skipRest = () => { setPhase('work'); setSetIdx(i => i + 1); };
  const skipExercise = () => {
    if (isLastEx) { onFinishAll(); return; }
    setExIdx(i => i + 1); setSetIdx(0); setPhase('work');
  };

  // estimativa de tempo restante (dobra em dupla)
  let remaining = 0;
  for (let e = exIdx; e < workout.ex.length; e++) {
    const ss = EXERCISES[workout.ex[e]].sets || [];
    for (let s = (e === exIdx ? setIdx : 0); s < ss.length; s++) {
      remaining += (EXEC_EST + (ss[s].d || 0)) * (duo ? 2 : 1);
    }
  }

  const totalSets = sets.length;
  const donePct = Math.round(((exIdx + (setIdx / totalSets)) / workout.ex.length) * 100);

  return (
    <div className="player">
      <div className="player-top">
        <button className="player-exit" onClick={() => {
          if (window.confirm('Sair do treino guiado? A sessão continua rodando.')) onExit();
        }}>✕</button>
        <div className="player-meta">
          <b>{workout.letter} · {workout.title}{duo ? ' · 🤝 dupla' : ''}</b>
          <small>exercício {exIdx + 1}/{workout.ex.length} • ⏱ {fmtDur(timerSec)} • ≈{Math.max(1, Math.round(remaining / 60))}min restantes</small>
        </div>
        <button className="player-skip" onClick={skipExercise}>pular ›</button>
      </div>
      <div className="player-progress"><div style={{ width: `${donePct}%` }} /></div>

      <div className="player-body">
        <div className={`ex-media ${ex.gif2 ? 'duo' : ''}`}>
          <img src={ex.gif} alt={ex.name} />
          {ex.gif2 && <img src={ex.gif2} alt="" />}
        </div>
        <h2>{ex.name}</h2>

        <div className="player-set-info">
          <span className="player-set-count">Série {Math.min(setIdx + 1, totalSets)}/{totalSets}</span>
          <span className="player-reps">{set.r} rep</span>
          {set.nota && <span className="player-nota">{set.nota}</span>}
        </div>

        <label className="weight-field player-weight">
          <input type="number" inputMode="decimal" step="0.5" min="0" placeholder="Peso"
            key={`${exId}-${weight}`} defaultValue={weight}
            onBlur={e => onWeight(exId, parseFloat(e.target.value))} />
          <span>kg</span>
        </label>
      </div>

      <div className="player-action">
        {phase === 'work' && (
          <button className="player-btn" onClick={completeSet}>
            ✓ Concluí a série ({set.r} rep)
          </button>
        )}
        {phase === 'partner' && (
          <>
            <div className="player-rest partner">
              <small>🤝 Vez do parceiro — seu descanso</small>
              <b>{restLeft > 0 ? `${restLeft}s` : 'pronto!'}</b>
            </div>
            <button className="player-btn" onClick={partnerDone}>
              Parceiro concluiu → minha vez
            </button>
          </>
        )}
        {phase === 'rest' && (
          <>
            <div className="player-rest">
              <small>😮‍💨 Descanso — próxima: série {setIdx + 2}/{totalSets}</small>
              <b>{restLeft}s</b>
            </div>
            <button className="player-btn ghost" onClick={skipRest}>Pular descanso ›</button>
          </>
        )}
      </div>
    </div>
  );
}
