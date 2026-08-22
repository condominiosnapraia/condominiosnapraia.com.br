const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const SITE = 'https://condominiosnapraia.com.br';
const HEADERS = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` };
const SITE_SLUG_ALIASES = Object.freeze({ 'fernando-trevisol': 'fernando-trvisol' });
function publicSiteSlug(value) { const slug = String(value || '').toLowerCase(); return Object.entries(SITE_SLUG_ALIASES).find(([, alias]) => alias === slug)?.[0] || slug; }
function esc(value) { return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;'); }
function slugify(value) { return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-'); }
function propertySlug(im) { const stored = String(im?.slug || '').trim().replace(/^\/+|\/+$/g, ''); if (stored) return stored; const base = slugify(im?.titulo || im?.tipo || 'imovel'); const code = slugify(im?.codigo || im?.ref || ''); return code && !base.endsWith(code) ? `${base}-${code}` : base || slugify(im?.id) || 'imovel'; }
function lastmod(row) { const value = row?.updated_at || row?.created_at; if (!value) return ''; try { return new Date(value).toISOString().slice(0, 10); } catch (_) { return ''; } }
async function getJson(path) { try { const response = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: HEADERS }); return response.ok ? await response.json() : []; } catch (_) { return []; } }
export async function onRequest() {
  const sites = await getJson('parceiros_sites?status=eq.active&select=id,slug,updated_at&limit=1000');
  const urls = [];
  for (const site of Array.isArray(sites) ? sites : []) {
    if (!site?.slug) continue;
    const publicSlug = publicSiteSlug(site.slug);
    const landing = `${SITE}/corretor/${encodeURIComponent(publicSlug)}/`;
    urls.push({ loc: landing, lastmod: lastmod(site), priority: '0.8' });
    urls.push({ loc: `${landing}contato/`, lastmod: lastmod(site), priority: '0.7' });
    urls.push({ loc: `${landing}imoveis/`, lastmod: lastmod(site), priority: '0.8' });
    const rows = await getJson(`parceiros_sites_imoveis?site_id=eq.${encodeURIComponent(site.id)}&publicado=eq.true&select=updated_at,imovel:imoveis(id,slug,codigo,ref,titulo,tipo,status,publicar,updated_at)&limit=1000`);
    (Array.isArray(rows) ? rows : []).forEach((row) => {
      const im = row?.imovel;
      if (!im || im.publicar === false || String(im.status || '').toLowerCase() === 'vendido') return;
      urls.push({ loc: `${SITE}/corretor/${encodeURIComponent(publicSlug)}/imovel/${encodeURIComponent(propertySlug(im))}/`, lastmod: lastmod(row) || lastmod(im), priority: '0.7' });
    });
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${esc(url.loc)}</loc>${url.lastmod ? `<lastmod>${esc(url.lastmod)}</lastmod>` : ''}<changefreq>daily</changefreq><priority>${url.priority}</priority></url>`).join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
