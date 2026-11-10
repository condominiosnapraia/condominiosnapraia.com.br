import { onRequest as partnerCondos } from './parceiro/[slug]/condominios.js';

export async function onRequest(context) {
  const headers = new Headers(context.request.headers);
  headers.set('x-public-partner-prefix', '/');
  return partnerCondos({ ...context, request: new Request(context.request, { headers }), params: { ...(context.params || {}), slug: 'marcos-selbach' } });
}
