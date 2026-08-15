#!/usr/bin/env node
/**
 * build-condominios.js
 * ---------------------------------------------------------------------------
 * Lê os condomínios do Supabase e preenche cada página estática
 * /nome-cidade/index.html com CONTEÚDO REAL no HTML (descrição, dados,
 * infraestrutura, diferenciais e lista de imóveis) — para que o Google
 * veja páginas completas em vez de "cascas" que só carregam via JavaScript.
 *
 * COMO RODAR (na raiz do site, onde estão as pastas dos condomínios):
 *   node build-condominios.js
 *
 * REQUISITOS:
 *   - Node 18+ (tem fetch nativo). Em Node mais antigo: npm i node-fetch e
 *     descomente a linha indicada abaixo.
 *
 * SEGURO:
 *   - NÃO apaga nada. Só INSERE um bloco <section class="cond-conteudo-full">
 *     antes do <footer>. Se rodar de novo, substitui o bloco (idempotente).
 *   - Se um condomínio não for encontrado no banco, a página é deixada como está.
 * ---------------------------------------------------------------------------
 */

// const fetch = require('node-fetch'); // <- descomente se estiver em Node < 18
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const HDR = { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY } };
const STORAGE = SUPABASE_URL + '/storage/v1/object/public/';

const FOOTER_COMPLETO = `<footer>
  <div class="ftr-wave"><svg viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0,30 C240,60 480,0 720,20 C960,40 1200,55 1440,25 L1440,60 L0,60 Z" fill="#0c4a6e"/></svg></div>
  <div class="ftr-main">
    <div class="ftr-col ftr-col-brand">
      <div class="ftr-logo"><img src="/img/logo-rodape.png" alt="Meu Litoral - O Portal do Litoral Gaúcho" class="ftr-logo-img" width="230" height="154" loading="lazy"></div>
      <p class="ftr-tag">Os melhores condomínios, imóveis e oportunidades de investimento no litoral norte gaúcho — de Osório a Maquiné.</p>
      <a class="ftr-wpp" href="https://wa.me/5551982868888"><svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 0 1 12 4z"/></svg> Falar no WhatsApp</a>
    </div>
    <div class="ftr-col">
      <div class="ftr-tit">Navegar</div>
      <div class="ftr-links-grid">
      <a href="/condominios">Condomínios</a>
      <a href="/imoveis" onclick="showAllImov();return false">Imóveis</a>
      <a href="/lancamentos">Lançamentos</a>
      <a href="/contemplado-imoveis">Crédito Contemplado</a>
      <a href="/financiamento-imobiliario">Financiamento</a><a href="/seguro-fianca">Seguro Fiança</a><a href="/refinanciamento-imobiliario">Refinanciamento</a><a href="/exclusividade-imobiliaria">Venda seu Imóvel</a><a href="/contato">Contato</a><a href="/sobre">Sobre</a><a href="/politica-privacidade">Política de Privacidade</a><a href="/termos">Termos de Uso</a>
    </div>
    </div>
    <div class="ftr-col">
      <div class="ftr-tit">Descobrir</div>
      <div class="ftr-links-grid">
      <a href="#guias-cidades" onclick="document.getElementById('guias-cidades').scrollIntoView({behavior:'smooth'});return false">Cidades</a>
      <a href="/o-que-fazer-em-capao-da-canoa" onclick="openTurismo();return false">Turismo no Litoral</a>
      <a href="/turismo" onclick="openTurismo();return false">Onde Ir</a>
      <a href="/blog" onclick="openBlog();return false">Blog &amp; Notícias</a>
    </div>
    </div>
    <div class="ftr-col">
      <div class="ftr-tit">Cidades</div>
      <div class="ftr-links-grid">
      <a href="/xangri-la">Xangri-lá</a>
      <a href="/capao-da-canoa">Capão da Canoa</a>
      <a href="/osorio">Osório</a>
      <a href="/maquine">Maquiné</a>
    </div>
    </div>
  </div>
  <div class="ftr-bottom">
    <span>© 2025 Os melhores condomínios do litoral · Todos os direitos reservados</span>
    <span class="ftr-bottom-r">Litoral Norte Gaúcho · RS</span>
  </div>
</footer>
`;
const FOOTER_CSS = `footer{flex-direction:column;align-items:flex-start;gap:8px;padding:10px 14px}
footer{padding:10px 14px;border-top:1px solid #e2e9ee;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;background:#f0f4f7}
footer{background:linear-gradient(160deg,#0c4a6e,#0e7490);padding:50px 44px 40px;margin-bottom:0}
footer{padding:16px 30px}
footer{padding:14px 22px;border-top:1px solid var(--border);display:flex;gap:9px;position:sticky;bottom:0;background:var(--white)}
footer{padding:38px 18px 20px}
footer{flex-direction:column}
footer{display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px solid #f0f0f0;margin-top:auto}
footer{position:relative;background:linear-gradient(165deg,#0c4a6e 0%,#0e7490 60%,#0891b2 100%);color:#fff;margin-bottom:0}
.ftr-wave{position:absolute;top:-1px;left:0;right:0;height:60px;line-height:0;transform:translateY(-99%)}
.ftr-main{max-width:1140px;margin:0 auto;padding:56px 44px 36px;display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:40px}
.ftr-col-brand{max-width:340px}
.ftr-logo{font-family:'Fraunces',serif;font-size:24px;font-weight:600;color:#fff;line-height:1.1}
.ftr-logo-img{width:230px;max-width:100%;height:auto;display:block}
.ftr-logo-img{width:200px;margin:0 auto}
.ftr-sub{font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.45);margin-top:6px}
.ftr-tag{font-size:13px;line-height:1.6;color:rgba(255,255,255,.6);margin:18px 0 22px}
.ftr-wpp{display:inline-flex;align-items:center;gap:8px;background:rgba(8,32,48,.45);border:1px solid rgba(255,255,255,.2);color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:11px 20px;border-radius:100px;transition:all .25s}
.ftr-tit{font-family:'Outfit',sans-serif;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin-bottom:16px}
.ftr-bottom{max-width:1140px;margin:0 auto;padding:20px 44px;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center;font-size:11px;color:rgba(255,255,255,.4);letter-spacing:.02em}
.ftr-main{grid-template-columns:1fr 1fr;gap:32px 24px;padding:48px 24px 28px}
.ftr-col-brand{grid-column:1/-1;max-width:none}
.ftr-main{grid-template-columns:1fr;gap:0;padding:44px 26px 24px}
.ftr-bottom{flex-direction:column;gap:6px;text-align:center;padding:18px 24px}
.ftr-wave{height:36px;transform:translateY(-99%)}
.ftr-col-brand{text-align:center;padding-bottom:28px;margin-bottom:24px;border-bottom:1px solid rgba(255,255,255,.12)}
.ftr-logo-svg{margin:0 auto}
.ftr-tag{margin:16px auto 20px;max-width:300px}
.ftr-wpp{display:flex;justify-content:center;width:100%;box-sizing:border-box;font-size:15px;padding:15px 26px;background:#0f7c3f;border-color:#0f7c3f;color:#fff;font-weight:700;box-shadow:0 8px 22px rgba(15,124,63,.35)}
.ftr-tit{font-size:11px;margin-bottom:14px;padding-bottom:9px;border-bottom:1px solid rgba(224,179,77,.28)}
.ftr-tit{grid-column:1/-1}
.ftr-links-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 18px}
.ftr-bottom{gap:4px;padding:22px 24px 26px;margin-top:20px;border-top:1px solid rgba(255,255,255,.1)}
.ftr-bottom-r{font-size:11px;color:var(--gold);opacity:.85;letter-spacing:.1em;text-transform:uppercase;font-weight:600}
.ftr-links-grid{grid-template-columns:1fr 1fr;gap:2px 12px}
footer{margin-top:36px;padding-top:24px;border-top:1px solid #e8e8e8}
.ftr-wave{height:36px}
`;

