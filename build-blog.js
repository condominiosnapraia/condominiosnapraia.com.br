#!/usr/bin/env node
/**
 * build-blog.js
 * ---------------------------------------------------------------------------
 * Gera o BLOG ESTÁTICO do condominiosnapraia.com.br a partir do Supabase.
 *
 * O QUE ELE FAZ:
 *   1. /blog/index.html       -> LISTAGEM real de artigos (cards com título,
 *                                resumo, capa e link). Antes esta página era o
 *                                "artigo único" e mostrava "Artigo não encontrado"
 *                                quando aberta sem ?id=. Agora é a lista.
 *   2. /blog/<slug>/index.html -> uma pasta estática por artigo, com o texto
 *                                renderizado DIRETO no HTML (título, capa, corpo,
 *                                meta, schema BlogPosting). O Google enxerga tudo.
 *   3. Atualiza o sitemap.xml incluindo cada artigo.
 *
 * URLs: /blog/nome-do-artigo/  (limpas, boas para SEO)
 *
 * COMO RODAR (na RAIZ do site, onde está a pasta /blog):
 *   node build-blog.js            -> lê o Supabase real
 *   node build-blog.js --demo     -> usa 3 artigos de exemplo (para testar o
 *                                    visual sem acessar o banco)
 *
 * REQUISITOS: Node 18+ (fetch nativo). Em Node <18: npm i node-fetch e
 *             descomente a 1ª linha.
 *
 * SEGURO: só ESCREVE dentro de /blog e ajusta o sitemap. Idempotente: rodar de
 *         novo regenera tudo com os dados atuais do banco.
 * ---------------------------------------------------------------------------
 */

// const fetch = require('node-fetch'); // <- descomente se estiver em Node < 18
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const HDR = { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY } };
const STORAGE = SUPABASE_URL + '/storage/v1/object/public/';

const SITE = 'https://condominiosnapraia.com.br';
const WPP = '5551982868888';
const DEMO = process.argv.includes('--demo');

// ---------------------------------------------------------------------------
// Blocos compartilhados (header + footer + fontes) — iguais ao resto do site
// ---------------------------------------------------------------------------
const HEAD_COMUM = `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#0c4a6e">
<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32.png"><link rel="apple-touch-icon" sizes="180x180" href="/img/favicon-180.png"><link rel="shortcut icon" href="/img/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-25TRZRKFLK"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-25TRZRKFLK');gtag('config','AW-16759565872');</script>`;

