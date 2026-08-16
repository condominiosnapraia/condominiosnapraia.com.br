from pathlib import Path
from bs4 import BeautifulSoup
import subprocess

root = Path(__file__).resolve().parents[1]
files = []
for line in subprocess.check_output(['git','-c','color.ui=false','status','--short'], cwd=root, text=True).splitlines():
    rel = line[2:].strip()
    if rel.endswith('/index.html') and rel != 'condominio/index.html':
        files.append(root / rel)

errors=[]
pdf_before=[]
for path in files:
    soup = BeautifulSoup(path.read_text(encoding='utf-8', errors='ignore'), 'html.parser')
    text = path.read_text(encoding='utf-8', errors='ignore')
    if 'STATIC CONDO NORMALIZER v1' not in text or 'STATIC CONDO ORDER v1' not in text:
        errors.append(f'{path.parent.name}: markers')
    if soup.select('.pdf-frame iframe'):
        pdf_before.append(path.parent.name)
    if len(soup.select('style')) == 0:
        errors.append(f'{path.parent.name}: no style')
    if len(soup.select('script')) == 0:
        errors.append(f'{path.parent.name}: no script')

print(f'pages={len(files)}')
print(f'errors={len(errors)}')
print(f'pdf_iframes_remaining={len(pdf_before)}')
if errors:
    print('\n'.join(errors[:50]))
if pdf_before:
    print('remaining_pdf_iframes:', ','.join(pdf_before[:50]))
