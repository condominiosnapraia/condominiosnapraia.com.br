const SUPABASE_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SITE = 'https://condominiosnapraia.com.br';
const OG_FALLBACK = `${SITE}/img/og-default.jpg`;
const SB_ANON_FALLBACK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fotoPublica(value) {
  if (!value) return '';
  const marker = '/storage/v1/object/public/';
  const text = String(value);
  const index = text.indexOf(marker);
  return index === -1 ? text : `${SITE}/cdn-fotos/${text.slice(index + marker.length)}`;
}

function descricaoPublica(value) {
  return String(value ?? '')
    .replace(/\b(?:unidade|apt(?:o)?|apartamento)\s*(?:n[ºo°.]?\s*)?[a-z0-9-]+/gi, '')
    .replace(/\btorre\s*(?:n[ºo°.]?\s*)?[a-z0-9-]+/gi, '')
    .replace(/\b(?:quadra|lote|box)\s*(?:n[ºo°.]?\s*)?[a-z0-9-]+/gi, '')
    .replace(/\bcasa\s*(?:n[ºo°.]?|número)\s*[a-z0-9-]+/gi, '')
    .replace(/\b(?:condomínio|condominio)\s+([\wÀ-ÿ-]+)\s*\/\s*(?:quadra|lote|torre|unidade)\s*[\wÀ-ÿ-]+/gi, '$1')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;])/g, '$1')
    .trim();
}

async function buscarCondominio(ref, key) {
  if (!ref || !key) return null;
  const value = encodeURIComponent(ref);
  const select = 'id,slug,nome,cidade,bairro,descricao,fotos,fotos_no_site,amenidades,latitude,longitude';
  const url = `${SUPABASE_URL}/rest/v1/condominios?or=(id.eq.${value},slug.eq.${value})&select=${select}&limit=1`;
  try {
    const response = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!response.ok) return null;
    const rows = await response.json();
    return Array.isArray(rows) ? rows[0] || null : null;
  } catch (_) {
    return null;
  }
}

function firstPhoto(cond) {
  let photos = cond.fotos_no_site || cond.fotos || [];
  if (typeof photos === 'string') {
    try { photos = JSON.parse(photos); } catch (_) { photos = [photos]; }
  }
  if (!Array.isArray(photos)) photos = [photos];
  for (const photo of photos) {
    const value = typeof photo === 'string' ? photo : photo?.url;
    if (value) return fotoPublica(value);
  }
  return OG_FALLBACK;
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const ref = url.searchParams.get('id') || '';
  const response = await context.next();
  if (!ref) return response;

  const cond = await buscarCondominio(ref, env?.SUPABASE_ANON_KEY || SB_ANON_FALLBACK);
  if (!cond) return response;

  const slug = cond.slug || cond.id || ref;
  const canonicalUrl = `${SITE}/condominio/?id=${encodeURIComponent(slug)}`;
  const title = `${cond.nome || 'Condomínio'} — Condomínios na Praia`;
  const description = (descricaoPublica(cond.descricao) || `Conheça o condomínio ${cond.nome || ''} no Litoral Norte Gaúcho e veja infraestrutura, localização e imóveis disponíveis.`)
    .slice(0, 160);
  const image = firstPhoto(cond);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ApartmentComplex',
    name: cond.nome || 'Condomínio',
    url: canonicalUrl,
    description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cond.cidade || '',
      addressRegion: 'RS',
      addressCountry: 'BR',
    },
  };
  if (cond.bairro) schema.address.streetAddress = cond.bairro;
  if (image) schema.image = [image];
  if (Array.isArray(cond.amenidades) && cond.amenidades.length) {
    schema.amenityFeature = cond.amenidades.map((item) => ({
      '@type': 'LocationFeatureSpecification',
      name: item,
      value: true,
    }));
  }

  const html = await response.text();
  const additions = `\n<meta name="robots" content="noindex,follow">` +
    `\n<meta property="og:image" content="${esc(image)}">` +
    `\n<meta property="og:image:width" content="1200">` +
    `\n<meta property="og:image:height" content="900">` +
    `\n<meta name="twitter:card" content="summary_large_image">` +
    `\n<meta name="twitter:title" content="${esc(title)}">` +
    `\n<meta name="twitter:description" content="${esc(description)}">` +
    `\n<meta name="twitter:image" content="${esc(image)}">`;
  const transformed = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`)
    .replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${esc(description)}">`)
    .replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${esc(canonicalUrl)}">`)
    .replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${esc(title)}">`)
    .replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${esc(description)}">`)
    .replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${esc(canonicalUrl)}">`)
    .replace(/<meta\s+property=["']og:type["'][^>]*>/i, '<meta property="og:type" content="website">')
    .replace(/<script\s+type=["']application\/ld\+json["']\s+id=["']ld-cond["']>[\s\S]*?<\/script>/i, `<script type="application/ld+json" id="ld-cond">${JSON.stringify(schema)}</script>`)
    .replace(/<\/head>/i, `${additions}\n</head>`);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(transformed, { status: response.status, statusText: response.statusText, headers });
}
