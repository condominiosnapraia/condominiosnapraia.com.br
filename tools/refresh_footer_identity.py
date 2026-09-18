from pathlib import Path

files = [Path('functions/parceiro/[slug].js'), Path('functions/parceiro-feed/[slug].js')]
old = '<div class="footer-col"><div class="footer-logo">${esc(name)}</div><p class="footer-text">Site profissional conectado ao catálogo do Condomínios na Praia, com imóveis selecionados e atendimento personalizado no Rio Grande do Sul.</p><a class="footer-wpp" href="${esc(wpp)}" target="_blank" rel="noopener nofollow">WhatsApp do corretor</a></div>'
new = '<div class="footer-col footer-identity"><div class="footer-profile">${profileImage ? `<img src="${esc(profileImage)}" alt="Foto de ${esc(name)}" loading="lazy" decoding="async">` : `<div class="footer-profile-empty" aria-hidden="true">${esc(name.slice(0,1))}</div>`}<div><div class="footer-kicker">Atendimento imobiliário</div><div class="footer-logo">${esc(name)}</div>${site.creci ? `<div class="footer-creci">CRECI ${esc(site.creci)}</div>` : ''}</div></div><p class="footer-text">Encontre imóveis selecionados e fale diretamente com ${esc(name)}.</p><a class="footer-wpp" href="${esc(wpp)}" target="_blank" rel="noopener nofollow">WhatsApp do corretor <span aria-hidden="true">↗</span></a></div>'
css = r'''
<style>
/* HERO-MATCHING BROKER IDENTITY FOOTER */
footer{background:linear-gradient(135deg,#0d303a 0%,#123f4a 52%,#1a5960 100%);border-top:1px solid rgba(229,184,120,.75);padding-top:54px}
footer:before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 12% 10%,rgba(229,184,120,.14),transparent 32%),linear-gradient(90deg,transparent 0%,rgba(255,255,255,.025) 100%)}
.footer-main,.footer-bottom{position:relative;z-index:1}
.footer-identity{padding-right:26px}
.footer-profile{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.footer-profile img,.footer-profile-empty{width:66px;height:66px;flex:0 0 66px;border-radius:50%;object-fit:cover;object-position:center 22%;border:2px solid rgba(229,184,120,.9);box-shadow:0 10px 24px rgba(0,0,0,.22)}
.footer-profile-empty{display:grid;place-items:center;background:rgba(255,255,255,.12);color:#f1c787;font:500 28px Fraunces,serif}
.footer-kicker{color:#e5b878;font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;margin-bottom:5px}
.footer-logo{font-size:28px;line-height:1.02;color:#fff}
.footer-creci{margin-top:6px;color:rgba(255,255,255,.7);font-size:12px;letter-spacing:.04em}
.footer-identity .footer-text{max-width:340px;color:rgba(255,255,255,.72)}
.footer-wpp{gap:9px!important;background:#25d366!important;box-shadow:0 10px 22px rgba(0,0,0,.18);transition:transform .18s ease,filter .18s ease}.footer-wpp span{width:auto!important;font-size:15px;color:#fff!important}.footer-wpp:hover{transform:translateY(-2px);filter:brightness(1.04)}
@media(max-width:900px){.footer-identity{padding-right:0}}
@media(max-width:600px){footer{padding-top:40px}.footer-profile img,.footer-profile-empty{width:58px;height:58px;flex-basis:58px}.footer-logo{font-size:25px}.footer-identity .footer-text{max-width:100%}}
</style>
'''
for path in files:
    text = path.read_text()
    if 'HERO-MATCHING BROKER IDENTITY FOOTER' in text:
        continue
    if old not in text:
        raise SystemExit(f'footer identity markup not found: {path}')
    text = text.replace(old, new, 1)
    text = text.replace('</head>', css + '</head>', 1)
    path.write_text(text)
    print(path)
