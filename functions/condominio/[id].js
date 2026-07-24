// Cloudflare Pages Function — preview (Open Graph) para compartilhamento de CONDOMÍNIOS
// URL: condominiosnapraia.com.br/condominio/SLUG
// Robôs (WhatsApp/Facebook): recebem meta tags com foto. Humanos: redirecionados ao site.

const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const STORAGE_BASE = SB_URL + '/storage/v1/object/public/fotos/';

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Extrai uma URL de foto utilizável a partir dos vários formatos possíveis
function extrairFoto(valor) {
  if (!valor) return null;
  if (typeof valor === 'string') {
    if (/^https?:\/\//i.test(valor)) return valor;
    if (/^data:/i.test(valor)) return null;           // base64 não serve para OG
    return STORAGE_BASE + valor.replace(/^fotos\//, '');
  }
  if (Array.isArray(valor)) {
    for (const v of valor) {
      const f = extrairFoto(v);
      if (f) return f;
    }
    return null;
  }
  if (typeof valor === 'object') {
    return extrairFoto(valor.url || valor.src || valor.path || valor.foto || null);
  }
  return null;
}

export async function onRequest(context) {
  const { params, request } = context;
  const id = params.id;

  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  const isBot = /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|slackbot|linkedinbot|discordbot|googlebot|bingbot|pinterest|skypeuripreview|vkshare|embedly|redditbot|applebot/i.test(ua);

  const siteUrl = 'https://condominiosnapraia.com.br/condominio?id=' + encodeURIComponent(id);

  // pessoa comum: redireciona para a página do condomínio
  if (!isBot) {
    return Response.redirect(siteUrl, 302);
  }

  // ── ROBÔ: buscar o condomínio e devolver as meta tags com foto ──
  let cond = null;
  try {
    const ref = encodeURIComponent(id);
    const HDR = { headers: { apikey: SB_ANON, Authorization: 'Bearer ' + SB_ANON } };
    // tenta por SLUG → depois por ID
    let r = await fetch(`${SB_URL}/rest/v1/condominios?slug=eq.${ref}&select=*&limit=1`, HDR);
    let arr = r.ok ? await r.json() : [];
    if (!Array.isArray(arr) || !arr.length) {
      r = await fetch(`${SB_URL}/rest/v1/condominios?id=eq.${ref}&select=*&limit=1`, HDR);
      arr = r.ok ? await r.json() : [];
    }
    cond = Array.isArray(arr) && arr.length ? arr[0] : null;
  } catch (e) {
    cond = null;
  }

  // montar título, descrição e foto
  let titulo = 'Condomínios na Praia';
  let descricao = 'Condomínios de alto padrão no Litoral Norte Gaúcho.';
  let foto = 'https://condominiosnapraia.com.br/img/og-default.jpg';

  if (cond) {
    const cidade = cond.cidade || cond.localizacao || '';
    titulo = cond.nome + (cidade ? (' — ' + cidade) : '');

    const d = (cond.descricao || '').replace(/\s+/g, ' ').trim();
    if (d.length > 40) {
      descricao = d.slice(0, 180);
    } else {
      const partes = ['Condomínio'];
      if (cond.padrao) partes.push(cond.padrao);
      if (cidade) partes.push('em ' + cidade);
      partes.push('· Litoral Norte Gaúcho');
      descricao = partes.join(' ');
    }

    // foto de capa do condomínio
    const f = extrairFoto(cond.fotos_no_site) || extrairFoto(cond.fotos);
    if (f) foto = f.replace('https://cddgkhkzcnyzzcllgzoz.supabase.co/storage/v1/object/public/', 'https://condominiosnapraia.com.br/cdn-fotos/');
  }

  // modo diagnóstico: adicione ?debug=1
  try {
    const u = new URL(request.url);
    if (u.searchParams.get('debug') === '1') {
      return new Response(JSON.stringify({
        id_procurado: id,
        condominio_encontrado: !!cond,
        nome: cond ? cond.nome : null,
        foto_escolhida: foto,
        campos_de_foto: cond ? { fotos_no_site: cond.fotos_no_site, fotos: cond.fotos } : null
      }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
    }
  } catch (e) {}

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:image" content="${esc(foto)}">
<meta property="og:image:secure_url" content="${esc(foto)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://condominiosnapraia.com.br/condominio/${esc(id)}">
<meta property="og:site_name" content="Condomínios na Praia">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(descricao)}">
<meta name="twitter:image" content="${esc(foto)}">
<meta http-equiv="refresh" content="0; url=${esc(siteUrl)}">
</head>
<body>
<p>Redirecionando... <a href="${esc(siteUrl)}">Clique aqui</a>.</p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
}
