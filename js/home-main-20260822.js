const WPP = '5551982868888';
const brl = n => { if(!n) return '—'; const num=Number(String(n).replace(/\./g,'').replace(',','.')); if(isNaN(num)) return '—'; return num.toLocaleString('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:2,maximumFractionDigits:2}); };
const m2  = n => n ? Number(n).toLocaleString('pt-BR')+'m²' : '—';
const mob = () => window.innerWidth <= 960;

// ── DATA ──
const DEFAULTS=[
  {id:'santorini-bairro-planejado',nome:'Santorini - Bairro Planejado',descricao:'Primeiro bairro planejado do litoral norte com infraestrutura urbana completa.',localizacao:'Xangri-lá',padrao:'Super Luxo',tipo:'Bairro Planejado',amenidades:['Bairro planejado','Hospital-dia','Áreas comerciais','Segurança 24h','Infraestrutura urbana'],fotos:[],imoveis:[],ativo:true},
  {id:'sense-xangri-la',nome:'Sense Xangri-La',descricao:'Condomínio sensorial com design premium e sofisticado.',localizacao:'Xangri-lá',padrao:'Luxo',tipo:'Fechado',amenidades:['Design premium','Piscina','Spa','Segurança 24h'],fotos:[],imoveis:[],ativo:true},
  {id:'enseada-lagos-de-xangri-la',nome:'Enseada Lagos de Xangri-La',descricao:'Condomínio com lagos artificiais e infraestrutura premium.',localizacao:'Xangri-lá',padrao:'Alto Padrão',tipo:'Fechado',amenidades:['Lagos','Piscina','Segurança 24h','Espaço gourmet'],fotos:[],imoveis:[],ativo:true},
  {id:'acqualina-beach',nome:'Acqualina Beach',descricao:'Condomínio de luxo com acesso à praia e infraestrutura premium.',localizacao:'Xangri-lá',padrao:'Luxo',tipo:'Fechado',amenidades:['Acesso à praia','Piscina','Spa','Segurança 24h'],fotos:[],imoveis:[],ativo:true},
  {id:'capao-ilhas-resort',nome:'Capão Ilhas Resort',descricao:'Resort em Capão da Canoa com completa infraestrutura.',localizacao:'Capão da Canoa',padrao:'Alto Padrão',tipo:'Resort',amenidades:['Resort','Piscina','Spa','Segurança 24h'],fotos:[],imoveis:[],ativo:true},
  {id:'condado-de-capao',nome:'Condado de Capão',descricao:'Condomínio em Capão da Canoa com estilo europeu.',localizacao:'Capão da Canoa',padrao:'Alto Padrão',tipo:'Fechado',amenidades:['Estilo europeu','Piscina','Segurança','Portaria'],fotos:[],imoveis:[],ativo:true},
  {id:'amana-atlantida',nome:'Amaná Atlântida',descricao:'Condomínio em Atlântida com natureza e infraestrutura.',localizacao:'Atlântida',padrao:'Alto Padrão',tipo:'Fechado',amenidades:['Áreas verdes','Piscina','Portaria','Segurança'],fotos:[],imoveis:[],ativo:true},
  {id:'bosques-de-atlantida',nome:'Bosques de Atlântida',descricao:'Condomínio em meio à natureza com preservação ambiental.',localizacao:'Atlântida',padrao:'Alto Padrão',tipo:'Fechado',amenidades:['Áreas verdes','Trilhas','Piscina','Segurança'],fotos:[],imoveis:[],ativo:true},
  {id:'green-village-golf-club',nome:'Green Village Golf Club',descricao:'Condomínio com campo de golfe e infraestrutura de luxo.',localizacao:'Xangri-lá',padrao:'Luxo',tipo:'Club',amenidades:['Campo de golfe','Clube','Piscina','Segurança 24h'],fotos:[],imoveis:[],ativo:true},
  {id:'monaco-grand-marina',nome:'Mônaco Grand Marina',descricao:'Grand marina residencial com luxo europeu.',localizacao:'Xangri-lá',padrao:'Super Luxo',tipo:'Marina',amenidades:['Marina','Luxo europeu','Piscina','Segurança 24h'],fotos:[],imoveis:[],ativo:true},
  {id:'royal-lake',nome:'Royal Lake',descricao:'Condomínio royal à beira de lago com luxo.',localizacao:'Xangri-lá',padrao:'Luxo',tipo:'Fechado',amenidades:['Lago','Piscina','Segurança 24h'],fotos:[],imoveis:[],ativo:true},
  {id:'bravia-marina-beach-club',nome:'Bravia Marina & Beach Club',descricao:'Marina residencial com acesso à praia e clube exclusivo.',localizacao:'Xangri-lá',padrao:'Alto Padrão',tipo:'Marina',amenidades:['Marina','Acesso à praia','Clube','Segurança'],fotos:[],imoveis:[],ativo:true},
  {id:'dubai-resort',nome:'Dubai Resort Residencial',descricao:'Residencial inspirado em Dubai com luxo e segurança.',localizacao:'Xangri-lá',padrao:'Super Luxo',tipo:'Resort',amenidades:['Luxo','Piscina','Segurança 24h','Espaço gourmet'],fotos:[],imoveis:[],ativo:true},
  {id:'cyano-private-resort',nome:'Cyano Private Resort',descricao:'Resort privado com completo lazer e bem-estar.',localizacao:'Xangri-lá',padrao:'Luxo',tipo:'Resort',amenidades:['Resort privado','Spa','Piscina','Academia'],fotos:[],imoveis:[],ativo:true},
  {id:'la-plage',nome:'La Plage',descricao:'Condomínio francês com acesso à praia e design elegante.',localizacao:'Xangri-lá',padrao:'Alto Padrão',tipo:'Fechado',amenidades:['Acesso à praia','Piscina','Segurança','Espaço gourmet'],fotos:[],imoveis:[],ativo:true},
  {id:'ocean-side',nome:'Ocean Side',descricao:'Condomínio à beira-mar com design moderno.',localizacao:'Xangri-lá',padrao:'Alto Padrão',tipo:'Fechado',amenidades:['Beira-mar','Piscina','Segurança'],fotos:[],imoveis:[],ativo:true},
  {id:'peninsula',nome:'Península',descricao:'Condomínio em península com acesso exclusivo à praia.',localizacao:'Xangri-lá',padrao:'Luxo',tipo:'Fechado',amenidades:['Acesso à praia','Piscina','Segurança'],fotos:[],imoveis:[],ativo:true},
  {id:'zen-concept-resort',nome:'Zen Concept Resort',descricao:'Resort residencial com conceito zen e bem-estar.',localizacao:'Xangri-lá',padrao:'Alto Padrão',tipo:'Resort',amenidades:['Zen','Bem-estar','Spa','Piscina'],fotos:[],imoveis:[],ativo:true},
  {id:'riviera',nome:'Riviera',descricao:'Condomínio inspirado na Riviera Francesa.',localizacao:'Xangri-lá',padrao:'Luxo',tipo:'Fechado',amenidades:['Piscina','Segurança','Espaço gourmet'],fotos:[],imoveis:[],ativo:true},
  {id:'sunset',nome:'Sunset',descricao:'Condomínio com vista para o pôr do sol.',localizacao:'Xangri-lá',padrao:'Alto Padrão',tipo:'Fechado',amenidades:['Vista pôr do sol','Piscina','Segurança'],fotos:[],imoveis:[],ativo:true},
];

// ══════════════════════════════════════════
// SUPABASE — mesmas credenciais do CRM
// ══════════════════════════════════════════
const SUPABASE_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';

const sbSite = {
  h: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY },
  async get(table, params=''){
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}${params}`, {headers:this.h});
    return r.json();
  },
  async getConfig(chave){
    const r = await this.get('configuracoes', `?chave=eq.${chave}&select=valor`);
    return r[0]?.valor ?? null;
  }
};

// Cache do site
let _siteCache = null;
let _siteCacheTs = 0;
try{ if(location.search.indexOf('debugfotos')>-1) window._DEBUG_FOTOS=true; }catch(e){}
const SITE_CACHE_TTL = 180000; // 3 minutos
// Recuperar cache da sessão (navegação entre páginas fica instantânea)
try{
  const _cached = sessionStorage.getItem('_siteCacheV2');
  const _cachedTs = parseInt(sessionStorage.getItem('_siteCacheTsV2')||'0');
  if(_cached && (Date.now()-_cachedTs) < SITE_CACHE_TTL){
    const _parsed = JSON.parse(_cached);
    const _hasVerticalFields = Array.isArray(_parsed?.condominios) && _parsed.condominios.every(c => Object.prototype.hasOwnProperty.call(c,'orientacao') && Object.prototype.hasOwnProperty.call(c,'perfil'));
    if(_hasVerticalFields){
      _siteCache = _parsed;
      _siteCacheTs = _cachedTs;
    }else{
      sessionStorage.removeItem('_siteCacheV2');
      sessionStorage.removeItem('_siteCacheTsV2');
    }
  }
}catch(e){}


// ── SITE CONFIG ──
function applySiteConfigObj(cfg){
  try{
    if(cfg.nome) document.querySelectorAll('.site-nome').forEach(el=>el.textContent=cfg.nome);
    if(cfg.hero_titulo){const h=document.querySelector('.hero-h1');if(h)h.innerHTML=cfg.hero_titulo;}
  }catch(e){console.warn('applySiteConfigObj:',e);}
}
function applyTurismoConfig(cfg){
  try{
    if(!cfg) return;
    // apply turismo config
  }catch(e){console.warn('applyTurismoConfig:',e);}
}
function applyCtConfig(cfg){
  try{
    if(!cfg) return;
    if(cfg.badge){const b=document.getElementById('ct-badge');if(b)b.textContent=cfg.badge;}
    if(cfg.titulo){const t=document.getElementById('ct-title');if(t)t.innerHTML=cfg.titulo;}
  }catch(e){console.warn('applyCtConfig:',e);}
}

const STORAGE_PUBLIC_PREFIX = SUPABASE_URL + '/storage/v1/object/public/';

function fotoPublica(raw) {
  const s = String(raw || '').trim();
  if (!s) return '';
  if (s.startsWith('data:') || s.startsWith('blob:')) return s;
  if (s.startsWith('/cdn-fotos/')) return s;
  if (s.startsWith(STORAGE_PUBLIC_PREFIX)) return '/cdn-fotos/' + s.slice(STORAGE_PUBLIC_PREFIX.length).replace(/^\/+/, '');
  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s, window.location.origin);
      if (u.origin === window.location.origin && u.pathname.startsWith('/cdn-fotos/')) {
        return u.pathname + u.search;
      }
    } catch (_) {}
    return s;
  }
  return '/cdn-fotos/' + s.replace(/^\/+/, '');
}

function fotoVariante(raw, width, format = 'webp', quality = 78) {
  const base = fotoPublica(raw).split('?')[0];
  if (!base || !base.startsWith('/cdn-fotos/')) return base;
  return `${base}?w=${width}&q=${quality}&fmt=${format}&v=3`;
}

function fotoSrcset(raw, format = 'webp', quality = 78) {
  const base = fotoPublica(raw).split('?')[0];
  if (!base || !base.startsWith('/cdn-fotos/')) return '';
  return [320, 480, 640, 768, 960, 1280].map((width) => `${fotoVariante(base, width, format, quality)} ${width}w`).join(', ');
}

function escapeAttr(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function fotoTag(raw, alt, options = {}) {
  const {className = '', sizes = '100vw', width = 640, height = 384, eager = false, fetchPriority = false, deferLoad = false} = options;
  const base = fotoPublica(raw);
  if (!base) return '';
  const loading = eager ? 'eager' : 'lazy';
  const priority = fetchPriority ? ' fetchpriority="high"' : '';
  const srcset = fotoSrcset(base, 'webp');
  const src = base.startsWith('/cdn-fotos/') ? fotoVariante(base, width, 'jpeg') : base;
  const srcAttr = deferLoad ? ` data-lazy-src="${escapeAttr(src)}"` : ` src="${escapeAttr(src)}"`;
  const srcsetAttr = srcset ? `${deferLoad ? ' data-lazy-srcset' : ' srcset'}="${escapeAttr(srcset)}" sizes="${escapeAttr(sizes)}"` : '';
  return `<img class="${escapeAttr(className)}"${srcAttr}${srcsetAttr} width="${width}" height="${height}" loading="${loading}" decoding="async"${priority} alt="${escapeAttr(alt)}">`;
}

// Adia somente a transferência das imagens de cards que estão longe da viewport.
// O texto, os links e as dimensões permanecem no DOM para preservar SEO e CLS.
function ativarImagensAdidas(root = document) {
  const imagens = Array.from(root.querySelectorAll('img[data-lazy-src], img[data-lazy-srcset]'));
  if (!imagens.length) return;
  const carregar = img => {
    const srcset = img.getAttribute('data-lazy-srcset');
    if (srcset) {
      img.setAttribute('srcset', srcset);
      img.removeAttribute('data-lazy-srcset');
    }
    const src = img.getAttribute('data-lazy-src');
    if (src) {
      img.setAttribute('src', src);
      img.removeAttribute('data-lazy-src');
    }
  };
  if (!('IntersectionObserver' in window)) {
    imagens.forEach(carregar);
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      carregar(entry.target);
    });
  }, {rootMargin: '300px 0px'});
  imagens.forEach(img => observer.observe(img));
}

const HOME_COND_SELECT_MIN = [
  'id','slug','nome','cidade','descricao','amenidades','ativo','orientacao','perfil','fotos_no_site'
].join(',');

const HOME_IMOV_SELECT_MIN = [
  'id','slug','codigo','titulo','cond_id','fora_condominio','status','publicar',
  'tipo','preco','quartos','suites','banheiros','vagas','area','area_privativa','fotos_no_site',
  'area_construida','terreno','cidade_end','bairro_end'
].join(',');

// A seleção completa fica reservada para hashes legados de detalhe, que ainda usam
// localização, metadados e campos de infraestrutura no mesmo documento.
const HOME_COND_SELECT = [
  'id','slug','nome','cidade','bairro','descricao','padrao','tipo','amenidades',
  'fotos','fotos_no_site','ativo','latitude','longitude','area_total_m2','lotes',
  'incorporadora','ano','endereco','maps'
].join(',');

const HOME_IMOV_SELECT = [
  'id','slug','codigo','titulo','cond_id','fora_condominio','status','publicar',
  'finalidade','tipo','preco','quartos','suites','banheiros','vagas','area',
  'area_privativa','area_construida','terreno','cidade_end','bairro_end',
  'fotos','fotos_no_site','created_at'
].join(',');

let _extrasPromise = null;
let _homeConfigPromise = null;
function agendarConfigHome(){
  const job=function(){
    if(_homeConfigPromise) return;
    const CHAVES=['destaques_cond','destaques_imov','destaques_terreno','destaques_capao','destaques_xangri','site_config','turismo_config','fotos_site'];
    _homeConfigPromise=sbSite.get('configuracoes','?chave=in.('+CHAVES.join(',')+')&select=chave,valor').then(function(rows){
      const cfg={}; (Array.isArray(rows)?rows:[]).forEach(function(c){cfg[c.chave]=c.valor;});
      if(!_siteCache) return;
      _siteCache.destCond=cfg.destaques_cond||[]; _siteCache.destImov=cfg.destaques_imov||[]; _siteCache.destTerreno=cfg.destaques_terreno||[];
      _siteCache.destCapao=cfg.destaques_capao||[]; _siteCache.destXangri=cfg.destaques_xangri||[];
      _siteCache.siteCfg=cfg.site_config||{}; _siteCache.turismoCfg=cfg.turismo_config||{}; window._fotosSiteMap=cfg.fotos_site||null;
      // As capas chegam em modo adiado; reaplica as fotos depois que o mapa estiver disponível.
      try{if(window.ativarFotosCards)window.ativarFotosCards();}catch(e){}
      try{if(_siteCache.siteCfg&&Object.keys(_siteCache.siteCfg).length&&typeof applySiteConfigObj==='function')applySiteConfigObj(_siteCache.siteCfg);}catch(e){}
      try{if(_siteCache.turismoCfg&&_siteCache.turismoCfg.turismo&&typeof applyTurismoConfig==='function')applyTurismoConfig(_siteCache.turismoCfg.turismo);}catch(e){}
      try{buildHomeDestaques();renderDestaquesCidade();}catch(e){}
    }).catch(function(){_homeConfigPromise=Promise.resolve(null);});
  };
  const schedule=function(){
    if('requestIdleCallback' in window) requestIdleCallback(job,{timeout:5000});
    else setTimeout(job,1800);
  };
  if(document.readyState==='complete') schedule();
  else window.addEventListener('load',schedule,{once:true});
}
async function carregarDadosExtras(){
  if(window._dadosExtrasCarregados) return;
  if(!_extrasPromise){
    _extrasPromise = Promise.all([
      sbSite.get('os_carrossel_home', '?select=slot,foto_url').catch(function(){ return []; }),
      sbSite.get('os_capas_decisao', '?select=slug,foto_url').catch(function(){ return []; })
    ]).then(function(result){
      window._carrosselFotos = Array.isArray(result[0]) ? result[0] : [];
      window._capasDecisao = Array.isArray(result[1]) ? result[1] : [];
      window._dadosExtrasCarregados = true;
    }).catch(function(){
      window._carrosselFotos = [];
      window._capasDecisao = [];
      window._dadosExtrasCarregados = true;
    });
  }
  return _extrasPromise;
}

async function fetchSiteData(){
  const now = Date.now();
  if(_siteCache && (now - _siteCacheTs) < SITE_CACHE_TTL){
    // O cache de sessão não carrega as configurações editoriais; reagenda as capas.
    agendarConfigHome();
    return _siteCache;
  }
  try{
    // A homepage usa uma seleção mínima; hashes de detalhe mantêm compatibilidade
    // com o conjunto completo de metadados e infraestrutura.
    const hashLegado = /^#(cond|imovel)\//.test(location.hash||'');
    const condSelect = hashLegado ? HOME_COND_SELECT : HOME_COND_SELECT_MIN;
    const imovSelect = hashLegado ? HOME_IMOV_SELECT : HOME_IMOV_SELECT_MIN;
    const [condominiosRaw, imoveisRaw] = await Promise.all([
      sbSite.get('condominios', `?ativo=eq.true&select=${encodeURIComponent(condSelect)}&order=nome.asc`),
      sbSite.get('imoveis', `?status=eq.Disponível&publicar=eq.true&select=${encodeURIComponent(imovSelect)}&order=created_at.asc`)
    ]);
    // Registros antigos que ainda não têm fotos_no_site recebem apenas o campo
    // legado em uma segunda consulta enxuta; no cadastro atual essa leva é zero.
    async function hidratarFotosLegadas(rows, table, habilitarFotos){
      if(!habilitarFotos || hashLegado || !Array.isArray(rows) || !rows.length) return rows;
      const ids=rows.filter(row=>!row.fotos_no_site && row.id).map(row=>String(row.id));
      if(!ids.length) return rows;
      try{
        const fallback=await sbSite.get(table, `?id=in.(${ids.join(',')})&select=id,fotos`);
        const mapa={};
        (Array.isArray(fallback)?fallback:[]).forEach(row=>{mapa[row.id]=row.fotos;});
        return rows.map(row=>row.fotos_no_site?row:{...row,fotos_no_site:mapa[row.id]||null});
      }catch(_){ return rows; }
    }
    const [condominios, imoveis] = await Promise.all([
      hidratarFotosLegadas(condominiosRaw,'condominios',condSelect.includes('fotos_no_site')),
      hidratarFotosLegadas(imoveisRaw,'imoveis',imovSelect.includes('fotos_no_site'))
    ]);
    const cfgsRaw = [];
    const carrosselFotos = [];
    const capasDecisao = [];
    // guardar para as funções usarem sem buscar de novo
    try{
      window._carrosselFotos = Array.isArray(carrosselFotos) ? carrosselFotos : [];
      window._capasDecisao   = Array.isArray(capasDecisao)   ? capasDecisao   : [];
      window._dadosExtrasCarregados = false;  // extras são carregados sob demanda após a primeira pintura
      // mapa nome→slug dos condomínios (para a busca rápida abrir a página certa)
      window._condSlugMap = {};
      (condominios||[]).forEach(function(c){ if(c && c.nome) window._condSlugMap[c.nome] = c.slug || c.id; });
      // aplica as fotos nos cards agora que temos o mapa
      if(typeof ativarFotosCards === 'function') setTimeout(ativarFotosCards, 0);
    }catch(e){}
    // transformar a lista de configs num objeto de acesso rápido
    const _cfg = {};
    (Array.isArray(cfgsRaw) ? cfgsRaw : []).forEach(function(c){ _cfg[c.chave] = c.valor; });
    const destCond   = _cfg['destaques_cond']   || [];
    const destImov   = _cfg['destaques_imov']   || [];
    const destTerreno= _cfg['destaques_terreno']|| [];
    const destCapao  = _cfg['destaques_capao']  || [];
    const destXangri = _cfg['destaques_xangri'] || [];
    const siteCfg    = _cfg['site_config']      || {};
    const turismoCfg = _cfg['turismo_config']   || {};
    // guardar as fotos do site (evita outra requisição depois)
    try{ window._fotosSiteMap = _cfg['fotos_site'] || null; }catch(e){}
    // Monta estrutura compatível: imoveis aninhados nos condominios
    const condMap = {};
    condominios.forEach(c => {
      condMap[c.id] = {...c, localizacao: c.cidade, imoveis: [], fotos: c.fotos_no_site||c.fotos||[], seoData:c.seo_data||{} };
    });
    imoveis.forEach(im => {
      const c = condMap[im.cond_id];
      if(c) c.imoveis.push({...im, condId:im.cond_id, fotos:im.fotos_no_site||im.fotos||[], seoData:im.seo_data||{}, areaTotalM2:im.area_total_m2, condTaxa:im.cond_taxa, areaConstruida:im.area_construida, areaPrivativa:im.area_privativa});
    });
    // Guardar TODOS os imóveis (mesmo os sem condomínio vinculado) para a home poder exibir destaques
    const todosImoveis = imoveis.map(im => {
      const c = condMap[im.cond_id];
      return {...im, condId:im.cond_id, _c:c||null, fotos:im.fotos_no_site||im.fotos||[], seoData:im.seo_data||{}, areaTotalM2:im.area_total_m2, condTaxa:im.cond_taxa, areaConstruida:im.area_construida, areaPrivativa:im.area_privativa};
    });
    _siteCache = {
      condominios: Object.values(condMap),
      imoveis: todosImoveis,
      destCond: destCond || [],
      destImov: destImov || [],
      destTerreno: destTerreno || [],
      destCapao: destCapao || [],
      destXangri: destXangri || [],
      siteCfg: siteCfg || {},
      turismoCfg: turismoCfg || {},
    };
    _siteCacheTs = now;
    // Configurações editoriais não bloqueiam a primeira pintura e entram em idle.
    agendarConfigHome();
    // Persistir na sessão para navegação instantânea entre páginas
    try{
      sessionStorage.setItem('_siteCacheV2', JSON.stringify(_siteCache));
      sessionStorage.setItem('_siteCacheTsV2', String(now));
    }catch(e){ /* quota excedida (fotos base64 grandes) — ignora silenciosamente */ }
    // Aplica configurações do site
    if(siteCfg && Object.keys(siteCfg).length && typeof applySiteConfigObj==="function") applySiteConfigObj(siteCfg);
    if(turismoCfg && turismoCfg.turismo && typeof applyTurismoConfig==="function") applyTurismoConfig(turismoCfg.turismo);
    return _siteCache;
  }catch(e){
    console.error('fetchSiteData error:', e);
    return { condominios:[], imoveis:[], destCond:[], destImov:[], destCapao:[], destXangri:[], siteCfg:{}, turismoCfg:{} };
  }
}

// ── IndexedDB removido — mantido como stub para compatibilidade ──
let _fotoDB=null;
function getSiteDB(){
  if(_fotoDB) return Promise.resolve(_fotoDB);
  return new Promise(res=>{
    const req=indexedDB.open('cnp_fotos',1);
    req.onupgradeneeded=e=>{const db=e.target.result;if(!db.objectStoreNames.contains('fotos'))db.createObjectStore('fotos',{keyPath:'id'});};
    req.onsuccess=e=>{_fotoDB=e.target.result;res(_fotoDB);};
    req.onerror=()=>res(null);
  });
}
async function resolveRef(ref){
  if(!ref||!ref.startsWith('idb:')) return ref;
  const db=await getSiteDB();
  if(!db) return '';
  return new Promise(res=>{
    const tx=db.transaction('fotos','readonly');
    const r=tx.objectStore('fotos').get(ref.slice(4));
    r.onsuccess=()=>res(r.result?r.result.data:'');
    r.onerror=()=>res('');
  });
}
async function resolveCondFotos(conds){
  return Promise.all(conds.map(async c=>({
    ...c,
    fotos:await Promise.all((c.fotos||[]).map(resolveRef)),
    imoveis:await Promise.all((c.imoveis||[]).map(async im=>({
      ...im,
      fotos:await Promise.all((im.fotos||[]).map(resolveRef))
    })))
  })));
}

// Cache de dados resolvidos
let _dataCache=null;
let _dataCacheKey='';

// Converte quebras de linha em parágrafos
function nl2p(txt){
  if(!txt) return '';
  // Escapa HTML
  const esc = txt.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // Duplo enter = novo parágrafo, enter simples = <br>
  return esc.split(/\n\n+/).map(p=>'<p style="margin-bottom:14px;line-height:1.85">'+p.replace(/\n/g,'<br>')+'</p>').join('');
}
function nl2br(txt){
  if(!txt) return '';
  return txt.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}

function getData(){
  // Retorna cache do Supabase se disponível, senão DEFAULTS
  if(_siteCache?.condominios?.length) return _siteCache.condominios;
  return DEFAULTS;
}

// Versão async — busca do Supabase e resolve as referências de fotos (idb:)
// para que os cards (carrossel) recebam as imagens já como data:/http.
async function getDataResolved(){
  const data = await fetchSiteData();
  const conds = data.condominios || [];
  // cache: só re-resolve se a lista de condomínios mudou
  const chave = conds.map(c=>c.id).join(',') + '|' + conds.reduce((n,c)=>n+((c.fotos||[]).length),0);
  if(_dataCache && _dataCacheKey===chave) return _dataCache;
  const resolved = await resolveCondFotos(conds);
  _dataCache = resolved;
  _dataCacheKey = chave;
  return resolved;
}

const GI={'Xangri-lá':'g-xa','Capão da Canoa':'g-ca','Atlântida':'g-at'};
const GE={'Xangri-lá':'🌊','Capão da Canoa':'🏖️','Atlântida':'🌿','Curumim':'🏝️','Lagoa dos Quadros':'🦢','Osório':'🌅'};

// ── MOBILE MENU ──
function toggleMobMenu(){
  const btn=document.getElementById('mob-btn');
  const drawer=document.getElementById('mob-drawer');
  btn.classList.toggle('open');
  drawer.classList.toggle('open');
  document.body.style.overflow=drawer.classList.contains('open')?'hidden':'';
}
function closeMobMenu(){
  document.getElementById('mob-btn').classList.remove('open');
  document.getElementById('mob-drawer').classList.remove('open');
  document.body.style.overflow='';
}

// ── ROUTER ──
let currentCond=null;
let _navegando=false; // trava para evitar loop de hashchange
function goHome(){
  document.getElementById('view-home').classList.add('on');
  document.getElementById('view-detail').classList.remove('on');
  const _vt=document.getElementById('view-turismo');if(_vt)_vt.classList.remove('on');
  window.scrollTo(0,0);
  // limpa o hash da URL SEM disparar hashchange (evita travar a navegação)
  try{
    if(location.hash){
      _navegando=true;
      history.replaceState(null,'',location.pathname+location.search);
      setTimeout(function(){_navegando=false;},50);
    }
  }catch(e){}
  currentCond=null;
  const _nt=document.getElementById('nav-t');if(_nt)_nt.classList.remove('nav-active');
  // reativa o carregamento das fotos dos cards ao voltar (caso alguma não tenha carregado)
  try{ if(window.ativarFotosCards) window.ativarFotosCards(); }catch(e){}
}
// Leva à home e rola suavemente até a busca rápida (Explorar)
function irParaBusca(){
  document.getElementById('view-home').classList.add('on');
  document.getElementById('view-detail').classList.remove('on');
  const _vt=document.getElementById('view-turismo');if(_vt)_vt.classList.remove('on');
  currentCond=null;
  setTimeout(function(){
    var el=document.getElementById('busca-rapida');
    if(el) el.scrollIntoView({behavior:'smooth',block:'center'});
    else window.scrollTo(0,0);
  }, 60);
}
function openTurismo(scroll){
  document.getElementById('view-home').classList.remove('on');
  document.getElementById('view-detail').classList.remove('on');
  const _vt2=document.getElementById('view-turismo');if(_vt2)_vt2.classList.add('on');
  // nav active
  const _nt2=document.getElementById('nav-t');if(_nt2)_nt2.classList.add('nav-active');
  document.getElementById('nav-c').classList.remove('nav-active');
  document.getElementById('nav-i').classList.remove('nav-active');
  // tabs bar active
  const pt=document.getElementById('pt-t');if(pt)pt.classList.add('on');
  const pc=document.getElementById('pt-c');if(pc)pc.classList.remove('on');
  const pi=document.getElementById('pt-i');if(pi)pi.classList.remove('on');
  // mobile menu
  ['mob-c','mob-i','mob-t'].forEach(id=>{const e=document.getElementById(id);if(e)e.classList.remove('active')});
  const mt=document.getElementById('mob-t');if(mt)mt.classList.add('active');
  if(scroll!==false)window.scrollTo(0,0);
  document.title='Turismo em Xangri-Lá | Condomínios na Praia';
  try{location.hash='turismo';}catch(e){}
  let md=document.querySelector('meta[name="description"]');
  if(md)md.content='Conheça os balneários, história, praias e atrativos de Xangri-Lá e Capão da Canoa. Guia completo do litoral norte gaúcho.';
  if(window.ativarFotosCards)window.ativarFotosCards();
}
function openDetail(id){
  getDataResolved().then(all=>{
    const c=resolveCond(all,id);if(!c)return;
    currentCond=c;
    buildDetail(c);
    document.getElementById('view-home').classList.remove('on');
    document.getElementById('view-detail').classList.add('on');
    const _vt=document.getElementById('view-turismo');if(_vt)_vt.classList.remove('on');
    const _nt=document.getElementById('nav-t');if(_nt)_nt.classList.remove('nav-active');
    window.scrollTo(0,0);
    try{location.hash='cond/'+condSlug(c);}catch(e){}
  });
}
// Gera slug a partir do nome (ou usa c.slug do CRM se existir)
function condSlug(c){
  if(!c) return '';
  if(c.slug && String(c.slug).trim()) return String(c.slug).trim();
  return String(c.nome||'').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s-]/g,'').trim()
    .replace(/\s+/g,'-').replace(/-+/g,'-');
}
// Resolve um condomínio por slug OU por id (compatibilidade com links antigos)
function resolveCond(all,key){
  if(!all||!key) return null;
  key=String(key);
  // tenta por id (UUID), depois por slug do CRM, depois por slug gerado do nome
  return all.find(c=>c.id===key)
      || all.find(c=>c.slug && String(c.slug)===key)
      || all.find(c=>condSlug(c)===key)
      || null;
}
window.addEventListener('hashchange',()=>{
  if(_navegando) return; // ignora mudanças causadas pela própria limpeza da URL
  const h=location.hash;
  if(h.startsWith('#cond/')){ location.replace('/condominio/?id='+encodeURIComponent(h.replace('#cond/',''))); }
  else if(h.startsWith('#imovel/')){ location.replace('/imovel?id='+encodeURIComponent(h.replace('#imovel/',''))); }
  else if(h==='#turismo'){openTurismo();}
  else if(h==='#imoveis'||h==='#todos-imoveis'){ location.replace('/imoveis'); }
  else if(h==='#condominios'||h==='#todos-condominios'){ location.replace('/condominios'); }
  else if(h==='#busca-rapida'){irParaBusca();}
  else{
    // hash vazio ou desconhecido → volta pra home (sem re-limpar o hash, evita loop)
    document.getElementById('view-home').classList.add('on');
    document.getElementById('view-detail').classList.remove('on');
    const _vt=document.getElementById('view-turismo');if(_vt)_vt.classList.remove('on');
    currentCond=null;
    window.scrollTo(0,0);
    try{ if(window.ativarFotosCards) window.ativarFotosCards(); }catch(e){}
  }
});

// ── SHOW ALL ──
function showAllCond(){ location.href='/condominios'; }

// ── CARROSSEL CRÉDITO CONTEMPLADO ──
function ctScroll(dir){
  var grid=document.getElementById('ct-grid');
  if(!grid) return;
  var card=grid.querySelector('.ct-card');
  var passo=card?(card.offsetWidth+16):320;
  grid.scrollBy({left:dir*passo*1.5,behavior:'smooth'});
}

// ── SEARCH FORM CARD ──
var _sfcTipo='imoveis';
function sfcTab(btn,tipo){
  _sfcTipo=tipo;
  document.querySelectorAll('.sfc-tab').forEach(function(b){b.classList.remove('ativo');});
  btn.classList.add('ativo');
  var lab=document.getElementById('sfc-label');
  var inp=document.getElementById('sfc-q');
  var lab2=document.getElementById('sfc-label2');
  var row=document.querySelector('.sfc-row');
  var btnBuscar=document.querySelector('.sfc-btn');
  if(tipo==='lancamentos'){
    // aba Lançamentos: leva direto à página de lançamentos
    if(lab) lab.textContent='Lançamentos e Oportunidades';
    if(inp){ inp.placeholder='Veja todos os lançamentos do litoral'; inp.value=''; inp.readOnly=true; inp.style.cursor='pointer'; inp.onclick=function(){ window.location='/lancamentos'; }; }
    if(lab2) lab2.textContent='Empreendimento';
    sfcPreencherLista();
    return;
  }
  // reabilita o input nos outros modos
  if(inp){ inp.readOnly=false; inp.style.cursor=''; inp.onclick=null; }
  if(tipo==='imoveis'){
    if(lab) lab.textContent='Tipo de imóvel';
    if(inp) inp.placeholder='Casa, terreno, apartamento...';
    if(lab2) lab2.textContent='Tipo de imóvel';
  } else {
    if(lab) lab.textContent='Nome do condomínio';
    if(inp) inp.placeholder='Digite o nome do condomínio ou bairro...';
    if(lab2) lab2.textContent='Condomínio';
  }
  sfcPreencherLista();
}
// preenche o dropdown da direita conforme a aba
function sfcPreencherLista(){
  var sel=document.getElementById('sfc-list');
  if(!sel) return;
  if(_sfcTipo==='lancamentos'){
    var lancs=['Vivendas da Marina','Enseada Lagoa dos Quadros','Cyano Private Resort','Mônaco Grand Marina','Vientos Resort','Condomínio Alegro'];
    sel.innerHTML='<option value="">Todos os lançamentos</option>'+lancs.map(function(t){return '<option value="'+t+'">'+t+'</option>';}).join('');
  } else if(_sfcTipo==='imoveis'){
    var tipos=['Casa','Terreno','Apartamento','Cobertura','Chalé'];
    sel.innerHTML='<option value="">Todos os tipos</option>'+tipos.map(function(t){return '<option value="'+t+'">'+t+'</option>';}).join('');
  } else {
    // condomínios: tenta do cache; se não houver, busca
    function render(lista){
      var nomes=(lista||[]).filter(function(c){return c && c.nome && c.ativo!==false;})
        .map(function(c){return c.nome;}).sort(function(a,b){return a.localeCompare(b);});
      sel.innerHTML='<option value="">Todos os condomínios</option>'+nomes.map(function(n){return '<option value="'+n.replace(/"/g,'&quot;')+'">'+n+'</option>';}).join('');
    }
    if(typeof getDataResolved==='function'){
      getDataResolved().then(render).catch(function(){ render(_siteCache&&_siteCache.condominios); });
    } else {
      render(_siteCache&&_siteCache.condominios);
    }
  }
}
function sfcBuscar(){
  var q=(document.getElementById('sfc-q')||{}).value||'';
  var sel=(document.getElementById('sfc-list')||{}).value||'';
  q=q.trim();
  if(_sfcTipo==='lancamentos'){
    // se escolheu um empreendimento, vai direto à página dele; senão à lista
    var mapa={
      'Vivendas da Marina':'/vivendas-da-marina-capao-da-canoa',
      'Enseada Lagoa dos Quadros':'/enseada-lagoa-dos-quadros-capao-da-canoa',
      'Cyano Private Resort':'/cyano-private-resort-osorio',
      'Mônaco Grand Marina':'/monaco-grand-marina-maquine',
      'Vientos Resort':'/vientos-resort-xangri-la',
      'Condomínio Alegro':'/condominio-alegro-curumim'
    };
    window.location = mapa[sel] || '/lancamentos';
    return;
  }
  // agora existem páginas dedicadas: leva o visitante direto para elas, com os filtros na URL
  if(_sfcTipo==='imoveis'){
    // o dropdown seleciona o TIPO (Casa/Terreno) — a página filtra por ele
    window.location = '/imoveis' + (sel ? ('?tipo=' + encodeURIComponent(sel)) : '');
    return;
  } else {
    // condomínios: se escolheu um no dropdown, abre a página dele direto
    if(sel && window._condSlugMap && window._condSlugMap[sel]){
      window.location = '/condominio/?id=' + encodeURIComponent(window._condSlugMap[sel]);
      return;
    }
    window.location = '/condominios';
    return;
  }
  setTimeout(function(){
    var alvo=document.getElementById('all-listing')||document.getElementById('sec-condominios');
    if(alvo) alvo.scrollIntoView({behavior:'smooth',block:'start'});
  },150);
}

function showAllImov(){ location.href='/imoveis'; }

// ── CONDOMÍNIOS EM DESTAQUE (home) ──
// As antigas listas por cidade não fazem mais parte da homepage.
// Mantemos a função como no-op para compatibilidade com chamadas legadas do fluxo de inicialização.
function renderDestaquesCidade(){}
function mfnActive(id){
  document.querySelectorAll('.mob-footer-btn').forEach(b=>b.classList.remove('active'));
  const el=document.getElementById(id);
  if(el) el.classList.add('active');
}

// ── TABS ──

function scrollToTabs(){ /* listagem interna removida */ }

// ── CONDO GRID ──
function rCond(){
  // a listagem interna foi removida (agora existe a página /condominios).
  // mantida vazia para não quebrar chamadas antigas.
  try{ if(typeof updateHeroStats==='function') updateHeroStats(); }catch(e){}
}

function handleCondClick(id){
  if(mob()){
    getDataResolved().then(all=>{
      const c=all.find(x=>x.id===id);
      if(c) openSheetWith(c);
    });
  }else{
    getDataResolved().then(all=>{
      const c=all.find(x=>x.id===id);
      if(c){ currentCond=c; buildDetail(c); showDetailView(); }
    });
  }
}
function showDetailView(){
  document.getElementById('view-home').classList.remove('on');
  document.getElementById('view-detail').classList.add('on');
  const _vt=document.getElementById('view-turismo');if(_vt)_vt.classList.remove('on');
  window.scrollTo(0,0);
  try{location.hash='cond/'+(currentCond?condSlug(currentCond):'');}catch(e){}
}

// ── IMOVEL GRID ──

// ── FILTRAR IMÓVEIS POR CIDADE ──
let _imovCityFilter = '';
function filterImovByCity(cidade){
  _imovCityFilter = cidade || '';
  // Mostra listagem e aba imóveis
  const listing=document.getElementById('all-listing');
  if(listing) listing.style.display='block';
  showTab('imoveis');
  // Limpa outros filtros para não conflitar
  const si=document.getElementById('i-s'); if(si) si.value='';
  rImov();
  // Rola até a listagem
  const a=document.getElementById('tabs-anchor');
  if(a) a.scrollIntoView({behavior:'smooth'});
  else { const t=document.getElementById('all-listing'); if(t) t.scrollIntoView({behavior:'smooth'}); }
}

function rImov(){
  // a listagem interna foi removida (agora existe a página /imoveis).
}

// ── HERO STATS ──
function updateHeroStats(){
  getDataResolved().then(all=>updateHeroStatsFrom(all));
}
function updateHeroStatsFrom(all){
  const active=all.filter(c=>c.ativo!==false);
  const hnc=document.getElementById('h-nc'); if(hnc) hnc.textContent=active.length;
  const ni=active.reduce((s,c)=>{return s+(c.imoveis||[]).filter(i=>i.status==='Disponível').length},0);
  const hni=document.getElementById('h-ni'); if(hni) hni.textContent=ni;
}

// ── HERO SEARCH ──
function heroSearch(){
  showTab('condominios');
  const _hs=document.getElementById('h-srch'); const _hc=document.getElementById('h-city');
  const _cs=document.getElementById('c-s'); const _cc=document.getElementById('c-city');
  if(_cs&&_hs) _cs.value=_hs.value;
  if(_cc&&_hc) _cc.value=_hc.value;
  rCond();
}
function setChip(el,c){document.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));el.classList.add('on');var _hc=document.getElementById('h-city');if(_hc)_hc.value=c}
function filterCity(c){showAllCond();const cc=document.getElementById('c-city');if(cc)cc.value=c;rCond();const a=document.getElementById('tabs-anchor');if(a)a.scrollIntoView({behavior:'smooth'});}
const _hsrch=document.getElementById('h-srch');if(_hsrch)_hsrch.addEventListener('keydown',e=>{if(e.key==='Enter')heroSearch()});

// ── CITIES ──
function buildCities(){
  const all=getData().filter(c=>c.ativo!==false);
  const cnt={};all.forEach(c=>{const l=c.localizacao||c.cidade||'';cnt[l]=(cnt[l]||0)+1});
  const d={'Xangri-lá':'Capital dos condomínios de luxo do litoral norte.','Capão da Canoa':'Uma das praias mais tradicionais do RS.','Atlântida':'Destino familiar com natureza e tranquilidade.','Curumim':'Praias calmas e natureza preservada.','Lagoa dos Quadros':'Lagoas e natureza, ideal para sossego.','Osório':'Portal do litoral norte gaúcho.'};
  const grid=document.getElementById('city-grid'); if(!grid) return;
  grid.innerHTML=Object.keys(cnt).map((c,i)=>`
    <div class="citycard fade-in" onclick="filterCity('${c}')">
      <div class="city-num">0${i+1}</div><div class="city-name">${c}</div>
      <div class="city-cnt">${cnt[c]} condomínio${cnt[c]!==1?'s':''}</div>
      <p class="city-desc">${d[c]||''}</p>
    </div>`).join('');
  obs();
}
function openSheet(id){
  getDataResolved().then(all=>{
    const c=all.find(x=>x.id===id);
    if(c) openSheetWith(c);
  });
}
function openSheetWith(c){
  const loc=c.localizacao||c.cidade||'';
  const foto=c.fotos&&c.fotos.find(f=>f&&(f.startsWith('data:')||f.startsWith('http')));
  buildCarousel('ms-img', c.fotos, true);
  document.getElementById('ms-city').textContent=loc;
  document.getElementById('ms-title').textContent=c.nome;
  document.getElementById('ms-desc').textContent=c.descricao||'';
  const disp=(c.imoveis||[]).filter(i=>i.status==='Disponível');
  const stats=[];
  if(c.areaTotalM2)stats.push([m2(c.areaTotalM2),'Área']);
  if(c.lotes)stats.push([c.lotes,'Lotes']);
  stats.push([disp.length,'Disponíveis']);
  document.getElementById('ms-stats').innerHTML=stats.map(([v,l])=>`<div class="mstat"><div class="mstat-v">${v}</div><div class="mstat-l">${l}</div></div>`).join('');
  document.getElementById('ms-ams').innerHTML=(c.amenidades||[]).slice(0,5).map(a=>`<span class="amtag">${a}</span>`).join('');
  document.getElementById('ms-detail').onclick=()=>{closeSheet();currentCond=c;buildDetail(c);showDetailView();};
  const wm=encodeURIComponent(`Olá! Tenho interesse no *${c.nome}*. Gostaria de mais informações.`);
  document.getElementById('ms-wpp').href=`https://wa.me/${WPP}?text=${wm}`;
  document.getElementById('ms-ov').classList.add('op');
  document.body.style.overflow='hidden';
}
function closeSheet(){document.getElementById('ms-ov').classList.remove('op');document.body.style.overflow='';}

// ── DETAIL PAGE ──
let galIdx=0;
function buildDetail(c){
  const loc=c.localizacao||c.cidade||'';
  const fotos=c.fotos||[];
  const imoveis=c.imoveis||[];
  const disp=imoveis.filter(i=>i.status==='Disponível');

  // ── SEO DINÂMICO ──
  document.title=`${c.nome} — Condomínio em ${loc} | Condomínios na Praia`;

  // Meta description
  let metaDesc=document.querySelector('meta[name="description"]');
  if(!metaDesc){metaDesc=document.createElement('meta');metaDesc.name='description';document.head.appendChild(metaDesc);}
  metaDesc.content=`${c.nome}: condomínio ${c.tipo||'fechado'} em ${loc}. ${c.padrao||'Alto Padrão'}. ${disp.length} imóveis disponíveis. ${(c.amenidades||[]).slice(0,4).join(', ')}. Condomínios na Praia.`;

  // Meta keywords
  let metaKw=document.querySelector('meta[name="keywords"]');
  if(!metaKw){metaKw=document.createElement('meta');metaKw.name='keywords';document.head.appendChild(metaKw);}
  metaKw.content=`${c.nome}, condomínio ${loc}, imóveis ${loc}, ${c.padrao||''}, litoral norte gaúcho, ${(c.amenidades||[]).join(', ')}`;

  // Open Graph (Facebook/WhatsApp preview)
  const ogTags={
    'og:title':`${c.nome} — ${loc} | Condomínios na Praia`,
    'og:description':metaDesc.content,
    'og:image':fotos[0]||'',
    'og:type':'website',
    'og:url':window.location.href,
  };
  Object.entries(ogTags).forEach(([p,v])=>{
    let el=document.querySelector(`meta[property="${p}"]`);
    if(!el){el=document.createElement('meta');el.setAttribute('property',p);document.head.appendChild(el);}
    el.content=v;
  });

  // Schema.org JSON-LD
  let schema=document.getElementById('schema-ld');
  if(!schema){schema=document.createElement('script');schema.id='schema-ld';schema.type='application/ld+json';document.head.appendChild(schema);}
  schema.textContent=JSON.stringify({
    '@context':'https://schema.org',
    '@type':'RealEstateAgent',
    'name':'Condomínios na Praia',
    'alternateName':'Condomínios na Praia',
    'url':'https://condominiosnapraia.com.br',
    'address':{'@type':'PostalAddress','addressLocality':loc,'addressRegion':'RS','addressCountry':'BR'},
    'offers': disp.slice(0,5).map(im=>({'@type':'Offer','name':im.titulo,'price':im.preco,'priceCurrency':'BRL','availability':'https://schema.org/InStock'})),
    'description':metaDesc.content,
    'image':fotos[0]||'',
    'areaServed':loc,
  });

  // ── CONTEÚDO ──
  document.getElementById('d-breadcrumb').textContent=c.nome;
  document.getElementById('d-city').textContent=loc;
  document.getElementById('d-title').innerHTML=c.nome.replace(/\s(\S+)$/, ' <em>$1</em>');
  document.getElementById('d-loc').textContent=[c.bairro,loc].filter(Boolean).join(', ');
  document.getElementById('d-desc').innerHTML=nl2p(c.descricao||'');

  // Conteúdo rico do CMS (aba SEO & Conteúdo) — estrutura SEO completa do framework
  (function(){
    var alvo=document.getElementById('d-desc'); if(!alvo) return;
    var nome=c.nome||'este condomínio';
    var cidadeNm=loc||c.cidade||'';
    var amen=c.amenidades||c.comodidades||[];
    if(typeof amen==='string'){try{amen=JSON.parse(amen)}catch(e){amen=String(amen).split(',').map(function(x){return x.trim()})}}
    amen=(amen||[]).filter(Boolean);
    // Texto gerado de lazer/segurança a partir das amenidades (só se houver)
    var amenTxt = amen.length ? ('O condomínio oferece '+amen.join(', ')+'.') : '';
    // Variações de SEO local (redacional, sem stuffing)
    var seoLocal = 'Veja as opções de <strong>casas no '+nome+'</strong>, <strong>terrenos no '+nome+'</strong> e demais <strong>imóveis no '+nome+'</strong> à venda — ideais para quem deseja <strong>comprar</strong> ou <strong>investir no '+nome+'</strong>, em '+cidadeNm+'.';

    // Helper: junta vários campos do CRM num só texto (ignora vazios, evita repetir)
    function juntar(){
      var partes=[], vistos={};
      for(var i=0;i<arguments.length;i++){
        var x=arguments[i]; if(!x) continue;
        x=String(x).trim(); if(!x) continue;
        var chave=x.slice(0,40).toLowerCase();
        if(vistos[chave]) continue; vistos[chave]=1;
        partes.push(x);
      }
      return partes.join('\n\n');
    }

    // Mapa enxuto: 5 seções essenciais (cada campo do CRM entra em uma só)
    var secoes=[
      {t:'Sobre o '+nome, v:juntar(c.historia_condominio), h:2},
      {t:'Imóveis e investimento', v:juntar(c.perfil_imoveis, c.mercado_imobiliario||c.mercado, c.valorizacao), vHtml:seoLocal, h:2, always:true},
      {t:'Por que escolher o '+nome, v:juntar(c.diferenciais, c.vantagens, c.perfil_moradores, c.seo_content), h:2}
    ];
    var velho=document.getElementById('d-rich'); if(velho) velho.remove();
    var box=document.createElement('div'); box.id='d-rich'; box.style.cssText='margin-top:24px;text-align:left';
    var temConteudo=false;
    secoes.forEach(function(s){
      if(s.skipIf) return;
      var val=s.v && String(s.v).trim();
      if(!val && !s.vHtml && !s.always) return;
      if(!val && !s.vHtml) return;
      temConteudo=true;
      var h=document.createElement('h'+(s.h||3));
      h.textContent=s.t;
      h.style.cssText='font-family:Fraunces,serif;font-weight:600;color:var(--ocean);font-size:'+(s.h===2?'25px':'19px')+';margin:28px 0 10px;line-height:1.2';
      box.appendChild(h);
      var d=document.createElement('div');
      d.innerHTML=nl2p(String(s.v||''))+(s.vHtml?'<p style="margin-bottom:14px;line-height:1.85">'+s.vHtml+'</p>':'');
      box.appendChild(d);
    });
    // Bloco de linkagem interna (silo) + atrações da cidade
    var citySlug=(c.cidade_slug)|| (cidadeNm? cidadeNm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-') : '');
    var linkBox=document.createElement('div');
    linkBox.style.cssText='margin:26px 0 6px;display:flex;gap:10px;flex-wrap:wrap';
    var links=[];
    if(citySlug){ links.push(['Guia de '+cidadeNm,'/'+citySlug]); links.push(['O que fazer em '+cidadeNm,'/o-que-fazer-em-'+citySlug]); }
    links.push(['Ver condomínios','/condominios']);
    links.push(['Crédito contemplado','/contemplado-imoveis/']);
    links.forEach(function(l){
      var a=document.createElement('a'); a.href=l[1]; a.textContent=l[0];
      a.style.cssText='color:var(--om,#0e8a99);text-decoration:none;font-size:14px;background:var(--sl,#e8f7f8);padding:9px 15px;border-radius:20px';
      linkBox.appendChild(a);
    });
    if(temConteudo){ box.appendChild(linkBox); alvo.parentNode.insertBefore(box, alvo.nextSibling); }

    // ── SCHEMAS (Residence + BreadcrumbList + Organization) ──
    ['d-res-schema','d-bc-schema','d-org-schema'].forEach(function(id){var e=document.getElementById(id);if(e)e.remove();});
    try{
      var url=location.href.split('#')[0];
      var resSchema={"@context":"https://schema.org","@type":"Residence","name":nome,
        "description":(c.descricao||'').slice(0,300),
        "address":{"@type":"PostalAddress","addressLocality":cidadeNm,"addressRegion":"RS","addressCountry":"BR"}};
      if(c.bairro) resSchema.address.streetAddress=c.bairro;
      var sc1=document.createElement('script');sc1.type='application/ld+json';sc1.id='d-res-schema';
      sc1.textContent=JSON.stringify(resSchema);document.head.appendChild(sc1);

      var bc={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Início","item":location.origin+"/"}]};
      if(citySlug) bc.itemListElement.push({"@type":"ListItem","position":2,"name":cidadeNm,"item":location.origin+"/"+citySlug});
      bc.itemListElement.push({"@type":"ListItem","position":bc.itemListElement.length+1,"name":nome,"item":url});
      var sc2=document.createElement('script');sc2.type='application/ld+json';sc2.id='d-bc-schema';
      sc2.textContent=JSON.stringify(bc);document.head.appendChild(sc2);

      var org={"@context":"https://schema.org","@type":"RealEstateAgent","name":"Condomínios na Praia","alternateName":"Condomínios na Praia","url":location.origin+"/","logo":location.origin+"/img/logo-header.png","image":location.origin+"/img/og-home.jpg","telephone":"+55-51-98286-8888","email":"napraiacondominios@gmail.com","areaServed":["Xangri-lá","Capão da Canoa","Osório","Maquiné","Atlântida","Litoral Norte Gaúcho"],"address":{"@type":"PostalAddress","addressRegion":"RS","addressCountry":"BR","addressLocality":"Litoral Norte Gaúcho"},"knowsAbout":["condomínios fechados","imóveis de alto padrão","casas na praia","terrenos em condomínio","crédito contemplado"],"sameAs":[/* AJUSTAR: cole aqui os links das redes ao criar, ex: "https://www.instagram.com/portalmeulitoral" */]};
      var sc3=document.createElement('script');sc3.type='application/ld+json';sc3.id='d-org-schema';
      sc3.textContent=JSON.stringify(org);document.head.appendChild(sc3);
    }catch(e){}
  })();

  // ── FAQ do condomínio (lê c.faq_json) ──
  (function(){
    var alvo=document.getElementById('d-im-section')||document.getElementById('d-rich')||document.getElementById('d-desc');
    if(!alvo) return;
    var velho=document.getElementById('d-faq'); if(velho) velho.remove();
    var velhoSchema=document.getElementById('d-faq-schema'); if(velhoSchema) velhoSchema.remove();
    var faq=c.faq_json||c.faqJson||[];
    if(typeof faq==='string'){ try{faq=JSON.parse(faq)}catch(e){faq=[]} }
    if(!Array.isArray(faq)||!faq.length) return;
    // monta o bloco visual (acordeão) — estilo igual às páginas de lançamento
    var box=document.createElement('div'); box.id='d-faq'; box.style.cssText='margin-top:34px;text-align:left;max-width:820px;margin-left:auto;margin-right:auto';
    var tit=document.createElement('h2');
    tit.textContent='Perguntas Frequentes';
    tit.style.cssText='font-family:Fraunces,serif;font-weight:600;color:var(--ocean);font-size:24px;line-height:1.2;margin:0 0 18px;letter-spacing:-.01em';
    box.appendChild(tit);
    faq.forEach(function(item){
      var q=item.q||item.pergunta||''; var a=item.a||item.resposta||'';
      if(!q||!a) return;
      var det=document.createElement('details');
      det.className='dfaq-item';
      det.style.cssText='border:1px solid var(--border,rgba(31,181,196,.22));border-radius:12px;margin-bottom:10px;overflow:hidden;background:#fff';
      var sum=document.createElement('summary');
      sum.textContent=q;
      sum.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:14px;padding:14px 18px;cursor:pointer;font-weight:600;color:var(--ocean);font-size:13.5px;line-height:1.45;list-style:none;font-family:Outfit,sans-serif';
      var ans=document.createElement('div');
      ans.textContent=a;
      ans.style.cssText='padding:0 18px 16px;color:#2e4654;font-size:13px;line-height:1.65;font-family:Outfit,sans-serif';
      det.appendChild(sum); det.appendChild(ans);
      box.appendChild(det);
    });
    alvo.parentNode.insertBefore(box, alvo.nextSibling);
    // injeta FAQPage Schema (SEO)
    try{
      var mainEntity=faq.filter(function(i){return (i.q||i.pergunta)&&(i.a||i.resposta)}).map(function(i){
        return {"@type":"Question","name":(i.q||i.pergunta),"acceptedAnswer":{"@type":"Answer","text":(i.a||i.resposta)}};
      });
      if(mainEntity.length){
        var sc=document.createElement('script'); sc.type='application/ld+json'; sc.id='d-faq-schema';
        sc.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":mainEntity});
        document.head.appendChild(sc);
      }
    }catch(e){}
  })();

  // badges
  const bgs=[];
  if(c.padrao)bgs.push({t:c.padrao,h:true});
  if(c.tipo)bgs.push({t:c.tipo,h:false});
  if(c.ano)bgs.push({t:'Entrega '+c.ano,h:false});
  if(c.incorporadora)bgs.push({t:c.incorporadora,h:false});
  document.getElementById('d-badges').innerHTML=bgs.map(b=>`<span class="dcbadge ${b.h?'hi':''}">${b.t}</span>`).join('');

  // dados
  const ds=[];
  if(c.areaTotalM2)ds.push(['Área Total',m2(c.areaTotalM2)]);
  if(c.lotes)ds.push(['Nº Lotes',c.lotes]);
  if(c.incorporadora)ds.push(['Incorporadora',c.incorporadora]);
  if(c.ano)ds.push(['Ano Entrega',c.ano]);
  ds.push(['Imóveis Dispon.',disp.length]);
  if(c.tipo)ds.push(['Tipo',c.tipo]);
  document.getElementById('d-dados').innerHTML=ds.map(([l,v])=>`<div class="dado"><div class="dado-l">${l}</div><div class="dado-v">${v}</div></div>`).join('');

  // amenidades
  let amenList = c.amenidades || [];
  if(typeof amenList === 'string') amenList = amenList.split(',').map(s=>s.trim()).filter(Boolean);
  if(amenList && amenList.length){
    document.getElementById('d-am-wrap').style.display='';
    document.getElementById('d-amlist').innerHTML=amenList.map(a=>`<div class="amitem">${a}</div>`).join('');
  } else { document.getElementById('d-am-wrap').style.display='none'; }

  // localização
  const locWrap=document.getElementById('d-loc-wrap');
  const locInfo=document.getElementById('d-loc-info');
  const mapsWrap=document.getElementById('d-maps-wrap');
  const mapsLink=document.getElementById('d-maps-link');
  const mapsEmbed=document.getElementById('d-maps-embed');
  const hasEndereco=c.endereco||c.bairro||loc;
  const hasMaps=c.maps&&c.maps.trim();
  if(hasEndereco||hasMaps){
    locWrap.style.display='';
    // Monta texto de endereço
    const parts=[];
    if(c.endereco) parts.push(`<strong>Endereço</strong>${c.endereco}`);
    if(c.bairro)   parts.push(`<strong>Bairro</strong>${c.bairro}`);
    if(loc)        parts.push(`<strong>Cidade</strong>${loc} / RS`);
    locInfo.innerHTML=parts.map(p=>`<div style="margin-bottom:6px">${p}</div>`).join('');
    // Google Maps link
    if(hasMaps){
      mapsWrap.style.display='';
      mapsLink.href=c.maps;
      // Embed do iframe se for link do Google Maps
      const embedUrl=buildMapsEmbed(c.maps);
      if(embedUrl){
        mapsEmbed.style.display='';
        mapsEmbed.innerHTML=`<iframe src="${embedUrl}" width="100%" height="260" frameborder="0" style="border:0;display:block" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
      } else { mapsEmbed.style.display='none'; }
    } else {
      mapsWrap.style.display='none';
      mapsEmbed.style.display='none';
      mapsEmbed.innerHTML='';
      // Se tem endereço, cria link de busca automática
      if(c.endereco){
        mapsWrap.style.display='';
        mapsLink.href=`https://www.google.com/maps/search/${encodeURIComponent(c.endereco+', '+loc+', RS')}`;
      }
    }
  } else { locWrap.style.display='none'; }

  // side stats
  const ss=[['Disponíveis',disp.length],['Cidade',loc]];
  if(c.padrao)ss.push(['Padrão',c.padrao]);
  if(c.tipo)ss.push(['Tipo',c.tipo]);
  var _ss=document.getElementById('d-sstats');if(_ss)_ss.innerHTML=ss.map(([l,v])=>`<div class="sstat"><span class="sstat-l">${l}</span><span class="sstat-v">${v}</span></div>`).join('');

  // wpp
  const wm=encodeURIComponent(`Olá! Tenho interesse no *${c.nome}* em ${loc}. Gostaria de mais informações.`);
  const wurl=`https://wa.me/${WPP}?text=${wm}`;
  var _wpp=document.getElementById('d-wpp');if(_wpp)_wpp.href=wurl;
  const _ds=document.getElementById('d-share');if(_ds)_ds.innerHTML=buildShareBar(c.nome+' - Condomínio no Litoral',window.location.origin+'/#cond/'+condSlug(c));
  const _wf=document.getElementById('wpp-float');if(_wf)_wf.href=wurl;
  var _ag=document.getElementById('d-agendar');
  if(_ag){var wmAg=encodeURIComponent(`Olá! Gostaria de *agendar uma visita* ao ${c.nome}, em ${loc}.`);_ag.href=`https://wa.me/${WPP}?text=${wmAg}`;}
  var _fwo=document.getElementById('f-wpp-ok');if(_fwo)_fwo.href=wurl;

  // carrossel hero principal
  buildCarousel('d-carousel', fotos, true);
  buildGallery(fotos);

  // galeria infraestrutura (todas as fotos em grid)
  buildInfraGallery(fotos);

  // imoveis
  buildDetailImoveis(imoveis);

  // reset form
  document.getElementById('f-content').style.display='';
  document.getElementById('f-success').style.display='none';
  document.getElementById('f-btn').classList.remove('sending');
  document.getElementById('f-btn').textContent='Enviar Mensagem ✉';
}

function buildGallery(fotos){
  const no=document.getElementById('d-nophoto');
  const grid=document.getElementById('d-mosaic-grid');
  const btn=document.getElementById('d-mosaic-btn');

  if(!fotos||!fotos.length){
    no.style.display='flex';
    grid.style.display='none';
    btn.style.display='none';
    return;
  }

  no.style.display='none';
  grid.style.display='grid';

  const total=fotos.length;
  const show=Math.min(total,5); // mostra até 5 no mosaico
  const cls=total===1?'n1':total===2?'n2':total===3?'n3':total===4?'n4':total===5?'n5':'nmax';
  grid.className='mosaic-grid '+cls;

  const nome=currentCond?currentCond.nome:'';
  grid.innerHTML=fotos.slice(0,show).map((f,i)=>{
    const isLast=i===show-1&&total>show;
    return `<div class="mi" onclick="openLightbox(${i})">
      <img src="${f}" alt="${nome} — foto ${i+1}" loading="${i===0?'eager':'lazy'}">
      <div class="mi-overlay"></div>
      ${isLast?`<div class="mi-more"><span>+${total-show+1}</span><p>Ver todas</p></div>`:''}
    </div>`;
  }).join('');

  // Botão "ver todas"
  if(total>1){
    btn.style.display='flex';
    btn.onclick=()=>openLightbox(0);
  } else {
    btn.style.display='none';
  }
}

// galTo/galNav kept as stubs for lightbox compatibility
function galTo(i){galIdx=i;}
function galNav(d){
  const fotos=currentCond?currentCond.fotos||[]:[];
  lbIdx=(lbIdx+d+fotos.length)%fotos.length;
  openLightbox(lbIdx);
}



// ── GALERIA INFRAESTRUTURA ──
function buildInfraGallery(fotos){
  // Fotos já aparecem no mosaico do topo — seção infraestrutura ocultada para evitar duplicação
  const wrap=document.getElementById('d-infra-wrap');
  if(wrap) wrap.style.display='none';
}

// ── LIGHTBOX ──
let lbIdx=0;
function openLightbox(i){
  const fotos=currentCond?currentCond.fotos||[]:[];
  if(!fotos.length)return;
  lbIdx=i;
  const lb=document.getElementById('lightbox');
  const img=document.getElementById('lb-img');
  const cnt=document.getElementById('lb-cnt');
  lb.classList.add('op');
  document.body.style.overflow='hidden';
  img.style.opacity='0';
  const newImg=new Image();
  newImg.onload=()=>{img.src=fotos[lbIdx];setTimeout(()=>{img.style.opacity='1';},50);};
  newImg.src=fotos[lbIdx];
  cnt.textContent=(lbIdx+1)+' / '+fotos.length;
}
function lbNav(d){
  const fotos=currentCond?currentCond.fotos||[]:[];
  lbIdx=(lbIdx+d+fotos.length)%fotos.length;
  openLightbox(lbIdx);
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('op');
  document.body.style.overflow='';
}

function buildDetailImoveis(imoveis){
  const disp=imoveis.filter(i=>i.status==='Disponível'||i.status==='Negociando');
  const n=disp.length;
  document.getElementById('d-im-num').textContent=n;
  document.getElementById('d-im-sub').textContent=n===0?'Nenhum imóvel disponível no momento':n===1?'1 imóvel disponível para venda':`${n} imóveis disponíveis para venda`;
  if(!n){
    document.getElementById('d-im-grid').innerHTML=`<div class="no-im" style="grid-column:1/-1"><div class="no-im-ico">🏠</div><p style="font-size:13px">Nenhum imóvel disponível no momento.<br>Entre em contato para novidades.</p></div>`;
    return;
  }
  document.getElementById('d-im-grid').innerHTML=disp.map(im=>{
    const foto=im.fotos&&im.fotos[0];
    const sc=im.status==='Disponível'?'st-disp':'st-neg';
    const specs=[im.area?`📐 ${m2(im.area)}`:'',im.quartos?`🛏 ${im.quartos} qtos`:'',im.suites?`🛁 ${im.suites} suítes`:'',im.vagas?`🚗 ${im.vagas} vagas`:''].filter(Boolean).map(x=>`<span class="icspec">${x}</span>`).join('');
    return`<div class="icard fade-in" onclick="window.location.href='/imovel?id='+encodeURIComponent(im.codigo||im.slug||im.id)">
      <div class="icimg">${foto?`<img src="${foto}" alt="${im.titulo}" loading="lazy">`:'🏠'}<div class="icst ${sc}">${im.status}</div></div>
      <div class="icbody">
        <div class="ictipo">${im.tipo||'Imóvel'}</div>
        <div class="ictit">${im.titulo||'—'}</div>
        <div class="icspecs">${specs}</div>
        <div class="icdifs">${(im.diferenciais||[]).slice(0,3).map(d=>`<span class="icdif">${d}</span>`).join('')}</div>
      </div>
      <div class="icfoot"><div class="icpreco">${brl(im.preco)}</div><span style="font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--ocean)">Ver detalhes →</span></div>
    </div>`;
  }).join('');
  obs();
}

// ── IMOVEL MODAL ──
// Abre um imóvel só pelo ID (usado em links compartilhados /#imovel/ID).
// Descobre automaticamente a qual condomínio o imóvel pertence.
function abrirImovelPorId(imId){
  if(!imId) { goHome(); return; }
  getDataResolved().then(all=>{
    // procurar o imóvel em todos os condomínios
    let cond=null, imov=null;
    for(const c of all){
      const found=(c.imoveis||[]).find(x=>x.id===imId);
      if(found){ cond=c; imov=found; break; }
    }
    if(cond && imov){
      _openImovModalWith(imId, cond);
    } else {
      // imóvel não encontrado (pode ter sido removido) — vai para a home
      goHome();
      if(typeof toast==='function') toast('Imóvel não encontrado','info');
    }
  }).catch(()=>goHome());
}

function openImovModal(imId,condId){
  // currentCond já está resolvido (fotos em base64)
  const cnd=currentCond&&currentCond.id===condId?currentCond:null;
  if(!cnd){
    getDataResolved().then(all=>{
      const c=all.find(x=>x.id===condId);
      if(c) _openImovModalWith(imId,c);
    });
    return;
  }
  _openImovModalWith(imId,cnd);
}
function _openImovModalWith(imId,cnd){
  const im=(cnd.imoveis||[]).find(x=>x.id===imId);
  if(!im)return;
  // atualiza a URL para permitir compartilhar/voltar (sem disparar novo handler)
  try{ if(location.hash!=='#imovel/'+im.id){ history.replaceState(null,'','#imovel/'+im.id); } }catch(_){}
  buildCarousel('im-gal', im.fotos, true);
  document.getElementById('im-tit').textContent=im.titulo||'Imóvel';
  const _is=document.getElementById('im-share');if(_is)_is.innerHTML=buildShareBar((im.titulo||'Imóvel')+' - '+(cnd.nome||''),window.location.origin+'/imovel/'+im.id);
  // ── VÍDEO DO YOUTUBE ──
  (function(){
    const vEl=document.getElementById('im-video'); if(!vEl) return;
    const raw=(im.seoData&&im.seoData.video)||(im.seo_data&&im.seo_data.video)||'';
    let vid='';
    const m=String(raw).match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,20})/);
    if(m) vid=m[1];
    if(vid){
      vEl.innerHTML='<div style="font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--tm);margin-bottom:8px">Vídeo</div><div style="position:relative;padding-top:56.25%;border-radius:12px;overflow:hidden"><iframe src="https://www.youtube.com/embed/'+vid+'" title="Vídeo do imóvel" style="position:absolute;inset:0;width:100%;height:100%;border:0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
      vEl.style.display='block';
    } else { vEl.style.display='none'; vEl.innerHTML=''; }
  })();
  // ── IMÓVEIS SEMELHANTES ──
  (function(){
    const sEl=document.getElementById('im-similares'); if(!sEl) return;
    sEl.style.display='none'; sEl.innerHTML='';
    function miniCard(x, condDele){
      const foto=(x.fotos||[]).find(f=>f&&(String(f).startsWith('data:')||String(f).startsWith('http')));
      const preco=(typeof brl==='function')?brl(x.preco):('R$ '+(x.preco||''));
      return '<div onclick="event.stopPropagation();_openImovModalWith(\''+x.id+'\', window._simCondMap[\''+condDele.id+'\']);document.querySelector(\'.imov-modal\').scrollTop=0" style="cursor:pointer;background:#fff;border:1px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:0 4px 14px rgba(13,59,84,.07);transition:transform .2s" onmouseover="this.style.transform=\'translateY(-3px)\'" onmouseout="this.style.transform=\'\'">' +
        '<div style="height:110px;background:var(--sl);display:flex;align-items:center;justify-content:center;font-size:24px;overflow:hidden">'+(foto?'<img src="'+foto+'" alt="'+(x.titulo||'')+'" loading="lazy" style="width:100%;height:100%;object-fit:cover">':'🏠')+'</div>' +
        '<div style="padding:10px 12px"><div style="font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:700">'+(x.tipo||'Imóvel')+'</div>' +
        '<div style="font-family:Fraunces,serif;font-size:13.5px;color:var(--ocean);font-weight:600;line-height:1.25;margin:3px 0">'+(x.titulo||'—')+'</div>' +
        '<div style="font-size:10.5px;color:var(--tm)">📍 '+(condDele.nome||'')+'</div>' +
        '<div style="font-family:Fraunces,serif;font-size:14px;color:var(--ocean);font-weight:600;margin-top:5px">'+preco+'</div></div></div>';
    }
    getDataResolved().then(function(all){
      window._simCondMap=window._simCondMap||{};
      all.forEach(function(c){ window._simCondMap[c.id]=c; });
      window._simCondMap[cnd.id]=cnd;
      const meuTipo=(im.tipo||'').toLowerCase();
      let lista=[];
      // 1º: mesmo condomínio, mesmo tipo
      (cnd.imoveis||[]).forEach(function(x){ if(x.id!==im.id && (x.tipo||'').toLowerCase()===meuTipo) lista.push({x:x,c:cnd}); });
      // 2º: mesmo condomínio, outros tipos
      (cnd.imoveis||[]).forEach(function(x){ if(x.id!==im.id && (x.tipo||'').toLowerCase()!==meuTipo) lista.push({x:x,c:cnd}); });
      // 3º: mesmo tipo em outros condomínios
      all.forEach(function(c){ if(c.id===cnd.id) return; (c.imoveis||[]).forEach(function(x){ if((x.tipo||'').toLowerCase()===meuTipo) lista.push({x:x,c:c}); }); });
      lista=lista.slice(0,3);
      if(lista.length){
        sEl.innerHTML='<div style="font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--tm);margin-bottom:10px">Imóveis semelhantes</div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px">'+lista.map(function(o){return miniCard(o.x,o.c);}).join('')+'</div>';
        sEl.style.display='block';
      }
    }).catch(function(){});
  })();
  document.getElementById('im-preco').textContent=brl(im.preco);
  document.getElementById('im-tipo').textContent=[im.codigo?('Cód: '+im.codigo):null,im.tipo,im.status].filter(Boolean).join(' · ');
  // so campos preenchidos (evita cards com "—")
  const sp=[
    {i:'📐',v:im.area?m2(im.area):null,l:'Área'},
    {i:'🛏',v:im.quartos||null,l:'Quartos'},
    {i:'🛁',v:im.suites||null,l:'Suítes'},
    {i:'🚗',v:im.vagas||null,l:'Vagas'}
  ].filter(s=>s.v!==null&&s.v!==''&&s.v!==0);
  document.getElementById('im-specs').innerHTML=sp.map(s=>`<div class="imov-spec"><div class="imov-spec-ico">${s.i}</div><div class="imov-spec-v">${s.v}</div><div class="imov-spec-l">${s.l}</div></div>`).join('');
  document.getElementById('im-desc').textContent=im.descricao||'';
  const difs=im.diferenciais||[];
  document.getElementById('im-difs-w').style.display=difs.length?'':'none';
  document.getElementById('im-difs').innerHTML=difs.map(d=>`<span class="icdif">${d}</span>`).join('');
  const ex=[];
  if(im.financiamento)ex.push('✓ Aceita financiamento');
  if(im.permuta)ex.push('✓ Aceita permuta');
  if(im.iptu)ex.push(`IPTU: ${brl(im.iptu)}/ano`);
  if(im.condTaxa)ex.push(`Cond.: ${brl(im.condTaxa)}/mês`);
  document.getElementById('im-extra').innerHTML=ex.map(x=>`<span style="display:inline-block;margin-right:12px">${x}</span>`).join('');
  const wm=encodeURIComponent(`Olá! Tenho interesse no imóvel *${im.titulo}* no ${cnd.nome||'condomínio'}. Preço: ${brl(im.preco)}.`);
  document.getElementById('im-wpp').href=`https://wa.me/${WPP}?text=${wm}`;
  document.getElementById('im-ov').classList.add('op');
  document.body.style.overflow='hidden';
}
function closeImov(){document.getElementById('im-ov').classList.remove('op');document.body.style.overflow='';}

