const BASE = 'https://condominiosnapraia.com.br';
const slugs = Object.freeze(['fernando-trevisol', 'marcos-selbach', 'juliano-machado']);

function xml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function validSlug(value) {
  const slug = String(value || '').toLowerCase();
  return slugs.includes(slug) ? slug : '';
}

export async function onRequest(context) {
  const slug = validSlug(context.params?.slug || context.functionPath?.match(/sitemap-corretor-([a-z0-9-]+)\.xml/)?.[1]);
  if (!slug) return new Response('Not Found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' } });
  const urls = [
    { loc: `${BASE}/corretor/${slug}/`, priority: '1.0' },
    { loc: `${BASE}/corretor/${slug}/imoveis/`, priority: '0.9' },
    { loc: `${BASE}/corretor/${slug}/contato/`, priority: '0.7' },
  ];
  try {
    const response = await fetch(`${BASE}/parceiro-feed/${encodeURIComponent(slug)}?sitemap=individual`);
    if (response.ok) {
      const payload = await response.json();
      const properties = Array.isArray(payload?.properties) ? payload.properties : [];
      properties.forEach((property) => {
        if (property.public_url) urls.push({ loc: property.public_url, priority: '0.6' });
      });
    }
  } catch (_) {}
  const lastmod = new Date().toISOString().slice(0, 10);
  const body = urls.map(({ loc, priority }) => `<url><loc>${xml(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>${priority}</priority></url>`).join('');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
  return new Response(sitemap, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600', 'x-content-type-options': 'nosniff' } });
}
