# Como subir no Git — passo a passo

## 1. Arquivos do SITE (raiz do zip)
Descompacte o zip. Tudo que está FORA da pasta `_APOIO` vai pro repositório,
mantendo a estrutura de pastas (index.html na raiz, imovel/index.html na pasta
imovel/, etc). Copie por cima da pasta do repositório.

Depois: GitHub Desktop → Commit to main → Push origin → aguarde 2-3 min →
Ctrl+Shift+R no site.

## 2. Pasta _APOIO (NÃO sobe pro Git)
São arquivos de apoio, guarde no seu computador:
- `_modulo-clientes.sql` → rodar no Supabase (SQL Editor) UMA vez, para ativar
  o módulo Clientes no CRM.
- `COMO-INSTALAR-CLIENTES.md` → guia do módulo Clientes.
- `_COLETA-AVALIACOES.md` + `_secao-avaliacoes.html` + `_schema-avaliacoes.js` →
  material das avaliações (usar quando tiver avaliações reais coletadas).

## O que mudou nesta sessão
1. WhatsApp Juliano (51) 98286-8888 no site (86 páginas) e CRM.
   Felipe (51) 99944-2252 mantido em: cartas contempladas, financiamento-imobiliario,
   refinanciamento-imobiliario, financiamento-ou-consorcio.
2. Cartas contempladas: 1085 cartas de agosto com valor de entrada + logos das
   administradoras + frase "Solicite mais informações".
3. Módulo Clientes no CRM (requer rodar o SQL do _APOIO).
4. Foto de capa (hero) da página de condomínios.
5. Card de imóvel: foto proporcional (não corta mais).
6. Página do imóvel: link clicável + botão "Ver o condomínio completo".
7. Home: onda de separação corrigida entre "Casas & Sobrados" e "Encontre o seu".
8. Infraestrutura de avaliações + botão "Pedir avaliação" no CRM.

## Passo obrigatório
Antes de usar o módulo Clientes: rodar `_APOIO/_modulo-clientes.sql` no Supabase.