const CSS_COMUM = `:root{--ocean:#0d3b54;--om:#0e8a99;--ol:#1fb5c4;--gold:#e0b34d;--gold-d:#c79a3a;--sl:#e8f7f8;--text:#0d3b54;--tm:#5b7585;--areia:#f7f1e8;--espuma:#e8f7f8;--border:rgba(31,181,196,.18);--white:#fff}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Outfit',sans-serif;color:var(--text);background:var(--white);line-height:1.75;font-size:17px;padding-top:56px}
img{max-width:100%;display:block}
a{color:inherit}
.desk-header{position:fixed;top:0;left:0;right:0;z-index:930;background:rgba(255,255,255,.9);backdrop-filter:blur(16px) saturate(160%);-webkit-backdrop-filter:blur(16px) saturate(160%);border-bottom:1px solid rgba(31,181,196,.14);box-shadow:0 2px 20px rgba(13,59,84,.06)}
.desk-header-inner{max-width:1240px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;gap:14px;height:56px}
.dh-logo{display:flex;align-items:center;flex-shrink:0}
.dh-logo img{height:44px;width:auto;display:block}
.dh-nav{display:flex;align-items:center;gap:1px;flex-wrap:nowrap;justify-content:center;flex:1;min-width:0}
.dh-nav a{color:#0d3b54;text-decoration:none;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:7px 9px;border-radius:100px;transition:all .2s;white-space:nowrap}
.dh-nav a:hover{background:rgba(31,181,196,.12);color:#0e8a99}
.dh-cta{display:inline-flex;align-items:center;gap:6px;background:#25d366;color:#fff;text-decoration:none;font-weight:700;font-size:13.5px;padding:9px 16px;border-radius:100px;flex-shrink:0}
@media(max-width:980px){.desk-header{display:none}body{padding-top:0}}
.crumb{max-width:1080px;margin:0 auto;font-size:12.5px;color:var(--tm);padding:18px 24px 0}
.crumb a{color:var(--om);text-decoration:none}
.crumb a:hover{text-decoration:underline}
footer{background:linear-gradient(160deg,#0c4a6e,#0e7490);color:#dbeef2;margin-top:60px}
.ftr-wave svg{display:block;width:100%;height:44px}
.ftr-main{max-width:1180px;margin:0 auto;padding:44px 30px 34px;display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:30px}
.ftr-logo-img{width:200px;height:auto;margin-bottom:12px}
.ftr-tag{font-size:13px;line-height:1.6;opacity:.85;margin-bottom:14px}
.ftr-wpp{display:inline-flex;align-items:center;gap:8px;background:#25d366;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:9px 16px;border-radius:100px}
.ftr-tit{font-family:'Fraunces',serif;font-size:15px;margin-bottom:12px;color:#fff}
.ftr-links-grid{display:flex;flex-direction:column;gap:7px}
.ftr-links-grid a{color:#c6e2ea;text-decoration:none;font-size:13px;cursor:pointer}
.ftr-links-grid a:hover{color:#fff}
.ftr-bottom{border-top:1px solid rgba(255,255,255,.12);max-width:1180px;margin:0 auto;padding:16px 30px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:12px;opacity:.75}
@media(max-width:820px){.ftr-main{grid-template-columns:1fr 1fr;gap:24px}}
@media(max-width:520px){.ftr-main{grid-template-columns:1fr}}
.mob-footer-nav{display:none;position:fixed;bottom:0;left:0;right:0;height:64px;padding-bottom:env(safe-area-inset-bottom,0px);box-sizing:content-box;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);border-top:1px solid rgba(13,59,84,.1);z-index:900}
.mob-footer-items{display:flex;height:100%;max-width:680px;margin:0 auto}
.mob-footer-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:none;background:transparent;color:#8aa1ad;font-family:'Outfit',sans-serif;font-size:9px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;text-decoration:none}
.mob-footer-btn.wpp-btn{color:#25d366}
.mob-footer-ico{font-size:20px;line-height:1}
@media(max-width:980px){.mob-footer-nav{display:block}body{padding-bottom:70px}}`;

const HEADER_HTML = `<header class="desk-header">
  <div class="desk-header-inner">
    <a class="dh-logo" href="/" aria-label="Condomínios na Praia — início"><img src="/img/logo-rodape.png" alt="Meu Litoral - O Portal do Litoral Gaúcho"></a>
    <nav class="dh-nav">
      <a href="/">Início</a>
      <a href="/imoveis">Imóveis</a>
      <a href="/condominios">Condomínios</a>
      <a href="/lancamentos">Lançamentos</a>
      <a href="/contemplado-imoveis">Crédito</a>
      <a href="/turismo">Turismo</a>
      <a href="/blog">Blog</a>
      <a href="/contato">Contato</a>
    </nav>
    <a class="dh-cta" href="https://wa.me/${WPP}" target="_blank" rel="nofollow">
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487 2.981 1.287 2.981.858 3.518.804.537-.054 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
      WhatsApp
    </a>
  </div>
</header>`;

