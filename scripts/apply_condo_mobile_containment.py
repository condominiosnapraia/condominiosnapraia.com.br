from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
MARK='CONDO MOBILE CONTAINMENT v1'
CSS=f'''<style>/* {MARK} */
html,body{{max-width:100%;overflow-x:hidden}}
img,video,iframe,svg{{max-width:100%}}
@media(max-width:768px){{
  .content,.wrap,.body-content,.vpc,.vpc-in,.contact-section,.contact-grid,.ftr-main,.ftr-bottom,.cond-quick-section,.cond-quick-inner{{width:100%;max-width:100%;min-width:0;box-sizing:border-box}}
  .content,.wrap{{padding-left:18px!important;padding-right:18px!important}}
  .vpc{{padding-left:16px!important;padding-right:16px!important}}
  .vpc-in{{padding-left:20px!important;padding-right:20px!important}}
  .lead-box,.lead-form,.lead-form input,.lead-form select,.lead-form textarea,.form-row,.cond-implantacao-card,.cond-implantacao-thumb{{max-width:100%;min-width:0;box-sizing:border-box}}
  .cond-mosaic-gallery,.cond-mosaic-grid,.cond-gallery-section,.cond-gallery-viewport{{max-width:100%;min-width:0;box-sizing:border-box}}
  .cond-mosaic-gallery,.cond-gallery-section{{margin-left:0;margin-right:0}}
  .cond-rich,.cond-rich *,.contact-section *,.vpc-in *{{max-width:100%;box-sizing:border-box}}
}}
</style>'''
changed=[]
for p in sorted(ROOT.glob('*/index.html')):
    name=p.parent.name
    text=p.read_text(encoding='utf-8',errors='ignore')
    if name=='imovel' or name.startswith('imovel-') or MARK in text: continue
    if not re.search(r'cond-conteudo-full|class="cond-title"|class="body-content"|cond-mapa-section|class="cond-gallery-grid"',text): continue
    if '</head>' not in text: continue
    p.write_text(text.replace('</head>',CSS+'</head>',1),encoding='utf-8')
    changed.append(name)
print(f'paginas_corrigidas={len(changed)}')
print('\n'.join(changed))
