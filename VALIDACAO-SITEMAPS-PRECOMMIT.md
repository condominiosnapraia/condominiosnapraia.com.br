# Validação pré-commit dos sitemaps

O repositório agora inclui `scripts/validate_sitemaps_precommit.py` e o hook versionado `.githooks/pre-commit`. O objetivo é impedir que um commit deixe no sitemap URLs com redirects, 404, 5xx, XML inválido, duplicatas, ausência de barra final ou canonical divergente.

## Ativação uma única vez

Na raiz do repositório, execute:

```bash
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit scripts/validate_sitemaps_precommit.py
```

A configuração `core.hooksPath` fica no `.git/config` local e não é enviada ao GitHub. Por isso, cada computador que clonar o repositório precisa executar esses dois comandos uma vez.

## Execução manual

Para validar os três sitemaps públicos:

```bash
python3 scripts/validate_sitemaps_precommit.py
```

Para salvar o relatório em outro local:

```bash
python3 scripts/validate_sitemaps_precommit.py \
  --output /tmp/sitemap-validation-report.json
```

Opções úteis:

```bash
# Usar outro ambiente, como staging
SITEMAP_BASE_URL=https://staging.condominiosnapraia.com.br \
  python3 scripts/validate_sitemaps_precommit.py

# Executar com mais concorrência
python3 scripts/validate_sitemaps_precommit.py --workers 20 --timeout 30

# Testar apenas as primeiras URLs durante desenvolvimento
python3 scripts/validate_sitemaps_precommit.py --limit 50
```

## Comportamento do hook

Depois da ativação, o comando normal continua sendo:

```bash
git add .
git commit -m "mensagem do commit"
```

Antes de criar o commit, o hook executa o validador contra:

- `https://condominiosnapraia.com.br/sitemap.xml`;
- `https://condominiosnapraia.com.br/sitemap-condominios.xml`;
- `https://condominiosnapraia.com.br/sitemap-imoveis.xml`.

O commit só prossegue quando o script termina com código `0` e mostra:

```text
OK: sitemaps sem redirects, 4xx/5xx, duplicatas ou canonicals divergentes
```

Se houver falha, o hook retorna código `1`, lista as primeiras ocorrências e grava o relatório JSON em um arquivo temporário. O commit é interrompido para que o problema seja corrigido antes do push.

## O que é considerado falha

| Regra | Exemplo |
|---|---|
| Sitemap não responde diretamente HTTP 200 | sitemap retornando 301 ou 500 |
| XML inválido | XML quebrado ou sem `<urlset>`/`<sitemapindex>` |
| URL duplicada | mesmo `<loc>` em dois sitemaps |
| URL de página sem barra final | `/allure-beach-condo-xangri-la` |
| Redirect | `<loc>` retorna 301, 302, 307 ou 308 |
| Erro HTTP | 404 ou 5xx |
| Canonical ausente | página sem `<link rel="canonical">` |
| Canonical divergente | `<loc>` raiz, mas canonical `/condominio/...` |
| Query string ou fragmento | URL contendo `?id=` ou `#secao` |

## Por que o script usa `allow_redirects=False`

A validação não deve considerar um redirect como sucesso apenas porque o destino final responde HTTP 200. O objetivo do sitemap é listar o destino canônico diretamente. Por isso, um 301, 302, 307 ou 308 é reportado como falha e precisa ser eliminado do `<loc>`.

## Bypass emergencial

Se houver uma emergência operacional e for necessário criar um commit sem consultar a rede, o bypass temporário é:

```bash
SKIP_SITEMAP_VALIDATION=1 git commit -m "mensagem"
```

Esse bypass deve ser excepcional, registrado na descrição do commit e seguido por uma validação manual antes do push. Ele não corrige o problema e não deve ser usado para publicar mudanças de SEO.

## Integração com GitHub Actions

O hook protege o commit local. Para proteger também o repositório remoto, o mesmo comando pode ser adicionado a um workflow de pull request:

```yaml
name: Validar sitemaps

on:
  pull_request:
  push:
    branches: [main]

jobs:
  sitemap:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install requests beautifulsoup4
      - run: python3 scripts/validate_sitemaps_precommit.py --workers 16 --timeout 30
```

O workflow deve ser ativado depois que o sitemap público estiver corrigido. Enquanto o site ainda publicar as URLs legadas e os canonicals divergentes identificados na auditoria, o resultado esperado é falha — exatamente para impedir uma publicação silenciosamente incorreta.
