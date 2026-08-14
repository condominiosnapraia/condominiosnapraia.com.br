// Cloudflare Pages Function para /imovel/<slug-ou-referencia>.
// A rota final serve o asset estático via ASSETS.fetch; não usa next() para
// evitar recursão/runtime 1101 em rotas dinâmicas.

const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SITE = 'https://condominiosnapraia.com.br';
	const SB_ANON_FALLBACK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzIiwicmVmIjoiY2RkZ2toemNueXp6Y2xsZ296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const OG_FALLBACK = `${SITE}/img/og-home.jpg`;

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
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;])/g, '$1')
    .trim();
}

async function buscarImovel(ref, key) {
  if (!ref || !key) return null;
  const valor = encodeURIComponent(ref);
  for (const filtro of [
    `codigo=eq.${valor}&limit=1`,
    `slug=eq.${valor}&limit=1`,
    `id=eq.${valor}&limit=1`
  ]) {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/imoveis?select=*&${filtro}`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` }
      });
      if (!r.ok) continue;
      const arr = await r.json();
      if (Array.isArray(arr) && arr[0]) return arr[0];
    } catch (_) {}
  }
  return null;
}

async function servirPagina(context) {
  const assetUrl = new URL('/imovel/index.html', context.request.url);
  return context.env?.ASSETS?.fetch(assetUrl.toString());
}

export async function onRequest(context) {
  const { request, params, env } = context;
  const ref = Array.isArray(params?.id) ? params.id.join('/') : params?.id;
  if (!ref) return servirPagina(context);

  const im = await buscarImovel(ref, env?.SUPABASE_ANON_KEY || SB_ANON_FALLBACK);
  if (!im) return servirPagina(context);

  const canonicalSlug = im.slug || im.codigo || im.id;
  if (im.slug && String(ref) !== String(im.slug)) {
    return Response.redirect(`${SITE}/imovel/${encodeURIComponent(im.slug)}/`, 301);
  }

  const response = await servirPagina(context);
  if (!response) return new Response('Asset binding ASSETS não configurado.', { status: 500 });
  if (!isCrawler(request.headers.get('user-agent') || '')) return response;

  const titulo = im.titulo || 'Imóvel à venda';
  const cidade = im.cidade_end ? ` — ${im.cidade_end}` : '';
  const ogTitle = `${titulo}${cidade}`;
  const descBase = descricaoPublica(im.descricao);
  const ogDesc = (descBase || `${titulo} no Litoral Norte Gaúcho. Confira fotos, valor e detalhes.`).slice(0, 160);
  let fotos = im.fotos_no_site || im.fotos || [];
  if (typeof fotos === 'string') {
    try { fotos = JSON.parse(fotos); } catch (_) { fotos = [fotos]; }
  }
  const ogImage = Array.isArray(fotos) && fotos.length ? fotoPublica(fotos[0]) : OG_FALLBACK;
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
    .on('head', {
      element(e) {
        e.append(
          `\n<meta property="og:image" content="${esc(ogImage)}">` +
          `\n<meta property="og:image:width" content="1200">` +
          `\n<meta property="og:image:height" content="900">` +
          `\n<meta name="twitter:image" content="${esc(ogImage)}">` +
          '\n<meta name="twitter:card" content="summary_large_image">',
          { html: true }
        );
      }
    })
    .transform(response);
}
