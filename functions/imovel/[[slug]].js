// Cloudflare Pages Function: /imovel/:slug?
// Suporta /imovel/:slug/ e a URL antiga /imovel/?id=... com redirect 301.

const SUPABASE_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SITE = 'https://condominiosnapraia.com.br';
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
  if (i !== -1) return `${SITE}/cdn-fotos/` + String(u).slice(i + marker.length);
  return String(u);
}

// Camada de segurança: identificadores internos nunca entram no conteúdo público.
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
  const consultas = [
    `codigo=eq.${valor}&limit=1`,
    `slug=eq.${valor}&limit=1`,
    `id=eq.${valor}&limit=1`
  ];
  for (const filtro of consultas) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/imoveis?select=*&${filtro}`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` }
      });
      if (!r.ok) continue;
      const arr = await r.json();
      if (Array.isArray(arr) && arr[0]) return arr[0];
    } catch (_) {}
  }
  return null;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const pathMatch = url.pathname.match(/^\/imovel\/([^/]+)\/?$/i);
  const pathSlug = pathMatch ? decodeURIComponent(pathMatch[1]) : '';
  const legacyId = url.searchParams.get('id') || '';
  const ref = pathSlug || legacyId;
  const ua = request.headers.get('user-agent') || '';
  const response = await next();

  if (!ref) return response;

  const im = await buscarImovel(ref, env.SUPABASE_ANON_KEY);
  if (!im) return response;

  const canonicalSlug = im.slug || im.codigo || im.id;
  const canonicalUrl = `${SITE}/imovel/${encodeURIComponent(canonicalSlug)}/`;

  // Compatibilidade permanente: não exclui a URL antiga; apenas a canonicaliza.
  if (!pathSlug && legacyId && im.slug) {
    return Response.redirect(canonicalUrl, 301);
  }

  // Humanos recebem o HTML normal e o JavaScript carrega os dados da página.
  if (!isCrawler(ua)) return response;

  const titulo = im.titulo || 'Imóvel à venda';
  const cidade = im.cidade ? ` — ${im.cidade}` : '';
  const ogTitle = `${titulo}${cidade}`;
  const descBase = descricaoPublica(im.descricao);
  const ogDesc = (descBase || `${titulo} no Litoral Norte Gaúcho. Confira fotos, valor e detalhes.`).slice(0, 160);

  let fotos = im.fotos_no_site || im.fotos || [];
  if (typeof fotos === 'string') {
    try { fotos = JSON.parse(fotos); } catch (_) { fotos = [fotos]; }
  }
  const ogImage = Array.isArray(fotos) && fotos.length ? fotoPublica(fotos[0]) : OG_FALLBACK;

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
