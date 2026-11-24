import { onRequest as partnerProperty } from '../corretor/[slug]/imovel/[imovelSlug].js';

export async function onRequest(context) {
  const headers = new Headers(context.request.headers);
  headers.set('x-public-partner-prefix', '/');
  const hostname = new URL(context.request.url).hostname.toLowerCase();
  const isAtlantida = hostname === 'atlantidanegocios.com.br' || hostname === 'www.atlantidanegocios.com.br';
  headers.set('x-public-portal', isAtlantida ? 'atlantida-negocios' : 'official');
  return partnerProperty({ ...context, request: new Request(context.request, { headers }), params: { ...(context.params || {}), slug: 'portal', imovelSlug: context.params?.imovelSlug } });
}
