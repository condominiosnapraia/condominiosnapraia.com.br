const FAVORITES_SCRIPT = '<script src="/js/favoritos.js?v=accessibility-20260821" defer></script>';
const LEGACY_REDIRECTS = {
  '/condominio-maquine-la-marina-': '/condominio-maquine-la-marina/',
  '/condominio-maquine-la-marina-/': '/condominio-maquine-la-marina/',
  '/condominio-xangri-la-villas-resort-': '/condominio-xangri-la-villas-resort/',
  '/condominio-xangri-la-villas-resort-/': '/condominio-xangri-la-villas-resort/',
  '/politica-de-privacidade': '/politica-privacidade/',
  '/politica-de-privacidade/': '/politica-privacidade/',
};

const BLOCKED_ADMIN_PATHS = new Set([
  '/exportar-dados', '/exportar-dados.html',
  '/restaurar', '/restaurar.html',
  '/teste-fotos', '/teste-fotos.html',
]);

const PORTAL_MEULITORAL_HOSTS = new Set([
  'portalmeulitoral.com.br',
  'www.portalmeulitoral.com.br',
]);

const PORTAL_MEULITORAL_STYLE = `<style id="portal-meu-litoral-theme">
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
  .portal-meu-litoral{--portal-navy:#071d49;--portal-blue:#0c78a4;--portal-gold:#b8872e;--portal-sand:#fbf8f0;font-family:'Montserrat',Outfit,Arial,sans-serif}
  .portal-meu-litoral .hero-brand-name,.portal-meu-litoral .sectit,.portal-meu-litoral .lch-tit,.portal-meu-litoral .ictit,.portal-meu-litoral .ctit,.portal-meu-litoral .navq-t,.portal-meu-litoral .pcred-t,.portal-meu-litoral .bcid-nome,.portal-meu-litoral .vpc2-body h3{font-family:'Cormorant Garamond',Fraunces,Georgia,serif;color:var(--portal-navy)}
  .portal-meu-litoral .hero-brand-name{letter-spacing:-.025em;font-weight:600;color:#fff7e8}
  .portal-meu-litoral .hero-brand-tagline,.portal-meu-litoral .hero-brand-kicker,.portal-meu-litoral .eyebrow,.portal-meu-litoral .sectit-sub{font-family:'Montserrat',Outfit,Arial,sans-serif}
  .portal-meu-litoral .hero-brand-tagline{color:#f1d18a}
  .portal-meu-litoral .sectit-sub,.portal-meu-litoral .eyebrow{color:var(--portal-gold)}
  .portal-meu-litoral .dh-nav a{font-family:'Montserrat',Outfit,Arial,sans-serif;color:var(--portal-navy)}
  .portal-meu-litoral .dh-nav a:hover{color:var(--portal-blue);background:rgba(12,120,164,.1)}
  .portal-meu-litoral .vpc2-btn,.portal-meu-litoral .dest-ver-btn{background:var(--portal-gold);border-color:var(--portal-gold);color:#fff}
  .portal-meu-litoral .navq-arrow,.portal-meu-litoral .bcid-go,.portal-meu-litoral .pcred-go{color:var(--portal-blue)}
  .portal-meu-litoral .desk-header .dh-logo{width:218px;height:50px;background:url('/img/branding/portal-meu-litoral-logo.jpg') center left/contain no-repeat}
  .portal-meu-litoral .desk-header .dh-logo img{display:none}
  .portal-meu-litoral #view-home .hero{background-image:url('/img/branding/portal-meu-litoral-hero.jpg')!important;background-position:center 56%;background-size:cover}
  .portal-meu-litoral #view-home > .qr-sec,.portal-meu-litoral #view-home > #pcred-sec-sec{display:none!important}
  .portal-meu-litoral #view-home .qfilter-bg[data-foto-card="filtro-fora-condominio"]{background-image:url('https://cddgkhkzcnyzzcllgzoz.supabase.co/storage/v1/object/public/fotos/imov/mu8c0o0olaj/imovel-casa-a-venda-em-capao-da-canoa-bairro-girassol-1-1789819206047.jpg')!important;background-size:cover!important;background-position:center!important}
  .portal-meu-litoral #view-home .qfilter-bg[data-foto-card="filtro-apartamentos"]{background-image:url('https://cddgkhkzcnyzzcllgzoz.supabase.co/storage/v1/object/public/fotos/imov/msl4qaucz7k/imovel-xangri-la-rossi-atlantida-apartamento-giardino-a-vend-1-1786239337162.jpg')!important;background-size:cover!important;background-position:center!important}
  .portal-meu-litoral #view-home .qfilter-card::after{background:linear-gradient(180deg,rgba(7,29,73,.12) 0%,rgba(7,29,73,.5) 42%,rgba(7,29,73,.94) 100%)!important}
  .portal-meu-litoral #view-home .qfilter-body{text-shadow:0 2px 5px rgba(0,0,0,.78),0 1px 14px rgba(0,0,0,.48)}
  .portal-meu-litoral #view-home .qfilter-lbl{color:#fff!important}
  .portal-meu-litoral #view-home .qfilter-go{color:#ffe09a!important;font-weight:700;text-shadow:0 1px 4px rgba(0,0,0,.8)}
  @media(max-width:768px){.portal-meu-litoral #view-home .hero{background-position:center 58%;background-size:cover}}
</style>`;

