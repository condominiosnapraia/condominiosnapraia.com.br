// Cloudflare Pages Function — sitemap dinâmico de imóveis
// URL: /sitemap-imoveis.xml
// A chave do Supabase deve existir em Pages > Settings > Environment variables.

const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SITE = 'https://condominiosnapraia.com.br';
const PUBLIC_SLUG_ALIASES = {
  'XAN-018': 'lote-a-venda-monaco-yacht-club-xangri-la',
  'XAN-019': 'lote-a-venda-monaco-yacht-club-xangri-la-2'
};
function slugPublico(im) {
  const codigo = String(im?.codigo || '').toUpperCase();
  return PUBLIC_SLUG_ALIASES[codigo] || im.slug || im.codigo || im.id;
}
		const SB_ANON_FALLBACK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function fotoPublica(u) {
  if (!u) return '';
  const marker = '/storage/v1/object/public/';
  const i = String(u).indexOf(marker);
  return i === -1 ? String(u) : `${SITE}/cdn-fotos/` + String(u).slice(i + marker.length);
}

export async function onRequest(context) {
  const key = context.env?.SUPABASE_ANON_KEY || SB_ANON_FALLBACK;
  let imoveis = [];
  let erroBusca = null;

  if (!key) {
    erroBusca = 'SUPABASE_ANON_KEY não configurada';
  } else {
    try {
      const url = `${SB_URL}/rest/v1/imoveis?select=id,slug,codigo,updated_at,fotos_no_site,titulo,cidade_end,publicar,status&limit=2000`;
      const r = await fetch(url, {
        headers: { apikey: key, Authorization: `Bearer ${key}` }
      });
      if (r.ok) imoveis = await r.json();
      else erroBusca = `HTTP ${r.status}`;
    } catch (e) {
      erroBusca = e?.message || String(e);
    }
  }

  const validos = (Array.isArray(imoveis) ? imoveis : []).filter(im => {
    if (im.publicar === false) return false;
    if (im.status === 'Vendido' || im.status === 'Inativo') return false;
    return Boolean(im.slug || im.codigo || im.id);
  });

  const urls = validos.map(im => {
    const ref = slugPublico(im);
    const loc = `${SITE}/imovel/${encodeURIComponent(ref)}/`;
      const data = im.updated_at;
    let lastmod = '';
    if (data) {
      try { lastmod = `\n    <lastmod>${new Date(data).toISOString().slice(0, 10)}</lastmod>`; } catch (_) {}
    }

    let imgs = '';
    try {
      let fotos = im.fotos_no_site || [];
      if (typeof fotos === 'string') fotos = JSON.parse(fotos);
      const lista = Array.isArray(fotos) ? fotos : [fotos];
      const titulo = `${im.titulo || 'Imóvel'}${im.cidade_end ? ` em ${im.cidade_end}` : ''}`;
      lista.slice(0, 6).forEach(f => {
        const raw = typeof f === 'string' ? f : f?.url;
        const imageUrl = raw && /^https?:\/\//i.test(raw) ? fotoPublica(raw) : '';
        if (imageUrl) {
          imgs += `\n    <image:image>\n      <image:loc>${esc(imageUrl)}</image:loc>\n      <image:title>${esc(titulo)}</image:title>\n    </image:image>`;
        }
      });
    } catch (_) {}

    return `  <url>\n    <loc>${esc(loc)}</loc>${lastmod}\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>${imgs}\n  </url>`;
  }).join('\n');

  const requestUrl = new URL(context.request.url);
  if (requestUrl.searchParams.get('debug') === '1') {
    return new Response(JSON.stringify({
      total_recebido_do_banco: Array.isArray(imoveis) ? imoveis.length : 0,
      validos_para_o_sitemap: validos.length,
      erro_na_busca: erroBusca,
      amostra: validos.slice(0, 3).map(im => ({ codigo: im.codigo, slug: im.slug, publicar: im.publicar, status: im.status }))
    }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
