// Middleware SSR para URLs amigáveis de imóveis no Cloudflare Pages.

const SUPABASE_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SITE = 'https://condominiosnapraia.com.br';
const OG_FALLBACK = `${SITE}/img/og-home.jpg`;
const SB_ANON_FALLBACK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';

// Aliases públicos estáveis: não expõem quadra, lote ou código interno.
const PUBLIC_SLUG_ALIASES = {
  'XAN-018': 'lote-a-venda-monaco-yacht-club-xangri-la',
  'XAN-019': 'lote-a-venda-monaco-yacht-club-xangri-la-2'
};

function isCrawler(ua = '') {
  return /facebookexternalhit|Facebot|WhatsApp|Twitterbot|TelegramBot|LinkedInBot|Slackbot|Discordbot|Pinterest|Googlebot|bingbot|redditbot/i.test(ua);
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function jsonSafe(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

function fotoPublica(u) {
  if (!u) return '';
  const marker = '/storage/v1/object/public/';
  const i = String(u).indexOf(marker);
  return i === -1 ? String(u) : `${SITE}/cdn-fotos/` + String(u).slice(i + marker.length);
}

function aliasParaRef(ref = '') {
  const value = String(ref).trim().toLowerCase();
  const hit = Object.entries(PUBLIC_SLUG_ALIASES).find(([, slug]) => slug === value);
  return hit ? hit[0] : ref;
}

function slugifyPublic(value) {
  return String(value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function slugPublico(im) {
  const codigo = String(im?.codigo || '').toUpperCase();
  if (PUBLIC_SLUG_ALIASES[codigo]) return PUBLIC_SLUG_ALIASES[codigo];
  if (String(im?.slug || '').trim()) return String(im.slug).trim().replace(/^\/+|\/+$/g, '').replace(/^-+|-+$/g, '');
  const titulo = descricaoPublica(im?.titulo || im?.tipo || 'Imóvel');
  const base = slugifyPublic(titulo || im?.tipo || 'imovel');
  const suffix = slugifyPublic(codigo);
  if (suffix && !base.endsWith(suffix)) return `${base}-${suffix}`;
  return base || slugifyPublic(im?.id) || im?.id;
}

function descricaoPublica(texto) {
  return String(texto ?? '')
    // Preserva expressões legítimas como “lote 583 m²”, mas remove identificadores internos.
    .replace(/\b(?:unidade|apt(?:o)?|apartamento)\s*(?:n[ºo°.]?\s*)?[a-z0-9-]+/gi, '')
    .replace(/\btorre\s*(?:n[ºo°.]?\s*)?[a-z0-9-]+/gi, '')
    .replace(/\b(?:quadra|lote|box)\s*(?:n[ºo°.]?\s*)?(?!\d+(?:[.,]\d+)?\s*m(?:2|²)\b)[a-z0-9-]+/gi, '')
    .replace(/\bcasa\s*(?:n[ºo°.]?|número)\s*[a-z0-9-]+/gi, '')
    .replace(/\b(?:xan|cap|maq)-\d{3}\b/gi, '')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;])/g, '$1')
    .trim();
}

function cidadePublica(im) {
  if (im?.cidade_end) return String(im.cidade_end).trim();
  const text = String(im?.descricao || '');
  const match = text.match(/(?:Xangri[- ]Lá|Capão da Canoa|Osório|Maquiné|Atlântida)/i);
  return match ? match[0] : 'Litoral Norte Gaúcho';
}

function parseFotos(im) {
  let fotos = im?.fotos_no_site || im?.fotos || [];
  if (typeof fotos === 'string') {
    try { fotos = JSON.parse(fotos); } catch (_) { fotos = [fotos]; }
  }
  return Array.isArray(fotos) ? fotos : [];
}

function fotoPrincipal(im) {
  const fotos = parseFotos(im);
  const first = fotos.find(Boolean);
  return first ? fotoPublica(typeof first === 'string' ? first : first?.url) : OG_FALLBACK;
}

function precoNumerico(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const normalized = String(value ?? '').replace(/[^0-9,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function precoPublico(value) {
  const n = precoNumerico(value);
  return n ? `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` : '';
}

async function fetchSupabaseComRetry(url, options, attempts = 2) {
  let lastError = null;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, options);
      // 4xx é resposta definitiva; 5xx/429 podem ser transitórios em cold start.
      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) return response;
      if (attempt === attempts - 1) return response;
      await new Promise(resolve => setTimeout(resolve, attempt === 0 ? 150 : 400));
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await new Promise(resolve => setTimeout(resolve, attempt === 0 ? 150 : 400));
    }
  }
  if (lastError) throw lastError;
  return null;
}

