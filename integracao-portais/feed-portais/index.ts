// ============================================================================
// Edge Function: feed-portais
// Gera o feed XML no padrão VRSync (Grupo OLX/ZAP/VivaReal/ImovelWeb)
// com os imóveis marcados como integrar_portais = true.
//
// COMO USAR:
//   1. supabase functions deploy feed-portais --no-verify-jwt
//   2. A URL pública será:
//      https://<SEU-PROJETO>.supabase.co/functions/v1/feed-portais
//      (ou use um domínio próprio via proxy: condominiosnapraia.com.br/feed-portais.xml)
//   3. Cole essa URL no Canal Pro do Grupo OLX.
//
// O portal lê este XML a cada ~12h e publica/atualiza/remove os anúncios.
// ============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---- CONFIG: ajuste estes dados da sua imobiliária -------------------------
const SITE_URL = "https://condominiosnapraia.com.br";
const CONTATO = {
  provider: "Condomínios na Praia",
  email: "contato@condominiosnapraia.com.br",
  contactName: "Felipe",
  telephone: "51-99944-2252",
  name: "Condomínios na Praia",
  website: SITE_URL,
};
// URL base pública das fotos (o proxy do seu site). As fotos DEVEM ser
// acessíveis publicamente pelos portais.
const FOTOS_BASE = `${SITE_URL}/cdn-fotos/`;
// ----------------------------------------------------------------------------

// Mapa: tipo do CRM -> PropertyType do VRSync
const TIPO_MAP: Record<string, { usage: string; property: string }> = {
  "Casa":        { usage: "Residential", property: "Residential / Home" },
  "Casa Térrea": { usage: "Residential", property: "Residential / Home" },
  "Sobrado":     { usage: "Residential", property: "Residential / Home" },
  "Apartamento": { usage: "Residential", property: "Residential / Apartment" },
  "Cobertura":   { usage: "Residential", property: "Residential / Penthouse" },
  "Terreno":     { usage: "Residential", property: "Residential / Land Lot" },
  "Lote":        { usage: "Residential", property: "Residential / Land Lot" },
};

// Escapa caracteres especiais de XML em campos simples
function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Normaliza a URL de uma foto (aceita caminho relativo ou URL completa)
function fotoUrl(f: string): string {
  if (!f) return "";
  if (f.startsWith("http")) return f;
  return FOTOS_BASE + f.replace(/^\/+/, "");
}

// Extrai a lista de fotos de um imóvel (campo pode ser array ou JSON string)
function getFotos(im: Record<string, unknown>): string[] {
  let arr = im.fotos_no_site ?? im.fotos ?? [];
  if (typeof arr === "string") {
    try { arr = JSON.parse(arr); } catch { arr = [arr]; }
  }
  if (!Array.isArray(arr)) arr = [];
  return (arr as unknown[]).map((x) => fotoUrl(String(x))).filter(Boolean).slice(0, 50);
}

function buildListing(im: Record<string, any>): string {
  const tipo = TIPO_MAP[im.tipo] ?? { usage: "Residential", property: "Residential / Home" };
  const fotos = getFotos(im);
  const media = fotos
    .map((u, i) =>
      `      <Item medium="image" caption="foto${i + 1}"${i === 0 ? ' primary="true"' : ""}>${esc(u)}</Item>`
    )
    .join("\n");

  const id = im.codigo || im.slug || im.id;
  const detailUrl = `${SITE_URL}/imovel?id=${encodeURIComponent(id)}`;
  const preco = Number(im.preco) || 0;
  const area = Number(im.area_construida || im.areaConstruida || im.area) || 0;
  const areaTerreno = Number(im.area || im.area_privativa || im.areaPrivativa) || 0;

  // linhas opcionais só entram se houver valor
  const opt = (cond: boolean, xml: string) => (cond ? xml + "\n" : "");

  return `    <Listing>
      <ListingID>${esc(id)}</ListingID>
      <Title>${esc(im.titulo || "Imóvel à venda")}</Title>
      <TransactionType>For Sale</TransactionType>
      <PublicationType>STANDARD</PublicationType>
      <DetailViewUrl>${esc(detailUrl)}</DetailViewUrl>
      <Media>
${media}
      </Media>
      <Details>
          <UsageType>${tipo.usage}</UsageType>
          <PropertyType>${tipo.property}</PropertyType>
          <Description><![CDATA[${im.descricao || im.titulo || ""}]]></Description>
          <ListPrice currency="BRL">${preco}</ListPrice>
${opt(area > 0, `          <LivingArea unit="square metres">${area}</LivingArea>`)}${opt(areaTerreno > 0, `          <LotArea unit="square metres">${areaTerreno}</LotArea>`)}${opt(!!im.quartos, `          <Bedrooms>${Number(im.quartos) || 0}</Bedrooms>`)}${opt(!!im.suites, `          <Suites>${Number(im.suites) || 0}</Suites>`)}${opt(!!im.vagas, `          <Garage type="Parking Space">${Number(im.vagas) || 0}</Garage>`)}      </Details>
      <Location displayAddress="Neighborhood">
          <Country abbreviation="BR">Brasil</Country>
          <State abbreviation="RS">Rio Grande do Sul</State>
          <City>${esc(im.cidade || "Capão da Canoa")}</City>
${opt(!!im.bairro, `          <Neighborhood>${esc(im.bairro)}</Neighborhood>`)}      </Location>
      <ContactInfo>
          <Name>${esc(CONTATO.name)}</Name>
          <Email>${esc(CONTATO.email)}</Email>
          <Website>${esc(CONTATO.website)}</Website>
          <Telephone>${esc(CONTATO.telephone)}</Telephone>
      </ContactInfo>
    </Listing>`;
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Busca apenas os imóveis marcados para integração e disponíveis
  const { data: imoveis, error } = await supabase
    .from("imoveis")
    .select("*")
    .eq("integrar_portais", true)
    .eq("status", "Disponível");

  if (error) {
    return new Response(`Erro: ${error.message}`, { status: 500 });
  }

  const listings = (imoveis ?? []).map(buildListing).join("\n");
  const now = new Date().toISOString().slice(0, 19);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ListingDataFeed xmlns="http://www.vivareal.com/schemas/1.0/VRSync"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xsi:schemaLocation="http://www.vivareal.com/schemas/1.0/VRSync http://xml.vivareal.com/vrsync.xsd">
   <Header>
       <Provider>${esc(CONTATO.provider)}</Provider>
       <Email>${esc(CONTATO.email)}</Email>
       <ContactName>${esc(CONTATO.contactName)}</ContactName>
       <PublishDate>${now}</PublishDate>
       <Telephone>${esc(CONTATO.telephone)}</Telephone>
   </Header>
   <Listings>
${listings}
   </Listings>
</ListingDataFeed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
