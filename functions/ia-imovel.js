const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function text(v, max = 4000) {
  return String(v || '').trim().slice(0, max);
}

function onlyObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value;
}

function extractJson(raw) {
  const clean = String(raw || '').replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  try { return JSON.parse(clean); } catch (_) {}
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try { return JSON.parse(clean.slice(start, end + 1)); } catch (_) {}
  }
  throw new Error('A IA retornou um formato inválido.');
}

const SUPABASE_URL_FALLBACK = 'https://cddgkhkzcnyzzcllgzoz.supabase.co';
const SUPABASE_ANON_FALLBACK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZGdraGt6Y255enpjbGxnem96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDUzMywiZXhwIjoyMDk1MzIwNTMwfQ.xx6JAPLati0MIId_xrqB-7A8ZWQS4gNLPH4LzXZ3bIE';
async function authenticate(request, env) {
  const auth = request.headers.get('authorization') || '';
  if (!/^Bearer\s+\S+/i.test(auth)) return null;
  const base = env.SUPABASE_URL || SUPABASE_URL_FALLBACK;
  const anon = env.SUPABASE_ANON_KEY || SUPABASE_ANON_FALLBACK;
  const r = await fetch(`${base}/auth/v1/user`, {
    headers: { apikey: anon, authorization: auth }
  });
  if (!r.ok) return null;
  return r.json();
}

export async function onRequestPost({ request, env }) {
  try {
    const user = await authenticate(request, env);
    if (!user) return json({ error: 'Sessão do CRM inválida ou ausente.' }, 401);
    if (!env.AI_API_KEY || !env.AI_BASE_URL || !env.AI_MODEL) {
      return json({ error: 'A integração de IA ainda não foi configurada no Cloudflare.' }, 503);
    }

    const body = onlyObject(await request.json());
    const source = text(body.text, 12000);
    if (source.length < 20) return json({ error: 'Informe pelo menos 20 caracteres sobre o imóvel.' }, 422);

    const context = onlyObject(body.context);
    const system = `Você é um redator imobiliário brasileiro e especialista em SEO local para imóveis no litoral norte do Rio Grande do Sul. Gere apenas JSON válido, sem markdown e sem inventar informações. Use somente fatos presentes no texto. Quando faltar um dado, use null ou liste o campo em faltantes. Não informe endereço exato, CPF, telefone, comissão, matrícula ou dados do proprietário na descrição pública. O resultado será revisado por uma pessoa e salvo apenas como rascunho.`;
    const schema = `Retorne exatamente este objeto JSON: {"titulo":string,"finalidade":"venda"|"aluguel"|null,"tipo":string|null,"status":"Disponível","preco":number|null,"area":number|null,"area_construida":number|null,"quartos":number|null,"suites":number|null,"banheiros":number|null,"vagas":number|null,"cidade_end":string|null,"bairro_end":string|null,"quadra":string|null,"lote":string|null,"descricao":string,"diferenciais":string[],"seo_title":string,"seo_description":string,"seo_keywords":string,"seo_slogan":string,"faq":[{"q":string,"a":string}],"faltantes":string[]}. SEO title máximo 60 caracteres, SEO description máximo 160 caracteres, descrição com 2 a 5 parágrafos em português brasileiro, FAQ com no máximo 4 itens.`;
    const userPrompt = `${schema}\n\nDados fornecidos pelo corretor:\n${source}\n\nContexto selecionado no CRM (pode estar vazio):\n${JSON.stringify({ condominios: context.condominios || [], cidade: context.cidade || null })}`;

    const response = await fetch(`${env.AI_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { authorization: `Bearer ${env.AI_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: env.AI_MODEL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: system }, { role: 'user', content: userPrompt }]
      })
    });
    if (!response.ok) return json({ error: 'Não foi possível gerar a prévia de IA.' }, 502);
    const payload = await response.json();
    const raw = payload?.choices?.[0]?.message?.content;
    const result = extractJson(raw);
    result.status = 'Disponível';
    result.publicar = false;
    result.fotos = [];
    result.gerado_por = 'ia_preview';
    result.usuario_id = user.id;
    return json({ ok: true, preview: result });
  } catch (error) {
    return json({ error: error?.message || 'Erro ao gerar prévia.' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { allow: 'POST, OPTIONS' } });
}
