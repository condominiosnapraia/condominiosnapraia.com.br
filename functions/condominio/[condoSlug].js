import { onRequest as partnerCondo } from '../parceiro/[slug]/condominio/[condoSlug].js';

export async function onRequest(context) {
  const headers = new Headers(context.request.headers);
  headers.set('x-public-partner-prefix', '/');
  return partnerCondo({ ...context, request: new Request(context.request, { headers }), params: { ...(context.params || {}), slug: 'marcos-selbach', condoSlug: context.params?.condoSlug } });
}