const FOOTER_HTML = `<footer>
  <div class="ftr-wave"><svg viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0,30 C240,60 480,0 720,20 C960,40 1200,55 1440,25 L1440,60 L0,60 Z" fill="#0c4a6e"/></svg></div>
  <div class="ftr-main">
    <div class="ftr-col ftr-col-brand">
      <div class="ftr-logo"><img src="/img/logo-rodape.png" alt="Meu Litoral - O Portal do Litoral Gaúcho" class="ftr-logo-img" width="230" height="154" loading="lazy"></div>
      <p class="ftr-tag">Os melhores condomínios, imóveis e oportunidades de investimento no litoral norte gaúcho — de Osório a Maquiné.</p>
      <a class="ftr-wpp" href="https://wa.me/${WPP}"><svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 0 1 12 4z"/></svg> Falar no WhatsApp</a>
    </div>
    <div class="ftr-col"><div class="ftr-tit">Navegar</div><div class="ftr-links-grid">
      <a href="/condominios">Condomínios</a><a href="/imoveis">Imóveis</a><a href="/lancamentos">Lançamentos</a><a href="/contemplado-imoveis">Crédito Contemplado</a><a href="/financiamento-imobiliario">Financiamento</a><a href="/seguro-fianca">Seguro Fiança</a><a href="/contato">Contato</a><a href="/politica-privacidade">Política de Privacidade</a>
    </div></div>
    <div class="ftr-col"><div class="ftr-tit">Descobrir</div><div class="ftr-links-grid">
      <a href="/turismo">Turismo no Litoral</a><a href="/blog">Blog &amp; Notícias</a><a href="/sobre">Sobre</a>
    </div></div>
    <div class="ftr-col"><div class="ftr-tit">Cidades</div><div class="ftr-links-grid">
      <a href="/xangri-la">Xangri-lá</a><a href="/capao-da-canoa">Capão da Canoa</a><a href="/osorio">Osório</a><a href="/maquine">Maquiné</a>
    </div></div>
  </div>
  <div class="ftr-bottom">
    <span>© 2025 Condomínios na Praia · CRECI-RS 72.386 · Todos os direitos reservados</span>
    <span>Litoral Norte Gaúcho · RS</span>
  </div>
</footer>
<nav class="mob-footer-nav"><div class="mob-footer-items">
  <a class="mob-footer-btn" href="/"><span class="mob-footer-ico">🏠</span><span>Início</span></a>
  <a class="mob-footer-btn wpp-btn" href="https://wa.me/${WPP}" rel="nofollow"><span class="mob-footer-ico">💬</span><span>WhatsApp</span></a>
  <a class="mob-footer-btn" href="/imoveis"><span class="mob-footer-ico">🏘️</span><span>Imóveis</span></a>
  <a class="mob-footer-btn" href="/condominios"><span class="mob-footer-ico">🏖️</span><span>Condomínios</span></a>
</div></nav>`;

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function slugify(s){
  return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

// converte URL de storage do Supabase para o caminho /cdn-fotos usado no site
function fixImg(u){
  if(!u) return '';
  return String(u).split(STORAGE).join('/cdn-fotos/');
}

function fmtData(raw){
  if(!raw) return '';
  try{ return new Date(raw).toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}); }
  catch(e){ return ''; }
}

function resumoDe(p, corpoLimpo){
  return (p.resumo || p.excerpt || corpoLimpo || '').replace(/\s+/g,' ').trim().slice(0,155);
}

// Transforma texto simples (ou HTML) do corpo em HTML de artigo.
// Mesma lógica do /blog/index.html antigo, para manter consistência.
function formatarCorpo(txt){
  if(!txt) return '';
  if(/<(p|h[1-6]|ul|ol|div)[\s>]/i.test(txt)) return txt; // já é HTML
  const linhas = String(txt).split(/\n/).map(l=>l.trim());
  let html='', listaAberta=false;
  const fecha=()=>{ if(listaAberta){ html+='</ul>'; listaAberta=false; } };
  linhas.forEach(linha=>{
    if(!linha){ fecha(); return; }
    if(/^[-•*]\s+/.test(linha) || /^\d+[.)]\s+/.test(linha)){
      if(!listaAberta){ html+='<ul>'; listaAberta=true; }
      html+='<li>'+linha.replace(/^[-•*]\s+/,'').replace(/^\d+[.)]\s+/,'')+'</li>';
      return;
    }
    fecha();
    const semPonto=!/[.!?]$/.test(linha), curta=linha.length<65;
    const doisPontos=linha.endsWith(':'), maiuscula=(linha===linha.toUpperCase()&&linha.length>3);
    if((curta&&semPonto&&linha.length>3)||doisPontos||maiuscula){
      html+='<h2>'+esc(linha.replace(/:$/,''))+'</h2>';
    }else{
      html+='<p>'+linha.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')+'</p>';
    }
  });
  fecha();
  return html;
}

