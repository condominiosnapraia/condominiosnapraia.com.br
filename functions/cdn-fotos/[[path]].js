// ── PROXY DE FOTOS COM CACHE NO CLOUDFLARE ──
// Serve o Storage do Supabase através da borda do Cloudflare: cada foto
// sai do Supabase UMA vez por datacenter e depois é entregue pelo cache,
// sem consumir a banda do Supabase. Rota: /cdn-fotos/<caminho-no-storage>
const SB_PUBLIC = 'https://cddgkhkzcnyzzcllgzoz.supabase.co/storage/v1/object/public/';

export async function onRequestGet(context) {
  const { request, params } = context;
  const partes = Array.isArray(params.path) ? params.path : [params.path];
  const caminho = partes.map(encodeURIComponent).join('/');
  const url = new URL(request.url);

  // chave de cache normalizada (ignora cache-busters tipo ?r=1 das retentativas)
  const chave = new Request(url.origin + '/cdn-fotos/' + caminho, { method: 'GET' });
  const cache = caches.default;
  let resp = await cache.match(chave);
  if (resp) return resp;

  const upstream = await fetch(SB_PUBLIC + caminho, {
    cf: { cacheEverything: true, cacheTtl: 31536000 }
  });
  if (!upstream.ok) {
    return new Response('Foto não encontrada', { status: upstream.status === 404 ? 404 : 502 });
  }
  resp = new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') || 'image/webp',
      'Cache-Control': 'public, max-age=604800, s-maxage=31536000, immutable',
      'Access-Control-Allow-Origin': '*'
    }
  });
  context.waitUntil(cache.put(chave, resp.clone()));
  return resp;
}
