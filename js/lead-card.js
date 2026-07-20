/* ══════════════════════════════════════════════════════════
   CARTÃO DE CAPTAÇÃO DE LEAD — Condomínios na Praia
   Salva direto no CRM (tabela leads_site do Supabase).
   Uso: <div id="lead-card" data-origem="lista-imoveis"></div>
        <script src="/js/lead-card.js" defer></script>
   data-contexto="h1" → grava o título da página junto do lead
   ══════════════════════════════════════════════════════════ */
(function(){
  var SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';

  var mount = document.getElementById('lead-card');
  if(!mount) return;

  var css = ''+
  '.ldc{max-width:860px;margin:44px auto;padding:0 20px}'+
  '.ldc-card{background:#faf7f0;border:1px solid rgba(184,147,90,.28);border-radius:16px;padding:28px 26px;box-shadow:0 6px 24px rgba(12,74,110,.05)}'+
  '.ldc-h{font-family:"Fraunces",Georgia,serif;font-size:20px;font-weight:600;color:#0d3b54;margin:0 0 4px;text-align:center}'+
  '.ldc-s{font-size:13.5px;color:#5b7585;margin:0 0 20px;text-align:center;line-height:1.5}'+
  '.ldc-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}'+
  '.ldc-full{grid-column:1/-1}'+
  '.ldc input,.ldc select{width:100%;border:1px solid #dfe7ea;border-radius:10px;padding:12px 14px;font-size:14.5px;font-family:inherit;color:#0d3b54;background:#fff;outline:none;transition:border-color .15s;box-sizing:border-box}'+
  '.ldc input:focus,.ldc select:focus{border-color:#b8935a}'+
  '.ldc input.erro{border-color:#c0392b}'+
  '.ldc select{color:#5b7585}'+
  '.ldc-btn{width:100%;background:#0d3b54;color:#fff;border:none;border-radius:100px;padding:13px;font-size:14.5px;font-weight:700;font-family:inherit;cursor:pointer;letter-spacing:.02em;transition:background .15s,transform .15s;margin-top:2px}'+
  '.ldc-btn:hover:not(:disabled){background:#0e5f7a;transform:translateY(-1px)}'+
  '.ldc-btn:disabled{opacity:.6;cursor:default}'+
  '.ldc-msg{font-size:13px;margin-top:10px;text-align:center;display:none}'+
  '.ldc-msg.err{display:block;color:#c0392b}'+
  '.ldc-priv{font-size:11.5px;color:#9bb0bd;text-align:center;margin-top:12px}'+
  '.ldc-ok{display:none;text-align:center;padding:16px 4px}'+
  '.ldc-ok.on{display:block}'+
  '.ldc-ok-ico{font-size:36px;margin-bottom:8px}'+
  '.ldc-ok-h{font-family:"Fraunces",Georgia,serif;font-size:19px;font-weight:600;color:#0d3b54;margin-bottom:6px}'+
  '.ldc-ok-t{font-size:13.5px;color:#5b7585;line-height:1.6}'+
  '@media(max-width:600px){.ldc{margin:32px auto}.ldc-card{padding:22px 18px}.ldc-row{grid-template-columns:1fr}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  mount.innerHTML = ''+
  '<div class="ldc"><div class="ldc-card">'+
    '<div id="ldc-form">'+
      '<p class="ldc-h">'+(mount.getAttribute('data-titulo')||'Quer ajuda para encontrar o ideal?')+'</p>'+
      '<p class="ldc-s">'+(mount.getAttribute('data-sub')||'Deixe seu contato e retornamos com opções selecionadas para o seu perfil.')+'</p>'+
      '<div class="ldc-row">'+
        '<input id="ldc-nome" type="text" placeholder="Seu nome" autocomplete="name">'+
        '<input id="ldc-tel" type="tel" placeholder="WhatsApp com DDD" autocomplete="tel" inputmode="numeric">'+
        '<input id="ldc-email" class="ldc-full" type="email" placeholder="Seu e-mail" autocomplete="email">'+
        '<select id="ldc-int" class="ldc-full">'+
          '<option value="">Interesse (opcional)</option>'+
          '<option>Casa em condomínio</option>'+
          '<option>Apartamento</option>'+
          '<option>Terreno</option>'+
          '<option>Lançamento / na planta</option>'+
          '<option>Investimento</option>'+
          '<option>Outro</option>'+
        '</select>'+
      '</div>'+
      '<button class="ldc-btn" id="ldc-btn">Quero receber opções</button>'+
      '<div class="ldc-msg" id="ldc-msg"></div>'+
      '<div class="ldc-priv">Seus dados ficam seguros e não são compartilhados.</div>'+
    '</div>'+
    '<div class="ldc-ok" id="ldc-ok">'+
      '<div class="ldc-ok-ico">✓</div>'+
      '<div class="ldc-ok-h">Recebido!</div>'+
      '<div class="ldc-ok-t">Obrigado pelo interesse. Em breve entramos em contato com opções para você.</div>'+
    '</div>'+
  '</div></div>';

  function dig(s){ return (s||'').replace(/\D/g,''); }

  document.getElementById('ldc-tel').addEventListener('input', function(e){
    var v = dig(e.target.value).slice(0,11);
    if(v.length > 6)      v = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
    else if(v.length > 2) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
    else if(v.length > 0) v = '(' + v;
    e.target.value = v;
  });

  function contexto(){
    if(mount.getAttribute('data-contexto') !== 'h1') return null;
    var h = document.querySelector('h1');
    return h ? h.textContent.trim().slice(0,120) : null;
  }

  function utms(){
    var p = new URLSearchParams(location.search);
    var o = {};
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){
      var v = p.get(k); if(v) o[k] = v.slice(0,120);
    });
    if(!o.utm_source){
      if(p.get('gclid')) o.utm_source = 'google';
      else if(p.get('fbclid')) o.utm_source = 'facebook';
    }
    return o;
  }

  async function enviar(){
    var nome  = document.getElementById('ldc-nome').value.trim();
    var tel   = document.getElementById('ldc-tel').value.trim();
    var email = document.getElementById('ldc-email').value.trim();
    var inter = document.getElementById('ldc-int').value;
    var msg   = document.getElementById('ldc-msg');
    var btn   = document.getElementById('ldc-btn');
    msg.className = 'ldc-msg'; msg.textContent = '';
    ['ldc-nome','ldc-tel','ldc-email'].forEach(function(id){ document.getElementById(id).classList.remove('erro'); });

    if(nome.length < 2){ document.getElementById('ldc-nome').classList.add('erro'); msg.className='ldc-msg err'; msg.textContent='Digite seu nome.'; return; }
    if(dig(tel).length < 10){ document.getElementById('ldc-tel').classList.add('erro'); msg.className='ldc-msg err'; msg.textContent='Digite um WhatsApp válido com DDD.'; return; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ document.getElementById('ldc-email').classList.add('erro'); msg.className='ldc-msg err'; msg.textContent='Digite um e-mail válido.'; return; }

    btn.disabled = true; btn.textContent = 'Enviando...';
    try{
      var tabela = mount.getAttribute('data-tabela') === 'leads_campanha' ? 'leads_campanha' : 'leads_site';
      var corpo;
      if(tabela === 'leads_campanha'){
        corpo = Object.assign({
          nome: nome,
          telefone: tel,
          email: email.toLowerCase(),
          tipo_imovel: inter || null,
          origem: mount.getAttribute('data-origem') || 'site',
          pagina_origem: location.pathname
        }, utms());
      } else {
        corpo = {
          nome: nome,
          telefone: tel,
          email: email.toLowerCase(),
          mensagem: inter ? ('Interesse: ' + inter) : null,
          origem: mount.getAttribute('data-origem') || 'site',
          imovel_titulo: contexto()
        };
      }
      var r = await fetch(SB_URL + '/rest/v1/' + tabela, {
        method: 'POST',
        headers: { apikey: SB_KEY, Authorization: 'Bearer '+SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(corpo)
      });
      if(!r.ok) throw new Error('HTTP ' + r.status);
      try{ if(typeof gtag==='function') gtag('event','conversion',{'send_to':'AW-16759565872/dnB1CNazzdEcELDcyrc-'}); }catch(e){}
      try{ if(typeof fbq==='function') fbq('track','Lead'); }catch(e){}
      document.getElementById('ldc-form').style.display = 'none';
      document.getElementById('ldc-ok').classList.add('on');
    }catch(e){
      btn.disabled = false; btn.textContent = 'Quero receber opções';
      msg.className = 'ldc-msg err';
      msg.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.';
    }
  }
  document.getElementById('ldc-btn').addEventListener('click', enviar);
})();
