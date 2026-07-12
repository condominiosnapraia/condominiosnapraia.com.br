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
  let erroBusca = null;
  try {
    // buscar apenas imóveis publicados; campos mínimos para o sitemap
    // select=* evita erro caso algum campo não exista na tabela
    const url = SB_URL + '/rest/v1/imoveis?select=*&limit=2000';
    const r = await fetch(url, {
      headers: { apikey: SB_ANON, Authorization: 'Bearer ' + SB_ANON }
    });
    if (r.ok) {
      imoveis = await r.json();
    } else {
      erroBusca = 'HTTP ' + r.status + ': ' + (await r.text()).slice(0,300);
    }
  } catch (e) {
    erroBusca = 'Exceção: ' + (e && e.message ? e.message : String(e));
    imoveis = [];
  }

  // mesmo critério do site: publicados e não vendidos
  const validos = (Array.isArray(imoveis) ? imoveis : []).filter(im => {
    if (im.publicar === false) return false;
    if (im.status === 'Vendido') return false;
    return true;
  });

  const urls = validos.map(im => {
    // URL bonita: prioriza o CÓDIGO do imóvel
    const ref = im.codigo || im.slug || im.id;
    const loc = SITE + '/imovel/' + encodeURIComponent(ref);
    const data = im.atualizado_em || im.updated_at || im.criado_em || im.created_at;
    let lastmod = '';
    if (data) {
      try { lastmod = '\n    <lastmod>' + new Date(data).toISOString().slice(0, 10) + '</lastmod>'; } catch (e) {}
    }
    return '  <url>\n    <loc>' + esc(loc) + '</loc>' + lastmod + '\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>';
  }).join('\n');

  // modo diagnóstico: adicione ?debug=1 na URL para ver o que está acontecendo
  try{
    const u = new URL(context.request.url);
    if (u.searchParams.get('debug') === '1') {
      return new Response(JSON.stringify({
        total_recebido_do_banco: Array.isArray(imoveis) ? imoveis.length : 0,
        validos_para_o_sitemap: validos.length,
        erro_na_busca: erroBusca,
        amostra_dos_3_primeiros: (Array.isArray(imoveis) ? imoveis.slice(0,3) : []),
        motivos_de_exclusao: (Array.isArray(imoveis) ? imoveis : []).slice(0,10).map(im => ({
          id: im.id,
          publicar: im.publicar,
          status: im.status,
          entra_no_sitemap: !(im.publicar === false || im.status === 'Vendido')
        }))
      }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
    }
  }catch(e){}

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
