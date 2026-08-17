# Linha de base de performance da homepage

Data: 17/08/2026.

A medição no domínio oficial, em viewport de 1706 × 1466, encontrou 1.568 elementos DOM, 52 imagens e 166 links. Foram observados 55 recursos, 31 recursos identificados como imagens, 5 scripts e 4 folhas/links CSS. O FCP observado foi de aproximadamente 2.796 ms; o LCP não ficou disponível na leitura pontual do navegador.

As chamadas principais ao Supabase foram três: `condominios` com duração aproximada de 652 ms, `imoveis` com duração aproximada de 972 ms e `configuracoes` com duração aproximada de 198 ms. A inicialização espera `fetchSiteData()` antes de disparar `buildHomeDestaques`, `rCond`, `buildCities`, `updateHeroStats`, `renderDestaquesCidade` e outros fluxos.

Não foram encontradas imagens quebradas na leitura pontual. Duas imagens sem `loading="lazy"` foram detectadas, mas eram elementos sem dimensões renderizadas na primeira leitura; as capas hero já usam preload/fetchpriority. O DOM ainda é o principal ponto de trabalho, enquanto o carregamento remoto de imóveis e condomínios é o maior bloqueio mensurável antes da renderização dinâmica completa.

Nenhuma alteração foi feita no CRM ou no Supabase durante a auditoria.

## Teste de adiamento do lead-card

Na prévia local, o ponto de montagem do lead permanece no DOM em aproximadamente 15.870 px abaixo do topo e a hero continua renderizada. A leitura foi feita após a janela de carregamento da página; por isso o script já estava presente devido ao fallback de 3 segundos. A implementação mantém dois gatilhos seguros: aproximação via `IntersectionObserver` com margem de 700 px ou fallback temporizado após o carregamento. O widget não é necessário para a primeira tela e não é montado por uma tag de script bloqueante no HTML inicial.

A primeira pintura observada nessa prévia foi de aproximadamente 424 ms, mas não deve ser comparada diretamente ao domínio oficial porque a prévia usa infraestrutura diferente.

## Validação do primeiro ciclo ocioso

A prévia local com a montagem dos grids agendada via `requestIdleCallback` manteve hero, navegação, lançamentos e cards visíveis. O console não apresentou erros após a renderização. O widget de lead continua montado no ponto correto do DOM e o seu script agora só entra via proximidade do viewport em navegadores modernos.
