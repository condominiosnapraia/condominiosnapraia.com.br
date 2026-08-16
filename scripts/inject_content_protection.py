from pathlib import Path

ROOT = Path('/home/ubuntu/wt_supabase_queries')
SKIP = {
    'crm.html', 'diagnostico.html', 'exportar-dados.html',
    'restaurar.html', 'teste-fotos.html'
}
CSS = '<link rel="stylesheet" href="/css/protecao-conteudo.css">'
JS = '<script src="/js/protecao-conteudo.js" defer></script>'
changed = []

for path in sorted(ROOT.rglob('*.html')):
    if any(part.startswith('.') for part in path.parts):
        continue
    if path.name in SKIP or 'node_modules' in path.parts:
        continue
    text = path.read_text(encoding='utf-8', errors='ignore')
    if '</head>' not in text:
        continue
    updated = text
    if '/css/protecao-conteudo.css' not in updated:
        updated = updated.replace('</head>', f'  {CSS}\n</head>', 1)
    if '/js/protecao-conteudo.js' not in updated:
        updated = updated.replace('</head>', f'  {JS}\n</head>', 1)
    if updated != text:
        path.write_text(updated, encoding='utf-8')
        changed.append(str(path.relative_to(ROOT)))

print(f'updated={len(changed)}')
for item in changed:
    print(item)
