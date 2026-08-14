export function onRequest({ env, next }) {
  return new Response(JSON.stringify({
    assets_bound: Boolean(env?.ASSETS),
    assets_fetch_type: typeof env?.ASSETS?.fetch,
    supabase_key_bound: Boolean(env?.SUPABASE_ANON_KEY),
    next_type: typeof next
  }), { headers: { 'content-type': 'application/json; charset=utf-8' } });
}