const HEADER_COMPLETO = `<header class="desk-header" id="desk-header">
  <div class="desk-header-inner">
    <a class="dh-logo" href="/" aria-label="Condomínios na Praia — início"></a>
    <nav class="dh-nav">
      <a href="/" onclick="if(window.irParaBusca){irParaBusca();return false;}">Início</a>
      <a href="/imoveis">Imóveis</a>
      <a href="/condominios">Condomínios</a>
      <a href="/lancamentos">Lançamentos</a>
      <a href="/contemplado-imoveis">Crédito</a>
      <a href="/turismo">Turismo</a>
      <a href="/sobre">Sobre</a>
      <a href="/contato">Contato</a>
    </nav>
    <a class="dh-cta" href="https://wa.me/5551982868888" target="_blank" rel="nofollow">
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487 2.981 1.287 2.981.858 3.518.804.537-.054 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
      WhatsApp
    </a>
  </div>
</header>
`;
const HEADER_CSS = `/* Cabeçalho fixo desktop */
.desk-header{position:fixed;top:0;left:0;right:0;z-index:930;padding:0;margin:0;background:rgba(255,255,255,.82);backdrop-filter:blur(16px) saturate(160%);-webkit-backdrop-filter:blur(16px) saturate(160%);border-bottom:1px solid rgba(31,181,196,.14);box-shadow:0 2px 20px rgba(13,59,84,.06)}
.desk-header-inner{max-width:1240px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;gap:14px;height:56px;box-sizing:border-box}
.dh-logo{display:flex;align-items:center;flex-shrink:0}
.dh-logo img{height:44px;width:auto;display:block}
.dh-nav{display:flex;align-items:center;gap:1px;flex-wrap:nowrap;justify-content:center;flex:1;min-width:0}
.dh-nav a{color:#0d3b54;text-decoration:none;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:7px 9px;border-radius:100px;transition:all .2s;white-space:nowrap}
.dh-nav a:hover{background:rgba(31,181,196,.12);color:#0e8a99}
.dh-cta{display:inline-flex;align-items:center;gap:6px;background:#25d366;color:#fff;text-decoration:none;font-weight:700;font-size:13.5px;padding:9px 16px;border-radius:100px;flex-shrink:0;transition:transform .2s,box-shadow .2s;box-shadow:0 4px 14px rgba(37,211,102,.3)}
.dh-cta:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(37,211,102,.45)}`;


