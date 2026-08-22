const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const BASE = 'https://condominiosnapraia.com.br';
const HEADERS = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` };

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function digits(value) {
  return String(value || '').replace(/\D/g, '');
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch (_) { return value ? [value] : []; }
  }
  return [];
}

function firstPhoto(imovel) {
  const candidates = [...toArray(imovel?.fotos_no_site), ...toArray(imovel?.fotos), ...toArray(imovel?.fotos_para_site)];
  for (const item of candidates) {
    const url = typeof item === 'string' ? item : item?.url || item?.src || item?.publicUrl || item?.public_url;
    if (url && /^https?:\/\//i.test(url)) return url;
  }
  return '';
}

function money(value) {
  if (!value) return 'Consulte o valor';
  const text = String(value).trim();
  if (/r\$|\$|€|\./i.test(text)) return text;
  return `R$ ${text}`;
}

async function getJson(path) {
  const response = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: HEADERS });
  if (!response.ok) return [];
  return response.json();
}

function layout({ site, listings, slug }) {
  const name = site.nome || 'Corretor parceiro';
  const description = site.bio || `Imóveis selecionados por ${name} no Litoral Norte Gaúcho.`;
  const phone = digits(site.whatsapp || site.telefone);
  const wpp = phone ? `https://wa.me/${phone}` : 'https://condominiosnapraia.com.br/contato/';
  const accent = /^#[0-9a-f]{6}$/i.test(site.accent_color || '') ? site.accent_color : '#d5aa57';
  const brand = /^#[0-9a-f]{6}$/i.test(site.brand_color || '') ? site.brand_color : '#0d5c86';
  const canonical = `${BASE}/parceiro/${encodeURIComponent(slug)}`;
  const cards = listings.map((item) => {
    const imovel = item.imovel || {};
    const title = item.titulo_personalizado || imovel.titulo || 'Imóvel disponível';
    const image = firstPhoto(imovel);
    const city = imovel.cidade_end || imovel.cidade || 'Litoral Norte';
    const location = [imovel.bairro, city].filter(Boolean).join(' · ');
    const details = [imovel.quartos && `${imovel.quartos} quartos`, imovel.suites && `${imovel.suites} suítes`, imovel.area && `${imovel.area} m²`].filter(Boolean).join(' · ');
    return `<article class="property-card">
      <div class="property-photo">${image ? `<img src="${esc(image)}" alt="${esc(title)}" loading="lazy" decoding="async">` : '<div class="property-photo-empty">Imagem em atualização</div>'}</div>
      <div class="property-body">
        <span class="property-label">${item.destaque ? 'Destaque' : 'Oportunidade'}</span>
        <h3>${esc(title)}</h3>
        <p class="property-location">${esc(location || 'Litoral Norte Gaúcho')}</p>
        ${details ? `<p class="property-details">${esc(details)}</p>` : ''}
        <strong>${esc(money(imovel.preco))}</strong>
        <button class="property-cta" type="button" data-property-id="${esc(imovel.id || '')}" data-property-title="${esc(title)}">Tenho interesse</button>
      </div>
    </article>`;
  }).join('');
  const logo = site.logo_url ? `<img src="${esc(site.logo_url)}" alt="${esc(name)}" class="brand-logo">` : `<span class="brand-mark">CP</span>`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)} | Imóveis no Litoral Norte</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Condomínios na Praia">
