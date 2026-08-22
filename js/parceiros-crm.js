(function(){
  'use strict';
  let parcSites=[];
  let parcCurrent=null;
  let parcRelations=[];
  let parcLeads=[];

  const esc=(value)=>String(value??'').replace(/[&<>"']/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  const slugify=(value)=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,70);
  const publicBase=()=>location.origin;
  const publicPartnerSlug=(slug)=>String(slug||'').toLowerCase()==='fernando-trvisol'?'fernando-trevisol':String(slug||'');
  const currentProfile=()=>window._authProfile||JSON.parse(sessionStorage.getItem('cnp_crm_user')||'{}');

  window.parcOpenNew=function(){
    ['parc-nome','parc-slug','parc-wpp','parc-email','parc-bio'].forEach((id)=>{const el=document.getElementById(id);if(el)el.value='';});
    cMo('parc-new-mo');
    setTimeout(()=>document.getElementById('parc-nome')?.focus(),80);
  };

  window.parcLoad=async function(){
    const list=document.getElementById('parc-sites-list');
    if(!list)return;
    list.innerHTML='<div class="te">Carregando sites…</div>';
    try{
      parcSites=await sb.get('parceiros_sites','?order=created_at.desc');
      if(!Array.isArray(parcSites))parcSites=[];
      const active=parcSites.filter((site)=>site.status==='active').length;
      const paused=parcSites.filter((site)=>site.status==='suspended').length;
      const drafts=parcSites.filter((site)=>site.status==='draft').length;
      const stats=document.getElementById('parc-stats');
      if(stats)stats.innerHTML=`<div class="parc-stat"><strong>${parcSites.length}</strong><span>Sites cadastrados</span></div><div class="parc-stat"><strong>${active}</strong><span>Publicados</span></div><div class="parc-stat"><strong>${drafts}</strong><span>Em rascunho</span></div><div class="parc-stat"><strong>${paused}</strong><span>Pausados</span></div>`;
      list.innerHTML=parcSites.length?parcSites.map((site)=>`<button class="parc-site-row ${parcCurrent?.id===site.id?'on':''}" type="button" onclick="parcSelect('${esc(site.id)}')"><span><strong>${esc(site.nome)}</strong><small>/${esc(publicPartnerSlug(site.slug))} · ${esc(site.plano_slug||'inicial')}</small></span><span class="parc-site-status ${esc(site.status)}">${site.status==='active'?'Publicado':site.status==='suspended'?'Pausado':'Rascunho'}</span></button>`).join(''):'<div class="parc-empty">Nenhum site parceiro cadastrado. Crie o primeiro em modo rascunho.</div>';
      if(parcCurrent){const updated=parcSites.find((site)=>site.id===parcCurrent.id);if(updated)parcSelect(updated.id);else parcClearDetail();}
    }catch(error){list.innerHTML=`<div class="parc-empty">Não foi possível carregar sites: ${esc(error.message||error)}</div>`;}
  };

  window.parcClearDetail=function(){
    parcCurrent=null;parcRelations=[];
    const detail=document.getElementById('parc-detail');
    if(detail)detail.innerHTML='<div class="te"><div class="te-ic">🌐</div><h3>Selecione um site</h3><p>Crie um site parceiro ou selecione um cadastro para publicar imóveis.</p></div>';
  };

  window.parcSelect=async function(id){
    parcCurrent=parcSites.find((site)=>String(site.id)===String(id))||null;
    if(!parcCurrent)return;
    document.querySelectorAll('.parc-site-row').forEach((row)=>row.classList.remove('on'));
    document.querySelectorAll('.parc-site-row').forEach((row)=>{if(row.textContent.includes(parcCurrent.nome))row.classList.add('on');});
    const detail=document.getElementById('parc-detail');
    if(detail)detail.innerHTML='<div class="te">Carregando detalhes…</div>';
    try{
      parcRelations=await sb.get('parceiros_sites_imoveis',`?site_id=eq.${encodeURIComponent(parcCurrent.id)}&order=destaque.desc,ordem.asc`);
      if(!Array.isArray(parcRelations))parcRelations=[];
      try{parcLeads=await sb.get('parceiros_leads',`?site_id=eq.${encodeURIComponent(parcCurrent.id)}&select=id,status,created_at&order=created_at.desc&limit=100`);if(!Array.isArray(parcLeads))parcLeads=[];}catch(_){parcLeads=[];}
      parcRenderDetail();
    }catch(error){if(detail)detail.innerHTML=`<div class="parc-empty">Não foi possível carregar os imóveis: ${esc(error.message||error)}</div>`;}
  };

  function propertyRows(){
    const list=Array.isArray(window.DB?.im)?window.DB.im:[];
    const relById=new Map(parcRelations.map((row)=>[String(row.imovel_id),row]));
    return list.filter((imovel)=>imovel && imovel.id).slice().sort((a,b)=>String(a.titulo||'').localeCompare(String(b.titulo||''),'pt-BR')).map((imovel)=>{
      const rel=relById.get(String(imovel.id));
      const checked=Boolean(rel?.publicado);
      const title=imovel.titulo||'Imóvel sem título';
      const meta=[imovel.cidade_end||imovel.cidade,imovel.preco&&`R$ ${imovel.preco}`,imovel.status].filter(Boolean).join(' · ');
      return `<label class="parc-property"><input type="checkbox" ${checked?'checked':''} onchange="parcToggleProperty('${esc(imovel.id)}',this.checked)"><span><strong>${esc(title)}</strong><span>${esc(meta||'Sem informações complementares')}</span></span></label>`;
    }).join('');
  }

  function parcRenderDetail(){
    const site=parcCurrent;const detail=document.getElementById('parc-detail');if(!site||!detail)return;
    const publicSlug=publicPartnerSlug(site.slug);
    const landing=`${publicBase()}/corretor/${encodeURIComponent(publicSlug)}`;
    const contact=`${landing}/contato/`;
    const feed=`${publicBase()}/parceiro-feed/${encodeURIComponent(publicSlug)}`;
    const selected=parcRelations.filter((row)=>row.publicado).length;
    const leadCount=parcLeads.length;
    detail.innerHTML=`<div class="parc-detail-body"><div class="parc-detail-head"><div><h3>${esc(site.nome)}</h3><p>/${esc(site.slug)} · <span class="parc-plan-badge">Plano ${esc(site.plano_slug||'inicial')}</span> · <span class="parc-plan-badge">Leads ${leadCount}</span></p></div><div class="parc-actions"><button class="btn bg bsm" type="button" onclick="parcOpenUrl('${esc(landing)}')">Abrir landing</button><button class="btn bg bsm" type="button" onclick="parcCopy('${esc(landing)}')">Copiar link</button>${site.status==='active'?`<button class="btn bd2b bsm" type="button" onclick="parcSetStatus('suspended')">Pausar</button>`:`<button class="btn bs bsm" type="button" onclick="parcSetStatus('active')">Publicar</button>`}</div></div><div class="parc-url"><input readonly value="${esc(landing)}"><button class="btn bg bsm" type="button" onclick="parcCopy('${esc(landing)}')">Landing</button><button class="btn bg bsm" type="button" onclick="parcOpenUrl('${esc(contact)}')">Contato</button><button class="btn bg bsm" type="button" onclick="parcCopy('${esc(feed)}')">Feed JSON</button></div><div class="parc-section-title">Imóveis publicados (${selected})</div><div class="parc-property-list">${propertyRows()||'<div class="parc-empty">Nenhum imóvel disponível no catálogo atual.</div>'}</div><div class="parc-section-title">Observação</div><p style="font-size:12px;color:var(--t2);line-height:1.55;margin:0">Marque os imóveis autorizados. A landing só ficará acessível quando o site estiver publicado e nunca altera os dados centrais do imóvel.</p></div>`;
  }

  window.parcToggleProperty=async function(imovelId,checked){
    if(!parcCurrent)return;
    try{
      const existing=parcRelations.find((row)=>String(row.imovel_id)===String(imovelId));
      if(checked){
        const payload={site_id:parcCurrent.id,imovel_id:String(imovelId),publicado:true,destaque:false,ordem:parcRelations.length};
        const result=await sb.upsert('parceiros_sites_imoveis',payload);const row=Array.isArray(result)?result[0]:result;
        if(existing)Object.assign(existing,row||payload);else parcRelations.push(row||payload);
      }else if(existing){
        await sb.delete('parceiros_sites_imoveis',existing.id);parcRelations=parcRelations.filter((row)=>row.id!==existing.id);
      }
      parcRenderDetail();
      toast(checked?'Imóvel incluído na landing.':'Imóvel retirado da landing.','success');
    }catch(error){toast('Não foi possível atualizar a publicação: '+(error.message||error),'error');parcRenderDetail();}
  };

  window.parcSetStatus=async function(status){
    if(!parcCurrent)return;
    if(status==='active'&&!parcRelations.some((row)=>row.publicado)){toast('Publique pelo menos um imóvel antes de ativar o site.','info');return;}
    try{await sb.patch('parceiros_sites',parcCurrent.id,{status,updated_at:new Date().toISOString()});toast(status==='active'?'Site publicado.':'Site pausado.','success');await parcLoad();}catch(error){toast('Não foi possível alterar o status: '+(error.message||error),'error');}
  };

  window.parcSaveNew=async function(){
    const nome=(document.getElementById('parc-nome')?.value||'').trim();
    const slug=slugify(document.getElementById('parc-slug')?.value||nome);
    const profile=currentProfile();
    if(nome.length<3||slug.length<3){toast('Informe nome e slug válidos.','error');return;}
    try{
      const result=await sb.post('parceiros_sites',{owner_usuario_id:profile.id||null,slug,nome,whatsapp:(document.getElementById('parc-wpp')?.value||'').trim(),email:(document.getElementById('parc-email')?.value||'').trim()||null,bio:(document.getElementById('parc-bio')?.value||'').trim()||null,status:'draft',plano_slug:'inicial'});
      const site=Array.isArray(result)?result[0]:result;
      if(site?.id){await sb.post('parceiros_assinaturas',{site_id:site.id,plano_slug:'inicial',status:'trial'});}
      cMo('parc-new-mo');toast('Site parceiro criado em modo rascunho.','success');await parcLoad();if(site?.id)parcSelect(site.id);
    }catch(error){toast('Não foi possível criar o site: '+(error.message||error),'error');}
  };

  window.parcOpenUrl=function(url){window.open(url,'_blank','noopener');};
  window.parcCopy=async function(url){try{await navigator.clipboard.writeText(url);toast('Link copiado.','success');}catch(_){window.prompt('Copie o link:',url);}};
})();