const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const fmtPreco = v => {
  if (v == null || v === '') return '';
  const n = Number(String(v).replace(/[^\d]/g, ''));
  if (!n) return '';
  return 'R$ ' + n.toLocaleString('pt-BR');
};

const SITE_ORIGIN = 'https://condominiosnapraia.com.br';
const CDN_ORIGIN = SITE_ORIGIN + '/cdn-fotos/';

const fotoUrl = raw => {
  if (!raw) return '';
  const s = String(raw).trim();
  if (s.startsWith('data:') || s.startsWith('blob:')) return s;
  if (s.startsWith('/cdn-fotos/')) return SITE_ORIGIN + s;
  if (s.startsWith(STORAGE)) return CDN_ORIGIN + s.slice(STORAGE.length).replace(/^\/+/, '');
  if (/^https?:\/\//i.test(s)) return s;
  return CDN_ORIGIN + s.replace(/^\/+/, '');
};

const fotoVariante = (raw, width, format = 'webp', quality = 78) => {
  const base = fotoUrl(raw).split('?')[0];
  if (!base || !base.startsWith(CDN_ORIGIN)) return base;
  return `${base}?w=${width}&q=${quality}&fmt=${format}`;
};

const fotoSrcset = raw => {
  const base = fotoUrl(raw).split('?')[0];
  if (!base || !base.startsWith(CDN_ORIGIN)) return '';
  return [320, 480, 640, 768, 960, 1280]
    .map(width => `${fotoVariante(base, width, 'webp')} ${width}w`)
    .join(', ');
};

const fotoTag = (raw, alt, { sizes = '100vw', width = 640, height = 384, eager = false } = {}) => {
  const base = fotoUrl(raw);
  if (!base) return '';
  const src = base.startsWith(CDN_ORIGIN) ? fotoVariante(base, width, 'jpeg') : base;
  const set = fotoSrcset(base);
  const attrs = set ? ` srcset="${esc(set)}" sizes="${esc(sizes)}"` : '';
  return `<img src="${esc(src)}"${attrs} alt="${esc(alt)}" width="${width}" height="${height}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''} style="width:100%;height:200px;object-fit:cover;border-radius:12px;display:block">`;
};

// Identificadores internos não podem aparecer nos títulos dos cards públicos.
const tituloPublico = value => String(value || 'Imóvel')
  .replace(/\b(?:unidade|apt(?:o)?|apartamento|torre|quadra|lote|box|casa)\s*(?:n[ºo°.]?\s*)?(?:[a-z]*\d[a-z0-9-]*)\b/gi, '')
  .replace(/\s{2,}/g, ' ')
  .replace(/\s*([,·|])\s*([,·|])/g, '$1')
  .replace(/^\s*[-–—,:·|]+\s*|\s*[-–—,:·|]+\s*$/g, '')
  .trim() || 'Imóvel no condomínio';

// monta os parágrafos a partir de um campo de texto (quebra em \n\n)
const paras = txt => String(txt || '')
  .split(/\n{2,}|\r\n\r\n/).map(p => p.trim()).filter(Boolean)
  .map(p => `<p style="color:#33454f;line-height:1.7;margin-bottom:12px;font-size:15px">${esc(p)}</p>`).join('\n');

function blocoConteudo(cond, imoveis) {
  const nome = cond.nome || 'Condomínio';
  const cidade = cond.cidade || 'Litoral Norte Gaúcho';
  const partes = [];

  partes.push(`<section class="cond-conteudo-full" style="max-width:1000px;margin:0 auto;padding:24px 24px 44px">`);

  // Galeria de fotos (do banco — URLs completas)
  let fotos = cond.fotos_no_site || cond.fotos || [];
  if (typeof fotos === 'string') { try { fotos = JSON.parse(fotos); } catch (_) { fotos = fotos.split(/[;\n]/); } }
  fotos = (Array.isArray(fotos) ? fotos : []).map(f => String(f).trim()).filter(f => f.startsWith('http'));
  if (fotos.length) {
    partes.push(`<h2 style="font-family:'Fraunces',serif;font-size:23px;color:#0d3b54;margin:8px 0 14px">Fotos do ${esc(nome)}</h2>`);
    partes.push(`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;margin-bottom:26px">`);
    fotos.slice(0, 24).forEach((src, i) => {
      partes.push(fotoTag(src, `${nome} — foto ${i + 1} — ${cidade}`, {sizes:'(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 240px', width:640, height:480, eager:i===0}));
    });
    partes.push(`</div>`);
  }

  // Descrição / história
  const descricao = cond.historia_condominio || cond.descricao;
  if (descricao) {
    partes.push(`<h2 style="font-family:'Fraunces',serif;font-size:23px;color:#0d3b54;margin:18px 0 12px">Sobre o ${esc(nome)}</h2>`);
    partes.push(paras(descricao));
  }

  // Dados rápidos (só os que existirem)
  const dados = [];
  if (cond.ano) dados.push(['Ano', cond.ano]);
  if (cond.padrao) dados.push(['Padrão', cond.padrao]);
  if (cond.area) dados.push(['Área', cond.area]);
  if (cond.lotes) dados.push(['Lotes', cond.lotes]);
  if (cond.incorporadora) dados.push(['Incorporadora', cond.incorporadora]);
  if (Array.isArray(imoveis) && imoveis.length) dados.push(['Imóveis disponíveis', imoveis.length]);
  if (dados.length) {
    partes.push(`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;background:#e5ded3;border:1px solid #e5ded3;border-radius:10px;overflow:hidden;margin:20px 0">`);
    dados.forEach(([l, v]) => {
      partes.push(`<div style="background:#fff;padding:14px 16px"><div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#5b7585">${esc(l)}</div><div style="font-family:'Fraunces',serif;font-size:19px;color:#0d3b54;margin-top:4px">${esc(v)}</div></div>`);
    });
    partes.push(`</div>`);
  }

  // Infraestrutura detalhada
  if (cond.infraestrutura_detalhada) {
    partes.push(`<h2 style="font-family:'Fraunces',serif;font-size:20px;color:#0d3b54;margin:26px 0 10px">Infraestrutura</h2>`);
    partes.push(paras(cond.infraestrutura_detalhada));
  }

  // Amenidades (lista de tags)
  let amen = cond.amenidades;
  if (typeof amen === 'string') { try { amen = JSON.parse(amen); } catch (_) { amen = amen.split(/[;,]/); } }
  if (Array.isArray(amen) && amen.length) {
    partes.push(`<div style="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 18px">`);
    amen.map(a => String(a).trim()).filter(Boolean).forEach(a => {
      partes.push(`<span style="background:rgba(14,138,153,.09);color:#0c4a6e;font-size:13px;padding:6px 13px;border-radius:100px">${esc(a)}</span>`);
    });
    partes.push(`</div>`);
  }

  // Localização
  if (cond.localizacao_detalhada) {
    partes.push(`<h2 style="font-family:'Fraunces',serif;font-size:20px;color:#0d3b54;margin:26px 0 10px">Localização</h2>`);
    partes.push(paras(cond.localizacao_detalhada));
  }

  // Mercado imobiliário
  if (cond.mercado_imobiliario) {
    partes.push(`<h2 style="font-family:'Fraunces',serif;font-size:20px;color:#0d3b54;margin:26px 0 10px">Mercado e Valorização</h2>`);
    partes.push(paras(cond.mercado_imobiliario));
  }

  // Diferenciais
  let dif = cond.diferenciais;
  if (typeof dif === 'string' && dif.trim().startsWith('[')) { try { dif = JSON.parse(dif); } catch (_) {} }
  if (Array.isArray(dif) && dif.length) {
    partes.push(`<h2 style="font-family:'Fraunces',serif;font-size:20px;color:#0d3b54;margin:26px 0 10px">Diferenciais</h2>`);
    partes.push(`<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px">`);
    dif.map(d => String(d).trim()).filter(Boolean).forEach(d => {
      partes.push(`<span style="background:rgba(224,179,77,.14);color:#8a6428;font-size:13px;padding:6px 13px;border-radius:100px">${esc(d)}</span>`);
    });
    partes.push(`</div>`);
  } else if (typeof dif === 'string' && dif.trim()) {
    partes.push(`<h2 style="font-family:'Fraunces',serif;font-size:20px;color:#0d3b54;margin:26px 0 10px">Diferenciais</h2>`);
    partes.push(paras(dif));
  }

  // Imóveis à venda (lista real, com link para cada imóvel)
  if (Array.isArray(imoveis) && imoveis.length) {
    partes.push(`<h2 style="font-family:'Fraunces',serif;font-size:20px;color:#0d3b54;margin:26px 0 12px">Imóveis à venda no ${esc(nome)}</h2>`);
    partes.push(`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px">`);
    imoveis.forEach(im => {
      const tit = tituloPublico(im.titulo || im.nome || (im.tipo ? im.tipo + ' em ' + nome : 'Imóvel'));
      const preco = fmtPreco(im.preco || im.valor);
      const foto = fotoUrl((Array.isArray(im.fotos) ? im.fotos[0] : im.foto) || '');
      const slugImovel = im.slug ? String(im.slug).replace(/^\/+|\/+$/g, '') : '';
      const href = slugImovel ? '/imovel/' + slugImovel + '/' : (im.id ? '/imovel/?id=' + encodeURIComponent(im.id) : '#');
      partes.push(`<a href="${esc(href)}" style="display:block;border:1px solid #e5ded3;border-radius:12px;overflow:hidden;text-decoration:none;background:#fff">`);
      if (foto) partes.push(fotoTag(foto, `${tit} — ${cidade}`, {sizes:'(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 260px', width:640, height:384}));
      partes.push(`<div style="padding:12px 14px"><div style="font-size:14px;color:#0d3b54;font-weight:600;line-height:1.35">${esc(tit)}</div>${preco ? `<div style="font-family:'Fraunces',serif;font-size:17px;color:#0c4a6e;margin-top:6px">${esc(preco)}</div>` : ''}</div>`);
      partes.push(`</a>`);
    });
    partes.push(`</div>`);
  }

  // Fecho com link para a cidade
  const cidadeSlug = String(cidade).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
  partes.push(`<p style="color:#33454f;line-height:1.7;font-size:15px;margin-top:22px">Explore outros <a href="/${cidadeSlug}" style="color:#0e7490">condomínios em ${esc(cidade)}</a> ou fale com a nossa equipe de corretores para agendar uma visita ao ${esc(nome)}.</p>`);

  partes.push(`</section>`);
  return partes.join('\n');
}

function preencherPagina(filerel, cond, imoveis) {
  const file = path.join(process.cwd(), filerel);
  let h = fs.readFileSync(file, 'utf8');
  const bloco = blocoConteudo(cond, imoveis);

  // remove bloco antigo (idempotência) — tanto o full quanto o texto-seo simples
  h = h.replace(/<section class="cond-conteudo-full"[^>]*>[\s\S]*?<\/section>\s*/g, '');
  h = h.replace(/<section class="cond-texto-seo"[\s\S]*?<\/section>\s*/g, '');

  const idx = h.indexOf('<footer');
  if (idx === -1) { console.warn('  ! sem <footer>, pulando', filerel); return false; }
  h = h.slice(0, idx) + bloco + '\n' + h.slice(idx);

  // Troca o cabeçalho simplificado pelo cabeçalho completo do site (com links rápidos)
  if (h.indexOf('desk-header') === -1) {
    h = h.replace(/<header>[\s\S]*?<\/header>/, HEADER_COMPLETO);
    if (h.indexOf('.desk-header{') === -1) {
      const he2 = h.indexOf('</head>');
      const sc2 = h.lastIndexOf('</style>', he2 === -1 ? h.length : he2);
      const cssH = '\n' + HEADER_CSS + '\n';
      if (sc2 !== -1) h = h.slice(0, sc2) + cssH + h.slice(sc2);
      else h = h.replace('</head>', '<style>' + HEADER_CSS + '</style>\n</head>');
    }
  }

  // Troca o footer simplificado pelo footer completo do site (com logo Meu Litoral)
  if (h.indexOf('ftr-main') === -1) {
    h = h.replace(/<footer>[\s\S]*?<\/footer>/, FOOTER_COMPLETO);
    // injeta o CSS do footer antes do </style> (ou </head>) se ainda não houver
    if (h.indexOf('.ftr-main{') === -1) {
      const he = h.indexOf('</head>');
      const sc = h.lastIndexOf('</style>', he === -1 ? h.length : he);
      const cssBlock = '\n' + FOOTER_CSS + '\n';
      if (sc !== -1) h = h.slice(0, sc) + cssBlock + h.slice(sc);
      else h = h.replace('</head>', '<style>' + FOOTER_CSS + '</style>\n</head>');
    }
  }

  fs.writeFileSync(file, h, 'utf8');
  return true;
}

async function main() {
  console.log('Lendo condomínios do Supabase...');
  const [condResp, imovResp] = await Promise.all([
    fetch(SUPABASE_URL + '/rest/v1/condominios?select=*', HDR),
    fetch(SUPABASE_URL + '/rest/v1/imoveis?select=*', HDR),
  ]);
  const condominios = await condResp.json();
  const imoveis = await imovResp.json();
  console.log(`  ${condominios.length} condomínios, ${imoveis.length} imóveis`);

  // agrupa imóveis por condomínio
  const imPorCond = {};
  imoveis.forEach(im => {
    const k = im.cond_id != null ? String(im.cond_id) : null;
    if (k == null) return;
    (imPorCond[k] = imPorCond[k] || []).push(im);
  });

  let ok = 0, faltando = 0;
  for (const cond of condominios) {
    // a pasta da página é o slug do condomínio
    const slug = cond.slug || (cond.nome || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filerel = path.join(slug, 'index.html');
    if (!fs.existsSync(path.join(process.cwd(), filerel))) { faltando++; continue; }
    const ims = imPorCond[String(cond.id)] || cond.imoveis || [];
    if (preencherPagina(filerel, cond, Array.isArray(ims) ? ims : [])) {
      ok++;
      console.log(`  ✓ ${slug}`);
    }
  }
  console.log(`\nConcluído: ${ok} páginas preenchidas, ${faltando} sem pasta correspondente.`);
  console.log('Revise algumas páginas e publique normalmente (git add / commit / push).');
}

main().catch(e => { console.error('ERRO:', e); process.exit(1); });
