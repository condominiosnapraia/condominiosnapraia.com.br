const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const BASE = 'https://condominiosnapraia.com.br';
const STORAGE = `${SB_URL}/storage/v1/object/public/`;
const HEADERS = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` };

function esc(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
function jsonSafe(value) { return String(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026'); }
function digits(value) { return String(value || '').replace(/\D/g, ''); }
function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') { try { return JSON.parse(value); } catch (_) { return value ? [value] : []; } }
  return [];
}
function publicPhoto(value) {
  const raw = typeof value === 'string' ? value : value?.url || value?.src || value?.publicUrl || value?.public_url || '';
  if (!raw) return '';
  if (raw.startsWith(STORAGE)) return `${BASE}/cdn-fotos/${raw.slice(STORAGE.length).replace(/^\/+/, '')}`;
  if (/^https?:\/\//i.test(raw) || raw.startsWith('/cdn-fotos/')) return raw;
  return `${BASE}/cdn-fotos/${raw.replace(/^\/+/, '')}`;
}
function photosOf(imovel) {
  const seen = new Set();
  const values = [...toArray(imovel?.fotos_no_site), ...toArray(imovel?.fotos_para_site)];
  return values.map(publicPhoto).filter((url) => url && !seen.has(url) && seen.add(url)).slice(0, 16);
}
function slugify(value) { return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-'); }
function propertySlug(imovel) {
  const stored = String(imovel?.slug || '').trim().replace(/^\/+|\/+$/g, '');
  if (stored) return stored;
  const base = slugify(imovel?.titulo || imovel?.tipo || 'imovel');
  const code = slugify(imovel?.codigo || imovel?.ref || '');
  return code && !base.endsWith(code) ? `${base}-${code}` : base || slugify(imovel?.id) || 'imovel';
}
function propertyUrl(siteSlug, imovel) { return `${BASE}/corretor/${encodeURIComponent(siteSlug)}/imovel/${encodeURIComponent(propertySlug(imovel))}/`; }
function money(value) {
  if (value === null || value === undefined || value === '') return 'Consulte o valor';
  if (typeof value === 'string' && /r\$|€|\$/i.test(value)) return value;
  const n = Number(String(value).replace(/[^0-9,.-]/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) : 'Consulte o valor';
}
function cleanDescription(value) {
  return String(value || '').replace(/\b(?:quadra|lote|box|unidade|apartamento|torre|casa)\s*(?:n[ºo°.]?\s*)?[a-z0-9-]+/gi, '').replace(/\s{2,}/g, ' ').trim();
}
async function getJson(path) {
  try { const response = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: HEADERS }); return response.ok ? await response.json() : []; } catch (_) { return []; }
}
function notFound() { return new Response('<!doctype html><meta charset="utf-8"><title>Imóvel não encontrado</title><meta name="robots" content="noindex"><style>body{font-family:Arial;padding:48px;max-width:700px;margin:auto;color:#0d3b54}a{color:#0d5c86;font-weight:bold}</style><h1>Imóvel não encontrado</h1><p>Este imóvel pode ter sido removido ou não está publicado neste site parceiro.</p><a href="/">Voltar</a>', { status: 404, headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex' } }); }

function page({ site, imovel, cond, siteSlug }) {
  const title = imovel.titulo || 'Imóvel à venda';
  const city = imovel.cidade_end || imovel.cidade || cond?.cidade || 'Rio Grande do Sul';
  const location = [imovel.bairro_end || imovel.bairro, city].filter(Boolean).join(' · ');
  const photos = photosOf(imovel);
  const heroImage = photos[0] || `${BASE}/img/og-home.jpg`;
  const description = cleanDescription(imovel.descricao) || `${imovel.tipo || 'Imóvel'} disponível para compra em ${city}.`;
  const broker = imovel.corretor || site.nome || 'Corretor parceiro';
  const phone = digits(site.whatsapp || site.telefone);
  const wppBase = phone ? `https://wa.me/${phone}` : `${BASE}/contato/`;
  const wppText = encodeURIComponent(`Olá! Tenho interesse no imóvel ${title}${cond?.nome ? ` no ${cond.nome}` : ''}. ${imovel.codigo ? `Código: ${imovel.codigo}.` : ''}`);
  const canonical = propertyUrl(siteSlug, imovel);
  const imageMarkup = photos.length ? photos.map((photo, index) => `<figure class="photo-slide"><img src="${esc(photo)}" alt="${esc(title)} — foto ${index + 1}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async"${index === 0 ? ' fetchpriority="high"' : ''}></figure>`).join('') : '<div class="photo-empty">Imagem em atualização</div>';
  const facts = [['Tipo', imovel.tipo], ['Quartos', imovel.quartos], ['Suítes', imovel.suites], ['Banheiros', imovel.banheiros], ['Vagas', imovel.vagas], ['Área', imovel.area || imovel.area_privativa || imovel.area_construida ? `${imovel.area || imovel.area_privativa || imovel.area_construida} m²` : '']].filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '');
  const extras = [['Bairro', imovel.bairro_end || imovel.bairro], ['Referência', imovel.codigo || imovel.ref], ['Condomínio', cond?.nome], ['Localização', imovel.fora_condominio ? 'Fora de condomínio' : cond?.nome ? 'Em condomínio' : 'Rio Grande do Sul']].filter(([, value]) => value);
  const differences = toArray(imovel.diferenciais).map((item) => String(item).trim()).filter(Boolean).slice(0, 20);
  const condoPhotos = [...toArray(cond?.fotos_no_site), ...toArray(cond?.fotos)].map(publicPhoto).filter(Boolean).slice(0, 8);
  const schema = { '@context': 'https://schema.org', '@type': 'RealEstateListing', name: title, description, url: canonical, image: photos.slice(0, 8), itemOffered: { '@type': /apartamento/i.test(imovel.tipo || '') ? 'Apartment' : 'Residence', name: title, address: { '@type': 'PostalAddress', addressLocality: city, addressRegion: 'RS', addressCountry: 'BR' } }, seller: { '@type': 'RealEstateAgent', name: broker, telephone: phone ? `+${phone}` : undefined } };
  if (Number(imovel.preco) > 0) schema.offers = { '@type': 'Offer', price: Number(imovel.preco), priceCurrency: 'BRL', availability: 'https://schema.org/InStock', url: canonical };
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}${city ? ` | ${esc(city)}` : ''} | ${esc(site.nome || 'Corretor parceiro')}</title><meta name="description" content="${esc(description.slice(0, 155))}"><meta name="robots" content="index,follow"><link rel="canonical" href="${canonical}"><meta property="og:type" content="product"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description.slice(0, 155))}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${esc(heroImage)}"><script type="application/ld+json">${jsonSafe(JSON.stringify(schema))}</script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet"><style>
:root{--brand:#0d5c86;--accent:#d5aa57;--ink:#0d3b54;--muted:#5b7585;--sand:#faf6ef;--line:#e7ded0}*{box-sizing:border-box}body{margin:0;background:var(--sand);color:var(--ink);font-family:Outfit,Arial,sans-serif}a{text-decoration:none;color:inherit}.header{position:sticky;top:0;z-index:10;background:rgba(250,246,239,.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(13,59,84,.12)}.nav{width:min(1180px,100%);margin:auto;padding:13px 22px;display:flex;align-items:center;justify-content:space-between;gap:14px}.brand{font-weight:700;color:var(--brand)}.nav-cta,.wpp{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;background:#25d366;color:#fff;padding:11px 16px;font-weight:700;font-size:13px}.wrap{width:min(1180px,100%);margin:auto;padding:24px}.crumb{color:var(--muted);font-size:12px;margin-bottom:16px}.crumb a{color:var(--brand)}.photo-gallery{display:grid;grid-template-columns:2fr 1fr;grid-auto-rows:230px;gap:8px;overflow:hidden;border-radius:22px;background:#dce9ea;box-shadow:0 18px 40px rgba(13,59,84,.12)}.photo-slide{margin:0;overflow:hidden}.photo-slide:first-child{grid-row:span 2}.photo-slide img{width:100%;height:100%;object-fit:cover;display:block}.photo-empty{display:grid;place-items:center;min-height:360px;color:var(--muted)}.hero-info{padding:34px 0 22px}.eyebrow{color:var(--accent);font-weight:700;font-size:10px;letter-spacing:.18em;text-transform:uppercase}.hero-info h1{font:600 clamp(32px,5vw,58px)/1.02 Fraunces,serif;letter-spacing:-.035em;margin:10px 0}.location{color:var(--muted);font-size:14px}.content-grid{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:30px;align-items:start}.main-card,.side-card,.condo{background:#fff;border:1px solid var(--line);border-radius:20px;padding:26px;box-shadow:0 12px 30px rgba(13,59,84,.06)}.main-card h2,.condo h2{font:600 30px/1.08 Fraunces,serif;margin:0 0 14px}.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:14px;overflow:hidden;margin:20px 0 28px}.fact{background:#fff;padding:14px}.fact small{display:block;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.1em}.fact strong{display:block;color:var(--brand);font-size:17px;margin-top:4px}.description{font-size:16px;line-height:1.8;color:#38525e;white-space:pre-line}.details{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px}.detail{border:1px solid var(--line);border-radius:11px;padding:11px;background:#fbfdfd}.detail small{display:block;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.08em}.detail strong{display:block;margin-top:3px;font-size:14px}.side-card{position:sticky;top:82px}.price-label{color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.12em}.price{font:600 35px/1.1 Fraunces,serif;color:var(--brand);margin:7px 0 18px}.wpp{width:100%;font-size:15px;padding:14px}.contact-link{display:block;text-align:center;color:var(--brand);font-size:13px;font-weight:700;margin-top:12px}.broker{display:flex;align-items:center;gap:11px;border-top:1px solid var(--line);margin-top:20px;padding-top:18px}.broker-avatar{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--brand);color:#fff;font:600 15px Fraunces,serif}.broker strong{display:block;font-size:14px}.broker small{display:block;color:var(--muted);font-size:11px;margin-top:3px}.condo{margin-top:30px}.condo-meta{color:var(--muted);font-size:14px}.amenities{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.amenity{border:1px solid var(--line);border-radius:999px;padding:7px 11px;color:var(--brand);font-size:12px}.condo-gallery{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:18px}.condo-gallery img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:11px}.differences{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}.difference{background:#eef7f7;border-radius:999px;padding:7px 11px;color:var(--brand);font-size:12px}.floating{position:fixed;right:18px;bottom:18px;z-index:40}.footer{margin-top:64px;background:#092f47;color:#fff;padding:34px 24px 18px}.footer-inner{width:min(1180px,100%);margin:auto;display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap}.footer small{color:rgba(255,255,255,.68);line-height:1.6}.footer a{color:#fff}.notice{margin-top:24px;padding:16px;border-left:3px solid var(--accent);background:#fff7e8;color:#705b32;font-size:13px;line-height:1.6}@media(max-width:850px){.wrap{padding:18px}.photo-gallery{grid-template-columns:1fr 1fr;grid-auto-rows:34vw}.photo-slide:first-child{grid-column:span 2;grid-row:span 1}.content-grid{grid-template-columns:1fr}.side-card{position:static}.main-card,.side-card,.condo{padding:20px}.facts{grid-template-columns:repeat(2,1fr)}.condo-gallery{grid-template-columns:repeat(2,1fr)}}@media(max-width:520px){.nav{padding:11px 16px}.nav-cta{padding:9px 12px}.hero-info h1{font-size:32px}.facts{margin-top:16px}.fact{padding:11px 9px}.fact strong{font-size:15px}.details{grid-template-columns:1fr}.photo-gallery{border-radius:0;margin-left:-18px;margin-right:-18px}.floating{right:14px;bottom:16px}.floating span{display:none}}
</style></head><body><header class="header"><nav class="nav"><a class="brand" href="${BASE}/corretor/${encodeURIComponent(siteSlug)}/">${esc(site.nome || 'Corretor parceiro')}</a><a class="nav-cta" href="${esc(wppBase)}?text=${wppText}" target="_blank" rel="noopener nofollow">WhatsApp</a></nav></header><main class="wrap"><nav class="crumb" aria-label="Breadcrumb"><a href="${BASE}/">Início</a> › <a href="${BASE}/corretor/${encodeURIComponent(siteSlug)}/">${esc(site.nome || 'Corretor')}</a> › <span>${esc(title)}</span></nav><section class="photo-gallery" aria-label="Galeria de ${esc(title)}">${imageMarkup}</section><section class="hero-info"><span class="eyebrow">${esc(imovel.tipo || 'Imóvel')} ${imovel.codigo ? `· Cód. ${esc(imovel.codigo)}` : ''}</span><h1>${esc(title)}</h1><div class="location">📍 ${esc(location)}</div></section><div class="content-grid"><article class="main-card"><h2>Informações do imóvel</h2><div class="facts">${facts.map(([label, value]) => `<div class="fact"><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`).join('')}</div><h2>Sobre este imóvel</h2><p class="description">${esc(description)}</p>${extras.length ? `<div class="details">${extras.map(([label, value]) => `<div class="detail"><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`).join('')}</div>` : ''}${differences.length ? `<h2 style="margin-top:30px">Diferenciais</h2><div class="differences">${differences.map((item) => `<span class="difference">${esc(item)}</span>`).join('')}</div>` : ''}</article><aside class="side-card"><div class="price-label">Valor anunciado</div><div class="price">${esc(money(imovel.preco))}</div><a class="wpp" href="${esc(wppBase)}?text=${wppText}" target="_blank" rel="noopener nofollow">Falar sobre este imóvel</a><a class="contact-link" href="${BASE}/corretor/${encodeURIComponent(siteSlug)}/#contato">Enviar mensagem pelo formulário</a><div class="broker"><div class="broker-avatar">${esc(broker.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase())}</div><div><strong>${esc(broker)}</strong><small>${esc(site.creci ? `CRECI ${site.creci}` : 'Corretor parceiro')} · Atendimento no Rio Grande do Sul</small></div></div></aside></div>${cond?.nome ? `<section class="condo"><h2>Informações do condomínio</h2><p class="condo-meta"><strong>${esc(cond.nome)}</strong>${cond.cidade ? ` · ${esc(cond.cidade)}` : ''}</p>${cond.descricao ? `<p class="description">${esc(cleanDescription(cond.descricao))}</p>` : ''}${Array.isArray(cond.amenidades) && cond.amenidades.length ? `<div class="amenities">${cond.amenidades.map((item) => `<span class="amenity">✓ ${esc(item)}</span>`).join('')}</div>` : ''}${condoPhotos.length ? `<div class="condo-gallery">${condoPhotos.map((photo, index) => `<img src="${esc(photo)}" alt="${esc(cond.nome)} — infraestrutura ${index + 1}" loading="lazy" decoding="async">`).join('')}</div>` : ''}<div class="notice">As informações públicas do condomínio e do imóvel são apresentadas conforme o cadastro autorizado no catálogo. Confirme disponibilidade, condições e características com o corretor.</div></section>` : ''}</main><a class="wpp floating" href="${esc(wppBase)}?text=${wppText}" target="_blank" rel="noopener nofollow" aria-label="Falar sobre ${esc(title)} pelo WhatsApp"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.9c0 2.1.5 4.1 1.6 5.9L.2 24l6.4-1.7a11.9 11.9 0 0 0 5.5 1.4h.1c6.5 0 11.8-5.3 11.8-11.9 0-3.1-1.3-6.1-3.5-8.3Zm-8.4 18.2h-.1a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 0 1-1.5-5.2c0-5.4 4.4-9.9 9.9-9.9a9.8 9.8 0 0 1 7 2.9 9.9 9.9 0 0 1 2.9 7c0 5.4-4.4 9.9-9.8 9.9Z"/></svg><span>WhatsApp</span></a><footer class="footer"><div class="footer-inner"><small>© 2026 ${esc(site.nome || 'Corretor parceiro')} · Site parceiro Condomínios na Praia</small><small><a href="${BASE}/politica-privacidade/">Política de Privacidade</a> · <a href="${BASE}/termos/">Termos de Uso</a></small></div></footer></body></html>`;
}

