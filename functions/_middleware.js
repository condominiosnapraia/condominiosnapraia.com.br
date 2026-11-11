const FAVORITES_SCRIPT = '<script src="/js/favoritos.js?v=accessibility-20260821" defer></script>';
const LEGACY_REDIRECTS = {
  '/condominio-maquine-la-marina-': '/condominio-maquine-la-marina/',
  '/condominio-maquine-la-marina-/': '/condominio-maquine-la-marina/',
  '/condominio-xangri-la-villas-resort-': '/condominio-xangri-la-villas-resort/',
  '/condominio-xangri-la-villas-resort-/': '/condominio-xangri-la-villas-resort/',
  '/politica-de-privacidade': '/politica-privacidade/',
  '/politica-de-privacidade/': '/politica-privacidade/',
};

const BLOCKED_ADMIN_PATHS = new Set([
  '/exportar-dados', '/exportar-dados.html',
  '/restaurar', '/restaurar.html',
  '/teste-fotos', '/teste-fotos.html',
]);

const PORTAL_MEULITORAL_HOSTS = new Set([
  'portalmeulitoral.com.br',
  'www.portalmeulitoral.com.br',
]);

const ATLANTIDA_NEGOCIOS_HOSTS = new Set([
  'atlantidanegocios.com.br',
  'www.atlantidanegocios.com.br',
]);
const MARCOS_SELBACH_HOSTS = new Set([
  'marcosselbach.com.br',
  'www.marcosselbach.com.br',
]);
const ATLANTIDA_WHATSAPP = '5551981348907';
const ATLANTIDA_WHATSAPP_SCRIPT = `<script id="atlantida-whatsapp-routing">
  (function(){
    var numero='${ATLANTIDA_WHATSAPP}';
    function corrigir(root){
      (root||document).querySelectorAll('a[href]').forEach(function(a){
        var href=a.getAttribute('href');
        if(!href) return;
        var novo=href
          .replace(/(wa\\.me\\/)\\d+/ig,'$1'+numero)
          .replace(/([?&]phone=)\\d+/ig,'$1'+numero)
          .replace(/^tel:\\+?\\d+/i,'tel:+'+numero);
        if(novo!==href) a.setAttribute('href',novo);
      });
    }
    function iniciar(){
      corrigir(document);
      if(!document.documentElement || !window.MutationObserver) return;
      new MutationObserver(function(){corrigir(document);}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['href']});
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',iniciar,{once:true}); else iniciar();
  }());
</script>`;

const PORTAL_MEULITORAL_STYLE = `<style id="portal-meu-litoral-theme">
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
  .portal-meu-litoral{--portal-navy:#071d49;--portal-blue:#0c78a4;--portal-gold:#b8872e;--portal-sand:#fbf8f0;font-family:'Montserrat',Outfit,Arial,sans-serif}
  .portal-meu-litoral .hero-brand-name,.portal-meu-litoral .sectit,.portal-meu-litoral .lch-tit,.portal-meu-litoral .ictit,.portal-meu-litoral .ctit,.portal-meu-litoral .navq-t,.portal-meu-litoral .pcred-t,.portal-meu-litoral .bcid-nome,.portal-meu-litoral .vpc2-body h3{font-family:'Cormorant Garamond',Fraunces,Georgia,serif;color:var(--portal-navy)}
  .portal-meu-litoral .hero-brand-name{letter-spacing:-.025em;font-weight:600;color:#fff7e8}
  .portal-meu-litoral .hero-brand-tagline,.portal-meu-litoral .hero-brand-kicker,.portal-meu-litoral .eyebrow,.portal-meu-litoral .sectit-sub{font-family:'Montserrat',Outfit,Arial,sans-serif}
  .portal-meu-litoral .hero-brand-tagline{color:#f1d18a}
  .portal-meu-litoral .sectit-sub,.portal-meu-litoral .eyebrow{color:var(--portal-gold)}
  .portal-meu-litoral .dh-nav a{font-family:'Montserrat',Outfit,Arial,sans-serif;color:var(--portal-navy)}
  .portal-meu-litoral .dh-nav a:hover{color:var(--portal-blue);background:rgba(12,120,164,.1)}
  .portal-meu-litoral a[href="/sobre/"]{display:none!important}
  @media(min-width:981px){.portal-meu-litoral .desk-header-inner{justify-content:center;position:relative}.portal-meu-litoral .desk-header .dh-logo{display:none!important}.portal-meu-litoral .desk-header .dh-nav{flex:1 1 auto;width:100%;justify-content:space-between;gap:0}.portal-meu-litoral .desk-header .dh-nav a{flex:1 1 0;text-align:center;padding-left:8px;padding-right:8px}.portal-meu-litoral .desk-header .dh-nav a[href="/turismo/"],.portal-meu-litoral .desk-header .dh-nav a[href="/sobre/"]{display:none!important}.portal-meu-litoral .desk-header .dh-cta{display:none!important}.portal-meu-litoral .page-footer .ftr-col-brand .ftr-brand-lockup{align-items:center;width:250px;max-width:100%;margin-left:auto;margin-right:auto;text-align:center}.portal-meu-litoral .page-footer .ftr-brand-lockup .hero-brand-name{font-size:clamp(28px,2.8vw,38px)!important;line-height:.95;white-space:normal}.portal-meu-litoral .page-footer .ftr-brand-lockup .hero-brand-tagline{font-size:7px}}
  .portal-meu-litoral .vpc2-btn,.portal-meu-litoral .dest-ver-btn{background:var(--portal-gold);border-color:var(--portal-gold);color:#fff}
  .portal-meu-litoral .navq-arrow,.portal-meu-litoral .bcid-go,.portal-meu-litoral .pcred-go{color:var(--portal-blue)}
  .portal-meu-litoral .desk-header .dh-logo{width:218px;height:50px;background:url('/img/branding/portal-meu-litoral-logo.jpg') center left/contain no-repeat}
  .portal-meu-litoral .desk-header .dh-logo img{display:none}
  .portal-meu-litoral #view-home .hero{background-image:url('/img/branding/portal-meu-litoral-hero.jpg')!important;background-position:center 56%;background-size:cover}
  .portal-meu-litoral #view-home > .qr-sec,.portal-meu-litoral #view-home > #pcred-sec-sec,.portal-meu-litoral #view-home > #sec-blog-preview{display:none!important}
  .portal-meu-litoral #view-home .qfilter-bg[data-foto-card="filtro-fora-condominio"]{background-image:url('https://cddgkhkzcnyzzcllgzoz.supabase.co/storage/v1/object/public/fotos/imov/mu8c0o0olaj/imovel-casa-a-venda-em-capao-da-canoa-bairro-girassol-1-1789819206047.jpg')!important;background-size:cover!important;background-position:center!important}
  .portal-meu-litoral #view-home .qfilter-bg[data-foto-card="filtro-apartamentos"]{background-image:url('https://cddgkhkzcnyzzcllgzoz.supabase.co/storage/v1/object/public/fotos/cond/atlantida-green-square-mt3j/condominio-xangri-la-atlantida-green-square-1-1787351775272.jpg')!important;background-size:cover!important;background-position:center!important}
  .portal-meu-litoral #view-home .qfilter-card::after{background:linear-gradient(180deg,rgba(7,29,73,.12) 0%,rgba(7,29,73,.5) 42%,rgba(7,29,73,.94) 100%)!important}
  .portal-meu-litoral #view-home .qfilter-body{text-shadow:0 2px 5px rgba(0,0,0,.78),0 1px 14px rgba(0,0,0,.48)}
  .portal-meu-litoral #view-home .qfilter-lbl{color:#fff!important}
  .portal-meu-litoral #view-home .qfilter-go{color:#ffe09a!important;font-weight:700;text-shadow:0 1px 4px rgba(0,0,0,.8)}
  .portal-meu-litoral #view-home .qfilter-lbl{font-size:24px!important;line-height:1.12}
  .portal-meu-litoral #view-home .qfilter-lbl{font-family:'Cormorant Garamond',Fraunces,Georgia,serif;font-weight:500!important;letter-spacing:.01em;text-shadow:0 2px 6px rgba(0,0,0,.82),0 1px 16px rgba(0,0,0,.5)}
  .portal-meu-litoral #view-home .qfilter-go{font-family:'Montserrat',Outfit,Arial,sans-serif;font-size:15px!important;font-weight:500!important;letter-spacing:.02em}
  .portal-meu-litoral #view-home .qfilter-eyebrow,.portal-meu-litoral #view-home .qfilter-title,.portal-meu-litoral #view-home .qfilter-body{text-align:center!important}
  .portal-meu-litoral #view-home .qfilter-card{align-items:center!important}
  .portal-meu-litoral #view-home .qfilter-body{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:22px 20px!important}
  .portal-meu-litoral #view-home .qfilter-lbl{display:block;width:100%;text-align:center!important}
  .portal-meu-litoral #view-home .qfilter-go{margin-left:auto;margin-right:auto}
  .portal-meu-litoral #view-home .lch-tag{display:none!important}
  @media(max-width:768px){.portal-meu-litoral #view-home .hero{background-position:center 58%;background-size:cover}.portal-meu-litoral #view-home .qfilter-lbl{font-size:20px!important}.portal-meu-litoral #view-home .qfilter-go{font-size:13.5px!important}}
</style>`;

