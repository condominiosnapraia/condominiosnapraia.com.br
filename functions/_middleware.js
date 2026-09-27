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

const ATLANTIDA_NEGOCIOS_HOSTS = new Set([
  'atlantidanegocios.com.br',
  'www.atlantidanegocios.com.br',
]);
const ATLANTIDA_WHATSAPP = '5551981348907';
const ATLANTIDA_WHATSAPP_SCRIPT = `<script id="atlantida-whatsapp-routing">
  (function(){
    var numero='${ATLANTIDA_WHATSAPP}';
    function corrigir(root){
      (root||document).querySelectorAll('a[href]').forEach(function(a){
        var href=a.getAttribute('href');
        if(!href) return;
        var novo=href
          .replace(/(wa\\.me\\/)\\d+/ig,'$1'+numero)
          .replace(/([?&]phone=)\\d+/ig,'$1'+numero)
          .replace(/^tel:\\+?\\d+/i,'tel:+'+numero);
        if(novo!==href) a.setAttribute('href',novo);
      });
    }
    function iniciar(){
      corrigir(document);
      if(!document.documentElement || !window.MutationObserver) return;
      new MutationObserver(function(){corrigir(document);}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['href']});
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',iniciar,{once:true}); else iniciar();
  }());
</script>`;

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
  .portal-meu-litoral a[href="/sobre/"]{display:none!important}
  @media(min-width:981px){.portal-meu-litoral .desk-header-inner{justify-content:center;position:relative}.portal-meu-litoral .desk-header .dh-logo{display:none!important}.portal-meu-litoral .desk-header .dh-nav{flex:1 1 auto;width:100%;justify-content:space-between;gap:0}.portal-meu-litoral .desk-header .dh-nav a{flex:1 1 0;text-align:center;padding-left:8px;padding-right:8px}.portal-meu-litoral .desk-header .dh-nav a[href="/turismo/"],.portal-meu-litoral .desk-header .dh-nav a[href="/sobre/"]{display:none!important}.portal-meu-litoral .desk-header .dh-cta{display:none!important}.portal-meu-litoral .page-footer .ftr-col-brand .ftr-brand-lockup{align-items:center;width:250px;max-width:100%;margin-left:auto;margin-right:auto;text-align:center}.portal-meu-litoral .page-footer .ftr-brand-lockup .hero-brand-name{font-size:clamp(28px,2.8vw,38px)!important;line-height:.95;white-space:normal}.portal-meu-litoral .page-footer .ftr-brand-lockup .hero-brand-tagline{font-size:7px}}
  .portal-meu-litoral .vpc2-btn,.portal-meu-litoral .dest-ver-btn{background:var(--portal-gold);border-color:var(--portal-gold);color:#fff}
  .portal-meu-litoral .navq-arrow,.portal-meu-litoral .bcid-go,.portal-meu-litoral .pcred-go{color:var(--portal-blue)}
  .portal-meu-litoral .desk-header .dh-logo{width:218px;height:50px;background:url('/img/branding/portal-meu-litoral-logo.jpg') center left/contain no-repeat}
  .portal-meu-litoral .desk-header .dh-logo img{display:none}
  .portal-meu-litoral #view-home .hero{background-image:url('/img/branding/portal-meu-litoral-hero.jpg')!important;background-position:center 56%;background-size:cover}
  .portal-meu-litoral #view-home > .qr-sec,.portal-meu-litoral #view-home > #pcred-sec-sec,.portal-meu-litoral #view-home > #sec-blog-preview{display:none!important}
  .portal-meu-litoral #view-home .qfilter-bg[data-foto-card="filtro-fora-condominio"]{background-image:url('https://cddgkhkzcnyzzcllgzoz.supabase.co/storage/v1/object/public/fotos/imov/mu8c0o0olaj/imovel-casa-a-venda-em-capao-da-canoa-bairro-girassol-1-1789819206047.jpg')!important;background-size:cover!important;background-position:center!important}
  .portal-meu-litoral #view-home .qfilter-bg[data-foto-card="filtro-apartamentos"]{background-image:url('https://cddgkhkzcnyzzcllgzoz.supabase.co/storage/v1/object/public/fotos/cond/atlantida-green-square-mt3j/condominio-xangri-la-atlantida-green-square-1-1787351775272.jpg')!important;background-size:cover!important;background-position:center!important}
  .portal-meu-litoral #view-home .qfilter-card::after{background:linear-gradient(180deg,rgba(7,29,73,.12) 0%,rgba(7,29,73,.5) 42%,rgba(7,29,73,.94) 100%)!important}
  .portal-meu-litoral #view-home .qfilter-body{text-shadow:0 2px 5px rgba(0,0,0,.78),0 1px 14px rgba(0,0,0,.48)}
  .portal-meu-litoral #view-home .qfilter-lbl{color:#fff!important}
  .portal-meu-litoral #view-home .qfilter-go{color:#ffe09a!important;font-weight:700;text-shadow:0 1px 4px rgba(0,0,0,.8)}
  .portal-meu-litoral #view-home .qfilter-lbl{font-size:24px!important;line-height:1.12}
  .portal-meu-litoral #view-home .qfilter-lbl{font-family:'Cormorant Garamond',Fraunces,Georgia,serif;font-weight:500!important;letter-spacing:.01em;text-shadow:0 2px 6px rgba(0,0,0,.82),0 1px 16px rgba(0,0,0,.5)}
  .portal-meu-litoral #view-home .qfilter-go{font-family:'Montserrat',Outfit,Arial,sans-serif;font-size:15px!important;font-weight:500!important;letter-spacing:.02em}
  .portal-meu-litoral #view-home .qfilter-eyebrow,.portal-meu-litoral #view-home .qfilter-title,.portal-meu-litoral #view-home .qfilter-body{text-align:center!important}
  .portal-meu-litoral #view-home .qfilter-card{align-items:center!important}
  .portal-meu-litoral #view-home .qfilter-body{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:22px 20px!important}
  .portal-meu-litoral #view-home .qfilter-lbl{display:block;width:100%;text-align:center!important}
  .portal-meu-litoral #view-home .qfilter-go{margin-left:auto;margin-right:auto}
  .portal-meu-litoral #view-home .lch-tag{display:none!important}
  @media(max-width:768px){.portal-meu-litoral #view-home .hero{background-position:center 58%;background-size:cover}.portal-meu-litoral #view-home .qfilter-lbl{font-size:20px!important}.portal-meu-litoral #view-home .qfilter-go{font-size:13.5px!important}}
</style>`;

const PORTAL_MEULITORAL_HOME_ORDER = `<script id="portal-meu-litoral-home-order">
  (function(){
    function arrangePortalHome(){
      var home=document.getElementById('view-home');
      if(!home) return;
      ['qr-sec','pcred-sec-sec','sec-blog-preview','viver-intro-sec','viver-lagoa','viver-mar','viver-cidade','guias-cidades','guias-decisao'].forEach(function(id){var section=document.getElementById(id);if(section&&section.parentElement===home)section.remove();});
      var order=['qfilter2','sec-apartamentos','sec-imoveis','sec-fora-cond','sec-terrenos','sec-condominios','sec-condominios-verticais','sec-imoveis-semana','lch-sec-sec'];
      order.forEach(function(id){var section=document.getElementById(id);if(section&&section.parentElement===home)home.appendChild(section);});
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arrangePortalHome,{once:true});else arrangePortalHome();
  }());
</script>`;

const ATLANTIDA_NEGOCIOS_HOME_ORDER = `<script id="atlantida-negocios-home-order">
  (function(){
    function arrangeAtlantidaHome(){
      var home=document.getElementById('view-home');
      if(!home) return;
      ['qfilter2','qr-sec','pcred-sec-sec','sec-blog-preview','viver-intro-sec','viver-lagoa','viver-mar','viver-cidade','guias-cidades','guias-decisao'].forEach(function(id){var section=document.getElementById(id);if(section&&section.parentElement===home)section.remove();});
      var order=['sec-fora-cond','sec-apartamentos','sec-imoveis','sec-terrenos','sec-condominios-verticais','sec-condominios','sec-imoveis-semana','lch-sec-sec'];
      order.forEach(function(id){var section=document.getElementById(id);if(section&&section.parentElement===home)home.appendChild(section);});
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arrangeAtlantidaHome,{once:true});else arrangeAtlantidaHome();
  }());
</script>`;

const ATLANTIDA_NEGOCIOS_STYLE = `<style id="atlantida-negocios-theme">
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
  .atlantida-negocios{--atl-navy:#25313a;--atl-gold:#b58b45;font-family:'Montserrat',Outfit,Arial,sans-serif}
  .atlantida-negocios .desk-header-inner{justify-content:center;position:relative}
  .atlantida-negocios .desk-header .dh-logo{display:none!important}
  .atlantida-negocios .desk-header .dh-nav{flex:1 1 auto;width:100%;justify-content:space-between;gap:0}
  .atlantida-negocios .desk-header .dh-nav a{flex:1 1 0;text-align:center;padding-left:8px;padding-right:8px}
  .atlantida-negocios .desk-header .dh-nav a[href="/turismo/"],.atlantida-negocios .desk-header .dh-nav a[href="/sobre/"]{display:none!important}
  .atlantida-negocios .desk-header .dh-cta{display:none!important}
  .atlantida-negocios a[href="/sobre/"]{display:none!important}
  .atlantida-negocios #view-home .hero-brand-lockup{background:transparent;box-shadow:none;width:max-content;height:auto;padding:0}
  .atlantida-negocios #view-home .hero-brand-lockup>*{visibility:visible}
  .atlantida-negocios #view-home .hero-brand-kicker{display:none!important}
  .atlantida-negocios #view-home .hero-brand-name{font-size:0!important;line-height:0;width:clamp(280px,34vw,430px);aspect-ratio:2817/1146;height:auto;background:url('/assets/atlantida-logo-white.png') center/contain no-repeat;text-shadow:none}
  .atlantida-negocios #view-home .hero-brand-underline{display:none!important}
  .atlantida-negocios #view-home .hero-bg{background:linear-gradient(180deg,rgba(7,29,48,.34) 0%,rgba(7,29,48,.44) 52%,rgba(7,29,48,.62) 100%)!important}
  .atlantida-negocios #view-home .hero-h1{color:#fff!important;text-shadow:0 3px 18px rgba(0,0,0,.82),0 1px 4px rgba(0,0,0,.9)}
  .atlantida-negocios #view-home .hero-h1 em{color:#ffe09a!important}
  .atlantida-negocios #view-home .hero-brand-tagline,.atlantida-negocios #view-home .hero-desc{color:#fff!important;text-shadow:0 2px 12px rgba(0,0,0,.9),0 1px 3px rgba(0,0,0,.85)}
  .atlantida-negocios #view-home .hero-brand-tagline{color:#ffe09a!important}
  .atlantida-negocios #view-home .hero{background-image:url('/img/branding/atlantida-negocios-hero.jpg')!important;background-position:center 56%;background-size:cover}
  .atlantida-negocios .page-footer .ftr-brand-lockup{align-items:center;width:220px;max-width:100%;margin-left:auto;margin-right:auto;text-align:center;background:transparent;border-radius:0;padding:10px 14px;box-sizing:border-box;background-image:url('/assets/atlantida-logo-white.png');background-repeat:no-repeat;background-position:center;background-size:contain;min-height:76px}
  .atlantida-negocios .page-footer .ftr-brand-lockup>*{visibility:hidden}
  .atlantida-negocios .sectit-sub,.atlantida-negocios .eyebrow{color:var(--atl-gold)}
  @media(min-width:981px){.atlantida-negocios .page-footer .ftr-col-brand .ftr-brand-lockup{align-items:center;width:220px;max-width:100%;margin-left:auto;margin-right:auto;text-align:center}}
  @media(max-width:600px){.atlantida-negocios #view-home .hero-brand-name{width:min(82vw,310px);aspect-ratio:2817/1146}.atlantida-negocios #view-home .hero-brand-lockup{margin-bottom:28px}}
  @media(max-width:600px){.atlantida-negocios #view-home .hero-brand-name{font-size:clamp(40px,12.4vw,54px)}.atlantida-negocios .page-footer .ftr-brand-lockup{width:200px;min-height:70px}}
</style>`;

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

function isAtlantidaNegocios(url) {
  return ATLANTIDA_NEGOCIOS_HOSTS.has(url.hostname.toLowerCase());
}

function applyPortalMeuLitoralBrand(rewriter, pageUrl) {
  const canonicalUrl = `${pageUrl.origin}${pageUrl.pathname === '/index.html' ? '/' : pageUrl.pathname}`;
  rewriter
    .on('html', { element(element) { element.setAttribute('class', `${element.getAttribute('class') || ''} portal-meu-litoral`.trim()); } })
    .on('title', { element(element) { element.setInnerContent('Portal Meu Litoral | Imóveis no Litoral Norte Gaúcho'); } })
    .on('meta[property="og:site_name"]', { element(element) { element.setAttribute('content', 'Portal Meu Litoral'); } })
    .on('meta[property="og:title"]', { element(element) { element.setAttribute('content', 'Portal Meu Litoral | Imóveis no Litoral Norte Gaúcho'); } })
    .on('meta[property="og:url"]', { element(element) { element.setAttribute('content', canonicalUrl); } })
    .on('link[rel="canonical"]', { element(element) { element.setAttribute('href', canonicalUrl); } })
    .on('.hero-brand-name', { element(element) { element.setInnerContent('Portal Meu Litoral'); } })
    .on('.hero-brand-tagline', { element(element) { element.setInnerContent('Imóveis e oportunidades no Litoral Norte Gaúcho'); } })
    .on('.ftr-brand-lockup .hero-brand-name', { element(element) { element.setInnerContent('Portal Meu Litoral'); } })
    .on('.dh-logo', { element(element) { element.setAttribute('aria-label', 'Portal Meu Litoral — início'); } })
    .on('head', { element(element) { element.append(PORTAL_MEULITORAL_STYLE, { html: true }); } });
}

function applyAtlantidaNegociosBrand(rewriter, pageUrl) {
  const canonicalUrl = `${pageUrl.origin}${pageUrl.pathname === '/index.html' ? '/' : pageUrl.pathname}`;
  const isPartnerPage = /^\/(?:corretor|parceiro)\//.test(pageUrl.pathname)
    || /^\/alisson[-]?portella(?:\/|$)/.test(pageUrl.pathname);
  rewriter
    .on('html', { element(element) { element.setAttribute('class', `${element.getAttribute('class') || ''} atlantida-negocios`.trim()); } })
    .on('a', { element(element) {
      if (isPartnerPage) return;
      const href = element.getAttribute('href');
      if (!href) return;
      const updated = href
        .replace(/(wa\.me\/)\d+/ig, `$1${ATLANTIDA_WHATSAPP}`)
        .replace(/([?&]phone=)\d+/ig, `$1${ATLANTIDA_WHATSAPP}`)
        .replace(/^tel:\+?\d+/i, `tel:+${ATLANTIDA_WHATSAPP}`);
      if (updated !== href) element.setAttribute('href', updated);
    } })
    .on('.hero-brand-name', { element(element) { element.setInnerContent('Atlântida Negócios'); } })
    .on('.hero-brand-tagline', { element(element) { element.setInnerContent('Imóveis e oportunidades no Litoral Norte'); } })
    .on('.ftr-brand-lockup .hero-brand-name', { element(element) { element.setInnerContent('Atlântida Negócios'); } })
    .on('.dh-logo', { element(element) { element.setAttribute('aria-label', 'Atlântida Negócios — início'); } })
    .on('#qfilter2', { element(element) { element.remove(); } })
    .on('#sec-condominios-verticais', { element(element) { element.removeAttribute('hidden'); } })
    .on('a.navq-card[href="/financiamento-imobiliario/"]', { element(element) { element.remove(); } })
    .on('a.navq-card[href="/contemplado-imoveis/"]', { element(element) { element.remove(); } })
    .on('a.navq-card[href="/refinanciamento-imobiliario/"]', { element(element) { element.remove(); } })
    .on('head', { element(element) { element.append(ATLANTIDA_NEGOCIOS_STYLE, { html: true }); } })
    .on('body', { element(element) { if (!isPartnerPage) element.append(ATLANTIDA_WHATSAPP_SCRIPT, { html: true }); } });
  if (!isPartnerPage) {
    rewriter
      .on('title', { element(element) { element.setInnerContent('Atlântida Negócios | Imóveis no Litoral Norte'); } })
      .on('meta[property="og:site_name"]', { element(element) { element.setAttribute('content', 'Atlântida Negócios'); } })
      .on('meta[property="og:title"]', { element(element) { element.setAttribute('content', 'Atlântida Negócios | Imóveis no Litoral Norte'); } })
      .on('meta[property="og:url"]', { element(element) { element.setAttribute('content', canonicalUrl); } })
      .on('link[rel="canonical"]', { element(element) { element.setAttribute('href', canonicalUrl); } });
  }
}

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const alissonAlias = ['/alisonportela', '/alissonportela'].find((alias) => path === alias || path.startsWith(`${alias}/`));
  if (isAtlantidaNegocios(url) && alissonAlias && (path === alissonAlias || path === `${alissonAlias}/` || path.startsWith(`${alissonAlias}/imoveis`) || path.startsWith(`${alissonAlias}/contato`) || path.startsWith(`${alissonAlias}/condominios`) || path.startsWith(`${alissonAlias}/imovel/`))) {
    const suffix = path.slice(alissonAlias.length) || '/';
    const target = new URL(`/corretor/alisson-portella${suffix}`, url);
    target.search = url.search;
    const forwarded = new Request(target, request);
    const headers = new Headers(forwarded.headers);
    headers.set('x-public-partner-prefix', alissonAlias);
    const response = await fetch(new Request(target, { method: forwarded.method, headers }));
    const internalPrefix = 'https://condominiosnapraia.com.br/corretor/alisson-portella';
    const publicPrefix = `${url.origin}${alissonAlias}`;
    const whatsappSvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.9c0 2.1.5 4.1 1.6 5.9L.2 24l6.4-1.7a11.9 11.9 0 0 0 5.5 1.4h.1c6.5 0 11.8-5.3 11.8-11.9 0-3.1-1.3-6.1-3.5-8.3Zm-8.4 18.2h-.1a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 0 1-1.5-5.2c0-5.4 4.4-9.9 9.9-9.9a9.8 9.8 0 0 1 7 2.9 9.9 9.9 0 0 1 2.9 7c0 5.4-4.4 9.9-9.8 9.9Zm5.4-7.4c-.3-.2-1.7-.9-2-.9-.3-.1-.5 0-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.5-3.7-3.3-.3-.5.3-.6.8-1.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-1-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.2.2 2 3.1 4.9 4.3.7.3 1.3.6 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.2-.7.1-1.2.1-1.4-.1-.1-.3-.3-.6-.4Z"/></svg>`;
    const mobileStyle = `<style id="atlantida-partner-mobile-parity">.mob-footer-btn,.mobile-dock a{background:transparent!important;color:#aaa!important;border:0!important;border-radius:0!important;margin:0!important}.mob-footer-btn.wpp-btn,.mobile-dock a:nth-child(5){background:transparent!important;color:#25d366!important;border:0!important}.mob-footer-ico svg{width:20px;height:20px;display:block;fill:currentColor}</style>`;
    return new HTMLRewriter()
      .on('a', { element(element) { const href = element.getAttribute('href'); if (href && href.startsWith(internalPrefix)) element.setAttribute('href', `${publicPrefix}${href.slice(internalPrefix.length)}`); } })
      .on('link[rel="canonical"]', { element(element) { const href = element.getAttribute('href'); if (href && href.startsWith(internalPrefix)) element.setAttribute('href', `${publicPrefix}${href.slice(internalPrefix.length)}`); } })
      .on('meta[property="og:url"]', { element(element) { const content = element.getAttribute('content'); if (content && content.startsWith(internalPrefix)) element.setAttribute('content', `${publicPrefix}${content.slice(internalPrefix.length)}`); } })
      .on('.mob-footer-btn.wpp-btn .mob-footer-ico', { element(element) { element.setInnerContent(whatsappSvg, { html: true }); } })
      .on('title', { element(element) { element.setInnerContent('Atlântida Negócios | Alisson Portella'); } })
      .on('head', { element(element) { element.append(mobileStyle, { html: true }); } })
      .transform(response);
  }
  if (isAtlantidaNegocios(url) && new Set(['/alison-portela', '/alison-portela/', '/alisson-portela', '/alisson-portela/', '/alisson-portella', '/alisson-portella/']).has(path)) {
    const target = new URL('/corretor/alisson-portella/', url);
    target.search = url.search;
    return fetch(new Request(target, request));
  }
  if ((isPortalMeuLitoral(url) || isAtlantidaNegocios(url)) && (path === '/sobre' || path === '/sobre/')) return Response.redirect(new URL('/', url), 301);
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
  if (isPortalMeuLitoral(url)) applyPortalMeuLitoralBrand(rewriter, url);
  if (isPortalMeuLitoral(url) && (path === '/' || path === '/index.html')) {
    rewriter.on('body', { element(element) { element.append(PORTAL_MEULITORAL_HOME_ORDER, { html: true }); } });
  }
  if (isAtlantidaNegocios(url)) applyAtlantidaNegociosBrand(rewriter, url);
  if (isAtlantidaNegocios(url) && (path === '/' || path === '/index.html')) {
    rewriter.on('body', { element(element) { element.append(ATLANTIDA_NEGOCIOS_HOME_ORDER, { html: true }); } });
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
