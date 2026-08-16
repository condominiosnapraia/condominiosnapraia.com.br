from pathlib import Path
import re

PAGE = Path('/home/ubuntu/wt_supabase_queries/imoveis-de-luxo/index.html')

MARKUP = '''\n<div class="luxo-filter-panel" aria-label="Filtros avançados de imóveis de luxo">
  <div class="luxo-filter-head"><div><div class="luxo-section-kicker">Refine sua busca</div><h2>Encontre o imóvel ideal</h2></div><button class="luxo-filter-clear" id="luxo-clear" type="button">Limpar filtros</button></div>
  <div class="luxo-filter-grid">
    <label class="luxo-filter-field"><span>Preço mínimo</span><select id="luxo-min"><option value="5000000">A partir de R$ 5 milhões</option><option value="6000000">A partir de R$ 6 milhões</option><option value="7000000">A partir de R$ 7 milhões</option><option value="8000000">A partir de R$ 8 milhões</option><option value="10000000">A partir de R$ 10 milhões</option></select></label>
    <label class="luxo-filter-field"><span>Preço máximo</span><select id="luxo-max"><option value="">Sem limite máximo</option><option value="6000000">Até R$ 6 milhões</option><option value="7000000">Até R$ 7 milhões</option><option value="8000000">Até R$ 8 milhões</option><option value="10000000">Até R$ 10 milhões</option><option value="15000000">Até R$ 15 milhões</option></select></label>
    <label class="luxo-filter-field"><span>Número de suítes</span><select id="luxo-suites"><option value="">Qualquer quantidade</option><option value="4">4 ou mais suítes</option><option value="5">5 ou mais suítes</option><option value="6">6 ou mais suítes</option><option value="7">7 ou mais suítes</option></select></label>
    <label class="luxo-filter-field"><span>Tipo de imóvel</span><select id="luxo-tipo"><option value="">Casas e sobrados</option><option value="Casa">Casas</option><option value="Sobrado">Sobrados</option></select></label>
  </div>
  <p class="luxo-filter-summary" id="luxo-filter-summary" aria-live="polite">Carregando opções...</p>
</div>\n'''

CSS = '''\n.luxo-filter-panel{margin:26px 0 28px;padding:22px;border:1px solid #e5ded3;border-radius:16px;background:#fffdf8;box-shadow:0 6px 18px rgba(13,59,84,.05)}
.luxo-filter-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:18px}.luxo-filter-head h2{font-family:'Fraunces',serif;color:#0d3b54;font-size:24px;margin:0}.luxo-filter-clear{border:1px solid #b9c8c7;border-radius:999px;padding:9px 14px;background:#fff;color:#0d3b54;font-weight:700;cursor:pointer}.luxo-filter-clear:hover{border-color:#d9a83f;background:#f7eedf}.luxo-filter-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.luxo-filter-field{display:flex;flex-direction:column;gap:7px;color:#536873;font-size:12px;font-weight:700}.luxo-filter-field select{width:100%;min-height:44px;padding:0 12px;border:1px solid #cbd8d7;border-radius:10px;background:#fff;color:#0d3b54;font:inherit;font-weight:500}.luxo-filter-summary{margin:16px 0 0;color:#6d7d84;font-size:13px}.luxo-filter-summary strong{color:#0d3b54}@media(max-width:800px){.luxo-filter-grid{grid-template-columns:1fr 1fr}}@media(max-width:480px){.luxo-filter-panel{padding:16px}.luxo-filter-head{display:block}.luxo-filter-clear{margin-top:12px}.luxo-filter-grid{grid-template-columns:1fr}}
'''

