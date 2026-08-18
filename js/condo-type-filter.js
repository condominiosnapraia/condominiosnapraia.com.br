(function () {
  'use strict';

  var headings = Array.prototype.slice.call(document.querySelectorAll('.cond-conteudo-full h2'));
  var heading = headings.find(function (item) {
    return /^Imóveis à venda no/i.test((item.textContent || '').trim());
  });
  if (!heading) return;

  var grid = heading.nextElementSibling;
  if (grid && grid.classList.contains('cond-type-filter-static')) grid = grid.nextElementSibling;
  if (!grid || !grid.matches('div[style*="display:grid"]')) return;
  if (grid.previousElementSibling && grid.previousElementSibling.classList.contains('cond-type-filter-static')) return;

  var cards = Array.prototype.slice.call(grid.children).filter(function (item) {
    return item.tagName === 'A';
  });
  if (!cards.length) return;

  function typeFromCard(card) {
    var text = (card.textContent || '').replace(/\s+/g, ' ').trim();
    if (/\bapartamento\b/i.test(text)) return 'Apartamento';
    if (/\bsobrado\b/i.test(text)) return 'Sobrado';
    if (/\bterreno\b|\blote\b/i.test(text)) return 'Terreno';
    if (/\bcasa\b/i.test(text)) return 'Casa';
    return 'Imóvel';
  }

  var types = [];
  cards.forEach(function (card) {
    var type = typeFromCard(card);
    card.setAttribute('data-condo-type-card', '1');
    card.setAttribute('data-condo-type', type);
    if (types.indexOf(type) === -1) types.push(type);
  });
  types.sort(function (a, b) { return a.localeCompare(b, 'pt-BR'); });

  var wrap = document.createElement('div');
  wrap.className = 'cond-type-filter-static';
  wrap.innerHTML = '<label>Filtrar por tipo</label><select aria-label="Filtrar imóveis por tipo"><option value="">Todos os tipos</option>' +
    types.map(function (type) { return '<option value="' + type.replace(/"/g, '&quot;') + '">' + type + '</option>'; }).join('') +
    '</select>';
  var select = wrap.querySelector('select');
  select.addEventListener('change', function () {
    var value = select.value;
    cards.forEach(function (card) {
      card.hidden = !!value && card.getAttribute('data-condo-type') !== value;
    });
  });
  heading.insertAdjacentElement('afterend', wrap);

  if (!document.getElementById('cond-type-filter-shared-style')) {
    var style = document.createElement('style');
    style.id = 'cond-type-filter-shared-style';
    style.textContent = '.cond-type-filter-static{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:0 0 16px;padding:12px 14px;background:rgba(247,241,232,.58);border:1px solid rgba(184,147,90,.22);border-radius:10px}.cond-type-filter-static label{font:600 10px/1.2 Outfit,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#5b7585}.cond-type-filter-static select{min-width:190px;border:1px solid rgba(31,181,196,.24);border-radius:8px;background:#fff;color:#0d3b54;font:500 13px Outfit,sans-serif;padding:9px 12px;outline:none}.cond-type-filter-static select:focus{border-color:#0e8a99;box-shadow:0 0 0 3px rgba(31,181,196,.12)}@media(max-width:600px){.cond-type-filter-static{align-items:stretch;flex-direction:column;gap:6px}.cond-type-filter-static select{width:100%;min-width:0}}';
    document.head.appendChild(style);
  }
})();
