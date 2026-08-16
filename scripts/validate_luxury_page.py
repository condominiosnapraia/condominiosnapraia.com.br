from pathlib import Path
import re

page = Path('/home/ubuntu/wt_supabase_queries/imoveis-de-luxo/index.html')
text = page.read_text(encoding='utf-8')
scripts = re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>', text, flags=re.S | re.I)
for index, content in enumerate(scripts):
    if not content.strip() or 'application/ld+json' in text:
        continue
    out = Path(f'/tmp/luxury-script-{index}.js')
    out.write_text(content, encoding='utf-8')
    print(out)
print(f'SCRIPTS={len(scripts)}')
