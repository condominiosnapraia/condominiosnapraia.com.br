import { onRequest as handle } from '../../../corretor/[slug]/imovel/[imovelSlug].js';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  url.pathname = url.pathname.replace(/^\/corretora\//, '/corretor/');
  return handle({ ...context, request: new Request(url, context.request) });
}