const PORTAL_MEULITORAL_HOME_ORDER = `<script id="portal-meu-litoral-home-order">
  (function(){
    function arrangePortalHome(){
      var home=document.getElementById('view-home');
      if(!home) return;
      ['qr-sec','pcred-sec-sec','sec-blog-preview','viver-intro-sec','viver-lagoa','viver-mar','viver-cidade','guias-cidades','guias-decisao'].forEach(function(id){var section=document.getElementById(id);if(section&&section.parentElement===home)section.remove();});
      var order=['qfilter2','sec-apartamentos','sec-imoveis','sec-fora-cond','sec-terrenos','sec-condominios','sec-condominios-verticais','sec-imoveis-semana','lch-sec-sec'];
      order.forEach(function(id){var section=document.getElementById(id);if(section&&section.parentElement===home)home.appendChild(section);});
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arrangePortalHome,{once:true});else arrangePortalHome();
  }());
</script>`;

const ATLANTIDA_NEGOCIOS_HOME_ORDER = `<script id="atlantida-negocios-home-order">
  (function(){
    function arrangeAtlantidaHome(){
      var home=document.getElementById('view-home');
      if(!home) return;
      ['qfilter2','qr-sec','pcred-sec-sec','sec-blog-preview','viver-intro-sec','viver-lagoa','viver-mar','viver-cidade','guias-cidades','guias-decisao'].forEach(function(id){var section=document.getElementById(id);if(section&&section.parentElement===home)section.remove();});
      var order=['sec-fora-cond','sec-apartamentos','sec-imoveis','sec-terrenos','sec-condominios-verticais','sec-condominios','sec-imoveis-semana','lch-sec-sec'];
      order.forEach(function(id){var section=document.getElementById(id);if(section&&section.parentElement===home)home.appendChild(section);});
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arrangeAtlantidaHome,{once:true});else arrangeAtlantidaHome();
  }());
</script>`;

const ATLANTIDA_NEGOCIOS_STYLE = `<style id="atlantida-negocios-theme">
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
  .atlantida-negocios{--atl-navy:#25313a;--atl-gold:#b58b45;font-family:'Montserrat',Outfit,Arial,sans-serif}
  .atlantida-negocios .desk-header-inner{justify-content:center;position:relative}
  .atlantida-negocios .desk-header .dh-logo{display:none!important}
  .atlantida-negocios .desk-header .dh-nav{flex:1 1 auto;width:100%;justify-content:space-between;gap:0}
  .atlantida-negocios .desk-header .dh-nav a{flex:1 1 0;text-align:center;padding-left:8px;padding-right:8px}
  .atlantida-negocios .desk-header .dh-nav a[href="/turismo/"],.atlantida-negocios .desk-header .dh-nav a[href="/sobre/"]{display:none!important}
  .atlantida-negocios .desk-header .dh-cta{display:none!important}
  .atlantida-negocios a[href="/sobre/"]{display:none!important}
  .atlantida-negocios #view-home .hero-brand-lockup{background:transparent;box-shadow:none;width:max-content;height:auto;padding:0}
  .atlantida-negocios #view-home .hero-brand-lockup>*{visibility:visible}
  .atlantida-negocios #view-home .hero-brand-kicker{display:none!important}
  .atlantida-negocios #view-home .hero-brand-name{font-size:0!important;line-height:0;width:clamp(280px,34vw,430px);aspect-ratio:2817/1146;height:auto;background:url('/assets/atlantida-logo-white.png') center/contain no-repeat;text-shadow:none}
  .atlantida-negocios #view-home .hero-brand-underline{display:none!important}
  .atlantida-negocios #view-home .hero-bg{background:linear-gradient(180deg,rgba(7,29,48,.34) 0%,rgba(7,29,48,.44) 52%,rgba(7,29,48,.62) 100%)!important}
  .atlantida-negocios #view-home .hero-h1{color:#fff!important;text-shadow:0 3px 18px rgba(0,0,0,.82),0 1px 4px rgba(0,0,0,.9)}
  .atlantida-negocios #view-home .hero-h1 em{color:#ffe09a!important}
  .atlantida-negocios #view-home .hero-brand-tagline,.atlantida-negocios #view-home .hero-desc{color:#fff!important;text-shadow:0 2px 12px rgba(0,0,0,.9),0 1px 3px rgba(0,0,0,.85)}
  .atlantida-negocios #view-home .hero-brand-tagline{color:#ffe09a!important}
  .atlantida-negocios #view-home .hero{background-image:url('/img/branding/atlantida-negocios-hero.jpg')!important;background-position:center 56%;background-size:cover}
  .atlantida-negocios .page-footer .ftr-brand-lockup{align-items:center;width:220px;max-width:100%;margin-left:auto;margin-right:auto;text-align:center;background:transparent;border-radius:0;padding:10px 14px;box-sizing:border-box;background-image:url('/assets/atlantida-logo-white.png');background-repeat:no-repeat;background-position:center;background-size:contain;min-height:76px}
  .atlantida-negocios .page-footer .ftr-brand-lockup>*{visibility:hidden}
  .atlantida-negocios .sectit-sub,.atlantida-negocios .eyebrow{color:var(--atl-gold)}
  @media(min-width:981px){.atlantida-negocios .page-footer .ftr-col-brand .ftr-brand-lockup{align-items:center;width:220px;max-width:100%;margin-left:auto;margin-right:auto;text-align:center}}
  @media(max-width:600px){.atlantida-negocios #view-home .hero-brand-name{width:min(82vw,310px);aspect-ratio:2817/1146}.atlantida-negocios #view-home .hero-brand-lockup{margin-bottom:28px}}
  @media(max-width:600px){.atlantida-negocios #view-home .hero-brand-name{font-size:clamp(40px,12.4vw,54px)}.atlantida-negocios .page-footer .ftr-brand-lockup{width:200px;min-height:70px}}
</style>`;