// ── CONTACT FORM ──
function scrollToContact(){window.location.href='/contato/';}

// Converte link do Google Maps em URL de embed
function buildMapsEmbed(url){
  if(!url) return null;
  // Se já é um embed
  if(url.includes('maps/embed')) return url;
  // Tenta extrair coordenadas de URLs tipo /@lat,lng
  const m=url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if(m) return `https://www.google.com/maps?q=${m[1]},${m[2]}&output=embed`;
  // Link de place
  if(url.includes('maps/place')) return url.replace('/maps/place','/maps/embed/v1/place')+'&key=';
  // Busca por texto (fallback)
  try{
    const u=new URL(url);
    const q=u.searchParams.get('q');
    if(q) return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
  }catch(e){}
  return null;
}

// ── FADE IN ──
const io=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('vis')});},{threshold:.05});
function obs(){document.querySelectorAll('.fade-in:not(.vis)').forEach((el,i)=>{el.style.transitionDelay=(i%3*.07)+'s';io.observe(el);})}

// ── ESC ──
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeSheet();closeImov();closeLightbox();document.body.style.overflow='';}
  if(e.key==='ArrowLeft'&&document.getElementById('lightbox').classList.contains('op'))lbNav(-1);
  if(e.key==='ArrowRight'&&document.getElementById('lightbox').classList.contains('op'))lbNav(1);
});