JS = '''  var ALL_DATA=[];
  function baseElegivel(i){var tipo=String(i.tipo||'').toLowerCase();return i.publicar!==false && i.status!=='Vendido' && Number(i.preco||0)>=MIN_LUXO && /(casa|sobrado)/.test(tipo) && !/(lote|terreno|apartamento)/.test(tipo);}
  function filtroAtual(){return {min:Number(document.getElementById('luxo-min').value||MIN_LUXO),max:Number(document.getElementById('luxo-max').value||0),suites:Number(document.getElementById('luxo-suites').value||0),tipo:String(document.getElementById('luxo-tipo').value||'').toLowerCase()};}
  function render(){var f=filtroAtual();var lista=ALL_DATA.filter(function(i){var tipo=String(i.tipo||'').toLowerCase();var preco=Number(i.preco||0);var suites=Number(i.suites||0);if(preco<f.min)return false;if(f.max&&preco>f.max)return false;if(f.suites&&suites<f.suites)return false;if(f.tipo&&tipo.indexOf(f.tipo)<0)return false;return true;}).sort(function(a,b){return Number(b.preco||0)-Number(a.preco||0);}).slice(0,24);var g=document.getElementById('grid-luxo');var summary=document.getElementById('luxo-filter-summary');if(summary)summary.innerHTML='<strong>'+lista.length+'</strong> imóvel(is) encontrado(s) com os filtros selecionados.';if(g)g.innerHTML=lista.length?lista.map(card).join(''):'<div class="empty" style="grid-column:1/-1"><div class="empty-ico">⌕</div><p>Nenhum imóvel corresponde a esses filtros.</p><button class="luxo-filter-clear" type="button" onclick="document.getElementById(\'luxo-clear\').click()">Limpar filtros</button></div>';}
  function setupFilters(){['luxo-min','luxo-max','luxo-suites','luxo-tipo'].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener('change',render);});var clear=document.getElementById('luxo-clear');if(clear)clear.addEventListener('click',function(){document.getElementById('luxo-min').value='5000000';document.getElementById('luxo-max').value='';document.getElementById('luxo-suites').value='';document.getElementById('luxo-tipo').value='';render();});render();}
'''

text = PAGE.read_text(encoding='utf-8')
if 'id="luxo-filter-panel"' not in text and 'class="luxo-filter-panel"' not in text:
    text = text.replace('    <div class="igrid" id="grid-luxo"', MARKUP + '    <div class="igrid" id="grid-luxo"', 1)
if 'luxo-filter-panel{' not in text:
    text = text.replace('</style>', CSS + '</style>', 1)
text = text.replace('  function render(data){var lista=(Array.isArray(data)?data:[]).filter(function(i){return i.publicar!==false && i.status!==\'Vendido\' && elegivel(i);}).sort(function(a,b){return Number(b.preco||0)-Number(a.preco||0);}).slice(0,24);if(!lista.length)lista=FALLBACK;var g=document.getElementById(\'grid-luxo\');if(g)g.innerHTML=lista.map(card).join(\'\');}\n  fetch(SB+\'/rest/v1/imoveis?status=neq.Vendido&publicar=eq.true&preco=gte.5000000&select=id,slug,codigo,titulo,status,publicar,tipo,preco,quartos,suites,vagas,area,area_privativa,area_construida,fotos_no_site&order=preco.desc&limit=100\',{headers:{apikey:KEY,Authorization:\'Bearer \'+KEY}}).then(function(r){return r.json();}).then(render).catch(function(){render(FALLBACK);});', '  ' + JS + '  fetch(SB+\'/rest/v1/imoveis?status=neq.Vendido&publicar=eq.true&preco=gte.5000000&select=id,slug,codigo,titulo,status,publicar,tipo,preco,quartos,suites,vagas,area,area_privativa,area_construida,fotos_no_site&order=preco.desc&limit=100\',{headers:{apikey:KEY,Authorization:\'Bearer \'+KEY}}).then(function(r){return r.json();}).then(function(data){ALL_DATA=(Array.isArray(data)&&data.length?data:FALLBACK).filter(baseElegivel);setupFilters();}).catch(function(){ALL_DATA=FALLBACK.filter(baseElegivel);setupFilters();});', 1)
PAGE.write_text(text, encoding='utf-8')
print('filters added')