const MARCOS_SELBACH_STYLE = `<style id="marcos-selbach-theme">
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
  .marcos-selbach{--marcos-ink:#182b2d;--marcos-deep:#102326;--marcos-teal:#225b59;--marcos-sand:#ffffff;--marcos-paper:#fbfaf7;--marcos-copper:#bd8058;--marcos-line:rgba(24,43,45,.14);font-family:'DM Sans',Arial,sans-serif;background:var(--marcos-sand)!important;color:var(--marcos-ink)}
  .marcos-selbach .site-header{background:#102326!important;border-bottom:1px solid rgba(255,255,255,.14);box-shadow:0 10px 30px rgba(16,35,38,.12)}
  .marcos-selbach .site-header .nav{max-width:1320px;padding:19px 34px}
  .marcos-selbach .site-header .brand-name,.marcos-selbach .footer-logo,.marcos-selbach .footer-title{font-family:'DM Serif Display',Georgia,serif;color:#f8f2e9}
  .marcos-selbach .site-header .brand-name{font-size:22px;letter-spacing:.015em}.marcos-selbach .site-header .brand-sub{color:#c99572;letter-spacing:.2em}
  .marcos-selbach .site-header .nav-links{gap:6px}.marcos-selbach .site-header .nav-links>a{border:0;border-radius:2px;color:#e8e1d8;background:transparent;letter-spacing:.06em}.marcos-selbach .site-header .nav-links>a:hover{background:#bd8058;color:#102326}.marcos-selbach .site-header .nav-links>.nav-cta{background:#bd8058;color:#102326}
  .marcos-selbach .hero{min-height:690px;background:#102326!important;isolation:isolate;overflow:hidden}
  .marcos-selbach .hero-photo-overlay{position:absolute;inset:0 0 0 43%;z-index:0;background-image:linear-gradient(90deg,#102326 0%,rgba(16,35,38,.7) 14%,rgba(16,35,38,.08) 45%),linear-gradient(0deg,rgba(16,35,38,.72),transparent 48%),url('https://condominiosnapraia.com.br/img/parceiro-capa-desktop.jpg');background-size:cover;background-position:center;background-repeat:no-repeat;clip-path:polygon(11% 0,100% 0,100% 100%,0 100%)}
  .marcos-selbach .hero:before{content:'MARCO SELBACH';position:absolute;right:36px;top:118px;color:rgba(248,242,233,.46);font-size:10px;letter-spacing:.32em;writing-mode:vertical-rl;z-index:2}.marcos-selbach .hero:after{content:'';position:absolute;left:34px;right:34px;bottom:28px;border-bottom:1px solid rgba(248,242,233,.3);z-index:2}
  .marcos-selbach .hero-grid{position:relative;z-index:3;max-width:1320px;min-height:690px;padding:148px 34px 82px;grid-template-columns:minmax(0,510px) 1fr;gap:60px;align-items:center}
  .marcos-selbach .hero-copy{max-width:520px}.marcos-selbach .hero-kicker{color:#c99572;letter-spacing:.28em;font-size:10px}.marcos-selbach .hero-kicker i{background:#c99572}.marcos-selbach .hero-broker-name{font-family:'DM Serif Display',Georgia,serif;font-size:clamp(58px,7vw,100px);line-height:.88;letter-spacing:-.045em;color:#f8f2e9;text-wrap:balance}.marcos-selbach .hero-broker-meta{margin-top:17px;color:#d8b291;letter-spacing:.24em;font-size:11px}.marcos-selbach .hero-title-clean{max-width:450px;margin-top:30px!important;font-family:'DM Serif Display',Georgia,serif;font-size:clamp(28px,3.5vw,49px);line-height:1.02;color:#f8f2e9}.marcos-selbach .hero-title-clean span+span{color:#d8b291}.marcos-selbach .hero-whatsapp{margin-top:34px;border-radius:2px;background:#bd8058;color:#102326;box-shadow:0 14px 35px rgba(0,0,0,.25);letter-spacing:.08em;text-transform:uppercase;font-size:11px}
  .marcos-selbach .hero-broker-photo-wrap{display:none!important}.marcos-selbach .hero-broker-photo-empty{display:none!important}
  .marcos-selbach .main{max-width:1320px;padding:70px 34px 130px}.marcos-selbach .search-panel{margin:-112px 0 58px;position:relative;z-index:5;border:1px solid var(--marcos-line);border-radius:2px;background:rgba(251,250,247,.97);box-shadow:0 24px 70px rgba(16,35,38,.18);padding:31px 34px}.marcos-selbach .search-head h2,.marcos-selbach .section-head h2,.marcos-selbach .sr-title{font-family:'DM Serif Display',Georgia,serif;color:var(--marcos-ink);letter-spacing:-.03em}.marcos-selbach .search-head h2{font-size:38px}.marcos-selbach .search-form input,.marcos-selbach .search-form select{border-radius:2px;background:#f4f0e8;border-color:var(--marcos-line)}.marcos-selbach .search-form button{border-radius:2px;background:var(--marcos-teal);box-shadow:none}.marcos-selbach .category-chip{border-radius:2px;background:#f8f4ec;box-shadow:none}.marcos-selbach .category-chip>span{border-radius:2px;background:#e3e9e2}
  .marcos-selbach .property-section{padding:68px 0 54px}.marcos-selbach .property-section.section-tone-soft{margin-left:-34px;margin-right:-34px;padding:68px 34px 58px;border-radius:0;background:rgba(251,250,247,.72);border-top:1px solid var(--marcos-line);border-bottom:1px solid var(--marcos-line)}.marcos-selbach .section-head{margin-bottom:30px}.marcos-selbach .section-head h2{font-size:clamp(38px,4.7vw,64px)}.marcos-selbach .section-head h2 small,.marcos-selbach .eyebrow{color:var(--marcos-copper);letter-spacing:.2em}.marcos-selbach .property-grid,.marcos-selbach .condos-grid{gap:26px}.marcos-selbach .property-card,.marcos-selbach .condo-card{border-radius:2px;background:var(--marcos-paper);border-color:var(--marcos-line);box-shadow:0 10px 28px rgba(16,35,38,.07)}.marcos-selbach .property-card:hover,.marcos-selbach .condo-card:hover{transform:translateY(-6px);box-shadow:0 22px 42px rgba(16,35,38,.14);border-color:rgba(189,128,88,.55)}.marcos-selbach .property-photo,.marcos-selbach .condo-photo{aspect-ratio:4/3;background:#d9dfda}.marcos-selbach .property-badge{border-radius:2px;background:#bd8058;color:#102326}.marcos-selbach .property-body h3,.marcos-selbach .condo-body h3{font-family:'DM Serif Display',Georgia,serif;font-size:24px;color:var(--marcos-ink)}.marcos-selbach .property-body strong{color:var(--marcos-teal);font-size:18px}.marcos-selbach .property-link{border-radius:2px;background:var(--marcos-teal);color:#f8f2e9}.marcos-selbach .property-interest,.marcos-selbach .section-more-btn{border-radius:2px;color:var(--marcos-teal);border-color:rgba(34,91,89,.35);background:transparent}.marcos-selbach .section-more-btn:hover{background:var(--marcos-teal);color:#f8f2e9}
  .marcos-selbach footer{background:#102326;color:#eee7dd}.marcos-selbach footer a{color:#d8b291}.marcos-selbach .footer-bottom{border-top-color:rgba(255,255,255,.16)}.marcos-selbach .floating-wpp{background:#bd8058;color:#102326}.marcos-selbach .mob-footer-nav{background:rgba(16,35,38,.97);border-top-color:rgba(189,128,88,.35);box-shadow:0 -8px 24px rgba(16,35,38,.25)}.marcos-selbach .mob-footer-btn{color:#d9d2c8!important}.marcos-selbach .mob-footer-btn.active,.marcos-selbach .mob-footer-btn:hover{color:#d8b291!important}
  @media(max-width:980px){.marcos-selbach .hero{min-height:670px}.marcos-selbach .hero-photo-overlay{inset:0 0 38% 0;clip-path:none;background-image:linear-gradient(180deg,rgba(16,35,38,.05),rgba(16,35,38,.78)),url('https://condominiosnapraia.com.br/img/parceiro-capa-mobile.jpg');background-position:center;background-size:cover}.marcos-selbach .hero:before{right:18px;top:112px}.marcos-selbach .hero-grid{grid-template-columns:1fr;gap:0;min-height:670px;padding:330px 22px 60px;align-items:end}.marcos-selbach .hero-copy{max-width:580px}.marcos-selbach .hero-broker-name{font-size:clamp(58px,13vw,88px)}.marcos-selbach .hero-broker-photo-wrap{display:none}.marcos-selbach .main{padding:62px 18px 120px}.marcos-selbach .search-panel{margin-top:-92px;margin-left:0;margin-right:0;padding:25px}.marcos-selbach .property-section.section-tone-soft{margin-left:-18px;margin-right:-18px;padding-left:18px;padding-right:18px}}
  @media(max-width:600px){.marcos-selbach .site-header{display:none!important}.marcos-selbach .hero{min-height:650px}.marcos-selbach .hero-photo-overlay{inset:0 0 42% 0}.marcos-selbach .hero-grid{min-height:650px;padding:300px 20px 46px}.marcos-selbach .hero-broker-name{font-size:clamp(52px,16vw,76px)}.marcos-selbach .hero-title-clean{font-size:32px;margin-top:23px!important}.marcos-selbach .hero-whatsapp{margin-top:26px}.marcos-selbach .search-head{display:block}.marcos-selbach .search-head p{margin-top:8px}.marcos-selbach .search-panel{margin-top:-72px;padding:22px 18px}.marcos-selbach .property-grid,.marcos-selbach .condos-grid{grid-template-columns:1fr;gap:20px}.marcos-selbach .property-section{padding-top:48px}.marcos-selbach .section-head h2{font-size:44px}.marcos-selbach .property-card,.marcos-selbach .condo-card{border-radius:2px}}
</style>`;