// ── SITE CONFIG (from CRM Editor) ──

function applySiteConfig(){
  try{
    const cfg=_siteCache?.siteCfg || JSON.parse(localStorage.getItem('cnp_site_config')||'{}');
    if(!cfg||!Object.keys(cfg).length) return;
    // Colors
    if(cfg.colors){
      const r=document.documentElement.style;
      if(cfg.colors.ocean) r.setProperty('--ocean',cfg.colors.ocean);
      if(cfg.colors.gold)  r.setProperty('--gold',cfg.colors.gold);
      if(cfg.colors.gl)    r.setProperty('--gl',cfg.colors.gl);
      if(cfg.colors.bg)    r.setProperty('--white',cfg.colors.bg);
      if(cfg.colors.sl)    r.setProperty('--sl',cfg.colors.sl);
      if(cfg.colors.text)  r.setProperty('--text',cfg.colors.text);
    }
    // Hero texts
    const sh=(id,html)=>{const e=document.getElementById(id);if(e)e.innerHTML=html;};
    const st=(id,txt)=>{const e=document.getElementById(id);if(e)e.textContent=txt;};
    if(cfg.h1l1||cfg.h1l2||cfg.h1l3){
      const h1=document.querySelector('.hero-h1');
      if(h1) h1.innerHTML=`${cfg.h1l1||'Os Melhores'}<br><em>${cfg.h1l2||'Condomínios'}</em><br>${cfg.h1l3||'do Litoral'}`;
    }
    if(cfg.desc){const d=document.querySelector('.hero-desc');if(d)d.textContent=cfg.desc;}
    if(cfg.btn1){const b=document.querySelector('.hero-btns .btn-p');if(b)b.textContent=cfg.btn1;}
    // Card busca
    if(cfg.cardTitle){const e=document.querySelector('.hc-title');if(e)e.textContent=cfg.cardTitle;}
    if(cfg.cardSub){const e=document.querySelector('.hc-sub');if(e)e.textContent=cfg.cardSub;}
    if(cfg.cardBtn){const e=document.querySelector('.search-btn');if(e)e.textContent=cfg.cardBtn;}
    // Sobre
    if(cfg.sobreTit){const e=document.querySelector('.sobre-sec .sectit');if(e) e.innerHTML=`Sua <em>${cfg.sobreTit}</em> Exclusiva`;}
    if(cfg.sobreTxt){const e=document.querySelector('.sobre-sec p');if(e){const s=e.querySelector('strong');const nome=s?s.textContent:'Condomínios na Praia';e.innerHTML=`A <strong style="color:var(--ocean);font-weight:500">${nome}</strong> ${cfg.sobreTxt.replace(/^A\s+\S+\s+é/i,'é').trim()}`;}}
    // Logo
    if(cfg.logoMain){const e=document.querySelector('.logo-main');if(e)e.textContent=cfg.logoMain;}
    if(cfg.logoSub){const e=document.querySelector('.logo-sub');if(e)e.textContent=cfg.logoSub;}
    // WPP links
    if(cfg.wpp){
      document.querySelectorAll('a[href*="wa.me"]').forEach(a=>{
        const url=new URL(a.href);if(url.hostname==='wa.me'){const p=url.pathname.replace('/','');if(p&&p.length>6)a.href=a.href.replace(p,cfg.wpp);}
      });
    }
    // Turismo banner
    if(cfg.turTag){const e=document.querySelector('.tur-banner-tag');if(e)e.textContent=cfg.turTag;}
    if(cfg.turTit){const e=document.querySelector('.tur-banner-title');if(e)e.textContent=cfg.turTit;}
    if(cfg.turDesc){const e=document.querySelector('.tur-banner-desc');if(e)e.textContent=cfg.turDesc;}
    if(cfg.turCta){const e=document.querySelector('.tur-banner-cta');if(e)e.innerHTML=cfg.turCta+' <span>→</span>';}
    // Rodapé
    if(cfg.rodNome){const e=document.querySelector('.flogo');if(e)e.textContent=cfg.rodNome;}
    if(cfg.rodTag){const e=document.querySelector('.ftag');if(e)e.textContent=cfg.rodTag;}
    if(cfg.rodDom){const e=document.querySelector('.fdom');if(e)e.textContent=cfg.rodDom;}
    // Nav CTA
    if(cfg.navCta){const e=document.querySelector('.nav-cta');if(e)e.textContent=cfg.navCta;}
    // Hero background image
    if(cfg.images&&cfg.images.heroBg){
      const hero=document.querySelector('.hero');
      if(hero){hero.style.backgroundImage=`url(${cfg.images.heroBg})`;hero.style.backgroundSize='cover';hero.style.backgroundPosition='center';}
    }
    // Stats labels
    if(cfg.stat1){const e=document.querySelectorAll('.stat-lbl');if(e[0])e[0].textContent=cfg.stat1;}
    if(cfg.stat2){const e=document.querySelectorAll('.stat-lbl');if(e[1])e[1].textContent=cfg.stat2;}
    if(cfg.stat3){const e=document.getElementById('h-ni');if(e){}/* handled by updateHeroStats */}
    if(cfg.stat3l){const e=document.querySelectorAll('.stat-lbl');if(e[2])e[2].textContent=cfg.stat3l;}
    // Turismo page (basic fields from old config)
    if(cfg.turH1){const e=document.querySelector('.tur-hero-h1');if(e) e.innerHTML=`Turismo em <em>${cfg.turH1}</em>`;}
    if(cfg.turSub){const e=document.querySelector('.tur-hero-sub');if(e) e.textContent=cfg.turSub;}
    if(cfg.turCtaTit){const e=document.querySelector('.tur-cta-final-title');if(e)e.textContent=cfg.turCtaTit;}
    if(cfg.turCtaSub){const e=document.querySelector('.tur-cta-final-sub');if(e)e.textContent=cfg.turCtaSub;}
    // Turismo config completo (do editor de turismo)
    if(cfg.turismo) applyTurismoConfig(cfg.turismo);
  }catch(err){console.warn('Site config error:',err);}
}

