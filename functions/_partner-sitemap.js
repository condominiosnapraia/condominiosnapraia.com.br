const BASE = 'https://condominiosnapraia.com.br';
const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const HEADERS = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` };
const SITE_SLUG_ALIASES = Object.freeze({ 'fernando-trevisol': 'fernando-trvisol' });

function xml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
function publicSlug(value) {
  const requested = String(value || '').toLowerCase();
  return Object.entries(SITE_SLUG_ALIASES).find(([, alias]) => alias === requested)?.[0] || requested;
}
function slugify(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-');
}
function propertySlug(property) {
  const stored = String(property?.slug || '').trim().replace(/^\/+|\/+$/g, '');
  if (stored) return stored;
  const base = slugify(property?.titulo || property?.tipo || 'imovel');
  const code = slugify(property?.codigo || property?.ref || '');
  return code && !base.endsWith(code) ? `${base}-${code}` : base || slugify(property?.id) || 'imovel';
}
function condoSlug(condo) {
  const stored = String(condo?.slug || '').trim().replace(/^\/+|\/+$/g, '');
  return stored || slugify(condo?.nome || condo?.name || condo?.id || 'condominio');
}
function lastmod(row) {
  const value = row?.updated_at || row?.atualizado_em || row?.created_at || row?.criado_em;
  if (!value) return '';
  try { return new Date(value).toISOString().slice(0, 10); } catch (_) { return ''; }
}
async function getJson(path) {
  try {
    const response = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: HEADERS });
    return response.ok ? await response.json() : [];
  } catch (_) { return []; }
}
async function partnerExists(slug) {
  const dbSlug = SITE_SLUG_ALIASES[slug] || slug;
  const rows = await getJson(`parceiros_sites?slug=eq.${encodeURIComponent(dbSlug)}&status=eq.active&select=id,slug,updated_at&limit=1`);
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

export async function onRequest(context) {
  const requested = String(context.params?.slug || context.functionPath?.match(/sitemap-corretor-([a-z0-9-]+)\.xml/)?.[1] || '').toLowerCase();
  const slug = publicSlug(requested);
  const site = await partnerExists(slug);
  if (!site) return new Response('Not Found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' } });

  const urls = new Map();
  const add = (loc, row, priority = '0.7') => { if (loc && !urls.has(loc)) urls.set(loc, { loc, lastmod: lastmod(row) || lastmod(site), priority }); };
  const root = `${BASE}/corretor/${encodeURIComponent(slug)}/`;
  add(root, site, '1.0');
  add(`${root}imoveis/`, site, '0.9');
  add(`${root}condominios/`, site, '0.8');
  add(`${root}contato/`, site, '0.7');

  const rows = await getJson(`parceiros_sites_imoveis?site_id=eq.${encodeURIComponent(site.id)}&publicado=eq.true&select=updated_at,imovel:imoveis(id,slug,codigo,ref,titulo,tipo,status,publicar,updated_at,cond_id,condominio:condominios(id,slug,nome,updated_at))&limit=5000`);
  for (const row of Array.isArray(rows) ? rows : []) {
    const property = row?.imovel;
    if (!property || property.publicar === false || /vendido|inativo/i.test(String(property.status || ''))) continue;
    add(`${root}imovel/${encodeURIComponent(propertySlug(property))}/`, row, '0.7');
    const condo = property.condominio;
    if (condo) add(`${root}condominio/${encodeURIComponent(condoSlug(condo))}/`, condo, '0.7');
  }

  const body = [...urls.values()].map((entry) => `<url><loc>${xml(entry.loc)}</loc>${entry.lastmod ? `<lastmod>${xml(entry.lastmod)}</lastmod>` : ''}<changefreq>daily</changefreq><priority>${entry.priority}</priority></url>`).join('');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
  return new Response(sitemap, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600', 'x-content-type-options': 'nosniff' } });
}

export { publicSlug };
