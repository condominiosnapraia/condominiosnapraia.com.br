# Revisão móvel do e-mail — captura do Gmail

## Segmentos 1–2

A captura tem 1080 × 9038 px e foi dividida em 13 segmentos verticais sobrepostos. No topo, o assunto do Gmail ocupa muitas linhas por repetir o título integral do imóvel; dentro do e-mail, o cabeçalho institucional tem grande margem e o título principal em fonte serifada está excessivamente grande, quebrando em muitas linhas. Em telas estreitas, a prioridade deve ser reduzir o assunto exibido no cartão e limitar o título interno a uma escala mais compacta, com `font-size` móvel próximo de 19–21 px e `line-height` de 1,2. O espaçamento lateral também pode cair para 16–18 px no mobile.

## Segmentos 3–4

O título do cabeçalho ocupa praticamente uma tela inteira e cria uma quebra visual excessiva antes da foto. A capa tem boa proporção e não precisa ser reduzida, mas deve começar mais cedo. A ficha repete o mesmo título em tamanho muito grande logo após a foto, gerando redundância e alongando o e-mail. A solução é manter um título compacto apenas no cabeçalho e, na ficha, substituí-lo por uma linha curta de contexto ou remover a repetição. A etiqueta “Imóvel selecionado” também pode usar menor espaçamento vertical.

## Segmentos 5–6

Os cartões de código, valor e localização mantêm duas colunas no Gmail mobile, mas usam texto e padding grandes; o valor quebra desnecessariamente e o cartão de localização fica alto. Devem ser compactados para fonte de 12–13 px, labels de 9–10 px e padding de 9–10 px. A localização pode ocupar largura total e os campos curtos permanecer lado a lado. Destaques e descrição estão com corpo muito grande e line-height excessivo; recomenda-se 13–14 px com line-height de 1,5. O título “Sobre o imóvel” pode cair para 17–18 px.

## Segmentos 7–9

A galeria do imóvel em duas colunas mantém imagens visualmente estreitas no telefone, embora sem deformação; para um resultado premium no mobile, a prioridade deve ser uma imagem por linha, com largura total e altura proporcional, reduzindo a sensação de fotos espremidas. Isso aumenta o comprimento, portanto a galeria deve ser compactada com margens menores e sem bordas excessivas. A seção do condomínio repete o problema do título grande: “Atlântida Green Square” quebra em duas linhas com escala desproporcional. O título condominial deve usar aproximadamente 19–21 px no mobile. Os cartões de localização e padrão também podem ser compactados e os campos curtos mantidos lado a lado.

## Segmentos 10–12

As fotos do condomínio repetem a mesma compressão visual da galeria do imóvel. O melhor ajuste será trocar as duas colunas por uma coluna no mobile, mantendo `width:100%` e uma altura proporcional menor, aproximadamente 150–180 px, para cada foto. Os botões finais têm área de toque adequada, mas a fonte está grande e o texto quebra; no mobile devem usar 12–13 px, padding vertical de 11–12 px e rótulos curtos como “Ver imóvel” e “WhatsApp”. O texto de apoio também pode ser reduzido para 11–12 px e a assinatura deve permanecer compacta.

Ainda falta inspecionar o último segmento para confirmar o rodapé e a assinatura; até aqui, o problema principal está confirmado como tipografia desktop aplicada no mobile e galerias em duas colunas sem regra responsiva específica.