async function applyTurismoConfig(t){
  if(!t) return;
  const st=(sel,txt)=>{const e=document.querySelector(sel);if(e&&txt)e.textContent=txt;};
  const sh=(sel,html)=>{const e=document.querySelector(sel);if(e&&html)e.innerHTML=html;};
  try{
    // Hero
    if(t.heroTag) st('.tur-hero-tag',t.heroTag);
    if(t.h1Pre||t.h1) sh('.tur-hero-h1',`${t.h1Pre||'Turismo em'} <em>${t.h1||'Xangri-Lá'}</em>`);
    if(t.sub) st('.tur-hero-sub',t.sub);
    // Chips
    const chips=document.querySelectorAll('.tur-chip');
    [t.chip1,t.chip2,t.chip3,t.chip4,t.chip5].forEach((c,i)=>{if(chips[i]&&c)chips[i].textContent=c;});
    // Balneários
    if(t.balTit){const e=document.querySelector('#tur-balnear .tur-h2');if(e)e.innerHTML=t.balTit.replace(/(\S+)$/,' <em>$1</em>');}
    if(t.balIntro) st('#tur-balnear .tur-lead',t.balIntro);
    if(t.balList){
      const grid=document.getElementById('d-tur-bal-grid')||document.querySelector('.tur-balnear-grid');
      if(grid){const items=t.balList.split('\n').filter(Boolean);grid.innerHTML=items.map(b=>`<div class="tur-balnear-card">🌊<span>${b.trim()}</span></div>`).join('');}
    }
    if(t.balTxt){const e=document.querySelector('#tur-balnear .tur-text');if(e)e.textContent=t.balTxt;}
    // História
    if(t.histTit){const e=document.querySelector('#tur-historia .tur-h2');if(e)e.innerHTML=t.histTit.replace(/(\S+)$/,' <em>$1</em>');}
    const histParas=document.querySelectorAll('#tur-historia .tur-text');
    if(histParas[0]&&t.histP1) histParas[0].textContent=t.histP1;
    if(histParas[1]&&t.histP2) histParas[1].textContent=t.histP2;
    if(t.histNota){const e=document.querySelector('.tur-note');if(e)e.innerHTML=`A pessoa nascida em Xangri-Lá é denominada <strong>${t.histNota.includes('xangrilense')?'xangrilense':t.histNota}</strong>.`;}
    // Etimologia
    const ew=document.querySelectorAll('.tur-etym-word');
    const ed=document.querySelectorAll('.tur-etym-def');
    if(ew[0]&&t.etym1)ew[0].textContent=t.etym1;if(ed[0]&&t.etym1d)ed[0].textContent=t.etym1d;
    if(ew[1]&&t.etym2)ew[1].textContent=t.etym2;if(ed[1]&&t.etym2d)ed[1].textContent=t.etym2d;
    // Cards história
    const dc=document.querySelectorAll('.tur-deco-card');
    if(dc[0]){if(t.card1Ico)dc[0].querySelector('.tur-deco-ico').textContent=t.card1Ico;if(t.card1Tit)dc[0].querySelector('.tur-deco-title').textContent=t.card1Tit;if(t.card1Sub)dc[0].querySelector('.tur-deco-sub').textContent=t.card1Sub;if(t.card1Desc)dc[0].querySelector('.tur-deco-desc').textContent=t.card1Desc;}
    if(dc[1]){if(t.card2Ico)dc[1].querySelector('.tur-deco-ico').textContent=t.card2Ico;if(t.card2Tit)dc[1].querySelector('.tur-deco-title').textContent=t.card2Tit;if(t.card2Sub)dc[1].querySelector('.tur-deco-sub').textContent=t.card2Sub;if(t.card2Desc)dc[1].querySelector('.tur-deco-desc').textContent=t.card2Desc;}
    // Praias
    if(t.praiasTit){const e=document.querySelector('#tur-praias .tur-h2');if(e)e.innerHTML=t.praiasTit.replace(/(\S+)$/,' <em>$1</em>');}
    if(t.praiasIntro) st('#tur-praias .tur-lead',t.praiasIntro);
    if(t.praias&&t.praias.length){
      const list=document.querySelector('.tur-praia-list');
      if(list) list.innerHTML=t.praias.map(p=>`
        <article class="tur-praia-card">
          <div class="tur-praia-num">${p.num||''}</div>
          <div class="tur-praia-body">
            <div class="tur-praia-loc">📍 ${p.loc||''}</div>
            <h3 class="tur-praia-title">${p.nome||''}</h3>
            <p class="tur-praia-text">${p.texto||''}</p>
            <div class="tur-praia-tags">${(p.tags||'').split(',').filter(Boolean).map(tg=>`<span>${tg.trim()}</span>`).join('')}</div>
          </div>
        </article>`).join('');
    }
    // Dados
    if(t.dadosTit){const e=document.querySelector('#tur-dados .tur-h2');if(e)e.innerHTML=t.dadosTit.replace(/(\S+)$/,' <em>$1</em>');}
    if(t.dadosIntro) st('#tur-dados .tur-lead',t.dadosIntro);
    if(t.dadosFonte) st('.tur-fonte',t.dadosFonte);
    if(t.ts&&t.ts.length){
      const cards=document.querySelectorAll('.tur-stat-card');
      t.ts.forEach((s,i)=>{if(cards[i]){const n=cards[i].querySelector('.tur-stat-num');const l=cards[i].querySelector('.tur-stat-label');if(n&&s.num)n.textContent=s.num;if(l&&s.desc)l.textContent=s.desc;}});
    }
    // O que fazer
    if(t.fazerTit){const e=document.querySelector('#tur-fazer .tur-h2');if(e)e.innerHTML=t.fazerTit.replace(/(\S+)$/,' <em>$1</em>');}
    if(t.fazer&&t.fazer.length){
      const grid=document.querySelector('.tur-fazer-grid');
      if(grid) grid.innerHTML=t.fazer.map(f=>`
        <div class="tur-fazer-item"><span class="tur-fazer-ico">${f.ico||''}</span><div><strong>${f.tit||''}</strong><p>${f.desc||''}</p></div></div>`).join('');
    }
    // CTA Final
    if(t.ctaTit) st('.tur-cta-final-title',t.ctaTit);
    if(t.ctaSub) st('.tur-cta-final-sub',t.ctaSub);
    if(t.ctaBtn1){const e=document.querySelector('.tur-cta-final-btns .btn-p');if(e)e.textContent=t.ctaBtn1;}
    if(t.ctaBtn2){const e=document.querySelector('.tur-cta-final-btns .btn-g2');if(e)e.textContent=t.ctaBtn2;}
    if(t.qualTit){const e=document.querySelector('#tur-imoveis .tur-h2');if(e)e.innerHTML=`Invista no <em>${t.qualTit.replace('Invista no ','')}</em>`;}
    if(t.qualTxt){const e=document.querySelector('#tur-imoveis .tur-text');if(e)e.textContent=t.qualTxt;}
    // Fotos de turismo
    if(t.turFotos&&t.turFotos.length){
      const fotos=await resolvePhotos(t.turFotos);
      const valid=fotos.filter(f=>f&&(f.startsWith('data:')||f.startsWith('http')));
      if(valid[0]){
        const hero=document.querySelector('.tur-hero');
        if(hero){hero.style.backgroundImage=`url(${valid[0]})`;hero.style.backgroundSize='cover';hero.style.backgroundPosition='center';}
      }
    }
  }catch(e){console.warn('applyTurismoConfig error',e);}
}


