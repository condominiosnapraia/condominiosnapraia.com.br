# Como publicar (GitHub Desktop + Cloudflare)

1. GitHub Desktop → Repository → Show in Explorer (abre a pasta local do repo).
2. Extrair este ZIP. Copiar TODO o conteúdo (index.html, pasta img, blog,
   condominios, _redirects, etc.) para dentro da pasta do repo, SUBSTITUINDO.
   (Cuidado: copie o CONTEÚDO, não a pasta-mãe. O certo é repo/index.html,
   não repo/condominiosnapraia-SITE-COMPLETO/index.html.)
3. GitHub Desktop → aba Changes deve listar vários arquivos → escreva a mensagem
   → Commit to main → Push origin.
4. Espere 1-2 min o Cloudflare publicar → painel Cloudflare → Caching →
   Purge Everything.
5. No navegador: Ctrl+F5. Se logo/favicon vierem antigos, teste em aba anônima.

## Preview do link (foto ao compartilhar)
Depois de publicar:
1. developers.facebook.com/tools/debug → cole https://condominiosnapraia.com.br/
   → Depurar → "Coletar novamente" (Scrape Again) 2-3 vezes.
2. WhatsApp: compartilhe com ?v=1 no fim (link "novo") para forçar releitura.
3. Se não aparecer: abra https://condominiosnapraia.com.br/img/og-home.jpg direto.
   Se der 404, a pasta img não subiu completa.

## Builds que rodam na sua máquina (precisam do Supabase)
- node build-blog.js         → gera o blog estático (ver COMO-RODAR-BLOG.md)
- node build-condominios.js  → preenche as páginas de condomínio

## Alterações desta sessão (já nos arquivos)
- Blog estático (build-blog.js) - listagem + artigos que o Google indexa
- Logo nova (header azul + rodapé branco/ícone colorido) + favicon + og-image
- Botão "Falar no WhatsApp" do rodapé alinhado (desktop e mobile)
- Título "Condomínios na Praia | ..." em todas as 396 páginas
- Removidas 3 seções da home (Financie 90%, Tem imóvel p/ vender, Venda Premium)
- Tags og reforçadas para o preview de link funcionar melhor no WhatsApp
