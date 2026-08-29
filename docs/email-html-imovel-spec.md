# Especificação do e-mail HTML de imóvel

O e-mail deve apresentar uma capa do imóvel seguida de uma galeria com até quatro imagens adicionais, totalizando até cinco fotos reais. As URLs devem vir exclusivamente de `fotos_no_site`, `fotos` e `fotos_para_site`; duplicatas e valores inválidos devem ser eliminados. Se houver menos fotos, a galeria deve reduzir sem espaços vazios.

A ficha principal deve exibir título, código, valor, localização, destaques e descrição. O botão principal deve abrir a página pública canónica do imóvel.

A seção do condomínio deve ser exibida apenas quando houver condomínio vinculado. Deve usar o nome, cidade, bairro, descrição, amenidades, ano, padrão, incorporadora e área total realmente cadastrados. A galeria do condomínio deve ter até quatro fotos reais, obtidas de `fotos_no_site`, `fotos` e `fotos_para_site`; a seção de fotos deve ser omitida quando não houver imagens.

O CTA de WhatsApp deve apontar para o número oficial `+55 51 9769-8450` e iniciar uma mensagem com o título, o código de referência e o link do imóvel. O HTML deve usar tabelas e estilos inline para compatibilidade com Gmail e outros clientes, sem JavaScript, formulários ou conteúdo inventado.

O texto alternativo deve continuar disponível para clientes que não renderizam HTML e incluir imóvel, código, valor, localização, página completa e WhatsApp oficial.
