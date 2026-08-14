// Cloudflare Pages Function — compatibilidade para /imovel/:id
// Redireciona a rota antiga específica para /imovel/<slug>/ com status 301.

const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SITE = 'https://condominiosnapraia.com.br';

export async function onRequest(context) {
  const { params, env, next } = context;
  const ref = params.id;
  const key = env.SUPABASE_ANON_KEY;
  if (!ref || !key) return next();

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
        // A rota [id].js também captura /imovel/<slug>/; não redirecionar para a própria URL.
        if (String(im.slug || '') === String(ref) || (!im.slug && String(canonical) === String(ref))) {
          return next();
        }
        return Response.redirect(`${SITE}/imovel/${encodeURIComponent(canonical)}/`, 301);
      }
    } catch (_) {}
  }

  return next();
}
