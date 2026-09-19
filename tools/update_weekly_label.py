from pathlib import Path
p=Path('index.html')
t=p.read_text()
old='Entraram nos últimos 7 dias'
new='Os últimos imóveis cadastrados'
if old not in t:
    raise SystemExit('label antigo não encontrado')
p.write_text(t.replace(old,new,1))
print(p)