const PORTAL_MEULITORAL_HOME_ORDER = `<script id="portal-meu-litoral-home-order">
  (function(){
    function arrangePortalHome(){
      var home=document.getElementById('view-home');
      if(!home) return;
      ['qr-sec','pcred-sec-sec'].forEach(function(id){var section=document.getElementById(id);if(section&&section.parentElement===home)section.remove();});
      var order=['qr-sec','qfilter2','pcred-sec-sec','sec-imoveis','sec-fora-cond','sec-condominios','sec-imoveis-semana','sec-apartamentos','sec-terrenos','sec-condominios-verticais','viver-intro-sec','viver-lagoa','viver-mar','viver-cidade','guias-cidades','guias-decisao','sec-blog-preview','lch-sec-sec'];
      order.forEach(function(id){var section=document.getElementById(id);if(section&&section.parentElement===home)home.appendChild(section);});
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arrangePortalHome,{once:true});else arrangePortalHome();
  }());
</script>`;

function adminNotFound() {
  return new Response('Not Found', {
    status: 404,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

function isPortalMeuLitoral(url) {
  return PORTAL_MEULITORAL_HOSTS.has(url.hostname.toLowerCase());
}

function applyPortalMeuLitoralBrand(rewriter) {
  rewriter
    .on('html', { element(element) { element.setAttribute('class', `${element.getAttribute('class') || ''} portal-meu-litoral`.trim()); } })
    .on('title', { element(element) { element.setInnerContent('Portal Meu Litoral | Imóveis no Litoral Norte Gaúcho'); } })
    .on('meta[property="og:site_name"]', { element(element) { element.setAttribute('content', 'Portal Meu Litoral'); } })
    .on('meta[property="og:title"]', { element(element) { element.setAttribute('content', 'Portal Meu Litoral | Imóveis no Litoral Norte Gaúcho'); } })
    .on('meta[property="og:url"]', { element(element) { element.setAttribute('content', 'https://portalmeulitoral.com.br/'); } })
    .on('link[rel="canonical"]', { element(element) { element.setAttribute('href', 'https://portalmeulitoral.com.br/'); } })
    .on('.hero-brand-name', { element(element) { element.setInnerContent('Portal Meu Litoral'); } })
    .on('.hero-brand-tagline', { element(element) { element.setInnerContent('Imóveis e oportunidades no Litoral Norte Gaúcho'); } })
    .on('.ftr-brand-lockup .hero-brand-name', { element(element) { element.setInnerContent('Portal Meu Litoral'); } })
    .on('.dh-logo', { element(element) { element.setAttribute('aria-label', 'Portal Meu Litoral — início'); } })
    .on('head', { element(element) { element.append(PORTAL_MEULITORAL_STYLE, { html: true }); } });
}

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const legacyTarget = LEGACY_REDIRECTS[path];
  if (legacyTarget) return Response.redirect(new URL(legacyTarget, url), 301);

  if (BLOCKED_ADMIN_PATHS.has(path)) return adminNotFound();

  // Diagnóstico é uma ferramenta interna: não deve responder 200 anônimo.
  // O endpoint público é removido da superfície de produção; o CRM continua intacto.
  if (path === '/diagnostico.html' || path === '/diagnostico' || path.startsWith('/diagnostico/')) {
    return adminNotFound();
  }

  // Favoritos só é necessário na página de favoritos e no detalhe de imóvel.
  // Evita injetar ~10 KiB e iniciar JS extra na homepage, listagens e páginas editoriais.
  const needsFavorites = path === '/favoritos' || path === '/favoritos/' || path === '/imovel' || path === '/imovel/' || path.startsWith('/imovel/');
  const response = await next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('text/html')) return response;
  if (response.status < 200 || response.status >= 300) return response;

  const rewriter = new HTMLRewriter()
    .on('a.wpp-float', {
      element(element) {
        element.setAttribute('aria-label', 'Falar com um consultor pelo WhatsApp');
        element.setAttribute('title', 'Falar com um consultor pelo WhatsApp');
      },
    })
    .on('a.btn-wpp', {
      element(element) {
        element.setAttribute('aria-label', 'Falar com um consultor pelo WhatsApp sobre esta oportunidade');
      },
    });
  if (isPortalMeuLitoral(url)) applyPortalMeuLitoralBrand(rewriter);
  if (isPortalMeuLitoral(url) && (path === '/' || path === '/index.html')) {
    rewriter.on('body', { element(element) { element.append(PORTAL_MEULITORAL_HOME_ORDER, { html: true }); } });
  }
  if (needsFavorites) {
    rewriter.on('head', {
      element(element) {
        element.append(FAVORITES_SCRIPT, { html: true });
      },
    });
  }
  return rewriter.transform(response);
}
