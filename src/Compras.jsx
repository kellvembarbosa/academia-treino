import { useState } from 'react';
import { SHOPPING, fmtQty } from './data.js';
import { shoppingText, generatePdf, remainingItems } from './pdf.js';
import Modal from './Modal.jsx';

export default function Compras({ savedOwned, onSaveOwned }) {
  const [owned, setOwned] = useState(() => ({ ...savedOwned }));
  const [modal, setModal] = useState(null); // null | 'ask-save' | 'copied'

  const toBuy = remainingItems(owned).reduce((n, g) => n + g.items.length, 0);

  const setQty = (name, val) => {
    setOwned(prev => {
      const next = { ...prev };
      if (isNaN(val) || val <= 0) delete next[name];
      else next[name] = val;
      return next;
    });
  };

  // caixinha: alterna entre "tenho tudo" e "não tenho nada"
  const toggleAll = it => {
    const have = owned[it.name] ?? 0;
    setQty(it.name, have >= it.qty ? 0 : it.qty);
  };

  const handlePdf = () => {
    const changed = JSON.stringify(owned) !== JSON.stringify(savedOwned);
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
        Quantidades estimadas para <b>1 semana</b> do plano alimentar. Informe quanto <b>já tem em casa</b> —
        o PDF sai só com o que falta. Sem preencher, vai a quantidade total da semana.
      </p>
      {SHOPPING.map(g => (
        <div className="shop-group" key={g.group}>
          <h3>{g.group}</h3>
          {g.items.map(it => {
            const have = owned[it.name] ?? 0;
            const buy = Math.max(0, +(it.qty - have).toFixed(2));
            const full = have >= it.qty;
            return (
              <div key={it.name} className={`shop-item ${full ? 'owned' : ''}`}>
                <span className="box" onClick={() => toggleAll(it)}>{full ? '✓' : ''}</span>
                <div className="shop-item-info" onClick={() => toggleAll(it)}>
                  <span className="lbl">{it.name}</span>
                  <small className="need">
                    semana: {fmtQty(it.qty, it.unit)}{it.note ? ` • ${it.note}` : ''}
                  </small>
                </div>
                <label className="have-field">
                  <span>tenho</span>
                  <input type="number" inputMode="decimal" min="0" step="any" placeholder="0"
                    value={owned[it.name] ?? ''}
                    onChange={e => setQty(it.name, parseFloat(e.target.value))} />
                  <span>{it.unit}</span>
                </label>
                <span className={`buy-badge ${buy > 0 ? '' : 'zero'}`}>
                  {buy > 0 ? `comprar ${fmtQty(buy, it.unit)}` : 'tem tudo ✓'}
                </span>
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
          <h3>Salvar o que você tem?</h3>
          <p>Você informou quantidades que já tem em casa. Quer salvar para a próxima lista, ou usar só neste PDF?</p>
          <div className="row">
            <button className="btn-ghost" onClick={() => { setModal(null); generatePdf(owned); }}>Só neste PDF</button>
            <button className="btn-primary" onClick={() => { onSaveOwned({ ...owned }); setModal(null); generatePdf(owned); }}>Salvar e gerar</button>
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
