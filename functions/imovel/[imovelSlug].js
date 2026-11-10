import { onRequest as partnerProperty } from '../corretor/[slug]/imovel/[imovelSlug].js';

export async function onRequest(context) {
  const headers = new Headers(context.request.headers);
  headers.set('x-public-partner-prefix', '/');
  return partnerProperty({ ...context, request: new Request(context.request, { headers }), params: { ...(context.params || {}), slug: 'marcos-selbach', imovelSlug: context.params?.imovelSlug } });
}
