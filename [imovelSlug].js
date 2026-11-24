const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDUzMzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const BASE = 'https://condominiosnapraia.com.br';
const STORAGE = `${SB_URL}/storage/v1/object/public/`;
const HEADERS = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` };
const SITE_SLUG_ALIASES = Object.freeze({ 'fernando-trevisol': 'fernando-trvisol' });
function siteSlugInfo(value) { const requested = String(value || '').toLowerCase(); const dbSlug = SITE_SLUG_ALIASES[requested] || requested; const publicSlug = Object.entries(SITE_SLUG_ALIASES).find(([, alias]) => alias === requested)?.[0] || requested; return { requested, dbSlug, publicSlug }; }

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
  const values = [...toArray(imovel?.fotos_no_site), ...toArray(imovel?.fotos), ...toArray(imovel?.fotos_para_site)];
  return values.map(publicPhoto).filter((url) => url && !seen.has(url) && seen.add(url)).slice(0, 60);
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
  return String(value || '')
    .replace(/\r\n?/g, '\n')
    .replace(/\b(?:quadra|lote|box|unidade|apartamento|torre|casa)\s*(?:n[ºo°.]?\s*)?[a-z0-9-]+/gi, '')
    .split('\n')
    .map((line) => line.replace(/[ \t]{2,}/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
function normalized(value) { return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
const CITY_NAMES = ['Xangri-Lá', 'Capão da Canoa', 'Atlântida', 'Tramandaí', 'Torres', 'Imbé', 'Cidreira', 'Balneário Pinhal', 'Osório', 'Porto Alegre', 'Canoas', 'Gramado', 'Canela'];
function inferContext(item) {
  const text = String(item?.title || item?.titulo || '') + ' ' + String(item?.description || item?.descricao || '');
  const city = CITY_NAMES.find((name) => text.toLowerCase().includes(name.toLowerCase())) || '';
  const typeMatch = text.match(/\b(apartamento|sobrado|casa|terreno|lote|loja|sala)\b/i);
  const type = typeMatch ? typeMatch[1] : 'Imóvel';
  const condoMatch = text.match(/\b(?:no|na|em)\s+([^—,\\n]+?)(?:\s+—|\s*,|\s+(?:XANGRI-LÁ|CAPÃO DA CANOA|ATLÂNTIDA|TRAMANDAÍ|TORRES|IMBÉ|CIDREIRA|OSÓRIO)|$)/i);
  const condo = condoMatch ? condoMatch[1].replace(/^[^a-záàâãéêíóôõúç]+/i, '').replace(/\s+/g, ' ').trim() : '';
  return { city, type, condo };
}
function propertyFamily(item) {
  const context = inferContext(item);
  const directType = normalized(item?.tipo);
  const type = directType && !/^(imovel|imóvel|disponivel|disponível)$/.test(directType) ? directType : normalized(context.type || item?.title || item?.titulo);
  if (/terreno|lote/.test(type)) return 'terreno';
  if (/apart|cobertura|loft|kitnet|flat|studio/.test(type)) return 'apartamento';
  if (/loja|sala|comercial|ponto|conjunto/.test(type)) return 'comercial';
  if (/casa|sobrado|chale|chalé/.test(type)) return 'casa';
  return type || 'imovel';
}
function numericValue(value) {
  const number = Number(String(value ?? '').replace(/[^0-9,.-]/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.'));
  return Number.isFinite(number) && number > 0 ? number : null;
}
function bedroomValue(item) {
  const number = numericValue(item?.quartos || item?.bedrooms);
  return number === null ? null : Math.round(number);
}
function isPublishedRow(row) { const im = row?.imovel || {}; return Boolean(im.id) && im.publicar !== false && String(im.status || '').toLowerCase() !== 'vendido'; }
async function getJson(path) {
  try { const response = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: HEADERS }); return response.ok ? await response.json() : []; } catch (_) { return []; }
}
async function getPartnerFeed(publicSlug) {
  try {
    const response = await fetch(`${BASE}/parceiro-feed/${encodeURIComponent(publicSlug)}`, { headers: { accept: 'application/json' } });
    return response.ok ? await response.json() : null;
  } catch (_) { return null; }
}
function notFound() { return new Response('<!doctype html><meta charset="utf-8"><title>Imóvel não encontrado</title><meta name="robots" content="noindex"><style>body{font-family:Arial;padding:48px;max-width:700px;margin:auto;color:#0d3b54}a{color:#0d5c86;font-weight:bold}</style><h1>Imóvel não encontrado</h1><p>Este imóvel pode ter sido removido ou não está publicado neste site parceiro.</p><a href="/">Voltar</a>', { status: 404, headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex' } }); }

function relatedCard(item, contextLabel = '') {
  const imovel = item.imovel || item;
  const title = item.titulo_personalizado || imovel.titulo || 'Imóvel disponível';
  const context = inferContext(imovel);
  const photo = photosOf(imovel)[0];
  const city = imovel.cidade_end || imovel.cidade || context.city || '';
  const displayType = imovel.tipo && !/^(imovel|imóvel|disponivel|disponível)$/i.test(String(imovel.tipo)) ? imovel.tipo : context.type;
  const location = [imovel.bairro_end || imovel.bairro, city].filter(Boolean).join(' · ');
  const code = imovel.codigo || imovel.ref || '';
  const details = [imovel.quartos && `${imovel.quartos} ${Number(imovel.quartos) === 1 ? 'quarto' : 'quartos'}`, imovel.suites && `${imovel.suites} ${Number(imovel.suites) === 1 ? 'suíte' : 'suítes'}`, imovel.area && `${imovel.area} m²`].filter(Boolean).join(' · ');
  return `<article class="related-card"><a class="related-photo-link" href="${esc(item.url)}" aria-label="Ver ${esc(title)}"><div class="related-photo">${photo ? `<img src="${esc(photo)}" alt="${esc(title)}" loading="lazy" decoding="async">` : '<div class="related-photo-empty">Imagem em atualização</div>'}</div></a><div class="related-body"><span class="related-type">${esc(displayType || 'Imóvel')}</span><h3><a href="${esc(item.url)}">${esc(title)}</a></h3><p>${esc(location || 'Rio Grande do Sul')}</p>${details ? `<p>${esc(details)}</p>` : ''}${code ? `<p class="related-code">Cód. ${esc(code)}</p>` : ''}${contextLabel ? `<p class="related-context">${esc(contextLabel)}</p>` : ''}<strong>${esc(money(imovel.preco))}</strong><a class="related-button" href="${esc(item.url)}">Ver imóvel</a></div></article>`;
}
function relatedSection(title, subtitle, items, contextLabel = '') {
  if (!items.length) return '';
  return `<section class="related-section"><div class="related-head"><div><span class="eyebrow">Mais oportunidades</span><h2>${esc(title)}</h2><p>${esc(subtitle)}</p></div><span class="related-count">${items.length} ${items.length === 1 ? 'opção' : 'opções'}</span></div><div class="related-grid">${items.map((item) => relatedCard(item, contextLabel)).join('')}</div></section>`;
}
function selectRelated(rows, target, cond, siteSlug) {
  const targetContext = inferContext(target);
  const targetFamily = propertyFamily(target);
  const targetCity = normalized(target.cidade_end || target.cidade || cond?.cidade || targetContext.city);
  const targetRooms = bedroomValue(target);
  const targetPrice = numericValue(target.preco);
  const targetCondoId = String(cond?.id || target.cond_id || '').trim();
  const targetCondo = normalized(cond?.nome || target.cond?.name || target._derivedCondo || targetContext.condo);
  const candidates = (Array.isArray(rows) ? rows : []).filter(isPublishedRow).filter((row) => String(row.imovel.id) !== String(target.id)).map((row) => ({ ...row, context: inferContext(row.imovel), family: propertyFamily(row.imovel), url: propertyUrl(siteSlug, row.imovel) }));
  const contextCity = (im, context) => normalized(im.cidade_end || im.cidade || context.city);
  const contextCondo = (im, context) => normalized(im.cond_id || im.cond?.name || context.condo);
  const scoreFor = (row) => {
    const im = row.imovel;
    if (row.family !== targetFamily) return -Infinity;
    let score = 0;
    const city = contextCity(im, row.context);
    const condo = contextCondo(im, row.context);
    if (targetCondo && condo && condo === targetCondo) score += 80;
    if (targetCity && city && city === targetCity) score += 40;
    const rooms = bedroomValue(im);
    if (targetRooms !== null && rooms !== null) {
      const difference = Math.abs(rooms - targetRooms);
      score += difference === 0 ? 28 : difference === 1 ? 14 : difference === 2 ? 3 : -18;
    }
    const price = numericValue(im.preco);
    if (targetPrice !== null && price !== null) {
      const distance = Math.abs(price - targetPrice) / Math.max(targetPrice, 1);
      score += distance <= .1 ? 28 : distance <= .2 ? 18 : distance <= .35 ? 8 : distance <= .55 ? 0 : -18;
    }
    return score;
  };
  const ranked = candidates.map((row) => ({ ...row, score: scoreFor(row) })).filter((row) => Number.isFinite(row.score)).sort((a, b) => b.score - a.score || Math.abs((numericValue(a.imovel.preco) || 0) - (targetPrice || 0)) - Math.abs((numericValue(b.imovel.preco) || 0) - (targetPrice || 0)));
  const selected = new Set();
  const take = (predicate, limit) => ranked.filter((row) => !selected.has(String(row.imovel.id)) && predicate(row)).slice(0, limit).map((row) => { selected.add(String(row.imovel.id)); return row; });
  const sameCondo = targetCondoId ? take((row) => String(row.imovel.cond_id || '').trim() === targetCondoId, 4) : (targetCondo ? take((row) => contextCondo(row.imovel, row.context) === targetCondo, 4) : []);
  const sameCity = targetCity ? take((row) => contextCity(row.imovel, row.context) === targetCity && row.score >= 30, 4) : [];
  const similar = take((row) => row.score >= 20, 4);
  return { sameCondo, similar, sameCity, targetContext };
}

function page({ site, imovel, cond, siteSlug, relatedRows }) {
  const title = imovel.titulo || 'Imóvel à venda';
  const context = inferContext(imovel);
  const condoName = cond?.nome || context.condo || '';
  const city = imovel.cidade_end || imovel.cidade || cond?.cidade || context.city || 'Rio Grande do Sul';
  const location = [imovel.bairro_end || imovel.bairro, city].filter(Boolean).join(' · ');
  const photos = photosOf(imovel);
  const openPhotos = photos;
  const totalPhotoCount = photos.length;
  const hiddenPhotoCount = 0;
  const heroImage = photos[0] || `${BASE}/img/og-home.jpg`;
  const description = cleanDescription(imovel.descricao) || `${imovel.tipo || 'Imóvel'} disponível para compra em ${city}.`;
  const broker = imovel.corretor || site.nome || 'Corretor parceiro';
  const phone = digits(site.whatsapp || site.telefone);
  const wppBase = phone ? `https://wa.me/${phone}` : `${BASE}/contato/`;
  const codeLabel = imovel.codigo || imovel.ref || '';
  const wppText = encodeURIComponent(`Olá! Gostaria de receber mais informações sobre este imóvel.\n\nCódigo: ${codeLabel || 'Não informado'}\nImóvel: ${title}${condoName ? `\nCondomínio: ${condoName}` : ''}\nPreço: ${money(imovel.preco)}.\n\nPodem me informar a disponibilidade, as condições e as opções para agendar uma visita?`);
  const canonical = propertyUrl(siteSlug, imovel);
  const contactUrl = `${BASE}/corretor/${encodeURIComponent(siteSlug)}/contato/`;
  const landingUrl = `${BASE}/corretor/${encodeURIComponent(siteSlug)}/`;
  const fullListingUrl = `${landingUrl}imoveis/`;
  const condoBackUrl = cond?.slug ? `${BASE}/${encodeURIComponent(String(cond.slug).replace(/^\/+|\/+$/g, ''))}/` : '';
  const backHref = condoBackUrl || fullListingUrl;
  const backLabel = condoBackUrl ? `← Voltar ao ${condoName}` : '← Voltar aos imóveis';
  const typeLabel = imovel.tipo && !/^(imovel|imóvel|disponivel|disponível)$/i.test(String(imovel.tipo)) ? imovel.tipo : (context.type || 'Imóvel');
  const statusLabel = imovel.status || 'Disponível';
  const imageMarkup = openPhotos.length ? openPhotos.map((photo, index) => `<figure class="photo-slide${index === 0 ? ' is-active' : ''}" data-gallery-index="${index}" data-lightbox="${esc(photo)}" tabindex="0" role="button" aria-label="Ampliar foto ${index + 1}"><img src="${esc(photo)}" alt="${esc(title)} — foto ${index + 1}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async"${index === 0 ? ' fetchpriority="high"' : ''}><span class="photo-number">${index + 1}</span></figure>`).join('') : '<div class="photo-empty">Imagem em atualização</div>';
  const galleryGate = hiddenPhotoCount ? `<div class="gallery-gate" data-gallery-lock="property"><div><strong>+${hiddenPhotoCount} fotos disponíveis</strong><span>Faça login para acessar a galeria completa deste imóvel.</span></div><button type="button" class="unlock-button" data-gallery-auth>Fazer login para ver mais</button></div>` : '';
  const galleryControls = openPhotos.length > 1 ? '<button type="button" class="gallery-arrow gallery-prev" data-gallery-prev aria-label="Foto anterior">‹</button><button type="button" class="gallery-arrow gallery-next" data-gallery-next aria-label="Próxima foto">›</button>' : '';
  const galleryCounter = totalPhotoCount > 1 ? `<span class="gallery-counter" data-gallery-counter data-total="${totalPhotoCount}" data-hidden="${hiddenPhotoCount}">1/${totalPhotoCount}${hiddenPhotoCount ? ` · +${hiddenPhotoCount} bloqueadas` : ''}</span>` : '';
  const facts = [['◈', 'Área total', imovel.area || imovel.area_privativa || imovel.area_construida ? `${imovel.area || imovel.area_privativa || imovel.area_construida} m²` : ''], ['⌂', 'Quartos', imovel.quartos], ['◇', 'Suítes', imovel.suites], ['◌', 'Banheiros', imovel.banheiros], ['□', 'Vagas', imovel.vagas]].filter(([, , value]) => value !== null && value !== undefined && String(value).trim() !== '');
  const extras = [['Bairro', imovel.bairro_end || imovel.bairro], ['Código', imovel.codigo || imovel.ref], ['Condomínio', condoName], ['Localização', imovel.fora_condominio ? 'Fora de condomínio' : condoName ? 'Em condomínio' : city]].filter(([, value]) => value);
  const differences = toArray(imovel.diferenciais).map((item) => String(item).trim()).filter(Boolean).slice(0, 20);
  const condoAllPhotos = [...toArray(cond?.fotos_no_site), ...toArray(cond?.fotos)].map(publicPhoto).filter(Boolean);
  const condoPhotos = condoAllPhotos;
  const hiddenCondoPhotoCount = 0;
  const condoGalleryMarkup = condoPhotos.length ? `<div class="condo-gallery" id="condo-gallery">${condoPhotos.map((photo, index) => `<img src="${esc(photo)}" alt="${esc(cond?.nome || 'Empreendimento')} — infraestrutura ${index + 1}" loading="lazy" decoding="async">`).join('')}${hiddenCondoPhotoCount ? `<div class="gallery-gate condo-gate" data-gallery-lock="condo"><div><strong>+${hiddenCondoPhotoCount} fotos do empreendimento</strong><span>Faça login para ver a galeria completa.</span></div><button type="button" class="unlock-button" data-gallery-auth>Fazer login para ver mais</button></div>` : ''}</div>` : '';
  const related = selectRelated(relatedRows, { ...imovel, _derivedCondo: context.condo, _derivedCity: context.city, _derivedType: context.type }, cond, siteSlug);
  const relatedMarkup = (condoName ? relatedSection(`Mais imóveis no ${condoName}`, 'Opções da mesma tipologia dentro deste condomínio ou empreendimento.', related.sameCondo, condoName) : '') + relatedSection('Imóveis semelhantes', 'Mesma tipologia, com dormitórios e valores próximos ao imóvel consultado.', related.similar) + relatedSection(`Imóveis em ${city}`, 'Outras oportunidades da mesma tipologia na mesma cidade.', related.sameCity, city);
  const schema = { '@context': 'https://schema.org', '@type': 'RealEstateListing', name: title, description, url: canonical, image: photos.slice(0, 8), itemOffered: { '@type': /apartamento/i.test(imovel.tipo || '') ? 'Apartment' : 'Residence', name: title, address: { '@type': 'PostalAddress', addressLocality: city, addressRegion: 'RS', addressCountry: 'BR' } }, seller: { '@type': 'RealEstateAgent', name: broker, telephone: phone ? `+${phone}` : undefined } };
  const footerMarkup = `<footer class="page-footer" aria-label="Rodapé Condomínios na Praia"><div class="ftr-wave"><svg viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0,30 C240,60 480,0 720,20 C960,40 1200,55 1440,25 L1440,60 L0,60 Z" fill="#0c4a6e"></path></svg></div><div class="ftr-main"><div class="ftr-col ftr-col-brand"><div class="ftr-logo ftr-brand-lockup" role="img" aria-label="Condomínios na Praia — Viva o melhor do litoral"><div class="hero-brand-kicker ftr-brand-kicker"><span class="hero-brand-line"></span><span>PORTAL</span><span class="hero-brand-line"></span></div><div class="hero-brand-name">Condomínios na Praia</div><div class="hero-brand-underline" aria-hidden="true"></div><div class="hero-brand-tagline">Alto padrão no Litoral Norte Gaúcho</div></div><a class="ftr-wpp" href="${esc(wppBase)}?text=${wppText}" target="_blank" rel="nofollow"><svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 24 24" width="16"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 0 1 12 4z"></path></svg> Falar no WhatsApp</a></div><div class="ftr-col"><div class="ftr-tit">Navegar</div><div class="ftr-links-grid"><a href="/condominios/">Condomínios</a><a href="/imoveis/">Imóveis</a><a href="/condominios/">Lançamentos</a><a href="/contemplado-imoveis/">Crédito Contemplado</a><a href="/financiamento-imobiliario/">Financiamento</a><a href="/seguro-fianca/">Seguro Fiança</a><a href="/refinanciamento-imobiliario/">Refinanciamento</a><a href="/exclusividade-imobiliaria/">Venda seu Imóvel</a><a href="/contato/">Contato</a><a href="/sobre/">Sobre</a><a href="/politica-privacidade/">Política de Privacidade</a><a href="/termos/">Termos de Uso</a></div></div><div class="ftr-col"><div class="ftr-tit">Descobrir</div><div class="ftr-links-grid"><a href="/#guias-cidades">Cidades</a><a href="/turismo/">Turismo no Litoral</a><a href="/turismo/">Onde Ir</a><a href="/blog/">Blog &amp; Notícias</a></div></div><div class="ftr-col"><div class="ftr-tit">Cidades</div><div class="ftr-links-grid"><a href="/xangri-la/">Xangri-lá</a><a href="/capao-da-canoa/">Capão da Canoa</a><a href="/osorio/">Osório</a><a href="/maquine/">Maquiné</a><a href="/xangri-la-atlantida/">Atlântida</a><a href="/capao-da-canoa-curumim/">Curumim</a></div></div></div><div class="ftr-bottom"><span>© 2025 Condomínios na Praia · Todos os direitos reservados</span><span class="ftr-bottom-r">Litoral Norte Gaúcho · RS</span></div></footer><nav class="mob-footer-nav" id="mob-footer-nav" aria-label="Navegação rápida"><div class="mob-footer-items"><a class="mob-footer-btn" href="/"><span class="mob-footer-ico">🏠</span><span class="mob-footer-lbl">Início</span></a><a class="mob-footer-btn" href="/imoveis/"><span class="mob-footer-ico">🔍</span><span class="mob-footer-lbl">Pesquisa</span></a><a class="mob-footer-btn" href="/imoveis/"><span class="mob-footer-ico">🏘️</span><span class="mob-footer-lbl">Imóveis</span></a><a class="mob-footer-btn" href="/condominios/"><span class="mob-footer-ico">🏖️</span><span class="mob-footer-lbl">Condomínios</span></a><a class="mob-footer-btn wpp-btn" href="${esc(wppBase)}" rel="nofollow"><span class="mob-footer-ico"><svg height="28" viewBox="0 0 24 24" width="28" aria-hidden="true"><circle cx="12" cy="12" fill="#25D366" r="12"></circle><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.05-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.358 1.884.836 2.114.67 2.49.628.378-.04 1.218-.496 1.39-.976.173-.48.173-.892.124-.976-.05-.084-.173-.133-.372-.232z" fill="#fff"></path></svg></span><span class="mob-footer-lbl">WhatsApp</span></a></div></nav>`;
  if (Number(imovel.preco) > 0) schema.offers = { '@type': 'Offer', price: Number(imovel.preco), priceCurrency: 'BRL', availability: 'https://schema.org/InStock', url: canonical };
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}${city ? ` | ${esc(city)}` : ''} | ${esc(site.nome || 'Corretor parceiro')}</title><meta name="description" content="${esc(description.slice(0, 155))}"><meta name="robots" content="index,follow"><link rel="canonical" href="${canonical}"><meta property="og:type" content="product"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description.slice(0, 155))}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${esc(heroImage)}"><script type="application/ld+json">${jsonSafe(JSON.stringify(schema))}</script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="${BASE}/css/portal-footer.css?v=20261123-desktop-footer-9-7"><style>
.description{white-space:pre-wrap;overflow-wrap:anywhere}.condo-summary{white-space:pre-wrap;overflow-wrap:anywhere}
.page-footer{position:relative;background:linear-gradient(160deg,#0c4a6e,#0e7490);color:#fff;margin-top:70px;padding:0;font-family:Outfit,Arial,sans-serif;overflow:visible}.page-footer .ftr-wave{position:absolute;z-index:0;top:0;left:0;right:0;height:56px;line-height:0;transform:translateY(-99%);pointer-events:none}.page-footer .ftr-wave svg{display:block;width:100%;height:100%}.page-footer .ftr-main{position:relative;z-index:1;width:min(1140px,100%);margin:0 auto;padding:56px 44px 36px;display:grid;grid-template-columns:minmax(280px,1.45fr) repeat(3,minmax(0,1fr));gap:48px;align-items:start}.page-footer .ftr-col{min-width:0;text-align:left}.page-footer .ftr-logo{display:flex;flex-direction:column;align-items:flex-start;width:max-content;max-width:100%;margin:0 0 18px;color:#fff;line-height:1}.page-footer .hero-brand-kicker{display:flex;align-items:center;gap:10px;font-size:10px;letter-spacing:.3em;color:#f3e3bb}.page-footer .hero-brand-line{display:block;width:25px;height:1px;background:#d5aa57}.page-footer .hero-brand-name{font-family:Fraunces,serif;font-size:clamp(38px,4.6vw,58px);font-weight:500;letter-spacing:-.055em;line-height:.92;color:#fff;white-space:nowrap}.page-footer .hero-brand-underline{width:58%;height:8px;margin:6px 0 1px;border-bottom:3px solid #5aa6c7;border-radius:50%;transform:rotate(-1.5deg)}.page-footer .hero-brand-tagline{font-size:8px;letter-spacing:.2em;color:#f3d585;white-space:nowrap}.page-footer .ftr-tit{color:#f3d585;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-bottom:16px}.page-footer .ftr-links-grid{display:grid;grid-template-columns:1fr;gap:7px}.page-footer .ftr-links-grid a{display:block;color:rgba(255,255,255,.72);font-size:14px;padding:7px 0;text-decoration:none}.page-footer .ftr-links-grid a:hover{color:#fff}.page-footer .ftr-wpp{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 16px;background:#fffdf8;color:#0d4b62;border:1px solid rgba(217,168,63,.48);border-radius:10px;font-weight:600;text-decoration:none}.page-footer .ftr-bottom{position:relative;z-index:1;width:min(1140px,100%);margin:0 auto;padding:20px 44px;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center;font-size:11px;color:rgba(255,255,255,.55)}.page-footer .ftr-bottom-r{color:#f3d585;letter-spacing:.1em;text-transform:uppercase}.mob-footer-nav{display:none;position:fixed;bottom:0;left:0;right:0;height:64px;padding-bottom:env(safe-area-inset-bottom,0px);box-sizing:content-box;background:rgba(255,255,255,.92);backdrop-filter:blur(14px) saturate(160%);-webkit-backdrop-filter:blur(14px) saturate(160%);border-top:1px solid rgba(13,59,84,.1);z-index:900;box-shadow:0 -2px 16px rgba(13,59,84,.08)}.mob-footer-items{display:flex;align-items:stretch;height:100%;max-width:680px;margin:0 auto}.mob-footer-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;background:transparent;color:#456575;font-family:Outfit,sans-serif;font-size:9px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;padding:6px 2px 4px;text-decoration:none}.mob-footer-btn.active,.mob-footer-btn:hover{color:#0c4a6e}.mob-footer-ico{font-size:20px;line-height:1}.mob-footer-btn.wpp-btn{color:#0c4a6e}.mob-footer-btn.wpp-btn .mob-footer-ico{width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(12,74,110,.1)}@media(max-width:900px){.page-footer .ftr-main{grid-template-columns:1fr 1fr;gap:32px 24px;padding:48px 24px 28px}.page-footer .ftr-main>.ftr-col:first-child{grid-column:1/-1;max-width:none}}@media(max-width:768px){body{padding-bottom:calc(64px + env(safe-area-inset-bottom,0px))}.mob-footer-nav{display:block}}@media(max-width:600px){.page-footer .ftr-main{grid-template-columns:1fr;gap:0;padding:44px 26px 24px}.page-footer .ftr-main>.ftr-col:first-child{text-align:center;padding-bottom:28px;margin-bottom:24px;border-bottom:1px solid rgba(255,255,255,.12)}.page-footer .ftr-logo{align-items:center;width:100%;margin:0 auto 18px;text-align:center}.page-footer .hero-brand-name{max-width:100%;font-size:clamp(26px,8.5vw,42px);line-height:.96;text-align:center}.page-footer .hero-brand-kicker,.page-footer .hero-brand-tagline{max-width:100%;text-align:center}.page-footer .ftr-col:not(:first-child),.page-footer .ftr-col:not(:first-child) a,.page-footer .ftr-col:not(:first-child) .ftr-tit{text-align:left}.page-footer .ftr-links-grid{gap:4px}.page-footer .ftr-links-grid a{font-size:14px;padding:9px 0}.page-footer .ftr-bottom{flex-direction:column;gap:6px;text-align:center;padding:22px 24px 26px}}
</style><style id="property-header-cleanup">
.header{position:sticky!important;top:0!important;z-index:30!important;min-height:0!important;height:auto!important;background:#fff!important;color:#0d3b54!important;border-bottom:1px solid rgba(13,59,84,.14)!important;box-shadow:0 4px 16px rgba(13,59,84,.08)!important;backdrop-filter:none!important}
.header .nav{width:min(1180px,100%);height:auto!important;min-height:64px!important;margin:0 auto;padding:12px 22px!important;display:flex;align-items:center;justify-content:space-between!important;gap:14px}
.header .brand{display:flex;align-items:center;gap:10px;color:#0d3b54!important;font-weight:700}.header .brand-mark{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:#0d3b54;color:#fff;font-size:12px;letter-spacing:.1em}.header .brand-text{white-space:nowrap;color:#0d3b54!important}.header .nav-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-left:auto}.header .nav-link{display:inline-flex!important;align-items:center;color:#0d3b54!important;font-size:13px;padding:8px 10px;text-decoration:none}.header .nav-link:hover{color:#0e8794!important;background:#eef7f7;border-radius:999px}.header .nav-cta{display:inline-flex!important;align-items:center;padding:9px 14px;border-radius:999px;background:#0e8794!important;color:#fff!important;font-size:12px;font-weight:700;text-decoration:none}
@media(max-width:760px){.header{display:none!important}.header .nav{min-height:58px!important;padding:10px 16px!important}.header .brand-text{font-size:14px}.header .nav-link{display:none!important}.header .nav-cta{padding:9px 12px;font-size:11px}.header + .wrap{padding-top:16px!important}}

/* CNP-UI: ações institucionais seguem a paleta da página inicial. */
.header .nav-cta,
.header .wpp,
.floating.wpp {
  background: #25d366 !important;
  border-color: #25d366 !important;
  color: #fff !important;
  box-shadow: 0 5px 16px rgba(37, 211, 102, .24);
}
.header .nav-cta:hover,
.header .wpp:hover,
.floating.wpp:hover {
  background: #1fbd59 !important;
  border-color: #1fbd59 !important;
}

/* CNP-UI: o cabeçalho mobile acompanha o conteúdo, como na home. */
@media (max-width: 760px) {
  .header,
  .header.site-header,
  .header.topbar {
    position: static !important;
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;
    inset: auto !important;
  }
}
</style></head><body><header class="header"><nav class="nav"><a class="brand" href="${landingUrl}" aria-label="Início do site parceiro"><span class="brand-mark">CN</span><span class="brand-text">Condomínios na Praia</span></a><div class="nav-actions"><a class="nav-link" href="${landingUrl}">Início</a><a class="nav-link" href="${fullListingUrl}">Imóveis</a><a class="nav-link" href="${contactUrl}">Contato</a><a class="nav-cta" href="${esc(wppBase)}?text=${wppText}" target="_blank" rel="noopener nofollow">WhatsApp</a></div></nav></header><main class="wrap"><nav class="crumb" aria-label="Breadcrumb"><a class="back-link" href="${esc(backHref)}">${esc(backLabel)}</a><span class="crumb-path"><a href="${landingUrl}">Início</a> › <a href="${fullListingUrl}">Imóveis</a> › <span>${esc(title)}</span></span></nav><div class="gallery-wrap"><section class="photo-gallery" id="property-gallery" aria-label="Galeria de ${esc(title)}">${imageMarkup}${photos.length > 1 ? `<button type="button" class="gallery-more" data-gallery-open aria-label="Ver todas as fotos"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg>Ver todas as ${photos.length} fotos</button>` : ''}</section><div class="property-actions-bar"><span class="property-code-pill">${codeLabel ? `Cód. ${esc(codeLabel)}` : 'Imóvel disponível'}</span><div class="property-actions-top"><button type="button" class="share-button" data-share-property aria-label="Compartilhar este imóvel"><span aria-hidden="true">⌯</span> Compartilhar</button></div></div></div><section class="hero-info"><div class="property-tags"><span class="property-tag">${esc(typeLabel)}</span><span class="property-tag">${esc(statusLabel)}</span></div><h1>${esc(title)}</h1><div class="location">📍 ${esc(location)}</div></section><div class="content-grid"><article class="main-card"><h2>Informações do imóvel</h2><div class="facts">${facts.map(([icon, label, value]) => `<div class="fact"><span class="fact-icon" aria-hidden="true">${esc(icon)}</span><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`).join('')}</div><h2>Sobre este imóvel</h2><p class="description">${esc(description)}</p>${extras.length ? `<div class="details">${extras.map(([label, value]) => `<div class="detail"><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`).join('')}</div>` : ''}${differences.length ? `<h2 style="margin-top:30px">Diferenciais</h2><div class="differences">${differences.map((item) => `<span class="difference">${esc(item)}</span>`).join('')}</div>` : ''}</article><aside class="side-card"><div class="price-label">Valor anunciado</div><div class="price">${esc(money(imovel.preco))}</div><a class="wpp" href="${esc(wppBase)}?text=${wppText}" target="_blank" rel="noopener nofollow">Falar sobre este imóvel</a><a class="contact-link" href="${contactUrl}">Enviar mensagem pelo formulário</a><div class="broker"><div class="broker-avatar">${esc(broker.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase())}</div><div><strong>${esc(broker)}</strong><small>${esc(site.creci ? `CRECI ${site.creci}` : 'Corretor parceiro')}</small></div></div></aside></div><section class="lead-card" id="interesse"><h2>Receba mais informações</h2><p>Cadastre seus dados para receber informações atualizadas sobre este imóvel, disponibilidade, condições e oportunidades semelhantes.</p><form class="lead-form" id="property-lead-form"><input type="hidden" name="site_id" value="${esc(site.id)}"><input type="hidden" name="imovel_id" value="${esc(imovel.id)}"><input name="nome" type="text" placeholder="Seu nome" autocomplete="name" required><input name="telefone" type="tel" placeholder="WhatsApp ou telefone" autocomplete="tel" required><input name="email" type="email" placeholder="Seu e-mail (opcional)" autocomplete="email"><textarea name="mensagem" placeholder="Escreva uma mensagem (opcional)">Tenho interesse neste imóvel. Código: ${esc(imovel.codigo || imovel.ref || '')}.</textarea><label class="lead-consent"><input name="consentimento_lgpd" type="checkbox" value="true" required><span>Autorizo o contato sobre este imóvel e oportunidades relacionadas, conforme a <a href="${BASE}/politica-privacidade/" target="_blank" rel="noopener">Política de Privacidade</a>.</span></label><button class="lead-submit" type="submit">Quero receber informações</button><div class="lead-message" id="lead-message" role="status"></div></form></section>${cond?.nome ? `<section class="condo"><h2>Sobre o condomínio ou empreendimento</h2><p class="condo-meta"><strong>${esc(cond.nome)}</strong>${cond.cidade ? ` · ${esc(cond.cidade)}` : ''}</p>${cond.descricao ? `<p class="condo-summary">${esc(cleanDescription(cond.descricao))}</p>` : '<p class="condo-summary">Este imóvel está vinculado a um empreendimento cadastrado no catálogo do corretor. Consulte o corretor para conhecer infraestrutura, regras e condições atualizadas.</p>'}${Array.isArray(cond.amenidades) && cond.amenidades.length ? `<div class="amenities">${cond.amenidades.map((item) => `<span class="amenity">✓ ${esc(item)}</span>`).join('')}</div>` : ''}${condoGalleryMarkup}<div class="notice">As informações públicas do condomínio e do imóvel são apresentadas conforme o cadastro autorizado no catálogo. Confirme disponibilidade, condições e características com o corretor.</div></section>` : ''}${relatedMarkup}</main><a class="wpp floating" href="${esc(wppBase)}?text=${wppText}" target="_blank" rel="noopener nofollow" aria-label="Falar sobre ${esc(title)} pelo WhatsApp"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.9c0 2.1.5 4.1 1.6 5.9L.2 24l6.4-1.7a11.9 11.9 0 0 0 5.5 1.4h.1c6.5 0 11.8-5.3 11.8-11.9 0-3.1-1.3-6.1-3.5-8.3Zm-8.4 18.2h-.1a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 0 1-1.5-5.2c0-5.4 4.4-9.9 9.9-9.9a9.8 9.8 0 0 1 7 2.9 9.9 9.9 0 0 1 2.9 7c0 5.4-4.4 9.9-9.8 9.9Z"/></svg><span>WhatsApp</span></a>${footerMarkup}<div class="lightbox" id="lightbox" aria-hidden="true"><div class="lightbox-inner"><button class="lightbox-close" type="button" data-lightbox-close aria-label="Fechar imagem">×</button><button class="gallery-arrow gallery-prev" type="button" data-lb-prev aria-label="Foto anterior">‹</button><img id="lightbox-image" src="" alt=""><button class="gallery-arrow gallery-next" type="button" data-lb-next aria-label="Próxima foto">›</button><span class="gallery-counter" id="lb-counter"></span></div></div><div class="auth-modal" id="auth-modal" aria-hidden="true"><div class="auth-box" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button class="auth-close" type="button" data-auth-close aria-label="Fechar">×</button><h2 id="auth-title">Veja mais fotos</h2><p id="auth-description">Cadastre seus dados para liberar as fotos adicionais deste imóvel e do condomínio.</p><form class="auth-form" id="auth-form"><input id="auth-name" name="nome" type="text" autocomplete="name" placeholder="Seu nome" required><input id="auth-phone" name="telefone" type="tel" autocomplete="tel" placeholder="Seu telefone ou WhatsApp" required><input id="auth-email" name="email" type="email" autocomplete="email" placeholder="Seu e-mail" required><label class="auth-consent"><input id="auth-consent" name="consentimento_lgpd" type="checkbox" value="true" required><span>Autorizo o contato sobre este imóvel e oportunidades relacionadas, conforme a <a href="${BASE}/politica-privacidade/" target="_blank" rel="noopener">Política de Privacidade</a>.</span></label><button class="auth-submit" type="submit" id="auth-submit">Cadastrar e ver fotos</button><div class="auth-message" id="auth-message" role="status"></div></form><p style="margin-top:14px;font-size:11px">Usaremos seus dados para liberar esta galeria e realizar o atendimento solicitado.</p></div></div><script>
const PARTNER_SITE_SLUG=${jsonSafe(JSON.stringify(siteSlug))};const PARTNER_SITE_ID=${jsonSafe(JSON.stringify(site.id))};const PARTNER_PROPERTY_ID=${jsonSafe(JSON.stringify(imovel.id))};const PARTNER_SB_URL=${jsonSafe(JSON.stringify(SB_URL))};const PARTNER_SB_ANON=${jsonSafe(JSON.stringify(SB_ANON))};const ALL_PHOTOS=${jsonSafe(JSON.stringify(photos))};const lightbox=document.getElementById('lightbox');const lightboxImage=document.getElementById('lightbox-image');const leadForm=document.getElementById('property-lead-form');const leadMessage=document.getElementById('lead-message');let partnerAuthToken=sessionStorage.getItem('partner_auth_token')||'';const authModal=document.getElementById('auth-modal');const authForm=document.getElementById('auth-form');const authMessage=document.getElementById('auth-message');const authSubmit=document.getElementById('auth-submit');const propertyGallery=document.getElementById('property-gallery');const galleryCounter=document.querySelector('[data-gallery-counter]');let gallerySlides=[];let galleryIndex=0;
let lbIndex=0;function openLightbox(i){if(!ALL_PHOTOS.length)return;lbIndex=(i%ALL_PHOTOS.length+ALL_PHOTOS.length)%ALL_PHOTOS.length;if(lightboxImage){lightboxImage.src=ALL_PHOTOS[lbIndex];lightboxImage.alt='Foto '+(lbIndex+1)+' de '+ALL_PHOTOS.length;}var c=document.getElementById('lb-counter');if(c)c.textContent=(lbIndex+1)+'/'+ALL_PHOTOS.length;lightbox.classList.add('on');lightbox.setAttribute('aria-hidden','false');}function lbStep(d){openLightbox(lbIndex+d);}function closeLightbox(){lightbox&&lightbox.classList.remove('on');lightbox&&lightbox.setAttribute('aria-hidden','true');if(lightboxImage)lightboxImage.src='';}document.querySelectorAll('#property-gallery .photo-slide').forEach(function(sl,idx){sl.addEventListener('click',function(){openLightbox(idx);});});document.querySelector('[data-gallery-open]')&&document.querySelector('[data-gallery-open]').addEventListener('click',function(){openLightbox(0);});document.querySelector('[data-lightbox-close]')&&document.querySelector('[data-lightbox-close]').addEventListener('click',closeLightbox);document.querySelector('[data-lb-prev]')&&document.querySelector('[data-lb-prev]').addEventListener('click',function(e){e.stopPropagation();lbStep(-1);});document.querySelector('[data-lb-next]')&&document.querySelector('[data-lb-next]').addEventListener('click',function(e){e.stopPropagation();lbStep(1);});lightbox&&lightbox.addEventListener('click',function(e){if(e.target===lightbox)closeLightbox();});document.addEventListener('keydown',function(e){if(!lightbox||!lightbox.classList.contains('on'))return;if(e.key==='ArrowLeft')lbStep(-1);if(e.key==='ArrowRight')lbStep(1);if(e.key==='Escape')closeLightbox();});var _lbtsx=null;lightbox&&lightbox.addEventListener('touchstart',function(e){_lbtsx=e.changedTouches[0]?e.changedTouches[0].clientX:null;},{passive:true});lightbox&&lightbox.addEventListener('touchend',function(e){if(_lbtsx===null)return;var dx=(e.changedTouches[0]?e.changedTouches[0].clientX:_lbtsx)-_lbtsx;if(Math.abs(dx)>45)lbStep(dx<0?1:-1);_lbtsx=null;},{passive:true});
document.querySelector('[data-share-property]')?.addEventListener('click',async()=>{const shareData={title:${jsonSafe(JSON.stringify(title))},text:${jsonSafe(JSON.stringify(`Confira este imóvel: ${title}`))},url:location.href};try{if(navigator.share){await navigator.share(shareData)}else{await navigator.clipboard.writeText(location.href);const button=document.querySelector('[data-share-property]');if(button)button.innerHTML='<span aria-hidden="true">✓</span> Link copiado';setTimeout(()=>{if(button)button.innerHTML='<span aria-hidden="true">⌯</span> Compartilhar'},1800)}}catch(error){if(error?.name!=='AbortError')console.warn('Compartilhamento:',error)}});function showAuth(){authModal.classList.add('on');authModal.setAttribute('aria-hidden','false');setTimeout(()=>document.getElementById('auth-email')?.focus(),50)}function closeAuth(){authModal.classList.remove('on');authModal.setAttribute('aria-hidden','true');authMessage.textContent=''}document.querySelectorAll('[data-gallery-auth]').forEach(button=>button.addEventListener('click',showAuth));document.querySelector('[data-auth-close]')?.addEventListener('click',closeAuth);authModal.addEventListener('click',event=>{if(event.target===authModal)closeAuth()});document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeAuth();closeLightbox()}});
function safeText(value){return String(value??'').replace(/[&<>\"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[character]))}function insertUnlocked(selector,photos,kind){const lock=document.querySelector(selector);if(!lock)return;photos.forEach((photo)=>{const element=document.createElement(kind==='property'?'figure':'div');element.className=kind==='property'?'photo-slide unlocked-photo':'unlocked-condo-photo';if(kind==='property'){element.setAttribute('data-lightbox',photo);element.setAttribute('tabindex','0');element.setAttribute('role','button');element.setAttribute('aria-label','Ampliar foto adicional')}element.innerHTML=kind==='property'?'<img src="'+safeText(photo)+'" alt="Foto adicional do imóvel" loading="lazy" decoding="async">':'<img src="'+safeText(photo)+'" alt="Foto adicional do empreendimento" loading="lazy" decoding="async">';lock.parentNode.insertBefore(element,lock)});lock.remove();if(kind==='property'){}}
async function unlockGalleries(){if(!partnerAuthToken)return;try{const response=await fetch('/parceiro-gallery?site='+encodeURIComponent(PARTNER_SITE_SLUG)+'&imovel='+encodeURIComponent(PARTNER_PROPERTY_ID),{headers:{Authorization:'Bearer '+partnerAuthToken}});const data=await response.json();if(response.status===401){sessionStorage.removeItem('partner_auth_token');partnerAuthToken='';return}if(!response.ok)throw new Error(data.message||'Não foi possível liberar as fotos.');insertUnlocked('[data-gallery-lock="property"]',Array.isArray(data.photos)?data.photos:[],'property');insertUnlocked('[data-gallery-lock="condo"]',Array.isArray(data.condo_photos)?data.condo_photos:[],'condo')}catch(error){console.warn('Galeria protegida:',error.message||error)}}
authForm.addEventListener('submit',async event=>{event.preventDefault();authMessage.textContent='Registrando seus dados...';authSubmit.disabled=true;const name=document.getElementById('auth-name').value.trim();const phone=document.getElementById('auth-phone').value.trim();const email=document.getElementById('auth-email').value.trim();const consent=document.getElementById('auth-consent').checked;try{const leadResponse=await fetch('/parceiro-lead',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({site_id:PARTNER_SITE_ID,imovel_id:PARTNER_PROPERTY_ID,nome:name,telefone:phone,email,mensagem:'Cadastro para acessar as fotos adicionais.',origem_url:location.href,consentimento_lgpd:consent})});const leadData=await leadResponse.json();if(!leadResponse.ok)throw new Error(leadData.error||'Não foi possível registrar seus dados.');const randomPart=Array.from(crypto.getRandomValues(new Uint32Array(6))).join('');const temporaryPassword='Cn'+randomPart+'!aA';const response=await fetch(PARTNER_SB_URL+'/auth/v1/signup',{method:'POST',headers:{apikey:PARTNER_SB_ANON,'content-type':'application/json'},body:JSON.stringify({email,password:temporaryPassword,data:{full_name:name,phone,source:'gallery_access'}})});const data=await response.json();if(!response.ok){const message=String(data.error_description||data.msg||'Não foi possível criar seu acesso.');if(/already registered|already exists|user already/i.test(message))throw new Error('Este e-mail já possui cadastro. Use outro e-mail para liberar as fotos.');throw new Error(message)}if(!data.access_token){authMessage.textContent='Cadastro recebido. Verifique o e-mail informado para confirmar o acesso e depois tente novamente.';return}partnerAuthToken=data.access_token;sessionStorage.setItem('partner_auth_token',partnerAuthToken);closeAuth();await unlockGalleries()}catch(error){authMessage.textContent=error.message||'Não foi possível concluir o cadastro.'}finally{authSubmit.disabled=false}});if(partnerAuthToken)unlockGalleries();
leadForm?.addEventListener('submit',async event=>{event.preventDefault();const submit=leadForm.querySelector('.lead-submit');if(submit)submit.disabled=true;if(leadMessage)leadMessage.textContent='Enviando seus dados...';const data=Object.fromEntries(new FormData(leadForm));data.site_id=PARTNER_SITE_ID;data.imovel_id=PARTNER_PROPERTY_ID;data.origem_url=location.href;data.consentimento_lgpd=Boolean(leadForm.querySelector('[name="consentimento_lgpd"]')?.checked);try{const response=await fetch('/parceiro-lead',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});const output=await response.json();if(!response.ok)throw new Error(output.error||'Não foi possível enviar seus dados.');leadForm.reset();leadForm.querySelector('[name="site_id"]').value=PARTNER_SITE_ID;leadForm.querySelector('[name="imovel_id"]').value=PARTNER_PROPERTY_ID;if(leadMessage)leadMessage.textContent='Recebemos seu cadastro. O corretor entrará em contato com as informações deste imóvel.'}catch(error){if(leadMessage)leadMessage.textContent=error.message||'Não foi possível enviar agora.'}finally{if(submit)submit.disabled=false}});
</script></body></html>`;
}

export async function onRequest(context) {
  const requestedSiteSlug = String(context.params?.slug || '').toLowerCase();
  const imovelRef = String(context.params?.imovelSlug || '').toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(requestedSiteSlug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(imovelRef)) return notFound();
  const { dbSlug, publicSlug } = siteSlugInfo(requestedSiteSlug);
  const requestPath = new URL(context.request.url).pathname;
  if (requestPath.startsWith('/parceiro/') || (requestPath.startsWith('/corretor/') && requestedSiteSlug !== publicSlug)) return Response.redirect(`${BASE}/corretor/${encodeURIComponent(publicSlug)}/imovel/${encodeURIComponent(imovelRef)}/`, 301);
  let feed = null;
  const sites = await getJson(`parceiros_sites?slug=eq.${encodeURIComponent(dbSlug)}&status=eq.active&select=id,slug,nome,creci,telefone,whatsapp,email,cidade,bio,logo_url,capa_url&limit=1`);
  let site = sites[0] || null;
  if (!site) {
    feed = await getPartnerFeed(publicSlug);
    site = feed?.site ? { id: '', slug: dbSlug, nome: feed.site.name, creci: feed.site.creci, telefone: feed.site.phone, whatsapp: feed.site.whatsapp, email: feed.site.email, cidade: feed.site.city, bio: feed.site.bio, logo_url: feed.site.logo_url, capa_url: feed.site.cover_url } : null;
  }
  if (!site) return notFound();
  const propertySelect = 'id,slug,codigo,ref,titulo,tipo,cidade_end,bairro,fora_condominio,cond_id,preco,quartos,suites,banheiros,vagas,area,area_privativa,area_construida,corretor,descricao,fotos,fotos_no_site,fotos_para_site,status,publicar';
  let rows = [];
  let row = null;
  if (site.id) {
    const directProperties = await getJson(`imoveis?slug=eq.${encodeURIComponent(imovelRef)}&select=${propertySelect}&limit=1`);
    const directProperty = Array.isArray(directProperties) ? directProperties[0] : null;
    if (directProperty?.id) {
      const directLinks = await getJson(`parceiros_sites_imoveis?site_id=eq.${encodeURIComponent(site.id)}&imovel_id=eq.${encodeURIComponent(directProperty.id)}&publicado=eq.true&select=id,ordem,destaque,titulo_personalizado,chamada_personalizada&limit=1`);
      if (directLinks[0]) row = { ...directLinks[0], imovel: directProperty };
    }
  }
  if (!row?.imovel) {
    feed = feed || await getPartnerFeed(publicSlug);
    const feedProperties = Array.isArray(feed?.properties) ? feed.properties : [];
    const feedRows = feedProperties.map((item) => ({ id: item.id, titulo_personalizado: '', chamada_personalizada: '', imovel: { id: item.id, slug: item.slug, codigo: item.code, ref: item.code, titulo: item.title, tipo: 'Imóvel', cidade_end: item.city, bairro: item.neighborhood, preco: item.price, quartos: item.bedrooms, suites: item.suites, area: item.area, descricao: item.description, photo_count: Number(item.photo_count) || (Array.isArray(item.photos) ? item.photos.length : item.cover_image ? 1 : 0), fotos_no_site: Array.isArray(item.photos) && item.photos.length ? item.photos : (item.cover_image ? [item.cover_image] : []), fotos: Array.isArray(item.photos) ? item.photos : [], fotos_para_site: [], status: 'Disponível', publicar: true } }));
    rows = feedRows;
    row = feedRows.find((candidate) => { const im = candidate.imovel || {}; return [im.slug, im.id, im.codigo, im.ref, propertySlug(im)].filter(Boolean).map((value) => String(value).toLowerCase()).includes(imovelRef); });
  }
  if (!row?.imovel && site.id) {
    rows = await getJson(`parceiros_sites_imoveis?site_id=eq.${encodeURIComponent(site.id)}&publicado=eq.true&select=id,ordem,destaque,titulo_personalizado,chamada_personalizada,imovel:imoveis(${propertySelect})&order=destaque.desc,ordem.asc&limit=1000`);
    row = (Array.isArray(rows) ? rows : []).find((candidate) => { const im = candidate.imovel || {}; return isPublishedRow(candidate) && [im.slug, im.id, im.codigo, im.ref, propertySlug(im)].filter(Boolean).map((value) => String(value).toLowerCase()).includes(imovelRef); });
  }
  if (!row?.imovel) return notFound();
  if (!rows.length) {
    feed = feed || await getPartnerFeed(publicSlug);
    const relatedProperties = Array.isArray(feed?.properties) ? feed.properties : [];
    rows = relatedProperties.map((item) => ({ id: item.id, titulo_personalizado: '', chamada_personalizada: '', imovel: { id: item.id, slug: item.slug, codigo: item.code, ref: item.code, titulo: item.title, tipo: 'Imóvel', cidade_end: item.city, bairro: item.neighborhood, preco: item.price, quartos: item.bedrooms, suites: item.suites, area: item.area, descricao: item.description, photo_count: Number(item.photo_count) || (Array.isArray(item.photos) ? item.photos.length : item.cover_image ? 1 : 0), fotos_no_site: Array.isArray(item.photos) && item.photos.length ? item.photos : (item.cover_image ? [item.cover_image] : []), fotos: Array.isArray(item.photos) ? item.photos : [], fotos_para_site: [], status: 'Disponível', publicar: true } }));
  }
  let imovel = { ...row.imovel, titulo: row.titulo_personalizado || row.imovel.titulo, descricao: row.chamada_personalizada || row.imovel.descricao };
  const media = await getJson(`imoveis?id=eq.${encodeURIComponent(imovel.id)}&select=id,slug,codigo,ref,titulo,tipo,fotos,fotos_no_site,fotos_para_site&limit=1`);
  if (Array.isArray(media) && media[0]) imovel = { ...imovel, ...media[0] };
  const enrich = await getJson(`imoveis?id=eq.${encodeURIComponent(imovel.id)}&select=bairro_end,fora_condominio,cond_id,banheiros,vagas,area_privativa,area_construida,corretor,diferenciais&limit=1`);
  if (Array.isArray(enrich) && enrich[0]) imovel = { ...imovel, ...enrich[0] };
  let cond = null;
  if (imovel.cond_id) {
    const condos = await getJson(`condominios?id=eq.${encodeURIComponent(imovel.cond_id)}&select=id,slug,nome,cidade,descricao,amenidades,fotos_no_site,fotos&limit=1`);
    cond = Array.isArray(condos) ? condos[0] || null : null;
  }
  return new Response(page({ site, imovel, cond, siteSlug: publicSlug, relatedRows: rows }), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600' } });
}

export { propertySlug, propertyUrl };