const MARCOS_SELBACH_REFINEMENT = `<style id="marcos-selbach-refinement">
  .marcos-selbach{--marcos-ink:#163f56;--marcos-deep:#073b56;--marcos-teal:#178c91;--marcos-sand:#ffffff;--marcos-paper:#fffdf8;--marcos-copper:#d08d67;--marcos-line:rgba(22,63,86,.14);font-family:'DM Sans',Arial,sans-serif;background:var(--marcos-sand)!important;color:var(--marcos-ink)}html.marcos-selbach,html.marcos-selbach body{background:#fff!important}
  .marcos-selbach .site-header{background:#073b56!important}.marcos-selbach .site-header .brand-name,.marcos-selbach .footer-logo,.marcos-selbach .footer-title{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500}.marcos-selbach .site-header .brand-name{font-size:20px}.marcos-selbach .site-header .brand-sub{color:#8fd0ca}.marcos-selbach .site-header .nav-links>a{color:#eef8f6}.marcos-selbach .site-header .nav-links>a:hover,.marcos-selbach .site-header .nav-links>.nav-cta{background:#f0c68c;color:#073b56}
  .marcos-selbach .hero{background:#073b56!important}.marcos-selbach .hero-photo-overlay{background-image:linear-gradient(90deg,#073b56 0%,rgba(7,59,86,.54) 18%,rgba(7,59,86,.04) 49%),linear-gradient(0deg,rgba(7,59,86,.45),transparent 52%),url('https://marcosselbach.com.br/assets/marco-selbach.png');background-position:center right}.marcos-selbach .hero:before{color:rgba(238,248,246,.5)}.marcos-selbach .hero:after{border-bottom-color:rgba(238,248,246,.3)}
  .marcos-selbach .hero-kicker,.marcos-selbach .hero-broker-meta{color:#a9ddd5}.marcos-selbach .hero-kicker i{background:#a9ddd5}.marcos-selbach .hero-broker-name,.marcos-selbach .hero-title-clean{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;letter-spacing:-.025em}.marcos-selbach .hero-broker-name{font-size:clamp(48px,6vw,76px);line-height:.94}.marcos-selbach .hero-title-clean{font-size:clamp(25px,3vw,40px);line-height:1.08}.marcos-selbach .hero-title-clean span+span{color:#f0c68c}.marcos-selbach .hero-whatsapp{background:#f0c68c;color:#073b56}
  .marcos-selbach .main{background:#fff!important}.marcos-selbach .property-sections,.marcos-selbach .property-section,.marcos-selbach .section-tone-soft,.marcos-selbach .category-nav{background:#fff!important}.marcos-selbach .category-chip{background:#fff!important}.marcos-selbach .search-panel{background:#fff!important;box-shadow:0 18px 45px rgba(7,59,86,.12)}.marcos-selbach .search-head h2,.marcos-selbach .section-head h2,.marcos-selbach .sr-title{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;letter-spacing:-.015em}.marcos-selbach .search-head h2{font-size:32px}.marcos-selbach .section-head h2{font-size:clamp(32px,4vw,50px)}.marcos-selbach .section-head h2 small,.marcos-selbach .eyebrow{color:#178c91}.marcos-selbach .property-section.section-tone-soft{background:#fff!important}.marcos-selbach .property-body h3,.marcos-selbach .condo-body h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:22px}.marcos-selbach .property-link{background:#178c91}.marcos-selbach .property-badge{background:#f0c68c;color:#073b56}.marcos-selbach .property-interest,.marcos-selbach .section-more-btn{color:#16727a;border-color:rgba(23,140,145,.35)}.marcos-selbach footer{background:#073b56}.marcos-selbach footer a{color:#a9ddd5}.marcos-selbach .floating-wpp{background:#f0c68c;color:#073b56}.marcos-selbach .mob-footer-nav{background:rgba(7,59,86,.97);border-top-color:rgba(169,221,213,.35)}.marcos-selbach .mob-footer-btn.active,.marcos-selbach .mob-footer-btn:hover{color:#f0c68c!important}
  @media(max-width:980px){.marcos-selbach .hero-photo-overlay{background-image:linear-gradient(180deg,rgba(7,59,86,.05),rgba(7,59,86,.78)),url('https://marcosselbach.com.br/assets/marco-selbach.png');background-position:center 22%}.marcos-selbach .hero-broker-name{font-size:clamp(48px,12vw,70px)}}
  @media(max-width:600px){.marcos-selbach .hero-broker-name{font-size:clamp(46px,14vw,64px)}.marcos-selbach .hero-title-clean{font-size:28px}.marcos-selbach .section-head h2{font-size:38px}}
</style>`;

