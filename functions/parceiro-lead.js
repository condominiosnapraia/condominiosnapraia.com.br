const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const HEADERS = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}`, 'content-type': 'application/json' };
const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'x-content-type-options': 'nosniff' };

function clean(value, max = 500) { return String(value ?? '').trim().slice(0, max); }
function validUUID(value) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || '')); }

async function query(path) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: HEADERS });
  return r.ok ? r.json() : [];
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...JSON_HEADERS, 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' } });
  if (context.request.method !== 'POST') return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405, headers: JSON_HEADERS });
  try {
    const body = await context.request.json();
    const siteId = clean(body.site_id, 80);
    const imovelId = clean(body.imovel_id, 120);
    const nome = clean(body.nome, 120);
    const telefone = clean(body.telefone, 40);
    const email = clean(body.email, 160);
    const mensagem = clean(body.mensagem, 1000);
    const origemUrl = clean(body.origem_url, 500);
    if (!validUUID(siteId) || nome.length < 2 || telefone.length < 8 || body.consentimento_lgpd !== true) return new Response(JSON.stringify({ error: 'Preencha nome, telefone e consentimento LGPD.' }), { status: 400, headers: JSON_HEADERS });
    const sites = await query(`parceiros_sites?id=eq.${encodeURIComponent(siteId)}&status=eq.active&select=id&limit=1`);
    if (!Array.isArray(sites) || !sites[0]) return new Response(JSON.stringify({ error: 'Site parceiro não está publicado.' }), { status: 404, headers: JSON_HEADERS });
    let safeImovelId = null;
    if (imovelId) {
      const allowed = await query(`parceiros_sites_imoveis?site_id=eq.${encodeURIComponent(siteId)}&imovel_id=eq.${encodeURIComponent(imovelId)}&publicado=eq.true&select=imovel_id&limit=1`);
      if (Array.isArray(allowed) && allowed[0]) safeImovelId = allowed[0].imovel_id;
    }
    const insert = await fetch(`${SB_URL}/rest/v1/parceiros_leads`, { method: 'POST', headers: { ...HEADERS, Prefer: 'return=minimal' }, body: JSON.stringify({ site_id: siteId, imovel_id: safeImovelId, nome, telefone, email: email || null, mensagem: mensagem || null, origem: 'landing_corretor', origem_url: origemUrl || null, consentimento_lgpd: true, status: 'novo' }) });
    if (!insert.ok) return new Response(JSON.stringify({ error: 'Não foi possível registrar o lead agora.' }), { status: 502, headers: JSON_HEADERS });
    return new Response(JSON.stringify({ ok: true }), { status: 201, headers: JSON_HEADERS });
  } catch (_) {
    return new Response(JSON.stringify({ error: 'Dados inválidos.' }), { status: 400, headers: JSON_HEADERS });
  }
}
