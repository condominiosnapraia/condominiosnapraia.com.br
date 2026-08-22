# MVP multi-corretor — Condomínios na Praia

## Objetivo

O MVP permite cadastrar um site parceiro por corretor, selecionar imóveis públicos do catálogo central, publicar uma landing padronizada, receber leads com consentimento LGPD e disponibilizar um feed JSON somente leitura para integração com sites externos.

## Rotas públicas

| Rota | Função | Publicação |
|---|---|---|
| `/parceiros/` | Página comercial do produto e apresentação dos planos | Pública e incluída no sitemap |
| `/parceiro/:slug` | Landing individual do corretor | Só responde 200 quando `parceiros_sites.status = active` |
| `/parceiro-feed/:slug` | Feed JSON de imóveis publicados | Só responde 200 para site ativo |
| `/parceiro-lead` | Endpoint POST de leads | Exige site ativo, nome, telefone e consentimento LGPD |

## Uso no CRM

No CRM, abra **Sistema → Sites de Corretores**. Em `+ Novo site parceiro`, cadastre o nome, slug, WhatsApp, e-mail e apresentação. O registro é criado em modo rascunho.

Depois, selecione o site, marque os imóveis autorizados e use **Publicar**. O imóvel relacionado é apenas referenciado na tabela do parceiro; nenhum campo da tabela `imoveis` é alterado. O botão **Abrir landing** mostra a URL pública e **Feed JSON** copia a URL de integração.

## Tabelas novas

| Tabela | Finalidade |
|---|---|
| `parceiros_sites` | Perfil, slug, cores, status e plano de cada landing |
| `parceiros_sites_imoveis` | Relação entre site e imóveis autorizados |
| `parceiros_leads` | Leads originados nas landings, separados por site |
| `parceiros_planos` | Planos Inicial, Profissional e Equipe |
| `parceiros_assinaturas` | Estado da assinatura em modo trial, sem gateway ativo |

Todas as novas tabelas têm RLS habilitado. A leitura pública é limitada a sites ativos e imóveis marcados como publicados. A inserção pública de leads exige `consentimento_lgpd = true`. Administradores autenticados gerenciam o módulo; a política de proprietário usa `owner_usuario_id`.

## Limites desta versão

A cobrança recorrente ainda não foi ativada. A criação do site gera uma assinatura `trial`, mas não há cartão, checkout, webhook ou suspensão automática por inadimplência. O domínio próprio também continua manual e deverá ser configurado no Cloudflare depois que o piloto for validado.

O feed atual é público e somente leitura. A próxima etapa para atender sites externos de maior porte é adicionar autenticação por site, rate limit, logs e, se necessário, um plugin WordPress.
