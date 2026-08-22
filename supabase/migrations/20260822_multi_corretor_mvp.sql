-- MVP multi-corretor do Condomínios na Praia
-- Esta migration cria somente tabelas novas. Não altera registros existentes.

create table if not exists public.parceiros_sites (
  id uuid primary key default gen_random_uuid(),
  owner_usuario_id uuid references public.usuarios(id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  nome text not null,
  creci text,
  telefone text,
  whatsapp text,
  email text,
  cidade text,
  bio text,
  logo_url text,
  capa_url text,
  brand_color text not null default '#0d5c86',
  accent_color text not null default '#d5aa57',
  status text not null default 'draft' check (status in ('draft','active','suspended')),
  plano_slug text not null default 'inicial',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.parceiros_sites_imoveis (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.parceiros_sites(id) on delete cascade,
  imovel_id text not null references public.imoveis(id) on delete cascade,
  publicado boolean not null default false,
  destaque boolean not null default false,
  ordem integer not null default 0,
  titulo_personalizado text,
  chamada_personalizada text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(site_id, imovel_id)
);

create table if not exists public.parceiros_leads (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.parceiros_sites(id) on delete cascade,
  imovel_id text references public.imoveis(id) on delete set null,
  nome text not null,
  email text,
  telefone text not null,
  mensagem text,
  origem text not null default 'landing_corretor',
  origem_url text,
  consentimento_lgpd boolean not null default false check (consentimento_lgpd = true),
  status text not null default 'novo' check (status in ('novo','contatado','qualificado','encerrado')),
  created_at timestamptz not null default now()
);

create table if not exists public.parceiros_planos (
  slug text primary key,
  nome text not null,
  descricao text,
  limite_imoveis integer not null default 25 check (limite_imoveis > 0),
  permite_dominio_proprio boolean not null default false,
  permite_feed_api boolean not null default false,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.parceiros_assinaturas (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null unique references public.parceiros_sites(id) on delete cascade,
  plano_slug text not null references public.parceiros_planos(slug),
  provedor text,
  referencia_externa text,
  status text not null default 'trial' check (status in ('trial','active','past_due','canceled','paused')),
  inicio_em timestamptz not null default now(),
  fim_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.parceiros_planos (slug, nome, descricao, limite_imoveis, permite_dominio_proprio, permite_feed_api)
values
  ('inicial', 'Inicial', 'Landing padrão, captação de leads e publicação de imóveis.', 25, false, false),
  ('profissional', 'Profissional', 'Mais imóveis, domínio próprio e personalização visual.', 100, true, false),
  ('equipe', 'Equipe', 'Operação com equipe, distribuição de leads e feed/API.', 500, true, true)
on conflict (slug) do nothing;

create index if not exists parceiros_sites_status_idx on public.parceiros_sites(status);
create index if not exists parceiros_sites_slug_idx on public.parceiros_sites(slug);
create index if not exists parceiros_sites_imoveis_site_publicado_idx on public.parceiros_sites_imoveis(site_id, publicado, destaque, ordem);
create index if not exists parceiros_sites_imoveis_imovel_idx on public.parceiros_sites_imoveis(imovel_id);
create index if not exists parceiros_leads_site_created_idx on public.parceiros_leads(site_id, created_at desc);

alter table public.parceiros_sites enable row level security;
alter table public.parceiros_sites_imoveis enable row level security;
alter table public.parceiros_leads enable row level security;
alter table public.parceiros_planos enable row level security;
alter table public.parceiros_assinaturas enable row level security;

-- Leitura pública limitada às landing pages ativas.
drop policy if exists parceiros_sites_public_read on public.parceiros_sites;
create policy parceiros_sites_public_read on public.parceiros_sites
  for select to anon, authenticated
  using (status = 'active');

drop policy if exists parceiros_sites_imoveis_public_read on public.parceiros_sites_imoveis;
create policy parceiros_sites_imoveis_public_read on public.parceiros_sites_imoveis
  for select to anon, authenticated
  using (
    publicado = true
    and exists (
      select 1 from public.parceiros_sites s
      where s.id = site_id and s.status = 'active'
    )
  );

drop policy if exists parceiros_planos_public_read on public.parceiros_planos;
create policy parceiros_planos_public_read on public.parceiros_planos
  for select to anon, authenticated
  using (ativo = true);

-- Leads públicos só podem ser criados com consentimento LGPD explícito.
drop policy if exists parceiros_leads_public_insert on public.parceiros_leads;
create policy parceiros_leads_public_insert on public.parceiros_leads
  for insert to anon, authenticated
  with check (consentimento_lgpd = true and status = 'novo');

comment on table public.parceiros_sites is 'Sites/landings multi-corretor do produto Condomínios na Praia.';
comment on table public.parceiros_sites_imoveis is 'Imóveis do catálogo central publicados em cada site de parceiro.';
comment on table public.parceiros_leads is 'Leads captados nas landings de parceiros, separados por site.';
comment on table public.parceiros_planos is 'Planos comerciais do produto multi-corretor.';
comment on table public.parceiros_assinaturas is 'Estado da assinatura de cada site, sem cobrança automática nesta etapa.';
