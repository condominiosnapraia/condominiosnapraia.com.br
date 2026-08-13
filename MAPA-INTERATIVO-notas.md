# Mapa interativo de imóveis (/imoveis) — notas

Implementado modo **Lista + Mapa** com Leaflet + OpenStreetMap + MarkerCluster,
carregados sob demanda (lazy) só quando o usuário clica em "Mapa".

## Como funciona
- Botão "☰ Lista / 🗺️ Mapa" alterna a visualização.
- Desktop: lista à esquerda + mapa à direita. Mobile: mapa quase cheio com botão "← Lista".
- Os filtros atuais (cidade, condomínio, tipo, dormitórios, preço) continuam
  valendo e sincronizam com os marcadores.
- Marcadores agrupam (cluster) quando próximos; ao dar zoom, viram individuais.
- Clicar no marcador abre card com foto, título, condomínio, specs, preço e "Ver imóvel".
- Botão "📍 Ver no mapa" em cada card centraliza o mapa naquele imóvel.
- Botões: zoom, ⌂ (voltar à região), ◎ (minha localização — pede permissão só ao clicar).
- Legenda por tipo (Casa, Sobrado, Apto, Terreno).

## Coordenadas (IMPORTANTE)
- Usa a **latitude/longitude do condomínio** (campos que já existem no CRM).
- Se o condomínio NÃO tiver coordenadas, usa a coordenada **aproximada da cidade**
  e marca o card do mapa como "Localização aproximada".
- **Ação recomendada:** preencha latitude/longitude dos condomínios no CRM para os
  imóveis aparecerem no ponto certo. Enquanto não preencher, eles aparecem
  agrupados no centro da cidade (comportamento esperado da 1ª versão).
- Nunca inventa coordenada exata de casa/lote (privacidade do proprietário — item 13).

## Performance / SEO
- Leaflet só carrega quando o usuário abre o mapa (não pesa no carregamento inicial).
- A listagem textual e os links de cada imóvel continuam intactos (bom p/ SEO e acessibilidade).

## Campos futuros (opcional, quando quiser precisão por imóvel)
No CRM/Supabase, criar colunas opcionais na tabela imoveis:
- latitude_imovel (number)
- longitude_imovel (number)
- localizacao_precisa (boolean)
Depois é só ajustar a função coordDoImovel() para priorizá-las.
