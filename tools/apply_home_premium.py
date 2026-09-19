from pathlib import Path

path=Path('index.html')
text=path.read_text()
exec(Path('tools/revitalize_home_premium.py').read_text(), {'Path': Path})
# The script above writes the file through its own path variable; reload its result.
text=path.read_text()
extra='''\n<style id="home-footer-no-wave">\n.page-footer{border-top:4px solid #b78442!important}\n.page-footer .ftr-wave{display:none!important}\n.page-footer .ftr-main{padding-top:54px!important}\n</style>\n'''
if 'home-footer-no-wave' not in text:
    text=text.replace('</head>',extra+'</head>',1)
path.write_text(text)
print(path)
