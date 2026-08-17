# QA visual da homepage — correção de capas e ondas

Data da inspeção: 17/08/2026.

A prévia local foi aberta em `https://44155-ia4ryunj7pmxfu8sx900q-17d8513e.us4.manus.computer/?qa=local-visual-fix` após aplicar a correção local. A primeira viewport mostrou a hero carregada com a imagem da praia e a navegação rápida. A segunda e a terceira view confirmaram que os cards de lançamentos e imóveis continuam renderizando.

A correção local já fixa no HTML as capas `/img/home-lagoa-capa.webp`, `/img/home-mar-capa.webp` e `/img/home-cidade-capa.webp`, além de aplicar as mesmas imagens imediatamente no carregador JavaScript antes do Supabase. Também foi alterado o sistema de ondas para `overflow:hidden`, divisor no topo da própria seção (`top:0`) e padding superior reservado, evitando que o pseudo-elemento invada a seção anterior. O seletor mobile das três seções editoriais foi corrigido para aplicar a mesma regra a Lagoa, Mar e Cidade.

Ainda falta concluir a inspeção visual específica das três seções editoriais em desktop e mobile e publicar o commit. As imagens capturadas durante a inspeção ficaram em `/home/ubuntu/screenshots/44155-ia4ryunj7pmxfu8sx900q-17d8513e.us4.manus.computer_2026-08-17_15-03-47_7028.webp`, `/home/ubuntu/screenshots/44155-ia4ryunj7pmxfu8sx900q-17d8513e.us4.manus.computer_2026-08-17_15-03-59_1782.webp`, `/home/ubuntu/screenshots/44155-ia4ryunj7pmxfu8sx900q-17d8513e.us4.manus.computer_2026-08-17_15-04-07_2183.webp` e `/home/ubuntu/screenshots/44155-ia4ryunj7pmxfu8sx900q-17d8513e.us4.manus.computer_2026-08-17_15-04-16_2260.webp`.

## Capturas responsivas

A captura desktop em 1440×900 mostrou a hero com imagem carregada e a onda contida na borda inferior, sem vazamento para a navegação rápida. A captura mobile em 390×844 mostrou a hero sem corte lateral, a onda seguindo a largura da tela e a seção de navegação começando abaixo do divisor, sem sobreposição. A inspeção manual das seções editoriais mostrou as capas de Lagoa, Mar e Cidade carregadas e as três transições sem invasão visual. Capturas responsivas: `/tmp/homepage-qa/desktop.png` e `/tmp/homepage-qa/mobile.png`.
