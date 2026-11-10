import { onRequest as partnerCondos } from './parceiro/[slug]/condominios.js';
const MARCO_HOSTS = new Set(['marcosselbach.com.br', 'www.marcosselbach.com.br']);

export async function onRequest(context) {
  if (!MARCO_HOSTS.has(new URL(context.request.url).hostname.toLowerCase())) return context.next();
  const headers = new Headers(context.request.headers);
  headers.set('x-public-partner-prefix', '/');
  return partnerCondos({ ...context, request: new Request(context.request, { headers }), params: { ...(context.params || {}), slug: 'marcos-selbach' } });
}
