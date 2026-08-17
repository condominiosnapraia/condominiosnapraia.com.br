from pathlib import Path
import re

p=Path('/home/ubuntu/wt_supabase_queries/vivendas-da-marina-capao-da-canoa/index.html')
text=p.read_text(encoding='utf-8')
pattern=r'<section class="cond-map-pdf" data-map-pdf-source="39-Vivendasdamarina\.webp".*?</section>'
new,n=re.subn(pattern,'',text,count=1,flags=re.S)
if n:
    p.write_text(new,encoding='utf-8')
print('removed=',n)
if 'data-map-pdf-source="39-Vivendasdamarina.webp"' in p.read_text(encoding='utf-8'):
    raise SystemExit('stale marker remains')
