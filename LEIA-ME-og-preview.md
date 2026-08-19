# Correção da prévia de compartilhamento (WhatsApp, Facebook, etc.)

## O problema

Ao compartilhar o link de um imóvel específico (`/imovel?id=XXX`) no WhatsApp,
a prévia não mostra a foto do imóvel — aparece algo genérico ou nada.

## Por que acontece

O WhatsApp, Facebook, Telegram e afins **não executam JavaScript**. Eles leem
apenas o HTML "cru" que o servidor entrega e procuram as meta tags Open Graph
(`og:image`, `og:title`, `og:description`).

No seu site, a página `/imovel/index.html` é um arquivo estático único, igual
para todos os imóveis. A foto e os dados só entram depois, via JavaScript, quando
o navegador de uma pessoa abre a página. Como o robô do WhatsApp não roda esse
JS, ele nunca vê a foto — e ainda por cima a página não tinha a tag `og:image`.

(O próprio código já previa isso: há um comentário "crawlers usam a Cloudflare
Function" — mas essa função nunca foi criada. É ela que este pacote entrega.)

## A solução

Uma **Cloudflare Pages Function** que intercepta os acessos a `/imovel`. Quando
quem acessa é um robô de prévia (WhatsApp/Facebook/etc.), ela busca os dados do
imóvel no Supabase e injeta as meta tags corretas (com a foto) no HTML, antes de
entregar. Para pessoas normais, a página é servida sem alteração (o JS continua
cuidando de tudo).

## Instalação (Cloudflare Pages)

1. No seu repositório/projeto, crie a pasta `functions/` na raiz (se ainda não
   existir) e coloque dentro o arquivo `imovel.js` deste pacote.
   O caminho final deve ser: `functions/imovel.js`
   (O Cloudflare Pages roteia esse arquivo automaticamente para `/imovel`.)

2. No painel do Cloudflare Pages do seu site:
   **Settings → Environment variables → Add variable**
   - Nome: `SUPABASE_ANON_KEY`
   - Valor: a chave `anon` do seu Supabase (a mesma pública usada no site)
   Salve e faça um novo deploy.

3. Pronto. Não precisa mexer no HTML do site.

## Como testar

- **Validador do Facebook (recomendado):**
  https://developers.facebook.com/tools/debug/
  Cole a URL de um imóvel (ex.: `https://condominiosnapraia.com.br/imovel?id=XAN-179`)
  e clique em "Depurar". Deve mostrar a foto, o título e a descrição do imóvel.
  Se você já testou antes, clique em "Scrape Again" para forçar releitura.

- **WhatsApp:** o WhatsApp guarda a prévia em cache por bastante tempo. Para ver
  a mudança, teste com um link novo (ex.: adicione `?id=XAN-179&x=1`) ou aguarde
  o cache expirar. Novos compartilhamentos já virão corretos.

## Observações

- Se o seu site NÃO estiver no Cloudflare Pages (mas sim em Workers puros ou
  outro host), me avise — a mesma lógica funciona, só muda o formato do arquivo.
- **Imóveis e condomínios**: este pacote inclui `functions/imovel.js` e
  `functions/condominio.js`. Coloque os DOIS na pasta `functions/`. Cada um
  intercepta sua rota (`/imovel` e `/condominio`) e injeta a prévia correta.
- **Crédito (cartas contempladas)**: as cartas abrem em modal na mesma página
  (`/contemplado-imoveis/`), sem URL própria — então não precisa de função. Essa
  página já tem og:image/título/descrição corretos; agora que o arquivo
  `og-home.jpg` existe, a prévia dela funciona.
- As páginas estáticas (home, imóveis, condomínios) usam `og-home.jpg`, e o
  condomínio individual usa `og-default.jpg` como fallback. Ambos os arquivos
  foram criados neste pacote (na pasta `img/`).
