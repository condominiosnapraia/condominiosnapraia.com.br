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

## Validação após publicação `0f865af`

O domínio oficial publicou os marcadores do adiamento: `requestIdleCallback(renderHomeBelowFold,{timeout:900})` está no HTML e a tag antiga `defer /js/lead-card.js` não existe. Na leitura após o carregamento, o widget permaneceu sem tag de script (`leadScriptNode=false`) e o ponto de montagem ficou em aproximadamente 15.730 px.

Métricas pontuais dessa execução: 1.543 elementos DOM, 52 imagens, 166 links e 54 recursos. As três consultas Supabase continuaram presentes, com durações aproximadas de 1.158 ms (`condominios`), 1.413 ms (`imoveis`) e 282 ms (`configuracoes`). O FCP variou para 6.084 ms nessa execução, mostrando que a rede/CDN continua sendo variável e que o próximo gargalo a investigar é o payload/tempo das consultas, não o widget de lead.

As duas imagens marcadas como sem carregamento são elementos ocultos e intencionais: `#artigo-capa` com `display:none` e `#lb-img` do lightbox com `src` vazio antes da abertura. Nenhuma imagem visível quebrada foi identificada.

## Capturas finais em produção

As capturas finais do domínio oficial após o commit `0f865af` confirmaram a hero, a onda e a navegação rápida intactas em 1440 × 900 e 390 × 844. Não houve corte lateral na versão mobile.

Evidências: `/tmp/homepage-performance-production-final/desktop-top.png` e `/tmp/homepage-performance-production-final/mobile-top.png`.

## Validação local do payload mínimo

A prévia local usou as seleções mínimas esperadas para `condominios` e `imoveis`. Os cards preservados foram: 8 casas em condomínio, 5 apartamentos, 1 casa fora de condomínio, 6 terrenos em condomínio, 0 terrenos fora de condomínio e 10 condomínios em destaque. Foram encontradas 52 imagens no total e zero imagens visíveis quebradas.

A medição somente leitura mostrou que a seleção mínima com apenas `fotos_no_site` reduz os payloads observados de aproximadamente 635 KB para 332 KB em condomínios e de 2,39 MB para 1,27 MB em imóveis, mantendo as mesmas 84 e 310 linhas. Todos os registros atuais possuem `fotos_no_site`; foi mantido fallback enxuto para o array legado somente se registros futuros/antigos não tiverem esse campo.

A prévia local não apresentou erro JavaScript no console. As consultas usaram as colunas mínimas, preservando 8 casas, 5 apartamentos, 1 casa fora, 6 terrenos em condomínio, 0 terrenos fora e 10 condomínios. Nenhuma imagem visível ficou quebrada.
