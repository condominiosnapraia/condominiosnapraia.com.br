# Condomínios na Praia — Contexto e Pendências (para novo chat)

**Site:** condominiosnapraia.com.br (portal imobiliário, Litoral Norte Gaúcho, RS)
**Data deste resumo:** 12/08/2026
**Stack:** site estático + Supabase (dados) + Cloudflare Pages (hospedagem) + GitHub

---

## 1. INFORMAÇÕES ESSENCIAIS (não perder)

- **WhatsApp oficial:** (51) 98286-8888 → `wa.me/5551982868888`
- **E-mail oficial:** napraiacondominios@gmail.com
- **CRECI:** CRECI-RS 72.386 (obrigatório por lei no rodapé — NÃO remover)
- **Supabase:** URL `https://cddgkhkzcnyzzcllgzoz.supabase.co` (a anon key pública
  está dentro do HTML e do script de build — é de leitura, sem risco)
- **Marca:** o site chama "Condomínios na Praia" (767 menções). Existe um rebranding
  PARCIAL em andamento para "Meu Litoral" — só a LOGO (rodapé) foi trocada; o nome
  textual e o domínio continuam "Condomínios na Praia". Rebranding completo foi
  DELIBERADAMENTE adiado (risco de SEO + troca de domínio).

---

## 2. O QUE JÁ FOI FEITO E ESTÁ NO ZIP (pronto, falta PUBLICAR)

**IMPORTANTE:** muita coisa foi corrigida nos arquivos mas o site NO AR ainda está
desatualizado. O primeiro passo no novo chat é PUBLICAR tudo (GitHub → push →
Purge no Cloudflare) e conferir no ar.

Correções já aplicadas nos arquivos:
- Telefone falso (51) 99999-9999 → removido de tudo (era dado falso indexado no Google)
- WhatsApp unificado (51) 98286-8888 em todas as páginas
- E-mail falso → napraiacondominios@gmail.com
- Títulos dos imóveis únicos e ≤60 caracteres (eram todos "Casa em Litoral Norte")
- Twitter Cards em todas as 391 páginas
- Nomes de corretor removidos → "Entre em contato / nossa equipe" (CRECI mantido)
- Contaminação "Cyano Private Resort" limpa de 21 páginas
- Home reordenada; seções removidas (bairros, crédito contemplado, escolha cidade, onde ir)
- Bairros movidos para /turismo
- Ritmo de cores/ondas da home corrigido (era o maior problema visual recorrente)
- Hero clareado (foto do mar mais visível)
- Logo "Meu Litoral" no rodapé (311 páginas) + favicon + og:image novos
- Páginas órfãs: 126 → 48 (criado índice de condomínios com links internos)
- Schema em 4 páginas institucionais; 855 schemas validados (todos OK)
- Meta descriptions auditadas (só 1 sem, poucas duplicadas — corrigidas)
- Imagens: 0 sem alt; logo do rodapé ganhou width/height (CLS)
- Subpágina órfã allure/turismo removida
- /condominios-index → removido do sitemap + 301 para /condominios
- noindex condicional nas rotas /condominio/?id= e /imovel/?id=
- **build-condominios.js** criado: script que lê o Supabase e preenche as 82 páginas
  de condomínio com conteúdo real (descrição, dados, infraestrutura, diferenciais,
  fotos, imóveis) + cabeçalho completo + rodapé completo. JÁ FOI RODADO uma vez
  com sucesso (79 páginas preenchidas). Ver COMO-RODAR-BUILD.md.

---

## 3. PENDÊNCIAS — O QUE FALTA FAZER

### 3A. AÇÃO DO USUÁRIO — publicar e rodar (fazer primeiro)
1. **PUBLICAR tudo** (GitHub push + Purge Cloudflare) — a produção está atrasada.
2. **Rodar o build-condominios.js de novo** (versão atual, com header+footer+fotos)
   e publicar, para as páginas de condomínio ficarem completas no ar.
3. Após publicar, conferir no ar: /sunset-xangri-la, /carmel-xangri-la, /blog.

### 3B. AÇÕES DE SEO QUE NÃO SÃO CÓDIGO (o que REALMENTE move o ponteiro)
Diagnóstico da Manus AI (12/08) foi claro: **o site é tecnicamente saudável.** Não
aparece no Google porque o **domínio tem 4 meses** e **não tem autoridade/backlinks**,
não por causa de código. Prioridades:
1. **Google Search Console** — verificar propriedade, enviar sitemap, pedir remoção
   da URL /condominio/?id=carmel-xangri-la (tinha telefone falso indexado).
2. **Google Business Profile** (ficha do Google/Maps) — canal mais rápido p/ aparecer.
3. **Redes sociais** @condominiosnapraia (Instagram/Facebook) com link p/ o site.
4. **Backlinks** — pedir às construtoras dos 88 condomínios um link para o site.
5. **Paciência:** KWs competitivas (ex. "condomínios capão da canoa") levam 12+ meses.
   Focar em cauda longa (nome do condomínio + cidade) que é vencível antes.

### 3C. PENDÊNCIAS DE CÓDIGO (dá para fazer em arquivo, ainda não feito)
- **Blog:** no ar aparece vazio ("Artigo não encontrado"). No repo tem 48 KB. Após
  publicar, se continuar vazio, é problema de SSR (renderização no servidor) — a
  listagem carrega via JS e o Google não vê. Precisa gerar listagem estática.
- **3 páginas âncora** (/casas-em-condominio, /terrenos-em-condominio, /imoveis-de-luxo):
  retornam 404. Usuário tinha optado por pular; criar quando quiser.
- **Duplicidade /atlantida × /xangri-la-atlantida:** definir uma canônica + 301.
- **Textos sem acento** em páginas de imóvel ("Inicio › Imoveis", "Lancamentos") —
  problema de codificação a corrigir.
- **Schema Organization + sameAs** (redes sociais, CRECI, endereço) — ajuda o Google
  a diferenciar "Condomínios na Praia" (com s) da concorrente "Condomínios da Praia".
- Reduzir HTML da home (meta ~150 KB) — parcial.

### 3D. PENDÊNCIAS QUE SÓ O SERVIDOR/CLOUDFLARE RESOLVE (não é arquivo)
- 301 definitivo das rotas paramétricas (/condominio/?id= → /nome-cidade/)
- 301 de imóvel /imovel?id= → slug
- Cache de borda, Brotli, HTTP/2 (painel Cloudflare)
- Core Web Vitals reais (LCP, INP, CLS, TTFB) — medir no PageSpeed em produção
- Blog com SSR de verdade

---

## 4. CONCORRÊNCIA / GUERRA DE MARCA
Existe concorrente com nome quase idêntico: **condominiosdapraia.com.br**
("da praia" em vez de "na praia"), mais antiga e estabelecida. Quando alguém busca
"condominios na praia", o Google mostra a concorrente. Resolver isso é parte das
ações de autoridade (schema sameAs, Business Profile, redes com nome exato).

---

## 5. LEMBRETES OPERACIONAIS
- Publicar = substituir arquivos no GitHub, commit, push, DEPOIS Purge no Cloudflare.
- Favicon e og:image têm cache teimoso — testar preview em
  developers.facebook.com/tools/debug → "Scrape Again".
- CRM (crm.html) é interno, não indexado — não precisa de SEO.
- Documentos de auditoria recebidos: "Segunda_melhoria.pdf" (34 itens, 3ª rodada),
  "Diagnóstico Manus" (por que não aparece no Google), "Relatório Verificação Fase 0".
