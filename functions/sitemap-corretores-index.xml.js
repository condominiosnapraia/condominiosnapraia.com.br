const BASE = 'https://condominiosnapraia.com.br';
const slugs = ['fernando-trevisol', 'marcos-selbach', 'juliano-machado'];

export async function onRequest() {
  const today = new Date().toISOString().slice(0, 10);
  const body = slugs.map((slug) => `<sitemap><loc>${BASE}/sitemap-corretor/${slug}.xml</loc><lastmod>${today}</lastmod></sitemap>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600', 'x-content-type-options': 'nosniff' } });
}
