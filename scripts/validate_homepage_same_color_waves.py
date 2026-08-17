import re
from pathlib import Path
from bs4 import BeautifulSoup

path = Path(__file__).resolve().parents[1] / 'index.html'
soup = BeautifulSoup(path.read_text(), 'html.parser')
sections = soup.select('section[id]')
assert sections, 'Nenhuma seção encontrada'
assert all('sec-onda' in (section.get('class') or []) for section in sections), 'Há seção sem sec-onda'
css = '\n'.join(style.get_text() for style in soup.find_all('style'))
assert 'viv-sec::before{content:""!important;display:block!important}' in css, 'Ondas editoriais continuam desativadas'

ids = ['lch-sec-sec','sec-imoveis','sec-apartamentos','sec-fora-cond','sec-terrenos','sec-terrenos-fora','qfilter2','sec-condominios','viver-intro-sec','qfilter','pcred-sec-sec','guias-cidades','guias-decisao','sec-blog-preview']
ids += ['viver-lagoa','viver-mar','viver-cidade']

for sid in ids:
    bg_matches = re.findall(r'#' + re.escape(sid) + r'\{background:([^!]+)!important\}', css)
    wave_matches = re.findall(r'#' + re.escape(sid) + r'\.sec-onda::before\{--wave-from:([^}]+)\}', css)
    assert bg_matches and wave_matches, f'Regras ausentes: {sid}'
    bg = bg_matches[-1].strip()
    wave = wave_matches[-1].strip()
    assert bg == wave, f'Cor divergente em {sid}: fundo={bg}, onda={wave}'

print(f'OK: {len(sections)} seções com sec-onda; cores efetivas da onda iguais às cores efetivas das seções; ondas editoriais reativadas.')
