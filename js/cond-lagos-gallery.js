(function(){
  function init(){
    var track=document.getElementById('cond-lagos-gallery-track');
    if(!track || track.dataset.ready === '1') return;
    track.dataset.ready='1';
    var items=[].slice.call(track.querySelectorAll('.cond-lagos-gallery-item'));
    var step=function(){var item=items[0];return item?item.getBoundingClientRect().width+12:track.clientWidth};
    var move=function(delta){track.scrollBy({left:step()*delta,behavior:'smooth'});};
    var prev=document.querySelector('.cond-lagos-gallery-arrow.prev');
    var next=document.querySelector('.cond-lagos-gallery-arrow.next');
    if(prev) prev.addEventListener('click',function(){move(-1)});
    if(next) next.addEventListener('click',function(){move(1)});
    var modal=document.getElementById('cond-lagos-lightbox');
    var image=document.getElementById('cond-lagos-lightbox-image');
    var caption=document.getElementById('cond-lagos-lightbox-caption');
    if(!modal || !image || !caption) return;
    var current=0;
    var render=function(){
      var source=items[current] && items[current].querySelector('img');
      if(!source) return;
      image.src=source.currentSrc || source.src;
      image.alt=source.alt || '';
      caption.textContent=(current+1)+' / '+items.length;
    };
    var open=function(index){
      current=Math.max(0,Math.min(index,items.length-1));
      render();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
    };
    var close=function(){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
      document.body.style.overflow='';
    };
    items.forEach(function(item,index){
      item.addEventListener('click',function(){open(index)});
      item.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();open(index)}});
    });
    var closeButton=document.getElementById('cond-lagos-lightbox-close');
    if(closeButton) closeButton.addEventListener('click',close);
    var modalPrev=document.querySelector('.cond-lagos-lightbox-arrow.prev');
    var modalNext=document.querySelector('.cond-lagos-lightbox-arrow.next');
    if(modalPrev) modalPrev.addEventListener('click',function(){current=(current+items.length-1)%items.length;render()});
    if(modalNext) modalNext.addEventListener('click',function(){current=(current+1)%items.length;render()});
    modal.addEventListener('click',function(event){if(event.target===modal) close()});
    document.addEventListener('keydown',function(event){
      if(!modal.classList.contains('open')) return;
      if(event.key==='Escape') close();
      if(event.key==='ArrowLeft'){current=(current+items.length-1)%items.length;render()}
      if(event.key==='ArrowRight'){current=(current+1)%items.length;render()}
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
