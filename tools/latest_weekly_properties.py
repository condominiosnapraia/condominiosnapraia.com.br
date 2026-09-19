from pathlib import Path

path = Path('index.html')
text = path.read_text()
old_query = "sbSite.get('imoveis', `?status=eq.Disponível&publicar=eq.true&select=${encodeURIComponent(imovSelect)}&order=created_at.asc`)"
new_query = "sbSite.get('imoveis', `?status=neq.Vendido&publicar=eq.true&select=${encodeURIComponent(imovSelect)}&order=created_at.desc`)"
if old_query not in text:
    raise SystemExit('consulta antiga não encontrada')
text = text.replace(old_query, new_query, 1)
old_logic = """  const agora=Date.now();
  const limite=agora-(7*24*60*60*1000);
  const recentes=(Array.isArray(lista)?lista:[]).filter(i=>{
    if(!i || i.publicar===false || i.status!=='Disponível')return false;
    const criado=Date.parse(i.created_at||'');
    return Number.isFinite(criado) && criado>=limite && criado<=agora;
  }).sort((a,b)=>Date.parse(b.created_at||0)-Date.parse(a.created_at||0).slice(0,12);"""
# The exact source has the slice outside sort; use a narrower replacement.
old_logic = """  const agora=Date.now();
  const limite=agora-(7*24*60*60*1000);
  const recentes=(Array.isArray(lista)?lista:[]).filter(i=>{
    if(!i || i.publicar===false || i.status!=='Disponível')return false;
    const criado=Date.parse(i.created_at||'');
    return Number.isFinite(criado) && criado>=limite && criado<=agora;
  }).sort((a,b)=>Date.parse(b.created_at||0)-Date.parse(a.created_at||0)).slice(0,12);"""
new_logic = """  // A seção mantém o nome “Imóveis da Semana”, mas exibe sempre os 12
  // imóveis publicados e cadastrados mais recentemente, sem depender da data atual.
  const recentes=(Array.isArray(lista)?lista:[]).filter(i=>{
    return i && i.publicar!==false && String(i.status||'').toLowerCase()!=='vendido';
  }).sort((a,b)=>Date.parse(b.created_at||0)-Date.parse(a.created_at||0)).slice(0,12);"""
if old_logic not in text:
    raise SystemExit('lógica antiga não encontrada')
text = text.replace(old_logic, new_logic, 1)
path.write_text(text)
print(path)
