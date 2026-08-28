# Atualização condominiosnapraia.com.br — pacote completo

Descompacte este zip POR CIMA da pasta do repositório (mantém a estrutura de
pastas e substitui os arquivos certos). Depois: GitHub Desktop → Commit → Push
→ aguarde 2-3 min → Ctrl+Shift+R.

## O que mudou nesta sessão

1. **WhatsApp → Juliano Machado (51) 9769-8450** na maior parte do site (86 páginas + CRM).
   MANTÊM o Felipe (51) 99944-2252:
   - CARTAS CONTEMPLADAS (contemplado-imoveis.html)
   - financiamento-imobiliario
   - refinanciamento-imobiliario
   - financiamento-ou-consorcio

2. **Cartas Contempladas**: 1085 cartas novas do relatório de agosto, com valor de
   entrada em cada card e no modal. (WhatsApp: Felipe.)

3. **Módulo Clientes no CRM** (crm.html): cadastro, importação inteligente
   (Excel/CSV/TXT/PDF/DOCX), match automático cliente↔imóvel, timeline, envio WhatsApp/e-mail.
   ⚠️ ANTES de usar: rodar `_modulo-clientes.sql` no Supabase → SQL Editor.
   Ver COMO-INSTALAR-CLIENTES.md.

4. **Foto de capa (hero) da página de condomínios**: pôr do sol na lagoa, estilo da home.
   Arquivo novo: img/hero-condominios.jpg

## Ordem recomendada
1. Rodar o SQL no Supabase (módulo Clientes)
2. Descompactar o zip por cima do repositório
3. Commit + Push
