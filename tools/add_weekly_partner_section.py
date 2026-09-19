from pathlib import Path

files = [Path('functions/parceiro/[slug].js'), Path('functions/parceiro-feed/[slug].js')]
css = '''
<style id="partner-week-properties">
#sec-imoveis-semana{margin:34px 0 12px;padding:38px 28px 34px;border:1px solid rgba(183,123,63,.2);border-radius:26px;background:linear-gradient(135deg,#f8f3eb 0%,#eef5f2 100%);scroll-margin-top:90px}
#sec-imoveis-semana .section-head{margin-bottom:20px}#sec-imoveis-semana .eyebrow{color:#b77b3f}#sec-imoveis-semana .section-head h2{font-size:clamp(28px,4vw,44px)}#sec-imoveis-semana .section-head h2 small{color:#b77b3f}
#sec-imoveis-semana .property-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}#sec-imoveis-semana .property-card{box-shadow:0 12px 28px rgba(23,49,58,.08);border-color:rgba(183,123,63,.16);transition:transform .2s ease,box-shadow .2s ease}#sec-imoveis-semana .property-card:hover{transform:translateY(-4px);box-shadow:0 18px 34px rgba(23,49,58,.14)}#sec-imoveis-semana .property-body h3{font-size:16px;line-height:1.16}
@media(max-width:1050px){#sec-imoveis-semana .property-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:700px){#sec-imoveis-semana{margin:26px 0 8px;padding:28px 16px 25px;border-radius:20px}#sec-imoveis-semana .property-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}#sec-imoveis-semana .property-body h3{font-size:14px}}@media(max-width:430px){#sec-imoveis-semana .property-grid{grid-template-columns:1fr}}
</style>
'''

for path in files:
    text = path.read_text()
    if 'partner-week-properties' not in text:
        text = text.replace('</head>', css + '</head>', 1)
    # Preserve the source creation timestamp on normalized properties.
    old = "    broker: imovel.corretor || '',\n    condo:"
    new = "    broker: imovel.corretor || '',\n    createdAt: imovel.created_at || row.created_at || row.updated_at || '',\n    condo:"
    if old in text and 'createdAt: imovel.created_at' not in text:
        text = text.replace(old, new, 1)
    # Add weekly section after the category navigation and before category sections.
    needle = "  const sectionMarkup = SECTIONS.map((section, index) => {"
    weekly = '''  const weeklyLimit = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const weeklyProperties = properties.filter((property) => {
    if (property.status && property.status !== 'disponível') return false;
    const created = Date.parse(property.createdAt || '');
    return Number.isFinite(created) && created >= weeklyLimit && created <= Date.now();
  }).sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0)).slice(0, 12);
  const weeklySection = `<section class="property-section" id="sec-imoveis-semana"><div class="section-head"><div><span class="eyebrow">Novidades no catálogo</span><h2>Imóveis da Semana<small>Entraram nos últimos 7 dias</small></h2></div><a class="section-more-btn" href="${fullListingUrl}">Ver todos <span aria-hidden="true">→</span></a></div>${weeklyProperties.length ? `<div class="property-grid">${weeklyProperties.map((item) => card(item, false, wpp, name)).join('')}</div>` : `<div class="empty">Novos imóveis serão exibidos aqui assim que entrarem no catálogo.</div>`}<div class="section-more"><a class="section-more-btn" href="${fullListingUrl}">Ver todos os imóveis<span aria-hidden="true">→</span></a></div></section>`;
'''
    if 'const weeklySection =' not in text:
        if needle not in text: raise SystemExit(f'section marker not found in {path}')
        text = text.replace(needle, weekly + needle, 1)
    # Insert the new section immediately after category navigation in the main content.
    old_main = '${categoryNav}<section id="imoveis" class="property-sections">${sectionMarkup}</section>'
    new_main = '${categoryNav}${weeklySection}<section id="imoveis" class="property-sections">${sectionMarkup}</section>'
    if old_main in text:
        text = text.replace(old_main, new_main, 1)
    path.write_text(text)
    print(path)
