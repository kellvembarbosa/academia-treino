import { SHOPPING, fmtQty } from './data.js';

// quanto falta comprar de cada item: necessidade semanal − o que já tem
export function remainingItems(ownedQty) {
  return SHOPPING.map(g => ({
    group: g.group,
    items: g.items
      .map(it => {
        const have = ownedQty[it.name] ?? 0;
        const buy = Math.max(0, +(it.qty - have).toFixed(2));
        return { ...it, buy };
      })
      .filter(it => it.buy > 0)
  })).filter(g => g.items.length);
}

export function shoppingText(ownedQty) {
  let out = '🛒 LISTA DE COMPRAS — 1 semana do plano alimentar\n';
  for (const g of remainingItems(ownedQty)) {
    out += `\n${g.group.toUpperCase()}\n` +
      g.items.map(it => `• ${it.name} — ${fmtQty(it.buy, it.unit)}`).join('\n') + '\n';
  }
  return out;
}

export function generatePdf(ownedQty) {
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const groups = remainingItems(ownedQty);

  document.getElementById('pdf-frame')?.remove();
  const frame = document.createElement('iframe');
  frame.id = 'pdf-frame';
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  doc.open();
  doc.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
  <title>Lista de Compras</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color:#222; padding:36px 40px; }
    header { border-bottom: 3px solid #ff8a1e; padding-bottom: 14px; margin-bottom: 22px; }
    h1 { font-size: 24px; }
    header small { color:#777; }
    h2 { font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; color:#d96f0a; margin: 20px 0 8px; }
    ul { list-style:none; }
    li { padding: 7px 0; border-bottom: 1px solid #eee; font-size: 15px; display:flex; justify-content:space-between; }
    li b { color:#d96f0a; font-variant-numeric: tabular-nums; }
    li::before { content:'☐  '; color:#bbb; }
    li span { flex:1; }
    footer { margin-top: 30px; font-size: 11px; color:#999; }
    @media print { body { padding: 10px 0; } }
  </style></head><body>
    <header><h1>🛒 Lista de Compras</h1><small>1 semana do plano alimentar — Team Ferreira • ${dateStr}</small></header>
    ${groups.map(g => `<h2>${g.group}</h2><ul>${g.items.map(it =>
      `<li><span>${it.name}</span><b>${fmtQty(it.buy, it.unit)}</b></li>`).join('')}</ul>`).join('')}
    ${groups.length ? '' : '<p>Tudo em casa — nada para comprar! 🎉</p>'}
    <footer>Quantidades estimadas para 7 dias do plano • use "Salvar como PDF" na tela de impressão para compartilhar.</footer>
  </body></html>`);
  doc.close();
  setTimeout(() => {
    frame.contentWindow.focus();
    frame.contentWindow.print();
  }, 300);
}
