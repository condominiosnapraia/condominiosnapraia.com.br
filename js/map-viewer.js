(function(){
  'use strict';
  var backdrop, dialog, canvas, image, title, loading, previousFocus, scale=1;

  function ensure(){
    if(backdrop) return;
    backdrop=document.createElement('div');
    backdrop.className='map-viewer-backdrop';
    backdrop.setAttribute('aria-hidden','true');
    backdrop.innerHTML=''
      +'<div class="map-viewer-dialog" role="dialog" aria-modal="true" aria-labelledby="map-viewer-title">'
      +'<div class="map-viewer-head">'
      +'<h2 class="map-viewer-title" id="map-viewer-title">Mapa de implantação</h2>'
      +'<div class="map-viewer-actions">'
      +'<button type="button" class="map-viewer-btn" data-map-zoom="out" aria-label="Diminuir zoom" title="Diminuir zoom">−</button>'
      +'<button type="button" class="map-viewer-btn" data-map-zoom="reset" aria-label="Restaurar zoom" title="Restaurar zoom">↺</button>'
      +'<button type="button" class="map-viewer-btn" data-map-zoom="in" aria-label="Aumentar zoom" title="Aumentar zoom">+</button>'
      +'<button type="button" class="map-viewer-btn map-viewer-close" data-map-close aria-label="Fechar mapa" title="Fechar mapa">✕ <span>Fechar</span></button>'
      +'</div></div>'
      +'<div class="map-viewer-canvas" data-map-canvas tabindex="0">'
      +'<div class="map-viewer-loading">A carregar o mapa…</div>'
      +'<img class="map-viewer-image" data-map-image alt="">'
      +'<div class="map-viewer-hint">Use os botões de zoom ou faça pinça no telemóvel. Pressione Esc para fechar.</div>'
      +'</div></div>';
    document.body.appendChild(backdrop);
    dialog=backdrop.querySelector('.map-viewer-dialog');
    canvas=backdrop.querySelector('[data-map-canvas]');
    image=backdrop.querySelector('[data-map-image]');
    title=backdrop.querySelector('#map-viewer-title');
    loading=backdrop.querySelector('.map-viewer-loading');
    backdrop.addEventListener('click',function(e){if(e.target===backdrop) close();});
    backdrop.querySelector('[data-map-close]').addEventListener('click',close);
    backdrop.querySelectorAll('[data-map-zoom]').forEach(function(btn){
      btn.addEventListener('click',function(){setZoom(btn.getAttribute('data-map-zoom'));});
    });
    image.addEventListener('load',function(){backdrop.classList.add('is-loaded');});
    image.addEventListener('error',function(){loading.textContent='Não foi possível carregar este mapa.';});
    document.addEventListener('keydown',function(e){if(backdrop.classList.contains('is-open')&&e.key==='Escape'){e.preventDefault();close();}});
    var touchStart=null;
    canvas.addEventListener('touchstart',function(e){if(e.touches.length===2) touchStart=distance(e.touches[0],e.touches[1]);},{passive:true});
    canvas.addEventListener('touchmove',function(e){
      if(!touchStart||e.touches.length!==2) return;
      var next=distance(e.touches[0],e.touches[1]);
      if(Math.abs(next-touchStart)>8){setScale(scale+(next>touchStart?.04:-.04));touchStart=next;}
    },{passive:true});
    canvas.addEventListener('touchend',function(){touchStart=null;},{passive:true});
  }
  function distance(a,b){return Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);}
  function setScale(next){scale=Math.min(3,Math.max(1,next));image.style.transform='scale('+scale+')';}
  function setZoom(which){if(which==='in')setScale(scale+.25);else if(which==='out')setScale(scale-.25);else setScale(1);}
  function open(link){
    ensure();
    previousFocus=document.activeElement;
    scale=1; image.style.transform='scale(1)'; loading.textContent='A carregar o mapa…'; backdrop.classList.remove('is-loaded');
    var src=link.getAttribute('href') || link.getAttribute('data-map-src');
    var img=link.querySelector('img');
    var alt=(img&&img.getAttribute('alt')) || link.getAttribute('aria-label') || 'Mapa de implantação';
    var section=link.closest('[data-map-pdf-source],section,.card');
    var heading=section&&section.querySelector('h1,h2,h3');
    title.textContent=(heading&&heading.textContent.trim()) || alt.replace(/^Mapa de implantação(?: do| de)?\s*/i,'') || 'Mapa de implantação';
    image.alt=alt;
    image.src=src;
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('map-viewer-lock');
    setTimeout(function(){backdrop.querySelector('[data-map-close]').focus();},20);
  }
  function close(){
    if(!backdrop||!backdrop.classList.contains('is-open')) return;
    backdrop.classList.remove('is-open','is-loaded');
    backdrop.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('map-viewer-lock');
    image.removeAttribute('src');
    if(previousFocus&&typeof previousFocus.focus==='function') previousFocus.focus();
  }
  document.addEventListener('click',function(e){
    var link=e.target.closest('a[data-map-viewer], .cond-map-pdf a, .cond-implantacao-thumb, [data-map-pdf-source] > a, .card[data-map-pdf-source] a');
    if(!link) return;
    var href=link.getAttribute('href')||'';
    if(!href||href==='#') return;
    e.preventDefault();
    open(link);
  },true);
  window.MapViewer={open:open,close:close,zoom:setZoom};
})();
