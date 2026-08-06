# Registro de Alterações — condominiosnapraia.com.br

Resumo do que foi feito nesta rodada de ajustes e o que ainda ficou pendente.

## Feito

### Páginas / imagens
- **Página de imóveis**: imagem aérea de Capão da Canoa adicionada como capa
  (hero) em tela cheia, com o texto por cima, no mesmo padrão da home.
- **Página de lançamentos**: foto do pôr do sol adicionada como capa (hero) em
  tela cheia, substituindo o antigo banner azul.
- **Lançamentos — onda do hero**: corrigida a cor (estava cinza por ficar atrás
  do overlay escuro; agora aparece branca, emendando com a página).
- **Lançamentos — filtro**: colocado dentro de um painel/card branco com borda e
  sombra, no mesmo padrão visual das outras páginas.
- **Lançamentos — rodapé**: substituído o rodapé simplificado pelo rodapé
  completo igual ao das demais páginas (colunas Navegar/Descobrir/Cidades, logo,
  botão WhatsApp e barra de copyright).
- **Cards de imóveis**: alinhados ao mesmo formato da home (altura 230px,
  `object-fit: cover`, enquadramento centralizado).

### Pop-up (intenção de saída) da home
- Transformado de mensagem simples em **formulário de captação de lead**
  (nome, telefone/WhatsApp, e-mail).
- Envio integrado ao CRM (Supabase, tabela `leads_campanha`) com
  `origem: "exit-popup"`.
- Visual repaginado (premium): sem emoji, tipografia Fraunces/Outfit, campos
  elegantes, botão sóbrio; WhatsApp como opção secundária.

### Página de cartas contempladas
- **Botão Limpar corrigido**: quebrava por referência a um campo inexistente
  (`f-vmin`), impedindo o reset dos filtros. Corrigido e blindado.
- **Faixas de busca ampliadas** para cobrir todo o estoque:
  - Valor: até "Acima de R$ 3.000.000" (antes parava em R$ 1.000.000).
  - Parcela: até "Acima de R$ 20.000" (antes parava em R$ 5.000).
  - Prazo: até 240 meses (antes 210).
- **Botão "Compartilhar esta carta"** adicionado ao modal: abre o WhatsApp com
  os dados da carta e SEM número fixo, para o cliente enviar a qualquer contato.
- **Correção mobile**: o modal e o botão de compartilhar não ficam mais
  escondidos atrás da barra de navegação inferior fixa.

### Filtro de tipo de imóvel (site)
- Filtro da página de imóveis atualizado para: **Sobrado, Casa Térrea,
  Apartamento, Lote**.
- Compatibilidade durante a migração: "Casa Térrea" também reconhece imóveis
  antigos salvos como "Casa"; "Lote" também reconhece "Terreno" antigo.

### Otimização de imagens (parcial)
- Miniaturas dos cards de imóveis passam pela transformação de imagem do
  Supabase (redimensiona + WebP) para reduzir peso — sem `resize=cover` para
  não cortar de forma errada.
- Ajuste de carregamento de fontes na home (removida requisição duplicada) e
  preload do hero para melhorar o LCP.

### Integração com portais (entregue como pacote separado)
- Feed XML no padrão **VRSync** (Grupo OLX → ZAP, VivaReal, OLX, ImovelWeb).
- Edge Function do Supabase que gera o feed só com imóveis marcados e
  disponíveis (`integrar_portais = true` e `status = Disponível`).
- SQL para criar o campo `integrar_portais` e trecho de checkbox para o CRM.
- Apenas venda (`For Sale`), conforme combinado. XML validado.
- Mapeamento de tipos inclui Casa Térrea e Sobrado.

## Pendente (depende de você / acesso externo)

- **CRM — lista de tipos**: incluir "Sobrado" e trocar "Casa" por "Casa Térrea"
  ao cadastrar/editar imóvel. O código do CRM não está neste repositório;
  enviar o arquivo do CRM para ajuste.
- **CRM — reeditar imóveis antigos**: mudar o tipo de "Casa" para "Casa Térrea"
  nos imóveis já cadastrados (o site já cobre os dois valores nesse meio-tempo).
- **Portais — publicar**: rodar o SQL, publicar a Edge Function, ajustar o bloco
  de contato no `index.ts`, e colar a URL do feed no Canal Pro quando fechar
  contrato. Testar no validador oficial do Grupo OLX.
- **Otimização de imagens (maior ganho)**: no CRM/Supabase, servir as fotos dos
  imóveis já redimensionadas para as miniaturas; e no Cloudflare, subir o cache
  das imagens de 7 dias para ~1 ano.
- **Marca d'água nas fotos**: a marca "Os melhores Condomínios do Litoral"
  gravada nas fotos vem do CRM, não do site.

## Adicionado nas rodadas seguintes

- **Card de imóveis (página imoveis)**: refeito com `aspect-ratio: 4/3` (mesma
  proporção das fotos) — mostra a fachada quase inteira sem faixas cinza;
  título em 2 linhas, specs em linha única com "•", mobile mais imersivo (16:10).
- **CRM (crm.html)**: lista de tipos agora tem Casa Térrea, Sobrado, Apartamento,
  Lote (+ Cobertura, Duplex, Kitnet, Galpão, Outro). Ao editar imóvel antigo,
  "Casa"→"Casa Térrea" e "Terreno"→"Lote" já vêm selecionados.
- **Prévia de compartilhamento (WhatsApp/Facebook)**: criadas as funções
  Cloudflare `functions/imovel.js` e `functions/condominio.js` que injetam
  og:image/título/descrição por imóvel/condomínio. Criados os arquivos
  `img/og-home.jpg` e `img/og-default.jpg` (não existiam — por isso nenhuma
  prévia mostrava foto).
- **Home — bordas dos cards**: casas/sobrados/lotes e lançamentos ganharam
  borda fina escura suave.
- **Home — ondas**: todas as ondas de transição (.sec-onda) trocadas do arco
  simples para o formato ondulado do hero, preservando as cores por seção.
  Onda do hero também trocada para o formato ondulado.
- **Integração portais**: mapa de tipos inclui Casa Térrea e Sobrado.

## Destinos (importante ao publicar)

- **Git / Cloudflare Pages**: todo o site (este pacote), incluindo a pasta
  `functions/` (prévias) e `img/og-*.jpg`. No Cloudflare, cadastrar a variável
  `SUPABASE_ANON_KEY`.
- **Supabase**: o SQL e a Edge Function `feed-portais` (pasta
  `integracao-portais/`). Ver LEIA-ME dessa pasta.
- **CRM**: reeditar imóveis antigos de tipo (opcional; site já cobre os dois).
