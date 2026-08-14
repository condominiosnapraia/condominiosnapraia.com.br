// ============================================================================
// Cloudflare Pages Function: /imovel
// Injeta as meta tags Open Graph (foto, título, descrição) no HTML quando o
// link de um imóvel é acessado — para que WhatsApp, Facebook, Telegram etc.
// mostrem a PRÉVIA correta com a foto do imóvel.
//
// Por que isso é necessário:
//   O WhatsApp/Facebook NÃO executam JavaScript. Eles leem o HTML "cru" que o
//   servidor entrega. Como as fotos do imóvel só entram via JS (depois de
//   buscar no Supabase), os robôs nunca as veem. Esta função busca os dados no
//   servidor e injeta as tags ANTES de entregar o HTML.
//
// Onde colocar:
//   Este arquivo vai em:  /functions/imovel.js  (na raiz do projeto Cloudflare Pages)
//   Ele intercepta automaticamente as requisições para /imovel
//
// Requer a variável de ambiente (Pages > Settings > Environment variables):
//   SUPABASE_ANON_KEY = <sua chave anon do Supabase>
// ============================================================================

const SUPABASE_URL = "https://cddgkhkzcnyzzcllgzoz.supabase.co";
const SITE = "https://condominiosnapraia.com.br";
const OG_FALLBACK = `${SITE}/img/og-home.jpg`;

// Detecta se quem acessa é um robô de pré-visualização (não um humano)
function isCrawler(ua = "") {
  return /facebookexternalhit|Facebot|WhatsApp|Twitterbot|TelegramBot|LinkedInBot|Slackbot|Discordbot|Pinterest|Googlebot|bingbot|redditbot/i.test(ua);
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Reescreve URL de foto do Supabase para o domínio do site (proxy /cdn-fotos/)
function fotoPublica(u) {
  if (!u) return "";
  const marker = "/storage/v1/object/public/";
  const i = u.indexOf(marker);
  if (i !== -1) return `${SITE}/cdn-fotos/` + u.slice(i + marker.length);
  return u;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const ua = request.headers.get("user-agent") || "";

  // Pega o HTML original da página /imovel (o arquivo estático)
  const response = await next();

  if (!id) return response;

  // Busca o imóvel para canonicalizar a URL antiga e, para crawlers, enriquecer a prévia.
  let im = null;
  try {
    const key = env.SUPABASE_ANON_KEY;
    const q = `${SUPABASE_URL}/rest/v1/imoveis?or=(codigo.eq.${encodeURIComponent(id)},slug.eq.${encodeURIComponent(id)},id.eq.${encodeURIComponent(id)})&select=*&limit=1`;
    const r = await fetch(q, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (r.ok) {
      const arr = await r.json();
      im = arr && arr[0];
    }
  } catch (e) {
    // se falhar, segue com o HTML original
  }

  if (!im) return response;
  if (im.slug && String(id) !== String(im.slug)) {
    return Response.redirect(`${SITE}/imovel/${encodeURIComponent(im.slug)}/`, 301);
  }
  if (!isCrawler(ua)) return response;

  // PRIVACIDADE: remove identificadores internos (unidade, torre, quadra, lote, box)
  // da descrição antes de qualquer uso público (og:description, etc.)
  function limparInternos(txt){
    if(!txt) return txt;
    var d = String(txt);
    d = d.replace(/[,;.\s]*\b(localizad[oa]s?\s+)?(n[oa]s?|d[oa]s?|em)?\s*\b(unidade|torre|quadra|lote|box|apto\.?|apartamento\s+n[ºo°]?)\s*[:nº°o]*\s*[\w-]+/gi, '');
    d = d.replace(/\s*[·|]\s*(?=[·|]|$)/g,' ').replace(/\s{2,}/g,' ').replace(/^[\s·|,;.-]+|[\s·|,;.-]+$/g,'').trim();
    return d;
  }
  if (im.descricao) im.descricao = limparInternos(im.descricao);

  // Monta os valores das tags
  const titulo = im.titulo || "Imóvel à venda";
  const cidade = im.cidade ? ` — ${im.cidade}` : "";
  const ogTitle = `${titulo}${cidade}`;
  const ogDesc = (im.descricao
    ? String(im.descricao).slice(0, 160)
    : `${titulo} no Litoral Norte Gaúcho. Confira fotos, valor e detalhes.`);

  let fotos = im.fotos_no_site || im.fotos || [];
  if (typeof fotos === "string") { try { fotos = JSON.parse(fotos); } catch { fotos = [fotos]; } }
  const ogImage = Array.isArray(fotos) && fotos.length ? fotoPublica(fotos[0]) : OG_FALLBACK;
  const ogUrl = `${SITE}/imovel?id=${encodeURIComponent(id)}`;

  // Usa HTMLRewriter para trocar as tags no HTML entregue
  return new HTMLRewriter()
    .on('meta[property="og:title"]', { element(e) { e.setAttribute("content", ogTitle); } })
    .on('meta[property="og:description"]', { element(e) { e.setAttribute("content", ogDesc); } })
    .on('meta[property="og:url"]', { element(e) { e.setAttribute("content", ogUrl); } })
    .on('meta[property="og:type"]', { element(e) { e.setAttribute("content", "product"); } })
    .on('meta[name="twitter:title"]', { element(e) { e.setAttribute("content", ogTitle); } })
    .on('meta[name="twitter:description"]', { element(e) { e.setAttribute("content", ogDesc); } })
    .on("title", { element(e) { e.setInnerContent(`${ogTitle} | Condomínios na Praia`); } })
    // og:image e twitter:image podem não existir no HTML — garantimos via <head>
    .on("head", {
      element(e) {
        e.append(
          `\n<meta property="og:image" content="${esc(ogImage)}">` +
          `\n<meta property="og:image:width" content="1200">` +
          `\n<meta property="og:image:height" content="900">` +
          `\n<meta name="twitter:image" content="${esc(ogImage)}">` +
          `\n<meta name="twitter:card" content="summary_large_image">`,
          { html: true }
        );
      },
    })
    .transform(response);
}
