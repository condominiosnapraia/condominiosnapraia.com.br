// Proxy de fotos com variantes responsivas no Cloudflare.
// Originais permanecem no Supabase Storage; esta função só transforma a entrega.
const SB_PUBLIC = 'https://cddgkhkzcnyzzcllgzoz.supabase.co/storage/v1/object/public/';
const ALLOWED_WIDTHS = new Set([320, 480, 640, 768, 960, 1280, 1600]);
const ALLOWED_FORMATS = new Set(['jpeg', 'webp', 'avif']);

function allowedWidth(value) {
  const n = Number.parseInt(value || '', 10);
  return ALLOWED_WIDTHS.has(n) ? n : null;
}

function allowedQuality(value) {
  const n = Number.parseInt(value || '', 10);
  if (!Number.isFinite(n)) return 78;
  return Math.min(90, Math.max(55, n));
}

function allowedFormat(value) {
  const f = String(value || '').toLowerCase();
  return ALLOWED_FORMATS.has(f) ? f : null;
}

export async function onRequestGet(context) {
  const { request, params } = context;
  const partes = Array.isArray(params.path) ? params.path : [params.path];
  const caminho = partes
    .filter(Boolean)
    .map((parte) => encodeURIComponent(parte))
    .join('/');

  if (!caminho || !caminho.startsWith('fotos/')) {
    return new Response('Caminho de foto inválido', { status: 400 });
  }

  const entrada = new URL(request.url);
  const width = allowedWidth(entrada.searchParams.get('w'));
  const quality = allowedQuality(entrada.searchParams.get('q'));
  const format = allowedFormat(entrada.searchParams.get('fmt'));

  const imageOptions = {};
  if (width) imageOptions.width = width;
  if (format) imageOptions.format = format;
  if (width || format) {
    imageOptions.quality = quality;
    imageOptions.fit = 'scale-down';
  }

  // A chave inclui somente parâmetros normalizados da variante.
  const cacheUrl = new URL(entrada.origin + '/cdn-fotos/' + caminho);
  if (width) cacheUrl.searchParams.set('w', String(width));
  if (width || format) cacheUrl.searchParams.set('q', String(quality));
  if (format) cacheUrl.searchParams.set('fmt', format);

  const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const fetchOptions = {
    cf: {
      cacheEverything: true,
      cacheTtl: 31536000,
      ...(Object.keys(imageOptions).length ? { image: imageOptions } : {})
    }
  };

  let upstream = await fetch(SB_PUBLIC + caminho, fetchOptions);
  // Se a transformação ainda não estiver habilitada na zona, mantém a foto funcionando.
  if (!upstream.ok && Object.keys(imageOptions).length) {
    upstream = await fetch(SB_PUBLIC + caminho, {
      cf: { cacheEverything: true, cacheTtl: 31536000 }
    });
  }
  if (!upstream.ok) {
    return new Response('Foto não encontrada', {
      status: upstream.status === 404 ? 404 : 502
    });
  }

  const headers = new Headers();
  headers.set('Content-Type', upstream.headers.get('Content-Type') || 'image/jpeg');
  headers.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
  headers.set('Access-Control-Allow-Origin', '*');

  const response = new Response(upstream.body, { status: 200, headers });
  context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
