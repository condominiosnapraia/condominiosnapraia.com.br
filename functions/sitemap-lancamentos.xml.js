// URL: /sitemap-lancamentos.xml
// Sitemap específico da categoria Lançamentos.
// Os lançamentos apontam para suas páginas canônicas de condomínio.

const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const SITE = 'https://condominiosnapraia.com.br';
const FIXED_URLS = [
  '/origem-natureza-habitada-xangri-la/',
  '/la-marina-reserva-maquine/',
  '/aura-garden-place-xangri-la/',
  '/bravia-marina-beach-club-maquine/',
  '/mirador-playa-arenas-curumim/',
  '/vivendas-da-marina-capao-da-canoa/',
  '/enseada-lagoa-dos-quadros-capao-da-canoa/',
  '/cyano-private-resort-osorio/',
  '/monaco-grand-marina-maquine/',
  '/vientos-resort-xangri-la/',
  '/condominio-alegro-curumim/'
];
const ALIASES = new Map([
  ['/condominio-vivendas-da-marina-capao-da-canoa', '/vivendas-da-marina-capao-da-canoa/']
]);

function esc(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
function canonicalPath(raw) {
  const value = String(raw || '').trim();
  if (!value) return '';
  let path = value;
  try {
    if (/^https?:\/\//i.test(value)) path = new URL(value).pathname;
  } catch (_) {}
  if (!path.startsWith('/')) path = '/' + path;
  const key = path.replace(/\/+$/, '').toLowerCase();
  return ALIASES.get(key) || ('/' + path.replace(/^\/+|\/+$/g, '') + '/');
}
function dateValue(row) {
  const value = row && (row.updated_at || row.atualizado_em || row.created_at || row.criado_em);
  if (!value) return '';
  try { return new Date(value).toISOString().slice(0, 10); } catch (_) { return ''; }
}

export async function onRequest(context) {
  const entries = new Map();
  FIXED_URLS.forEach(path => entries.set(path, { path, lastmod: '' }));
  let error = null;
  try {
    const response = await fetch(SB_URL + '/rest/v1/lancamentos?ativo=eq.true&select=*&limit=2000', {
      headers: { apikey: SB_ANON, Authorization: 'Bearer ' + SB_ANON }
    });
    if (!response.ok) error = 'HTTP ' + response.status;
    else {
      const rows = await response.json();
      if (Array.isArray(rows)) rows.forEach(row => {
        const path = canonicalPath(row.url || row.slug);
        if (path && !entries.has(path)) entries.set(path, { path, lastmod: dateValue(row) });
      });
    }
  } catch (e) { error = e && e.message ? e.message : String(e); }

  const requestUrl = new URL(context.request.url);
  if (requestUrl.searchParams.get('debug') === '1') {
    return new Response(JSON.stringify({ total: entries.size, erro_na_busca: error, urls: [...entries.values()] }, null, 2), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  const urls = [...entries.values()].map(entry => {
    const lastmod = entry.lastmod ? '\n    <lastmod>' + entry.lastmod + '</lastmod>' : '';
    return '  <url>\n    <loc>' + esc(SITE + entry.path) + '</loc>' + lastmod + '\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>';
  }).join('\n');
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '\n</urlset>';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
