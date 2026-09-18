from pathlib import Path

path = Path('functions/corretor/[slug]/imovel/[imovelSlug].js')
text = path.read_text()
start = text.find('<section class="lead-card" id="interesse">')
if start < 0:
    raise SystemExit('lead card not found')
end_marker = '</form></section>'
end = text.find(end_marker, start)
if end < 0:
    raise SystemExit('lead card closing not found')
end += len(end_marker)
block = text[start:end]
text = text[:start] + text[end:]
insert_marker = '${relatedMarkup}</main>'
if insert_marker not in text:
    raise SystemExit('related markup marker not found')
text = text.replace(insert_marker, '${relatedMarkup}' + block + '</main>', 1)
path.write_text(text)
print(path)
