# Integração com Portais (ZAP, VivaReal, OLX, ImovelWeb)

Este pacote entrega tudo para exportar seus imóveis para os portais do Grupo OLX
(ZAP, VivaReal, OLX e ImovelWeb usam o mesmo feed). O formato é o **VRSync**,
único padrão oficial mantido pelo grupo.

## Como funciona (visão geral)

1. Você marca no CRM quais imóveis quer publicar (campo `integrar_portais`).
2. Uma Edge Function gera um XML numa URL fixa e pública, sempre atualizado.
3. No painel do portal (Canal Pro), você cola essa URL uma única vez.
4. O portal lê o XML a cada ~12h e publica/atualiza/remove os anúncios sozinho.

Não existe "envio" — os portais **puxam** o XML da sua URL. Por isso não é preciso
cron nem servidor: a URL entrega o XML no momento em que é acessada.

---

## Passo 1 — Adicionar o campo no banco

No Supabase: **Dashboard → SQL Editor → New query**, cole e rode o arquivo
`1-adicionar-campo.sql`. Isso cria o campo `integrar_portais` (e, opcionalmente,
`descricao` e `bairro`).

## Passo 2 — Publicar a Edge Function

Com a CLI do Supabase instalada e logada no seu projeto:

```bash
# copie a pasta feed-portais/ para supabase/functions/ do seu projeto
supabase functions deploy feed-portais --no-verify-jwt
```

O `--no-verify-jwt` é essencial: o portal acessa a URL sem autenticação.

A URL pública fica:
```
https://<SEU-PROJETO>.supabase.co/functions/v1/feed-portais
```

Antes de publicar, abra `feed-portais/index.ts` e ajuste o bloco `CONTATO`
(e-mail, telefone, nome) no topo do arquivo.

## Passo 3 — (Opcional) URL bonita no seu domínio

Se quiser `condominiosnapraia.com.br/feed-portais.xml` em vez da URL do Supabase,
crie no Cloudflare uma regra de redirecionamento/proxy de
`/feed-portais.xml` → a URL da Edge Function. Alguns portais preferem URL
terminada em `.xml`.

## Passo 4 — Marcar imóveis no CRM

Adicione no formulário de edição de imóvel do seu CRM um checkbox ligado ao
campo `integrar_portais`. Veja `2-checkbox-crm.html` para o trecho pronto.
Marque os imóveis que quer exportar e salve.

## Passo 5 — Conectar no portal

Quando fechar contrato com o portal, no **Canal Pro** (Grupo OLX):
Configurações da conta → Integração de anúncios → selecione o software
("Outro"/"XML próprio") → cole a URL do feed → Adicionar.

## Testar antes de contratar

- Abra a URL do feed no navegador: deve aparecer o XML com seus imóveis marcados.
- Valide no validador oficial:
  https://developers.grupozap.com/feeds/xml_validator/
  (cole a URL ou o conteúdo e veja se passa sem erros).

---

## Observações importantes

- **Só entram imóveis** com `integrar_portais = true` **e** `status = Disponível`.
  Quando um imóvel é vendido (status muda), ele sai do feed na próxima leitura —
  é assim que o portal "remove" o anúncio automaticamente.
- **Fotos** precisam estar acessíveis publicamente (o feed usa as URLs do
  `/cdn-fotos/`). Isso já funciona no seu site.
- O feed atual gera **apenas venda** (`For Sale`), como combinado. Para incluir
  aluguel depois, é só adicionar os campos `RentalPrice` e `TransactionType`.
- A descrição do anúncio usa o campo `descricao` (se existir) ou o título.
  Descrições completas melhoram muito o desempenho nos portais.

## Campos que valem preencher no CRM para bons anúncios

Título, descrição, preço, tipo, cidade, bairro, área construída, área do
terreno, quartos, suítes, vagas e boas fotos (a primeira vira a capa).
