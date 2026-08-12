# Como preencher as páginas de condomínio (build-condominios.js)

Este script lê os condomínios do **Supabase** e preenche cada página
`/nome-cidade/index.html` com o conteúdo real (descrição, infraestrutura,
dados, diferenciais e lista de imóveis) **direto no HTML** — resolvendo o
problema das páginas que apareciam "praticamente vazias" no Google.

## Passo a passo

1. Tenha o **Node 18 ou superior** instalado (`node -v` para conferir).
   - Em Node 18+, o `fetch` já é nativo (não precisa instalar nada).
   - Em Node mais antigo: `npm i node-fetch` e descomente a 1ª linha do script.

2. Coloque o arquivo `build-condominios.js` na **raiz do site** (a pasta que
   contém as pastas dos condomínios, tipo `sunset-xangri-la/`).

3. Rode:
   ```
   node build-condominios.js
   ```

4. O script vai:
   - Ler todos os condomínios e imóveis do Supabase.
   - Para cada condomínio, encontrar a pasta pelo `slug` e inserir um bloco
     `<section class="cond-conteudo-full">` antes do `<footer>`.
   - Mostrar no terminal quais páginas foram preenchidas.

5. Revise 2 ou 3 páginas no navegador (abrindo o arquivo local ou após subir),
   confira que o conteúdo está certo, e publique normalmente:
   ```
   git add .
   git commit -m "Preenche paginas de condominio com conteudo real (SEO)"
   git push
   ```

6. Depois de publicar, **limpe o cache do Cloudflare** (Purge Everything).

## É seguro?

- **Sim.** O script NÃO apaga páginas nem conteúdo. Ele só INSERE um bloco.
- É **idempotente**: se rodar de novo, ele substitui o bloco antigo pelo novo
  (útil quando você atualizar dados no CRM e quiser regenerar).
- Se um condomínio do banco não tiver pasta correspondente, a página é
  simplesmente ignorada (nada quebra).

## Quando rodar de novo

Sempre que você **atualizar o conteúdo de um condomínio no CRM** (descrição,
infraestrutura, novos imóveis), rode o script de novo e publique — as páginas
estáticas passam a refletir os dados novos.

## Observação sobre a chave

O script usa a mesma chave pública (anon key) que o site já usa no navegador —
ela é feita para uso público e só permite leitura das tabelas liberadas. Não há
risco de segurança em tê-la no script.
