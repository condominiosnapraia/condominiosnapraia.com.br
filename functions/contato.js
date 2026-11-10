import { onRequest as partnerContact } from './corretor/[slug]/contato.js';

export async function onRequest(context) {
  const headers = new Headers(context.request.headers);
  headers.set('x-public-partner-prefix', '/');
  return partnerContact({ ...context, request: new Request(context.request, { headers }), params: { ...(context.params || {}), slug: 'marcos-selbach' } });
}
