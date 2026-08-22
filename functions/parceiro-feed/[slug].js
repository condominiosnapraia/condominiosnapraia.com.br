const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const HEADERS = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` };

async function getJson(path) {
  const response = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: HEADERS });
  if (!response.ok) return [];
  return response.json();
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') { try { return JSON.parse(value); } catch (_) { return []; } }
  return [];
}

function firstPhoto(imovel) {
  const items = [...toArray(imovel?.fotos_no_site), ...toArray(imovel?.fotos), ...toArray(imovel?.fotos_para_site)];
  for (const item of items) {
    const url = typeof item === 'string' ? item : item?.url || item?.src || item?.publicUrl || item?.public_url;
    if (url && /^https?:\/\//i.test(url)) return url;
  }
  return null;
}

export async function onRequest(context) {
  const slug = String(context.params?.slug || '').toLowerCase();
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=60, s-maxage=300',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, OPTIONS',
    'x-content-type-options': 'nosniff',
  };
  if (context.request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (context.request.method !== 'GET' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers });
  const sites = await getJson(`parceiros_sites?slug=eq.${encodeURIComponent(slug)}&status=eq.active&select=id,slug,nome,creci,telefone,whatsapp,email,cidade,bio,logo_url,capa_url,updated_at&limit=1`);
  if (!Array.isArray(sites) || !sites[0]) return new Response(JSON.stringify({ error: 'site_not_published' }), { status: 404, headers });
  const site = sites[0];
  const rows = await getJson(`parceiros_sites_imoveis?site_id=eq.${site.id}&publicado=eq.true&select=id,ordem,destaque,titulo_personalizado,chamada_personalizada,updated_at,imovel:imoveis(id,slug,titulo,ref,cidade_end,bairro,preco,quartos,suites,area,descricao,fotos,fotos_no_site,fotos_para_site,status,publicar)&order=destaque.desc,ordem.asc&limit=1000`);
  const properties = (Array.isArray(rows) ? rows : []).filter(row => row.imovel && row.imovel.publicar !== false && String(row.imovel.status || '').toLowerCase() !== 'vendido').map(row => ({
    id: row.imovel.id,
    code: row.imovel.ref || row.imovel.id,
    slug: row.imovel.slug || row.imovel.id,
    title: row.titulo_personalizado || row.imovel.titulo || 'Imóvel disponível',
    description: row.chamada_personalizada || row.imovel.descricao || null,
    city: row.imovel.cidade_end || null,
    neighborhood: row.imovel.bairro || null,
    price: row.imovel.preco || null,
    bedrooms: row.imovel.quartos || null,
    suites: row.imovel.suites || null,
    area: row.imovel.area || null,
    cover_image: firstPhoto(row.imovel),
    featured: Boolean(row.destaque),
    public_url: `https://condominiosnapraia.com.br/corretor/${encodeURIComponent(site.slug)}/imovel/${encodeURIComponent(row.imovel.slug || row.imovel.codigo || row.imovel.id)}/`,
  }));
  return new Response(JSON.stringify({ version: '1.1', provider: 'Condomínios na Praia', generated_at: new Date().toISOString(), site: { slug: site.slug, name: site.nome, landing_url: `https://condominiosnapraia.com.br/corretor/${encodeURIComponent(site.slug)}/`, creci: site.creci || null, phone: site.telefone || null, whatsapp: site.whatsapp || null, email: site.email || null, city: site.cidade || null, bio: site.bio || null, logo_url: site.logo_url || null, cover_url: site.capa_url || null }, properties }, null, 2), { headers });
}
