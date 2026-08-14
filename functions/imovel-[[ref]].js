// Redireciona /imovel-codigo para a URL canônica /imovel/<slug>/.
// Não chama next(): é uma rota final e responde diretamente com 301/404.

const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SITE = 'https://condominiosnapraia.com.br';
const SB_ANON_FALLBACK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzIiwicmVmIjoiY2RkZ2toemNueXp6Y2xsZ296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';

export async function onRequest(context) {
  const raw = context.params?.ref;
  const ref = Array.isArray(raw) ? raw.join('/') : raw;
  if (!ref) return new Response('Imóvel não encontrado', { status: 404 });

  const key = context.env?.SUPABASE_ANON_KEY || SB_ANON_FALLBACK;
  const valor = encodeURIComponent(ref);
  const filtros = [
    `codigo=eq.${valor}&limit=1`,
    `slug=eq.${valor}&limit=1`,
    `id=eq.${valor}&limit=1`
  ];

  for (const filtro of filtros) {
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

  return new Response('Imóvel não encontrado', { status: 404 });
}