const MARCOS_SELBACH_RESPONSIVE = `<style id="marcos-selbach-responsive">
  .marcos-selbach .site-header{position:absolute!important;top:0!important;left:0!important;right:0!important;width:100%!important;background:transparent!important;border-bottom:1px solid rgba(255,255,255,.24)!important;box-shadow:none!important;z-index:20!important}.marcos-selbach .site-header .nav{background:transparent!important}
  @media(min-width:981px){.marcos-selbach .hero{min-height:620px}.marcos-selbach .hero-photo-overlay{inset:0 0 0 45%;background-position:68% center}.marcos-selbach .hero-grid{min-height:620px;padding:120px 34px 70px;grid-template-columns:minmax(0,470px) 1fr;gap:48px}.marcos-selbach .hero-broker-name{font-size:clamp(48px,5.2vw,70px)}.marcos-selbach .hero-title-clean{font-size:clamp(24px,2.7vw,37px)}.marcos-selbach .main{padding-top:55px}.marcos-selbach .search-panel{margin-top:-82px}.marcos-selbach .property-grid,.marcos-selbach .condos-grid{gap:24px}}
  @media(max-width:980px){.marcos-selbach .hero{min-height:620px}.marcos-selbach .hero-photo-overlay{inset:0 0 44% 0;background-position:center 20%}.marcos-selbach .hero-grid{min-height:620px;padding:286px 22px 45px}.marcos-selbach .hero:before{display:none}.marcos-selbach .search-panel{margin-top:-62px}.marcos-selbach .main{padding-top:52px}}
  @media(max-width:600px){.marcos-selbach .hero{min-height:570px}.marcos-selbach .hero-photo-overlay{inset:0;background-image:linear-gradient(180deg,rgba(7,59,86,.02) 0%,rgba(7,59,86,.03) 34%,rgba(7,59,86,.54) 72%,rgba(7,59,86,.94) 100%),url('https://marcosselbach.com.br/assets/marco-selbach.png');background-position:center 14%;background-size:cover}.marcos-selbach .hero-grid{min-height:570px;padding:270px 20px 34px;align-items:end}.marcos-selbach .hero-broker-name{font-size:clamp(44px,13vw,60px);line-height:.96}.marcos-selbach .hero-title-clean{font-size:26px;line-height:1.08;margin-top:18px!important}.marcos-selbach .hero-whatsapp{margin-top:20px;padding:12px 16px}.marcos-selbach .main{padding:46px 16px 110px}.marcos-selbach .search-panel{margin-top:-50px;padding:20px 16px}.marcos-selbach .search-head h2{font-size:29px}.marcos-selbach .property-section.section-tone-soft{margin-left:0;margin-right:0;padding-left:0;padding-right:0;background:transparent;border:0}.marcos-selbach .section-head h2{font-size:35px}.marcos-selbach .property-grid,.marcos-selbach .condos-grid{gap:18px}}
  .marcos-selbach .marco-mobile-about{display:none}
  @media(min-width:981px){.marcos-selbach .hero-photo-overlay{inset:72px 0 0 50%;clip-path:none;background-position:68% 8%;background-size:cover}.marcos-selbach .hero:before,.marcos-selbach .hero:after{display:none}.marcos-selbach .hero-grid{max-width:1280px;min-height:640px;padding:112px 46px 76px;grid-template-columns:minmax(0,430px) minmax(0,1fr);gap:48px;align-items:center}.marcos-selbach .hero-copy{max-width:430px;padding-right:0;position:relative;top:0}.marcos-selbach .hero-kicker{font-size:11px;letter-spacing:.24em}.marcos-selbach .hero-broker-name{font-size:clamp(48px,4.4vw,62px);line-height:.98;white-space:nowrap;letter-spacing:-.02em}.marcos-selbach .hero-broker-meta{margin-top:24px}.marcos-selbach .hero-title-clean{max-width:390px;margin-top:36px!important;font-size:clamp(28px,2.7vw,38px);line-height:1.08}.marcos-selbach .hero-whatsapp{margin-top:30px}.marcos-selbach .search-panel{background:transparent!important;border:0!important;border-top:1px solid var(--marcos-line)!important;border-bottom:1px solid var(--marcos-line)!important;border-radius:0!important;box-shadow:none!important}.marcos-selbach .property-sections,.marcos-selbach .property-section,.marcos-selbach .property-section.section-tone-soft,.marcos-selbach .section-tone-soft{width:100%;margin-left:0;margin-right:0;padding-left:0;padding-right:0;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important}.marcos-selbach .property-section .empty{min-height:0!important;padding:12px 0!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important}.marcos-selbach .section-head{width:100%;max-width:1180px;margin-left:auto;margin-right:auto}.marcos-selbach .property-grid,.marcos-selbach .condos-grid{width:100%;max-width:1180px;margin-left:auto;margin-right:auto}}
  @media(min-width:981px){.marcos-selbach .hero-copy{display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;max-width:430px;min-height:470px;padding:22px 0 26px}.marcos-selbach .hero-kicker{margin:0!important;line-height:1.25}.marcos-selbach .hero-broker-name{margin:0!important;max-width:100%;white-space:nowrap;line-height:.94;display:block}.marcos-selbach .hero-broker-meta{margin:0!important;line-height:1.3}.marcos-selbach .hero-title-clean{display:flex;flex-direction:column;gap:7px;max-width:340px;margin:0!important;padding:0;border-top:0;line-height:1.1}.marcos-selbach .hero-title-clean span{display:block}.marcos-selbach .hero-whatsapp{margin:0!important}}
  @media(min-width:981px){.marcos-selbach .hero{background:#073b56!important}.marcos-selbach .hero-photo-overlay{inset:72px 0 0 0!important;clip-path:none!important;background-image:linear-gradient(90deg,#073b56 0%,rgba(7,59,86,.96) 20%,rgba(7,59,86,.72) 40%,rgba(7,59,86,.18) 68%,rgba(7,59,86,.05) 100%),linear-gradient(0deg,rgba(7,59,86,.48),transparent 54%),url('https://marcosselbach.com.br/assets/marco-selbach.png')!important;background-position:center 18%!important;background-size:cover!important}.marcos-selbach .hero-grid{grid-template-columns:1fr!important;max-width:1280px!important;padding-left:46px!important;padding-right:46px!important}.marcos-selbach .hero-copy{max-width:500px!important;min-height:470px!important}.marcos-selbach .hero-copy-main{max-width:500px!important}.marcos-selbach .site-header{background:transparent!important}}
  @media(max-width:760px){.marcos-selbach .search-panel{display:none!important}.marcos-selbach .marco-mobile-about{display:block;margin:0 16px 28px;padding:28px 0 4px;border-top:1px solid rgba(23,140,145,.3);border-bottom:1px solid rgba(23,140,145,.18);color:#163f56}.marcos-selbach .marco-mobile-about .eyebrow{display:block;margin-bottom:16px;color:#178c91;font:700 14px/1.3 'DM Sans',Arial,sans-serif;letter-spacing:.01em;text-transform:none}.marcos-selbach .marco-mobile-about p{margin:0 0 14px;font:400 14px/1.65 'DM Sans',Arial,sans-serif;color:#385b67}.marcos-selbach .marco-mobile-about p:last-child{margin-bottom:22px;color:#073b56;font-weight:600}.marcos-selbach .category-nav{margin-top:0!important}.marcos-selbach .mob-footer-nav{background:rgba(255,255,255,.97)!important;border-top:1px solid rgba(22,63,86,.14)!important;box-shadow:0 -5px 18px rgba(22,63,86,.10)!important;backdrop-filter:blur(14px) saturate(130%)}.marcos-selbach .mob-footer-btn{color:#557078!important}.marcos-selbach .mob-footer-btn.active,.marcos-selbach .mob-footer-btn:hover{color:#178c91!important}.marcos-selbach .mob-footer-btn.wpp-btn{color:#178c91!important}}
  /* Navegação rápida Marcos — composição editorial responsiva */
  .marcos-selbach .category-nav{display:grid!important;grid-template-columns:240px minmax(0,1fr);gap:26px;align-items:center;width:min(1180px,100%);margin:0 auto 36px!important;padding:24px 26px!important;background:#f8fbfa!important;border:1px solid rgba(7,59,86,.10)!important;border-radius:6px!important;box-shadow:0 14px 34px rgba(7,59,86,.07)!important;overflow:visible!important}
  .marcos-selbach .category-nav-heading{padding-right:18px;border-right:1px solid rgba(7,59,86,.14)}
  .marcos-selbach .category-nav-heading .eyebrow{display:block;margin:0 0 9px;color:#178c91;font:700 10px/1.2 'DM Sans',Arial,sans-serif;letter-spacing:.20em;text-transform:uppercase}
  .marcos-selbach .category-nav-heading strong{display:block;color:#073b56;font:500 27px/1.02 'Cormorant Garamond',Georgia,serif;letter-spacing:-.02em}
  .marcos-selbach .category-nav-links{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px!important;min-width:0}
  .marcos-selbach .category-nav-links .category-chip{position:relative;display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;grid-template-rows:auto auto!important;column-gap:11px!important;align-items:center;min-width:0;min-height:78px;padding:13px 14px!important;border:1px solid rgba(7,59,86,.12)!important;border-radius:4px!important;background:#fff!important;box-shadow:0 5px 14px rgba(7,59,86,.045)!important;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease!important;overflow:visible!important}
  .marcos-selbach .category-nav-links .category-chip:after{content:'↗';position:absolute;right:10px;top:9px;color:#178c91;font:500 14px/1 'DM Sans',Arial,sans-serif;opacity:.65}
  .marcos-selbach .category-nav-links .category-chip:hover{transform:translateY(-3px)!important;border-color:rgba(23,140,145,.45)!important;box-shadow:0 12px 22px rgba(7,59,86,.10)!important}
  .marcos-selbach .category-nav-links .category-chip>span{grid-row:1/3;display:grid!important;place-items:center;width:34px!important;height:34px!important;border-radius:50%!important;background:#e7f3f0!important;color:#073b56;font-size:17px!important}
  .marcos-selbach .category-nav-links .category-chip strong{display:block;min-width:0;padding-right:12px;color:#073b56;font:600 14px/1.12 'DM Sans',Arial,sans-serif;letter-spacing:-.01em}
  .marcos-selbach .category-nav-links .category-chip small{display:block;margin-top:5px;color:#668087;font:400 10px/1.18 'DM Sans',Arial,sans-serif}
  @media(max-width:980px){.marcos-selbach .category-nav{grid-template-columns:1fr;gap:16px;margin:0 0 30px!important;padding:20px 18px!important;border-radius:6px!important}.marcos-selbach .category-nav-heading{padding:0 0 13px;border-right:0;border-bottom:1px solid rgba(7,59,86,.12)}.marcos-selbach .category-nav-heading strong{font-size:25px}.marcos-selbach .category-nav-links{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px!important}.marcos-selbach .category-nav-links .category-chip{min-height:82px;padding:12px 11px!important}}
  @media(max-width:420px){.marcos-selbach .category-nav{margin-left:0!important;margin-right:0!important;padding:18px 13px!important}.marcos-selbach .category-nav-links{gap:8px!important}.marcos-selbach .category-nav-links .category-chip{grid-template-columns:29px minmax(0,1fr)!important;column-gap:8px!important;min-height:76px;padding:10px 9px!important}.marcos-selbach .category-nav-links .category-chip>span{width:29px!important;height:29px!important;font-size:15px!important}.marcos-selbach .category-nav-links .category-chip strong{font-size:12px}.marcos-selbach .category-nav-links .category-chip small{font-size:9px}}
</style>`;

