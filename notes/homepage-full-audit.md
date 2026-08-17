# Auditoria completa da homepage — inventário

Data: 17/08/2026.

A homepage publicada foi inspecionada em `https://condominiosnapraia.com.br/?qa=production-editorial-43`. O documento possui aproximadamente 17.330 px de altura e 17 blocos com `section[id]`:

| Ordem | ID | Topo aproximado | Altura |
|---:|---|---:|---:|
| 1 | `lch-sec-sec` | 1.234 | 1.270 |
| 2 | `sec-imoveis` | 2.504 | 1.442 |
| 3 | `sec-apartamentos` | 3.946 | 1.354 |
| 4 | `sec-fora-cond` | 5.300 | 790 |
| 5 | `sec-terrenos` | 6.090 | 1.299 |
| 6 | `sec-terrenos-fora` | 7.390 | 564 |
| 7 | `qfilter2` | 7.954 | 835 |
| 8 | `sec-condominios` | 8.789 | 1.515 |
| 9 | `viver-intro-sec` | 10.303 | 265 |
| 10 | `viver-lagoa` | 10.568 | 564 |
| 11 | `viver-mar` | 11.156 | 564 |
| 12 | `viver-cidade` | 11.744 | 564 |
| 13 | `qfilter` | 12.332 | 622 |
| 14 | `pcred-sec-sec` | 12.954 | 558 |
| 15 | `guias-cidades` | 13.512 | 631 |
| 16 | `guias-decisao` | 14.143 | 1.037 |
| 17 | `sec-blog-preview` | 15.180 | 572 |

Todos os 17 blocos usam `sec-onda`; a hero é anterior ao primeiro bloco e possui `hero-wave-svg`. A inspeção retornou dois itens de imagem potencialmente problemáticos: uma imagem com `src` vazio e uma referência igual à própria URL da homepage. Isso precisa ser separado entre placeholder intencional e imagem realmente quebrada.

As capas editoriais de Lagoa, Mar e Cidade aparecem em produção, e o sistema de ondas publicado usa `overflow:hidden`, pseudo-elemento no topo da própria seção e regra mobile de 48 px. A auditoria visual completa ainda precisa percorrer os 17 blocos em desktop e mobile, verificar os cards de cada seção, CTAs, links, rodapé, erros de imagem e eventuais transbordamentos horizontais.

## Auditoria visual — desktop, blocos iniciais

Na captura publicada do bloco de lançamentos, os oito cards aparecem em uma grade equilibrada de 4×2, com fotos carregadas, títulos, localidade, descrição curta e CTA. O botão de ver todos os lançamentos está centralizado e a transição ondulada para a seção seguinte não invade os cards. O cabeçalho fixo permanece visível durante a rolagem.

Evidência: `/home/ubuntu/screenshots/condominiosnapraia_b_2026-08-17_15-10-51_7210.webp` para as editoriais e `/home/ubuntu/screenshots/condominiosnapraia_b_2026-08-17_15-14-23_5868.webp` / `/home/ubuntu/screenshots/condominiosnapraia_b_2026-08-17_15-10-22_3186.webp` para o estado publicado durante a auditoria.

## Auditoria visual — imóveis selecionados

A seção de apartamentos está visualmente estável nos cards preenchidos, mas a produção apresenta cinco apartamentos, não oito: a última linha fica com um card isolado e grande área vazia. Isso é uma questão de densidade editorial, não uma quebra de CSS; deve ser decidido se o portal deve limitar a quantidade exibida ou preencher a grade com mais imóveis reais.

A seção `sec-fora-cond` apresenta atualmente apenas um imóvel fora de condomínio. O card está corretamente formatado, porém a área vazia ao lado é muito grande em desktop. A onda entre Apartamentos e Fora de condomínio está contida e não cobre os cards.

Evidência: `/home/ubuntu/screenshots/condominiosnapraia_b_2026-08-17_15-14-50_8306.webp`.

## Auditoria visual — terrenos

A seção `sec-terrenos` apresenta seis cards reais, distribuídos em 4 na primeira linha e 2 na segunda. As imagens, títulos, localizações, metragens e preços carregam; a distribuição deixa espaço vazio à direita na segunda linha, mas não há sobreposição ou corte. A seção de terrenos fora de condomínio ainda precisa ser capturada separadamente, assim como o bloco `qfilter2`.

