(function(){
  'use strict';
  if(window.__portalFavoritesLoaded)return;
  window.__portalFavoritesLoaded=true;

  const SB_URL='https://cddgkhkzcnyzzcllgzoz.supabase.co';
  const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
  const SESSION_KEY='pml_public_auth_v1';
  const FAV_TABLE='imoveis_favoritos';
  const state={session:null,favoriteIds:new Set(),pendingId:null,modal:null,loading:false};

  const css=`
    .pml-fav-nav,.pml-fav-account{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid rgba(13,59,84,.16);background:#fff;color:#0d3b54;text-decoration:none;border-radius:100px;padding:9px 13px;font:600 11px/1 'Outfit',sans-serif;letter-spacing:.02em;cursor:pointer;white-space:nowrap;transition:transform .18s,border-color .18s,background .18s,color .18s}
    .pml-fav-nav:hover,.pml-fav-account:hover{border-color:#1fb5c4;background:#e8f7f8;transform:translateY(-1px)}
    .pml-fav-nav .heart{display:inline-flex;align-items:center;justify-content:center;color:#c79a3a}.pml-fav-nav .count{min-width:18px;height:18px;padding:0 5px;border-radius:99px;background:#0d3b54;color:#fff;font-size:10px;display:inline-flex;align-items:center;justify-content:center}
    .pml-heart-icon{width:18px;height:18px;display:block;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;transition:fill .18s ease,transform .18s ease}.pml-fav-card-btn.active .pml-heart-icon,.pml-fav-detail-btn.active .pml-heart-icon{fill:currentColor;stroke:currentColor}.pml-fav-mobile-account .pml-heart-icon{width:20px;height:20px}
    .pml-fav-card-btn{position:absolute;top:52px;right:12px;z-index:4;width:40px;height:40px;border:1px solid rgba(255,255,255,.82);border-radius:50%;background:linear-gradient(145deg,rgba(255,255,255,.97),rgba(246,252,253,.82));color:#0d3b54;box-shadow:0 6px 18px rgba(13,59,84,.22);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .18s cubic-bezier(.23,1,.32,1),background .18s ease,color .18s ease,border-color .18s ease,box-shadow .18s ease}
    .pml-fav-card-btn:hover{transform:translateY(-2px) scale(1.05);background:#e8f7f8;color:#0e8a99;border-color:#1fb5c4;box-shadow:0 9px 22px rgba(13,59,84,.24)}.pml-fav-card-btn.active{background:#0d3b54;color:#e0b34d;border-color:#0d3b54;box-shadow:0 7px 20px rgba(13,59,84,.3)}.pml-fav-card-btn:active,.pml-fav-detail-btn:active{transform:scale(.97)}.pml-fav-card-btn:focus-visible,.pml-fav-detail-btn:focus-visible,.pml-fav-nav:focus-visible,.pml-fav-account:focus-visible,.pml-fav-mobile-account:focus-visible{outline:3px solid rgba(31,181,196,.4);outline-offset:2px}
    .pml-fav-detail-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid rgba(13,59,84,.18);background:linear-gradient(145deg,#fff,#f4fafb);color:#0d3b54;border-radius:100px;padding:9px 14px;font:600 12px/1 'Outfit',sans-serif;cursor:pointer;transition:transform .18s cubic-bezier(.23,1,.32,1),background .18s ease,color .18s ease,border-color .18s ease,box-shadow .18s ease;margin-left:auto;box-shadow:0 3px 10px rgba(13,59,84,.07)}.pml-fav-detail-btn:hover{border-color:#1fb5c4;background:#e8f7f8;color:#0e8a99;transform:translateY(-1px);box-shadow:0 6px 15px rgba(13,59,84,.12)}.pml-fav-detail-btn.active{background:#0d3b54;color:#e0b34d;border-color:#0d3b54;box-shadow:0 5px 15px rgba(13,59,84,.22)}
    .pml-account-dot{font-size:12px;line-height:1;color:#0e8a99}.pml-fav-mobile-account .pml-account-dot{font-size:18px}
    @media(prefers-reduced-motion:reduce){.pml-fav-card-btn,.pml-fav-detail-btn,.pml-heart-icon{transition:none}}
    #pml-fav-overlay{position:fixed;inset:0;z-index:1200;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(7,33,48,.66);backdrop-filter:blur(5px)}
    #pml-fav-overlay.open{display:flex}.pml-fav-modal{width:min(460px,100%);max-height:min(700px,92vh);overflow:auto;background:#fff;border-radius:22px;box-shadow:0 24px 80px rgba(0,0,0,.28);padding:30px 28px;position:relative;color:#0d3b54;font-family:'Outfit',sans-serif}.pml-fav-close{position:absolute;right:17px;top:17px;border:0;background:#eef6f7;color:#0d3b54;border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:18px}.pml-fav-brand{font:600 24px/1.15 'Fraunces',serif;margin-bottom:5px}.pml-fav-kicker{color:#c79a3a;font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:20px}.pml-fav-modal h2{font:500 25px/1.2 'Fraunces',serif;margin:0 0 8px}.pml-fav-modal p{font-size:13px;line-height:1.6;color:#5b7585;margin:0 0 19px}.pml-fav-form{display:grid;gap:10px}.pml-fav-form label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#5b7585}.pml-fav-form input{width:100%;box-sizing:border-box;border:1px solid #d9e7ea;background:#f8fbfc;border-radius:9px;padding:12px 13px;font:400 14px 'Outfit',sans-serif;color:#0d3b54}.pml-fav-form input:focus{outline:none;border-color:#1fb5c4;box-shadow:0 0 0 3px rgba(31,181,196,.12)}.pml-fav-primary{border:0;border-radius:100px;background:linear-gradient(135deg,#0e8a99,#1fb5c4);color:#fff;padding:13px 16px;font:700 13px 'Outfit',sans-serif;cursor:pointer;margin-top:4px}.pml-fav-primary:disabled{opacity:.6;cursor:wait}.pml-fav-secondary{border:1px solid #d9e7ea;border-radius:100px;background:#fff;color:#0d3b54;padding:11px 16px;font:600 13px 'Outfit',sans-serif;cursor:pointer}.pml-fav-tabs{display:flex;gap:5px;background:#eef6f7;border-radius:100px;padding:4px;margin:4px 0 20px}.pml-fav-tab{flex:1;border:0;background:transparent;border-radius:100px;padding:9px 8px;color:#5b7585;font:600 12px 'Outfit',sans-serif;cursor:pointer}.pml-fav-tab.active{background:#fff;color:#0d3b54;box-shadow:0 2px 8px rgba(13,59,84,.1)}.pml-fav-msg{font-size:12px;line-height:1.5;padding:10px 12px;border-radius:9px;margin:0 0 12px;display:none}.pml-fav-msg.show{display:block}.pml-fav-msg.err{background:#fff0f0;border:1px solid #f4caca;color:#b42318}.pml-fav-msg.ok{background:#effbf4;border:1px solid #b9e8c8;color:#147a3d}.pml-fav-forgot{border:0;background:transparent;color:#0e8a99;text-decoration:underline;cursor:pointer;font:500 12px 'Outfit',sans-serif;padding:4px 0;text-align:left}.pml-fav-note{font-size:11px!important;color:#8aa0ad!important;margin:13px 0 0!important}.pml-fav-account-view{text-align:center}.pml-fav-avatar{width:50px;height:50px;border-radius:50%;background:#e8f7f8;color:#0e8a99;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font:600 22px 'Fraunces',serif}.pml-fav-account-actions{display:grid;gap:9px;margin-top:20px}    .pml-fav-page{min-height:100vh;background:#f8fbfc;color:#0d3b54;font-family:'Outfit',sans-serif}.pml-fav-page-head{background:linear-gradient(150deg,#0c4a6e,#0891b2);color:#fff;padding:70px 20px 84px;position:relative;overflow:hidden}.pml-fav-page-head:after{content:"";position:absolute;left:-5%;right:-5%;bottom:-48px;height:90px;background:#f8fbfc;border-radius:50% 50% 0 0/100% 100% 0 0}.pml-fav-page-in{max-width:1040px;margin:0 auto;position:relative;z-index:1}.pml-fav-page-kicker{color:#e0b34d;font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:700}.pml-fav-page h1{font:400 clamp(30px,4vw,48px)/1.12 'Fraunces',serif;margin:12px 0 8px}.pml-fav-page h1 em,.pml-fav-client-name{color:#e0b34d}.pml-fav-page-sub{color:rgba(255,255,255,.86);font-size:15px}.pml-fav-page-body{max-width:1040px;margin:-34px auto 0;position:relative;z-index:2;padding:0 20px 80px}.pml-fav-page-card{background:#fff;border:1px solid rgba(31,181,196,.18);border-radius:18px;padding:24px;box-shadow:0 14px 40px rgba(13,59,84,.1)}.pml-fav-sell-card{display:flex;align-items:center;justify-content:space-between;gap:22px;margin-top:34px;margin-bottom:18px;padding:21px 24px;border-radius:18px;background:linear-gradient(135deg,#0d3b54,#0e8a99);color:#fff;box-shadow:0 12px 30px rgba(13,59,84,.14)}.pml-fav-sell-card h2{font:500 23px/1.2 'Fraunces',serif;margin:0 0 5px}.pml-fav-sell-card p{font-size:13px;color:rgba(255,255,255,.8);margin:0;line-height:1.5}.pml-fav-sell-card a{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;background:#e0b34d;color:#0d3b54;border-radius:100px;padding:12px 18px;text-decoration:none;font-size:12px;font-weight:700;transition:transform .18s,background .18s}.pml-fav-sell-card a:hover{background:#f0ca70;transform:translateY(-2px)}.pml-fav-page-actions{display:flex;justify-content:flex-end;margin-bottom:16px}.pml-fav-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.pml-fav-item{border:1px solid rgba(31,181,196,.18);border-radius:14px;overflow:hidden;background:#fff;position:relative}.pml-fav-item-img{display:block;aspect-ratio:4/3;background:#e8f7f8;overflow:hidden}.pml-fav-item-img img{width:100%;height:100%;object-fit:cover}.pml-fav-item-body{padding:14px}.pml-fav-item-type{font-size:10px;color:#c79a3a;text-transform:uppercase;letter-spacing:.12em;font-weight:700}.pml-fav-item-title{font:500 18px/1.2 'Fraunces',serif;margin:5px 0 8px}.pml-fav-item-price{color:#0e8a99;font-weight:700;font-size:14px}.pml-fav-item-remove{position:absolute;right:10px;top:10px;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.94);color:#0d3b54;font-size:18px;cursor:pointer;box-shadow:0 4px 12px rgba(13,59,84,.16)}.pml-fav-empty{text-align:center;padding:48px 18px;color:#5b7585}.pml-fav-empty h2{font:500 26px 'Fraunces',serif;color:#0d3b54;margin-bottom:7px}.pml-fav-empty a{display:inline-flex;margin-top:15px;background:#0d3b54;color:#fff;border-radius:100px;padding:11px 18px;text-decoration:none;font-weight:600;font-size:13px}.pml-fav-loading{text-align:center;padding:42px;color:#5b7585}.pml-fav-badge{display:inline-flex;align-items:center;gap:6px;background:#e8f7f8;color:#0e8a99;border-radius:100px;padding:6px 10px;font-size:11px;font-weight:700}
    @media(max-width:900px){.pml-fav-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:700px){.pml-fav-nav,.pml-fav-account{padding:8px 10px}.pml-fav-nav .label,.pml-fav-account .label{display:none}.pml-fav-detail-btn{margin-left:0}.pml-fav-card-btn{top:58px;right:12px}.pml-fav-page-head{padding-top:50px}.pml-fav-page-body{padding-left:14px;padding-right:14px}.pml-fav-page-card{padding:15px}.pml-fav-sell-card{display:block;padding:20px}.pml-fav-sell-card a{margin-top:15px;width:100%}.pml-fav-grid{grid-template-columns:1fr}.pml-fav-modal{padding:27px 20px;border-radius:18px}}
  `;

  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function brl(v){if(v==null||v==='')return 'Sob consulta';const n=Number(v);return Number.isFinite(n)?n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}):esc(v);}
  function heartSvg(active){return '<svg class="pml-heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"></path></svg>';}
  function storageGet(){try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null');}catch(e){return null;}}
  function storageSet(s){try{if(s)localStorage.setItem(SESSION_KEY,JSON.stringify(s));else localStorage.removeItem(SESSION_KEY);}catch(e){}}
  function sessionUser(){return state.session&&state.session.user?state.session.user:null;}
  function authHeaders(){return {apikey:SB_KEY,Authorization:'Bearer '+(state.session?state.session.access_token:SB_KEY),'Content-Type':'application/json'};}
  function normalizeSession(data){
    if(!data||!data.access_token)return null;
    return {access_token:data.access_token,refresh_token:data.refresh_token||'',expires_at:data.expires_at||Math.floor(Date.now()/1000)+(data.expires_in||3600),user:data.user||null};
  }
  function setSession(data){state.session=normalizeSession(data);storageSet(state.session);updateAccountUi();}
  function clearSession(){state.session=null;state.favoriteIds=new Set();storageSet(null);updateAccountUi();refreshButtons();}
  async function refreshSession(){
    const saved=storageGet();
    if(!saved||!saved.access_token){updateAccountUi();return null;}
    state.session=saved;
    if(saved.expires_at && saved.expires_at>Date.now()/1000+90){updateAccountUi();return saved;}
    if(!saved.refresh_token){clearSession();return null;}
    try{
      const r=await fetch(SB_URL+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:SB_KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:saved.refresh_token})});
      const data=await r.json();
      if(!r.ok||!data.access_token){clearSession();return null;}
      setSession(data);return state.session;
    }catch(e){clearSession();return null;}
  }
  async function authRequest(path,body){
    const r=await fetch(SB_URL+'/auth/v1'+path,{method:'POST',headers:{apikey:SB_KEY,'Content-Type':'application/json'},body:JSON.stringify(body||{})});
    let data={};try{data=await r.json();}catch(e){}
    if(!r.ok)throw new Error(data.error_description||data.msg||data.message||'Não foi possível concluir a operação.');
    return data;
  }
  async function login(email,password){const data=await authRequest('/token?grant_type=password',{email,password});if(!data.access_token)throw new Error('Resposta de login inválida.');setSession(data);await loadFavorites();}
  async function register(nome,telefone,email,password){
    const data=await authRequest('/signup',{email,password,data:{nome,telefone}});
    if(data.access_token){setSession(data);await loadFavorites();return true;}
    return false;
  }
  async function recover(email){await authRequest('/recover',{email});}
  async function logout(){try{if(state.session)await fetch(SB_URL+'/auth/v1/logout',{method:'POST',headers:authHeaders()});}catch(e){}clearSession();if(isFavoritesPage())renderFavoritesPage();}
  async function api(path,options){
    if(!state.session)throw new Error('Faça login para usar os favoritos.');
    const r=await fetch(SB_URL+'/rest/v1/'+path,Object.assign({headers:authHeaders()},options||{}));
    if(r.status===401){clearSession();throw new Error('Sua sessão expirou. Faça login novamente.');}
    if(!r.ok){let msg='Não foi possível salvar o favorito.';try{const d=await r.json();msg=d.message||d.hint||msg;}catch(e){}throw new Error(msg);}
    return r;
  }
  async function loadFavorites(){
    if(!state.session){state.favoriteIds=new Set();refreshButtons();return;}
    try{
      const r=await api(FAV_TABLE+'?select=imovel_id&order=created_at.desc',{method:'GET'});
      const rows=await r.json();state.favoriteIds=new Set((Array.isArray(rows)?rows:[]).map(x=>String(x.imovel_id)));refreshButtons();
      if(isFavoritesPage())renderFavoritesPage();
    }catch(e){if(isFavoritesPage())showPageError(e.message);}
  }
  async function toggleFavorite(button){
    const id=String(button&&button.dataset?button.dataset.favId:'');
    if(!id)return;
    if(!state.session){state.pendingId=id;openModal('login');return;}
    if(state.loading)return;
    state.loading=true;button.disabled=true;
    const active=state.favoriteIds.has(id);
    try{
      if(active){await api(FAV_TABLE+'?usuario_id=eq.'+encodeURIComponent(sessionUser().id)+'&imovel_id=eq.'+encodeURIComponent(id),{method:'DELETE'});state.favoriteIds.delete(id);}
      else{await api(FAV_TABLE,{method:'POST',headers:Object.assign({},authHeaders(),{Prefer:'resolution=ignore-duplicates,return=minimal'}),body:JSON.stringify({usuario_id:sessionUser().id,imovel_id:id})});state.favoriteIds.add(id);}
      refreshButtons();if(isFavoritesPage())renderFavoritesPage();
    }catch(e){showToast(e.message,'err');}finally{state.loading=false;button.disabled=false;}
  }
  function refreshButtons(){
    document.querySelectorAll('[data-fav-id]').forEach(function(btn){
      const active=state.favoriteIds.has(String(btn.dataset.favId));btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',active?'true':'false');
      if(btn.classList.contains('pml-fav-item-remove')){btn.innerHTML='<span aria-hidden="true">×</span>';btn.setAttribute('aria-label','Remover dos favoritos');btn.title='Remover dos favoritos';return;}
      const kind=btn.classList.contains('pml-fav-detail-btn')?'Salvar este imóvel':'Favoritar imóvel';
      btn.innerHTML=heartSvg(active)+'<span class="label">'+(active?'Salvo':'Favoritar')+'</span>';
      btn.setAttribute('aria-label',active?'Remover dos favoritos':kind);
      btn.title=active?'Remover dos favoritos':kind;
    });
    const count=document.getElementById('pml-fav-count');if(count)count.textContent=String(state.favoriteIds.size);
  }
  function showToast(message,type){
    let el=document.getElementById('pml-fav-toast');if(!el){el=document.createElement('div');el.id='pml-fav-toast';el.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:1400;padding:11px 16px;border-radius:100px;font:600 12px Outfit,sans-serif;box-shadow:0 8px 24px rgba(13,59,84,.2);transition:opacity .2s';document.body.appendChild(el);}
    el.textContent=message;el.style.background=type==='err'?'#fff0f0':'#0d3b54';el.style.color=type==='err'?'#b42318':'#fff';el.style.opacity='1';clearTimeout(el._t);el._t=setTimeout(()=>el.style.opacity='0',2600);
  }
  function clientDisplayName(){const user=sessionUser();const meta=user&&user.user_metadata||{};return String(meta.nome||user&&user.email||'cliente').trim()||'cliente';}
  function updatePageGreeting(){if(!isFavoritesPage())return;const h=document.querySelector('#pml-fav-page-head h1');const sub=document.querySelector('#pml-fav-page-head .pml-fav-page-sub');if(!h||!sub)return;const user=sessionUser();if(user){const name=esc(clientDisplayName());h.innerHTML='Olá, <em class="pml-fav-client-name">'+name+'</em>';sub.textContent='Aqui estão os imóveis que você escolheu para acompanhar no Litoral Norte Gaúcho.';}else{h.innerHTML='Seus imóveis <em>favoritos</em>';sub.textContent='Uma seleção particular para você acompanhar as melhores oportunidades do litoral.';}}
  function updateAccountUi(){
    const user=sessionUser();const name=user&&user.user_metadata&&user.user_metadata.nome?String(user.user_metadata.nome).split(' ')[0]:'';
    document.querySelectorAll('[data-pml-account]').forEach(function(btn){const label=user?('Olá, '+esc(name||'cliente')):'Entrar';btn.setAttribute('aria-label',user?'Abrir sua conta de favoritos':'Entrar na conta de favoritos');btn.title=user?'Abrir sua conta de favoritos':'Entrar na conta de favoritos';if(btn.id==='pml-fav-mobile-account')btn.innerHTML='<span class="mob-footer-ico">'+(user?'<span class="pml-account-dot">●</span>':heartSvg(false))+'</span><span class="mob-footer-lbl label">'+label+'</span>';else btn.innerHTML='<span aria-hidden="true">'+(user?'<span class="pml-account-dot">●</span>':heartSvg(false))+'</span><span class="label">'+label+'</span>';});updatePageGreeting();
  }
  function mountHeader(){
    const found=document.querySelector('.desk-header-inner, .pml-fav-site-header, header');
    const header=found&&found.matches('header')?(found.querySelector('.desk-header-inner')||found):found;
    if(header){
      const slot=header.querySelector('.pml-fav-site-account')||header;
      if(!document.getElementById('pml-fav-nav')){
        const nav=document.createElement('a');nav.id='pml-fav-nav';nav.className='pml-fav-nav';nav.href='/favoritos/';nav.innerHTML='<span class="heart">'+heartSvg(false)+'</span><span class="label">Favoritos</span><span class="count" id="pml-fav-count">0</span>';slot.insertBefore(nav,slot.classList.contains('pml-fav-site-account')?null:slot.querySelector('.dh-cta,.hcta'));
      }
      if(!document.getElementById('pml-fav-account')){const btn=document.createElement('button');btn.id='pml-fav-account';btn.className='pml-fav-account';btn.type='button';btn.setAttribute('data-pml-account','1');slot.insertBefore(btn,slot.classList.contains('pml-fav-site-account')?null:slot.querySelector('.dh-cta,.hcta'));}
    }
    const mobile=document.querySelector('.mob-footer-items');
    if(mobile&&!document.getElementById('pml-fav-mobile-account')){const btn=document.createElement('button');btn.id='pml-fav-mobile-account';btn.className='mob-footer-btn pml-fav-mobile-account';btn.type='button';btn.setAttribute('data-pml-account','1');btn.innerHTML='<span class="mob-footer-ico">'+heartSvg(false)+'</span><span class="mob-footer-lbl label">Favoritos</span>';mobile.appendChild(btn);}
    updateAccountUi();refreshButtons();
  }
  function modalHtml(){
    if(document.getElementById('pml-fav-overlay'))return;
    const o=document.createElement('div');o.id='pml-fav-overlay';o.innerHTML='<div class="pml-fav-modal" role="dialog" aria-modal="true" aria-labelledby="pml-fav-title"><button type="button" class="pml-fav-close" data-fav-close aria-label="Fechar">×</button><div class="pml-fav-brand">Portal Meu Litoral</div><div class="pml-fav-kicker">Seus imóveis escolhidos</div><div id="pml-fav-modal-content"></div></div>';document.body.appendChild(o);state.modal=o;
  }
  function msgHtml(id){return '<div class="pml-fav-msg" id="'+id+'"></div>';}
  function openModal(view){
    modalHtml();const content=document.getElementById('pml-fav-modal-content');
    if(sessionUser()){
      const name=esc((sessionUser().user_metadata||{}).nome||sessionUser().email||'Cliente');
      content.innerHTML='<div class="pml-fav-account-view"><div class="pml-fav-avatar">'+name.charAt(0).toUpperCase()+'</div><h2 id="pml-fav-title">Olá, '+name.split(' ')[0]+'</h2><p>Seu cadastro está ativo. Seus imóveis favoritos ficam salvos nesta conta para você consultar quando quiser.</p><div class="pml-fav-account-actions"><a class="pml-fav-primary" href="/favoritos/">Ver meus favoritos</a><button type="button" class="pml-fav-secondary" data-fav-logout>Sair da conta</button></div></div>';
    }else{
      content.innerHTML='<h2 id="pml-fav-title">Salve seus imóveis favoritos</h2><p>Cadastre-se gratuitamente para guardar imóveis, comparar opções e continuar sua busca depois.</p><div class="pml-fav-tabs"><button type="button" class="pml-fav-tab '+(view==='register'?'':'active')+'" data-fav-view="login">Entrar</button><button type="button" class="pml-fav-tab '+(view==='register'?'active':'')+'" data-fav-view="register">Criar cadastro</button></div><div id="pml-fav-auth-area"></div>';
      renderAuthView(view==='register'?'register':'login');
    }
    state.modal.classList.add('open');document.body.style.overflow='hidden';
  }
  function closeModal(){if(state.modal)state.modal.classList.remove('open');document.body.style.overflow='';}
  function renderAuthView(view){
    const area=document.getElementById('pml-fav-auth-area');if(!area)return;
    if(view==='register'){
      area.innerHTML='<form class="pml-fav-form" id="pml-fav-register-form"><label for="pml-fav-name">Nome completo</label><input id="pml-fav-name" required autocomplete="name" placeholder="Seu nome completo"><label for="pml-fav-phone">Telefone ou WhatsApp <span style="font-weight:400;text-transform:none;letter-spacing:0">(opcional)</span></label><input id="pml-fav-phone" autocomplete="tel" placeholder="(51) 99999-9999"><label for="pml-fav-email">E-mail</label><input id="pml-fav-email" type="email" required autocomplete="email" placeholder="seu@email.com"><label for="pml-fav-pass">Senha</label><input id="pml-fav-pass" type="password" required minlength="8" autocomplete="new-password" placeholder="Mínimo de 8 caracteres">'+msgHtml('pml-fav-register-msg')+'<button class="pml-fav-primary" type="submit">Criar cadastro</button><p class="pml-fav-note">Usaremos seu e-mail apenas para acesso à conta e recuperação de senha.</p></form>';
      document.getElementById('pml-fav-register-form').addEventListener('submit',handleRegister);
    }else{
      area.innerHTML='<form class="pml-fav-form" id="pml-fav-login-form"><label for="pml-fav-email">E-mail</label><input id="pml-fav-email" type="email" required autocomplete="email" placeholder="seu@email.com"><label for="pml-fav-pass">Senha</label><input id="pml-fav-pass" type="password" required autocomplete="current-password" placeholder="Sua senha">'+msgHtml('pml-fav-login-msg')+'<button class="pml-fav-primary" type="submit">Entrar e ver favoritos</button><button class="pml-fav-forgot" type="button" data-fav-recover>Esqueci minha senha</button></form>';
      document.getElementById('pml-fav-login-form').addEventListener('submit',handleLogin);
    }
  }
  function setMsg(id,text,type){const el=document.getElementById(id);if(!el)return;el.textContent=text||'';el.className='pml-fav-msg '+(text?'show ':'')+(type||'');}
  async function handleLogin(e){e.preventDefault();const form=e.currentTarget;const btn=form.querySelector('button[type=submit]');const email=form.querySelector('#pml-fav-email').value.trim().toLowerCase();const pass=form.querySelector('#pml-fav-pass').value;setMsg('pml-fav-login-msg','');btn.disabled=true;btn.textContent='Entrando...';try{await login(email,pass);const pending=state.pendingId;state.pendingId=null;closeModal();showToast('Login realizado.');if(pending){const b=document.querySelector('[data-fav-id="'+CSS.escape(pending)+'"]');if(b)await toggleFavorite(b);}}catch(err){setMsg('pml-fav-login-msg',err.message,'err');}finally{btn.disabled=false;btn.textContent='Entrar e ver favoritos';}}
  async function handleRegister(e){e.preventDefault();const form=e.currentTarget;const btn=form.querySelector('button[type=submit]');const nome=form.querySelector('#pml-fav-name').value.trim();const telefone=form.querySelector('#pml-fav-phone').value.trim();const email=form.querySelector('#pml-fav-email').value.trim().toLowerCase();const pass=form.querySelector('#pml-fav-pass').value;setMsg('pml-fav-register-msg','');if(nome.length<2){setMsg('pml-fav-register-msg','Informe seu nome completo.','err');return;}btn.disabled=true;btn.textContent='Criando cadastro...';try{const logged=await register(nome,telefone,email,pass);if(logged){const pending=state.pendingId;state.pendingId=null;closeModal();showToast('Cadastro realizado. Favorito salvo.');if(pending){const b=document.querySelector('[data-fav-id="'+CSS.escape(pending)+'"]');if(b)await toggleFavorite(b);}}else{setMsg('pml-fav-register-msg','Cadastro criado. Confirme seu e-mail para ativar o acesso e depois faça login.','ok');form.reset();}}catch(err){setMsg('pml-fav-register-msg',err.message,'err');}finally{btn.disabled=false;btn.textContent='Criar cadastro';}}
  async function handleRecover(){const email=prompt('Informe o e-mail usado no cadastro:');if(!email)return;try{await recover(email.trim().toLowerCase());showToast('Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.');}catch(err){showToast(err.message,'err');}}
  function isFavoritesPage(){return location.pathname==='/favoritos/'||location.pathname==='/favoritos';}
  function cardHtml(im){
    const preferred=Array.isArray(im.fotos_no_site)&&im.fotos_no_site.length?im.fotos_no_site:im.fotos;const f=Array.isArray(preferred)?preferred.find(Boolean):'';const src=f?String(f).replace('https://cddgkhkzcnyzzcllgzoz.supabase.co/storage/v1/object/public/','/cdn-fotos/'):'';const ref=im.slug||im.codigo||im.id;return '<article class="pml-fav-item"><button type="button" class="pml-fav-item-remove" data-fav-id="'+esc(im.id)+'" aria-label="Remover '+esc(im.titulo||'imóvel')+'">×</button><a class="pml-fav-item-img" href="/imovel/'+encodeURIComponent(ref)+'/">'+(src?'<img src="'+esc(src)+'" alt="'+esc(im.titulo||'Imóvel')+'" loading="lazy">':'<span style="display:flex;align-items:center;justify-content:center;height:100%;font-size:38px">🏠</span>')+'</a><div class="pml-fav-item-body"><div class="pml-fav-item-type">'+esc(im.tipo||'Imóvel')+'</div><div class="pml-fav-item-title">'+esc(im.titulo||'Imóvel')+'</div><div class="pml-fav-item-price">'+brl(im.preco)+'</div></div></article>';
  }
  async function fetchFavoriteProperties(){
    const ids=Array.from(state.favoriteIds);if(!ids.length)return [];
    const select='id,slug,codigo,titulo,tipo,preco,status,publicar,fotos_no_site,fotos';
    const rows=await Promise.all(ids.slice(0,100).map(async id=>{try{const r=await fetch(SB_URL+'/rest/v1/imoveis?id=eq.'+encodeURIComponent(id)+'&select='+encodeURIComponent(select)+'&limit=1',{headers:{apikey:SB_KEY,Authorization:'Bearer '+(state.session?state.session.access_token:SB_KEY)}});const a=await r.json();return a&&a[0]||null;}catch(e){return null;}}));return rows.filter(Boolean);
  }
  function sellerCallout(){return '<section class="pml-fav-sell-card" aria-labelledby="pml-fav-sell-title"><div><h2 id="pml-fav-sell-title">Tem um imóvel à venda?</h2><p>Cadastre seu imóvel aqui e conte com o Portal Meu Litoral para apresentar sua oportunidade.</p></div><a href="/exclusividade-imobiliaria/">Cadastrar meu imóvel</a></section>';}
  function showPageError(message){const el=document.getElementById('pml-fav-page-content');if(el)el.innerHTML='<div class="pml-fav-empty"><h2>Não foi possível carregar seus favoritos</h2><p>'+esc(message||'Tente novamente em instantes.')+'</p></div>';}
  async function renderFavoritesPage(){
    const root=document.getElementById('portal-favoritos-app');if(!root)return;
    if(!state.session){root.innerHTML=sellerCallout()+'<div class="pml-fav-page-card"><div class="pml-fav-empty"><h2>Entre para ver seus favoritos</h2><p>Faça seu cadastro ou login para acessar os imóveis que você salvou.</p><button type="button" class="pml-fav-primary" data-pml-account>Entrar ou criar cadastro</button></div></div>';updateAccountUi();return;}
    root.innerHTML=sellerCallout()+'<div class="pml-fav-page-card"><div class="pml-fav-page-actions"><span class="pml-fav-badge">'+state.favoriteIds.size+' '+(state.favoriteIds.size===1?'imóvel salvo':'imóveis salvos')+'</span></div><div id="pml-fav-page-content"><div class="pml-fav-loading">Carregando seus imóveis...</div></div></div>';
    try{const ims=await fetchFavoriteProperties();const el=document.getElementById('pml-fav-page-content');if(!ims.length){el.innerHTML='<div class="pml-fav-empty"><h2>Você ainda não salvou imóveis</h2><p>Explore o catálogo e clique no coração dos imóveis que deseja acompanhar.</p><a href="/imoveis/">Explorar imóveis</a></div>';return;}el.innerHTML='<div class="pml-fav-grid">'+ims.map(cardHtml).join('')+'</div>';refreshButtons();}catch(e){showPageError(e.message);}
  }
  function mountFavoritesPage(){
    if(!isFavoritesPage())return;
    const root=document.getElementById('portal-favoritos-app');if(!root)return;
    if(!root.parentElement.classList.contains('pml-fav-page-body')){const wrap=document.createElement('div');wrap.className='pml-fav-page-body';root.parentNode.insertBefore(wrap,root);wrap.appendChild(root);}
    renderFavoritesPage();
  }
  function listingItems(){try{return Array.isArray(TODOS)?TODOS:[];}catch(e){return[];}}
  function mountListingButtons(){
    // O catálogo não exibe mais o favorito sobre a foto. A ação fica somente
    // na página individual, onde há espaço para explicar o estado salvo.
    document.querySelectorAll('.pml-fav-card-btn').forEach(function(btn){btn.remove();});
  }
  function mountDetailButton(){
    const im=window.STATIC_IMOVEL||window._imAtual;const host=document.querySelector('.ip-meta-row');if(!im||!im.id||!host||host.querySelector('.pml-fav-detail-btn'))return;
    const btn=document.createElement('button');btn.type='button';btn.className='pml-fav-detail-btn';btn.dataset.favId=im.id;host.appendChild(btn);refreshButtons();
  }
  function bindEvents(){
    document.addEventListener('click',function(e){
      const fav=e.target.closest('[data-fav-id]');if(fav){e.preventDefault();e.stopPropagation();if(fav.classList.contains('pml-fav-item-remove')){toggleFavorite(fav);}else{toggleFavorite(fav);}return;}
      const account=e.target.closest('[data-pml-account]');if(account){e.preventDefault();openModal('login');return;}
      const close=e.target.closest('[data-fav-close]');if(close||e.target.id==='pml-fav-overlay'){closeModal();return;}
      const tab=e.target.closest('[data-fav-view]');if(tab){document.querySelectorAll('.pml-fav-tab').forEach(t=>t.classList.toggle('active',t===tab));renderAuthView(tab.dataset.favView);return;}
      const recover=e.target.closest('[data-fav-recover]');if(recover){handleRecover();return;}
      const logoutBtn=e.target.closest('[data-fav-logout]');if(logoutBtn){logout();return;}
    },true);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});
  }
  function observeDynamic(){
    setTimeout(mountHeader,100);setTimeout(mountHeader,900);setTimeout(mountHeader,1800);
    const grid=document.getElementById('il-grid');if(grid){new MutationObserver(function(){mountListingButtons();}).observe(grid,{childList:true});setTimeout(mountListingButtons,250);setTimeout(mountListingButtons,900);setTimeout(mountListingButtons,1800);}
    const content=document.getElementById('ip-content');if(content){new MutationObserver(function(){mountDetailButton();}).observe(content,{childList:true,subtree:true});setTimeout(mountDetailButton,100);setTimeout(mountDetailButton,700);}
  }
  function ensurePageShell(){
    if(!isFavoritesPage())return;
    const body=document.body;if(!body.classList.contains('pml-fav-page'))body.classList.add('pml-fav-page');
    if(!document.getElementById('pml-fav-page-head')){const head=document.createElement('section');head.id='pml-fav-page-head';head.className='pml-fav-page-head';head.innerHTML='<div class="pml-fav-page-in"><div class="pml-fav-page-kicker">Portal Meu Litoral</div><h1>Seus imóveis <em>favoritos</em></h1><p class="pml-fav-page-sub">Uma seleção particular para você acompanhar as melhores oportunidades do litoral.</p></div>';body.insertBefore(head,body.firstChild);}
  }
  function boot(){
    const style=document.createElement('style');style.id='pml-favoritos-css';style.textContent=css;document.head.appendChild(style);
    modalHtml();ensurePageShell();mountHeader();bindEvents();observeDynamic();mountFavoritesPage();
    refreshSession().then(function(){updateAccountUi();loadFavorites();mountFavoritesPage();mountHeader();mountListingButtons();mountDetailButton();});
  }
  window.PortalFavorites={toggle:toggleFavorite,refresh:refreshButtons,open:()=>openModal('login'),logout:logout,mount:()=>{mountListingButtons();mountDetailButton();}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
