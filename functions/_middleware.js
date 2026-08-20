const FAVORITES_SCRIPT = '<script src="/js/favoritos.js?v=detail-only-20260819" defer></script>';
const LEGACY_REDIRECTS = {
  '/condominio-maquine-la-marina-': '/condominio-maquine-la-marina/',
  '/condominio-maquine-la-marina-/': '/condominio-maquine-la-marina/',
  '/condominio-xangri-la-villas-resort-': '/condominio-xangri-la-villas-resort/',
  '/condominio-xangri-la-villas-resort-/': '/condominio-xangri-la-villas-resort/',
};

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const legacyTarget = LEGACY_REDIRECTS[path];
  if (legacyTarget) return Response.redirect(new URL(legacyTarget, url), 301);

  // O painel administrativo tem autenticação e scripts próprios; permanece isolado.
  if (path === '/crm' || path === '/crm.html' || path.startsWith('/crm/')) return next();

  // Favoritos só é necessário na página de favoritos e no detalhe de imóvel.
  // Evita injetar ~10 KiB e iniciar JS extra na homepage, listagens e páginas editoriais.
  const needsFavorites = path === '/favoritos' || path === '/favoritos/' || path === '/imovel' || path === '/imovel/' || path.startsWith('/imovel/');
  const response = await next();
  if (!needsFavorites) return response;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('text/html')) return response;
  if (response.status < 200 || response.status >= 300) return response;

  return new HTMLRewriter()
    .on('head', {
      element(element) {
        element.append(FAVORITES_SCRIPT, { html: true });
      },
    })
    .transform(response);
}
