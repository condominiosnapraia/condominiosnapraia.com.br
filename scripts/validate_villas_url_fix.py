from pathlib import Path
from xml.etree import ElementTree as ET

root=Path('/home/ubuntu/wt_supabase_queries')
assert not (root/'condominio-xangri-la-villas-resort-'/'index.html').exists()
redirects=(root/'_redirects').read_text()
assert '/condominio-xangri-la-villas-resort- /condominio-xangri-la-villas-resort/ 301' in redirects
assert '/condominio-xangri-la-villas-resort-/ /condominio-xangri-la-villas-resort/ 301' in redirects
legacy=(root/'sitemap (1).xml').read_text()
main=(root/'sitemap.xml').read_text()
assert 'condominio-xangri-la-villas-resort-' not in legacy
assert main.count('condominio-xangri-la-villas-resort/') == 1
ET.parse(root/'sitemap.xml')
ET.parse(root/'sitemap (1).xml')
print('duplicate_directory=removed')
print('legacy_redirects=2')
print('canonical_sitemap_entries=1')
print('xml=valid')
