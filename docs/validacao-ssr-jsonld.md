# Validação automatizada de SSR e JSON-LD

O script `scripts/validate_property_ssr_jsonld.py` valida o HTML bruto das páginas canônicas de imóveis, sem depender da execução de JavaScript. Ele verifica H1, título, meta description, canonical absoluto, bloco SSR, imagem principal, Open Graph, `RealEstateListing`, preço em BRL quando disponível e identificadores internos no conteúdo público.

## Auditoria completa em produção

```bash
python3 scripts/validate_property_ssr_jsonld.py \
  --base-url https://condominiosnapraia.com.br \
  --workers 6 \
  --timeout 60 \
  --retries 2 \
  --output /tmp/property-ssr-jsonld-report.json
```

O script lê `/sitemap-imoveis.xml` por padrão e testa todas as URLs de imóveis. O código de saída é `0` quando todas passam e `1` quando há falhas.

## Teste piloto ou URL específica

```bash
python3 scripts/validate_property_ssr_jsonld.py --limit 10
python3 scripts/validate_property_ssr_jsonld.py \
  --url https://condominiosnapraia.com.br/imovel/slug-do-imovel/
```

## Validação de sitemaps

O validador já existente continua sendo executado no pré-commit:

```bash
python3 scripts/validate_sitemaps_precommit.py \
  --base-url https://condominiosnapraia.com.br \
  --workers 6 \
  --timeout 60 \
  --output /tmp/sitemap-validation-report.json
```

Ele confirma que as URLs dos sitemaps respondem HTTP 200, não redirecionam, usam canonical coerente, não estão duplicadas e não apresentam falhas HTTP.

## Hook de pré-commit

A validação de sitemap é obrigatória no hook. A validação de SSR/JSON-LD é opcional porque ela verifica a versão publicada; antes do deploy, a produção pode ainda estar servindo o commit anterior. Para executar as duas validações quando a produção estiver sincronizada:

```bash
RUN_PROPERTY_SSR_VALIDATION=1 git commit -m "mensagem do commit"
```

É possível ajustar concorrência e tentativas:

```bash
RUN_PROPERTY_SSR_VALIDATION=1 \
SSR_WORKERS=6 SSR_TIMEOUT=60 SSR_RETRIES=2 \
git commit -m "mensagem do commit"
```

## Critério de aprovação

Um lote é considerado aprovado quando o validador de SSR/JSON-LD e o validador de sitemap terminam com zero falhas. O teste de SSR não verifica somente o DOM final: ele usa a resposta HTML recebida diretamente por `requests`, o que permite detectar conteúdo que só apareceria após JavaScript.

A validação complementar no [Google Rich Results Test](https://search.google.com/test/rich-results) e no [Schema Markup Validator](https://validator.schema.org/) continua recomendada para uma amostra de páginas, mas não é necessária para a cobertura automatizada de todo o sitemap.

## GitHub Actions

O workflow `.github/workflows/validate-production-ssr-jsonld.yml` executa as duas validações gratuitamente em três situações: após cada push em `main`, diariamente às 08:17 UTC e manualmente pela aba **Actions** do GitHub. Depois de um push, ele aguarda 90 segundos para permitir a propagação do Cloudflare Pages antes de consultar a produção.

A execução manual aceita o campo `limit`. Use `0` para auditar todo o sitemap ou informe `30` para validar somente as primeiras 30 URLs durante uma conferência rápida. Cada execução armazena `sitemap-validation-report.json` e `property-ssr-jsonld-report.json` como artefatos por 14 dias.

O workflow possui `permissions: contents: read`, não usa segredos, não acessa o Supabase e não contrata serviços externos pagos. O teste consulta apenas as URLs públicas do site.

Para acompanhar uma execução, abra o repositório no GitHub, acesse **Actions**, selecione **Validar produção — SSR e JSON-LD** e abra a execução desejada. Se o job falhar, baixe o artefato de relatórios, corrija a origem ou o template e faça um novo deploy. Uma falha não deve ser ignorada quando envolver H1, JSON-LD, canonical, sitemap ou privacidade.
