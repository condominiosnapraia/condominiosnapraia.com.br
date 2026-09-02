const ALLOWED_ORIGIN = 'https://condominiosnapraia.com.br';
const FALLBACK_SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const FALLBACK_SB_ANON = '';

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'authorization, content-type, apikey',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders(origin) });
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function brl(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function waUrl(carta) {
  const text = `Olá, Felipe! Tenho interesse na carta de crédito contemplada ${carta.code || ''} da ${carta.administrator || ''}. Crédito: ${brl(carta.credit)}. Entrada: ${brl(carta.entry)}. Gostaria de receber mais informações.`.trim();
  return `https://wa.me/5551999442252?text=${encodeURIComponent(text)}`;
}

function field(label, value, className = '') {
  if (value === null || value === undefined || value === '' || value === '—') return '';
  return `<td style="width:50%;padding:8px 10px;background:#f7fafb;border:1px solid #e5ecee;vertical-align:top" class="${className}"><div style="font:700 9px Arial,sans-serif;letter-spacing:1.1px;text-transform:uppercase;color:#70858b">${esc(label)}</div><div style="margin-top:4px;font:700 14px Arial,sans-serif;color:#173b48">${esc(value)}</div></td>`;
}

function buildHtml(carta) {
  const wa = waUrl(carta);
  const formUrl = 'https://condominiosnapraia.com.br/contemplado-imoveis/?origem=email-carta&carta=' + encodeURIComponent(carta.code || '') + '#solicitar-analise';
  const related = Array.isArray(carta.relatedCards) ? carta.relatedCards.filter(x => x && x.code && Number(x.credit) > 0).slice(0, 6) : [];
  const relatedSection = related.length ? `<tr><td style="padding:22px 26px 8px;border-top:1px solid #e4ebec"><div style="font:700 16px Georgia,serif;color:#173b48">Outras cartas de crédito contempladas</div><div style="margin-top:5px;font:12px/1.45 Arial,sans-serif;color:#63787d">Veja outras opções disponíveis no catálogo e confirme as condições com o consultor.</div></td></tr><tr><td style="padding:8px 26px 18px"><table role="presentation" width="100%" cellspacing="6" cellpadding="0">${related.map((x, i) => `<tr><td style="width:50%;padding:12px;background:${i % 2 ? '#f7fafb' : '#fbf5e5'};border:1px solid #e5ecee;border-radius:8px;vertical-align:top"><div style="font:700 9px Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:#70858b">${esc(x.administrator || 'Carta contemplada')}</div><div style="margin-top:5px;font:700 15px Georgia,serif;color:#173b48">${esc(x.code)}</div><div style="margin-top:5px;font:700 14px Arial,sans-serif;color:#168c63">${esc(brl(x.credit))}</div><div style="margin-top:3px;font:11px Arial,sans-serif;color:#63787d">Parcela: ${esc(brl(x.installment))}</div></td>${i % 2 ? '</tr>' : ''}`).join('')}${related.length % 2 ? '<td style="width:50%;padding:12px"></td></tr>' : ''}</table><div style="padding-top:12px;text-align:center"><a href="https://condominiosnapraia.com.br/contemplado-imoveis/" style="display:inline-block;padding:11px 16px;border-radius:9px;background:#123d4b;color:#fff;text-decoration:none;font:700 12px Arial,sans-serif">Ver mais opções</a></div></td></tr>` : '';
  const formSection = `<tr><td style="padding:20px 26px;background:#eef7f4;border-top:1px solid #d9ebe3"><div style="font:700 16px Georgia,serif;color:#173b48">Quer comparar outras opções?</div><div style="margin-top:6px;font:12px/1.5 Arial,sans-serif;color:#49666a">Informe seu nome, telefone, valor de crédito e parcela aproximada. O consultor retorna com opções compatíveis.</div><a href="${formUrl}" style="display:inline-block;margin-top:12px;padding:12px 17px;border-radius:9px;background:#168c63;color:#fff;text-decoration:none;font:700 12px Arial,sans-serif">Solicitar análise</a><div style="margin-top:8px;font:10px/1.4 Arial,sans-serif;color:#6c817f">O formulário abre no site para funcionar corretamente no Gmail e no celular.</div></td></tr>`;
  const credit = brl(carta.credit);
  const entry = brl(carta.entry);
  const parcel = brl(carta.installment);
  const transfer = brl(carta.transfer);
  const balance = brl(carta.balance);
  const percent = num(carta.entryPercent);
  const term = num(carta.term);
  const admin = carta.administrator || 'Administradora não informada';
  const subject = carta.code ? `Crédito Contemplado imóvel · ${carta.code}` : 'Crédito Contemplado imóvel';
  const rows = [
    field('Valor do crédito', credit), field('Entrada', entry),
    field('Parcela mensal', parcel), field('Prazo restante', term ? `${term} meses` : ''),
    field('% aproximado de entrada', percent !== null ? `${percent.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%` : ''), field('Saldo devedor', balance),
    field('Taxa de transferência', transfer), field('Código da carta', carta.code),
  ];
  let grid = '';
  for (let i = 0; i < rows.length; i += 2) grid += `<tr>${rows[i] || '<td style="width:50%"></td>'}${rows[i + 1] || '<td style="width:50%"></td>'}</tr>`;
  const notes = carta.notes ? `<tr><td colspan="2" style="padding:14px 16px;background:#fffaf0;border-left:4px solid #d6a646;color:#51656b;font:13px/1.55 Arial,sans-serif"><strong style="color:#9b6c15">Observações</strong><br>${esc(carta.notes).replace(/\n/g, '<br>')}</td></tr>` : '';
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head><body style="margin:0;background:#edf3f4;font-family:Arial,sans-serif;color:#173b48"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#edf3f4"><tr><td align="center" style="padding:22px 10px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 8px 28px rgba(23,59,72,.10)">
<tr><td style="padding:22px 26px;background:#123d4b;color:#fff"><div style="font:700 10px Arial,sans-serif;letter-spacing:2px;color:#c8aa5b;text-transform:uppercase">PORTAL MEU LITORAL</div><div style="margin-top:8px;font:700 26px/1.12 Georgia,serif">Carta contemplada<br><span style="color:#d7bb72">pronta para avançar</span></div><div style="margin-top:12px;font:13px/1.45 Arial,sans-serif;color:#dce9eb">Uma oportunidade de consórcio contemplado para análise personalizada.</div></td></tr>
<tr><td style="padding:22px 26px 4px"><div style="font:700 10px Arial,sans-serif;letter-spacing:1.4px;text-transform:uppercase;color:#8b6b22">OPORTUNIDADE RESERVADA</div><h1 style="margin:7px 0 4px;font:700 24px/1.15 Georgia,serif;color:#173b48">${esc(admin)}</h1><div style="font:13px Arial,sans-serif;color:#63787d">Código da carta: <strong>${esc(carta.code || 'Não informado')}</strong></div></td></tr>
<tr><td style="padding:18px 26px 8px"><div style="padding:18px;border-radius:14px;background:linear-gradient(135deg,#f8f2df,#fffaf0);border:1px solid #ead9a8"><div style="font:700 10px Arial,sans-serif;letter-spacing:1.4px;text-transform:uppercase;color:#907022">CRÉDITO DISPONÍVEL</div><div style="margin-top:5px;font:700 32px/1.1 Georgia,serif;color:#123d4b">${esc(credit)}</div><div style="margin-top:6px;font:13px Arial,sans-serif;color:#5f7074">Valor informado no cadastro da carta contemplada.</div></div></td></tr>
<tr><td style="padding:8px 26px 14px"><table role="presentation" width="100%" cellspacing="6" cellpadding="0">${grid}${notes}</table></td></tr>
<tr><td style="padding:4px 26px 22px"><div style="font:700 15px Georgia,serif;color:#173b48">Por que esta carta pode fazer sentido</div><p style="margin:7px 0 0;font:13px/1.55 Arial,sans-serif;color:#5e7278">A carta já contemplada pode facilitar o planejamento de aquisição de imóvel, construção ou finalidade permitida pelo contrato. As condições devem ser conferidas com a administradora antes de qualquer decisão.</p></td></tr>
<tr><td style="padding:4px 26px 26px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding-right:6px"><a href="${wa}" style="display:block;padding:13px 10px;border-radius:10px;background:#168c63;color:#fff;text-decoration:none;font:700 13px Arial,sans-serif">Falar pelo WhatsApp</a></td><td align="center" style="padding-left:6px"><a href="mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Olá! Segue a carta ${carta.code || ''} para sua análise.`)}" style="display:block;padding:13px 10px;border-radius:10px;background:#123d4b;color:#fff;text-decoration:none;font:700 13px Arial,sans-serif">Encaminhar</a></td></tr></table></td></tr>
${relatedSection}${formSection}<tr><td style="padding:18px 26px;background:#f5f8f8;border-top:1px solid #e4ebec"><div style="font:700 15px Georgia,serif;color:#173b48">Felipe Ranzolin</div><div style="margin-top:4px;font:12px/1.5 Arial,sans-serif;color:#62767b">Corretor de Imóveis · CRECI-RS 72.386<br>Portal Meu Litoral · Condomínios na Praia<br>WhatsApp: +55 51 99944-2252</div><div style="margin-top:12px;font:10px/1.45 Arial,sans-serif;color:#849397">Apresentação informativa. Confirme disponibilidade, valores, saldo, taxas e regras de utilização diretamente com a administradora antes de qualquer contratação ou transferência.</div></td></tr>
</table></td></tr></table></body></html>`;
}

async function verifyUser(request, env) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) return null;
  const sbUrl = env.SB_URL || FALLBACK_SB_URL;
  const anon = env.SB_ANON || FALLBACK_SB_ANON;
  if (!anon) return null;
  const response = await fetch(`${sbUrl}/auth/v1/user`, { headers: { apikey: anon, Authorization: auth } });
  if (!response.ok) return null;
  return response.json();
}

export async function onRequestOptions({ request }) { return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('Origin')) }); }

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin');
  try {
    const user = await verifyUser(request, env);
    if (!user) return json({ error: 'Sessão do CRM ausente ou expirada.' }, 401, origin);
    if (!env.RESEND_API_KEY) return json({ error: 'Resend não configurado no ambiente de produção.' }, 503, origin);
    const body = await request.json();
    const to = String(body.to || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return json({ error: 'Informe um e-mail válido.' }, 400, origin);
    const carta = body.carta || {};
    if (!String(carta.code || '').trim() || !Number(carta.credit)) return json({ error: 'Código e valor do crédito são obrigatórios.' }, 400, origin);
    const html = buildHtml({
      code: String(carta.code).slice(0, 80), administrator: String(carta.administrator || '').slice(0, 180),
      credit: Number(carta.credit), entry: Number(carta.entry) || 0, installment: Number(carta.installment) || 0,
      term: Number(carta.term) || 0, entryPercent: Number(carta.entryPercent), balance: Number(carta.balance) || 0,
      transfer: Number(carta.transfer) || 0,       notes: String(carta.notes || '').slice(0, 3000),
      relatedCards: Array.isArray(body.relatedCards) ? body.relatedCards.slice(0, 6).map(x => ({ code: String(x.code || '').slice(0, 80), administrator: String(x.administrator || '').slice(0, 180), credit: Number(x.credit) || 0, installment: Number(x.installment) || 0 })) : [],
    });
    const subject = `Crédito Contemplado imóvel · ${String(carta.code).slice(0, 80)}`;
    const resend = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: env.RESEND_FROM_EMAIL || 'Felipe Ranzolin <felipe@condominiosnapraia.com.br>', to: [to], subject, html }) });
    const result = await resend.json().catch(() => ({}));
    if (!resend.ok) return json({ error: result?.message || result?.name || 'Resend recusou o envio.', providerStatus: resend.status }, resend.status >= 500 ? 502 : 400, origin);
    return json({ ok: true, id: result.id, message: 'Carta enviada em HTML com opções complementares.' }, 200, origin);
  } catch (error) { return json({ error: 'Falha interna ao preparar o e-mail HTML.' }, 500, origin); }
}

export default { async fetch(request, env) { if (request.method === 'OPTIONS') return onRequestOptions({ request, env }); if (request.method === 'POST') return onRequestPost({ request, env }); return json({ error: 'Método não permitido.' }, 405, request.headers.get('Origin')); } };

export { buildHtml };