// ── BUILD COND CARD ──
function buildCondCard(c){
  const loc=c.localizacao||c.cidade||'';
  // Na homepage, cada card usa até três fotos; a galeria completa permanece na página do condomínio.
  const todas=(c.fotos||[]).slice(0,3);
  // aceita data:, http(s) e blob: — descarta apenas referências não resolvidas (idb:) e vazios
  const fotos=todas.filter(f=>f&&typeof f==='string'&&(f.startsWith('data:')||f.startsWith('http')||f.startsWith('blob:')));
  // diagnóstico: veja no console (F12) quantas fotos cada card recebeu
  if(window._DEBUG_FOTOS) console.log('[card]',c.nome,'| fotos recebidas:',todas.length,'| válidas p/ carrossel:',fotos.length, todas.length&&!fotos.length?'(⚠ todas em formato não suportado: '+String(todas[0]).slice(0,12)+'…)':'');
  let imgH;
  if(fotos.length>1){
    // carrossel automático de imagens
    const slides=fotos.map((f,i)=>fotoTag(f,c.nome,{className:`ci-slide${i===0?' ativa':''}`,sizes:'(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 320px',width:640,height:384})).join('');
    const dots=fotos.map((f,i)=>`<span class="ci-dot${i===0?' ativa':''}"></span>`).join('');
    imgH=`<div class="ci-carousel" data-total="${fotos.length}">${slides}<div class="ci-dots">${dots}</div></div>`;
  } else if(fotos.length===1){
    imgH=fotoTag(fotos[0],c.nome,{sizes:'(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 320px',width:640,height:384});
  } else {
    imgH=`<div class="ci-grad ${GI[loc]||'g-ot'}">${GE[loc]||'🏠'}</div>`;
  }
  const imd=(c.imoveis||[]).filter(i=>i.status==='Disponível');
  const condUrl=c.slug?('/condominio/?id='+encodeURIComponent(c.slug)):('/condominio/?id='+encodeURIComponent(c.id));
  return`<a class="ccard vis" href="${condUrl}" style="text-decoration:none;color:inherit;display:block">
    <div class="ci"${!fotos.length?` data-home-cond-img="${escapeAttr(c.id)}"`:''}>${imgH}<div class="cbadge">${loc}</div>${imd.length?`<div class="cibadge">${imd.length} ${imd.length>1?'imóveis':'imóvel'}</div>`:''}</div>
    <div class="cbody">
      <div class="cname">${c.nome}</div>
      <div class="cloc">📍 ${loc}</div>
      <p class="cdesc">${(c.descricao||'').slice(0,95)}${(c.descricao||'').length>95?'...':''}</p>
      <div class="cams">${(Array.isArray(c.amenidades)?c.amenidades:(c.amenidades||'').split(',').map(s=>s.trim()).filter(Boolean)).slice(0,3).map(a=>`<span class="amtag">${a}</span>`).join('')}</div>
    </div>
    <div class="cfooter"><span class="ccta">Ver detalhes <span class="ccta-arrow">→</span></span><span style="font-size:10px;color:#5a7080">${(c.amenidades||[]).length} comodidades</span></div>
  </a>`;
}

// ── CARROSSEL AUTOMÁTICO DOS CARDS ──
// Alterna as imagens de cada .ci-carousel a cada 3s, com fade. Pausa no hover.
let _carouselTimer=null;
function iniciarCarrosseisCards(){
  if(_carouselTimer)clearInterval(_carouselTimer);
  _carouselTimer=setInterval(function(){
    document.querySelectorAll('.ci-carousel').forEach(function(car){
      if(car.dataset.pausado==='1')return;
      const slides=car.querySelectorAll('.ci-slide');
      const dots=car.querySelectorAll('.ci-dot');
      if(slides.length<2)return;
      let atual=0;
      slides.forEach((s,i)=>{if(s.classList.contains('ativa'))atual=i;});
      const prox=(atual+1)%slides.length;
      slides[atual].classList.remove('ativa');slides[prox].classList.add('ativa');
      if(dots.length){dots[atual]&&dots[atual].classList.remove('ativa');dots[prox]&&dots[prox].classList.add('ativa');}
    });
  },3000);
  // pausar no hover (desktop)
  document.querySelectorAll('.ci-carousel').forEach(function(car){
    if(car.dataset.bound==='1')return;car.dataset.bound='1';
    car.addEventListener('mouseenter',()=>car.dataset.pausado='1');
    car.addEventListener('mouseleave',()=>car.dataset.pausado='0');
  });
}
window.iniciarCarrosseisCards=iniciarCarrosseisCards;


