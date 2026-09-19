from pathlib import Path

path = Path('index.html')
text = path.read_text()

css = '''
<style id="home-week-properties">
#sec-imoveis-semana{background:linear-gradient(135deg,#f8f3eb 0%,#eef5f2 100%);--wave-from:#fffefb}
#sec-imoveis-semana .dest-header{align-items:end}
#sec-imoveis-semana .week-kicker{color:#b77b3f}
#home-week-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
#home-week-grid .icard{box-shadow:0 12px 28px rgba(23,49,58,.08);border-color:rgba(183,123,63,.16);transition:transform .2s ease,box-shadow .2s ease}
#home-week-grid .icard:hover{transform:translateY(-4px);box-shadow:0 18px 34px rgba(23,49,58,.14)}
#home-week-grid .icard-title{font-size:16px;line-height:1.16}
.week-empty{grid-column:1/-1;padding:36px 24px;text-align:center;border:1px dashed rgba(183,123,63,.35);border-radius:16px;background:rgba(255,255,255,.55);color:#687b7c}
@media(max-width:1050px){#home-week-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:700px){#home-week-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}#home-week-grid .icard-title{font-size:14px}}
@media(max-width:430px){#home-week-grid{grid-template-columns:1fr}}
</style>
'''
if 'home-week-properties' not in text:
    text = text.replace('</head>', css + '</head>', 1)

section = '''
<!-- ══ IMÓVEIS DA SEMANA ══ -->
<section class="dest-section sec-onda" id="sec-imoveis-semana">
  <div class="dest-inner">
    <div class="dest-header">
      <div>
        <p class="eyebrow week-kicker">Novidades no catálogo</p>
        <h2 class="sectit sectit-stacked"><span class="sectit-main">Imóveis da Semana</span><span class="sectit-sub">Entraram nos últimos 7 dias</span></h2>
      </div>
      <a class="dest-ver-btn" href="/imoveis/">Ver todos</a>
    </div>
    <div class="igrid" id="home-week-grid" style="min-height:180px"></div>
    <div class="dest-ver-all"><a class="dest-btn-all cta-section-all" href="/imoveis/">Ver todos os imóveis <svg fill="none" height="16" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" width="16"><path d="M5 12h14M12 5l7 7-7 7"></path></svg></a></div>
  </div>
</section>
'''
if 'id="sec-imoveis-semana"' not in text:
    anchor = '<!-- ══ DESTAQUES CASAS & SOBRADOS ══ -->'
    if anchor not in text: raise SystemExit('home section anchor not found')
    text = text.replace(anchor, section + anchor, 1)

fn = '''
function renderImoveisDaSemana(lista){
  const grid=document.getElementById('home-week-grid');
  if(!grid)return;
  const agora=Date.now();
  const limite=agora-(7*24*60*60*1000);
  const recentes=(Array.isArray(lista)?lista:[]).filter(i=>{
    if(!i || i.publicar===false || i.status!=='Disponível')return false;
    const criado=Date.parse(i.created_at||'');
    return Number.isFinite(criado) && criado>=limite && criado<=agora;
  }).sort((a,b)=>Date.parse(b.created_at||0)-Date.parse(a.created_at||0)).slice(0,12);
  grid.innerHTML=recentes.length ? recentes.map(buildImovCard).join('') : '<div class="week-empty"><div class="empty-ico">✦</div><p>Novos imóveis serão exibidos aqui assim que entrarem no catálogo.</p></div>';
}
'''
if 'function renderImoveisDaSemana' not in text:
    anchor = 'function buildHomeDestaques(){'
    if anchor not in text: raise SystemExit('build home function not found')
    text = text.replace(anchor, fn + '\n' + anchor, 1)

call = '''    const semanaImoveis = (_siteCache && Array.isArray(_siteCache.imoveis) && _siteCache.imoveis.length)
      ? _siteCache.imoveis
      : condos.reduce((acc, c) => acc.concat((c.imoveis||[]).map(i => ({...i, _c:c}))), []);
    renderImoveisDaSemana(semanaImoveis);
'''
needle = '''  getDataResolved().then(condos=>{
    if(!condos || !condos.length){'''
if call.strip() not in text:
    if needle not in text: raise SystemExit('build home then needle not found')
    text = text.replace(needle, '''  getDataResolved().then(condos=>{
''' + call + '''    if(!condos || !condos.length){''', 1)

path.write_text(text)
print(path)
