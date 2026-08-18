import { useState } from 'react';
import { SHOPPING } from './data.js';
import { shoppingText, generatePdf } from './pdf.js';
import Modal from './Modal.jsx';

export default function Compras({ savedOwned, onSaveOwned }) {
  const [owned, setOwned] = useState(() => new Set(savedOwned));
  const [modal, setModal] = useState(null); // null | 'ask-save' | 'copied'

  const total = SHOPPING.reduce((n, g) => n + g.items.length, 0);
  const toBuy = total - owned.size;

  const toggle = item => {
    const next = new Set(owned);
    next.has(item) ? next.delete(item) : next.add(item);
    setOwned(next);
  };

  const handlePdf = () => {
    const changed = JSON.stringify([...owned].sort()) !== JSON.stringify([...savedOwned].sort());
    if (!changed) return generatePdf(owned);
    setModal('ask-save');
  };

  const share = async () => {
    const text = shoppingText(owned);
    if (navigator.share) {
      try { await navigator.share({ title: 'Lista de Compras', text }); } catch { /* cancelado */ }
    } else {
      await navigator.clipboard.writeText(text);
      setModal('copied');
    }
  };

  return (
    <>
      <h2 className="section-title">Lista de compras</h2>
      <p className="shop-intro">
        Baseada no plano alimentar. Marque o que <b>já tem em casa</b> — esses itens ficam fora do PDF.
        Ao gerar, você escolhe se salva as marcações para a próxima vez.
      </p>
      {SHOPPING.map(g => (
        <div className="shop-group" key={g.group}>
          <h3>{g.group}</h3>
          {g.items.map(item => {
            const has = owned.has(item);
            return (
              <div key={item} className={`shop-item ${has ? 'owned' : ''}`} onClick={() => toggle(item)}>
                <span className="box">{has ? '✓' : ''}</span>
                <span className="lbl">{item}</span>
              </div>
            );
          })}
        </div>
      ))}
      <div className="shop-actions">
        <button className="btn-ghost" onClick={share}>📤 Compartilhar</button>
        <button className="btn-primary" onClick={handlePdf}>🧾 Gerar PDF ({toBuy} itens)</button>
      </div>

      {modal === 'ask-save' && (
        <Modal onClose={() => setModal(null)}>
          <h3>Salvar marcações?</h3>
          <p>Você marcou itens como "já tenho". Quer salvar essas marcações para a próxima lista, ou usar só neste PDF?</p>
          <div className="row">
            <button className="btn-ghost" onClick={() => { setModal(null); generatePdf(owned); }}>Só neste PDF</button>
            <button className="btn-primary" onClick={() => { onSaveOwned([...owned]); setModal(null); generatePdf(owned); }}>Salvar e gerar</button>
          </div>
          <div className="row"><button className="btn-ghost" onClick={() => setModal(null)}>Cancelar</button></div>
        </Modal>
      )}
      {modal === 'copied' && (
        <Modal onClose={() => setModal(null)}>
          <h3>Copiado! 📋</h3>
          <p>A lista foi copiada — é só colar no WhatsApp.</p>
          <div className="row"><button className="btn-primary" onClick={() => setModal(null)}>Fechar</button></div>
        </Modal>
      )}
    </>
  );
}