// normaliza um registro do banco em um objeto de artigo previsível
function normalizar(p){
  const titulo = p.titulo || p.title || 'Artigo';
  const corpo  = p.conteudo || p.corpo || p.content || '';
  const corpoLimpo = String(corpo).replace(/<[^>]*>/g,' ');
  const slug   = p.slug || slugify(titulo) || String(p.id||'');
  return {
    id: p.id,
    slug,
    titulo,
    corpo,
    corpoLimpo,
    capa: fixImg(p.capa || p.imagem || ''),
    categoria: p.categoria || '',
    autor: p.autor || 'Condomínios na Praia',
    dataRaw: p.data || p.created_at || p.criado_em || '',
    resumo: resumoDe(p, corpoLimpo),
  };
}

// ---------------------------------------------------------------------------
// Página de LISTAGEM  ->  /blog/index.html
// ---------------------------------------------------------------------------
function paginaListagem(artigos){
  const cards = artigos.map(a=>{
    const capa = a.capa
      ? `<img class="bcard-img" src="${esc(a.capa)}" alt="${esc(a.titulo)}" loading="lazy" width="400" height="225">`
      : `<div class="bcard-img bcard-img--ph"></div>`;
    const data = fmtData(a.dataRaw);
    return `<a class="bcard" href="/blog/${esc(a.slug)}/">
      ${capa}
      <div class="bcard-body">
        ${a.categoria?`<span class="bcard-cat">${esc(a.categoria)}</span>`:''}
        <h2 class="bcard-tit">${esc(a.titulo)}</h2>
        ${a.resumo?`<p class="bcard-res">${esc(a.resumo)}</p>`:''}
        <span class="bcard-meta">${data?data+' · ':''}Ler artigo →</span>
      </div>
    </a>`;
  }).join('\n');

  const vazio = `<div class="b-empty"><h2>Em breve, novos artigos</h2><p>Estamos preparando conteúdos sobre imóveis e condomínios no Litoral Norte Gaúcho.</p><a class="b-empty-cta" href="/">Voltar ao início</a></div>`;

  // itemList schema para o Google entender a listagem
  const itemList = {
    "@context":"https://schema.org","@type":"Blog",
    "name":"Blog | Condomínios na Praia",
    "url":`${SITE}/blog`,
    "blogPost": artigos.map(a=>({
      "@type":"BlogPosting","headline":a.titulo,
      "url":`${SITE}/blog/${a.slug}/`,
      ...(a.resumo?{"description":a.resumo}:{}),
      ...(a.capa?{"image":a.capa.startsWith('http')?a.capa:SITE+a.capa}:{}),
      ...(a.dataRaw?{"datePublished":new Date(a.dataRaw).toISOString()}:{})
    }))
  };

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
${HEAD_COMUM}
<title>Blog | Condomínios na Praia</title>
<meta name="description" content="Artigos e novidades sobre imóveis e condomínios no Litoral Norte Gaúcho.">
<link rel="canonical" href="${SITE}/blog">
<meta property="og:type" content="website">
<meta property="og:title" content="Blog | Condomínios na Praia">
<meta property="og:description" content="Artigos sobre imóveis no Litoral Norte Gaúcho.">
<meta property="og:url" content="${SITE}/blog">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Blog | Condomínios na Praia">
<meta name="twitter:description" content="Artigos e novidades sobre imóveis e condomínios no Litoral Norte Gaúcho.">
<script type="application/ld+json">${JSON.stringify(itemList)}</script>
<style>
${CSS_COMUM}
.b-hero{background:linear-gradient(150deg,#0c4a6e 0%,#0e7490 55%,#0891b2 100%);color:#fff;padding:56px 24px 64px;text-align:center}
.b-hero h1{font-family:'Fraunces',serif;font-size:clamp(30px,5vw,46px);font-weight:400;line-height:1.15}
.b-hero p{opacity:.9;margin-top:12px;font-size:16px;max-width:560px;margin-left:auto;margin-right:auto}
.b-grid{max-width:1080px;margin:-36px auto 0;padding:0 24px 40px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
@media(max-width:900px){.b-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.b-grid{grid-template-columns:1fr}}
.bcard{display:flex;flex-direction:column;background:#fff;border:1px solid var(--border);border-radius:16px;overflow:hidden;text-decoration:none;color:inherit;box-shadow:0 8px 28px rgba(12,74,110,.08);transition:transform .2s,box-shadow .2s}
.bcard:hover{transform:translateY(-4px);box-shadow:0 14px 36px rgba(12,74,110,.16)}
.bcard-img{width:100%;aspect-ratio:16/9;object-fit:cover;background:#dceef2}
.bcard-img--ph{background:linear-gradient(135deg,#cdeef2,#e8f7f8)}
.bcard-body{padding:18px 20px 22px;display:flex;flex-direction:column;gap:10px;flex:1}
.bcard-cat{align-self:flex-start;background:var(--espuma);color:var(--om);font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:4px 10px;border-radius:100px}
.bcard-tit{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:var(--ocean);line-height:1.28}
.bcard-res{font-size:14px;color:var(--tm);line-height:1.6;flex:1}
.bcard-meta{font-size:12.5px;font-weight:600;color:var(--gold-d)}
.b-empty{max-width:560px;margin:0 auto;padding:60px 24px;text-align:center}
.b-empty h2{font-family:'Fraunces',serif;color:var(--ocean);font-size:26px;margin-bottom:10px}
.b-empty p{color:var(--tm);margin-bottom:20px}
.b-empty-cta{display:inline-block;background:var(--ocean);color:#fff;text-decoration:none;padding:11px 22px;border-radius:8px;font-weight:600}
</style>
</head>
<body>
${HEADER_HTML}
<div class="crumb"><a href="/">Início</a> › Blog</div>
<section class="b-hero">
  <h1>Blog &amp; Notícias</h1>
  <p>Guias, dicas e novidades sobre imóveis e condomínios no Litoral Norte Gaúcho — de Osório a Maquiné.</p>
</section>
${artigos.length ? `<main class="b-grid">\n${cards}\n</main>` : vazio}
${FOOTER_HTML}
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Página de ARTIGO  ->  /blog/<slug>/index.html
// ---------------------------------------------------------------------------
function paginaArtigo(a, anterior, proximo){
  const pageUrl = `${SITE}/blog/${a.slug}/`;
  const data = fmtData(a.dataRaw);
  const min = Math.max(1, Math.round(a.corpoLimpo.length/1000));
  const capaAbs = a.capa ? (a.capa.startsWith('http') ? a.capa : SITE + a.capa) : '';

  const schema = {
    "@context":"https://schema.org","@type":"BlogPosting","headline":a.titulo,"url":pageUrl,
    "mainEntityOfPage":{"@type":"WebPage","@id":pageUrl},
    "author":{"@type":"Organization","name":a.autor},
    "publisher":{"@type":"Organization","name":"Condomínios na Praia",
      "logo":{"@type":"ImageObject","url":SITE+"/img/logo-rodape.png"}}
  };
  if(a.resumo) schema.description=a.resumo;
  if(capaAbs) schema.image=capaAbs;
  if(a.dataRaw){ const iso=new Date(a.dataRaw).toISOString(); schema.datePublished=iso; schema.dateModified=iso; }

  const capaHtml = a.capa ? `<img class="artigo-capa" src="${esc(a.capa)}" alt="${esc(a.titulo)}" width="760" height="428">` : '';

  const navRodape = (anterior||proximo) ? `<nav class="artigo-vizinhos">
    ${anterior?`<a class="av av-prev" href="/blog/${esc(anterior.slug)}/"><span>← Anterior</span><strong>${esc(anterior.titulo)}</strong></a>`:'<span></span>'}
    ${proximo?`<a class="av av-next" href="/blog/${esc(proximo.slug)}/"><span>Próximo →</span><strong>${esc(proximo.titulo)}</strong></a>`:'<span></span>'}
  </nav>` : '';

  const wa='https://wa.me/?text='+encodeURIComponent(a.titulo+' '+pageUrl);
  const fb='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(pageUrl);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
${HEAD_COMUM}
<title>${esc(a.titulo)} | Condomínios na Praia</title>
<meta name="description" content="${esc(a.resumo)}">
<link rel="canonical" href="${pageUrl}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(a.titulo)}">
<meta property="og:description" content="${esc(a.resumo)}">
<meta property="og:url" content="${pageUrl}">
${capaAbs?`<meta property="og:image" content="${esc(capaAbs)}">`:''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(a.titulo)}">
<meta name="twitter:description" content="${esc(a.resumo)}">
${capaAbs?`<meta name="twitter:image" content="${esc(capaAbs)}">`:''}
<script type="application/ld+json">${JSON.stringify(schema)}</script>
<style>
${CSS_COMUM}
.artigo-wrap{max-width:760px;margin:0 auto;padding:20px 24px 60px}
.artigo-meta{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:#5a7080;font-weight:500;margin-bottom:18px;align-items:center}
.am-cat{background:var(--espuma);color:var(--om);padding:4px 10px;border-radius:100px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
.artigo-titulo{font-family:'Fraunces',serif;font-size:clamp(28px,5vw,46px);font-weight:400;color:var(--ocean);line-height:1.2;margin-bottom:24px}
.artigo-capa{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:14px;margin-bottom:32px;box-shadow:0 8px 28px rgba(12,74,110,.12)}
.artigo-corpo{font-size:17px;line-height:1.85;color:#2d3e4a}
.artigo-corpo p{margin-bottom:20px}
.artigo-corpo img{max-width:100%;height:auto;border-radius:10px;margin:28px 0;box-shadow:0 6px 20px rgba(0,0,0,.08)}
.artigo-corpo h2{font-family:'Fraunces',serif;color:var(--ocean);margin:36px 0 14px;font-weight:600;font-size:28px;line-height:1.25;padding-left:18px;position:relative}
.artigo-corpo h2::before{content:'';position:absolute;left:0;top:6px;bottom:6px;width:4px;background:linear-gradient(180deg,#06b6d4,#f5b841);border-radius:3px}
.artigo-corpo h3{font-family:'Fraunces',serif;color:var(--om);margin:28px 0 12px;font-weight:600;font-size:22px}
.artigo-corpo ul{margin:0 0 22px 20px}
.artigo-corpo li{margin-bottom:8px}
.artigo-corpo a{color:#0891b2;text-decoration:underline;font-weight:600}
.artigo-corpo blockquote{border-left:4px solid #f5b841;background:#f8fbfc;padding:16px 22px;margin:24px 0;border-radius:0 8px 8px 0;font-style:italic;color:#0c4a6e}
.artigo-corpo strong{color:#0c4a6e;font-weight:700}
.bl-share{display:flex;align-items:center;gap:10px;margin-top:36px;padding-top:24px;border-top:1px solid #e8e8e8;font-size:14px}
.bl-share a{width:38px;height:38px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:var(--espuma);text-decoration:none;font-weight:700;color:var(--ocean)}
.artigo-vizinhos{max-width:760px;margin:10px auto 0;padding:0 24px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
.av{display:flex;flex-direction:column;gap:4px;padding:16px 18px;border:1px solid var(--border);border-radius:12px;text-decoration:none;color:inherit;transition:background .2s}
.av:hover{background:var(--espuma)}
.av span{font-size:11px;color:var(--gold-d);font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.av strong{font-family:'Fraunces',serif;color:var(--ocean);font-weight:600;font-size:15px}
.av-next{text-align:right}
@media(max-width:600px){.artigo-vizinhos{grid-template-columns:1fr}}
.artigo-cta{max-width:760px;margin:34px auto 0;padding:22px 24px;background:linear-gradient(150deg,#0c4a6e,#0e7490);color:#fff;border-radius:16px;text-align:center}
.artigo-cta h3{font-family:'Fraunces',serif;font-weight:600;font-size:20px;margin-bottom:8px}
.artigo-cta p{opacity:.9;font-size:14px;margin-bottom:14px}
.artigo-cta a{display:inline-block;background:#25d366;color:#fff;text-decoration:none;font-weight:700;padding:11px 22px;border-radius:100px}
</style>
</head>
<body>
${HEADER_HTML}
<div class="crumb"><a href="/">Início</a> › <a href="/blog">Blog</a> › ${esc(a.titulo)}</div>
<article class="artigo-wrap">
  <div class="artigo-meta">
    ${a.categoria?`<span class="am-cat">${esc(a.categoria)}</span>`:''}
    ${data?`<span>📅 ${data}</span>`:''}
    <span>✍️ ${esc(a.autor)}</span>
    <span>⏱️ ${min} min de leitura</span>
  </div>
  <h1 class="artigo-titulo">${esc(a.titulo)}</h1>
  ${capaHtml}
  <div class="artigo-corpo">${formatarCorpo(a.corpo)}</div>
  <div class="bl-share"><span>Compartilhar:</span>
    <a href="${wa}" target="_blank" rel="nofollow" title="WhatsApp">💬</a>
    <a href="${fb}" target="_blank" rel="nofollow" title="Facebook">f</a>
  </div>
</article>
<div class="artigo-cta">
  <h3>Quer conhecer um imóvel no Litoral Norte?</h3>
  <p>Fale com a nossa equipe e receba as melhores oportunidades.</p>
  <a href="https://wa.me/${WPP}" rel="nofollow">Falar no WhatsApp</a>
</div>
${navRodape}
${FOOTER_HTML}
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Sitemap: adiciona/atualiza as URLs dos artigos
// ---------------------------------------------------------------------------
function atualizarSitemap(artigos){
  const smPath = path.join(process.cwd(),'sitemap.xml');
  if(!fs.existsSync(smPath)){ console.warn('  ! sitemap.xml não encontrado, pulando.'); return; }
  let sm = fs.readFileSync(smPath,'utf8');

  // remove entradas antigas de artigos (/blog/<algo>/) para regenerar
  sm = sm.replace(/\s*<url><loc>https:\/\/condominiosnapraia\.com\.br\/blog\/[^<]+<\/loc>[\s\S]*?<\/url>/g,'');

  const hoje = new Date().toISOString().slice(0,10);
  const novas = artigos.map(a=>{
    const lm = a.dataRaw ? new Date(a.dataRaw).toISOString().slice(0,10) : hoje;
    return `  <url><loc>${SITE}/blog/${a.slug}/</loc><lastmod>${lm}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`;
  }).join('\n');

  // insere logo depois da entrada da própria /blog
  const marcadorBlog = /(<url><loc>https:\/\/condominiosnapraia\.com\.br\/blog<\/loc>[\s\S]*?<\/url>)/;
  if(marcadorBlog.test(sm)){
    sm = sm.replace(marcadorBlog, `$1\n${novas}`);
  }else{
    sm = sm.replace('</urlset>', `${novas}\n</urlset>`);
  }
  fs.writeFileSync(smPath, sm, 'utf8');
  console.log(`  sitemap.xml atualizado (+${artigos.length} artigos)`);
}

// ---------------------------------------------------------------------------
// Dados de exemplo (--demo)
// ---------------------------------------------------------------------------
function dadosDemo(){
  return [
    { id:1, titulo:'Guia para comprar apartamento em Capão da Canoa', categoria:'Guia', autor:'Condomínios na Praia',
      data:'2026-08-01', resumo:'Tudo o que você precisa saber antes de comprar seu apartamento na praia: documentação, melhores bairros e dicas de negociação.',
      conteudo:`Comprar um apartamento no litoral é o sonho de muita gente — e Capão da Canoa está entre os destinos mais procurados do Litoral Norte Gaúcho.

Por que Capão da Canoa

A cidade combina infraestrutura completa, praias extensas e uma valorização imobiliária consistente. É procurada tanto para veraneio quanto para moradia definitiva.

O que verificar antes de comprar
- Documentação do imóvel e da construtora
- Situação do condomínio e valor da taxa
- Distância real até a praia
- Histórico de valorização do bairro

**Dica final:** visite o imóvel em diferentes horários antes de decidir. A luz da tarde e o movimento da rua dizem muito.` },
    { id:2, titulo:'Xangri-lá ou Atlântida: onde investir?', categoria:'Investimento', autor:'Condomínios na Praia',
      data:'2026-07-20', resumo:'Comparamos dois dos points mais valorizados do litoral gaúcho para ajudar você a escolher onde colocar seu dinheiro.',
      conteudo:`Xangri-lá e Atlântida disputam o posto de bairro mais nobre do Litoral Norte. Mas qual faz mais sentido para o seu investimento?

Xangri-lá

Reconhecida pelos condomínios de alto padrão e pela orla organizada, atrai um público que busca exclusividade.

Atlântida

Tradicional e bem estabelecida, oferece boa liquidez e uma comunidade consolidada de veranistas.

Conclusão

Para valorização de longo prazo, Xangri-lá tem se destacado. Para liquidez e uso imediato, Atlântida entrega mais.` },
    { id:3, titulo:'5 sinais de um bom condomínio na praia', categoria:'Dicas', autor:'Condomínios na Praia',
      data:'2026-07-05', resumo:'Nem todo condomínio à beira-mar é um bom negócio. Veja os sinais que separam um empreendimento sólido de uma dor de cabeça.',
      conteudo:`Escolher o condomínio certo é tão importante quanto escolher o apartamento.

O que observar
- Reserva financeira saudável
- Manutenção em dia das áreas comuns
- Regras claras de convivência
- Boa administração e transparência
- Segurança bem estruturada

Um bom condomínio protege o seu patrimônio e a sua tranquilidade.` },
  ];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main(){
  const raiz = process.cwd();
  const blogDir = path.join(raiz,'blog');
  if(!fs.existsSync(blogDir)){
    console.error('ERRO: não encontrei a pasta /blog. Rode este script na RAIZ do site.');
    process.exit(1);
  }

  let brutos;
  if(DEMO){
    console.log('Modo --demo: usando artigos de exemplo (não acessa o Supabase).');
    brutos = dadosDemo();
  }else{
    console.log('Lendo artigos do Supabase...');
    const r = await fetch(SUPABASE_URL+'/rest/v1/blog_posts?publicado=eq.true&order=created_at.desc&select=*', HDR);
    if(!r.ok){ console.error('ERRO ao ler o Supabase:', r.status, await r.text()); process.exit(1); }
    brutos = await r.json();
    if(!Array.isArray(brutos)) brutos = [];
  }

  const artigos = brutos.map(normalizar)
    .sort((x,y)=> new Date(y.dataRaw||0) - new Date(x.dataRaw||0));
  console.log(`  ${artigos.length} artigos.`);

  // 1) listagem
  fs.writeFileSync(path.join(blogDir,'index.html'), paginaListagem(artigos), 'utf8');
  console.log('  ✓ /blog/index.html (listagem)');

  // 2) uma pasta por artigo
  artigos.forEach((a, i)=>{
    const anterior = artigos[i+1] || null; // mais antigo
    const proximo  = artigos[i-1] || null; // mais novo
    const dir = path.join(blogDir, a.slug);
    fs.mkdirSync(dir, { recursive:true });
    fs.writeFileSync(path.join(dir,'index.html'), paginaArtigo(a, anterior, proximo), 'utf8');
    console.log(`  ✓ /blog/${a.slug}/`);
  });

  // 3) sitemap
  atualizarSitemap(artigos);

  console.log(`\nConcluído: listagem + ${artigos.length} artigos gerados.`);
  console.log('Revise no navegador, depois publique (git add / commit / push) e faça Purge no Cloudflare.');
}

main().catch(e=>{ console.error('ERRO:', e); process.exit(1); });
