# QA das ondas da homepage

A prévia local foi aberta com o sistema final de ondas. A primeira captura mostrou a hero com a onda inferior contida e a transição para a navegação rápida sem invadir o bloco seguinte. A navegação usa fundo areia claro e a onda acompanha a mesma tonalidade visual da seção.

Evidência: `/home/ubuntu/screenshots/44156-ia4ryunj7pmxfu_2026-08-17_15-49-36_8389.webp`.

O CSS local foi validado pelo script `scripts/validate_homepage_same_color_waves.py`: 17 seções possuem `sec-onda`, as cores efetivas da onda são iguais às cores efetivas das seções e os três blocos editoriais tiveram o pseudo-elemento reativado.

## Editorial Lagoa e Mar

A onda de Lagoa foi reativada e aparece como divisor contido no topo do bloco; o título, a imagem e o texto permanecem alinhados. A transição para Mar mantém espaçamento claro e não invade o conteúdo seguinte. Mar também apresenta o mesmo padrão estrutural, com fundo azul-claro e onda na cor efetiva do próprio bloco.

Evidência: `/home/ubuntu/screenshots/44156-ia4ryunj7pmxfu8sx900q-17d8513e.us4.manus.computer_2026-08-17_15-50-01_7898.webp`.

## Editorial Cidade

A seção Cidade apresenta a onda reativada, o título e a imagem preservados. A transição para o bloco `O que você está procurando?` mantém uma faixa limpa, sem sobreposição do pseudo-elemento sobre os cards de atalhos.

Evidência: `/home/ubuntu/screenshots/44156-ia4ryunj7pmxfu8sx900q-17d8513e.us4.manus.computer_2026-08-17_15-50-37_9838.webp`.

## Validação responsiva final

Os estilos computados confirmaram, para Lagoa, Mar e Cidade: `overflow:hidden`, onda visível (`display:block`), `top:0`, altura de 72 px no desktop e cor da onda exatamente igual ao `background-color` da seção. A captura mobile em 390 px confirmou hero e navegação rápida sem corte lateral após a alteração; a regra mobile reduz a onda para 48 px conforme o CSS existente.

Evidência: `/tmp/homepage-wave-preview/mobile-top.png`.
