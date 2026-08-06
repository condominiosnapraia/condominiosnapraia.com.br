# Estratégia de Avaliações Reais → Estrelinhas no Google

## Por que fazer nesta ordem
O Google só mostra as estrelinhas (rich snippet) se as avaliações forem **reais e verificáveis**. Avaliação inventada com schema = violação das diretrizes → pode remover os snippets do site inteiro ou gerar ação manual. Por isso: **coletar primeiro, marcar depois.** Este guia monta a coleta agora; quando você tiver ~10-15 avaliações reais, é só preencher e as estrelinhas aparecem.

---

## Passo 1 — Criar/organizar o Google Meu Negócio (base de tudo)
As avaliações do **Google Meu Negócio (Perfil da Empresa)** são as mais fortes: já verificadas pelo Google, aparecem no Maps e na busca, e servem de prova social no site.

1. Acesse **google.com/business** e crie/reivindique o perfil "Condomínios na Praia" (ou o nome comercial).
2. Categoria: **Imobiliária** / **Corretor de imóveis**.
3. Endereço: Av. Central 248, Atlântida, Xangri-lá/RS (o mesmo do site).
4. Depois de verificado, o perfil gera um **link de avaliação** curto (algo como `g.page/r/XXXX/review`). Guarde esse link — é o que você vai mandar pros clientes.

> Enquanto o perfil não está pronto, você já pode coletar depoimentos por escrito (Passo 3).

---

## Passo 2 — Pedir avaliação na hora certa (pós-fechamento)
O melhor momento é logo após entregar a chave / fechar negócio, quando o cliente está feliz.

**Mensagem pronta (WhatsApp)** — já embutida no CRM (botão "Pedir avaliação" no cliente com status Fechado):
> Olá [Nome]! Foi um prazer te ajudar na conquista do seu imóvel 🏡
> Se puder, deixa uma avaliação rápida da sua experiência? Ajuda muito outras famílias a confiarem no nosso trabalho: [SEU LINK DE AVALIAÇÃO]
> Muito obrigado! 🙏

Meta realista: peça a **todos** os clientes fechados. Se 1 em cada 3 responde, em poucos meses você tem 15-20 avaliações reais.

---

## Passo 3 — Coletar depoimentos por escrito (paralelo)
Para clientes que não usam Google, peça um depoimento por WhatsApp e **print/autorização de uso**. Guarde: nome, cidade, texto, nota (1-5), data e o print como prova. Esses também podem virar schema, desde que sejam reais e você tenha a prova guardada.

Planilha sugerida (colunas): Nome | Cidade | Nota | Texto | Data | Fonte (Google/WhatsApp) | Print salvo?

---

## Passo 4 — Publicar no site (quando tiver ~10)
Aí sim entra a parte técnica que eu já deixei pronta:
- A **seção de depoimentos** (arquivo `_secao-avaliacoes.html`) entra na home e/ou página de contato.
- O **schema AggregateRating + Review** (arquivo `_schema-avaliacoes.js`) é preenchido com as avaliações reais e gera as estrelinhas.
- Você me manda a lista real e eu preencho tudo, valido e devolvo pronto pra subir.

---

## Regras de ouro (para NÃO tomar penalização)
- ✅ Só marque com schema avaliações que existem de verdade e você consegue provar.
- ✅ A nota média (`ratingValue`) e a quantidade (`reviewCount`) devem bater com as avaliações realmente exibidas na página.
- ✅ As avaliações marcadas com schema devem estar **visíveis na própria página** (não só no schema).
- ❌ Nunca invente nome, nota ou texto.
- ❌ Não marque com schema avaliações que só existem no Google e não aparecem no site (nesse caso, exiba-as no site também).

---

## Onde cada peça se encaixa
| Peça | Arquivo | Quando usar |
|------|---------|-------------|
| Guia (este) | `_COLETA-AVALIACOES.md` | Agora — plano de ação |
| Botão "Pedir avaliação" no CRM | já incluído no `crm.html` | Ao marcar cliente como Fechado |
| Seção visual de depoimentos | `_secao-avaliacoes.html` | Quando tiver ~10 avaliações |
| Schema Review/AggregateRating | `_schema-avaliacoes.js` | Junto com a seção, preenchido com dados reais |
