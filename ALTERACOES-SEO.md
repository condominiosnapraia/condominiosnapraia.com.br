# Alterações de SEO e Correções — Condomínios na Praia

Consolidado de todas as correções aplicadas (base: auditoria SEO + bugs encontrados).

## Correções aplicadas

### SEO — Titles e conteúdo
- **220 páginas de imóvel** agora têm `<title>` único e descritivo (antes 142 tinham
  o mesmo título genérico "Casa em Litoral Norte"). og:title também atualizado.
- **ALT das imagens** dos 220 imóveis agora usa o título real do imóvel + cidade
  (antes: "Casa em Litoral Norte - foto N").
- **Página de condomínio** agora exibe o conteúdo rico gerado pelo CRM (história,
  infraestrutura, localização, mercado, diferenciais). Antes esses campos eram
  salvos no banco mas não apareciam no site. Também corrigida a fonte da descrição
  (estava 6px, ilegível → 15px).

### Contaminação "Cyano Resort" (crítico)
- **21 páginas** tinham meta tags (og/twitter) e schemas (Residence, Place, FAQPage
  de 30 perguntas) do Cyano Private Resort copiados por engano — incluindo
  refinanciamento, contato, sobre, termos, política, seguro-fiança e outras.
  Todas corrigidas para usar os próprios dados de cada página.

### NAP / contato
- **WhatsApp unificado** para (51) 98286-8888 em 390 páginas (antes havia dois
  números; 99944-2252 foi substituído).
- Placeholder "(51) 99999-9999" exibido no template de condomínio corrigido.

### Performance / CLS
- Adicionado width/height nas imagens dos 220 imóveis (reduz layout shift).

### Links e sitemap
- Link quebrado /atlantida corrigido para /xangri-la-atlantida (página que já existe).
- sitemap.xml regenerado com 387 URLs válidas (removidas páginas internas:
  diagnostico, exportar-dados, restaurar, teste-fotos).
- robots.txt atualizado bloqueando CRM, pastas de sistema e páginas internas.

### CRM
- Corrigido bug: proprietários não carregavam ao abrir o CRM (exigia F5). Agora
  qualquer painel ativo é re-renderizado quando os dados chegam.

## Pendências (dependem do backend/servidor — não do código estático)
- Renderização SSR do blog e galerias (hoje via JavaScript, o Google lê mal).
- TTFB alto / cache de borda no Cloudflare.
- Canonical das páginas de condomínio (depende de como o servidor gera as URLs).
- Enriquecer condomínios antigos: gerar+salvar o conteúdo no CRM (a página já exibe).
- E-mail de contato: unificado para napraiacondominios@gmail.com. ✓ FEITO

## Rodada adicional
- #11 URLs com hífen solto: 2 pastas de condomínio renomeadas
  (condominio-maquine-la-marina, condominio-xangri-la-villas-resort),
  links internos e sitemap atualizados, redirects 301 criados em _redirects.
- E-mail: unificado para napraiacondominios@gmail.com.

## Itens conscientemente NÃO alterados (exigem staging/servidor)
- #8 URLs de imóvel descritivas (/imovel-cap-001): mexeria em 220 pastas + 660
  links + JS dinâmico. Risco alto de quebrar links indexados; recomendado fazer
  em ambiente de teste com redirects 301.
- #2 Canonical dos condomínios, #4 SSR do blog, #9 otimização de imagens na
  origem, #13 TTFB/cache de borda: dependem de configuração de servidor/backend.
