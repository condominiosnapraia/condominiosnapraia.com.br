# Resultado da correção de fotos

Data: 22/11/2026.

## Diagnóstico

A auditoria somente leitura analisou 89 condomínios ativos e 380 imóveis publicados e não vendidos. Antes da limpeza, foram encontrados 325 URLs quebradas em condomínios, 306 URLs de fotos de imóveis cadastradas indevidamente em condomínios, 333 URLs quebradas em imóveis, 30 condomínios com alguma URL quebrada, 65 imóveis com alguma URL quebrada, 9 condomínios sem nenhuma foto válida e 19 imóveis sem nenhuma foto válida.

O caso do Zen Concept Resort foi confirmado: o registro `id=zen-concept-resort`, `slug=zen-concept-resort-xangri-la`, tinha 18 URLs nos campos `fotos` e `fotos_no_site`, todas no caminho `/fotos/imov/` e todas inexistentes no Storage. O link enviado com `id=zen-concept-resort-xangri-la1` também está incorreto, pois não corresponde exatamente ao ID nem ao slug do registro.

## Correção na origem

A primeira tentativa por REST recebeu HTTP 200, mas não alterou linhas por causa das políticas de RLS; isso foi confirmado por consulta posterior e não foi considerada como correção. Em seguida, foi executada uma atualização SQL autorizada no projeto Supabase `condominiosnapraia`.

Nos condomínios, os campos `fotos` e `fotos_no_site` passaram a manter somente URLs do caminho `/fotos/cond/` cujo objeto existe em `storage.objects`. Todas as URLs de `/fotos/imov/` e os objetos ausentes foram removidos. Nos imóveis, os mesmos campos passaram a manter somente URLs cujo objeto existe no bucket `fotos`. Nenhuma imagem substituta foi inventada ou copiada de outro registro.

Após a correção, as verificações no banco retornaram zero condomínios com fotos em `/fotos/imov/` e zero URLs inválidas restantes nos imóveis publicados. O Zen ficou intencionalmente sem fotos, aguardando o cadastro de imagens reais do condomínio no CRM. O Viz Home Lake ficou com 19 fotos próprias válidas; o Livin Resort Atlantida ficou sem fotos válidas.

## Alteração no site

Os fallbacks dos cards de condomínios e imóveis foram removidos. O catálogo não tenta mais a próxima foto, não usa mapas locais como capa e não mistura fotos de imóveis em cards de condomínios. A página de detalhe também filtra a galeria, a imagem social e o schema para aceitar apenas URLs de `/fotos/cond/`.

Quando não existe foto cadastrada ou a imagem falha, o card mostra `Foto indisponível` em vez de mascarar o problema. A sintaxe JavaScript dos três HTMLs foi validada com `node --check` e o diff passou em `git diff --check`.

## Arquivos de auditoria

- `audit-fotos-catalogos.md`: lista completa de URLs e registros antes da limpeza.
- `audit-fotos-catalogos.csv`: mesma auditoria em formato tabular.
- `auditoria-zen-2026-11-22.md`: evidências específicas do Zen.
- `backup-fotos-antes-limpeza.json`: snapshot dos campos de fotos antes da limpeza SQL, para restauração manual se necessário.
