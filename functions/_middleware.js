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
  '/crm.html',
  '/exportar-dados', '/exportar-dados.html',
  '/restaurar', '/restaurar.html',
  '/teste-fotos', '/teste-fotos.html',
]);

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

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const legacyTarget = LEGACY_REDIRECTS[path];
  if (legacyTarget) return Response.redirect(new URL(legacyTarget, url), 301);

  // O CRM oficial é servido internamente em /crm; o arquivo legado /crm.html permanece bloqueado.
  if (path === '/crm' || path === '/crm/' || path === '/crm-app' || path === '/crm-app/') {
    const assets = context.env && context.env.ASSETS;
    if (assets && typeof assets.fetch === 'function') {
      const asset = await assets.fetch(new Request(new URL('/crm-app.data', url), request));
      if (!asset.ok) return asset;
      const headers = new Headers(asset.headers);
      headers.set('content-type', 'text/html; charset=utf-8');
      headers.set('cache-control', 'no-store');
      return new Response(asset.body, {status: asset.status, statusText: asset.statusText, headers});
    }
    return next();
  }
  if (path.startsWith('/crm/')) return next();
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
  if (needsFavorites) {
    rewriter.on('head', {
      element(element) {
        element.append(FAVORITES_SCRIPT, { html: true });
      },
    });
  }
  return rewriter.transform(response);
}
