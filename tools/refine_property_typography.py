from pathlib import Path

path = Path('functions/corretor/[slug]/imovel/[imovelSlug].js')
text = path.read_text()
css = r'''
<style>
/* PROPERTY DETAIL TYPOGRAPHY 2.0 — refined desktop hierarchy */
:root{--detail-ink:#17313a;--detail-teal:#123f4a;--detail-copper:#b77b3f;--detail-muted:#687b7c}
.hero-info{padding:22px 0 18px;max-width:940px}.hero-info .property-tags{margin-bottom:11px}.property-tag{min-height:29px;padding:0 11px;font-size:10px;letter-spacing:.06em;text-transform:uppercase}.hero-info h1{max-width:850px;margin:8px 0 8px;font:500 clamp(34px,4vw,47px)/1.08 Fraunces,Georgia,serif;letter-spacing:-.035em;color:var(--detail-teal)}.location{font-size:13px;color:var(--detail-muted)}
.property-actions-bar{margin-top:12px}.property-code-pill{min-height:34px;padding:0 13px;font-size:10px}.share-button,.favorite-button{min-height:36px;padding:0 13px;font-size:12px}
.content-grid{grid-template-columns:minmax(0,1fr) 300px;gap:24px}.main-card,.side-card,.condo,.lead-card{border-radius:16px;padding:23px}.main-card h2,.condo h2,.lead-card h2{font:500 27px/1.12 Fraunces,Georgia,serif;letter-spacing:-.025em;color:var(--detail-teal)}.main-card h2{margin-bottom:12px}.description{font-size:15px;line-height:1.72;color:#486267}.facts{margin:17px 0 24px;border-radius:12px}.fact{padding:12px 9px}.fact-icon{font-size:21px;margin-bottom:6px}.fact small{font-size:9px;letter-spacing:.08em}.fact strong{font-size:18px}.details{gap:8px;margin-top:15px}.detail{padding:10px;border-radius:9px}.detail small{font-size:9px}.detail strong{font-size:13px}.differences{gap:7px;margin-top:16px}.difference{padding:6px 9px;font-size:11px}
.side-card{top:82px}.price{font:500 30px/1.1 Fraunces,Georgia,serif;margin:6px 0 15px}.price-label{font-size:10px}.side-card .wpp{font-size:13px;padding:12px}.contact-link{font-size:12px}.broker strong{font-size:13px}.broker small{font-size:10px}
.condo{margin-top:24px;background:linear-gradient(135deg,#f4f1ea,#edf1eb);border-color:#e2ddd2}.condo h2{font-size:25px;margin-bottom:9px}.condo-meta{font-size:13px;color:#506c6b}.condo-summary{font-size:14px;line-height:1.7;color:#536b6c}.amenities{gap:6px;margin-top:14px}.amenity{padding:6px 9px;font-size:11px}.notice{margin-top:18px;padding:13px;font-size:12px}
.related-section{padding:35px 0 2px}.related-head{margin-bottom:14px}.related-head h2{font:500 clamp(25px,3vw,34px)/1.08 Fraunces,Georgia,serif;letter-spacing:-.025em}.related-head p{font-size:12px}.related-count{font-size:11px}.related-grid{gap:12px}.related-card{border-radius:13px}.related-body{padding:11px}.related-type{font-size:8px}.related-body h3{font:500 16px/1.14 Fraunces,Georgia,serif;margin:6px 0 4px}.related-body p{font-size:10px}.related-body strong{margin-top:9px;font-size:14px}.related-button{min-height:31px;margin-top:9px;font-size:10px}
@media(max-width:850px){.hero-info h1{font-size:34px}.content-grid{grid-template-columns:1fr}.main-card,.side-card,.condo,.lead-card{padding:20px}.related-head h2{font-size:28px}.related-body h3{font-size:17px}}
@media(max-width:620px){.hero-info{padding-top:18px}.hero-info h1{font-size:31px}.main-card h2,.condo h2,.lead-card h2{font-size:25px}.related-body h3{font-size:16px}}
</style>
'''
if 'PROPERTY DETAIL TYPOGRAPHY 2.0' not in text:
    text = text.replace('</head>', css + '</head>', 1)
path.write_text(text)
print(path)
