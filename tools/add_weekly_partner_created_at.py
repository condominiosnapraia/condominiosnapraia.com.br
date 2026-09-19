from pathlib import Path

for path in [Path('functions/parceiro/[slug].js'), Path('functions/parceiro-feed/[slug].js')]:
    text = path.read_text()
    # Nested CRM property selection used by the active partner relationship.
    text = text.replace('status,publicar)&order=destaque.desc', 'status,publicar,created_at)&order=destaque.desc')
    # Main handler uses a comma-separated nested selection.
    text = text.replace('status,publicar)&order=destaque.desc,ordem.asc', 'status,publicar,created_at)&order=destaque.desc,ordem.asc')
    # Felipe's fallback reads the central catalog directly.
    text = text.replace('status,publicar&order=updated_at.desc', 'status,publicar,created_at&order=updated_at.desc')
    path.write_text(text)
    print(path)
