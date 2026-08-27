const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const BASE = 'https://condominiosnapraia.com.br';
const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_URL_FALLBACK = SB_URL;
const SB_ANON_FALLBACK = SB_ANON;
const SITE_SLUG_ALIASES = Object.freeze({});
function sbConfig(env) { const url = (env && env.SB_URL) || SB_URL_FALLBACK; const key = (env && env.SB_ANON) || SB_ANON_FALLBACK; return { url, headers: { apikey: key, Authorization: `Bearer ${key}` } }; }
function esc(value) { return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
function jsonSafe(value) { return String(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026'); }
function cityKey(value) { return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
const CITY_LABELS = Object.freeze({ 'xangri la': 'Xangri-Lá', 'capao da canoa': 'Capão da Canoa', osorio: 'Osório', 'maquine': 'Maquiné', tramandai: 'Tramandaí', atlantida: 'Atlântida', imbe: 'Imbé', 'balneario pinhal': 'Balneário Pinhal' });
function cityLabel(value) { const clean = String(value || '').trim().replace(/\s+/g, ' '); return CITY_LABELS[cityKey(clean)] || clean; }
function slugify(value) { return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-'); }
function toArray(value) { if (Array.isArray(value)) return value; if (typeof value === 'string') { try { return JSON.parse(value); } catch (_) { return value ? [value] : []; } } return []; }
function firstPhoto(obj) { const list = [...toArray(obj?.fotos_no_site), ...toArray(obj?.fotos), ...toArray(obj?.fotos_para_site)]; for (const item of list) { const url = typeof item === 'string' ? item : item?.url || item?.src || item?.publicUrl || item?.public_url; if (url && (/^https?:\/\//i.test(url) || String(url).startsWith('/cdn-fotos/'))) return url; } return ''; }
function siteSlugInfo(value) { const requested = String(value || '').toLowerCase(); const dbSlug = SITE_SLUG_ALIASES[requested] || requested; const publicSlug = Object.entries(SITE_SLUG_ALIASES).find(([, alias]) => alias === requested)?.[0] || requested; return { dbSlug, publicSlug }; }
async function getJson(path, cfg) { const { url, headers } = cfg || sbConfig(null); try { const response = await fetch(`${url}/rest/v1/${path}`, { headers }); return response.ok ? await response.json() : []; } catch (_) { return []; } }

function layout({ site, slug, condos }) {
  const segment = 'corretor';
  const name = site.nome || 'Corretor parceiro';
  const wpp = `https://wa.me/${String(site.whatsapp || site.telefone || '').replace(/\D/g, '')}`;
  const landingUrl = `${BASE}/${segment}/${encodeURIComponent(slug)}/`;
  const fullListingUrl = `${BASE}/${segment}/${encodeURIComponent(slug)}/imoveis/`;
  const contactUrl = `${BASE}/${segment}/${encodeURIComponent(slug)}/contato/`;
  const logo = `<span class="brand-name">${esc(name)}</span><span class="brand-sub">Corretor de imóveis${site.creci ? ` · CRECI ${esc(site.creci)}` : ''}</span>`;
  const canonical = `${BASE}/${segment}/${encodeURIComponent(slug)}/condominios/`;
  const cities = [...new Set(condos.map((c) => cityLabel(c.city)).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const condoCard = (c) => {
    const condoPublicSlug = slugify(c.slug || c.name || c.id) || String(c.id);
    const url = `${BASE}/${segment}/${encodeURIComponent(slug)}/condominio/${encodeURIComponent(condoPublicSlug)}/`;
    const ameniStr = (c.amenities || []).slice(0, 3).join(' · ');
    return `<a class="condo-card" href="${url}" data-name="${esc(cityKey(c.name))}" data-city="${esc(cityKey(c.city))}" data-count="${c.count}"><div class="condo-photo">${c.photo ? `<img src="${esc(c.photo)}" alt="${esc(c.name)}" loading="lazy" decoding="async">` : '<div class="condo-photo-empty">Imagem em atualização</div>'}<span class="condo-count">${c.count} ${c.count === 1 ? 'imóvel' : 'imóveis'}</span></div><div class="condo-body"><h3>${esc(c.name)}</h3><p class="condo-city">📍 ${esc(cityLabel(c.city) || 'Rio Grande do Sul')}</p>${ameniStr ? `<p class="condo-amenities">${esc(ameniStr)}</p>` : ''}</div></a>`;
  };

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Condomínios · ${esc(name)}</title><meta name="description" content="Todos os condomínios e empreendimentos com imóveis disponíveis por ${esc(name)} no Litoral Norte Gaúcho."><meta name="robots" content="index,follow"><link rel="canonical" href="${canonical}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet"><style>
:root{--brand:#0b5368;--accent:#f4bf61;--ink:#0b2733;--muted:#5c7479;--sand:#f4f8f6;--line:#dce9e6;--white:#fff;--soft:#e9f5f2}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--sand);color:var(--ink);font-family:'DM Sans',Outfit,Arial,sans-serif;overflow-x:hidden}a{text-decoration:none;color:inherit}
.site-header{position:sticky;top:0;z-index:20;background:rgba(250,246,239,.94);backdrop-filter:blur(16px);border-bottom:1px solid rgba(13,59,84,.1)}.nav{width:min(1180px,100%);margin:auto;padding:14px 24px;display:flex;align-items:center;gap:14px}.brand{display:flex;flex-direction:column;justify-content:center;gap:1px;line-height:1.1}.brand-name{font:700 16px/1.15 Fraunces,serif;color:var(--brand);letter-spacing:-.01em;white-space:nowrap}.brand-sub{font:600 9px/1.2 Outfit,sans-serif;color:var(--muted);letter-spacing:.13em;text-transform:uppercase;white-space:nowrap}.nav-links{margin-left:auto;display:flex;align-items:center;gap:18px;color:var(--muted);font-size:13px}.nav-cta{padding:9px 14px;border-radius:999px;background:var(--brand);color:#fff;font-weight:600}
.page-hero{background:linear-gradient(140deg,var(--brand),#0e8a99);color:#fff;padding:54px 24px 40px}.page-hero-inner{width:min(1180px,100%);margin:auto}.page-hero .eyebrow{text-transform:uppercase;letter-spacing:.19em;color:var(--accent);font-size:11px;font-weight:700}.page-hero h1{margin:12px 0 8px;font:600 clamp(32px,5vw,52px)/1 Fraunces,serif;letter-spacing:-.03em}.page-hero p{margin:0;max-width:620px;color:rgba(255,255,255,.9);font-size:15px;line-height:1.6}.crumb{margin-bottom:14px;font-size:12px;color:rgba(255,255,255,.8)}.crumb a{color:#fff}
.main{width:min(1180px,100%);margin:auto;padding:26px 24px 90px}
.filter-panel{position:sticky;top:74px;z-index:10;background:#fff;border:1px solid rgba(13,59,84,.1);border-radius:18px;padding:14px;box-shadow:0 14px 34px rgba(13,59,84,.1);margin-bottom:22px;display:grid;grid-template-columns:1.4fr .9fr .9fr auto;gap:10px}.filter-panel input,.filter-panel select{width:100%;min-height:46px;border:1px solid #dbe6e8;border-radius:12px;background:#f8fbfb;color:var(--ink);padding:12px 13px;font:14px Outfit,sans-serif;outline:none}.filter-panel input:focus,.filter-panel select:focus{border-color:var(--brand);box-shadow:0 0 0 3px rgba(13,92,134,.1);background:#fff}.filter-clear{border:1px solid rgba(13,92,134,.2);border-radius:12px;background:#fff;color:var(--brand);font:700 13px Outfit,sans-serif;cursor:pointer;padding:0 18px;white-space:nowrap}.filter-clear:hover{background:var(--soft)}
.results-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:16px}.results-head h2{margin:0;font:600 clamp(22px,3vw,30px)/1 Fraunces,serif}.results-count{color:var(--muted);font-size:13px}
.condos-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.condo-card{display:flex;flex-direction:column;background:#fff;border:1px solid rgba(13,59,84,.1);border-radius:20px;overflow:hidden;box-shadow:0 12px 30px rgba(13,59,84,.07);transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}.condo-card:hover{transform:translateY(-4px);box-shadow:0 18px 38px rgba(13,59,84,.13);border-color:rgba(13,92,134,.2)}.condo-photo{position:relative;aspect-ratio:16/11;background:linear-gradient(135deg,#d9e5e7,#b2c8cf);overflow:hidden}.condo-photo img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .22s ease}.condo-card:hover .condo-photo img{transform:scale(1.04)}.condo-photo-empty{height:100%;display:grid;place-items:center;color:var(--muted);font-size:12px}.condo-count{position:absolute;right:11px;bottom:11px;padding:5px 11px;border-radius:999px;background:rgba(9,47,71,.86);color:#fff;font-size:11px;font-weight:700;letter-spacing:.02em}.condo-body{padding:15px;display:flex;flex-direction:column;gap:5px}.condo-body h3{margin:0;font:600 19px/1.15 Fraunces,serif;color:var(--ink)}.condo-city{margin:0;color:var(--muted);font-size:12px}.condo-amenities{margin:4px 0 0;color:#477282;font-size:11px;line-height:1.4}
.empty{grid-column:1/-1;padding:40px;border:1px dashed var(--line);border-radius:18px;background:#fff;color:var(--muted);text-align:center}
footer{background:#092f47;color:#fff;padding:40px 24px 18px;border-top:5px solid var(--accent);margin-top:40px}.footer-inner{width:min(1180px,100%);margin:auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:20px}.footer-logo{font:600 22px/1 Fraunces,serif}.footer-links{display:flex;gap:18px;flex-wrap:wrap;font-size:13px;color:rgba(255,255,255,.8)}.footer-bottom{width:min(1180px,100%);margin:24px auto 0;padding-top:14px;border-top:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.55);font-size:11px}
.floating-wpp{position:fixed;right:22px;bottom:22px;z-index:50;display:inline-flex;align-items:center;gap:8px;background:#25d366;color:#fff;padding:12px 16px;border-radius:999px;font-size:13px;font-weight:700;box-shadow:0 12px 28px rgba(37,211,102,.35)}
@media(max-width:1000px){.condos-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.filter-panel{grid-template-columns:1fr 1fr}}
@media(max-width:760px){.nav{padding:9px 12px;gap:8px}.brand-name{font-size:14px}.nav-links{gap:6px;font-size:11px;margin-left:auto}.nav-cta{padding:7px 9px;font-size:10px}.main{padding:20px 16px 80px}.filter-panel{position:static;grid-template-columns:1fr;gap:8px}.condos-grid{grid-template-columns:1fr 1fr;gap:12px}}
@media(max-width:420px){.brand-sub{display:none}.condos-grid{grid-template-columns:1fr}}
</style></head><body>
<header class="site-header"><nav class="nav"><a class="brand" href="${landingUrl}">${logo}</a><div class="nav-links"><a href="${landingUrl}">Início</a><a href="${fullListingUrl}">Imóveis</a><a href="${contactUrl}">Contato</a><a class="nav-cta" href="${esc(wpp)}" target="_blank" rel="noopener nofollow">WhatsApp</a></div></nav></header>
<section class="page-hero"><div class="page-hero-inner"><nav class="crumb"><a href="${landingUrl}">Início</a> › <span>Condomínios</span></nav><span class="eyebrow">🏛 Empreendimentos</span><h1>Condomínios</h1><p>Todos os condomínios e empreendimentos com imóveis disponíveis na carteira de ${esc(name)}.</p></div></section>
<main class="main">
<form class="filter-panel" id="condo-filter"><input id="c-query" type="search" placeholder="Buscar por nome do condomínio" autocomplete="off"><select id="c-city"><option value="">Todas as cidades</option>${cities.map((c) => `<option value="${esc(cityKey(c))}">${esc(c)}</option>`).join('')}</select><select id="c-order"><option value="count">Mais imóveis primeiro</option><option value="name">Nome (A–Z)</option></select><button type="button" class="filter-clear" id="c-clear">Limpar</button></form>
<div class="results-head"><h2 id="c-title">Todos os condomínios</h2><span class="results-count" id="c-count">${condos.length} ${condos.length === 1 ? 'condomínio' : 'condomínios'}</span></div>
<div class="condos-grid" id="condos-grid">${condos.length ? condos.map(condoCard).join('') : '<div class="empty">Nenhum condomínio com imóveis publicados ainda.</div>'}</div>
</main>
<a class="floating-wpp" href="${esc(wpp)}" target="_blank" rel="noopener nofollow"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.9c0 2.1.5 4.1 1.6 5.9L.2 24l6.4-1.7a11.9 11.9 0 0 0 5.5 1.4h.1c6.5 0 11.8-5.3 11.8-11.9 0-3.1-1.3-6.1-3.5-8.3Z"/></svg><span>WhatsApp</span></a>
<footer><div class="footer-inner"><div class="footer-logo">${esc(name)}</div><div class="footer-links"><a href="${landingUrl}">Início</a><a href="${fullListingUrl}">Imóveis</a><a href="${contactUrl}">Contato</a><a href="${BASE}/">Portal Condomínios na Praia</a></div></div><div class="footer-bottom">© 2026 ${esc(name)} · Site parceiro Condomínios na Praia</div></footer>
<script>
(function(){
  var grid=document.getElementById('condos-grid');
  var cards=[].slice.call(grid.querySelectorAll('.condo-card'));
  var q=document.getElementById('c-query'),city=document.getElementById('c-city'),order=document.getElementById('c-order'),clear=document.getElementById('c-clear'),count=document.getElementById('c-count'),title=document.getElementById('c-title');
  function apply(){
    var term=(q.value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    var ci=city.value;
    var shown=0;
    cards.forEach(function(card){
      var okName=!term||(card.dataset.name||'').indexOf(term)>-1;
      var okCity=!ci||card.dataset.city===ci;
      var vis=okName&&okCity;
      card.style.display=vis?'':'none';
      if(vis)shown++;
    });
    // ordenar
    var visibleCards=cards.filter(function(c){return c.style.display!=='none';});
    visibleCards.sort(function(a,b){
      if(order.value==='name')return (a.querySelector('h3').textContent).localeCompare(b.querySelector('h3').textContent,'pt-BR');
      return Number(b.dataset.count)-Number(a.dataset.count);
    });
    visibleCards.forEach(function(c){grid.appendChild(c);});
    count.textContent=shown+(shown===1?' condomínio':' condomínios');
    title.textContent=(term||ci)?'Resultado da busca':'Todos os condomínios';
    if(!shown&&!grid.querySelector('.empty-dynamic')){var e=document.createElement('div');e.className='empty empty-dynamic';e.textContent='Nenhum condomínio encontrado.';grid.appendChild(e);}
    var ed=grid.querySelector('.empty-dynamic');if(ed)ed.style.display=shown?'none':'';
  }
  q.addEventListener('input',apply);city.addEventListener('change',apply);order.addEventListener('change',apply);
  clear.addEventListener('click',function(){q.value='';city.value='';order.value='count';apply();});
  apply();
})();
</script>
</body></html>`;
}

export async function onRequest(context) {
  const cfg = sbConfig(context.env);
  const requested = String(context.params?.slug || '').toLowerCase();
  const { dbSlug, publicSlug } = siteSlugInfo(requested);
  const sites = await getJson(`parceiros_sites?slug=eq.${encodeURIComponent(dbSlug)}&status=eq.active&select=id,slug,nome,creci,telefone,whatsapp,email,cidade&limit=1`, cfg);
  const site = Array.isArray(sites) ? sites[0] : null;
  if (!site) return new Response('Corretor não encontrado', { status: 404 });

  const rows = await getJson(`parceiros_sites_imoveis?site_id=eq.${encodeURIComponent(site.id)}&publicado=eq.true&select=imovel:imoveis(cond_id,status,publicar)&limit=1000`, cfg);
  const listingRows = (Array.isArray(rows) ? rows : []).filter((row) => row.imovel && row.imovel.publicar !== false && !/vendid/i.test(String(row.imovel.status || '')));

  const counts = {};
  listingRows.forEach((row) => { const id = row.imovel.cond_id; if (id) counts[id] = (counts[id] || 0) + 1; });
  const condIds = Object.keys(counts);
  if (!condIds.length) return new Response(layout({ site, slug: publicSlug, condos: [] }), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60, s-maxage=300' } });

  const condosRaw = await getJson(`condominios?id=in.(${condIds.map(encodeURIComponent).join(',')})&select=id,slug,nome,cidade,amenidades,fotos_no_site,fotos,fotos_para_site&limit=1000`, cfg);
  const condos = (Array.isArray(condosRaw) ? condosRaw : []).map((c) => ({
    id: c.id,
    slug: slugify(c.slug || c.nome) || String(c.id),
    name: c.nome || 'Condomínio',
    city: c.cidade || '',
    amenities: Array.isArray(c.amenidades) ? c.amenidades : [],
    photo: firstPhoto(c),
    count: counts[c.id] || 0,
  })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'pt-BR'));

  return new Response(layout({ site, slug: publicSlug, condos }), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600' } });
}
