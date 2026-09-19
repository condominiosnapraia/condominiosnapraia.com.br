from pathlib import Path

path = Path('index.html')
text = path.read_text()
style = '''
<style id="home-no-section-waves">
/* Divisórias retas: o layout atual não utiliza transições onduladas entre seções. */
#view-home > .sec-onda::before,
#view-home > .sec-onda-areia::before{content:none!important;display:none!important;visibility:hidden!important}
#view-home > .sec-onda,#view-home > .sec-onda-areia{overflow:hidden!important}
</style>
'''
if 'home-no-section-waves' not in text:
    marker = '</head>'
    if marker not in text: raise SystemExit('head marker not found')
    text = text.replace(marker, style + marker, 1)
path.write_text(text)
print(path)
