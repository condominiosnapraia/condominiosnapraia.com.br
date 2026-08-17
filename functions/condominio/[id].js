// Cloudflare Pages Function — rota legada /condominio/SLUG
// Agora que existe a pagina estatica /SLUG (na raiz, rica, com meta tags proprias),
// esta Function apenas REDIRECIONA (301) todos — humanos, Google e robos sociais — para ela.
// Sem deteccao de user-agent: mesma resposta para todos (fim do cloaking).
// O preview do WhatsApp passa a vir da propria pagina estatica de destino.

const SB_URL = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQ1MzMsImV4cCI6MjA5NTMyMDUzM30.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
const BASE = 'https://condominiosnapraia.com.br';

export async function onRequest(context){
  const { params } = context;
  const ref = params.id;

  // A pagina estatica fica em /SLUG. Se a URL ja vier com o slug, redireciona direto.
  // Se vier um uuid (id), consulta o banco para achar o slug.
  let slug = ref;
  try{
    const enc = encodeURIComponent(ref);
    const HDR = { headers: { 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON } };
    let r = await fetch(`${SB_URL}/rest/v1/condominios?or=(slug.eq.${enc},id.eq.${enc})&select=slug,id,nome,cidade&limit=1`, HDR);
    const arr = r.ok ? await r.json() : [];
    if (Array.isArray(arr) && arr.length){
      const row = arr[0];
      slug = row.slug || String(row.nome || 'condominio') + '-' + String(row.cidade || '').replace(/\s+/g, '-');
      slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
  }catch(e){ /* mantem ref como esta */ }

  return Response.redirect(BASE + '/' + slug, 301);
}
