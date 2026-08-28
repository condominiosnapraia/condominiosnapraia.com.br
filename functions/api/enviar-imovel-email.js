const SITE = 'https://condominiosnapraia.com.br';
const SUPABASE_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDUzMywiZXhwIjoyMDk1MzIwNTMwfQ.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function text(value, max = 1200) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function htmlEmail(data) {
  const d = data || {};
  const title = text(d.titulo, 180) || 'Imóvel selecionado';
  const code = text(d.codigo, 80) || 'Não informado';
  const price = text(d.preco, 80) || 'Sob consulta';
  const location = text(d.local || d.cidade, 180) || 'Litoral Norte Gaúcho';
  const description = text(d.descricao, 900) || 'Confira os detalhes deste imóvel no Portal Meu Litoral.';
  const image = /^https:\/\//i.test(String(d.foto || '')) ? String(d.foto) : `${SITE}/img/og-home-social.jpg`;
  const url = /^https:\/\/condominiosnapraia\.com\.br\/imovel\//i.test(String(d.url || '')) ? String(d.url) : `${SITE}/imoveis/`;
  const highlights = Array.isArray(d.meta) ? d.meta.slice(0, 6).map(text).filter(Boolean) : [];
  return `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#f4f0e8;color:#143b52;font-family:Arial,Helvetica,sans-serif"><div style="max-width:680px;margin:0 auto;padding:24px 12px"><div style="background:#fff;border-radius:18px;overflow:hidden;border:1px solid #e5dac5;box-shadow:0 8px 28px rgba(13,59,84,.10)"><div style="background:#0d3b54;padding:22px 26px;color:#fff"><div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#b9e3e9">Portal Meu Litoral</div><h1 style="font-size:25px;line-height:1.2;margin:12px 0 0;color:#fff">${esc(title)}</h1></div><img src="${esc(image)}" alt="${esc(title)}" width="680" style="display:block;width:100%;height:auto;max-height:360px;object-fit:cover"><div style="padding:26px"><div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#6e8792;margin-bottom:7px">Imóvel selecionado</div><h2 style="font-size:22px;line-height:1.25;margin:0 0 18px;color:#0d3b54">${esc(title)}</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px"><div style="padding:12px;background:#f8f4ec;border-radius:10px"><div style="font-size:11px;color:#71828b;text-transform:uppercase">Código</div><strong>${esc(code)}</strong></div><div style="padding:12px;background:#f8f4ec;border-radius:10px"><div style="font-size:11px;color:#71828b;text-transform:uppercase">Valor</div><strong>${esc(price)}</strong></div></div><p style="margin:0 0 18px;color:#486471;line-height:1.55"><strong>Localização:</strong> ${esc(location)}</p>${highlights.length ? `<div style="margin:0 0 20px;color:#486471;line-height:1.6"><strong>Destaques:</strong> ${esc(highlights.join(' · '))}</div>` : ''}<h3 style="font-size:16px;margin:20px 0 8px;color:#0d3b54">Sobre o imóvel</h3><p style="margin:0 0 24px;color:#486471;line-height:1.65">${esc(description)}</p><a href="${esc(url)}" style="display:inline-block;background:#0e8a99;color:#fff;text-decoration:none;padding:14px 22px;border-radius:9px;font-weight:bold">Ver imóvel no site</a><p style="font-size:12px;color:#80939b;line-height:1.5;margin:24px 0 0">Código de referência: ${esc(code)}. Para confirmar disponibilidade, condições e agendar uma visita, responda a este e-mail.</p></div></div><p style="text-align:center;color:#78909a;font-size:12px;margin:16px 0">Condomínios na Praia · Portal Meu Litoral</p></div></body></html>`;
}

function plainText(data) {
  const d = data || {};
  return ['Olá! Separei uma oportunidade para você conhecer.','',`Imóvel: ${text(d.titulo, 180)}`,`Código: ${text(d.codigo, 80) || 'Não informado'}`,`Valor: ${text(d.preco, 80) || 'Sob consulta'}`,`Localização: ${text(d.local || d.cidade, 180)}`,`Descrição: ${text(d.descricao, 800)}`,`Página completa: ${text(d.url, 300)}`].join('\n');
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin');
  if (origin && origin !== SITE) return new Response(JSON.stringify({ error: 'Origem não autorizada.' }), { status: 403, headers: { 'content-type': 'application/json' } });
  const auth = request.headers.get('Authorization') || '';
  if (!/^Bearer\s+\S+/i.test(auth)) return new Response(JSON.stringify({ error: 'Sessão do CRM ausente.' }), { status: 401, headers: { 'content-type': 'application/json' } });
  const user = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SB_ANON, Authorization: auth } });
  if (!user.ok) return new Response(JSON.stringify({ error: 'Sessão do CRM inválida ou expirada.' }), { status: 401, headers: { 'content-type': 'application/json' } });
  if (!env.RESEND_API_KEY) return new Response(JSON.stringify({ error: 'RESEND_API_KEY ainda não está configurada.' }), { status: 503, headers: { 'content-type': 'application/json' } });
  if (!env.RESEND_FROM_EMAIL) return new Response(JSON.stringify({ error: 'Configure RESEND_FROM_EMAIL com um remetente de domínio verificado no Resend.' }), { status: 503, headers: { 'content-type': 'application/json' } });
  let payload;
  try { payload = await request.json(); } catch (_) { return new Response(JSON.stringify({ error: 'Dados inválidos.' }), { status: 400, headers: { 'content-type': 'application/json' } }); }
  const to = text(payload?.to, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return new Response(JSON.stringify({ error: 'Destinatário inválido.' }), { status: 400, headers: { 'content-type': 'application/json' } });
  const d = payload?.imovel || {};
  const subject = `Imóvel selecionado para você | ${text(d.titulo, 150) || 'Portal Meu Litoral'}`;
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() }, body: JSON.stringify({ from: env.RESEND_FROM_EMAIL, to: [to], subject, html: htmlEmail(d), text: plainText(d) }) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) return new Response(JSON.stringify({ error: result?.message || 'Resend recusou o envio.' }), { status: 502, headers: { 'content-type': 'application/json' } });
  return new Response(JSON.stringify({ ok: true, id: result?.id || null }), { status: 200, headers: { 'content-type': 'application/json' } });
}
