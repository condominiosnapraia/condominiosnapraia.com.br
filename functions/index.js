import { onRequest as partnerHome } from './parceiro/[slug].js';

function marcoContext(context, params = {}) {
  const headers = new Headers(context.request.headers);
  headers.set('x-public-partner-prefix', '/');
  return { ...context, request: new Request(context.request, { headers }), params: { ...(context.params || {}), slug: 'marcos-selbach', ...params } };
}

export async function onRequest(context) {
  return partnerHome(marcoContext(context));
}
