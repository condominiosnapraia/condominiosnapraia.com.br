// Cloudflare Pages Function — Sitemap DINÂMICO de condomínios
// URL: condominiosnapraia.com.br/sitemap-condominios.xml
// Todo condomínio cadastrado aparece automaticamente para o Google.

const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const SITE = 'https://condominiosnapraia.com.br';

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function onRequest(context) {
  let condominios = [];
  let erroBusca = null;

  try {
    const url = SB_URL + '/rest/v1/condominios?select=*&limit=2000';
    const r = await fetch(url, {
      headers: { apikey: SB_ANON, Authorization: 'Bearer ' + SB_ANON }
    });
    if (r.ok) {
      condominios = await r.json();
    } else {
      erroBusca = 'HTTP ' + r.status + ': ' + (await r.text()).slice(0, 300);
    }
  } catch (e) {
    erroBusca = 'Exceção: ' + (e && e.message ? e.message : String(e));
    condominios = [];
  }

  // só os ativos (se o campo existir)
  const validos = (Array.isArray(condominios) ? condominios : []).filter(c => {
    if (c.ativo === false) return false;
    return true;
  });

  const urls = validos.map(c => {
    const ref = c.slug || c.id;
    const loc = SITE + '/condominio/' + encodeURIComponent(ref);
    const data = c.atualizado_em || c.updated_at || c.criado_em || c.created_at;
    let lastmod = '';
    if (data) {
      try {
        lastmod = '\n    <lastmod>' + new Date(data).toISOString().slice(0, 10) + '</lastmod>';
      } catch (e) {}
    }
    // fotos do condomínio (para o Google Imagens)
    let imgs = '';
    try {
      const fotos = c.fotos_no_site || c.fotos || [];
      const lista = Array.isArray(fotos) ? fotos : [fotos];
      const titulo = (c.nome || 'Condomínio') + (c.cidade ? (' em ' + c.cidade) : '');
      lista.slice(0, 6).forEach(f => {
        let url = null;
        if (typeof f === 'string' && /^https?:\/\//i.test(f)) url = f;
        else if (f && typeof f === 'object' && f.url) url = f.url;
        if (url) {
          imgs += '\n    <image:image>' +
                  '\n      <image:loc>' + esc(url) + '</image:loc>' +
                  '\n      <image:title>' + esc(titulo) + '</image:title>' +
                  '\n    </image:image>';
        }
      });
    } catch (e) {}

    return '  <url>\n    <loc>' + esc(loc) + '</loc>' + lastmod +
           '\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>' +
           imgs +
           '\n  </url>';
  }).join('\n');

  // modo diagnóstico
  try {
    const u = new URL(context.request.url);
    if (u.searchParams.get('debug') === '1') {
      return new Response(JSON.stringify({
        total_recebido_do_banco: Array.isArray(condominios) ? condominios.length : 0,
        validos_para_o_sitemap: validos.length,
        erro_na_busca: erroBusca,
        amostra: (Array.isArray(condominios) ? condominios.slice(0, 3).map(c => ({
          id: c.id, nome: c.nome, slug: c.slug, ativo: c.ativo
        })) : [])
      }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
    }
  } catch (e) {}

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
    urls + '\n' +
    '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
