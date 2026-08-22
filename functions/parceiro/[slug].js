const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const BASE = 'https://condominiosnapraia.com.br';
const HEADERS = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` };

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
function jsonSafe(value) { return String(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026'); }
function digits(value) { return String(value || '').replace(/\D/g, ''); }
function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') { try { return JSON.parse(value); } catch (_) { return value ? [value] : []; } }
  return [];
}
function firstPhoto(imovel) {
  const candidates = [...toArray(imovel?.fotos_no_site), ...toArray(imovel?.fotos), ...toArray(imovel?.fotos_para_site)];
  for (const item of candidates) {
    const url = typeof item === 'string' ? item : item?.url || item?.src || item?.publicUrl || item?.public_url;
    if (url && (/^https?:\/\//i.test(url) || String(url).startsWith('/cdn-fotos/'))) return url;
  }
  return '';
}
function money(value) {
  if (value === null || value === undefined || value === '') return 'Consulte o valor';
  if (typeof value === 'string' && /r\$|€|\$/i.test(value)) return value;
  const normalized = String(value).replace(/[^0-9,.-]/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) && number > 0 ? number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) : 'Consulte o valor';
}
function slugify(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-');
}
function propertySlug(imovel) {
  const stored = String(imovel?.slug || '').trim().replace(/^\/+|\/+$/g, '');
  if (stored) return stored;
  const base = slugify(imovel?.titulo || imovel?.tipo || 'imovel');
  const code = slugify(imovel?.codigo || imovel?.ref || '');
  return code && !base.endsWith(code) ? `${base}-${code}` : base || slugify(imovel?.id) || 'imovel';
}
function propertyUrl(siteSlug, imovel) {
  return `${BASE}/corretor/${encodeURIComponent(siteSlug)}/imovel/${encodeURIComponent(propertySlug(imovel))}/`;
}
const SITE_SLUG_ALIASES = Object.freeze({ 'fernando-trevisol': 'fernando-trvisol' });
function siteSlugInfo(value) {
  const requested = String(value || '').toLowerCase();
  const dbSlug = SITE_SLUG_ALIASES[requested] || requested;
  const publicSlug = Object.entries(SITE_SLUG_ALIASES).find(([, alias]) => alias === requested)?.[0] || requested;
  return { requested, dbSlug, publicSlug };
}
function categoryFor(imovel) {
  const type = String(imovel?.tipo || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const outside = imovel?.fora_condominio === true || String(imovel?.fora_condominio).toLowerCase() === 'true';
  if (/loja|sala|comercial|ponto|conjunto/.test(type)) return 'comercial';
  if (/apart|cobertura|loft|kitnet|flat|studio/.test(type)) return 'apartamento';
  if (/terreno|lote/.test(type)) return outside ? 'terreno-fora' : 'terreno-condominio';
  return outside ? 'casa-fora' : 'casa-condominio';
}
async function getJson(path) {
  try {
    const response = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: HEADERS });
    if (!response.ok) return [];
    return await response.json();
  } catch (_) { return []; }
}
function normalizeListing(row, condMap, siteSlug) {
  const imovel = row.imovel || {};
  const cond = imovel.cond_id ? condMap[imovel.cond_id] || null : null;
  const title = row.titulo_personalizado || imovel.titulo || 'Imóvel disponível';
  const city = imovel.cidade_end || imovel.cidade || cond?.cidade || 'Rio Grande do Sul';
  const neighborhood = imovel.bairro_end || imovel.bairro || '';
  const outside = imovel.fora_condominio === true || String(imovel.fora_condominio).toLowerCase() === 'true';
  return {
    id: imovel.id || row.imovel_id,
    slug: propertySlug(imovel),
    url: propertyUrl(siteSlug, imovel),
    title,
    description: row.chamada_personalizada || imovel.descricao || '',
    type: imovel.tipo || 'Imóvel',
    category: categoryFor(imovel),
    outside,
    city,
    neighborhood,
    price: imovel.preco,
    bedrooms: imovel.quartos,
    suites: imovel.suites,
    bathrooms: imovel.banheiros,
    parking: imovel.vagas,
    area: imovel.area || imovel.area_privativa || imovel.area_construida,
    photo: firstPhoto(imovel),
    featured: Boolean(row.destaque),
    code: imovel.codigo || imovel.ref || '',
    broker: imovel.corretor || '',
    condo: cond ? { id: cond.id, slug: cond.slug || '', name: cond.nome || '', city: cond.cidade || '', description: cond.descricao || '', amenities: Array.isArray(cond.amenidades) ? cond.amenidades.slice(0, 8) : [] } : null,
  };
}

const SECTIONS = [
  { id: 'casa-condominio', category: 'casa-condominio', title: 'Sobrados e casas', subtitle: 'Em condomínio', limit: 8, icon: '🏡', empty: 'Ainda não há casas ou sobrados em condomínio publicados.' },
  { id: 'casa-fora', category: 'casa-fora', title: 'Sobrados e casas', subtitle: 'Fora de condomínio', limit: 8, icon: '🏠', empty: 'Ainda não há casas ou sobrados fora de condomínio publicados.' },
  { id: 'terreno-condominio', category: 'terreno-condominio', title: 'Terrenos', subtitle: 'Em condomínio', limit: 8, icon: '📐', empty: 'Ainda não há terrenos em condomínio publicados.' },
  { id: 'apartamento', category: 'apartamento', title: 'Apartamentos', subtitle: 'À venda', limit: 8, icon: '🏢', empty: 'Ainda não há apartamentos publicados.' },
  { id: 'comercial', category: 'comercial', title: 'Lojas e salas', subtitle: 'Comerciais', limit: 4, icon: '🏬', empty: 'Ainda não há lojas ou salas comerciais publicadas.' },
];

function card(property, compact = false) {
  const details = [
    property.bedrooms && `${property.bedrooms} ${Number(property.bedrooms) === 1 ? 'quarto' : 'quartos'}`,
    property.suites && `${property.suites} ${Number(property.suites) === 1 ? 'suíte' : 'suítes'}`,
    property.area && `${property.area} m²`,
  ].filter(Boolean).join(' · ');
  const location = [property.neighborhood, property.city].filter(Boolean).join(' · ');
  return `<article class="property-card${compact ? ' property-card-compact' : ''}">
    <a class="property-photo-link" href="${esc(property.url)}" aria-label="Ver ${esc(property.title)}">
      <div class="property-photo">${property.photo ? `<img src="${esc(property.photo)}" alt="${esc(property.title)}" loading="lazy" decoding="async">` : '<div class="property-photo-empty">Imagem em atualização</div>'}<span class="property-badge">${property.featured ? 'Destaque' : 'Disponível'}</span></div>
    </a>
    <div class="property-body">
      <span class="property-label">${esc(property.type)}</span>
      <h3><a href="${esc(property.url)}">${esc(property.title)}</a></h3>
      <p class="property-location">${esc(location || 'Rio Grande do Sul')}</p>
      ${details ? `<p class="property-details">${esc(details)}</p>` : ''}
      ${property.code ? `<p class="property-code">Código do imóvel: ${esc(property.code)}</p>` : ''}
      ${property.cond?.name ? `<p class="property-condo">Condomínio: ${esc(property.cond.name)}</p>` : ''}
      <strong>${esc(money(property.price))}</strong>
      <div class="property-actions"><a class="property-link" href="${esc(property.url)}">Ver imóvel</a><button class="property-interest" type="button" data-property-id="${esc(property.id || '')}" data-property-title="${esc(property.title)}">Tenho interesse</button></div>
    </div>
  </article>`;
}

function layout({ site, properties, slug, requestPath }) {
  const name = site.nome || 'Corretor parceiro';
  const pageTitle = site.slug === 'fernando-trvisol' ? 'Fernando Trevisol - Imóveis de Alto Padrão' : name;
  const heroName = site.slug === 'fernando-trvisol' ? 'Fernando Trevisol' : name;
  const heroClaim = site.slug === 'fernando-trvisol' ? 'Imóveis de Alto Padrão' : pageTitle;
  const description = site.bio || `Imóveis selecionados por ${name} no Rio Grande do Sul.`;
  const phone = digits(site.whatsapp || site.telefone);
  const wpp = phone ? `https://wa.me/${phone}` : `${BASE}/contato/`;
  const accent = /^#[0-9a-f]{6}$/i.test(site.accent_color || '') ? site.accent_color : '#d5aa57';
  const brand = /^#[0-9a-f]{6}$/i.test(site.brand_color || '') ? site.brand_color : '#0d5c86';
  const cover = site.capa_url || `${BASE}/img/parceiro-capa-padrao.webp`;
  const segment = requestPath.startsWith('/corretor/') ? 'corretor' : 'parceiro';
  const canonical = `${BASE}/${segment}/${encodeURIComponent(slug)}/`;
  const landingUrl = canonical;
  const contactUrl = `${BASE}/${segment}/${encodeURIComponent(slug)}/contato/`;
  const logo = `<span class="brand-mark">CN</span><span class="brand-text">Condomínios na Praia</span>`;
  const totalProperties = properties.length;
  const cityOptions = [...new Set(properties.map((property) => property.city).filter((city) => city && city !== 'Rio Grande do Sul'))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const condoOptions = [...new Set(properties.map((property) => property.cond?.name).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const sectionMarkup = SECTIONS.map((section) => {
    const items = properties.filter((property) => property.category === section.category).slice(0, section.limit);
    return `<section class="property-section" id="sec-${section.id}" data-category="${section.category}"><div class="section-head"><div><span class="eyebrow">${section.icon} Oportunidades</span><h2>${section.title}<small>${section.subtitle}</small></h2></div><span class="section-count">${items.length} ${items.length === 1 ? 'imóvel' : 'imóveis'}</span></div>${items.length ? `<div class="property-grid">${items.map((item) => card(item)).join('')}</div>` : `<div class="empty">${section.empty}</div>`}</section>`;
  }).join('');
  const allJson = jsonSafe(JSON.stringify(properties));
  const wppText = encodeURIComponent(`Olá! Vi o site de ${name} e gostaria de falar sobre os imóveis disponíveis.`);
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(pageTitle)} | Condomínios na Praia</title>
<meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}">
<meta name="robots" content="index,follow"><meta property="og:type" content="website"><meta property="og:site_name" content="Condomínios na Praia"><meta property="og:title" content="${esc(pageTitle)} | Condomínios na Praia"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${esc(cover)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--brand:${brand};--accent:${accent};--ink:#0d3b54;--muted:#5b7585;--sand:#faf6ef;--line:#e7ded0;--white:#fff;--soft:#eef7f7}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--sand);color:var(--ink);font-family:Outfit,Arial,sans-serif}a{text-decoration:none;color:inherit}.site-header{position:sticky;top:0;z-index:20;background:rgba(250,246,239,.94);backdrop-filter:blur(16px);border-bottom:1px solid rgba(13,59,84,.1)}.nav{width:min(1180px,100%);margin:auto;padding:14px 24px;display:flex;align-items:center;gap:14px}.brand{display:flex;align-items:center;gap:10px;font-weight:700;letter-spacing:.03em}.brand-mark{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:var(--brand);color:#fff;font-size:12px;letter-spacing:.1em}.brand-text{white-space:nowrap}.brand-logo{width:38px;height:38px;border-radius:10px;object-fit:cover}.nav-links{margin-left:auto;display:flex;align-items:center;gap:18px;color:var(--muted);font-size:13px}.nav-cta{padding:9px 14px;border-radius:999px;background:var(--brand);color:#fff;font-weight:600}.hero{position:relative;min-height:440px;display:grid;align-items:end;overflow:hidden;background:linear-gradient(140deg,var(--brand),#0e8a99)}.hero:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,34,49,.22),rgba(5,34,49,.86))}.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55;filter:saturate(.88)}.hero-inner{position:relative;z-index:1;width:min(1180px,100%);margin:auto;padding:100px 24px 62px;color:#fff}.eyebrow{text-transform:uppercase;letter-spacing:.19em;color:var(--accent);font-size:11px;font-weight:700}.hero h1{max-width:820px;margin:14px 0 10px;font:600 clamp(40px,7vw,78px)/.98 Fraunces,serif;letter-spacing:-.04em}.hero-title-clean{margin:0!important;display:grid;gap:8px}.hero-title-clean span{display:block}.hero-title-clean span+span{font-size:.68em;letter-spacing:-.02em;color:var(--accent)}.hero p{max-width:660px;margin:0;font-size:17px;line-height:1.65;color:rgba(255,255,255,.9)}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}.hero-action{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:10px 17px;border-radius:999px;font-size:13px;font-weight:700;transition:transform .18s ease,background .18s ease}.hero-action:active{transform:scale(.97)}.hero-action.primary{background:var(--accent);color:#193c50}.hero-action.secondary{border:1px solid rgba(255,255,255,.68);color:#fff;background:rgba(255,255,255,.08)}.hero-action:hover{transform:translateY(-2px)}.hero-quick{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}.hero-quick span{border:1px solid rgba(255,255,255,.24);border-radius:999px;padding:7px 10px;background:rgba(5,34,49,.24);color:rgba(255,255,255,.84);font-size:11px}.main{width:min(1180px,100%);margin:auto;padding:52px 24px 120px}.search-panel{margin:-24px auto 44px;position:relative;z-index:3;background:#fff;border:1px solid var(--line);border-radius:22px;padding:18px;box-shadow:0 18px 42px rgba(13,59,84,.13)}.search-head{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-bottom:12px}.search-head h2{font:600 25px/1 Fraunces,serif;margin:0}.search-head p{margin:0;color:var(--muted);font-size:12px}.search-form{display:grid;grid-template-columns:1.35fr .8fr .8fr .8fr .8fr auto;gap:10px}.search-form input,.search-form select{width:100%;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--ink);padding:12px 13px;font:14px Outfit,sans-serif}.search-form button{border:0;border-radius:10px;background:var(--brand);color:#fff;padding:12px 18px;font:700 13px Outfit,sans-serif;cursor:pointer}.search-results{display:none;margin-top:18px;padding-top:18px;border-top:1px solid var(--line)}.search-results.on{display:block}.search-results-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:12px;color:var(--muted);font-size:13px}.search-results-head strong{color:var(--ink)}.intent-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:70px 0 0}.final-intents{scroll-margin-top:90px}.intent-row a{display:flex;flex-direction:column;gap:5px;padding:18px 20px;border:1px solid var(--line);border-radius:16px;background:#fff;box-shadow:0 10px 24px rgba(13,59,84,.05);transition:transform .18s ease,box-shadow .18s ease}.intent-row a:hover{transform:translateY(-2px);box-shadow:0 14px 28px rgba(13,59,84,.1)}.intent-row strong{font:600 24px/1 Fraunces,serif;color:var(--brand)}.intent-row span{color:var(--muted);font-size:12px;line-height:1.45}.section-intro{max-width:720px;margin-bottom:10px}.sr-title{margin:7px 0 5px;font:600 clamp(30px,4.6vw,50px)/.98 Fraunces,serif;letter-spacing:-.03em}.intro-text{margin:0;color:var(--muted);font-size:14px;line-height:1.6}.property-section{padding:52px 0 26px;scroll-margin-top:90px}.property-section+.property-section{margin-top:10px;border-top:1px solid rgba(13,59,84,.08)}.section-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:22px}.section-head h2{margin:9px 0 0;font:600 clamp(30px,4.6vw,50px)/.98 Fraunces,serif;letter-spacing:-.03em}.section-head h2 small{display:block;margin-top:8px;color:var(--accent);font:700 clamp(11px,1.2vw,15px)/1.2 Outfit,sans-serif;letter-spacing:.18em;text-transform:uppercase}.section-count{white-space:nowrap;color:var(--muted);font-size:12px}.property-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.property-card{background:var(--white);border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:0 12px 30px rgba(13,59,84,.07);display:flex;flex-direction:column;min-width:0}.property-photo-link{display:block}.property-photo{position:relative;aspect-ratio:16/10;background:linear-gradient(135deg,#d9e5e7,#b2c8cf);overflow:hidden}.property-photo img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .22s ease}.property-photo-link:hover img{transform:scale(1.035)}.property-photo-empty{height:100%;display:grid;place-items:center;color:var(--muted);font-size:13px}.property-badge{position:absolute;left:11px;top:11px;padding:5px 9px;border-radius:999px;background:rgba(255,255,255,.92);color:var(--brand);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.property-body{padding:15px;display:flex;flex:1;flex-direction:column;align-items:flex-start}.property-label{font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:var(--accent);font-weight:700}.property-body h3{margin:7px 0 5px;font:600 20px/1.08 Fraunces,serif}.property-body h3 a:hover{color:var(--brand)}.property-location,.property-details,.property-code,.property-condo{margin:0;color:var(--muted);font-size:12px;line-height:1.45}.property-details{margin-top:7px}.property-code{margin-top:7px;color:var(--brand);font-weight:700}.property-condo{margin-top:7px;color:#477282}.property-body strong{margin-top:15px;font-size:17px;color:var(--brand)}.property-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;width:100%;margin-top:14px}.property-link,.property-interest{display:flex;justify-content:center;align-items:center;min-height:38px;padding:8px 9px;border-radius:999px;font:700 11px Outfit,sans-serif;cursor:pointer}.property-link{border:1px solid rgba(13,92,134,.25);color:var(--brand)}.property-interest{border:0;background:var(--brand);color:#fff}.property-link:hover{background:var(--soft)}.property-interest:hover{filter:brightness(1.08)}.empty{padding:34px;border:1px dashed var(--line);border-radius:18px;background:#fff;color:var(--muted);text-align:center}.contact{margin-top:84px;background:var(--brand);color:#fff;border-radius:24px;padding:32px;display:grid;grid-template-columns:1fr 1fr;gap:28px}.contact-profile{display:flex;align-items:flex-start;gap:13px;margin:0 0 18px}.profile-photo{display:block;width:86px;height:108px;border-radius:15px;object-fit:cover;object-position:center 24%;border:3px solid rgba(255,255,255,.82);box-shadow:0 12px 26px rgba(0,0,0,.2)}.contact-profile strong{display:block;margin-top:4px;font-size:16px}.contact-profile small{display:block;margin-top:6px;color:rgba(255,255,255,.78);font-size:11px;line-height:1.45}.contact h2{font:600 38px/1 Fraunces,serif;margin:0 0 12px}.contact p{color:rgba(255,255,255,.8);line-height:1.6}.contact-form{display:grid;gap:10px}.contact-form input,.contact-form textarea{width:100%;border:1px solid rgba(255,255,255,.25);border-radius:10px;background:rgba(255,255,255,.1);color:#fff;padding:12px;font:14px Outfit,sans-serif}.contact-form input::placeholder,.contact-form textarea::placeholder{color:rgba(255,255,255,.68)}.contact-form textarea{min-height:88px;resize:vertical}.consent{display:flex;gap:8px;align-items:flex-start;font-size:12px;color:rgba(255,255,255,.78);line-height:1.4}.consent input{width:auto;margin-top:3px}.form-submit{border:0;border-radius:999px;background:var(--accent);color:#193c50;padding:12px 16px;font:700 13px Outfit,sans-serif;cursor:pointer}.form-message{min-height:20px;font-size:13px;color:#ffe3a4}footer{background:#092f47;color:#fff;padding:48px 24px 18px;border-top:5px solid var(--accent)}.footer-main{width:min(1180px,100%);margin:auto;display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:32px}.footer-logo{font:600 25px/1.05 Fraunces,serif}.footer-logo em{color:var(--accent);font-style:italic}.footer-text{max-width:310px;color:rgba(255,255,255,.7);font-size:13px;line-height:1.6;margin:14px 0 18px}.footer-title{color:var(--accent);font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:13px}.footer-col a{display:block;color:rgba(255,255,255,.75);font-size:13px;padding:5px 0}.footer-col a:hover{color:#fff}.footer-wpp{display:inline-flex;align-items:center;gap:8px;background:#25d366;color:#fff!important;border-radius:999px;padding:10px 15px!important;font-weight:700!important}.footer-bottom{width:min(1180px,100%);margin:30px auto 0;padding-top:16px;border-top:1px solid rgba(255,255,255,.14);display:flex;justify-content:space-between;gap:12px;color:rgba(255,255,255,.55);font-size:11px}.floating-wpp{position:fixed;right:22px;bottom:22px;z-index:50;display:inline-flex;align-items:center;gap:8px;background:#25d366;color:#fff;padding:12px 16px;border-radius:999px;font-size:13px;font-weight:700;box-shadow:0 12px 28px rgba(37,211,102,.35);transition:transform .2s}.floating-wpp:hover{transform:translateY(-2px)}.floating-wpp svg{width:20px;height:20px;fill:currentColor}@media(max-width:1000px){.property-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.footer-main{grid-template-columns:1.4fr 1fr 1fr}}@media(max-width:760px){.nav{padding:10px 14px}.brand-text{display:none}.nav-links{gap:7px;font-size:11px}.nav-links a:not(.nav-cta){display:inline;padding:7px 3px}.nav-cta{padding:8px 10px;font-size:11px}.hero{min-height:390px}.hero-bg{opacity:.36;filter:saturate(.78)}.hero-inner{padding:72px 18px 34px}.hero h1{max-width:390px;font-size:clamp(34px,10vw,54px);line-height:1}.hero-title-clean{gap:5px}.hero-title-clean span+span{font-size:.7em}.hero p{max-width:390px;font-size:14px;line-height:1.5}.hero-actions{margin-top:18px}.hero-action{min-height:40px;padding:9px 13px;font-size:12px}.hero-quick{gap:6px;margin-top:14px}.hero-quick span{font-size:10px;padding:6px 8px}.main{padding:38px 16px 108px}.search-panel{margin:-14px 0 42px;padding:14px;border-radius:18px}.search-head{display:block}.search-head p{margin-top:7px}.search-form{grid-template-columns:1fr;gap:8px}.intent-row{grid-template-columns:1fr;gap:10px;margin:32px 0 0}.intent-row a{padding:15px 16px}.intent-row strong{font-size:22px}.property-grid{grid-template-columns:1fr 1fr;gap:12px}.property-section{padding:42px 0 18px}.property-section+.property-section{margin-top:10px}.section-head{align-items:flex-start;display:block}.section-count{display:block;margin-top:10px}.property-body{padding:12px}.property-body h3{font-size:18px}.property-actions{grid-template-columns:1fr}.contact{grid-template-columns:1fr;padding:24px 18px}.contact h2{font-size:33px}.footer-main{grid-template-columns:1fr 1fr;gap:26px 20px}.footer-col:first-child{grid-column:1/-1}.footer-bottom{flex-direction:column;gap:5px}.floating-wpp{right:14px;bottom:78px;padding:13px 15px}.floating-wpp span{display:none}}@media(max-width:420px){.nav-links{gap:4px}.nav-links a:not(.nav-cta){font-size:10px}.nav-cta{padding:7px 8px}.hero h1{font-size:33px}.hero-quick span:nth-child(2){display:none}.property-grid{grid-template-columns:1fr}.footer-main{grid-template-columns:1fr}.footer-col:first-child{grid-column:auto}}
</style>
</head>
<body>
<header class="site-header"><nav class="nav"><a class="brand" href="${landingUrl}" aria-label="Início do site do corretor parceiro">${logo}</a><div class="nav-links"><a href="${landingUrl}">Início</a><a href="#imoveis">Imóveis</a><a href="${contactUrl}">Contato</a><a class="nav-cta" href="${esc(wpp)}" target="_blank" rel="noopener nofollow">WhatsApp</a></div></nav></header>
<section class="hero"><img class="hero-bg" src="${esc(cover)}" alt="Paisagem de condomínio de alto padrão no litoral do Rio Grande do Sul" fetchpriority="high"><div class="hero-inner"><h1 class="hero-title-clean"><span>${esc(heroName)}</span><span>${esc(heroClaim)}</span></h1></div></section>
<main class="main">
<section class="search-panel" id="buscar"><div class="search-head"><div><span class="eyebrow">Busca rápida</span><h2>Encontre seu imóvel</h2></div><p>Pesquise por cidade, condomínio, tipo ou característica.</p></div><form class="search-form" id="property-search-form"><input id="property-query" type="search" placeholder="Cidade, condomínio, tipo ou característica" autocomplete="off"><select id="property-category"><option value="">Todas as categorias</option>${SECTIONS.map((section) => `<option value="${section.category}">${section.title} · ${section.subtitle}</option>`).join('')}</select><select id="property-city"><option value="">Todas as cidades</option>${cityOptions.map((city) => `<option value="${esc(city)}">${esc(city)}</option>`).join('')}</select><select id="property-condo"><option value="">Todos os condomínios</option>${condoOptions.map((condo) => `<option value="${esc(condo)}">${esc(condo)}</option>`).join('')}</select><select id="property-bedrooms"><option value="">Quartos</option><option value="1">1+ quarto</option><option value="2">2+ quartos</option><option value="3">3+ quartos</option><option value="4">4+ quartos</option></select><select id="property-price"><option value="">Qualquer valor</option><option value="0-500000">Até R$ 500 mil</option><option value="500000-1000000">R$ 500 mil a R$ 1 milhão</option><option value="1000000-2000000">R$ 1 a R$ 2 milhões</option><option value="2000000-999999999999">Acima de R$ 2 milhões</option></select><button type="submit">Buscar imóveis</button></form><div class="search-results" id="search-results"><div class="search-results-head"><strong id="search-results-title">Resultados</strong><button type="button" id="clear-search" class="property-link">Limpar busca</button></div><div class="property-grid" id="search-grid"></div></div></section>
<section id="imoveis" class="property-sections">${sectionMarkup}</section>
<section class="contact" id="contato"><div>${site.logo_url ? `<div class="contact-profile"><img class="profile-photo" src="${esc(site.logo_url)}" alt="Foto profissional de ${esc(name)}" loading="lazy"><div><strong>${esc(pageTitle)}</strong><small>CRECI ${esc(site.creci || '—')} · Atendimento em todo o Rio Grande do Sul</small></div></div>` : ''}<div class="eyebrow">Fale com ${esc(name)}</div><h2>Converse sobre seu próximo imóvel.</h2><p>Envie seus dados e receba atendimento personalizado. O formulário registra o consentimento para uso dos dados conforme a Política de Privacidade.</p><a class="nav-cta" href="${esc(wpp)}" target="_blank" rel="noopener nofollow">Conversar pelo WhatsApp</a></div><form class="contact-form" id="lead-form"><input name="nome" placeholder="Seu nome" required><input name="email" type="email" placeholder="Seu e-mail"><input name="telefone" placeholder="Seu WhatsApp" required><textarea name="mensagem" placeholder="Conte o que você procura"></textarea><label class="consent"><input name="consentimento_lgpd" type="checkbox" required><span>Autorizo o contato sobre esta oportunidade e li a <a href="${BASE}/politica-privacidade/" target="_blank" rel="noopener"><u>Política de Privacidade</u></a>.</span></label><input type="hidden" name="site_id" value="${esc(site.id)}"><button class="form-submit" type="submit">Quero ser atendido</button><div class="form-message" id="form-message" role="status"></div></form></section>
<section class="intent-row final-intents" aria-label="Atalhos de atendimento"><a href="#buscar" data-intent="buy"><strong>Quero comprar</strong><span>Encontre imóveis por cidade, condomínio ou tipo.</span></a><a href="#contato" data-intent="sell"><strong>Quero vender</strong><span>Fale com o corretor para avaliar seu imóvel.</span></a></section>
</main>
<footer><div class="footer-main"><div class="footer-col"><div class="footer-logo">${esc(name)}</div><p class="footer-text">Site profissional conectado ao catálogo do Condomínios na Praia, com imóveis selecionados e atendimento personalizado no Rio Grande do Sul.</p><a class="footer-wpp" href="${esc(wpp)}" target="_blank" rel="noopener nofollow">WhatsApp do corretor</a></div><div class="footer-col"><div class="footer-title">Navegar</div><a href="#buscar">Buscar imóveis</a><a href="#imoveis">Todos os destaques</a><a href="${contactUrl}">Falar com o corretor</a><a href="${BASE}/">Portal Condomínios na Praia</a></div><div class="footer-col"><div class="footer-title">Atendimento</div><span>${esc(site.creci ? `CRECI ${site.creci}` : 'Atendimento imobiliário')}</span><span>${esc(site.cidade || 'Rio Grande do Sul')}</span>${site.email ? `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>` : '<span>Atendimento pelo WhatsApp</span>'}</div><div class="footer-col"><div class="footer-title">Informações</div><a href="${BASE}/politica-privacidade/">Política de Privacidade</a><a href="${BASE}/termos/">Termos de Uso</a><a href="${BASE}/contato/">Contato do portal</a></div></div><div class="footer-bottom"><span>© 2026 ${esc(name)} · Site parceiro Condomínios na Praia</span><span>Rio Grande do Sul · Brasil</span></div></footer>
<a class="floating-wpp" href="${esc(wpp)}?text=${wppText}" target="_blank" rel="noopener nofollow" aria-label="Falar com ${esc(name)} pelo WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.9c0 2.1.5 4.1 1.6 5.9L.2 24l6.4-1.7a11.9 11.9 0 0 0 5.5 1.4h.1c6.5 0 11.8-5.3 11.8-11.9 0-3.1-1.3-6.1-3.5-8.3Zm-8.4 18.2h-.1a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 0 1-1.5-5.2c0-5.4 4.4-9.9 9.9-9.9a9.8 9.8 0 0 1 7 2.9 9.9 9.9 0 0 1 2.9 7c0 5.4-4.4 9.9-9.8 9.9Zm5.4-7.4c-.3-.2-1.7-.9-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.5-3.7-3.3-.3-.5.3-.6.8-1.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-1-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.2.2 2 3.1 4.9 4.3.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.2.1-1.4-.1-.1-.3-.2-.6-.3Z"/></svg><span>WhatsApp</span></a>
<script type="application/json" id="partner-data">${allJson}</script>
<script>
const PARTNER_DATA=JSON.parse(document.getElementById('partner-data').textContent||'[]');
const leadForm=document.getElementById('lead-form');const message=document.getElementById('form-message');let selectedProperty='';
function h(value){return String(value??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));}
function wireInterest(){document.querySelectorAll('.property-interest').forEach(btn=>{if(btn.dataset.bound==='1')return;btn.dataset.bound='1';btn.addEventListener('click',()=>{selectedProperty=btn.dataset.propertyId||'';const area=document.querySelector('#contato');if(area)area.scrollIntoView({behavior:'smooth'});const text=document.querySelector('textarea[name=mensagem]');if(text)text.value='Tenho interesse em: '+(btn.dataset.propertyTitle||'este imóvel');});});}
function clientCard(p){const details=[p.bedrooms&&p.bedrooms+' quartos',p.suites&&p.suites+' suítes',p.area&&p.area+' m²'].filter(Boolean).join(' · ');const loc=[p.neighborhood,p.city].filter(Boolean).join(' · ');return '<article class="property-card property-card-compact"><a class="property-photo-link" href="'+h(p.url)+'"><div class="property-photo">'+(p.photo?'<img src="'+h(p.photo)+'" alt="'+h(p.title)+'" loading="lazy" decoding="async">':'<div class="property-photo-empty">Imagem em atualização</div>')+'</div></a><div class="property-body"><span class="property-label">'+h(p.type||'Imóvel')+'</span><h3><a href="'+h(p.url)+'">'+h(p.title)+'</a></h3><p class="property-location">'+h(loc||'Rio Grande do Sul')+'</p>'+(details?'<p class="property-details">'+h(details)+'</p>':'')+(p.code?'<p class="property-code">Código do imóvel: '+h(p.code)+'</p>':'')+(p.cond&&p.cond.name?'<p class="property-condo">Condomínio: '+h(p.cond.name)+'</p>':'')+'<strong>'+h(p.price?'R$ '+p.price:'Consulte o valor')+'</strong><div class="property-actions"><a class="property-link" href="'+h(p.url)+'">Ver imóvel</a><button class="property-interest" type="button" data-property-id="'+h(p.id||'')+'" data-property-title="'+h(p.title)+'">Tenho interesse</button></div></div></article>';}
const searchForm=document.getElementById('property-search-form');const searchBox=document.getElementById('search-results');const searchGrid=document.getElementById('search-grid');const searchTitle=document.getElementById('search-results-title');
function runSearch(){const q=(document.getElementById('property-query').value||'').trim().toLowerCase();const cat=document.getElementById('property-category').value;const city=(document.getElementById('property-city').value||'').trim().toLowerCase();const condo=(document.getElementById('property-condo').value||'').trim().toLowerCase();const bedrooms=Number(document.getElementById('property-bedrooms').value||0);const price=(document.getElementById('property-price').value||'').split('-').map(Number);const rows=PARTNER_DATA.filter(p=>{const amount=Number(String(p.price||'').replace(/[^0-9,.-]/g,'').replace(/\.(?=\d{3}(?:\D|$))/g,'').replace(',','.'))||0;return (!cat||p.category===cat)&&(!city||(p.city||'').toLowerCase()===city)&&(!condo||((p.cond&&p.cond.name)||'').toLowerCase()===condo)&&(!bedrooms||Number(p.bedrooms||0)>=bedrooms)&&(!price[0]&&!price[1]||amount>=price[0]&&amount<=price[1])&&(!q||[p.title,p.type,p.city,p.neighborhood,p.cond&&p.cond.name,p.description,p.code].filter(Boolean).join(' ').toLowerCase().includes(q));}).slice(0,48);searchBox.classList.add('on');searchTitle.textContent=rows.length+' resultado'+(rows.length===1?'':'s');searchGrid.innerHTML=rows.length?rows.map(p=>clientCard(p)).join(''):'<div class="empty">Nenhum imóvel correspondeu à sua busca.</div>';wireInterest();searchBox.scrollIntoView({behavior:'smooth',block:'start'});}
searchForm.addEventListener('submit',e=>{e.preventDefault();runSearch();});document.getElementById('clear-search').addEventListener('click',()=>{document.getElementById('property-query').value='';document.getElementById('property-category').value='';document.getElementById('property-city').value='';document.getElementById('property-condo').value='';document.getElementById('property-bedrooms').value='';document.getElementById('property-price').value='';searchBox.classList.remove('on');searchGrid.innerHTML='';});document.querySelectorAll('[data-intent]').forEach(link=>link.addEventListener('click',()=>{const intent=link.dataset.intent;if(intent==='buy'){setTimeout(()=>document.getElementById('property-query')?.focus(),250);}if(intent==='sell'){const text=document.querySelector('textarea[name=mensagem]');if(text)text.value='Quero vender meu imóvel e gostaria de receber uma avaliação e orientação sobre o processo.';}}));wireInterest();
leadForm.addEventListener('submit',async(e)=>{e.preventDefault();const data=Object.fromEntries(new FormData(leadForm));data.imovel_id=selectedProperty;data.origem_url=location.href;data.consentimento_lgpd=Boolean(leadForm.querySelector('[name=consentimento_lgpd]').checked);message.textContent='Enviando...';try{const response=await fetch('/parceiro-lead',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});const out=await response.json();if(!response.ok)throw new Error(out.error||'Não foi possível enviar.');leadForm.reset();selectedProperty='';message.textContent='Recebemos seus dados. O corretor entrará em contato.';}catch(error){message.textContent=error.message||'Não foi possível enviar agora.';}});
</script>
</body>
</html>`;
}

export async function onRequest(context) {
  const requestedSlug = String(context.params?.slug || '').toLowerCase();
  if (!requestedSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(requestedSlug)) return new Response('Not Found', { status: 404 });
  const { dbSlug, publicSlug } = siteSlugInfo(requestedSlug);
  const requestPath = new URL(context.request.url).pathname;
  if (requestPath.startsWith('/parceiro/') || (requestPath.startsWith('/corretor/') && requestedSlug !== publicSlug)) return Response.redirect(`${BASE}/corretor/${encodeURIComponent(publicSlug)}/`, 301);
  const sites = await getJson(`parceiros_sites?slug=eq.${encodeURIComponent(dbSlug)}&status=eq.active&select=id,slug,nome,creci,telefone,whatsapp,email,cidade,bio,logo_url,capa_url,brand_color,accent_color&limit=1`);
  if (!Array.isArray(sites) || !sites[0]) return new Response('<!doctype html><meta charset="utf-8"><title>Site não encontrado</title><style>body{font-family:Arial;padding:48px;max-width:680px;margin:auto;color:#0d3b54}a{color:#0d5c86}</style><h1>Site ainda não publicado</h1><p>Esta landing não está ativa ou o endereço foi digitado incorretamente.</p><a href="https://condominiosnapraia.com.br/">Voltar para Condomínios na Praia</a>', { status: 404, headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex' } });
  const site = sites[0];
  const rows = await getJson(`parceiros_sites_imoveis?site_id=eq.${site.id}&publicado=eq.true&select=id,ordem,destaque,titulo_personalizado,chamada_personalizada,updated_at,imovel:imoveis(id,slug,codigo,ref,titulo,tipo,cidade_end,bairro,bairro_end,fora_condominio,cond_id,preco,quartos,suites,banheiros,vagas,area,area_privativa,area_construida,corretor,descricao,fotos,fotos_no_site,fotos_para_site,status,publicar)&order=destaque.desc,ordem.asc&limit=1000`);
  const listingRows = (Array.isArray(rows) ? rows : []).filter((row) => row.imovel && row.imovel.publicar !== false && String(row.imovel.status || '').toLowerCase() !== 'vendido');
  const condIds = [...new Set(listingRows.map((row) => row.imovel?.cond_id).filter(Boolean))];
  const condMap = {};
  if (condIds.length) {
    const condos = await getJson(`condominios?id=in.(${condIds.map(encodeURIComponent).join(',')})&select=id,slug,nome,cidade,descricao,amenidades&limit=1000`);
    (Array.isArray(condos) ? condos : []).forEach((cond) => { condMap[cond.id] = cond; });
  }
  const properties = listingRows.map((row) => normalizeListing(row, condMap, publicSlug));
  return new Response(layout({ site, properties, slug: publicSlug, requestPath }), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600' } });
}

export { propertySlug, propertyUrl, normalizeListing };
