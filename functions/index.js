import { onRequest as partnerHome } from './parceiro/[slug].js';
const MARCO_HOSTS = new Set(['marcosselbach.com.br', 'www.marcosselbach.com.br']);
function marcoContext(context, params = {}) {
  const headers = new Headers(context.request.headers);
  headers.set('x-public-partner-prefix', '/');
  return { ...context, request: new Request(context.request, { headers }), params: { ...(context.params || {}), slug: 'marcos-selbach', ...params } };
}

export async function onRequest(context) {
  if (!MARCO_HOSTS.has(new URL(context.request.url).hostname.toLowerCase())) return context.next();
  return partnerHome(marcoContext(context));
}