export async function onRequest(context) {
  const siteSlug = String(context.params?.slug || '').toLowerCase();
  const imovelRef = String(context.params?.imovelSlug || '').toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(siteSlug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(imovelRef)) return notFound();
  const requestPath = new URL(context.request.url).pathname;
  if (requestPath.startsWith('/parceiro/')) return Response.redirect(`${BASE}/corretor/${encodeURIComponent(siteSlug)}/imovel/${encodeURIComponent(imovelRef)}/`, 301);
  const sites = await getJson(`parceiros_sites?slug=eq.${encodeURIComponent(siteSlug)}&status=eq.active&select=id,slug,nome,creci,telefone,whatsapp,email,cidade,bio,logo_url,capa_url&limit=1`);
  if (!sites[0]) return notFound();
  const site = sites[0];
  const rows = await getJson(`parceiros_sites_imoveis?site_id=eq.${encodeURIComponent(site.id)}&publicado=eq.true&select=id,ordem,destaque,titulo_personalizado,chamada_personalizada,imovel:imoveis(id,slug,codigo,ref,titulo,tipo,cidade_end,bairro,bairro_end,fora_condominio,cond_id,preco,quartos,suites,banheiros,vagas,area,area_privativa,area_construida,corretor,descricao,diferenciais,fotos_no_site,fotos_para_site,status,publicar)&order=destaque.desc,ordem.asc&limit=1000`);
  const row = (Array.isArray(rows) ? rows : []).find((candidate) => {
    const im = candidate.imovel || {};
    return im.publicar !== false && String(im.status || '').toLowerCase() !== 'vendido' && [im.slug, im.id, im.codigo, im.ref, propertySlug(im)].filter(Boolean).map((value) => String(value).toLowerCase()).includes(imovelRef);
  });
  if (!row?.imovel) return notFound();
  const imovel = { ...row.imovel, titulo: row.titulo_personalizado || row.imovel.titulo, descricao: row.chamada_personalizada || row.imovel.descricao };
  let cond = null;
  if (imovel.cond_id) {
    const condos = await getJson(`condominios?id=eq.${encodeURIComponent(imovel.cond_id)}&select=id,slug,nome,cidade,descricao,amenidades,fotos_no_site,fotos&limit=1`);
    cond = Array.isArray(condos) ? condos[0] || null : null;
  }
  return new Response(page({ site, imovel, cond, siteSlug }), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600' } });
}

export { propertySlug, propertyUrl };
