const BASE = 'https://condominiosnapraia.com.br';
const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const HEADERS = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` };
const ALIASES = Object.freeze({ 'fernando-trvisol': 'fernando-trevisol' });
function xml(value) { return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;'); }
function publicSlug(value) { const slug = String(value || '').toLowerCase(); return Object.entries(ALIASES).find(([, alias]) => alias === slug)?.[0] || slug; }
async function getSites() { try { const r = await fetch(`${SB_URL}/rest/v1/parceiros_sites?status=eq.active&select=slug,updated_at&limit=5000`, { headers: HEADERS }); return r.ok ? await r.json() : []; } catch (_) { return []; } }
export async function onRequest() {
  const sites = await getSites();
  const today = new Date().toISOString().slice(0, 10);
  const body = (Array.isArray(sites) ? sites : []).filter((site) => site?.slug).map((site) => `<sitemap><loc>${xml(`${BASE}/sitemap-corretor/${publicSlug(site.slug)}.xml`)}</loc><lastmod>${xml(site.updated_at ? new Date(site.updated_at).toISOString().slice(0, 10) : today)}</lastmod></sitemap>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600', 'x-content-type-options': 'nosniff' } });
}
