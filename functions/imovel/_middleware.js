// Middleware escopado para /imovel e todos os seus subcaminhos.
// Usa context.next() como previsto pelo Cloudflare Pages para middleware.

const SUPABASE_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SITE = 'https://condominiosnapraia.com.br';
const OG_FALLBACK = `${SITE}/img/og-home.jpg`;
const SB_ANON_FALLBACK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';

function isCrawler(ua = '') {
  return /facebookexternalhit|Facebot|WhatsApp|Twitterbot|TelegramBot|LinkedInBot|Slackbot|Discordbot|Pinterest|Googlebot|bingbot|redditbot/i.test(ua);
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fotoPublica(u) {
  if (!u) return '';
  const marker = '/storage/v1/object/public/';
  const i = String(u).indexOf(marker);
  return i === -1 ? String(u) : `${SITE}/cdn-fotos/` + String(u).slice(i + marker.length);
}

function descricaoPublica(texto) {
  return String(texto ?? '')
    .replace(/\b(?:unidade|apt(?:o)?|apartamento)\s*(?:n[ºo°.]?\s*)?[a-z0-9-]+/gi, '')
    .replace(/\btorre\s*(?:n[ºo°.]?\s*)?[a-z0-9-]+/gi, '')
    .replace(/\b(?:quadra|lote|box)\s*(?:n[ºo°.]?\s*)?[a-z0-9-]+/gi, '')
    .replace(/\bcasa\s*(?:n[ºo°.]?|número)\s*[a-z0-9-]+/gi, '')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;])/g, '$1')
    .trim();
}

async function buscarImovel(ref, key) {
  if (!ref || !key) return null;
  const valor = encodeURIComponent(ref);
  const query = `${SUPABASE_URL}/rest/v1/imoveis?or=(codigo.eq.${valor},slug.eq.${valor},id.eq.${valor})&select=slug,codigo,id,titulo,cidade_end,descricao,fotos_no_site,fotos&limit=1`;
  try {
    const r = await fetch(query, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!r.ok) return null;
    const arr = await r.json();
    return Array.isArray(arr) ? arr[0] || null : null;
  } catch (_) {
    return null;
  }
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathMatch = url.pathname.match(/^\/imovel\/([^/]+)\/?$/i);
  const pathRef = pathMatch ? decodeURIComponent(pathMatch[1]) : '';
  const legacyRef = url.searchParams.get('id') || '';
  const ref = pathRef || legacyRef;
  const assetRequest = pathRef ? new Request(new URL('/imovel/', request.url), request) : request;
  const response = await context.next(assetRequest);

  if (!ref) return response;
  const im = await buscarImovel(ref, env?.SUPABASE_ANON_KEY || SB_ANON_FALLBACK);
  if (!im) return response;

  const canonicalSlug = im.slug || im.codigo || im.id;
  if (legacyRef && im.slug && legacyRef !== im.slug) {
    return Response.redirect(`${SITE}/imovel/${encodeURIComponent(im.slug)}/`, 301);
  }
  if (pathRef && im.slug && pathRef !== im.slug) {
    return Response.redirect(`${SITE}/imovel/${encodeURIComponent(im.slug)}/`, 301);
  }
  // Em páginas com slug, canonical e metadados precisam ser corretos para qualquer User-Agent.
  // Para a URL legada sem slug, humanos seguem no HTML normal quando não houve redirect.
  if (!pathRef && !isCrawler(request.headers.get('user-agent') || '')) return response;

  const titulo = im.titulo || 'Imóvel à venda';
  const cidade = im.cidade_end ? ` — ${im.cidade_end}` : '';
  const ogTitle = `${titulo}${cidade}`;
  const ogDesc = (descricaoPublica(im.descricao) || `${titulo} no Litoral Norte Gaúcho. Confira fotos, valor e detalhes.`).slice(0, 160);
  let fotos = im.fotos_no_site || im.fotos || [];
  if (typeof fotos === 'string') {
    try { fotos = JSON.parse(fotos); } catch (_) { fotos = [fotos]; }
  }
  const ogImage = Array.isArray(fotos) && fotos.length ? fotoPublica(typeof fotos[0] === 'string' ? fotos[0] : fotos[0]?.url) : OG_FALLBACK;
  const canonicalUrl = `${SITE}/imovel/${encodeURIComponent(canonicalSlug)}/`;

  return new HTMLRewriter()
    .on('title', { element(e) { e.setInnerContent(`${ogTitle} | Condomínios na Praia`); } })
    .on('meta[name="description"]', { element(e) { e.setAttribute('content', ogDesc); } })
    .on('meta[property="og:title"]', { element(e) { e.setAttribute('content', ogTitle); } })
    .on('meta[property="og:description"]', { element(e) { e.setAttribute('content', ogDesc); } })
    .on('meta[property="og:url"]', { element(e) { e.setAttribute('content', canonicalUrl); } })
    .on('meta[property="og:type"]', { element(e) { e.setAttribute('content', 'product'); } })
    .on('meta[name="twitter:title"]', { element(e) { e.setAttribute('content', ogTitle); } })
    .on('meta[name="twitter:description"]', { element(e) { e.setAttribute('content', ogDesc); } })
    .on('link[rel="canonical"]', { element(e) { e.setAttribute('href', canonicalUrl); } })
    .on('head', { element(e) {
      e.append(
        `\n<meta property="og:image" content="${esc(ogImage)}">` +
        `\n<meta property="og:image:width" content="1200">` +
        `\n<meta property="og:image:height" content="900">` +
        `\n<meta name="twitter:image" content="${esc(ogImage)}">` +
        '\n<meta name="twitter:card" content="summary_large_image">',
        { html: true }
      );
    } })
    .transform(response);
}