Evidência: `/home/ubuntu/screenshots/condominiosnapraia_b_2026-08-17_15-15-06_1147.webp`.

## Auditoria visual — terrenos fora de condomínio e atalhos

A seção `sec-terrenos-fora` está sem imóveis cadastrados e exibe uma mensagem de cadastro no CRM. O bloco mantém o título e o CTA, mas o vazio é muito amplo; deve ser tratado como estado vazio intencional com texto e ação mais claros, ou preenchido apenas quando houver dados reais.

O primeiro bloco `qfilter2` apresenta cards visuais de Casas em condomínio, Lotes em condomínios e Lançamentos, com imagens carregadas e CTAs. A composição começa em três cards na primeira linha; a auditoria precisa verificar a segunda linha e a responsividade mobile. Não foi identificado vazamento de onda no intervalo observado.

Evidência: `/home/ubuntu/screenshots/condominiosnapraia_b_2026-08-17_15-15-29_9010.webp`.

## Auditoria visual — atalhos e condomínios em destaque

O bloco de atalhos `qfilter2` fecha com seis cards em duas linhas de três, todos com imagens e CTAs. A composição é consistente, embora os cards de Casas fora de condomínio e Apartamentos estejam com imagem de fallback/gradiente, o que deve ser confirmado como ausência de foto ou escolha editorial.

A seção `sec-condominios` inicia com uma grade de condomínios em destaque em 4×2. Os cards carregam imagens reais, cidade, quantidade de imóveis, descrição, tags de infraestrutura e botão “Ver detalhes”. A distribuição e a hierarquia visual estão boas no desktop; será necessário conferir se os links filtram/abrem a página correta e se o mobile não corta os cards.

Evidência: `/home/ubuntu/screenshots/condominiosnapraia_b_2026-08-17_15-15-46_1309.webp`.

## Auditoria visual — transição para editorial

O grid de condomínios fecha com o CTA centralizado e uma onda suave para o bloco `viver-intro-sec`. O cabeçalho “Escolha o seu lado do Litoral Norte” está centralizado, com boa hierarquia e espaço adequado antes da seção Lagoa. A primeira capa editorial aparece carregada e a composição em duas colunas está alinhada no desktop.

As três seções editoriais permanecem com cores próprias e divisores contidos. A auditoria continuará nos blocos pós-editoriais: segundo bloco de atalhos, crédito, guias de cidades, guias de decisão, blog e rodapé.

Evidência: `/home/ubuntu/screenshots/condominiosnapraia_b_2026-08-17_15-16-03_3370.webp`.

## Auditoria visual — editoriais Lagoa, Mar e Cidade

As três seções editoriais estão alinhadas em desktop, com o mesmo padrão de galeria: imagem à esquerda, texto à direita, título Fraunces e CTA consistente. As capas carregam em produção. A onda entre Lagoa, Mar e Cidade fica contida e há espaçamento claro entre os blocos, sem sobreposição observada.

Evidência: `/home/ubuntu/screenshots/condominiosnapraia_b_2026-08-17_15-16-18_2834.webp`.

## Auditoria visual — atalhos pós-editoriais e crédito

O segundo bloco `qfilter` apresenta quatro cards em uma linha: Casas em condomínio, Lotes em condomínios, Lançamentos e Condomínios. As imagens carregam, os títulos têm boa legibilidade sobre o overlay e os links estão visíveis.

A seção `pcred-sec-sec` apresenta três cards de crédito: Crédito Contemplado, Financiamento Imobiliário e Refinanciamento. Os cards têm espaçamento e hierarquia consistentes, mas a seção é visualmente mais clara e minimalista que os atalhos anteriores; isso é coerente com a função de conversão, porém os CTAs são pequenos e podem precisar de teste mobile.

Evidência: `/home/ubuntu/screenshots/condominiosnapraia_b_2026-08-17_15-16-34_8559.webp`.

## Auditoria visual — guias e decisões

