import { SHOPPING } from './data.js';

export function shoppingText(owned) {
  let out = '🛒 LISTA DE COMPRAS — Plano alimentar\n';
  for (const g of SHOPPING) {
    const items = g.items.filter(i => !owned.has(i));
    if (!items.length) continue;
    out += `\n${g.group.toUpperCase()}\n` + items.map(i => `• ${i}`).join('\n') + '\n';
  }
  return out;
}

export function generatePdf(owned) {
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const groups = SHOPPING
    .map(g => ({ ...g, items: g.items.filter(i => !owned.has(i)) }))
    .filter(g => g.items.length);

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
    li { padding: 7px 0; border-bottom: 1px solid #eee; font-size: 15px; }
    li::before { content:'☐  '; color:#bbb; }
    footer { margin-top: 30px; font-size: 11px; color:#999; }
    @media print { body { padding: 10px 0; } }
  </style></head><body>
    <header><h1>🛒 Lista de Compras</h1><small>Plano alimentar — Team Ferreira • ${dateStr}</small></header>
    ${groups.map(g => `<h2>${g.group}</h2><ul>${g.items.map(i => `<li>${i}</li>`).join('')}</ul>`).join('')}
    ${groups.length ? '' : '<p>Tudo em casa — nada para comprar! 🎉</p>'}
    <footer>Gerado pelo app de treino • use "Salvar como PDF" na tela de impressão para compartilhar.</footer>
  </body></html>`);
  doc.close();
  setTimeout(() => {
    frame.contentWindow.focus();
    frame.contentWindow.print();
  }, 300);
}