<meta property="og:title" content="${esc(name)} | Imóveis no Litoral Norte">
<meta property="og:description" content="${esc(description)}">
${site.capa_url ? `<meta property="og:image" content="${esc(site.capa_url)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--brand:${brand};--accent:${accent};--ink:#0d3b54;--muted:#5b7585;--sand:#faf6ef;--line:#e7ded0;--white:#fff}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--sand);color:var(--ink);font-family:Outfit,Arial,sans-serif}a{text-decoration:none;color:inherit}.site-header{position:sticky;top:0;z-index:20;background:rgba(250,246,239,.94);backdrop-filter:blur(16px);border-bottom:1px solid rgba(13,59,84,.1)}.nav{width:min(1180px,100%);margin:auto;padding:14px 24px;display:flex;align-items:center;gap:14px}.brand{display:flex;align-items:center;gap:10px;font-weight:700;letter-spacing:.03em}.brand-mark{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:var(--brand);color:#fff;font-size:12px;letter-spacing:.1em}.brand-logo{width:38px;height:38px;border-radius:10px;object-fit:cover}.nav-links{margin-left:auto;display:flex;align-items:center;gap:18px;color:var(--muted);font-size:13px}.nav-cta{padding:9px 14px;border-radius:999px;background:var(--brand);color:#fff;font-weight:600}.hero{position:relative;min-height:420px;display:grid;align-items:end;overflow:hidden;background:linear-gradient(140deg,var(--brand),#0e8a99)}.hero::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,59,84,.03),rgba(13,59,84,.82))}.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.62}.hero-inner{position:relative;z-index:1;width:min(1180px,100%);margin:auto;padding:90px 24px 58px;color:#fff;display:grid;grid-template-columns:minmax(0,1fr) 170px;gap:34px;align-items:end}.eyebrow{text-transform:uppercase;letter-spacing:.24em;color:var(--accent);font-size:11px;font-weight:700}.hero h1{max-width:760px;margin:14px 0 10px;font:600 clamp(42px,7vw,82px)/.98 Fraunces,serif;letter-spacing:-.04em}.hero p{max-width:620px;margin:0;font-size:17px;line-height:1.65;color:rgba(255,255,255,.88)}.hero-profile{justify-self:end;width:154px;text-align:center}.profile-photo{display:block;width:154px;height:190px;border-radius:22px;object-fit:cover;object-position:center 24%;border:4px solid rgba(255,255,255,.82);box-shadow:0 18px 38px rgba(0,0,0,.2)}.hero-profile small{display:block;margin-top:10px;color:rgba(255,255,255,.78);font-size:11px;line-height:1.3}.main{width:min(1180px,100%);margin:auto;padding:70px 24px 100px}.section-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:24px}.section-head h2{margin:0;font:600 clamp(32px,5vw,54px)/1 Fraunces,serif;letter-spacing:-.03em}.section-head p{max-width:420px;color:var(--muted);line-height:1.6;margin:0}.property-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.property-card{background:var(--white);border:1px solid var(--line);border-radius:20px;overflow:hidden;box-shadow:0 12px 30px rgba(13,59,84,.07);display:flex;flex-direction:column}.property-photo{aspect-ratio:16/10;background:linear-gradient(135deg,#d9e5e7,#b2c8cf);overflow:hidden}.property-photo img{width:100%;height:100%;object-fit:cover;display:block}.property-photo-empty{height:100%;display:grid;place-items:center;color:var(--muted);font-size:13px}.property-body{padding:19px;display:flex;flex:1;flex-direction:column;align-items:flex-start}.property-label{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);font-weight:700}.property-body h3{margin:8px 0 5px;font:600 24px/1.08 Fraunces,serif}.property-location,.property-details{margin:0;color:var(--muted);font-size:13px;line-height:1.45}.property-details{margin-top:8px}.property-body strong{margin-top:18px;font-size:19px;color:var(--brand)}.property-cta{margin-top:auto;padding:11px 15px;border:0;border-radius:999px;background:var(--brand);color:#fff;font:600 13px Outfit,sans-serif;cursor:pointer;width:100%}.property-cta:hover{filter:brightness(1.08)}.empty{padding:40px;border:1px dashed var(--line);border-radius:18px;background:#fff;color:var(--muted);text-align:center}.contact{margin-top:58px;background:var(--brand);color:#fff;border-radius:24px;padding:30px;display:grid;grid-template-columns:1fr 1fr;gap:26px}.contact h2{font:600 38px/1 Fraunces,serif;margin:0 0 12px}.contact p{color:rgba(255,255,255,.78);line-height:1.6}.contact-form{display:grid;gap:10px}.contact-form input,.contact-form textarea{width:100%;border:1px solid rgba(255,255,255,.25);border-radius:10px;background:rgba(255,255,255,.1);color:#fff;padding:12px;font:14px Outfit,sans-serif}.contact-form input::placeholder,.contact-form textarea::placeholder{color:rgba(255,255,255,.68)}.contact-form textarea{min-height:88px;resize:vertical}.consent{display:flex;gap:8px;align-items:flex-start;font-size:12px;color:rgba(255,255,255,.78);line-height:1.4}.consent input{width:auto;margin-top:3px}.form-submit{border:0;border-radius:999px;background:var(--accent);color:#193c50;padding:12px 16px;font:700 13px Outfit,sans-serif;cursor:pointer}.form-message{min-height:20px;font-size:13px;color:#ffe3a4}footer{padding:26px 24px;border-top:1px solid var(--line);text-align:center;color:var(--muted);font-size:12px}@media(max-width:800px){.nav{padding:12px 18px}.nav-links a:not(.nav-cta){display:none}.hero-inner{grid-template-columns:1fr;padding:72px 20px 48px}.hero-profile{justify-self:start;width:116px}.profile-photo{width:116px;height:145px;border-radius:18px}.main{padding:52px 18px 90px}.section-head{display:block}.section-head p{margin-top:12px}.property-grid{grid-template-columns:1fr}.contact{grid-template-columns:1fr;padding:24px 20px}.contact h2{font-size:34px}.hero h1{font-size:clamp(40px,13vw,62px)}}
</style>
</head>
<body>
<header class="site-header"><nav class="nav"><a class="brand" href="${BASE}/">${logo}<span>${esc(name)}</span></a><div class="nav-links"><a href="#imoveis">Imóveis</a><a href="#contato">Contato</a><a class="nav-cta" href="${esc(wpp)}" target="_blank" rel="noopener">WhatsApp</a></div></nav></header>
<section class="hero">${site.capa_url ? `<img class="hero-bg" src="${esc(site.capa_url)}" alt="" fetchpriority="high">` : ''}<div class="hero-inner"><div><div class="eyebrow">Atendimento imobiliário</div><h1>${esc(name)}</h1><p>${esc(description)}</p></div>${site.logo_url ? `<div class="hero-profile"><img class="profile-photo" src="${esc(site.logo_url)}" alt="Foto profissional de ${esc(name)}" fetchpriority="high"><small>Atendimento personalizado no Rio Grande do Sul</small></div>` : ''}</div></section>
<main class="main"><section id="imoveis"><div class="section-head"><h2>Imóveis selecionados</h2><p>Oportunidades publicadas pelo corretor no catálogo do Condomínios na Praia.</p></div>${cards ? `<div class="property-grid">${cards}</div>` : '<div class="empty">Este site ainda não possui imóveis publicados.</div>'}</section>
<section class="contact" id="contato"><div><div class="eyebrow">Fale com o corretor</div><h2>Encontre o imóvel certo para você.</h2><p>Envie seus dados e receba atendimento personalizado. O formulário registra o consentimento para uso dos dados conforme a Política de Privacidade.</p><a class="nav-cta" href="${esc(wpp)}" target="_blank" rel="noopener">Conversar pelo WhatsApp</a></div><form class="contact-form" id="lead-form"><input name="nome" placeholder="Seu nome" required><input name="email" type="email" placeholder="Seu e-mail"><input name="telefone" placeholder="Seu WhatsApp" required><textarea name="mensagem" placeholder="Conte o que você procura"></textarea><label class="consent"><input name="consentimento_lgpd" type="checkbox" required><span>Autorizo o contato sobre esta oportunidade e li a <a href="${BASE}/politica-privacidade/" target="_blank" rel="noopener"><u>Política de Privacidade</u></a>.</span></label><input type="hidden" name="site_id" value="${esc(site.id)}"><button class="form-submit" type="submit">Quero ser atendido</button><div class="form-message" id="form-message" role="status"></div></form></section></main>
<footer>Landing publicada por <a href="${BASE}/">Condomínios na Praia</a> · ${esc(name)}</footer>
<script>
const form=document.getElementById('lead-form');const msg=document.getElementById('form-message');let selectedProperty='';document.querySelectorAll('[data-property-id]').forEach(btn=>btn.addEventListener('click',()=>{selectedProperty=btn.dataset.propertyId||'';document.querySelector('#contato').scrollIntoView({behavior:'smooth'});document.querySelector('textarea[name=mensagem]').value='Tenho interesse em: '+(btn.dataset.propertyTitle||'este imóvel');}));form.addEventListener('submit',async(e)=>{e.preventDefault();const data=Object.fromEntries(new FormData(form));data.imovel_id=selectedProperty;data.origem_url=location.href;data.consentimento_lgpd=Boolean(form.querySelector('[name=consentimento_lgpd]').checked);msg.textContent='Enviando...';try{const r=await fetch('/parceiro-lead',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});const out=await r.json();if(!r.ok)throw new Error(out.error||'Não foi possível enviar.');form.reset();msg.textContent='Recebemos seus dados. O corretor entrará em contato.';}catch(err){msg.textContent=err.message||'Não foi possível enviar agora.';}});
</script>
</body>
</html>`;
}

