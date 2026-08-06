<!-- ═══════════════════════════════════════════════════════════════
  SCHEMA DE AVALIAÇÕES (Review + AggregateRating)
  → É ISTO que gera as ⭐ estrelinhas no Google.

  COMO USAR (quando tiver avaliações REAIS):
  1. Preencha o array "review" abaixo — 1 objeto por avaliação real.
  2. Ajuste "ratingValue" (média) e "reviewCount" para BATER com os cards
     exibidos na seção visual (_secao-avaliacoes.html).
  3. Cole este bloco <script> no <head> da home (index.html).
  4. Teste em: https://search.google.com/test/rich-results

  ⚠️ REGRAS (senão o Google penaliza):
  - Só avaliações reais. Nome, nota e texto verdadeiros.
  - A média e a quantidade do schema = a média e quantidade exibidas na página.
  - As avaliações do schema precisam estar VISÍVEIS na página.
═══════════════════════════════════════════════════════════════ -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Condomínios na Praia",
  "image": "https://condominiosnapraia.com.br/img/og-home.jpg",
  "url": "https://condominiosnapraia.com.br",
  "telephone": "+55-51-99944-2252",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Central, 248 - Atlântida",
    "addressLocality": "Xangri-lá",
    "addressRegion": "RS",
    "postalCode": "95588-000",
    "addressCountry": "BR"
  },
  "areaServed": ["Xangri-lá", "Capão da Canoa", "Osório", "Maquiné", "Curumim"],

  "//": "── PREENCHER com avaliações REAIS. Remova este comentário. ──",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "0",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "NOME REAL DO CLIENTE" },
      "datePublished": "2026-01-15",
      "reviewBody": "TEXTO REAL DA AVALIAÇÃO.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
      }
    }
  ]
}
</script>

<!--
  DICA: quando tiver a lista de avaliações reais, me mande assim que eu
  preencho, valido no Rich Results Test e devolvo pronto:

  Nome | Cidade | Nota (1-5) | Texto | Data (aaaa-mm-dd) | Fonte (Google/WhatsApp)
-->
