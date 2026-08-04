# Atualização condominiosnapraia.com.br — pacote completo

Descompacte este zip POR CIMA da pasta do repositório (ele mantém a estrutura
de pastas e substitui os arquivos nos lugares certos). Depois: GitHub Desktop
→ Commit → Push → aguarde 2-3 min → Ctrl+Shift+R.

## O que mudou nesta sessão

1. **Número WhatsApp → Juliano Machado (51) 98286-8888** em TODO o site (87 páginas + CRM),
   EXCETO 3 páginas que mantêm o Felipe (51) 99944-2252:
   - financiamento-imobiliario
   - refinanciamento-imobiliario
   - financiamento-ou-consorcio

2. **Cartas Contempladas** (contemplado-imoveis.html): 1085 cartas novas do relatório
   de agosto, com valor de entrada em cada card e no modal.

3. **Módulo Clientes no CRM** (crm.html): cadastro, importação inteligente (Excel/CSV/
   TXT/PDF/DOCX), match automático cliente↔imóvel, timeline, envio por WhatsApp/e-mail.
   ⚠️ ANTES de usar: rodar `_modulo-clientes.sql` no Supabase → SQL Editor (cria a
   tabela `clientes`, não altera nada existente). Ver COMO-INSTALAR-CLIENTES.md.

4. **Foto de capa (hero) da página de condomínios**: foto do pôr do sol na lagoa,
   estilo igual ao da home (foto de fundo + texto por cima). Arquivo novo:
   img/hero-condominios.jpg

## Ordem recomendada
1. Rodar o SQL no Supabase (passo do módulo Clientes)
2. Descompactar o zip por cima do repositório
3. Commit + Push
