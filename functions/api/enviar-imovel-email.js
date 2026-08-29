const SITE = 'https://condominiosnapraia.com.br';
const WHATSAPP_NUMBER = '555197698450';
const SUPABASE_URL_FALLBACK = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON_FALLBACK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4Lz3bIE';

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function text(value, max = 1200) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function photoUrls(value, max = 5) {
  const source = Array.isArray(value) ? value : [];
  const output = [];
  const seen = new Set();
  for (const item of source) {
    const raw = typeof item === 'string' ? item : item?.url || item?.src || item?.publicUrl || item?.public_url || '';
    const url = String(raw || '').trim();
    const normalized = url.startsWith('/cdn-fotos/') ? `${SITE}${url}` : url;
    if (!/^https:\/\//i.test(normalized) || seen.has(normalized)) continue;
    seen.add(normalized);
    output.push(normalized);
    if (output.length >= max) break;
  }
  return output;
}

function imageCell(url, alt, width = '50%') {
  return `<td width="${width}" valign="top" style="padding:5px"><img src="${esc(url)}" alt="${esc(alt)}" width="320" style="display:block;width:100%;height:205px;object-fit:cover;border:0;border-radius:12px;background:#edf1f2"></td>`;
}

function galleryTable(images, alt) {
  if (!images.length) return '';
  const rows = [];
  for (let i = 0; i < images.length; i += 2) {
    const pair = images.slice(i, i + 2);
    rows.push(`<tr>${imageCell(pair[0], `${alt} — foto ${i + 1}`)}${pair[1] ? imageCell(pair[1], `${alt} — foto ${i + 2}`) : '<td width="50%"></td>'}</tr>`);
  }
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px -5px 18px;width:calc(100% + 10px)">${rows.join('')}</table>`;
}

function factCell(label, value) {
  if (!text(value, 180)) return '';
  return `<td width="50%" valign="top" style="padding:6px"><div style="background:#f6f2e9;border:1px solid #eee5d6;border-radius:10px;padding:12px 13px"><div style="font-size:10px;line-height:1.2;letter-spacing:1.3px;text-transform:uppercase;color:#71828b;margin-bottom:5px">${esc(label)}</div><div style="font-size:14px;line-height:1.35;font-weight:bold;color:#153f54">${esc(value)}</div></div></td>`;
}

function factTable(facts) {
  const valid = facts.filter(([, value]) => text(value, 180));
  if (!valid.length) return '';
  const rows = [];
  for (let i = 0; i < valid.length; i += 2) {
    const pair = valid.slice(i, i + 2);
    rows.push(`<tr>${factCell(pair[0][0], pair[0][1])}${pair[1] ? factCell(pair[1][0], pair[1][1]) : '<td width="50%"></td>'}</tr>`);
  }
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 -6px 18px;width:calc(100% + 12px)">${rows.join('')}</table>`;
}

function htmlEmail(data) {
  const d = data || {};
  const title = text(d.titulo, 180) || 'Imóvel selecionado';
  const code = text(d.codigo, 80) || 'Não informado';
  const price = text(d.preco, 80) || 'Sob consulta';
  const location = text(d.local || d.cidade, 180) || 'Litoral Norte Gaúcho';
  const description = text(d.descricao, 1400) || 'Confira os detalhes deste imóvel no Portal Meu Litoral.';
  const url = /^https:\/\/condominiosnapraia\.com\.br\/imovel\/[^\s]+/i.test(String(d.url || '')) ? String(d.url) : `${SITE}/imoveis/`;
  const propertyPhotos = photoUrls(d.fotos, 5);
  const cover = propertyPhotos[0] || '';
  const secondaryPhotos = propertyPhotos.slice(1, 5);
  const highlights = Array.isArray(d.meta) ? d.meta.slice(0, 8).map(value => text(value, 80)).filter(Boolean) : [];
  const condo = d.condominio && typeof d.condominio === 'object' ? d.condominio : null;
  const condoName = text(condo?.nome, 180);
  const condoDescription = text(condo?.descricao, 1200);
  const condoLocation = [text(condo?.bairro, 100), text(condo?.cidade, 100)].filter(Boolean).join(' · ');
  const condoAmenities = Array.isArray(condo?.amenidades) ? condo.amenidades.slice(0, 10).map(value => text(value, 80)).filter(Boolean) : [];
  const condoPhotos = photoUrls(condo?.fotos, 4);
  const whatsappMessage = `Olá! Tenho interesse no imóvel ${title}. Código: ${code}. ${url}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
  const preheader = `Imóvel ${code}: ${title}. Veja fotos, valor, detalhes e informações do condomínio.`;
  const hero = cover ? `<img src="${esc(cover)}" alt="${esc(title)}" width="680" style="display:block;width:100%;height:auto;max-height:430px;object-fit:cover;border:0">` : '';
  const condoFacts = condo ? factTable([
    ['Localização', condoLocation],
    ['Padrão', text(condo.padrao, 100)],
    ['Tipo', text(condo.tipo, 100)],
    ['Ano', text(condo.ano, 40)],
    ['Incorporadora', text(condo.incorporadora, 160)],
    ['Área total', text(condo.area_total_m2, 80)],
    ['Lotes', text(condo.lotes, 80)]
  ]) : '';
  const condoSection = condoName ? `<tr><td style="padding:0 26px 28px"><div style="border-top:1px solid #e9e1d5;padding-top:26px"><div style="font-size:11px;line-height:1.2;letter-spacing:2px;text-transform:uppercase;color:#0e8a99;margin-bottom:8px">O condomínio</div><h2 style="font-family:Georgia,serif;font-size:24px;line-height:1.25;margin:0 0 8px;color:#0d3b54">${esc(condoName)}</h2>${condoLocation ? `<p style="margin:0 0 18px;color:#657d87;font-size:14px;line-height:1.5">${esc(condoLocation)}</p>` : ''}${condoDescription ? `<p style="margin:0 0 18px;color:#486471;font-size:14px;line-height:1.65">${esc(condoDescription)}</p>` : ''}${condoFacts}${condoAmenities.length ? `<div style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:#71828b">Infraestrutura e diferenciais</div><p style="margin:0 0 18px;color:#486471;font-size:14px;line-height:1.7">${esc(condoAmenities.join(' · '))}</p>` : ''}${galleryTable(condoPhotos, condoName)}</div></td></tr>` : '';

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head><body style="margin:0;padding:0;background:#f2efe8;color:#143b52;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f2efe8"><tr><td align="center" style="padding:24px 10px"><table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:680px;background:#ffffff;border:1px solid #e5dac5;border-radius:18px;overflow:hidden;box-shadow:0 8px 28px rgba(13,59,84,.10)"><tr><td style="background:#0d3b54;padding:24px 26px;color:#ffffff"><div style="font-size:11px;line-height:1.2;letter-spacing:3px;text-transform:uppercase;color:#b9e3e9">Portal Meu Litoral · Condomínios na Praia</div><h1 style="font-family:Georgia,serif;font-size:27px;line-height:1.23;margin:12px 0 0;color:#ffffff">${esc(title)}</h1></td></tr>${hero ? `<tr><td>${hero}</td></tr>` : ''}<tr><td style="padding:26px 26px 10px"><div style="font-size:11px;line-height:1.2;letter-spacing:2px;text-transform:uppercase;color:#0e8a99;margin-bottom:8px">Imóvel selecionado</div><h2 style="font-family:Georgia,serif;font-size:23px;line-height:1.28;margin:0 0 18px;color:#0d3b54">${esc(title)}</h2>${factTable([['Código', code], ['Valor', price], ['Localização', location]])}${highlights.length ? `<div style="margin:0 0 20px"><div style="font-size:11px;letter-spacing:1.3px;text-transform:uppercase;color:#71828b;margin-bottom:7px">Destaques</div><p style="margin:0;color:#486471;font-size:14px;line-height:1.7">${esc(highlights.join(' · '))}</p></div>` : ''}<h3 style="font-family:Georgia,serif;font-size:18px;margin:22px 0 8px;color:#0d3b54">Sobre o imóvel</h3><p style="margin:0 0 20px;color:#486471;font-size:14px;line-height:1.68">${esc(description)}</p>${galleryTable(secondaryPhotos, title)}</td></tr>${condoSection}<tr><td style="padding:0 26px 28px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:0 5px 10px 0"><a href="${esc(url)}" style="display:block;background:#0e8a99;color:#ffffff;text-decoration:none;text-align:center;padding:14px 16px;border-radius:9px;font-size:14px;font-weight:bold">Ver imóvel no site</a></td><td style="padding:0 0 10px 5px"><a href="${esc(whatsappUrl)}" style="display:block;background:#1f9d61;color:#ffffff;text-decoration:none;text-align:center;padding:14px 16px;border-radius:9px;font-size:14px;font-weight:bold">Falar pelo WhatsApp</a></td></tr></table><p style="font-size:12px;color:#80939b;line-height:1.55;margin:10px 0 0">Código de referência: ${esc(code)}. Para confirmar disponibilidade, condições e agendar uma visita, responda a este e-mail ou fale conosco pelo WhatsApp.</p></td></tr></table><p style="text-align:center;color:#78909a;font-size:12px;line-height:1.5;margin:16px 0 0">Portal Meu Litoral · Condomínios na Praia<br>Atendimento: +55 51 9769-8450</p></td></tr></table></body></html>`;
}

function plainText(data) {
  const d = data || {};
  const condo = d.condominio && typeof d.condominio === 'object' ? d.condominio : null;
  const condoAmenities = Array.isArray(condo?.amenidades) ? condo.amenidades.slice(0, 10).map(value => text(value, 80)).filter(Boolean).join(' · ') : '';
  return [
    'Olá! Separei uma oportunidade para você conhecer.',
    '',
    `Imóvel: ${text(d.titulo, 180)}`,
    `Código: ${text(d.codigo, 80) || 'Não informado'}`,
    `Valor: ${text(d.preco, 80) || 'Sob consulta'}`,
    `Localização: ${text(d.local || d.cidade, 180)}`,
    `Descrição: ${text(d.descricao, 1200)}`,
    `Página completa: ${text(d.url, 300)}`,
    '',
    condo?.nome ? `Condomínio: ${text(condo.nome, 180)}` : '',
    condo?.descricao ? `Sobre o condomínio: ${text(condo.descricao, 1200)}` : '',
    condoAmenities ? `Infraestrutura: ${condoAmenities}` : '',
    '',
    `WhatsApp: https://wa.me/${WHATSAPP_NUMBER}`
  ].filter(Boolean).join('\n');
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin');
  if (origin && origin !== SITE) return new Response(JSON.stringify({ error: 'Origem não autorizada.' }), { status: 403, headers: { 'content-type': 'application/json' } });
  const auth = request.headers.get('Authorization') || '';
  if (!/^Bearer\s+\S+/i.test(auth)) return new Response(JSON.stringify({ error: 'Sessão do CRM ausente.' }), { status: 401, headers: { 'content-type': 'application/json' } });
  const supabaseUrl = env.SUPABASE_URL || env.SB_URL || SUPABASE_URL_FALLBACK;
  const sbAnon = env.SUPABASE_ANON_KEY || env.SB_ANON || SB_ANON_FALLBACK;
  const user = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: sbAnon, Authorization: auth } });
  if (!user.ok) return new Response(JSON.stringify({ error: 'Sessão do CRM inválida ou expirada.' }), { status: 401, headers: { 'content-type': 'application/json' } });
  if (!env.RESEND_API_KEY) return new Response(JSON.stringify({ error: 'RESEND_API_KEY ainda não está configurada.' }), { status: 503, headers: { 'content-type': 'application/json' } });
  if (!env.RESEND_FROM_EMAIL) return new Response(JSON.stringify({ error: 'Configure RESEND_FROM_EMAIL com um remetente de domínio verificado no Resend.' }), { status: 503, headers: { 'content-type': 'application/json' } });

  let payload;
  try {
    payload = await request.json();
  } catch (_) {
    return new Response(JSON.stringify({ error: 'Dados inválidos.' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  const to = text(payload?.to, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return new Response(JSON.stringify({ error: 'Destinatário inválido.' }), { status: 400, headers: { 'content-type': 'application/json' } });
  const d = payload?.imovel || {};
  const subject = `Imóvel selecionado para você | ${text(d.titulo, 150) || 'Portal Meu Litoral'}`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': crypto.randomUUID()
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      reply_to: 'felipe@condominiosnapraia.com.br',
      to: [to],
      subject,
      html: htmlEmail(d),
      text: plainText(d)
    })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) return new Response(JSON.stringify({ error: result?.message || 'Resend recusou o envio.' }), { status: 502, headers: { 'content-type': 'application/json' } });
  return new Response(JSON.stringify({ ok: true, id: result?.id || null }), { status: 200, headers: { 'content-type': 'application/json' } });
}
