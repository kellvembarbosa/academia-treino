import { EXERCISES, WORKOUTS, DOW_SHORT } from './data.js';
import { isoDate, fmtDur } from './store.js';

function ExCard({ id, index, isToday, rec, lastWeight, onWeight, onToggle }) {
  const ex = EXERCISES[id];
  const done = !!rec?.done;
  const weight = rec?.w ?? lastWeight ?? '';
  return (
    <div className={`ex-card ${done ? 'done' : ''}`}>
      <div className={`ex-media ${ex.gif2 ? 'duo' : ''}`}>
        <img loading="lazy" src={ex.gif} alt={ex.name} />
        {ex.gif2 && <img loading="lazy" src={ex.gif2} alt="" />}
      </div>
      <div className="ex-body">
        <div className="ex-num">EXERCÍCIO {index + 1}</div>
        <h3>{ex.name}</h3>
        <div className="ex-proto">{ex.proto}</div>
        <div className="ex-controls">
          <label className="weight-field">
            <input
              type="number" inputMode="decimal" step="0.5" min="0" placeholder="Peso"
              defaultValue={weight} key={`${id}-${weight}`} disabled={!isToday}
              onBlur={e => onWeight(id, parseFloat(e.target.value))}
            />
            <span>kg</span>
          </label>
          <button className={`done-btn ${done ? 'checked' : ''}`} disabled={!isToday}
            onClick={e => {
              const inp = e.currentTarget.parentElement.querySelector('input');
              onToggle(id, parseFloat(inp.value));
            }}>
            {done ? '✓ Feito' : 'Concluir'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Treino({ state, selectedDow, setSelectedDow, onStart, onFinish, onWeight, onToggle, onOpenConfig }) {
  const today = new Date().getDay();
  const schedule = state.schedule;
  const workoutId = schedule[selectedDow];
  const plan = workoutId ? WORKOUTS[workoutId] : null;
  const date = isoDate();
  const isToday = selectedDow === today;
  const sess = state.sessions[date];

  const picker = (
    <div className="day-picker">
      {[1, 2, 3, 4, 5, 6, 0].map(d => (
        <button key={d}
          className={`day-btn ${d === selectedDow ? 'active' : ''} ${d === today ? 'today-mark' : ''} ${schedule[d] ? '' : 'rest'}`}
          onClick={() => setSelectedDow(d)}>
          <span>{DOW_SHORT[d]}</span>
          <small>{schedule[d] ? WORKOUTS[schedule[d]].letter : '—'}</small>
        </button>
      ))}
    </div>
  );

  if (!plan) {
    return (
      <>
        {picker}
        <div className="rest-note">
          {isToday ? 'Hoje é dia de descanso 😴' : `${DOW_SHORT[selectedDow]} é dia de descanso 😴`}<br />
          Escolha um dia acima para ver o treino, ou{' '}
          <button className="link-btn" onClick={onOpenConfig}>monte sua semana</button>.
        </div>
      </>
    );
  }

  const exDone = id => isToday && sess?.ex?.[id]?.done;
  const doneCount = plan.ex.filter(exDone).length;
  const pct = Math.round(doneCount / plan.ex.length * 100);
  const activeToday = state.active && state.active.date === date;
  const finishedToday = isToday && sess?.duration != null && !activeToday;

  return (
    <>
      {picker}
      <div className="workout-head">
        <div>
          <h2><span className="w-letter">{plan.letter}</span> {plan.title}</h2>
          <div className="sub">{DOW_SHORT[selectedDow]} • {plan.ex.length} exercícios</div>
        </div>
        {isToday && (
          activeToday
            ? <button className="session-btn stop" onClick={onFinish}>■ Finalizar</button>
            : <button className="session-btn" onClick={() => onStart(selectedDow)}>▶ Iniciar treino</button>
        )}
      </div>

      {finishedToday && (
        <div className="done-banner">
          ✅ Treino de hoje registrado — duração <b>{fmtDur(sess.duration)}</b>. Pode iniciar de novo para somar tempo.
        </div>
      )}

      {isToday ? (
        <div className="progress-wrap">
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
          <div className="progress-label">{doneCount}/{plan.ex.length} exercícios concluídos</div>
        </div>
      ) : (
        <p className="section-sub">
          Visualizando outro dia — pesos e conclusão são registrados apenas no dia do treino (hoje: {DOW_SHORT[today]}).
        </p>
      )}

      {plan.ex.map((id, i) => (
        <ExCard key={id} id={id} index={i} isToday={isToday}
          rec={isToday ? sess?.ex?.[id] : null}
          lastWeight={state.lastWeights[id]}
          onWeight={onWeight} onToggle={onToggle} />
      ))}
    </>
  );
}
