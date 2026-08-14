// Cloudflare Pages Function — rota legada /imovel/ID
// Agora que existe a página estática /imovel-CODIGO (rica, com meta tags próprias),
// esta Function apenas REDIRECIONA (301) todos — humanos, Google e robôs sociais — para ela.
// Sem detecção de user-agent: mesma resposta para todos (fim do cloaking).
// O preview do WhatsApp passa a vir da própria página estática de destino.

const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const BASE = 'https://condominiosnapraia.com.br';

// mesma regra do gerador de paginas: imovel-<codigo-slugificado>
function slugify(s){
  return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

export async function onRequest(context){
  const { params } = context;
  const ref = params.id;

  // Se a URL ja vier com um codigo (ex: CAP-001), monta o destino direto.
  // Se vier um uuid ou slug, consulta o banco para descobrir o codigo.
  let codigo = ref;
  try{
    const enc = encodeURIComponent(ref);
    const HDR = { headers: { 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON } };
    let r = await fetch(`${SB_URL}/rest/v1/imoveis?or=(codigo.eq.${enc},slug.eq.${enc},id.eq.${enc})&select=codigo,slug,id&limit=1`, HDR);
    const arr = r.ok ? await r.json() : [];
    if (Array.isArray(arr) && arr.length){
      codigo = arr[0].codigo || arr[0].slug || arr[0].id;
    }
  }catch(e){ /* mantem ref como esta */ }

  const destino = BASE + '/imovel-' + slugify(codigo);
  return Response.redirect(destino, 301);
}
