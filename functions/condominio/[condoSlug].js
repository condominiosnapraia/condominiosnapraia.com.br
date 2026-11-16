// Rota legada /condominio/SLUG do portal principal.
// O perfil do Marcos só é usado no domínio marcosselbach.com.br,
// roteado pelo middleware. No domínio Condomínios na Praia, encaminhamos
// para a página pública canônica do condomínio, sem telefone de parceiro.
export async function onRequest(context) {
  const condoSlug = String(context.params?.condoSlug || '').replace(/^\/+|\/+$/g, '');
  if (!condoSlug) return new Response('Not Found', { status: 404 });

  const requestUrl = new URL(context.request.url);
  const target = new URL(`/${encodeURIComponent(condoSlug)}`, requestUrl);
  target.search = requestUrl.search;
  return Response.redirect(target, 301);
}
