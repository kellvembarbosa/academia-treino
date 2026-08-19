import { useEffect, useState } from 'react';
import Treino from './Treino.jsx';
import Calendario from './Calendario.jsx';
import Dieta from './Dieta.jsx';
import Compras from './Compras.jsx';
import Modal from './Modal.jsx';
import Config from './Config.jsx';
import { loadState, saveState, isoDate, fmtDur } from './store.js';

const TABS = [
  { id: 'treino', label: 'Treino', ico: '🏋️' },
  { id: 'calendario', label: 'Calendário', ico: '📅' },
  { id: 'dieta', label: 'Dieta', ico: '🍗' },
  { id: 'compras', label: 'Compras', ico: '🛒' }
];

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

export default function App() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState('treino');
  const [selectedDow, setSelectedDow] = useState(() => {
    const st = loadState();
    const t = new Date().getDay();
    if (st.schedule[t]) return t;
    return [1, 2, 3, 4, 5, 6, 0].find(d => st.schedule[d]) ?? t;
  });
  const [now, setNow] = useState(Date.now());
  const [showConfig, setShowConfig] = useState(false);
  const [finishInfo, setFinishInfo] = useState(null);   // segundos da sessão encerrada
  const [installEvt, setInstallEvt] = useState(null);   // beforeinstallprompt guardado
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(() => localStorage.getItem('install_dismissed') === '1');

  // persiste toda mudança
  useEffect(() => { saveState(state); }, [state]);

  // cronômetro
  useEffect(() => {
    if (!state.active) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [state.active]);

  // instalação
  useEffect(() => {
    const onPrompt = e => { e.preventDefault(); setInstallEvt(e); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const update = fn => setState(prev => {
    const next = structuredClone(prev);
    fn(next);
    return next;
  });

  const ensureSession = (st, date, dow) => {
    if (!st.sessions[date]) st.sessions[date] = { day: dow, duration: null, ex: {} };
    return st.sessions[date];
  };

  const startSession = dow => update(st => {
    st.active = { date: isoDate(), dow, start: Date.now() };
    ensureSession(st, isoDate(), dow);
  });

  const finishSession = () => {
    const sec = Math.floor((Date.now() - state.active.start) / 1000);
    update(st => {
      const s = ensureSession(st, st.active.date, st.active.dow);
      s.duration = (s.duration || 0) + sec;
      st.active = null;
    });
    setFinishInfo(sec);
  };

  const setWeight = (id, val) => update(st => {
    const s = ensureSession(st, isoDate(), selectedDow);
    if (!s.ex[id]) s.ex[id] = {};
    s.ex[id].w = isNaN(val) ? null : val;
    if (!isNaN(val)) st.lastWeights[id] = val;
  });

  const toggleDone = (id, weightVal) => update(st => {
    const s = ensureSession(st, isoDate(), selectedDow);
    if (!s.ex[id]) s.ex[id] = {};
    s.ex[id].done = !s.ex[id].done;
    if (!isNaN(weightVal)) { s.ex[id].w = weightVal; st.lastWeights[id] = weightVal; }
  });

  const install = async () => {
    if (installEvt) {
      installEvt.prompt();
      const { outcome } = await installEvt.userChoice;
      if (outcome === 'accepted') setInstallEvt(null);
    } else if (isIOS) {
      setShowIosHelp(true);
    }
  };

  const dismissInstall = () => {
    setInstallDismissed(true);
    localStorage.setItem('install_dismissed', '1');
  };

  const showInstallBanner = !isStandalone && !installDismissed && (installEvt || isIOS);
  const timerSec = state.active ? Math.max(0, Math.floor((now - state.active.start) / 1000)) : 0;

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="brand-badge">TF</span>
          <div>
            <h1>TEAM FERREIRA</h1>
            <small>Consultoria Esportiva</small>
          </div>
        </div>
        <div className="topbar-right">
          {state.active && (
            <div className="timer-chip" onClick={() => setTab('treino')}>
              <span className="dot" /><span>{fmtDur(timerSec)}</span>
            </div>
          )}
          <button className="icon-btn" aria-label="Montar minha semana" onClick={() => setShowConfig(true)}>⚙️</button>
        </div>
      </header>

      {showInstallBanner && (
        <div className="install-banner">
          <span>📲 Instale o app na tela de início</span>
          <div className="install-actions">
            <button className="install-btn" onClick={install}>Instalar</button>
            <button className="install-close" onClick={dismissInstall} aria-label="Fechar">✕</button>
          </div>
        </div>
      )}

      <main>
        {tab === 'treino' && (
          <Treino state={state} selectedDow={selectedDow} setSelectedDow={setSelectedDow}
            onStart={startSession} onFinish={finishSession}
            onWeight={setWeight} onToggle={toggleDone}
            onOpenConfig={() => setShowConfig(true)} />
        )}
        {tab === 'calendario' && <Calendario state={state} />}
        {tab === 'dieta' && <Dieta />}
        {tab === 'compras' && (
          <Compras savedOwned={state.ownedQty} onSaveOwned={owned => update(st => { st.ownedQty = owned; })} />
        )}
      </main>

      <nav className="tabbar">
        {TABS.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <span className="ico">{t.ico}</span>{t.label}
          </button>
        ))}
      </nav>

      {showConfig && (
        <Config schedule={state.schedule}
          onSave={sched => update(st => { st.schedule = sched; })}
          onClose={() => setShowConfig(false)} />
      )}

      {finishInfo != null && (
        <Modal onClose={() => setFinishInfo(null)}>
          <h3>Treino concluído! 💪</h3>
          <p>Duração registrada: <b>{fmtDur(finishInfo)}</b>. Dia marcado no calendário.</p>
          <div className="row"><button className="btn-primary" onClick={() => setFinishInfo(null)}>Fechar</button></div>
        </Modal>
      )}

      {showIosHelp && (
        <Modal onClose={() => setShowIosHelp(false)}>
          <h3>Instalar no iPhone 📲</h3>
          <p>
            1. Toque no botão <b>Compartilhar</b> (quadrado com seta ↑) na barra do Safari.<br />
            2. Role e toque em <b>"Adicionar à Tela de Início"</b>.<br />
            3. Confirme em <b>Adicionar</b>.
          </p>
          <div className="row"><button className="btn-primary" onClick={() => setShowIosHelp(false)}>Entendi</button></div>
        </Modal>
      )}
    </>
  );
}