// ── BUILD IMOV CARD ──
function slugHomeImovel(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').replace(/-+/g,'-');}
function urlHomeImovel(i){
  if(!i) return '/imovel/';
  const stored=String(i.slug||'').trim().replace(/^\/+|\/+$/g,'');
  if(stored) return '/imovel/'+encodeURIComponent(stored)+'/';
  const base=slugHomeImovel(i.titulo||i.tipo||'imovel');
  const code=slugHomeImovel(i.codigo||'');
  const slug=code && !base.endsWith(code) ? base+'-'+code : base;
  return '/imovel/'+encodeURIComponent(slug||i.id)+'/';
}
function buildImovCard(i){
  const foto=i.fotos&&i.fotos.find(f=>f&&(f.startsWith('data:')||f.startsWith('http')));
  const brl=v=>{try{return Number(String(v||0).replace(/\D/g,'')).toLocaleString('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:0});}catch{return'Consulte';}};
  const condo=i._c?`${i._c.nome} · ${i._c.localizacao||i._c.cidade||''}`:(i.condominioNome|| [i.bairro_end||i.bairroEnd, i.cidade_end||i.cidadeEnd].filter(Boolean).join(' · ') || '');
  const sc=i.status==='Disponível'?'stv':i.status==='Reservado'?'str':'stv';
  const areaVal = i.area||i.areaPrivativa||i.area_privativa||i.areaConstruida||i.area_construida||i.terreno;
  const specs=[
    i.quartos?`🛏 ${i.quartos} ${i.quartos==1?'quarto':'quartos'}`:null,
    i.suites?`🛁 ${i.suites} ${i.suites==1?'suíte':'suítes'}`:null,
    i.banheiros?`🚿 ${i.banheiros} ${i.banheiros==1?'banheiro':'banheiros'}`:null,
    areaVal?`📐 ${areaVal}m²`:null,
    i.vagas?`🚗 ${i.vagas} ${i.vagas==1?'vaga':'vagas'}`:null
  ].filter(Boolean).map(s=>`<span class="icspec">${s}</span>`).join('');
  return`<a class="icard vis" href="${urlHomeImovel(i)}" style="text-decoration:none;color:inherit">
    <div class="icimg"${!foto?` data-home-imov-img="${escapeAttr(i.id)}"`:''}>${foto?fotoTag(foto,i.titulo,{sizes:'(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 320px',width:640,height:384}):'🏠'}<div class="icst ${sc}">${i.status||'Disponível'}</div>${i.codigo?`<div class="iccod">${i.codigo}</div>`:''}</div>
    <div class="icbody">
      <div class="ictipo">${i.tipo||'Imóvel'}</div>
      <div class="ictit">${i.titulo||'—'}</div>
      ${condo?`<div class="iccond">📍 ${condo}</div>`:''}
      <div class="icspecs">${specs}</div>
    </div>
    <div class="icfoot"><div class="icpreco">${brl(i.preco)}</div><span style="font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--ocean)">Ver →</span></div>
  </a>`;
}

// ── HOME DESTAQUES ──
// ── CARROSSEL EDITORIAL (Lagoa / Mar) ──
function initCarrossel(el){
  const track=el.querySelector('.carr-track');
  const slides=[].slice.call(el.querySelectorAll('.carr-slide'));
  const dots=[].slice.call(el.querySelectorAll('.carr-dot'));
  let idx=0, timer=null;
  function ir(n){
    idx=(n+slides.length)%slides.length;
    track.style.transform='translateX(-'+(idx*100)+'%)';
    slides.forEach((s,k)=>s.classList.toggle('on',k===idx));
    dots.forEach((d,k)=>d.classList.toggle('on',k===idx));
  }
  function prox(){ ir(idx+1); }
  function play(){ parar(); timer=setInterval(prox,4000); }
  function parar(){ if(timer){clearInterval(timer);timer=null;} }
  el.querySelector('.carr-arrow.prev').addEventListener('click',()=>{ir(idx-1);play();});
  el.querySelector('.carr-arrow.next').addEventListener('click',()=>{ir(idx+1);play();});
  dots.forEach(d=>d.addEventListener('click',()=>{ir(parseInt(d.getAttribute('data-go')));play();}));
  // swipe no celular
  let x0=null;
  track.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;parar();},{passive:true});
  track.addEventListener('touchend',e=>{
    if(x0===null) return;
    const dx=e.changedTouches[0].clientX-x0;
    if(Math.abs(dx)>40){ ir(dx<0?idx+1:idx-1); }
    x0=null; play();
  },{passive:true});
  // pausa ao passar o mouse
  el.addEventListener('mouseenter',parar);
  el.addEventListener('mouseleave',play);
  ir(0); play();
}
function initTodosCarrosseis(){
  document.querySelectorAll('.carr[data-carr]').forEach(initCarrossel);
}
// Carrega as fotos dos carrosséis (gerenciadas pelo CRM, tabela os_carrossel_home).
// As três capas editoriais locais são aplicadas antes de qualquer consulta remota,
// para que a primeira pintura não dependa do Supabase.
async function carregarFotosCarrossel(){
  const mapa={
    'lagoa-1':{avif:'/img/home-lagoa-capa.avif',fallback:'/img/home-lagoa-capa.webp'},
    'mar-1':{avif:'/img/home-mar-capa.avif',fallback:'/img/home-mar-capa.webp'},
    'cidade-1':{avif:'/img/home-cidade-capa.avif',fallback:'/img/home-cidade-capa.webp'}
  };
  const aplicarFotos=()=>{
    document.querySelectorAll('.carr-slide[data-slot], .carr-single[data-slot]').forEach(sl=>{
      const imagem=mapa[sl.getAttribute('data-slot')];
      if(imagem){
        const cap=sl.querySelector('.carr-cap');
        const capTxt=cap?cap.textContent:'';
        const ph=sl.querySelector('.carr-slide-ph');
        if(ph) ph.outerHTML='<picture style="display:block;width:100%;height:100%"><source type="image/avif" srcset="'+imagem.avif+'"><img src="'+imagem.fallback+'" alt="'+capTxt+'" loading="lazy" decoding="async" width="1800" height="1267" style="width:100%;height:100%;object-fit:cover"></picture>';
      }
    });
    document.querySelectorAll('.imm-bg[data-slot]').forEach(el=>{
      const imagem=mapa[el.getAttribute('data-slot')];
      if(imagem){
        el.style.backgroundImage='url("'+imagem.fallback+'")';
        el.style.backgroundImage='image-set(url("'+imagem.avif+'") type("image/avif"), url("'+imagem.fallback+'") type("image/webp"))';
      }
    });
    document.querySelectorAll('.viv-photo[data-slot]').forEach(el=>{
      const imagem=mapa[el.getAttribute('data-slot')];
      if(imagem){
        const ph=el.querySelector('.viv-photo-ph');
        if(ph){
          ph.style.backgroundImage='url("'+imagem.fallback+'")';
          ph.style.backgroundImage='image-set(url("'+imagem.avif+'") type("image/avif"), url("'+imagem.fallback+'") type("image/webp"))';
        }
      }
    });
  };
  aplicarFotos();
  try{
    await carregarDadosExtras();
    const fotos=window._carrosselFotos||[];
    if(Array.isArray(fotos)) fotos.forEach(f=>{
      // Somente slots não editoriais podem ser substituídos pelo CRM.
      if(f.slot && f.foto_url && !mapa[f.slot]) mapa[f.slot]=f.foto_url;
    });
    aplicarFotos();
  }catch(e){
    // As capas locais já foram aplicadas; a falha remota não pode apagá-las.
    try{ console.warn('[fotos carrossel] fallback local ativo',e); }catch(_){}
  }
}

// Carrega as fotos de capa dos cards de decisão (gerenciadas pelo CRM)
async function carregarCapasDecisao(){
  try{
    const grid=document.getElementById('decisao-grid');
    if(!grid) return;
    await carregarDadosExtras();
    const capas = window._capasDecisao || [];
    if(!Array.isArray(capas)) return;
    const mapa={};
    capas.forEach(c=>{ if(c.slug && c.foto_url) mapa[c.slug]=c.foto_url; });
    grid.querySelectorAll('.guia-card-top[data-capa]').forEach(el=>{
      const slug=el.getAttribute('data-capa');
      const url=mapa[slug];
      if(url){
        el.style.backgroundImage=`linear-gradient(to top,rgba(12,48,73,.55),rgba(12,48,73,.05)),url("${url}")`;
        el.style.backgroundSize='cover';
        el.style.backgroundPosition='center';
      }
    });
  }catch(e){ /* silencioso: mantém os degradês padrão */ }
}

function buildHomeDestaques(){
  const destCond=_siteCache?.destCond||[];
  const destImov=_siteCache?.destImov||[];

  getDataResolved().then(condos=>{
    if(!condos || !condos.length){
      const cg=document.getElementById('home-cond-grid');
      if(cg) cg.innerHTML='<div class="empty" style="grid-column:1/-1"><div class="empty-ico">🏘</div><p>Cadastre condomínios no CRM para exibi-los aqui</p></div>';
      return;
    }

    const destCondSet=new Set((Array.isArray(destCond)?destCond:[]).map(String));
    const ofertaCount=c=>(c.imoveis||[]).filter(i=>i&&i.status==='Disponível'&&i.publicar!==false).length;
    const ordenarDestaques=(a,b)=>{
      const diff=ofertaCount(b)-ofertaCount(a);
      if(diff)return diff;
      const aManual=destCondSet.has(String(a.id));
      const bManual=destCondSet.has(String(b.id));
      if(aManual!==bManual)return aManual?-1:1;
      return String(a.nome||'').localeCompare(String(b.nome||''),'pt');
    };
    // A prioridade comercial é a oferta disponível; a curadoria manual só desempata.
    let showCond=condos.filter(c=>c.ativo!==false).sort(ordenarDestaques).slice(0,10);
    if(!showCond.length) showCond=condos.slice().sort(ordenarDestaques).slice(0,10);

    const cg=document.getElementById('home-cond-grid');
    if(cg) cg.innerHTML=showCond.map(buildCondCard).join('');
    if(window.iniciarCarrosseisCards)iniciarCarrosseisCards();

    // Usar a lista COMPLETA de imóveis (inclui os sem condomínio vinculado),
    // para que destaques marcados no CRM sempre apareçam.
    let allImov=[];
    if(_siteCache && Array.isArray(_siteCache.imoveis) && _siteCache.imoveis.length){
      allImov=_siteCache.imoveis
        .filter(i=>i.publicar!==false && i.status==='Disponível')
        .map(i=>({...i, _c:i._c||null}));
    } else {
      // fallback: método antigo (imóveis aninhados nos condomínios)
      condos.forEach(c=>(c.imoveis||[]).forEach(i=>{
        if(i.publicar!==false&&i.status==='Disponível') allImov.push({...i,_c:c});
      }));
    }

    // Categorias editoriais: sempre baseadas no tipo e no vínculo real do imóvel.
    const tipoCategoria = i => {
      const t=String(i.tipo||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if(/apart|loft|kitnet|flat|studio/.test(t)) return 'apartamento';
      if(/terreno|lote/.test(t)) return 'terreno';
      return 'casa';
    };
    const ehFora = i => i.fora_condominio===true || i.foraCondominio===true;
    const pickDestaques = (lista, ids, limite) => {
      const escolhidos = Array.isArray(ids) && ids.length ? lista.filter(i=>ids.includes(i.id)) : [];
      const resto = lista.filter(i=>!escolhidos.includes(i));
      return escolhidos.concat(resto).slice(0,limite);
    };
    const renderHomeGrid = (id, lista, icon, texto) => {
      const el=document.getElementById(id);
      if(el) el.innerHTML=lista.length ? lista.map(buildImovCard).join('') : `<div class="empty" style="grid-column:1/-1"><div class="empty-ico">${icon}</div><p>${texto}</p></div>`;
    };

    const casasCondominio = allImov.filter(i=>!ehFora(i) && tipoCategoria(i)==='casa');
    const apartamentos = allImov.filter(i=>!ehFora(i) && tipoCategoria(i)==='apartamento');
    const terrenosCondominio = allImov.filter(i=>!ehFora(i) && tipoCategoria(i)==='terreno');
    const casasFora = allImov.filter(i=>ehFora(i) && tipoCategoria(i)==='casa');
    const terrenosFora = allImov.filter(i=>ehFora(i) && tipoCategoria(i)==='terreno');
    const destTerreno = _siteCache?.destTerreno||[];
    const toggleHomeStockSection = (id, visible) => {
      const section = document.getElementById(id);
      if(section) section.hidden = !visible;
    };
    const isVerticalCondo = c => /vertical/i.test(String(c.orientacao||'')) || /vertical/i.test(String(c.perfil||''));
    const commercialType = i => {
      const value = String(i.tipo||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      return /loja|sala comercial|sala|ponto comercial|conjunto comercial/.test(value);
    };
    const comerciais = allImov.filter(commercialType).slice(0,6);
    renderHomeGrid('home-comercial-grid', comerciais, '🏬', 'Cadastre lojas e salas comerciais no CRM para exibi-las aqui');
    toggleHomeStockSection('sec-imoveis-comerciais', comerciais.length > 0);
    const verticalCondos = condos.filter(isVerticalCondo).sort(ordenarDestaques).slice(0,6);
    const verticalGrid = document.getElementById('home-cond-vertical-grid');
    if(verticalGrid){
      verticalGrid.innerHTML = verticalCondos.length ? verticalCondos.map(buildCondCard).join('') : '';
      toggleHomeStockSection('sec-condominios-verticais', verticalCondos.length > 0);
    }

    renderHomeGrid('home-imov-grid', pickDestaques(casasCondominio, destImov, 8), '🏠', 'Cadastre casas e sobrados em condomínio no CRM para exibi-los aqui');
    renderHomeGrid('home-apartamento-grid', apartamentos.slice(0,8), '🏢', 'Nenhum apartamento publicado disponível no momento');
    renderHomeGrid('home-fora-grid', casasFora.slice(0,8), '🏡', 'Cadastre casas e sobrados fora de condomínio no CRM para exibi-los aqui');
    renderHomeGrid('home-terreno-grid', pickDestaques(terrenosCondominio, destTerreno, 6), '🌳', 'Cadastre terrenos em condomínio no CRM para exibi-los aqui');
    renderHomeGrid('home-terreno-fora-grid', terrenosFora.slice(0,6), '📐', 'Ainda não há terrenos fora de condomínio publicados.');
    // Se a secção já estiver próxima, o observer pode ter disparado antes do render.
    const homePhotoSection=document.getElementById('sec-imoveis')||document.getElementById('sec-condominios');
    if(homePhotoSection && homePhotoSection.getBoundingClientRect().top < window.innerHeight+700 && typeof carregarFotosHomeCards==='function'){
      setTimeout(carregarFotosHomeCards,0);
    }

    // Activar imagens apenas quando os cards se aproximarem do viewport.
    ativarImagensAdidas();
    // Trigger fade animations
    if(typeof obs === 'function') obs();

  }).catch(e=>{
    console.error('buildHomeDestaques error:', e);
  });
}

// ── BLOG FUNCTIONS ──
async function fetchBlogPosts(){
  try{
    const r=await fetch(SUPABASE_URL+'/rest/v1/blog_posts?publicado=eq.true&order=created_at.desc',{headers:{'apikey':SUPABASE_KEY,'Content-Type':'application/json'}});
    if(!r.ok) return [];
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  }catch(e){return [];}
}

async function fetchBlogPostsLeve(){
  const params='?publicado=eq.true&order=data.desc&select=id,slug,titulo,resumo,capa,categoria,data,created_at&limit=8';
  try{
    const r=await fetch(SUPABASE_URL+'/rest/v1/blog_posts'+params,{headers:{'apikey':SUPABASE_KEY,'Content-Type':'application/json'}});
    if(!r.ok)return [];
    const data=await r.json();
    return Array.isArray(data)?data:[];
  }catch(e){return [];}
}

async function fetchBlogPost(idOuSlug){
  const chave=encodeURIComponent(String(idOuSlug||'').trim());
  if(!chave)return null;
  const params=`?or=(id.eq.${chave},slug.eq.${chave})&select=id,slug,titulo,resumo,capa,categoria,data,created_at,autor,corpo,publicado&limit=1`;
  try{
    const r=await fetch(SUPABASE_URL+'/rest/v1/blog_posts'+params,{headers:{'apikey':SUPABASE_KEY,'Content-Type':'application/json'}});
    if(!r.ok)return null;
    const data=await r.json();
    return Array.isArray(data)?(data[0]||null):null;
  }catch(e){return null;}
}

let _blogHomePromise=null;
function buildHomeBlog(){
  if(!_blogHomePromise)_blogHomePromise=fetchBlogPostsLeve();
  _blogHomePromise.then(posts=>{
    const grid=document.getElementById('home-blog-grid');
    if(!grid)return;
    const recent=(posts||[]).filter(p=>p.publicado!==false).slice(0,8);
    if(!recent.length){grid.innerHTML='<div class="empty" style="grid-column:1/-1"><div class="empty-ico">📰</div><p>Nenhum artigo publicado ainda.</p></div>';return;}
    grid.innerHTML=recent.map(p=>{
      const img=p.capa?fotoTag(p.capa,p.titulo,{className:'bpcard-img',sizes:'(max-width: 640px) 100vw, (max-width: 1100px) 33vw, 320px',width:640,height:360}):'<div class="bpcard-img-ph">📰</div>';
      const data=(p.data||p.created_at)?new Date(p.data||p.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}):'';
      return`<div class="bpcard" onclick="window.location.href='/blog?id='+encodeURIComponent('${p.slug||p.id}')">
        ${img}
        <div class="bpcard-body">
          <div class="bpcard-cat">${p.categoria||'Blog'}</div>
          <div class="bpcard-title">${p.titulo}</div>
          <div class="bpcard-resumo">${p.resumo||''}</div>
          <div class="bpcard-footer"><span class="bpcard-data">${data}</span><span class="bpcard-ler">Ler artigo →</span></div>
        </div>
      </div>`;
    }).join('');
    // ativar auto-play do carrossel do blog após renderizar os posts
    if(typeof window.reativarCarrosseis==='function') setTimeout(window.reativarCarrosseis, 300);
  });
}

// Hidrata apenas os cards de imóveis/condomínios que já foram renderizados abaixo da dobra.
// A consulta completa continua disponível nas páginas dedicadas; a homepage recebe
// somente os dados necessários para texto, filtros e ordenação no primeiro carregamento.
let _homePhotoPromise=null;
function homeFirstPhoto(row){
  const listas=[row&&row.fotos_no_site,row&&row.fotos].filter(Array.isArray);
  for(const lista of listas){
    const foto=lista.find(f=>f&&typeof f==='string'&&!f.startsWith('idb:'));
    if(foto)return foto;
  }
  return '';
}
function aplicarFotoHome(el, row, titulo, tipo){
  const foto=homeFirstPhoto(row);
  if(!foto||!el)return;
  const img=fotoTag(foto,titulo||'Imagem do imóvel',{sizes:'(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 320px',width:640,height:384});
  if(!img)return;
  if(tipo==='cond'){
    const placeholder=el.querySelector('.ci-grad');
    if(placeholder)placeholder.remove();
    el.insertAdjacentHTML('afterbegin',img);
    el.removeAttribute('data-home-cond-img');
  }else{
    const badges=Array.from(el.querySelectorAll('.icst,.iccod'));
    el.innerHTML=img;
    badges.forEach(function(b){el.appendChild(b);});
    el.removeAttribute('data-home-imov-img');
  }
}
function carregarFotosHomeCards(){
  if(_homePhotoPromise)return _homePhotoPromise;
  const condEls=Array.from(document.querySelectorAll('[data-home-cond-img]'));
  const imovEls=Array.from(document.querySelectorAll('[data-home-imov-img]'));
  const condIds=[...new Set(condEls.map(el=>el.getAttribute('data-home-cond-img')).filter(Boolean))];
  const imovIds=[...new Set(imovEls.map(el=>el.getAttribute('data-home-imov-img')).filter(Boolean))];
  if(!condIds.length&&!imovIds.length)return Promise.resolve();
  const jobs=[];
  if(condIds.length)jobs.push(sbSite.get('condominios',`?id=in.(${condIds.join(',')})&select=id,fotos_no_site,fotos&limit=50`).catch(function(){return [];}));
  else jobs.push(Promise.resolve([]));
  if(imovIds.length)jobs.push(sbSite.get('imoveis',`?id=in.(${imovIds.join(',')})&select=id,fotos_no_site,fotos&limit=50`).catch(function(){return [];}));
  else jobs.push(Promise.resolve([]));
  _homePhotoPromise=Promise.all(jobs).then(function(result){
    const condMap={};(result[0]||[]).forEach(function(row){condMap[String(row.id)]=row;});
    const imovMap={};(result[1]||[]).forEach(function(row){imovMap[String(row.id)]=row;});
    condEls.forEach(function(el){const id=el.getAttribute('data-home-cond-img');const row=condMap[String(id)];if(row)aplicarFotoHome(el,row,el.querySelector('.cbadge')?.textContent||'Condomínio','cond');});
    imovEls.forEach(function(el){const id=el.getAttribute('data-home-imov-img');const row=imovMap[String(id)];if(row)aplicarFotoHome(el,row,'Imóvel','imov');});
  });
  return _homePhotoPromise;
}

// Adia consultas e imagens de seções abaixo da dobra até que o usuário se aproxime.
function deferHomeBelowFold(){
  const jobs=[
    {el:document.getElementById('sec-imoveis')||document.getElementById('sec-condominios'), run:()=>{if(typeof carregarFotosHomeCards==='function')carregarFotosHomeCards();}},
    {el:document.getElementById('sec-blog-preview'), run:()=>{if(!window._homeBlogLoaded){window._homeBlogLoaded=true;buildHomeBlog();}}},
    {el:document.getElementById('decisao-grid'), run:()=>{if(typeof carregarCapasDecisao==='function')carregarCapasDecisao();}},
    {el:document.querySelector('.viv-photo[data-slot]'), run:()=>{if(typeof carregarFotosCarrossel==='function')carregarFotosCarrossel();}}
  ].filter(job=>job.el);
  if(!jobs.length)return;
  if(!('IntersectionObserver' in window)){
    setTimeout(()=>jobs.forEach(job=>job.run()),1200);
    return;
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      observer.unobserve(entry.target);
      const job=jobs.find(item=>item.el===entry.target);
      if(job)job.run();
    });
  },{rootMargin:'700px 0px'});
  jobs.forEach(job=>observer.observe(job.el));
}

