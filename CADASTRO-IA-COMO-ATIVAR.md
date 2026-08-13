# Como ativar o Cadastro assistido por IA

Recurso novo no CRM: cola texto (e fotos) de um imóvel, a IA gera título,
descrição, SEO e campos estruturados, e abre o formulário como RASCUNHO
(publicar=false) para você revisar e salvar. A IA nunca publica sozinha.

## Arquivos (já no pacote)
- functions/ia-imovel.js  -> endpoint backend (Cloudflare Pages Functions)
- crm.html                -> já traz a aba "Cadastrar com IA"

## Passo obrigatório: configurar as SECRETS no Cloudflare
No painel Cloudflare > seu projeto Pages > Settings > Environment variables,
adicione (como Secret, NÃO como texto no código):

- SUPABASE_URL       = https://cddgkhkzcnyzzcllgzoz.supabase.co
- SUPABASE_ANON_KEY  = (a anon key pública que o site já usa)
- AI_BASE_URL        = endpoint do provedor de IA compatível com OpenAI (ex.: https://api.openai.com/v1)
- AI_API_KEY         = a chave PRIVADA do provedor de IA (só aqui, nunca no HTML/GitHub)
- AI_MODEL           = o modelo escolhido (ex.: gpt-4o-mini ou equivalente)

Configure primeiro no ambiente de PREVIEW, teste, depois em produção.

## Importante (segurança)
- A AI_API_KEY é PRIVADA e paga. Ela fica SÓ nas secrets do Cloudflare.
  Nunca coloque no crm.html, no GitHub, nem me mande por mensagem.
- O endpoint exige login válido no CRM (Bearer token de sessão).
- Enquanto as secrets não estiverem configuradas, o botão "Gerar prévia"
  responde "integração de IA ainda não foi configurada" (503) — é o esperado.

## Custo
Requer uma conta paga no provedor de IA (OpenAI ou similar). Cada geração de
prévia consome tokens desse provedor. Comece com um modelo barato (ex.: mini).

## Teste depois de configurar
1. Publicar (o functions/ia-imovel.js e o crm.html novos).
2. Configurar as 5 secrets no Cloudflare.
3. No CRM: Imóveis > Cadastrar com IA > colar texto > Gerar prévia.
4. Revisar e "Aprovar e abrir cadastro como rascunho".
5. Conferir e salvar com publicar=false.