const ATLANTIDA_CRM_STYLE = `<style id="atlantida-crm-theme">
  :root{--bg:#f4f1eb!important;--sf:#fffdf9!important;--s2:#f6f1e9!important;--s3:#eee7dc!important;--bd:#e4d9c9!important;--bd2:#cdbda8!important;--ac:#9b7138!important;--acd:rgba(155,113,56,.12)!important;--go:#b08242!important;--tx:#23333a!important;--t2:#66747a!important;--t3:#9b9b91!important}
  body{background:linear-gradient(135deg,#f5f0e8 0%,#ebe4d9 100%)!important;color:#23333a!important}
  #login-screen{background:radial-gradient(circle at 15% 15%,rgba(190,151,88,.22),transparent 34%),linear-gradient(135deg,#172b32 0%,#243e42 52%,#102127 100%)!important}
  .login-shell{display:block!important;width:min(520px,calc(100% - 32px))!important;min-height:0!important;max-height:none!important;margin:auto!important;border:1px solid rgba(224,190,130,.3)!important;box-shadow:0 28px 80px rgba(12,25,29,.38)!important;border-radius:26px!important;overflow:hidden!important}
  .login-aside{display:none!important}
  .login-brandmark{display:none!important}
  .login-aside-mid h2{font-family:'DM Serif Display',Georgia,serif!important;font-size:34px!important;letter-spacing:-.02em!important;color:#fff!important}
  .login-aside-mid p{color:#dce5e1!important}
  .login-aside-foot{color:#d8c39d!important;letter-spacing:.08em!important}
  .login-box{background:#fffdf9!important;min-height:520px!important;padding:54px 48px!important}
  #lv-login .login-logo{font-size:0!important;color:#23333a!important;letter-spacing:-.02em}
  #lv-login .login-logo:after{content:'Atlântida Negócios';font-size:30px;display:block}
  .login-sub{color:#a17a43!important;letter-spacing:.18em!important}
  .login-input{background:#fbf8f3!important;border-color:#dfd2c0!important;border-radius:12px!important}
  .login-input:focus{border-color:#b08242!important;box-shadow:0 0 0 3px rgba(176,130,66,.13)!important}
  .login-btn{background:linear-gradient(100deg,#a9793d,#c49a5d)!important;border-radius:999px!important;box-shadow:0 10px 22px rgba(160,116,57,.24)!important}
  .login-link a{color:#9b7138!important}
  .login-footer{color:#9b9b91!important;font-size:0!important}
  .login-footer:after{content:'Atlântida Negócios · Litoral Norte';font-size:11px}
  .brand{font-size:0!important;color:#9b7138!important;letter-spacing:.02em}
  .brand:after{content:'Atlântida CRM';font:600 17px 'DM Sans',sans-serif}
  .topbar{background:#fffdf9!important;border-bottom-color:#e4d9c9!important}
  .sidebar,.rail{background:#fffdf9!important;border-color:#e4d9c9!important}
  .panel{background:transparent!important}
  .pht{color:#23333a!important}
  .btn.bp{background:#9b7138!important}.btn.bp:hover{background:#805b2d!important}
  .tbb-go{background:#9b7138!important}.tbb-go:hover{background:#805b2d!important}
  @media(max-width:900px){#login-screen{padding:16px!important}.login-shell{width:min(480px,100%)!important;border-radius:20px!important}.login-box{width:100%!important;min-height:0!important;padding:42px 28px!important}.brand:after{font-size:15px}}
  @media(max-width:480px){#login-screen{padding:10px!important}.login-shell{width:100%!important}.login-box{padding:34px 22px!important}}
</style>`;

