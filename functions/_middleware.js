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
  .portal-meu-litoral{--home-ocean:#0b5368;--home-ink:#123f53;--home-gold:#d1a048}
  .portal-meu-litoral .hero-brand-name{letter-spacing:-.055em}
  .portal-meu-litoral .desk-header .dh-logo{width:218px;height:50px;background:url('/img/branding/portal-meu-litoral-logo.jpg') center left/contain no-repeat}
  .portal-meu-litoral .desk-header .dh-logo img{display:none}
  .portal-meu-litoral .hero-brand-tagline{color:#f5d994}
  .portal-meu-litoral .desk-header .dh-logo{filter:saturate(.88)}
  .portal-meu-litoral .desk-header .dh-cta{border-color:rgba(209,160,72,.58)!important}
  .portal-meu-litoral .page-footer{border-top-color:rgba(209,160,72,.32)}
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
  if (needsFavorites) {
    rewriter.on('head', {
      element(element) {
        element.append(FAVORITES_SCRIPT, { html: true });
      },
    });
  }
  return rewriter.transform(response);
}
