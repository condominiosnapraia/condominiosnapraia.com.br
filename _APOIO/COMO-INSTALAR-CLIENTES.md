# Módulo Clientes — Instalação (2 passos)

## Passo 1 — Criar a tabela no banco (uma vez só)
1. Abra o **Supabase → SQL Editor**
2. Cole o conteúdo de **`_modulo-clientes.sql`** e clique em **Run**

Isso cria **apenas** a nova tabela `clientes`. Nenhuma tabela existente é alterada.

## Passo 2 — Subir o CRM
1. Substitua o **`crm.html`** na raiz do repositório pelo novo
2. GitHub Desktop → Commit → Push
3. Aguarde 2-3 min e faça **Ctrl+Shift+R** no CRM

Pronto. O menu lateral agora tem **🧑‍💼 Clientes** (em "Cadastros").

---

## O que foi adicionado (sem tocar em nada existente)
- **Menu "Clientes"** com dashboard (Clientes, Novos hoje, Sem atendimento, Visita marcada, Propostas, Fechados)
- **Cadastro completo**: nome, telefones, WhatsApp, e-mail, cidade, bairro, origem, corretor, observações, interesse (tipo/cidade/bairro/condomínio/dormitórios), faixa de preço, status, data
- **Clientes › Importação**: cola texto ou envia **Excel / CSV / TXT / PDF / DOCX**. A IA interpreta e preenche os campos (com leitura automática de reserva caso a IA esteja indisponível). Você revisa antes de salvar.
- **Match automático**:
  - Na ficha do cliente → botão 🎯 mostra todos os imóveis compatíveis já cadastrados
  - Ao cadastrar um **imóvel novo** → o sistema avisa "*X cliente(s) compatível(is)*" e lista quem tem interesse
- **Envio**: seleciona o cliente e envia os imóveis compatíveis por **WhatsApp** (mensagem montada automaticamente) ou **e-mail**; registra o envio na timeline
- **Timeline** por cliente: contato, visita, proposta, imóveis enviados, mensagens, observações

## Observações técnicas
- Usa a **mesma** conexão Supabase, autenticação (token do usuário logado), layout, componentes e padrão de código do CRM.
- A tabela `clientes` tem RLS igual às demais (só `authenticated` acessa).
- O critério de match: tipo + cidade + (bairro/condomínio se informados) + dormitórios mínimos + faixa de preço. Ignora clientes com status *Fechado*/*Perdido* e imóveis *Vendido*/*Inativo*.
- A importação por IA usa a API disponível no ambiente; se falhar, cai na leitura local por padrões (regex) — nunca trava.
