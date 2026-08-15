// ============================================================================
// Cloudflare Pages Function: /condominio
// Injeta as meta tags Open Graph (foto, título, descrição) quando o link de um
// condomínio é compartilhado — para WhatsApp/Facebook/etc. mostrarem a prévia
// correta com a foto do condomínio.
//
// Mesma lógica de functions/imovel.js, adaptada à tabela `condominios`.
//
// Onde colocar:  /functions/condominio.js  (raiz do projeto Cloudflare Pages)
// Requer a variável de ambiente:  SUPABASE_ANON_KEY
// ============================================================================

const SUPABASE_URL = "https://cddgkhkzcnyzzcllgzoz.supabase.co";
const SITE = "https://condominiosnapraia.com.br";
const OG_FALLBACK = `${SITE}/img/og-home.jpg`;

function isCrawler(ua = "") {
  return /facebookexternalhit|Facebot|WhatsApp|Twitterbot|TelegramBot|LinkedInBot|Slackbot|Discordbot|Pinterest|Googlebot|bingbot|redditbot/i.test(ua);
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

  const response = await next();

  if (!id || !isCrawler(ua)) return response;

  let cond = null;
  try {
    const key = env.SUPABASE_ANON_KEY;
    const q = `${SUPABASE_URL}/rest/v1/condominios?or=(slug.eq.${encodeURIComponent(id)},id.eq.${encodeURIComponent(id)})&select=id,slug,nome,cidade,descricao,fotos_no_site,fotos&limit=1`;
    const r = await fetch(q, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (r.ok) { const arr = await r.json(); cond = arr && arr[0]; }
  } catch (e) { /* segue com HTML original */ }

  if (!cond) return response;

  const nome = cond.nome || "Condomínio";
  const cidade = cond.cidade ? ` — ${cond.cidade}` : "";
  const ogTitle = `${nome}${cidade}`;
  const ogDesc = (cond.descricao
    ? String(cond.descricao).slice(0, 160)
    : `${nome} no Litoral Norte Gaúcho. Conheça a estrutura, as fotos e os imóveis disponíveis.`);

  let fotos = cond.fotos_no_site || cond.fotos || [];
  if (typeof fotos === "string") { try { fotos = JSON.parse(fotos); } catch { fotos = [fotos]; } }
  const ogImage = Array.isArray(fotos) && fotos.length ? fotoPublica(fotos[0]) : OG_FALLBACK;
  const ogUrl = `${SITE}/condominio?id=${encodeURIComponent(id)}`;

  return new HTMLRewriter()
    .on('meta[property="og:title"]', { element(e) { e.setAttribute("content", ogTitle); } })
    .on('meta[property="og:description"]', { element(e) { e.setAttribute("content", ogDesc); } })
    .on('meta[property="og:url"]', { element(e) { e.setAttribute("content", ogUrl); } })
    .on('meta[property="og:image"]', { element(e) { e.setAttribute("content", ogImage); } })
    .on('meta[property="og:type"]', { element(e) { e.setAttribute("content", "website"); } })
    .on('meta[name="twitter:title"]', { element(e) { e.setAttribute("content", ogTitle); } })
    .on('meta[name="twitter:description"]', { element(e) { e.setAttribute("content", ogDesc); } })
    .on('meta[name="twitter:image"]', { element(e) { e.setAttribute("content", ogImage); } })
    .on("title", { element(e) { e.setInnerContent(`${ogTitle} | Condomínios na Praia`); } })
    // garante twitter:card e reforça og:image caso alguma tag falte no HTML
    .on("head", {
      element(e) {
        e.append(
          `\n<meta name="twitter:card" content="summary_large_image">`,
          { html: true }
        );
      },
    })
    .transform(response);
}