export async function onRequest(context) {
  const slug = String(context.params?.slug || '').toLowerCase();
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return new Response('Not Found', { status: 404 });
  const sites = await getJson(`parceiros_sites?slug=eq.${encodeURIComponent(slug)}&status=eq.active&select=id,slug,nome,creci,telefone,whatsapp,email,cidade,bio,logo_url,capa_url,brand_color,accent_color&limit=1`);
  if (!Array.isArray(sites) || !sites[0]) return new Response('<!doctype html><meta charset="utf-8"><title>Site não encontrado</title><style>body{font-family:Arial;padding:48px;max-width:680px;margin:auto;color:#0d3b54}a{color:#0d5c86}</style><h1>Site ainda não publicado</h1><p>Esta landing não está ativa ou o endereço foi digitado incorretamente.</p><a href="https://condominiosnapraia.com.br/">Voltar para Condomínios na Praia</a>', { status: 404, headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex' } });
  const site = sites[0];
  const listings = await getJson(`parceiros_sites_imoveis?site_id=eq.${site.id}&publicado=eq.true&select=id,ordem,destaque,titulo_personalizado,chamada_personalizada,imovel:imoveis(id,slug,titulo,cidade_end,bairro,preco,quartos,suites,area,descricao,fotos,fotos_no_site,fotos_para_site,status,publicar)&order=destaque.desc,ordem.asc&limit=1000`);
  return new Response(layout({ site, listings: Array.isArray(listings) ? listings : [], slug }), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60, s-maxage=300' } });
}