async function buscarImovel(ref, key) {
  if (!ref || !key) return null;
  const resolvedRef = aliasParaRef(ref);
  const valor = encodeURIComponent(resolvedRef);
  const codeSuffix = (String(resolvedRef).match(/(?:^|-)([A-Z]{2,5}-\d{3})$/i)?.[1] || '').toUpperCase();
  const codeFilter = codeSuffix && codeSuffix.toLowerCase() !== String(resolvedRef).toLowerCase()
    ? `,codigo.eq.${encodeURIComponent(codeSuffix)}` : '';
  const query = `${SUPABASE_URL}/rest/v1/imoveis?or=(codigo.eq.${valor},slug.eq.${valor},id.eq.${valor}${codeFilter})&select=id,slug,codigo,titulo,cond_id,tipo,preco,quartos,suites,banheiros,vagas,area,area_privativa,area_construida,cidade_end,bairro_end,fora_condominio,ref_local,corretor,descricao,diferenciais,fotos_no_site,fotos&limit=1`;
  try {
    const r = await fetchSupabaseComRetry(query, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!r || !r.ok) return null;
    const arr = await r.json();
    return Array.isArray(arr) ? arr[0] || null : null;
  } catch (error) {
    console.warn('Falha transitória ao buscar imóvel no Supabase:', String(error));
    return null;
  }
}

function schemaImovel(im, canonicalUrl, title, description, image, city) {
  const price = precoNumerico(im?.preco);
  const offeredType = /apartamento/i.test(String(im?.tipo || '')) ? 'Apartment' : 'Residence';
  const item = {
    '@type': offeredType,
    name: title,
    description,
    image: [image],
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: 'RS',
      addressCountry: 'BR'
    }
  };
  if (Number(im?.quartos) > 0) item.numberOfBedrooms = Number(im.quartos);
  if (Number(im?.banheiros) > 0) item.numberOfBathroomsTotal = Number(im.banheiros);
  if (Number(im?.area || im?.area_privativa || im?.area_construida) > 0) {
    item.floorSize = {
      '@type': 'QuantitativeValue',
      value: Number(im.area || im.area_privativa || im.area_construida),
      unitCode: 'MTK'
    };
  }
  const result = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${canonicalUrl}#listing`,
    url: canonicalUrl,
    name: title,
    description,
    image: [image],
    itemOffered: item,
    seller: {
      '@type': 'RealEstateAgent',
      name: 'Condomínios na Praia',
      url: `${SITE}/`
    }
  };
  if (price) {
    result.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: canonicalUrl
    };
  }
  return result;
}