function openBlog(){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('on'));
  const vb=document.getElementById('view-blog');
  if(vb){vb.classList.add('on');rBlog();renderContempladasCards('blog-ct-cards');}
  document.querySelectorAll('.nav-link').forEach(n=>n.classList.remove('nav-active'));
  const nb=document.getElementById('nav-blog');if(nb)nb.classList.add('nav-active');
  window.scrollTo({top:0,behavior:'smooth'});
}

function rBlog(){
  const grid=document.getElementById('blog-grid');
  if(!grid)return;
  grid.innerHTML='<div class="empty" style="grid-column:1/-1"><div class="empty-ico">⏳</div><p>Carregando...</p></div>';
  fetchBlogPostsLeve().then(posts=>{
    if(!posts||!posts.length){grid.innerHTML='<div class="empty" style="grid-column:1/-1"><div class="empty-ico">📰</div><p>Nenhum artigo publicado.</p></div>';return;}
    grid.innerHTML=posts.map(p=>{
      const img=p.capa?fotoTag(p.capa,p.titulo,{className:'bpcard-img',sizes:'(max-width: 640px) 100vw, (max-width: 1100px) 33vw, 320px',width:640,height:360}):'<div class="bpcard-img-ph">📰</div>';
      const dt=(p.data||p.created_at)?new Date(p.data||p.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}):'';
      return`<div class="bpcard" onclick="window.location.href='/blog?id='+encodeURIComponent('${p.slug||p.id}')">
        ${img}
        <div class="bpcard-body">
          <div class="bpcard-cat">${p.categoria||'Blog'}</div>
          <div class="bpcard-title">${p.titulo}</div>
          <div class="bpcard-resumo">${(p.resumo||'').slice(0,120)}${(p.resumo||'').length>120?'...':''}</div>
          <div class="bpcard-footer"><span class="bpcard-data">${dt}</span><span class="bpcard-ler">Ler artigo →</span></div>
        </div>
      </div>`;
    }).join('');
  });
}


// ── FORMATADOR DE ARTIGO ──
function formatArtigoContent(txt){
  if(!txt) return '';
  // Se já tem HTML estruturado, retorna como está
  if(/<(p|h[1-6]|ul|ol|div)[\s>]/i.test(txt)) return txt;

  // Divide em blocos por linha
  const linhas = txt.split(/\n/).map(l=>l.trim());
  let html = '';
  let listaAberta = false;

  const fecharLista = ()=>{ if(listaAberta){ html+='</ul>'; listaAberta=false; } };

  linhas.forEach(linha=>{
    if(!linha){ fecharLista(); return; }

    // Item de lista: começa com - • * ou "1." "2)"
    if(/^[-•*]\s+/.test(linha) || /^\d+[.)]\s+/.test(linha)){
      if(!listaAberta){ html+='<ul>'; listaAberta=true; }
      html += '<li>' + linha.replace(/^[-•*]\s+/,'').replace(/^\d+[.)]\s+/,'') + '</li>';
      return;
    }
    fecharLista();

    // Título: linha curta (<60 chars), sem ponto final, ou termina com :
    const semPonto = !/[.!?]$/.test(linha);
    const curta = linha.length < 65;
    const terminaDoisPontos = linha.endsWith(':');
    const ehMaiuscula = linha === linha.toUpperCase() && linha.length > 3;

    if((curta && semPonto && linha.length > 3) || terminaDoisPontos || ehMaiuscula){
      const txtTit = linha.replace(/:$/,'');
      html += '<h2>' + txtTit + '</h2>';
    } else {
      // Parágrafo normal — destaca **negrito**
      let p = linha.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html += '<p>' + p + '</p>';
    }
  });
  fecharLista();
  return html;
}

function openArtigo(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('on'));
  const va=document.getElementById('view-artigo');
  if(va)va.classList.add('on');
  fetchBlogPost(id).then(p=>{
    if(!p)return;
    const tit=document.getElementById('artigo-titulo');if(tit)tit.textContent=p.titulo;
    const capa=document.getElementById('artigo-capa');
    if(capa){
      if(p.capa){ capa.src=p.capa; capa.style.display='block'; capa.alt=p.titulo||''; }
      else{ capa.style.display='none'; }
    }
    const body=document.getElementById('artigo-body');if(body){const txt=p.conteudo||p.corpo||'';body.innerHTML=formatArtigoContent(txt);}
    const meta=document.getElementById('artigo-meta');
    if(meta){
      const txtLen=(p.conteudo||p.corpo||'').length;
      const minLeitura=Math.max(1,Math.round(txtLen/1000));
      const dataFmt=(p.data||p.created_at)?new Date(p.data||p.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}):'';
      meta.innerHTML=`${p.categoria?`<span class="am-cat">${p.categoria}</span>`:''}${dataFmt?`<span>📅 ${dataFmt}</span>`:''}${p.autor?`<span>✍️ ${p.autor}</span>`:''}<span>⏱️ ${minLeitura} min de leitura</span>`;
    }
    const sh=document.getElementById('artigo-share');if(sh)sh.innerHTML=buildShareBar(p.titulo||'Confira este artigo',window.location.origin+'/#artigo/'+p.id);
    renderContempladasCards('artigo-ct-cards');
    window.scrollTo({top:0,behavior:'smooth'});
  });
}


// ── SIMULADOR DE FINANCIAMENTO ──
function simMask(el){
  let v = el.value.replace(/\D/g,'');
  if(!v){ el.value=''; return; }
  v = (parseInt(v)).toLocaleString('pt-BR');
  el.value = 'R$ ' + v;
}
function simParseBRL(s){
  return parseFloat((s||'').replace(/\D/g,'')) || 0;
}
function simPrazoLbl(){
  var _sp=document.getElementById('sim-prazo');if(!_sp)return;
  const p = parseInt(_sp.value);
  const anos = Math.round(p/12);
  document.getElementById('sim-prazo-lbl').textContent = p + ' meses (' + anos + ' anos)';
}
function simCalc(){
  var _sv=document.getElementById('sim-valor');if(!_sv)return;
  const valor = simParseBRL(_sv.value);
  const banco_parts = document.getElementById('sim-banco').value.split('|');
  const taxaAA = parseFloat(banco_parts[0]);
  const cota = parseFloat(banco_parts[1]) / 100;
  const dominio = banco_parts[2] || '';
  const prazo = parseInt(document.getElementById('sim-prazo').value);

  // Bank logo
  const logoEl = document.getElementById('sim-banco-logo');
  if(logoEl && dominio){
    logoEl.innerHTML = `<img loading="lazy" src="https://www.google.com/s2/favicons?domain=${dominio}&sz=64" style="width:32px;height:32px;border-radius:6px;vertical-align:middle" alt="banco">`;
  }

  const infoEl = document.getElementById('sim-entrada-info');
  if(infoEl) infoEl.textContent = `Este banco financia até ${Math.round(cota*100)}% do imóvel. Você precisa ter ${Math.round((1-cota)*100)}% de entrada.`;

  if(!valor || valor < 1000){
    document.getElementById('sim-parcela').textContent = 'R$ —';
    document.getElementById('sim-entrada').textContent = '—';
    document.getElementById('sim-financiado').textContent = '—';
    document.getElementById('sim-renda').textContent = '—';
    return;
  }

  const financiado = valor * cota;
  const entrada = valor - financiado;

  // SAC: amortização constante
  const amort = financiado / prazo;
  const taxaAM = Math.pow(1 + taxaAA/100, 1/12) - 1; // taxa mensal equivalente
  const primeiraParcela = amort + (financiado * taxaAM);

  // Renda mínima: parcela não pode passar de 30% da renda
  const rendaMin = primeiraParcela / 0.30;

  const fmt = n => 'R$ ' + Math.round(n).toLocaleString('pt-BR');

  document.getElementById('sim-parcela').textContent = fmt(primeiraParcela);
  document.getElementById('sim-entrada').textContent = fmt(entrada);
  document.getElementById('sim-financiado').textContent = fmt(financiado);
  document.getElementById('sim-renda').textContent = fmt(rendaMin);

  // WhatsApp link
  const _bsel = document.getElementById('sim-banco'); const bancoNome = _bsel.options[_bsel.selectedIndex].text.split(' —')[0];
  const msg = `Olá! Fiz uma simulação no site:\n\n🏠 Imóvel: ${fmt(valor)}\n🏦 Banco: ${bancoNome}\n💰 Entrada: ${fmt(entrada)}\n📊 Financiado: ${fmt(financiado)}\n📅 Prazo: ${prazo} meses\n💵 1ª parcela: ${fmt(primeiraParcela)}\n\nGostaria de mais informações sobre financiamento.`;
  document.getElementById('sim-wpp').href = 'https://wa.me/5551982868888?text=' + encodeURIComponent(msg);
}
// Init on load
setTimeout(()=>{ simPrazoLbl(); simCalc(); }, 500);


