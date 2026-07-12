// Cloudflare Pages Function — Sitemap DINÂMICO de imóveis
// URL: condominiosnapraia.com.br/sitemap-imoveis.xml
// Busca os imóveis publicados no Supabase e gera o sitemap na hora.
// Todo imóvel novo cadastrado aparece automaticamente para o Google.

const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const SITE = 'https://condominiosnapraia.com.br';

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function onRequest(context) {
  let imoveis = [];
  try {
    // buscar apenas imóveis publicados; campos mínimos para o sitemap
    const url = SB_URL + '/rest/v1/imoveis?select=id,slug,status,publicar,atualizado_em,criado_em&order=criado_em.desc';
    const r = await fetch(url, {
      headers: { apikey: SB_ANON, Authorization: 'Bearer ' + SB_ANON }
    });
    if (r.ok) imoveis = await r.json();
  } catch (e) {
    imoveis = [];
  }

  // mesmo critério do site: publicados e não vendidos
  const validos = (Array.isArray(imoveis) ? imoveis : []).filter(im => {
    if (im.publicar === false) return false;
    if (im.status === 'Vendido') return false;
    return true;
  });

  const urls = validos.map(im => {
    const ref = im.slug || im.id;
    const loc = SITE + '/imovel?id=' + encodeURIComponent(ref);
    const data = im.atualizado_em || im.criado_em;
    let lastmod = '';
    if (data) {
      try { lastmod = '\n    <lastmod>' + new Date(data).toISOString().slice(0, 10) + '</lastmod>'; } catch (e) {}
    }
    return '  <url>\n    <loc>' + esc(loc) + '</loc>' + lastmod + '\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>';
  }).join('\n');

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls + '\n' +
    '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600' // cache de 1h para não sobrecarregar
    }
  });
}