A seção `guias-cidades` apresenta quatro cards em uma linha, com imagem, selo de contexto, cidade, descrição e CTA. As imagens carregam e o conjunto está equilibrado.

A seção `guias-decisao` apresenta cinco cards. Em desktop, quatro ficam na primeira linha e o quinto (“Condomínio ou Casa Avulsa?”) começa isolado na segunda linha. Não é uma quebra estrutural, mas reduz o equilíbrio visual e deve ser tratado com grid centralizado para o último card ou com uma sexta pauta real, sem inventar conteúdo.

Evidência: `/home/ubuntu/screenshots/condominiosnapraia_b_2026-08-17_15-16-51_6681.webp`.

## Auditoria visual — formulário, links populares e rodapé

No fechamento da homepage, o formulário de captura aparece antes da seção “Pesquisas mais populares”. Os campos estão visíveis e o botão “Quero receber opções” ocupa a largura do formulário.

A seção de pesquisas populares apresenta vários links em chips, mas a densidade é alta e os chips ficam pequenos no desktop. O rodapé mantém a logo e está organizado em colunas Navegar, Descobrir e Cidades. Na captura, o rodapé ficou muito alto e verticalizado, com alguns links quebrando em várias linhas; no mobile isso precisa de validação específica para evitar estreitamento excessivo.

A onda para o rodapé está visualmente contida, mas a transição é forte e merece verificação em mobile. Evidência: `/home/ubuntu/screenshots/condominiosnapraia_b_2026-08-17_15-17-04_8885.webp`.

## Auditoria visual — blog

A seção `sec-blog-preview` está populada com artigos reais, títulos, categorias, resumos, datas e CTA “Ler artigo”. O CTA “Ver mais notícias” funciona via JavaScript, mas está com `href="#"` como fallback semântico; deve ser alterado para `/blog/` mantendo o comportamento SPA. O carrossel aparece parcialmente deslocado para a esquerda durante a captura, com um card cortado na margem e quatro cards visíveis; isso deve ser validado como autoplay intencional e, se necessário, limitado para não gerar overflow horizontal.

As capas dos artigos publicadas são imagens de marca/fallback em alguns cards, não necessariamente fotografias editoriais. Não há imagem quebrada visível no blog.

Evidência: `/home/ubuntu/screenshots/condominiosnapraia_b_2026-08-17_15-23-46_9921.webp`.

## Validação pós-PR #44

A produção entregou os marcadores do PR #44 no HTML. A captura mobile carregou corretamente a hero, a marca Meu Litoral e o início da navegação rápida em 390 px. A captura desktop feita diretamente com a âncora `#guias-decisao` ficou branca, portanto não foi considerada evidência visual válida; a âncora não deve ser usada para concluir o teste desktop. A validação HTML e as capturas anteriores em desktop continuam sendo as evidências principais.

## Captura desktop final válida

A captura direta pelo navegador confirmou o resultado do PR #44: quatro cards de decisão na primeira linha e o quinto card centralizado na segunda, sem deslocamento horizontal nem invasão da seção seguinte. O blog começa com os cards alinhados e o CTA de notícias permanece visível.

Evidência: `/home/ubuntu/screenshots/condominiosnapraia_b_2026-08-17_15-32-48_5931.webp`.

## Pendências adicionais — auditoria mobile e componentes internos

A estrutura publicada mantém 17 seções e 39 blocos de regras responsivas em `max-width/min-width` de 600/768 px. A captura mobile de 390 px confirma hero, marca, onda inferior e navegação rápida sem corte lateral.

O DOM publicado confirmou cinco cards no grid de apartamentos e nenhum card real no grid de terrenos fora de condomínio. O estado vazio agora exibe `Ainda não há terrenos fora de condomínio publicados.` no código local, aguardando o próximo deploy.

Os quatro `href="#"` restantes são componentes internos ocultos ou preenchidos em runtime: mapa do detalhe (`d-maps-link`), WhatsApp após envio (`f-wpp-ok`), WhatsApp do sheet mobile (`ms-wpp`) e WhatsApp do modal de imóvel (`im-wpp`). Foram substituídos localmente por fallbacks seguros para Google Maps ou WhatsApp, mantendo a sobrescrita dinâmica dos dados reais.
