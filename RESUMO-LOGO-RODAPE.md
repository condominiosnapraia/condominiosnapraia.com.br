# Atualização de Logo, Rodapé, Favicon e OG-image

## Arquivos de imagem gerados (a partir da logo azul "Condomínios na Praia")
- **img/logo-header.png** (+ .webp) — logo AZUL, fundo transparente → header (fundo branco).
- **img/logo-rodape.png** — texto BRANCO + ícone COLORIDO (palmeira/casa clareadas
  para destacar no azul) → rodapé (fundo azul escuro).
- **img/favicon-32/180/192/512.png** e **favicon.ico** — só o ÍCONE (brasão redondo).
- **img/og-image.jpg**, **og-home.jpg**, **og-default.jpg** — 1200×630, logo branca
  sobre o degradê azul do site (cards de redes sociais).

## Correções de alinhamento no rodapé (aplicadas em todas as páginas)
1. **Botão "Falar no WhatsApp" no desktop** estava esticado e desalinhado.
   Causa: a regra `.ftr-col a{display:block}` sobrescrevia o `inline-flex` do botão.
   Correção: adicionada `.ftr-col-brand .ftr-wpp{display:inline-flex;width:auto}`
   (mais específica) em 312 páginas → botão volta ao tamanho do conteúdo, centralizado.
2. **Botão no mobile** sem `align-items:center` → ícone e texto desalinhados.
   Correção aplicada em 90 páginas.
3. **Logo do rodapé** com `width` duplicado/conflitante → padronizado em 310 páginas
   (`width:210px;height:auto`).

## Publicar
1. Substituir os arquivos no GitHub (pasta img/ + as páginas .html).
2. Commit + push.
3. **Cloudflare → Purge Everything.**
4. Favicon e og:image têm cache teimoso: testar o preview social em
   developers.facebook.com/tools/debug → "Scrape Again".

## Observações
- Favicon em 16px fica com bastante detalhe (limite do formato). Se quiser, dá para
  simplificar só o brasão para ficar mais nítido nesse tamanho mínimo — é só pedir.
- Se preferir a versão do rodapé "tudo branco" (mais contraste) em vez de
  "texto branco + ícone colorido", também dá para trocar rapidamente.