// ── GERAR PDF DA SIMULAÇÃO ──
async function simGerarPDF(){
  const valor = simParseBRL(document.getElementById('sim-valor').value);
  if(!valor || valor < 1000){ alert('Preencha o valor do imóvel primeiro.'); return; }

  // Carrega o jsPDF sob demanda (só na 1ª vez que gera PDF)
  if(!window.jspdf){
    await new Promise(function(res,rej){
      const s=document.createElement('script');
      s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      s.onload=res; s.onerror=rej;
      document.head.appendChild(s);
    }).catch(function(){ alert('Não foi possível carregar o gerador de PDF. Tente novamente.'); });
    if(!window.jspdf) return;
  }

  const _bp = document.getElementById('sim-banco').value.split('|');
  const taxaAA = parseFloat(_bp[0]);
  const cota = parseFloat(_bp[1]) / 100;
  const dominio = _bp[2] || '';
  const prazo = parseInt(document.getElementById('sim-prazo').value);
  const bancoSel = document.getElementById('sim-banco');
  const bancoNome = bancoSel.options[bancoSel.selectedIndex].text.split(' —')[0];

  const financiado = valor * cota;
  const entrada = valor - financiado;
  const amort = financiado / prazo;
  const taxaAM = Math.pow(1 + taxaAA/100, 1/12) - 1;
  const primeiraParcela = amort + (financiado * taxaAM);
  const ultimaParcela = amort + (amort * taxaAM);
  const rendaMin = primeiraParcela / 0.30;
  const totalPago = (primeiraParcela + ultimaParcela) / 2 * prazo;

  const fmt = n => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
  const hoje = new Date().toLocaleDateString('pt-BR');

  // WhatsApp link with simulation data
  const msg = `Olá Felipe! Fiz uma simulação no site:\n\n🏠 Imóvel: ${fmt(valor)}\n🏦 Banco: ${bancoNome}\n💰 Entrada: ${fmt(entrada)}\n📊 Financiado: ${fmt(financiado)}\n📅 Prazo: ${prazo} meses\n💵 1ª parcela: ${fmt(primeiraParcela)}\n\nGostaria de mais informações.`;
  const wppUrl = 'https://wa.me/5551982868888?text=' + encodeURIComponent(msg);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const W = 210;

  // Header - white background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, 48, 'F');
  // Gold accent line at bottom
  doc.setFillColor(184, 147, 90);
  doc.rect(0, 48, W, 2.5, 'F');

  // Logo: light blue rounded square with "RZN"
  doc.setFillColor(56, 152, 199);
  doc.roundedRect(20, 13, 24, 24, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('RZN', 32, 27, { align: 'center' });

  // Brand name - light blue
  doc.setTextColor(56, 152, 199);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('RZN Contempladas', 50, 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(184, 147, 90);
  doc.text('CRÉDITO CONTEMPLADO & FINANCIAMENTO', 50, 31);
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(10);
  doc.text('Simulação de Financiamento Imobiliário', 50, 39);

  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('Emitido em: ' + hoje, W - 20, 44, { align: 'right' });

  // Load bank logo (async)
  let bancoLogoData = null;
  if(dominio){
    try{
      const logoUrl = 'https://www.google.com/s2/favicons?domain=' + dominio + '&sz=128';
      const resp = await fetch(logoUrl);
      const blob = await resp.blob();
      bancoLogoData = await new Promise((res)=>{
        const reader = new FileReader();
        reader.onloadend = ()=>res(reader.result);
        reader.readAsDataURL(blob);
      });
    }catch(e){ console.warn('logo load failed', e); }
  }

  // Add bank logo top-right of header
  if(bancoLogoData){
    try{
      doc.addImage(bancoLogoData, 'PNG', W - 44, 13, 22, 22);
    }catch(e){ console.warn('addImage failed', e); }
  }

  let y = 62;

  // Consultor info
  doc.setFillColor(248, 250, 248);
  doc.setDrawColor(220, 225, 220);
  doc.roundedRect(20, y-6, W-40, 16, 2, 2, 'FD');
  doc.setTextColor(15, 37, 53);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Entre em contato', 28, y+1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(22, 163, 74);
  doc.text('WhatsApp: (51) 98286-8888', 28, y+7);
  y += 22;

  // Section: Dados
  doc.setTextColor(15, 37, 53);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados da Simulação', 20, y);
  y += 4;
  doc.setDrawColor(184, 147, 90);
  doc.setLineWidth(0.5);
  doc.line(20, y, 70, y);
  y += 12;

  const rows = [
    ['Banco', bancoNome],
    ['Taxa de juros', taxaAA.toFixed(2).replace('.',',') + '% a.a. + TR'],
    ['Valor do imóvel', fmt(valor)],
    ['Percentual financiado', Math.round(cota*100) + '%'],
    ['Sistema de amortização', 'SAC (parcelas decrescentes)'],
  ];

  doc.setFontSize(10);
  rows.forEach(([k,v])=>{
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(k, 22, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(v, W - 22, y, { align: 'right' });
    y += 9;
  });

  y += 8;

  // Resultado box
  doc.setFillColor(248, 250, 248);
  doc.setDrawColor(220, 225, 220);
  doc.roundedRect(20, y, W - 40, 75, 3, 3, 'FD');
  y += 12;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 37, 53);
  doc.text('Resultado', 28, y);
  y += 11;

  const resRows = [
    ['Entrada necessária', fmt(entrada)],
    ['Valor financiado', fmt(financiado)],
    ['Quantidade de parcelas', prazo + ' meses (' + Math.round(prazo/12) + ' anos)'],
    ['1ª parcela (maior)', fmt(primeiraParcela)],
    ['Última parcela (menor)', fmt(ultimaParcela)],
    ['Renda mínima sugerida', fmt(rendaMin)],
  ];
  doc.setFontSize(10);
  resRows.forEach(([k,v])=>{
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(k, 28, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 37, 53);
    doc.text(v, W - 28, y, { align: 'right' });
    y += 9.5;
  });

  y += 14;

  // WhatsApp CTA button (clickable link)
  doc.setFillColor(22, 163, 74);
  doc.roundedRect(20, y, W - 40, 24, 3, 3, 'F');
  doc.link(20, y, W - 40, 24, { url: wppUrl });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('FALAR COM FELIPE NO WHATSAPP', 105, y + 10, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Clique aqui • (51) 98286-8888', 105, y + 18, { align: 'center' });
  y += 34;

  // Disclaimer
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  const disc = 'Simulacao aproximada para fins informativos. Os valores podem variar conforme analise de credito, relacionamento bancario, perfil do proponente e politica vigente de cada instituicao. Nao inclui seguros obrigatorios (MIP/DFI), taxa de administracao mensal e variacao da TR. Consulte o consultor para valores exatos e condicoes atualizadas.';
  const lines = doc.splitTextToSize(disc, W - 40);
  doc.text(lines, 20, y);

  doc.save('Simulacao-RZN-Contempladas.pdf');
}


// ── CARROSSEL ──
const _carousels = {};

function buildCarousel(containerId, fotos, autoplay){
  const container = document.getElementById(containerId);
  if(!container) return;
  const valid = (fotos||[]).filter(f=>f && (f.startsWith('data:')||f.startsWith('http')));
  
  if(!valid.length){
    container.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;background:var(--sl,#e8eef0)">🏘</div>';
    return;
  }
  if(valid.length === 1){
    container.innerHTML = `<img src="${valid[0]}" style="width:100%;height:100%;object-fit:cover;background:#0c2733;display:block" alt="foto">`;
    return;
  }

  const slides = valid.map((f,i)=>`<div class="carousel-slide"><img src="${f}" alt="foto ${i+1}" loading="${i===0?'eager':'lazy'}"></div>`).join('');
  const dots = valid.map((_,i)=>`<span class="carousel-dot ${i===0?'active':''}" onclick="carouselGo('${containerId}',${i})"></span>`).join('');
  
  container.innerHTML = `
    <div class="carousel">
      <div class="carousel-track" id="${containerId}-track">${slides}</div>
      <button class="carousel-arrow prev" onclick="carouselPrev('${containerId}')">‹</button>
      <button class="carousel-arrow next" onclick="carouselNext('${containerId}')">›</button>
      <div class="carousel-dots">${dots}</div>
    </div>`;

  _carousels[containerId] = { idx: 0, total: valid.length, timer: null };

  if(autoplay !== false){
    _carousels[containerId].timer = setInterval(()=>carouselNext(containerId), 3500);
  }
}

function carouselGo(id, idx){
  const c = _carousels[id];
  if(!c) return;
  c.idx = (idx + c.total) % c.total;
  const track = document.getElementById(id+'-track');
  if(track) track.style.transform = `translateX(-${c.idx*100}%)`;
  const container = document.getElementById(id);
  if(container){
    container.querySelectorAll('.carousel-dot').forEach((d,i)=>d.classList.toggle('active', i===c.idx));
  }
  // Reset autoplay timer
  if(c.timer){ clearInterval(c.timer); c.timer = setInterval(()=>carouselNext(id), 3500); }
}
function carouselNext(id){ const c=_carousels[id]; if(c) carouselGo(id, c.idx+1); }
function carouselPrev(id){ const c=_carousels[id]; if(c) carouselGo(id, c.idx-1); }
function carouselStop(id){ const c=_carousels[id]; if(c&&c.timer){ clearInterval(c.timer); c.timer=null; } }



// ── COMPARTILHAMENTO ──
function shareWhats(titulo, url){
  const txt = encodeURIComponent(`${titulo}\n\n${url}`);
  window.open(`https://wa.me/?text=${txt}`, '_blank');
}
function shareCopy(url, btn){
  navigator.clipboard.writeText(url).then(()=>{
    if(btn){
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Link copiado!';
      btn.classList.add('copied');
      setTimeout(()=>{ btn.innerHTML = orig; btn.classList.remove('copied'); }, 2000);
    }
  }).catch(()=>{
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = url; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); if(btn){const o=btn.innerHTML;btn.innerHTML='✓ Copiado!';setTimeout(()=>btn.innerHTML=o,2000);} }catch(e){}
    document.body.removeChild(ta);
  });
}
function buildShareBar(titulo, url){
  const t = encodeURIComponent(titulo).replace(/'/g, "\\'");
  const u = (url||window.location.href).replace(/'/g, "\\'");
  return `<div class="share-bar">
    <span class="share-lbl">Compartilhar:</span>
    <button class="share-btn share-wpp" onclick="shareWhats('${titulo.replace(/'/g,"\\'")}','${u}')">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3M12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.3A10 10 0 1012 2z"/></svg>
      WhatsApp
    </button>
    <button class="share-btn share-copy" onclick="shareCopy('${u}', this)">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      Copiar link
    </button>
  </div>`;
}

// ── CONTEMPLADAS CARDS (blog/artigo) ──
async function renderContempladasCards(targetId){
  const el = document.getElementById(targetId);
  if(!el) return;
  try{
    const r = await fetch(SUPABASE_URL+'/rest/v1/cartas_contempladas?order=credito.desc&limit=3',{headers:{'apikey':SUPABASE_KEY}});
    let cartas = r.ok ? await r.json() : [];
    if(!Array.isArray(cartas) || !cartas.length){
      // Fallback static cards
      cartas = [
        {adm:'PORTO', cod:'CP01', credito:300000, prazo:200, parcela:1800, cor:'#003087'},
        {adm:'SERVOPA', cod:'CP02', credito:250000, prazo:180, parcela:1600, cor:'#17a589'},
        {adm:'HS', cod:'CP03', credito:200000, prazo:160, parcela:1400, cor:'#276749'},
      ];
    }
    const fmt = n => 'R$ ' + Number(n).toLocaleString('pt-BR');
    el.innerHTML = cartas.slice(0,3).map(c=>{
      const cor = c.cor || '#0c4a6e';
      const adm = c.adm || c.administradora || 'Carta';
      const wpp = 'https://wa.me/5551982868888?text=' + encodeURIComponent(`Olá! Tenho interesse na carta ${adm} de ${fmt(c.credito)}.`);
      return `<div class="ct-card" onclick="window.location='/contemplado-imoveis/'">
        <div class="ct-card-top">
          <div class="ct-card-adm"><div class="ct-card-logo" style="background:${cor}"><b style="font-size:9px;color:#fff">${adm.slice(0,3).toUpperCase()}</b></div>
          <div><div class="ct-card-adm-nome">${adm}</div><div class="ct-card-adm-cod">CÓD: ${c.cod||'—'}</div></div></div>
          <div class="ct-card-credito-lbl">Crédito disponível</div>
          <div class="ct-card-credito">${fmt(c.credito)}</div>
        </div>
        <div class="ct-card-body">
          <div class="ct-card-specs">
            <div class="ct-card-spec"><div class="ct-card-spec-lbl">Parcelas</div><div class="ct-card-spec-val">${c.prazo||'—'}x</div></div>
            <div class="ct-card-spec"><div class="ct-card-spec-lbl">Valor parcela</div><div class="ct-card-spec-val">${fmt(c.parcela)}</div></div>
          </div>
          <div class="ct-card-entrada">🔍 Consulte o valor de entrada</div>
          <div class="ct-card-actions">
            <span class="ct-card-ver">Ver detalhes →</span>
            <a class="ct-card-wpp" href="${wpp}" target="_blank" onclick="event.stopPropagation()">💬 WhatsApp</a>
          </div>
        </div>
      </div>`;
    }).join('');
  }catch(e){ console.warn('contempladas cards error', e); }
}

// ── INIT ──
(async function(){
  // Mostra loading inicial
  (document.getElementById('c-grid')||{style:{},classList:{add(){},remove(){}}}).innerHTML='<div class="empty"><div class="empty-ico">⏳</div><p>Carregando condomínios...</p></div>';
  (document.getElementById('i-grid')||{style:{},classList:{add(){},remove(){}}}).innerHTML='<div class="empty"><div class="empty-ico">⏳</div><p>Carregando imóveis...</p></div>';
  
  // Checa se Supabase está configurado
  if(SUPABASE_URL === 'COLE_SUA_URL_AQUI'){
    (document.getElementById('c-grid')||{style:{},classList:{add(){},remove(){}}}).innerHTML='<div class="empty"><div class="empty-ico">⚙️</div><p>Configure o Supabase no arquivo index.html</p></div>';
    // Usa dados locais como fallback
    (document.getElementById('tab-c')||{style:{},classList:{add(){},remove(){}}}).style.display='block';
    (document.getElementById('tab-i')||{style:{},classList:{add(){},remove(){}}}).style.display='none';
    buildHomeDestaques();
    buildHomeBlog();
    rCond(); buildCities(); updateHeroStats(); renderDestaquesCidade();
    if(typeof sfcPreencherLista==="function") sfcPreencherLista();
    return;
  }
  
  // A primeira tela já está no HTML; a consulta remota pode aguardar o período ocioso.
  // Hashes legados continuam a carregar imediatamente para preservar os redirects.
  try{
    const h=location.hash;
    if(h.startsWith('#cond/')){ await fetchSiteData(); location.replace('/condominio/?id='+encodeURIComponent(h.replace('#cond/',''))); return; }
    if(h.startsWith('#imovel/')){ await fetchSiteData(); location.replace('/imovel?id='+encodeURIComponent(h.replace('#imovel/',''))); return; }
    if(h==='#turismo'){openTurismo();return;}
    // rotas antigas (hash) → agora existem páginas dedicadas: redireciona
    if(h==='#imoveis'||h==='#todos-imoveis'){ location.replace('/imoveis'); return; }
    if(h==='#condominios'||h==='#todos-condominios'){ location.replace('/condominios'); return; }
    if(h==='#busca-rapida'){buildHomeDestaques();buildHomeBlog();setTimeout(irParaBusca,500);return;}
    // hash desconhecido (órfão) → limpa a URL para não ficar preso
    if(h && h.length>1){
      try{ history.replaceState(null,'',location.pathname+location.search); }catch(e){}
    }
    (document.getElementById('tab-c')||{style:{},classList:{add(){},remove(){}}}).style.display='block';
    (document.getElementById('tab-i')||{style:{},classList:{add(){},remove(){}}}).style.display='none';
    (document.getElementById('pt-c')||{style:{},classList:{add(){},remove(){}}}).classList.add('on');
    (document.getElementById('pt-i')||{style:{},classList:{add(){},remove(){}}}).classList.remove('on');
    const _ptt=document.getElementById('pt-t'); if(_ptt) _ptt.classList.remove('on');
    const renderHomeBelowFold=async()=>{
      try{
        await fetchSiteData();
        buildHomeDestaques();
        rCond(); buildCities(); updateHeroStats(); renderDestaquesCidade();
        if(typeof sfcPreencherLista==='function') sfcPreencherLista();
        if(typeof initTodosCarrosseis==='function') initTodosCarrosseis();
        deferHomeBelowFold();
      }catch(err){ console.error('Deferred home data error:',err); }
    };
    const iniciarHomeAposPrimeiraTela=()=>{
      const iniciar=()=>{
        if('requestIdleCallback' in window){
          requestIdleCallback(()=>{ renderHomeBelowFold(); },{timeout:3500});
        }else{
          setTimeout(()=>{ renderHomeBelowFold(); },1800);
        }
      };
      if('requestAnimationFrame' in window) requestAnimationFrame(iniciar);
      else iniciar();
    };
    // A primeira tela deve pintar antes das consultas completas do portfólio.
    if(document.readyState==='complete') iniciarHomeAposPrimeiraTela();
    else window.addEventListener('load', iniciarHomeAposPrimeiraTela, {once:true});
  }catch(e){
    console.error('Init error:', e);
    (document.getElementById('c-grid')||{style:{},classList:{add(){},remove(){}}}).innerHTML='<div class="empty"><div class="empty-ico">⚠️</div><p>Erro ao carregar dados. Verifique a conexão.</p></div>';
  }
})();
// ── PROTEÇÃO DE CONTEÚDO ──
(function(){
  // Bloqueia clique direito
  document.addEventListener('contextmenu', e => {
    e.preventDefault();
    return false;
  });

  // Bloqueia arrastar imagens
  document.addEventListener('dragstart', e => {
    if(e.target.tagName === 'IMG') e.preventDefault();
  });

  // Bloqueia Ctrl+S (salvar), Ctrl+U (ver código), Ctrl+P (imprimir), F12
  document.addEventListener('keydown', e => {
    const blocked = (
      (e.ctrlKey && ['s','u','p'].includes(e.key.toLowerCase())) ||
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['i','j','c'].includes(e.key.toLowerCase()))
    );
    if(blocked){ e.preventDefault(); e.stopPropagation(); return false; }
  });

  // Bloqueia seleção de texto nas áreas de conteúdo
  document.addEventListener('selectstart', e => {
    if(!e.target || !e.target.tagName) return;
    const tag = e.target.tagName.toLowerCase();
    if(!['input','textarea','select'].includes(tag)){
      e.preventDefault();
    }
  });

  // Overlay invisível sobre imagens no lightbox para bloquear download
  document.addEventListener('mousedown', e => {
    if(e.target.tagName === 'IMG') e.preventDefault();
  });

  // ── ATIVADOR DE FOTOS DOS CARDS ──
  // Para cada [data-foto-card], carrega a imagem apenas quando o card se
  // aproxima da viewport; isso evita descarregar todas as capas abaixo da dobra.
  var _cardFotoObserver = null;
  function agendarFotoCard(el, carregar){
    if(!el || typeof carregar!=='function' || el.dataset.fotoAgendada==='1') return;
    el.dataset.fotoAgendada='1';
    if(!('IntersectionObserver' in window)){
      setTimeout(carregar,1200);
      return;
    }
    if(!_cardFotoObserver){
      _cardFotoObserver=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(!entry.isIntersecting) return;
          _cardFotoObserver.unobserve(entry.target);
          var fn=entry.target._pmlFotoLoad;
          delete entry.target._pmlFotoLoad;
          if(fn) fn();
        });
      },{rootMargin:'700px 0px'});
    }
    el._pmlFotoLoad=carregar;
    _cardFotoObserver.observe(el);
  }
  // Para cada [data-foto-card], carrega /img/card-{slug}.jpg.
  // Com novas tentativas: se a requisição falhar (ex.: timeout sob conexão lenta),
  // tenta de novo até 3 vezes antes de manter o placeholder. Isso evita que
  // uma foto suma só porque a 1ª requisição falhou no carregamento inicial.
  function aplicarFoto(el, url){
    // Define a imagem diretamente no elemento. Para as cidades (guia-card-top),
    // o HTML tem um 'background' inline (gradiente) que sobrescreveria o CSS —
    // por isso limpamos esse background e aplncamos a imagem direto aqui.
    el.style.background = 'none';
    el.style.backgroundImage = 'url("'+url+'")';
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    // mantém compatibilidade com o CSS que usa a variável
    if(el.classList.contains('guia-card-top')){
      el.style.setProperty('--card-img', 'url("'+url+'")');
    }
    el.classList.add('tem-foto');
  }
  function carregarComRetry(el, url, tentativa){
    var test = new Image();
    test.onload = function(){ aplicarFoto(el, url); };
    test.onerror = function(){
      if(tentativa < 2){
        // espera um pouco e tenta de novo (cache-buster para forçar nova requisição)
        setTimeout(function(){
          carregarComRetry(el, url + '?r=' + tentativa, tentativa + 1);
        }, 400 * tentativa);
      }
      // após 3 tentativas: mantém o placeholder com ícone
    };
    test.src = url;
  }
  // mapa de fotos enviadas pelo CRM (config fotos_site no Supabase). Preenchido async.
  var _fotosSiteMap = null;
  function ativarFotosCards(){
    document.querySelectorAll('[data-foto-card]').forEach(function(el){
      if(el.classList.contains('tem-foto')) return; // já carregada, não refaz
      var slug = el.getAttribute('data-foto-card');
      if(!slug) return;
      // 1ª opção: foto enviada pelo CRM (URL do Supabase). 2ª: pasta /img.
      var _mapa = _fotosSiteMap || window._fotosSiteMap;
      var urlCRM = _mapa && _mapa[slug];
      if(urlCRM){
        agendarFotoCard(el,function(){carregarComRetry(el, urlCRM, 1);});
      }
      // sem foto no CRM: mantém o placeholder (nada de buscar /img/card-*.jpg,
      // esses arquivos não existem e geravam ~180 requisições 404 por visita)
    });
    // cards de Lançamentos na home: usam a foto-hero ({slug}__1) enviada pelo CRM
    var _mapaLch = _fotosSiteMap || window._fotosSiteMap;
    if(_mapaLch){
      document.querySelectorAll('[data-lch]').forEach(function(el){
        var slug = el.getAttribute('data-lch');
        var foto = _mapaLch[slug + '__1'];
        if(foto){
          agendarFotoCard(el,function(){
            const fotoCard = fotoVariante(foto, 480, 'webp', 68);
            el.style.backgroundImage = "url('" + fotoCard + "')";
            el.style.color = 'transparent';
            var tag = el.querySelector('.lch-tag');
            el.textContent = '';
            if(tag) el.appendChild(tag);
          });
        }
      });
    }
  }
  // busca o mapa de fotos do Supabase e reaplica
  function carregarFotosSite(){
    try{
      // OTIMIZADO: as fotos já vêm no fetchSiteData (evita requisição duplicada)
      if(window._dadosExtrasCarregados){
        if(window._fotosSiteMap && typeof window._fotosSiteMap === 'object'){
          _fotosSiteMap = window._fotosSiteMap;
          ativarFotosCards();
        }
        return;   // já buscou: não busca de novo
      }
      // fallback: se ainda não veio, busca (raro)
      if(typeof sbSite!=='undefined' && sbSite.getConfig){
        sbSite.getConfig('fotos_site').then(function(m){
          if(m && typeof m==='object'){ _fotosSiteMap = m; window._fotosSiteMap = m; ativarFotosCards(); }
        }).catch(function(){});
      }
    }catch(e){}
  }
  // OTIMIZADO: só ativa os cards; as fotos vêm do fetchSiteData (sem requisição extra)
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ ativarFotosCards(); });
  } else {
    ativarFotosCards();
  }
  // Reexpõe as rotinas para reaplicar fotos após consultas assíncronas.
  window.ativarFotosCards = ativarFotosCards;
  window.carregarFotosSite = carregarFotosSite;
  // A configuração de capas é independente do catálogo e pode chegar depois da primeira pintura.
  // Antes, o fallback existia mas nunca era chamado no carregamento inicial.
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', carregarFotosSite, {once:true});
  } else {
    setTimeout(carregarFotosSite, 0);
  }
  // reexecuta quando a view de Turismo é aberta (cards .tv-foto entram em tela)

  // ── Auto-play do carrossel de lançamentos ──
  // Passa um card a cada intervalo; pausa quando o usuário interage (mouse/toque/arraste);
  // volta ao início ao chegar no fim. Respeita "prefers-reduced-motion".
  function iniciarAutoCarrossel(){
    var grid = document.getElementById('lch-grid');
    if(!grid || !grid.classList.contains('is-carrossel-lch')) return;
    // respeita usuários que preferem menos animação
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var INTERVALO = 4000; // 4s entre passagens
    var pausado = false;
    var timer = null;
    function passo(){
      if(pausado) return;
      var card = grid.querySelector('.lch-card');
      if(!card) return;
      var avanco = card.getBoundingClientRect().width + 24; // largura do card + gap
      // se está perto do fim, volta ao início
      if(grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 8){
        grid.scrollTo({left:0, behavior:'smooth'});
      } else {
        grid.scrollBy({left:avanco, behavior:'smooth'});
      }
    }
    function start(){ if(timer) return; timer = setInterval(passo, INTERVALO); }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    // pausa ao passar o mouse / tocar / arrastar
    grid.addEventListener('mouseenter', function(){ pausado = true; });
    grid.addEventListener('mouseleave', function(){ pausado = false; });
    grid.addEventListener('touchstart', function(){ pausado = true; }, {passive:true});
    grid.addEventListener('touchend', function(){ setTimeout(function(){ pausado = false; }, 3000); }, {passive:true});
    // pausa quando a aba não está visível (economiza recurso)
    document.addEventListener('visibilitychange', function(){ if(document.hidden) stop(); else start(); });
    start();
  }

  // Auto-play genérico para os carrosséis .is-carrossel (Onde Ir, Bairros, Blog) — 3 segundos
  function autoCarrosselGenerico(grid, intervalo){
    if(!grid || grid._autoOn) return;
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // só ativa se houver conteúdo que transborda (mais de uma "tela" de cards)
    if(grid.scrollWidth <= grid.clientWidth + 10) return;
    grid._autoOn = true;
    var pausado = false, timer = null;
    function passo(){
      if(pausado) return;
      var card = grid.children[0];
      if(!card) return;
      var gap = parseInt(getComputedStyle(grid).gap) || 16;
      var avanco = card.getBoundingClientRect().width + gap;
      if(grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 8){
        grid.scrollTo({left:0, behavior:'smooth'});
      } else {
        grid.scrollBy({left:avanco, behavior:'smooth'});
      }
    }
    function start(){ if(timer) return; timer = setInterval(passo, intervalo); }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    grid.addEventListener('mouseenter', function(){ pausado = true; });
    grid.addEventListener('mouseleave', function(){ pausado = false; });
    grid.addEventListener('touchstart', function(){ pausado = true; }, {passive:true});
    grid.addEventListener('touchend', function(){ setTimeout(function(){ pausado = false; }, 3000); }, {passive:true});
    document.addEventListener('visibilitychange', function(){ if(document.hidden) stop(); else start(); });
    start();
  }
  function iniciarCarrosseisGenericos(){
    // Onde Ir, Bairros e Blog (todos com a classe .is-carrossel)
    document.querySelectorAll('.ondeir-grid.is-carrossel, .bairros-grid.is-carrossel, .blog-preview-grid.is-carrossel').forEach(function(g){
      autoCarrosselGenerico(g, 3000);
    });
  }
  // expor para ser chamada quando conteúdo dinâmico (blog) terminar de carregar
  window.reativarCarrosseis = iniciarCarrosseisGenericos;
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', iniciarAutoCarrossel);
  } else {
    iniciarAutoCarrossel();
  }
  // iniciar os carrosséis genéricos (Onde Ir, Bairros, Blog) — com pequeno delay
  // para garantir que o conteúdo dinâmico já foi renderizado
  function bootCarrosseis(){ setTimeout(iniciarCarrosseisGenericos, 2400); }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bootCarrosseis);
  } else {
    bootCarrosseis();
  }
})();

