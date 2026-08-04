-- ═══════════════════════════════════════════════════════════════════
-- MÓDULO CLIENTES — nova tabela (NÃO altera nenhuma tabela existente)
-- Rodar UMA vez no Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.clientes (
  id            text primary key,
  nome          text not null,
  telefone      text,
  whatsapp      text,
  email         text,
  cidade        text,
  bairro        text,
  origem        text,                       -- Site, Indicação, WhatsApp, Portal, etc.
  corretor      text,                       -- nome/id do corretor responsável
  observacoes   text,
  -- Interesse (usado pelo match automático)
  interesse_tipo    text,                   -- Casa, Apartamento, Terreno...
  interesse_cidade  text,
  interesse_bairro  text,
  interesse_cond    text,                   -- id do condomínio (opcional)
  dorms_min         int,                    -- dormitórios mínimos desejados
  preco_min         numeric,                -- faixa de preço (mínimo)
  preco_max         numeric,                -- faixa de preço (máximo / "até R$ X")
  status        text default 'Novo',        -- Novo, Em Atendimento, Visita, Proposta, Fechado, Perdido
  historico     jsonb default '[]'::jsonb,  -- timeline (contatos, visitas, propostas, envios)
  imoveis_enviados jsonb default '[]'::jsonb,-- ids de imóveis já enviados (evita repetir)
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- índices para busca/match rápidos
create index if not exists idx_clientes_status   on public.clientes(status);
create index if not exists idx_clientes_cidade   on public.clientes(interesse_cidade);
create index if not exists idx_clientes_tipo     on public.clientes(interesse_tipo);
create index if not exists idx_clientes_created  on public.clientes(created_at desc);

-- RLS igual ao padrão das outras tabelas (authenticated pode tudo)
alter table public.clientes enable row level security;

drop policy if exists "clientes_auth_all" on public.clientes;
create policy "clientes_auth_all" on public.clientes
  for all
  to authenticated
  using (true)
  with check (true);

-- (opcional) leitura anônima desativada — clientes são dados internos.
-- Se quiser permitir anon, descomente:
-- drop policy if exists "clientes_anon_read" on public.clientes;
-- create policy "clientes_anon_read" on public.clientes for select to anon using (true);
