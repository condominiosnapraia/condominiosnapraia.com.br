// Cloudflare Pages Function — preview (Open Graph) para compartilhamento de imóveis
// URL: condominiosnapraia.com.br/imovel/ID
// Robôs (WhatsApp/Facebook): recebem meta tags com foto. Humanos: redirecionados ao site.

const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const STORAGE_BASE = SB_URL + '/storage/v1/object/public/fotos/';

function esc(s){
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function brl(v){
  const n = Number(String(v||0).replace(/\D/g,''));
  if(!n) return 'Consulte o valor';
  return n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:0});
}

// Extrai uma URL de foto utilizável a partir de vários formatos possíveis
function extrairFoto(valor){
  if(!valor) return null;
  // caso 1: string
  if(typeof valor === 'string'){
    if(valor.startsWith('http')) return valor;                 // já é URL
    if(valor.startsWith('data:')) return null;                 // base64 não serve p/ preview
    if(valor.startsWith('/')) return 'https://condominiosnapraia.com.br' + valor;
    // referência do Storage (caminho relativo) -> monta URL pública
    return STORAGE_BASE + valor.replace(/^fotos\//,'');
  }
  // caso 2: objeto {url:...} ou {src:...} ou {path:...}
  if(typeof valor === 'object'){
    return extrairFoto(valor.url || valor.src || valor.path || valor.foto || null);
  }
  return null;
}

function primeiraFoto(imovel){
  const listas = [imovel.fotos_no_site, imovel.fotos, imovel.fotos_para_site];
  for(const lista of listas){
    if(Array.isArray(lista)){
      for(const item of lista){
        const u = extrairFoto(item);
        if(u) return u;
      }
    } else if(lista){
      const u = extrairFoto(lista);
      if(u) return u;
    }
  }
  return null;
}

export async function onRequest(context){
  const { params, request } = context;
  const id = params.id;
  const ua = (request.headers.get('user-agent')||'').toLowerCase();
  const isBot = /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|googlebot|bingbot|pinterest|skypeuripreview|embedly|redditbot|applebot|googleimageproxy|vkshare|w3c_validator/.test(ua);
  const siteUrl = 'https://condominiosnapraia.com.br/imovel?id=' + id;

  // pessoa comum: redireciona para a página do imóvel
  if(!isBot){
    return Response.redirect(siteUrl, 302);
  }

  // buscar imóvel
  let imovel = null;
  try{
    // busca por ID (uuid) OU por slug — o que vier na URL
    // busca por id OU slug (o ?or= testa os dois de uma vez)
    const ref = encodeURIComponent(id);
    const HDR = { headers: { 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON } };
    // tenta por CÓDIGO → SLUG → ID (um por vez, mais confiável)
    let r = await fetch(`${SB_URL}/rest/v1/imoveis?codigo=eq.${ref}&select=*&limit=1`, HDR);
    let arr = r.ok ? await r.json() : [];
    if (!Array.isArray(arr) || !arr.length) {
      r = await fetch(`${SB_URL}/rest/v1/imoveis?slug=eq.${ref}&select=*&limit=1`, HDR);
      arr = r.ok ? await r.json() : [];
    }
    if (!Array.isArray(arr) || !arr.length) {
      r = await fetch(`${SB_URL}/rest/v1/imoveis?id=eq.${ref}&select=*&limit=1`, HDR);
      arr = r.ok ? await r.json() : [];
    }
    imovel = Array.isArray(arr) && arr.length ? arr[0] : null;
  }catch(e){ imovel = null; }

  let titulo = 'Imóvel no Litoral Norte Gaúcho';
  let descricao = 'Condomínios e imóveis de alto padrão no Litoral Norte Gaúcho. Fale com um especialista.';
  let foto = 'https://condominiosnapraia.com.br/img/og-default.jpg';

  if(imovel){
    titulo = (imovel.titulo || 'Imóvel') + ' — ' + brl(imovel.preco);
    const specs = [
      imovel.quartos ? imovel.quartos + ' quartos' : null,
      imovel.suites ? imovel.suites + ' suítes' : null,
      imovel.area ? imovel.area + 'm²' : null,
      imovel.vagas ? imovel.vagas + ' vagas' : null
    ].filter(Boolean).join(' · ');
    descricao = (specs ? specs + '. ' : '') + String(imovel.descricao || 'Confira este imóvel no litoral gaúcho.').substring(0,140);
    const f = primeiraFoto(imovel);
    if(f) foto = f.replace('https://cddgkhkzcnyzzcllgzoz.supabase.co/storage/v1/object/public/', 'https://condominiosnapraia.com.br/cdn-fotos/');
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:image" content="${esc(foto)}">
<meta property="og:image:secure_url" content="${esc(foto)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://condominiosnapraia.com.br/imovel/${esc(id)}">
<meta property="og:site_name" content="Condomínios na Praia">
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

  // diagnóstico: adicione ?debug=1 na URL
  try{
    const u = new URL(context.request.url);
    if(u.searchParams.get('debug')==='1'){
      return new Response(JSON.stringify({
        id_procurado: id,
        imovel_encontrado: !!imovel,
        titulo: imovel ? imovel.titulo : null,
        foto_escolhida: foto,
        campos_de_foto: imovel ? {
          fotos_no_site: imovel.fotos_no_site,
          fotos: imovel.fotos
        } : null
      }, null, 2), {headers:{'Content-Type':'application/json; charset=utf-8'}});
    }
  }catch(e){}


  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=UTF-8', 'cache-control': 'public, max-age=180' }
  });
}
