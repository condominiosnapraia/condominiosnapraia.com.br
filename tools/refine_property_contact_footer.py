from pathlib import Path

path = Path('functions/corretor/[slug]/imovel/[imovelSlug].js')
text = path.read_text()
css = r'''
<style>
/* PROPERTY DETAIL FINAL PALETTE — warm contact form, restrained footer */
.lead-card{position:relative;overflow:hidden;margin:34px 0 0!important;padding:34px!important;border:1px solid #e5d5be!important;border-radius:18px!important;background:linear-gradient(135deg,#f8f3eb 0%,#eef1e9 100%)!important;color:#17313a!important;box-shadow:0 16px 38px rgba(28,55,59,.08)!important}
.lead-card:before{content:'';position:absolute;right:-90px;top:-110px;width:310px;height:310px;border-radius:50%;background:radial-gradient(circle,rgba(200,147,88,.22),transparent 68%);pointer-events:none}.lead-card>*{position:relative;z-index:1}.lead-card h2{color:#123f4a!important;margin-bottom:10px!important}.lead-card p{color:#5d706f!important}.lead-form{gap:11px!important}.lead-form input,.lead-form textarea{border:1px solid #d8d0c4!important;background:rgba(255,253,249,.9)!important;color:#17313a!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.6)}.lead-form input::placeholder,.lead-form textarea::placeholder{color:#83908d!important}.lead-form input:focus,.lead-form textarea:focus{outline:2px solid rgba(200,147,88,.24)!important;border-color:#c89358!important}.lead-consent{color:#62706e!important}.lead-consent a{color:#996b38!important}.lead-submit{background:#c89358!important;color:#fff!important;border-radius:8px!important;box-shadow:0 8px 18px rgba(154,106,56,.2)}.lead-submit:hover{filter:brightness(1.05)}.lead-message{color:#587b71!important}.footer{margin-top:58px!important}.footer-grid{grid-template-columns:minmax(230px,1.3fr) minmax(165px,1fr) minmax(165px,1fr) minmax(175px,.95fr)!important;gap:32px!important}.footer-col .footer-info-creci{color:#e5b878!important;font-weight:700}.footer-quick-links{gap:7px!important}.footer-bottom{margin-top:24px!important}
@media(max-width:760px){.lead-card{margin-top:28px!important;padding:25px 19px!important}.lead-form{grid-template-columns:1fr!important}.lead-form textarea,.lead-consent,.lead-submit{grid-column:auto!important}.lead-submit{width:100%}.footer-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
@media(max-width:520px){.lead-card{border-radius:15px!important}.footer-grid{grid-template-columns:1fr!important}.footer-grid>div:first-child{grid-column:auto}}
</style>
'''
if 'PROPERTY DETAIL FINAL PALETTE' not in text:
    text = text.replace('</head>', css + '</head>', 1)
path.write_text(text)
print(path)