function adminNotFound() {
  return new Response('Not Found', {
    status: 404,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

function isPortalMeuLitoral(url) {
  return PORTAL_MEULITORAL_HOSTS.has(url.hostname.toLowerCase());
}

function isAtlantidaNegocios(url) {
  return ATLANTIDA_NEGOCIOS_HOSTS.has(url.hostname.toLowerCase());
}

function isMarcosSelbach(url) {
  return MARCOS_SELBACH_HOSTS.has(url.hostname.toLowerCase());
}

function marcoInternalPath(pathname) {
  if (pathname === '/' || pathname === '/index.html') return '/corretor/marcos-selbach/';
  if (/^\/(?:imoveis|condominios|contato)\/?$/.test(pathname)) return '/corretor/marcos-selbach/';
  if (/^\/imovel\//.test(pathname)) return `/corretor/marcos-selbach${pathname}`;
  if (/^\/condominio\//.test(pathname)) return `/corretor/marcos-selbach${pathname}`;
  return null;
}

function applyPortalMeuLitoralBrand(rewriter, pageUrl) {
  const canonicalUrl = `${pageUrl.origin}${pageUrl.pathname === '/index.html' ? '/' : pageUrl.pathname}`;
  rewriter
    .on('html', { element(element) { element.setAttribute('class', `${element.getAttribute('class') || ''} portal-meu-litoral`.trim()); } })
    .on('title', { element(element) { element.setInnerContent('Portal Meu Litoral | Imóveis no Litoral Norte Gaúcho'); } })
    .on('meta[property="og:site_name"]', { element(element) { element.setAttribute('content', 'Portal Meu Litoral'); } })
    .on('meta[property="og:title"]', { element(element) { element.setAttribute('content', 'Portal Meu Litoral | Imóveis no Litoral Norte Gaúcho'); } })
    .on('meta[property="og:url"]', { element(element) { element.setAttribute('content', canonicalUrl); } })
    .on('link[rel="canonical"]', { element(element) { element.setAttribute('href', canonicalUrl); } })
    .on('.hero-brand-name', { element(element) { element.setInnerContent('Portal Meu Litoral'); } })
    .on('.hero-brand-tagline', { element(element) { element.setInnerContent('Imóveis e oportunidades no Litoral Norte Gaúcho'); } })
    .on('.ftr-brand-lockup .hero-brand-name', { element(element) { element.setInnerContent('Portal Meu Litoral'); } })
    .on('.dh-logo', { element(element) { element.setAttribute('aria-label', 'Portal Meu Litoral — início'); } })
    .on('head', { element(element) { element.append(PORTAL_MEULITORAL_STYLE, { html: true }); } });
}

function applyAtlantidaNegociosBrand(rewriter, pageUrl) {
  const canonicalUrl = `${pageUrl.origin}${pageUrl.pathname === '/index.html' ? '/' : pageUrl.pathname}`;
  const isCrmPage = pageUrl.pathname === '/crm' || pageUrl.pathname.startsWith('/crm/');
  const isPartnerPage = /^\/(?:corretor|parceiro)\//.test(pageUrl.pathname)
    || /^\/alisson[-]?portella(?:\/|$)/.test(pageUrl.pathname);
  rewriter
    .on('html', { element(element) { element.setAttribute('class', `${element.getAttribute('class') || ''} atlantida-negocios`.trim()); } })
    .on('a', { element(element) {
      if (isPartnerPage) return;
      const href = element.getAttribute('href');
      if (!href) return;
      const updated = href
        .replace(/(wa\.me\/)\d+/ig, `$1${ATLANTIDA_WHATSAPP}`)
        .replace(/([?&]phone=)\d+/ig, `$1${ATLANTIDA_WHATSAPP}`)
        .replace(/^tel:\+?\d+/i, `tel:+${ATLANTIDA_WHATSAPP}`);
      if (updated !== href) element.setAttribute('href', updated);
    } })
    .on('script', { text(text) {
      if (isPartnerPage || !text.text) return;
      const updated = text.text
        .replace(/(https?:\/\/(?:www\.)?wa\.me\/)\d+/ig, `$1${ATLANTIDA_WHATSAPP}`)
        .replace(/(https?:\/\/api\.whatsapp\.com\/send\?phone=)\d+/ig, `$1${ATLANTIDA_WHATSAPP}`)
        .replace(/(\bWPP\s*=\s*['"])\d+(['"])/g, `$1${ATLANTIDA_WHATSAPP}$2`)
        .replace(/(\b(?:phone|telephone)\s*["']?\s*:\s*["']\+?)\d+/ig, `$1${ATLANTIDA_WHATSAPP}`)
        .replaceAll('5551997698450', ATLANTIDA_WHATSAPP);
      if (updated !== text.text) text.replace(updated, { html: true });
    } })
    .on('.hero-brand-name', { element(element) { element.setInnerContent('Atlântida Negócios'); } })
    .on('.hero-brand-tagline', { element(element) { element.setInnerContent('Imóveis e oportunidades no Litoral Norte'); } })
    .on('.ftr-brand-lockup .hero-brand-name', { element(element) { element.setInnerContent('Atlântida Negócios'); } })
    .on('.dh-logo', { element(element) { element.setAttribute('aria-label', 'Atlântida Negócios — início'); } })
    .on('#qfilter2', { element(element) { element.remove(); } })
    .on('#sec-condominios-verticais', { element(element) { element.removeAttribute('hidden'); } })
    .on('a.navq-card[href="/financiamento-imobiliario/"]', { element(element) { element.remove(); } })
    .on('a.navq-card[href="/contemplado-imoveis/"]', { element(element) { element.remove(); } })
    .on('a.navq-card[href="/refinanciamento-imobiliario/"]', { element(element) { element.remove(); } })
    .on('head', { element(element) { element.append(ATLANTIDA_NEGOCIOS_STYLE, { html: true }); } })
    .on('body', { element(element) { if (!isPartnerPage) element.append(ATLANTIDA_WHATSAPP_SCRIPT, { html: true }); } });
  if (isCrmPage) {
    rewriter
      .on('title', { element(element) { element.setInnerContent('Atlântida Negócios | CRM'); } })
      .on('#lv-login .login-logo', { element(element) { element.setInnerContent('Atlântida Negócios'); } })
      .on('.login-footer', { element(element) { element.setInnerContent('Atlântida Negócios · Litoral Norte'); } })
      .on('.brand', { element(element) { element.setInnerContent('Atlântida CRM'); } })
      .on('head', { element(element) { element.append(ATLANTIDA_CRM_STYLE, { html: true }); } });
  }
  if (!isPartnerPage) {
    rewriter
      .on('title', { element(element) { element.setInnerContent('Atlântida Negócios | Imóveis no Litoral Norte'); } })
      .on('meta[property="og:site_name"]', { element(element) { element.setAttribute('content', 'Atlântida Negócios'); } })
      .on('meta[property="og:title"]', { element(element) { element.setAttribute('content', 'Atlântida Negócios | Imóveis no Litoral Norte'); } })
      .on('meta[property="og:url"]', { element(element) { element.setAttribute('content', canonicalUrl); } })
      .on('link[rel="canonical"]', { element(element) { element.setAttribute('href', canonicalUrl); } });
  }
}

function applyMarcosSelbachBrand(rewriter, pageUrl) {
  const canonicalUrl = `${pageUrl.origin}${pageUrl.pathname === '/index.html' ? '/' : pageUrl.pathname}`;
  rewriter
    .on('html', { element(element) { element.setAttribute('class', `${element.getAttribute('class') || ''} marcos-selbach`.trim()); } })
    .on('head', { element(element) { element.append(MARCOS_SELBACH_STYLE, { html: true }); element.append(MARCOS_SELBACH_REFINEMENT, { html: true }); element.append(MARCOS_SELBACH_RESPONSIVE, { html: true }); } })
    .on('title', { element(element) { element.setInnerContent('Marcos Selbach | Imóveis no Litoral Norte'); } })
    .on('meta[property="og:site_name"]', { element(element) { element.setAttribute('content', 'Marcos Selbach'); } })
    .on('meta[property="og:title"]', { element(element) { element.setAttribute('content', 'Marcos Selbach | Imóveis no Litoral Norte'); } })
    .on('link[rel="canonical"]', { element(element) { element.setAttribute('href', canonicalUrl); } })
    .on('meta[property="og:url"]', { element(element) { element.setAttribute('content', canonicalUrl); } });
}

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  if (isMarcosSelbach(url)) {
    const internalPath = marcoInternalPath(path);
    if (internalPath) {
      const target = new URL(internalPath, url);
      target.search = url.search;
      const headers = new Headers(request.headers);
      headers.set('x-public-partner-prefix', '/');
      return fetch(new Request(target, { method: request.method, headers, body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body }));
    }
  }
  const alissonAlias = ['/alisonportela', '/alissonportela'].find((alias) => path === alias || path.startsWith(`${alias}/`));
  if (isAtlantidaNegocios(url) && alissonAlias && (path === alissonAlias || path === `${alissonAlias}/` || path.startsWith(`${alissonAlias}/imoveis`) || path.startsWith(`${alissonAlias}/contato`) || path.startsWith(`${alissonAlias}/condominios`) || path.startsWith(`${alissonAlias}/imovel/`))) {
    const suffix = path.slice(alissonAlias.length) || '/';
    const target = new URL(`/corretor/alisson-portella${suffix}`, url);
    target.search = url.search;
    const forwarded = new Request(target, request);
    const headers = new Headers(forwarded.headers);
    headers.set('x-public-partner-prefix', alissonAlias);
    const response = await fetch(new Request(target, { method: forwarded.method, headers }));
    const internalPrefix = 'https://condominiosnapraia.com.br/corretor/alisson-portella';
    const publicPrefix = `${url.origin}${alissonAlias}`;
    const whatsappSvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.9c0 2.1.5 4.1 1.6 5.9L.2 24l6.4-1.7a11.9 11.9 0 0 0 5.5 1.4h.1c6.5 0 11.8-5.3 11.8-11.9 0-3.1-1.3-6.1-3.5-8.3Zm-8.4 18.2h-.1a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 0 1-1.5-5.2c0-5.4 4.4-9.9 9.9-9.9a9.8 9.8 0 0 1 7 2.9 9.9 9.9 0 0 1 2.9 7c0 5.4-4.4 9.9-9.8 9.9Zm5.4-7.4c-.3-.2-1.7-.9-2-.9-.3-.1-.5 0-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.5-3.7-3.3-.3-.5.3-.6.8-1.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-1-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.2.2 2 3.1 4.9 4.3.7.3 1.3.6 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.2-.7.1-1.2.1-1.4-.1-.1-.3-.3-.6-.4Z"/></svg>`;
    const mobileStyle = `<style id="atlantida-partner-mobile-parity">.mob-footer-btn,.mobile-dock a{background:transparent!important;color:#aaa!important;border:0!important;border-radius:0!important;margin:0!important}.mob-footer-btn.wpp-btn,.mobile-dock a:nth-child(5){background:transparent!important;color:#25d366!important;border:0!important}.mob-footer-ico svg{width:20px;height:20px;display:block;fill:currentColor}</style>`;
    return new HTMLRewriter()
      .on('a', { element(element) { const href = element.getAttribute('href'); if (href && href.startsWith(internalPrefix)) element.setAttribute('href', `${publicPrefix}${href.slice(internalPrefix.length)}`); } })
      .on('link[rel="canonical"]', { element(element) { const href = element.getAttribute('href'); if (href && href.startsWith(internalPrefix)) element.setAttribute('href', `${publicPrefix}${href.slice(internalPrefix.length)}`); } })
      .on('meta[property="og:url"]', { element(element) { const content = element.getAttribute('content'); if (content && content.startsWith(internalPrefix)) element.setAttribute('content', `${publicPrefix}${content.slice(internalPrefix.length)}`); } })
      .on('.mob-footer-btn.wpp-btn .mob-footer-ico', { element(element) { element.setInnerContent(whatsappSvg, { html: true }); } })
      .on('title', { element(element) { element.setInnerContent('Atlântida Negócios | Alisson Portella'); } })
      .on('head', { element(element) { element.append(mobileStyle, { html: true }); } })
      .transform(response);
  }
  if (isAtlantidaNegocios(url) && new Set(['/alison-portela', '/alison-portela/', '/alisson-portela', '/alisson-portela/', '/alisson-portella', '/alisson-portella/']).has(path)) {
    const target = new URL('/corretor/alisson-portella/', url);
    target.search = url.search;
    return fetch(new Request(target, request));
  }
  if ((isPortalMeuLitoral(url) || isAtlantidaNegocios(url)) && (path === '/sobre' || path === '/sobre/')) return Response.redirect(new URL('/', url), 301);
  const legacyTarget = LEGACY_REDIRECTS[path];
  if (legacyTarget) return Response.redirect(new URL(legacyTarget, url), 301);

  if (BLOCKED_ADMIN_PATHS.has(path)) return adminNotFound();

  // Diagnóstico é uma ferramenta interna: não deve responder 200 anônimo.
  // O endpoint público é removido da superfície de produção; o CRM continua intacto.
  if (path === '/diagnostico.html' || path === '/diagnostico' || path.startsWith('/diagnostico/')) {
    return adminNotFound();
  }

  // Favoritos só é necessário na página de favoritos e no detalhe de imóvel.
  // Evita injetar ~10 KiB e iniciar JS extra na homepage, listagens e páginas editoriais.
  const needsFavorites = path === '/favoritos' || path === '/favoritos/' || path === '/imovel' || path === '/imovel/' || path.startsWith('/imovel/');
  const response = await next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('text/html')) return response;
  if (response.status < 200 || response.status >= 300) return response;

  const rewriter = new HTMLRewriter()
    .on('a.wpp-float', {
      element(element) {
        element.setAttribute('aria-label', 'Falar com um consultor pelo WhatsApp');
        element.setAttribute('title', 'Falar com um consultor pelo WhatsApp');
      },
    })
    .on('a.btn-wpp', {
      element(element) {
        element.setAttribute('aria-label', 'Falar com um consultor pelo WhatsApp sobre esta oportunidade');
      },
    });
  if (isPortalMeuLitoral(url)) applyPortalMeuLitoralBrand(rewriter, url);
  if (isPortalMeuLitoral(url) && (path === '/' || path === '/index.html')) {
    rewriter.on('body', { element(element) { element.append(PORTAL_MEULITORAL_HOME_ORDER, { html: true }); } });
  }
  if (isAtlantidaNegocios(url)) applyAtlantidaNegociosBrand(rewriter, url);
  if (isAtlantidaNegocios(url) && (path === '/' || path === '/index.html')) {
    rewriter.on('body', { element(element) { element.append(ATLANTIDA_NEGOCIOS_HOME_ORDER, { html: true }); } });
  }
  if (isMarcosSelbach(url)) applyMarcosSelbachBrand(rewriter, url);
  if (needsFavorites) {
    rewriter.on('head', {
      element(element) {
        element.append(FAVORITES_SCRIPT, { html: true });
      },
    });
  }
  return rewriter.transform(response);
}
