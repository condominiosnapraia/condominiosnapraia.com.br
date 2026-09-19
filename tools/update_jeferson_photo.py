from pathlib import Path
import subprocess

root=Path(__file__).resolve().parents[1]
source=Path('/tmp/jeferson-drive-new')
profile=root/'img/corretores/jeferson-gimenez.jpg'
profile.write_bytes(source.read_bytes())
subprocess.run(['python3', str(root/'tools/generate_partner_og_standard.py')], check=True)
for p in [root/'functions/parceiro/[slug].js',root/'functions/parceiro-feed/[slug].js']:
    t=p.read_text().replace('v=20901650','v=20260919-photos')
    p.write_text(t)
print(profile)
