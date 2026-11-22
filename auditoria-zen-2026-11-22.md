# Auditoria do Zen Concept Resort

Data: 2026-11-22

## Evidências confirmadas

- URL informada pelo usuário: `https://condominiosnapraia.com.br/condominio/?id=zen-concept-resort-xangri-la1`
- O registro existente no Supabase usa `slug=zen-concept-resort-xangri-la` e `id=zen-concept-resort`.
- A consulta com `id=zen-concept-resort-xangri-la1` não encontra registro.
- O registro correto possui 18 itens em `fotos_no_site` e `fotos`.
- Todos os itens do Zen usam o caminho `/storage/v1/object/public/fotos/imov/`, isto é, foram cadastrados como fotos de imóveis/lotes, não como fotos do condomínio.
- A página pública renderizada com o ID terminado em `la1` mostra o estado `gallery-no-photo`, sem imagens de capa.
- O catálogo tinha lógica que podia escolher essas fotos `/fotos/imov/` como capa de condomínio; essa abordagem foi considerada incorreta pelo usuário.

## Direção solicitada

- Não mascarar foto quebrada com a próxima foto.
- Não usar foto de imóvel como foto de condomínio.
- Levantar os condomínios e imóveis com URLs quebradas.
- Corrigir os registros na origem/CRM ou no Supabase com fotos semanticamente corretas.
