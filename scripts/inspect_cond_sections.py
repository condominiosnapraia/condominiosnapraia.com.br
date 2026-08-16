from pathlib import Path
from bs4 import BeautifulSoup
import sys

for arg in sys.argv[1:]:
    path = Path(arg)
    soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
    root = soup.select_one('.body-content')
    print(f'FILE {path}')
    if not root:
        print('NO BODY-CONTENT')
        continue
    for i, child in enumerate([x for x in root.find_all(recursive=False) if getattr(x, 'name', None)], 1):
        heading = child.find(['h1','h2','h3'], recursive=True)
        text = ' '.join(child.get_text(' ', strip=True).split())[:100]
        print(f'{i:02d} tag={child.name} class={" ".join(child.get("class", []))} heading={heading.get_text(" ", strip=True) if heading else ""!r} text={text!r}')
