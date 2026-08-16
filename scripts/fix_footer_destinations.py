from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
changed=[]
for path in ROOT.glob('*/index.html'):
    text=path.read_text(encoding='utf-8',errors='ignore')
    if 'ftr-main' not in text and 'portal-footer' not in text and 'ftr-col' not in text:
        continue
    new=text
    new=new.replace('<a href="/o-que-fazer-em-capao-da-canoa/" onclick="openTurismo();return false">Turismo no Litoral</a>', '<a href="/turismo/">Turismo no Litoral</a>')
    new=new.replace('<a href="/o-que-fazer-em-capao-da-canoa/">Turismo no Litoral</a>', '<a href="/turismo/">Turismo no Litoral</a>')
    new=new.replace('href="#guias-cidades" onclick="document.getElementById(\'guias-cidades\').scrollIntoView({behavior:\'smooth\'});return false"', 'href="/#guias-cidades"')
    new=new.replace('<a href="#guias-cidades">Cidades</a>', '<a href="/#guias-cidades">Cidades</a>')
    if new != text:
        path.write_text(new,encoding='utf-8')
        changed.append(str(path.relative_to(ROOT)))
print(f'templates_corrigidos={len(changed)}')
print('\n'.join(changed))
