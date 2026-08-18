import { DIET } from './data.js';

export default function Dieta() {
  return (
    <>
      <h2 className="section-title">Plano alimentar</h2>
      <p className="section-sub">Team Ferreira — Consultoria Esportiva</p>
      {DIET.map(m => (
        <div className="meal-card" key={m.meal}>
          <h3>{m.icon} {m.meal}</h3>
          <ul>{m.items.map(i => <li key={i}>{i}</li>)}</ul>
          {m.note && <div className="meal-note">💡 {m.note}</div>}
        </div>
      ))}
    </>
  );
}
