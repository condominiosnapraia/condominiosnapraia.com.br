from pathlib import Path

path = Path('index.html')
text = path.read_text()
style = r'''
<style id="home-premium-refresh">
/* Revitalização premium da home: mantém o hero atual e aprimora o restante do portal. */
#view-home{--home-ink:#123744;--home-muted:#64787d;--home-cream:#faf7f1;--home-mist:#edf5f3;--home-gold:#b78442;--home-line:rgba(18,55,68,.11);background:#fbfaf7}
#view-home .qr-sec{background:linear-gradient(180deg,#fbfaf7 0%,#f4f7f4 100%)!important;padding-top:76px!important;padding-bottom:70px!important}
#view-home .qr-inner{max-width:1200px}
#view-home .qr-sec .eyebrow{color:var(--home-gold);font-size:10px;letter-spacing:.28em}
#view-home .qr-sec .sectit{color:var(--home-ink);font-size:clamp(34px,4.4vw,56px);letter-spacing:-.045em;margin-top:12px}
#view-home .qr-sec .sectit em{color:var(--home-gold);font-style:italic}
#view-home .cidades-sub{color:var(--home-muted);font-size:15px;margin-top:12px}
#view-home .navq-grid{gap:14px;margin-top:30px}
#view-home .navq-card{position:relative;min-height:128px;padding:24px 25px;border:1px solid var(--home-line);border-radius:22px;background:rgba(255,255,255,.78);box-shadow:0 12px 30px rgba(18,55,68,.055);transition:transform .22s cubic-bezier(.23,1,.32,1),box-shadow .22s,border-color .22s,background .22s;overflow:hidden}
#view-home .navq-card::after{content:'';position:absolute;right:-26px;bottom:-38px;width:100px;height:100px;border-radius:50%;background:rgba(183,132,66,.1);transition:transform .25s ease}
#view-home .navq-card:hover{transform:translateY(-5px);background:#fff;border-color:rgba(183,132,66,.35);box-shadow:0 20px 38px rgba(18,55,68,.12)}
#view-home .navq-card:hover::after{transform:scale(1.35)}
#view-home .navq-t{position:relative;z-index:1;color:var(--home-ink);font:600 20px/1.15 Fraunces,serif;letter-spacing:-.02em}
#view-home .navq-s{position:relative;z-index:1;margin-top:9px;color:var(--home-muted);font-size:12px;line-height:1.45;max-width:190px}
#view-home .navq-arrow{position:absolute;z-index:2;right:19px;top:20px;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--home-ink);color:#fff;transition:transform .2s,background .2s}
#view-home .navq-card:hover .navq-arrow{background:var(--home-gold);transform:translate(2px,-2px)}
#view-home .lch-sec,#view-home .dest-section,#view-home .qfilter-sec,#view-home .viver-intro{border-top:1px solid rgba(18,55,68,.06)}
#view-home .lch-sec{background:#f1f6f2!important;padding-bottom:84px!important}
#view-home .lch-head,.dest-header{margin-bottom:32px}
#view-home .eyebrow{font-size:10px;letter-spacing:.25em;color:var(--home-gold);font-weight:700}
#view-home .sectit{color:var(--home-ink);letter-spacing:-.045em}
#view-home .sectit-main{font-weight:500}
#view-home .sectit-sub{color:var(--home-gold);font-weight:500}
#view-home .lch-grid{gap:18px}
#view-home .lch-card{border:1px solid rgba(18,55,68,.1);border-radius:22px;background:#fff;box-shadow:0 14px 32px rgba(18,55,68,.07);overflow:hidden;transition:transform .24s cubic-bezier(.23,1,.32,1),box-shadow .24s,border-color .24s}
#view-home .lch-card:hover{transform:translateY(-6px);box-shadow:0 24px 44px rgba(18,55,68,.14);border-color:rgba(183,132,66,.32)}
#view-home .lch-foto{height:214px}
#view-home .lch-body{padding:21px 21px 23px}
#view-home .lch-city{color:var(--home-gold);font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:700}
#view-home .lch-tit{color:var(--home-ink);font:600 22px/1.12 Fraunces,serif;letter-spacing:-.025em;margin-top:9px}
#view-home .lch-res{color:var(--home-muted);font-size:12px;line-height:1.6;margin-top:10px}
#view-home .lch-link{color:var(--home-ink);font-size:11px;font-weight:700;letter-spacing:.06em;margin-top:18px}
#view-home .lch-tag{background:rgba(18,55,68,.9);border-radius:999px;padding:7px 11px;font-size:9px;letter-spacing:.13em}
#view-home .dest-section{padding-top:78px!important;padding-bottom:78px!important}
#view-home .dest-section-alt{background:#f5f8f6!important}
#view-home .dest-section:not(.dest-section-alt){background:#fbfaf7!important}
#view-home .dest-header{align-items:end}
#view-home .dest-ver-btn{color:var(--home-ink);border-color:var(--home-gold);font-weight:700;transition:color .2s,border-color .2s,transform .2s}
#view-home .dest-ver-btn:hover{color:var(--home-gold);transform:translateX(2px)}
#view-home .igrid{gap:18px}
#view-home .icard{border:1px solid rgba(18,55,68,.1);border-radius:20px;background:#fff;box-shadow:0 12px 28px rgba(18,55,68,.065);overflow:hidden;transition:transform .22s cubic-bezier(.23,1,.32,1),box-shadow .22s,border-color .22s}
#view-home .icard:hover{transform:translateY(-5px);box-shadow:0 22px 38px rgba(18,55,68,.13);border-color:rgba(183,132,66,.34)}
#view-home .icimg{border-radius:0!important}
#view-home .icbody{padding:17px 17px 12px}
#view-home .ictag{color:var(--home-gold);font-size:9px;letter-spacing:.15em}
#view-home .ictit{color:var(--home-ink);font:600 19px/1.16 Fraunces,serif;letter-spacing:-.02em}
#view-home .icmeta,#view-home .icloc{color:var(--home-muted);font-size:11px}
#view-home .icprice{color:var(--home-ink);font-size:17px;font-weight:700}
#view-home .icfoot{border-top:1px solid rgba(18,55,68,.08);padding:12px 17px 15px}
#view-home .icbtn,.dest-btn-all,.lch-btn{border-radius:999px!important;font-weight:700!important;transition:transform .2s,background .2s,box-shadow .2s}
#view-home .icbtn:hover,.dest-btn-all:hover,.lch-btn:hover{transform:translateY(-2px);box-shadow:0 10px 22px rgba(18,55,68,.14)}
#view-home #sec-imoveis-semana{background:linear-gradient(135deg,#f7f1e8 0%,#eef5f2 100%)!important;border-top-color:rgba(183,132,66,.18)}
#view-home #sec-imoveis-semana .week-kicker{color:var(--home-gold)}
#view-home .cgrid{gap:18px}
#view-home .ccard{border:1px solid rgba(18,55,68,.1);border-radius:20px;background:#fff;box-shadow:0 12px 28px rgba(18,55,68,.06);overflow:hidden;transition:transform .22s,box-shadow .22s,border-color .22s}
#view-home .ccard:hover{transform:translateY(-5px);box-shadow:0 22px 38px rgba(18,55,68,.13);border-color:rgba(183,132,66,.3)}
#view-home .cbody{padding:17px}.ctit{color:var(--home-ink);font:600 20px/1.15 Fraunces,serif}.cmeta,.cdesc{color:var(--home-muted)}
#view-home .qfilter-sec{background:#f6f0e7!important;padding-top:84px!important;padding-bottom:78px!important}
#view-home .qfilter-card{border:1px solid rgba(18,55,68,.1);border-radius:20px;background:rgba(255,255,255,.78);box-shadow:0 12px 28px rgba(18,55,68,.05);transition:transform .22s,box-shadow .22s,border-color .22s}
#view-home .qfilter-card:hover{transform:translateY(-4px);box-shadow:0 20px 35px rgba(18,55,68,.12);border-color:rgba(183,132,66,.3)}
#view-home .page-footer{background:linear-gradient(135deg,#102f3b 0%,#164c59 100%);border-top:4px solid var(--home-gold)}
#view-home .mob-footer-nav{background:rgba(16,47,59,.96);border-top:1px solid rgba(255,255,255,.13)}
@media(max-width:768px){
  #view-home .qr-sec{padding-top:54px!important;padding-bottom:48px!important}
  #view-home .navq-grid{gap:10px;margin-top:22px}
  #view-home .navq-card{min-height:112px;padding:18px 17px;border-radius:17px}
  #view-home .navq-t{font-size:17px}.navq-s{font-size:11px!important}
  #view-home .lch-sec,#view-home .dest-section{padding-top:56px!important;padding-bottom:54px!important}
  #view-home .lch-grid,#view-home .igrid,#view-home .cgrid{gap:12px}
  #view-home .lch-foto{height:165px}.lch-body{padding:15px!important}.lch-tit{font-size:18px!important}
  #view-home .dest-header{align-items:flex-start;gap:12px}
  #view-home .dest-ver-btn{font-size:11px}
  #view-home .icbody{padding:13px 12px 9px}.ictit{font-size:16px!important}.icfoot{padding:10px 12px 12px!important}
  #view-home #sec-imoveis-semana{padding:56px 20px 54px!important}
}
@media(prefers-reduced-motion:reduce){#view-home .navq-card,#view-home .lch-card,#view-home .icard,#view-home .ccard,#view-home .qfilter-card{transition:none}}
</style>
'''
if 'home-premium-refresh' not in text:
    text = text.replace('</head>', style + '</head>', 1)
path.write_text(text)
print(path)
