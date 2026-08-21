import re
from pathlib import Path
from bs4 import BeautifulSoup

path = Path(__file__).resolve().parents[1] / 'index.html'
soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
sections = soup.select('section[id]')
assert sections, 'Nenhuma seção encontrada'
assert all('sec-onda' in (section.get('class') or []) for section in sections), 'Há seção sem sec-onda'
css = '\n'.join(style.get_text() for style in soup.find_all('style'))
assert 'viv-sec::before{content:""!important;display:block!important}' in css, 'Ondas editoriais continuam desativadas'

# O sistema profissional usa a cor da seção anterior na onda da seção atual.
# A lista mantém a sequência visual esperada da Home, inclusive as novas áreas.
expected = {
    'lch-sec-sec': ('#eef3ec', '#f7f1e8'),
    'sec-imoveis': ('#f3f8fa', '#eef3ec'),
    'sec-apartamentos': ('#fffaf2', '#f3f8fa'),
    'sec-fora-cond': ('#eef8f7', '#fffaf2'),
    'sec-imoveis-comerciais': ('#fffaf2', '#eef8f7'),
    'sec-terrenos': ('#fbfaf7', '#fffaf2'),
    'sec-terrenos-fora': ('#f3f8fa', '#fbfaf7'),
    'qfilter2': ('#fbf5eb', '#f3f8fa'),
    'sec-condominios': ('#eef3ec', '#fbf5eb'),
    'sec-condominios-verticais': ('#f3f8fa', '#eef3ec'),
    'viver-intro-sec': ('#fff', '#f3f8fa'),
    'viver-lagoa': ('#eef8f5', '#fff'),
    'viver-mar': ('#eef7fb', '#eef8f5'),
    'viver-cidade': ('#fffaf0', '#eef7fb'),
    'pcred-sec-sec': ('#faf6ef', '#fffaf0'),
    'guias-cidades': ('#fff', '#faf6ef'),
    'guias-decisao': ('#faf6ef', '#fff'),
    'sec-blog-preview': ('#fff', '#faf6ef'),
}
for sid, (bg_expected, wave_expected) in expected.items():
    pattern = re.compile(r'#view-home\s*>\s*#' + re.escape(sid) + r'\{background:([^!]+)!important;--wave-from:([^}]+)\}')
    matches = pattern.findall(css)
    if not matches:
        # Fallback for legacy/editorial rules, while still requiring the expected values.
        pattern = re.compile(r'#' + re.escape(sid) + r'\{background:([^!]+)!important;--wave-from:([^}]+)\}')
        matches = pattern.findall(css)
    assert matches, f'Regras profissionais ausentes: {sid}'
    bg, wave = matches[-1][0].strip(), matches[-1][1].strip()
    assert bg == bg_expected, f'Fundo divergente em {sid}: esperado={bg_expected}, atual={bg}'
    assert wave == wave_expected, f'Onda divergente em {sid}: esperado={wave_expected}, atual={wave}'

print(f'OK: {len(sections)} seções com sec-onda; sequência de fundos/ondas profissional validada; ondas editoriais reativadas.')