function ssrBlock(im, cond, title, description, image, canonicalUrl, city) {
  const price = precoPublico(im?.preco);
  const broker = String(im?.corretor || 'Condomínios na Praia').trim();
  const condName = String(cond?.nome || '').trim();
  const condCity = String(cond?.cidade || city || '').trim();
  const facts = [
    im?.tipo ? `<div><span>Tipo</span><strong>${esc(im.tipo)}</strong></div>` : '',
    im?.quartos ? `<div><span>Quartos</span><strong>${esc(im.quartos)}</strong></div>` : '',
    im?.suites ? `<div><span>Suítes</span><strong>${esc(im.suites)}</strong></div>` : '',
    (im?.area || im?.area_privativa || im?.area_construida) ? `<div><span>Área</span><strong>${esc(im.area || im.area_privativa || im.area_construida)} m²</strong></div>` : ''
  ].filter(Boolean).join('');
  return `<article id="ssr-imovel" class="ip-ssr" data-ssr="true">
    <nav class="crumb" aria-label="Breadcrumb"><a href="${SITE}/">Início</a> › <a href="${SITE}/imoveis/">Imóveis</a> › <span>${esc(city)}</span></nav>
    <h1 class="ip-title">${esc(title)}</h1>
    <p class="ip-ssr-location">${esc(city)} · Condomínios na Praia</p>
    <img class="ip-ssr-image" src="${esc(image)}" width="1200" height="800" loading="eager" fetchpriority="high" decoding="async" alt="${esc(title)}">
    ${facts ? `<div class="ip-ssr-facts" aria-label="Características do imóvel">${facts}</div>` : ''}
    ${price ? `<p class="ip-price"><span class="ip-price-lbl">Valor</span>${esc(price)}</p>` : ''}
    <div class="ip-desc"><h2>Sobre este imóvel</h2><p>${esc(description)}</p></div>
    ${condName ? `<section class="ip-ssr-cond"><h2>Informações do condomínio</h2><p><strong>${esc(condName)}</strong>${condCity ? ` · ${esc(condCity)}` : ''}</p>${cond?.descricao ? `<p>${esc(descricaoPublica(cond.descricao))}</p>` : ''}${Array.isArray(cond?.amenidades) && cond.amenidades.length ? `<p><strong>Infraestrutura:</strong> ${esc(cond.amenidades.slice(0, 8).join(', '))}</p>` : ''}</section>` : ''}
    <section class="ip-ssr-broker"><h2>Corretor responsável</h2><p><strong>${esc(broker)}</strong> · CRECI-RS 72.386</p><p>Atendimento personalizado para compra e visita ao imóvel.</p><p><a href="https://wa.me/555197698450?text=${encodeURIComponent(`Olá! Gostaria de receber mais informações sobre este imóvel.\n\nCódigo: ${im?.codigo || im?.ref || 'Não informado'}\nImóvel: ${title}${condName ? `\nCondomínio: ${condName}` : ''}\nPreço: ${precoPublico(im?.preco) || 'Consulte o valor'}.\n\nPodem me informar a disponibilidade, as condições e as opções para agendar uma visita?`)}">Falar no WhatsApp</a></p></section>
    <p class="ip-ssr-cta"><a href="${SITE}/contato/">Fale com um consultor</a></p>
  </article>`;
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
  let cond = null;
  if (im.cond_id) {
    try {
      const condResponse = await fetchSupabaseComRetry(`${SUPABASE_URL}/rest/v1/condominios?id=eq.${encodeURIComponent(im.cond_id)}&select=id,slug,nome,cidade,bairro,descricao,amenidades&limit=1`, { headers: { apikey: env?.SUPABASE_ANON_KEY || SB_ANON_FALLBACK, Authorization: `Bearer ${env?.SUPABASE_ANON_KEY || SB_ANON_FALLBACK}` } });
      if (condResponse?.ok) {
        const condRows = await condResponse.json();
        cond = Array.isArray(condRows) ? condRows[0] || null : null;
      }
    } catch (_) { cond = null; }
  }

  const canonicalSlug = slugPublico(im);
  if (legacyRef && legacyRef !== canonicalSlug) {
    return Response.redirect(`${SITE}/imovel/${encodeURIComponent(canonicalSlug)}/`, 301);
  }
  if (pathRef && pathRef !== canonicalSlug) {
    return Response.redirect(`${SITE}/imovel/${encodeURIComponent(canonicalSlug)}/`, 301);
  }

  // URLs canônicas sempre recebem SSR; a URL legada só é mantida para humanos quando não há redirect.
  if (!pathRef && !isCrawler(request.headers.get('user-agent') || '')) return response;

  const rawTitle = im.titulo || 'Imóvel à venda';
  const title = descricaoPublica(rawTitle) || 'Imóvel à venda';
  const city = cidadePublica(im);
  const ogTitle = `${title}${city ? ` — ${city}` : ''}`;
  const description = (descricaoPublica(im.descricao) || `${title} no Litoral Norte Gaúcho. Confira fotos, valor e detalhes.`).slice(0, 160);
  const image = fotoPrincipal(im);
  const canonicalUrl = `${SITE}/imovel/${encodeURIComponent(canonicalSlug)}/`;
      const schema = schemaImovel(im, canonicalUrl, title, description, image, city);

  const html = await response.text();
  // O title da aba deve ser compacto; mantemos o título editorial completo no H1/OG/JSON-LD.
  const compactTitle = title.replace(/\bNO CONDOMÍNIO\b/gi, 'NO').replace(/\s{2,}/g, ' ').trim();
  const hasCityInTitle = city && compactTitle.toLocaleLowerCase('pt-BR').includes(city.toLocaleLowerCase('pt-BR'));
  const htmlTitle = `${esc(compactTitle)}${city && !hasCityInTitle ? ` | ${esc(city)}` : ''} | Condomínios na Praia`;
  const htmlDesc = esc(description);
  const htmlUrl = esc(canonicalUrl);
  const additions = `\n<meta property="og:image" content="${esc(image)}">` +
    `\n<meta property="og:image:width" content="1200">` +
    `\n<meta property="og:image:height" content="900">` +
    `\n<meta name="twitter:image" content="${esc(image)}">` +
    '\n<meta name="twitter:card" content="summary_large_image">' +
    '\n<style id="ip-ssr-style">.ip-ssr{padding:20px 0 48px}.ip-ssr-image{display:block;width:100%;height:auto;max-height:560px;object-fit:cover;border-radius:16px;margin:18px 0}.ip-ssr-location{color:#5b7585;font-size:14px}.ip-ssr-facts{display:flex;flex-wrap:wrap;gap:1px;background:rgba(31,181,196,.18);border:1px solid rgba(31,181,196,.18);border-radius:12px;overflow:hidden;margin:24px 0}.ip-ssr-facts div{background:#fff;padding:14px 18px;min-width:130px}.ip-ssr-facts span{display:block;color:#5b7585;font-size:10px;letter-spacing:.12em;text-transform:uppercase}.ip-ssr-facts strong{display:block;color:#0d3b54;margin-top:3px}.ip-ssr .ip-desc h2,.ip-ssr-cond h2,.ip-ssr-broker h2{font-family:Fraunces,serif;color:#0d3b54;margin:30px 0 8px}.ip-ssr .ip-desc p,.ip-ssr-cond p,.ip-ssr-broker p{color:#2e4654;line-height:1.75}.ip-ssr-broker,.ip-ssr-cond{padding:18px 20px;border:1px solid rgba(31,181,196,.18);border-radius:14px;margin-top:22px;background:#f7fbfc}.ip-ssr-broker a{color:#0a7d32;font-weight:700}.ip-ssr-cta a{display:inline-flex;background:#0d3b54;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600}</style>';
  const content = ssrBlock(im, cond, title, description, image, canonicalUrl, city);
  const transformed = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${htmlTitle}</title>`)
    .replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${htmlDesc}">`)
    .replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${esc(ogTitle)}">`)
    .replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${htmlDesc}">`)
    .replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${htmlUrl}">`)
    .replace(/<meta\s+property=["']og:type["'][^>]*>/i, '<meta property="og:type" content="product">')
    .replace(/<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${esc(ogTitle)}">`)
    .replace(/<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${htmlDesc}">`)
    .replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${htmlUrl}">`)
    .replace(/<div id="ip-content">/i, `<div id="ip-content">${content}`)
    .replace(/<script type="application\/ld\+json" id="ld-imovel">\{\}<\/script>/i, `<script type="application/ld+json" id="ld-imovel">${jsonSafe(schema)}</script>`)
    .replace(/<\/head>/i, `${additions}\n</head>`);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  // A página é pública e pode ser cacheada por poucos minutos; isso evita repetir a consulta SSR a cada visita.
  headers.set('Cache-Control', 'public, max-age=300, s-maxage=900, stale-while-revalidate=86400');
  headers.set('Vary', 'Accept-Encoding');
  return new Response(transformed, { status: response.status, statusText: response.statusText, headers });
}
