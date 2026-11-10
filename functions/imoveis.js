import { onRequest as partnerListing } from './parceiro/[slug]/imoveis.js';

export async function onRequest(context) {
  const headers = new Headers(context.request.headers);
  headers.set('x-public-partner-prefix', '/');
  return partnerListing({ ...context, request: new Request(context.request, { headers }), params: { ...(context.params || {}), slug: 'marcos-selbach' } });
}
