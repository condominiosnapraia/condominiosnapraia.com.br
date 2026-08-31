const ALLOWED_ORIGIN = 'https://condominiosnapraia.com.br';
const FALLBACK_FROM = 'Portal Meu Litoral <felipe@condominiosnapraia.com.br>';
const DESTINATION = 'felipe@condominiosnapraia.com.br';

function headers(origin) {
  return {
    'Access-Control-Allow-Origin': origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
  };
}
function json(data, status, origin) { return new Response(JSON.stringify(data), { status, headers: headers(origin) }); }
function esc(value) { return String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function clean(value, max = 160) { return String(value ?? '').trim().slice(0, max); }
function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }

export async function onRequestOptions({ request }) { return new Response(null, { status: 204, headers: headers(request.headers.get('Origin')) }); }

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin');
  try {
    const body = await request.json();
    if (clean(body.website, 80)) return json({ ok: true, message: 'Solicitação recebida.' }, 200, origin);
    const name = clean(body.name, 120);
    const phone = clean(body.phone, 50);
    const credit = clean(body.credit, 80);
    const installment = clean(body.installment, 80);
    if (name.length < 2 || phone.length < 8 || !credit || !installment) return json({ error: 'Preencha nome, telefone, valor do crédito e parcela aproximada.' }, 400, origin);
    if (!env.RESEND_API_KEY) return json({ error: 'Formulário temporariamente indisponível.' }, 503, origin);
    const html = `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#edf3f4;font-family:Arial,sans-serif;color:#173b48"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#edf3f4"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" style="max-width:600px;background:#fff;border-radius:14px;overflow:hidden"><tr><td style="padding:22px;background:#123d4b;color:#fff"><div style="font-size:10px;letter-spacing:2px;color:#d7bb72;font-weight:700">PORTAL MEU LITORAL</div><h1 style="margin:8px 0 0;font:700 24px Georgia,serif">Nova solicitação de carta</h1></td></tr><tr><td style="padding:22px"><p style="margin:0 0 14px;font-size:14px;color:#526970">Um visitante solicitou opções de crédito contemplado para imóveis.</p><table role="presentation" width="100%" cellspacing="6" cellpadding="0"><tr><td style="padding:11px;background:#f7fafb"><b>Nome</b><br>${esc(name)}</td><td style="padding:11px;background:#f7fafb"><b>Telefone</b><br>${esc(phone)}</td></tr><tr><td style="padding:11px;background:#fbf5e5"><b>Valor do crédito</b><br>${esc(credit)}</td><td style="padding:11px;background:#fbf5e5"><b>Parcela aproximada</b><br>${esc(installment)}</td></tr></table><p style="margin:18px 0 0;font-size:11px;line-height:1.5;color:#718287">Origem: página pública de cartas contempladas. Confirme as condições antes de apresentar qualquer opção.</p></td></tr><tr><td style="padding:16px 22px;background:#f5f8f8;font-size:12px;color:#62767b"><b style="color:#173b48">Felipe Ranzolin</b><br>Corretor de Imóveis · CRECI-RS 72.386<br>WhatsApp: +55 51 99944-2252</td></tr></table></td></tr></table></body></html>`;
    const subject = `Solicitação de carta contemplada · ${name}`;
    const response = await fetch('https://api.resend.com/emails', { method:'POST', headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'}, body:JSON.stringify({ from: env.RESEND_FROM_EMAIL || FALLBACK_FROM, to:[DESTINATION], subject, html }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) return json({ error: result?.message || 'Não foi possível enviar a solicitação.', providerStatus: response.status }, response.status >= 500 ? 502 : 400, origin);
    return json({ ok:true, id:result.id, message:'Solicitação enviada com sucesso.' }, 200, origin);
  } catch (error) { return json({ error:'Não foi possível processar o formulário.' }, 400, origin); }
}

export default { async fetch(request, env) { if(request.method === 'OPTIONS') return onRequestOptions({request,env}); if(request.method === 'POST') return onRequestPost({request,env}); return json({error:'Método não permitido.'},405,request.headers.get('Origin')); } };
