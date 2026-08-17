# Investigação de nomes e coordenadas — evidências iniciais

Data da verificação: 2026-08-17.

O hub público `/condominios/` carregou 82 condomínios e expôs filtros por nome, cidade, perfil e tipo. As cidades exibidas no filtro são Atlântida, Capão da Canoa, Maquiné, Osório e Xangri-Lá. O conteúdo carregado mostrou Harmony como condomínio em Capão da Canoa, com perfil beira da lagoa.

A busca textual no conteúdo atualmente carregado do hub não encontrou o termo Tirol. A investigação ainda precisa determinar se Tirol, Ocean Side e Pulse estão apenas no Supabase, se possuem slugs diferentes, ou se foram removidos/inativados da listagem pública.

A consulta direta REST ao Supabase retornou HTTP 401 com a chave pública presente no checkout local; portanto, não se deve inferir coordenadas ou nomes sem outra fonte autorizada. Nenhuma alteração de dados foi realizada.

A pesquisa pública por Harmony retorna exatamente um condomínio: **Harmony Life & Style**, em Capão da Canoa, perfil Beira da Lagoa. A seção “Todos os Condomínios” do mesmo hub agrupa **Ocean Side** e **Pulse Resort Experience** em Xangri-lá. O hub não apresenta Tirol na listagem textual observada.

A divergência confirmada até aqui é de nomenclatura/normalização editorial: o card usa “Harmony”, enquanto o nome descritivo usa “Harmony Life & Style”; Ocean Side e Pulse aparecem como nomes públicos em Xangri-lá. Ainda faltam as coordenadas reais e o slug/cidade do registro de Tirol, que não está exposto no hub atual.

O clique visual no card de Harmony não alterou a URL do hub, indicando que o alvo interativo visível não foi acionado pelo índice selecionado. O DOM bruto foi salvo pelo navegador em `/home/ubuntu/upload/condominiosnapraia.com.br_condominios__1786968831041.html` para extração programática de hrefs, slugs e dados públicos. Nenhuma alteração foi feita no site.

O mapa público informa 393 resultados, dos quais 358 possuem localização confirmada. Entre os quatro alvos: **Harmony** aparece em Capão da Canoa com “Localização no mapa pendente”; **Ocean Side** aparece em Xangri-lá também como “Localização no mapa pendente”; **Pulse Resort Experience** aparece em Xangri-lá sem o rótulo de pendência, portanto com localização confirmada no mapa; **Tirol** não aparece na interface pública nem na busca do mapa.

O mapa já possui um filtro explícito “Sem coordenada confirmada” e não inventa marcadores para registros pendentes. Como não há coordenada autorizada para Harmony/Ocean Side nem registro público para Tirol, não é seguro inserir valores geográficos manualmente.

Atualização após confirmação do utilizador: Tirol não existe e não será incluído; Ocean Side fica em Torres, mas também não será incluído no sistema público; Pulse Resort Experience pertence a Capão da Canoa.

A implementação pública foi ajustada para filtrar `ocean-side-xangri-la` e `tirol` no hub e no mapa, impedir que imóveis associados a esses condomínios permaneçam como registros órfãos no mapa, redirecionar URLs paramétricas excluídas para `/condominios/` e redirecionar a rota estática de Ocean Side via `_redirects`. O Pulse foi movido para o agrupamento de Capão da Canoa e a sua página estática passou a utilizar Capão da Canoa no título, breadcrumb, descrição, localização, mapa, links regionais e textos alternativos.

Fonte pública verificada: https://condominiosnapraia.com.br/condominios/ e https://condominiosnapraia.com.br/mapa/. A API REST do Supabase retornou HTTP 401 na consulta direta; por isso, nenhuma alteração foi feita diretamente no CRM.
