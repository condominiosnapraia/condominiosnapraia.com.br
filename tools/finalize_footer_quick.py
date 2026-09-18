from pathlib import Path

# Full property listing has a compact footer without quick links.
p = Path('functions/parceiro/[slug]/imoveis.js')
t = p.read_text()
marker = '<div class="footer-col"><div class="footer-title">Informações</div>'
quick = '<div class="footer-col"><div class="footer-title">Acesso rápido</div><div class="footer-quick-links"><a href="${landingUrl}condominios/">Condomínios</a><a href="${canonical}?cat=casa-condominio">Casas e sobrados</a><a href="${canonical}?cat=terreno-condominio">Lotes e terrenos</a><a href="${canonical}?cat=apartamento">Apartamentos</a></div></div>'
if '<div class="footer-title">Acesso rápido</div>' not in t:
    if marker not in t: raise SystemExit('listing info marker missing')
    t = t.replace(marker, quick + marker, 1)
p.write_text(t)

# Condominium index gets the same four-column footer structure.
p = Path('functions/parceiro/[slug]/condominios.js')
t = p.read_text()
start = t.find('<footer>')
end = t.find('</footer>', start)
if start < 0 or end < 0: raise SystemExit('condos footer missing')
footer = '<footer><div class="footer-inner"><div class="footer-grid"><div><div class="footer-brand">${esc(name)}</div><p class="footer-copy">Condomínios selecionados e oportunidades imobiliárias para encontrar seu próximo imóvel.</p><a class="footer-wpp" href="${esc(wpp)}" target="_blank" rel="noopener nofollow">Falar pelo WhatsApp</a></div><div class="footer-col"><div class="footer-title">Navegação</div><a href="${landingUrl}">Início do corretor</a><a href="${fullListingUrl}">Todos os imóveis</a><a href="${contactUrl}">Contato</a><a href="${BASE}/">Portal Condomínios na Praia</a></div><div class="footer-col"><div class="footer-title">Acesso rápido</div><div class="footer-quick-links"><a href="${fullListingUrl}">Todos os imóveis</a><a href="${fullListingUrl}?cat=casa-condominio">Casas e sobrados</a><a href="${fullListingUrl}?cat=terreno-condominio">Lotes e terrenos</a><a href="${fullListingUrl}?cat=apartamento">Apartamentos</a></div></div><div class="footer-col"><div class="footer-title">Informações</div>${site.creci ? `<span class="footer-info-creci">CRECI ${esc(site.creci)}</span>` : ''}<a href="${BASE}/politica-privacidade/">Política de Privacidade</a><a href="${BASE}/termos/">Termos de Uso</a></div></div><div class="footer-bottom"><span>© 2026 ${esc(name)} · Site parceiro Condomínios na Praia</span><span>Rio Grande do Sul · Brasil</span></div></div></footer>'
t = t[:start] + footer + t[end+len('</footer>'):]
p.write_text(t)
print('updated listing and condominium index')
