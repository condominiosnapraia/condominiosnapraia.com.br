# AÇÃO NECESSÁRIA no Supabase — coluna "fora_condominio"

O CRM agora grava um campo novo: **fora_condominio** (verdadeiro/falso) na
tabela **imoveis**. Se a coluna não existir no banco, o Supabase vai RECUSAR o
salvamento de imóveis marcados como "fora de condomínio".

## Como criar a coluna (uma vez só)

1. Entre no painel do Supabase → seu projeto.
2. Menu lateral: **SQL Editor** → **New query**.
3. Cole e rode:

   ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS fora_condominio boolean DEFAULT false;

4. Pronto. Todos os imóveis existentes ficam como "false" (em condomínio), que é
   o comportamento atual. Só os que você marcar no CRM viram "true".

## Como usar no CRM

- Ao cadastrar/editar um imóvel, marque o checkbox
  **"🏠 Imóvel fora de condomínio"** na seção Endereço.
- Ao marcar: os campos Condomínio / Quadra / Lote somem e passam a ser
  obrigatórios **Bairro + Cidade**. O código é gerado pela cidade do endereço.
- Ao desmarcar: volta ao normal (exige Condomínio + Quadra + Lote).

## Na home (site)

- A seção **"Casas Fora de Condomínio"** mostra até 12 cards, automaticamente,
  com os imóveis marcados como fora de condomínio, publicados e disponíveis.
- Cada card mostra Bairro · Cidade no lugar do nome do condomínio.
