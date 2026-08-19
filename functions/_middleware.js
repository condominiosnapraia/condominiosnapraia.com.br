const FAVORITES_SCRIPT = '<script src="/js/favoritos.js?v=b3ff412" defer></script>';

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // O painel administrativo tem autenticação e scripts próprios; permanece isolado.
  if (path === '/crm' || path === '/crm.html' || path.startsWith('/crm/')) return next();

  const response = await next();
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
