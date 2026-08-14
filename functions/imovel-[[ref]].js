// Compatibilidade com páginas estáticas antigas: /imovel-XAN-001/
// Redireciona para /imovel/<slug>/ sem apagar a página ou o cadastro antigo.

const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SITE = 'https://condominiosnapraia.com.br';

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/imovel-([^/]+)\/?$/i);
  if (!match) return next();

  const ref = decodeURIComponent(match[1]);
  const key = env.SUPABASE_ANON_KEY;
  if (!key) return next();

  const valor = encodeURIComponent(ref);
  const consultas = [
    `codigo=eq.${valor}&limit=1`,
    `slug=eq.${valor}&limit=1`,
    `id=eq.${valor}&limit=1`
  ];

  for (const filtro of consultas) {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/imoveis?select=slug,codigo,id&${filtro}`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` }
      });
      if (!r.ok) continue;
      const arr = await r.json();
      const im = Array.isArray(arr) && arr[0];
      if (im) {
        const canonical = im.slug || im.codigo || im.id;
        return Response.redirect(`${SITE}/imovel/${encodeURIComponent(canonical)}/`, 301);
      }
    } catch (_) {}
  }

  return next();
}
