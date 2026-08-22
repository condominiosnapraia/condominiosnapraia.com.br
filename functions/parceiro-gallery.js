const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const BASE = 'https://condominiosnapraia.com.br';
const HEADERS = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` };
const SITE_SLUG_ALIASES = Object.freeze({ 'fernando-trevisol': 'fernando-trvisol' });
const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff' };
function json(value, status = 200, extra = {}) { return new Response(JSON.stringify(value), { status, headers: { ...JSON_HEADERS, ...extra } }); }
function toArray(value) { if (Array.isArray(value)) return value; if (typeof value === 'string') { try { return JSON.parse(value); } catch (_) { return value ? [value] : []; } } return []; }
function publicPhoto(value) {
  const raw = typeof value === 'string' ? value : value?.url || value?.src || value?.publicUrl || value?.public_url || '';
  if (!raw) return '';
  const marker = '/storage/v1/object/public/';
  const index = raw.indexOf(marker);
  if (index >= 0) return `${BASE}/cdn-fotos/${raw.slice(index + marker.length).replace(/^\/+/, '')}`;
  if (/^https?:\/\//i.test(raw) || raw.startsWith('/cdn-fotos/')) return raw;
  return `${BASE}/cdn-fotos/${raw.replace(/^\/+/, '')}`;
}
function photoList(row) {
  const seen = new Set();
  return [...toArray(row?.fotos_no_site), ...toArray(row?.fotos_para_site)].map(publicPhoto).filter((url) => url && !seen.has(url) && seen.add(url));
}
async function getJson(path, headers = HEADERS) { try { const response = await fetch(`${SB_URL}/rest/v1/${path}`, { headers }); return response.ok ? await response.json() : []; } catch (_) { return []; } }
async function authenticatedUser(token) { try { const response = await fetch(`${SB_URL}/auth/v1/user`, { headers: { apikey: SB_ANON, Authorization: `Bearer ${token}` } }); return response.ok ? await response.json() : null; } catch (_) { return null; } }
export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...JSON_HEADERS, 'access-control-allow-origin': BASE, 'access-control-allow-methods': 'GET, OPTIONS', 'access-control-allow-headers': 'authorization, content-type' } });
  if (context.request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405, { allow: 'GET, OPTIONS' });
  const url = new URL(context.request.url);
  const requestedSiteSlug = String(url.searchParams.get('site') || '').toLowerCase();
  const siteSlug = SITE_SLUG_ALIASES[requestedSiteSlug] || requestedSiteSlug;
  const propertyId = String(url.searchParams.get('imovel') || '');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(requestedSiteSlug) || !/^[0-9a-f-]{8,}$/i.test(propertyId)) return json({ error: 'invalid_request' }, 400);
  const token = String(context.request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!token || !(await authenticatedUser(token))) return json({ error: 'login_required', message: 'Faça login para ver as fotos adicionais.' }, 401, { 'www-authenticate': 'Bearer' });
  const sites = await getJson(`parceiros_sites?slug=eq.${encodeURIComponent(siteSlug)}&status=eq.active&select=id&limit=1`);
  if (!sites[0]) return json({ error: 'site_not_published' }, 404);
  const rows = await getJson(`parceiros_sites_imoveis?site_id=eq.${encodeURIComponent(sites[0].id)}&imovel_id=eq.${encodeURIComponent(propertyId)}&publicado=eq.true&select=imovel:imoveis(id,cond_id,fotos_no_site,fotos_para_site)&limit=1`);
  if (!rows[0]?.imovel) return json({ error: 'property_not_published' }, 404);
  const propertyPhotos = photoList(rows[0].imovel).slice(3);
  let condoPhotos = [];
  if (rows[0].imovel.cond_id) {
    const condos = await getJson(`condominios?id=eq.${encodeURIComponent(rows[0].imovel.cond_id)}&select=id,fotos_no_site,fotos&limit=1`);
    condoPhotos = [...toArray(condos[0]?.fotos_no_site), ...toArray(condos[0]?.fotos)].map(publicPhoto).filter(Boolean);
  }
  return json({ photos: propertyPhotos, condo_photos: condoPhotos.slice(3), unlocked: true });
}
