# Cadastro assistido por IA

O CRM agora possui uma prévia de cadastro assistido por IA. O fluxo recebe texto e fotos, gera conteúdo estruturado e abre o formulário existente com `publicar=false`. A criação do registro continua sendo feita pelo operador no formulário do CRM.

## Configuração no Cloudflare Pages

Adicionar estas variáveis como secrets do projeto, nunca no `crm.html`:

- `SUPABASE_URL`: URL do projeto Supabase.
- `SUPABASE_ANON_KEY`: chave pública anon usada apenas para validar a sessão do usuário no endpoint.
- `AI_BASE_URL`: URL compatível com OpenAI Chat Completions, por exemplo o endpoint `/v1` do provedor escolhido.
- `AI_API_KEY`: chave privada do provedor de IA.
- `AI_MODEL`: modelo escolhido para geração de JSON estruturado.

O endpoint `functions/ia-imovel.js` aceita somente POST autenticado com Bearer token de uma sessão válida do CRM. Ele não grava no banco, não publica e não altera usuários. Ele retorna uma prévia com `publicar:false`, que precisa ser revisada no navegador.

## Fluxo de uso

1. Abrir `CRM > Imóveis > Cadastrar com IA`.
2. Colar os dados do imóvel e selecionar as fotos.
3. Clicar em `Gerar prévia`.
4. Revisar título, campos, descrição, diferenciais, SEO e campos faltantes.
5. Clicar em `Aprovar e abrir cadastro como rascunho`.
6. Conferir o formulário do imóvel, as fotos e o condomínio.
7. Salvar com o campo do site desativado (`publicar=false`).

As fotos são carregadas no estado do formulário existente e seguem o fluxo de upload do CRM quando o operador salva o imóvel. A primeira versão usa o texto para a redação; a análise visual avançada das imagens pode ser adicionada depois com um modelo de visão.

## Cuidados

O endpoint deve permanecer protegido por autenticação e rate limit. A chave da IA não deve aparecer em HTML, JavaScript de frontend, GitHub ou logs. Antes de habilitar em produção, configurar as secrets no ambiente de preview e testar com um usuário não administrador. O agente não deve receber permissão para publicar, excluir, administrar usuários, editar proprietários, restaurar backup ou alterar configurações.
