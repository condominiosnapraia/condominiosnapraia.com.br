from pathlib import Path

files=[Path('functions/parceiro/[slug].js'),Path('functions/parceiro-feed/[slug].js')]
old='''  const weeklyLimit = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const weeklyProperties = properties.filter((property) => {
    if (property.status && property.status !== 'disponível') return false;
    const created = Date.parse(property.createdAt || '');
    return Number.isFinite(created) && created >= weeklyLimit && created <= Date.now();
  }).sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0)).slice(0, 12);
  const weeklySection = `<section class="property-section" id="sec-imoveis-semana"><div class="section-head"><div><span class="eyebrow">Novidades no catálogo</span><h2>Imóveis da Semana<small>Entraram nos últimos 7 dias</small></h2></div><a class="section-more-btn" href="${fullListingUrl}">Ver todos <span aria-hidden="true">→</span></a></div>${weeklyProperties.length ? `<div class="property-grid">${weeklyProperties.map((item) => card(item, false, wpp, name)).join('')}</div>` : `<div class="empty">Novos imóveis serão exibidos aqui assim que entrarem no catálogo.</div>`}<div class="section-more"><a class="section-more-btn" href="${fullListingUrl}">Ver todos os imóveis<span aria-hidden="true">→</span></a></div></section>`;'''
new='''  // Mantém o nome “Imóveis da Semana”, mas mostra os 12 imóveis
  // cadastrados mais recentemente na carteira publicada do corretor.
  const weeklyProperties = properties.filter((property) => {
    return property && property.status !== 'vendido';
  }).sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0)).slice(0, 12);
  const weeklySection = `<section class="property-section" id="sec-imoveis-semana"><div class="section-head"><div><span class="eyebrow">Novidades no catálogo</span><h2>Imóveis da Semana<small>Os últimos imóveis cadastrados</small></h2></div><a class="section-more-btn" href="${fullListingUrl}">Ver todos <span aria-hidden="true">→</span></a></div>${weeklyProperties.length ? `<div class="property-grid">${weeklyProperties.map((item) => card(item, false, wpp, name)).join('')}</div>` : `<div class="empty">Novos imóveis serão exibidos aqui assim que entrarem no catálogo.</div>`}<div class="section-more"><a class="section-more-btn" href="${fullListingUrl}">Ver todos os imóveis<span aria-hidden="true">→</span></a></div></section>`;'''
for p in files:
    t=p.read_text()
    if old not in t:
        raise SystemExit(f'bloco antigo não encontrado em {p}')
    p.write_text(t.replace(old,new,1))
    print(p)
