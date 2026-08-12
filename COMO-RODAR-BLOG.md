# Como gerar o blog estático (build-blog.js)

Resolve o problema do blog que aparecia **vazio / "Artigo não encontrado"** no
Google. Antes, `/blog` era uma página de *artigo único* que carregava tudo por
JavaScript — o Google não via conteúdo e não existia uma listagem.

Agora o script gera **HTML estático** que o Google enxerga:

- **`/blog/index.html`** → listagem de verdade (grade de cards com todos os posts).
- **`/blog/<slug>/index.html`** → uma pasta por artigo, com o texto no HTML
  (título, capa, corpo, meta, schema BlogPosting). URLs limpas `/blog/nome-do-artigo/`.
- **`sitemap.xml`** → atualizado com cada artigo.

## Passo a passo

1. Node 18+ (`node -v`). Em Node 18+ o `fetch` é nativo, não instala nada.

2. Coloque `build-blog.js` na **raiz do site** (a pasta que contém `/blog`).

3. Teste o visual primeiro, sem tocar no banco:
   ```
   node build-blog.js --demo
   ```
   Isso gera a listagem + 3 artigos de exemplo. Abra `blog/index.html` no
   navegador para ver. **Depois de conferir, apague as pastas de exemplo**
   (`guia-para-comprar-...`, `xangri-la-ou-atlantida-...`,
   `5-sinais-...`) OU simplesmente rode o comando real no passo 4, que
   regenera tudo a partir do banco.

4. Rode de verdade (lê o Supabase):
   ```
   node build-blog.js
   ```

5. Confira 2 ou 3 artigos no navegador e publique:
   ```
   git add .
   git commit -m "Blog estatico: listagem + artigos no HTML (SEO)"
   git push
   ```

6. **Purge Everything** no Cloudflare.

## Importante

- O script lê apenas artigos com `publicado = true`, ordenados do mais novo
  para o mais antigo. Se a sua coluna tiver outro nome, me avise que ajusto.
- Campos que ele entende (usa o que existir): `titulo/title`,
  `conteudo/corpo/content`, `slug`, `capa/imagem`, `categoria`, `autor`,
  `resumo/excerpt`, `data/created_at/criado_em`.
- **Idempotente:** sempre que você criar/editar um post no CRM, rode de novo e
  publique — as páginas passam a refletir os dados novos.
- É seguro: só escreve dentro de `/blog` e ajusta o `sitemap.xml`.

## Links antigos `/blog?id=...`

As páginas antigas usavam `/blog?id=slug`. Vale adicionar no `_redirects` do
Cloudflare uma regra para mandar esse formato para a URL nova, por exemplo:
```
/blog/:id  /blog/:id/  301
```
(Me chame quando for mexer no `_redirects` que eu monto a regra certa conforme
os slugs reais.)
