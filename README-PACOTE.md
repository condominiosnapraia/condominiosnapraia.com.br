# Portal Condomínios na Praia — pacote completo

**Data da consolidação:** 22/08/2026  
**Projeto:** Condomínios na Praia  
**Commit atual do projeto:** `9ec2f211` — `fix: ajustar marca do rodape no mobile`

Este pacote reúne o estado mais recente do projeto publicado, o conteúdo original recebido durante o trabalho e as principais evidências das melhorias, auditorias e validações realizadas.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `projeto-atual/` | Código e ficheiros do repositório atual, incluindo Home oficial, páginas de imóveis e condomínios, turismo, crédito contemplado, CRM, integrações, landings dos corretores parceiros, SEO, sitemaps, funções e media do projeto. |
| `conteudo-recebido/` | Todos os ficheiros disponibilizados na pasta de uploads, incluindo imagens, PDFs, capturas, pesquisas, relatórios e o ZIP original `condominiosnapraia-SITE-COMPLETO.zip`. |
| `evidencias-e-validacoes/` | Relatórios, resumos, capturas e evidências principais das auditorias de SEO, PageSpeed, mapas, turismo, crédito, parceiros e validação mobile da Home oficial. |

## Melhorias recentes presentes no código

O projeto atual inclui, entre outras entregas, as landings dos corretores Fernando Trevisol, Marcos Selbach e Juliano Machado; os catálogos completos com filtros e carregamento progressivo; páginas individuais de imóveis; galeria protegida por cadastro; WhatsApps individualizados; SEO e sitemaps dos corretores; a página comercial `/parceiros/`; o ajuste das fotos da página oficial `/imoveis/`; e a correção do overflow horizontal mobile da Home oficial.

A correção mobile mais recente limita o lockup da marca no rodapé à largura disponível e mantém a composição centralizada. Ela foi validada em 360, 390 e 430 pixels, sem overflow horizontal ou elementos ofensores.

## Segurança e restauração

O histórico interno `.git`, dependências locais, caches, ficheiros temporários de execução e eventuais ficheiros `.env`/credenciais não foram incluídos. O código do projeto permanece completo para publicação; dependências devem ser reinstaladas pelo gestor do projeto e as variáveis de ambiente devem ser configuradas novamente no ambiente de deploy. Três capturas HTML recebidas de páginas Google tiveram apenas sequências com formato de chave de API substituídas por `[REDACTED_GOOGLE_API_KEY]`, para não transportar credenciais ou chaves reutilizáveis no backup.

Para restaurar o código, utilize a pasta `projeto-atual/` como raiz do projeto. A pasta `conteudo-recebido/` deve ser tratada como arquivo de materiais originais e referências, não como substituição automática dos ficheiros do projeto atual.

> Este ZIP é um pacote de backup e entrega. Não execute ficheiros recebidos de terceiros sem revisão prévia.
