-- Controle de acesso do CRM: administrador, consultor, visualizador e parceiro.
-- Parceiros operam somente o próprio site e relações de imóveis; não acessam dados internos.

alter table public.usuarios drop constraint if exists usuarios_role_check;
alter table public.usuarios add constraint usuarios_role_check check (role = any (array['admin','consultor','visualizador','parceiro']));

create or replace function public.crm_is_active_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.usuarios u
    where u.id = auth.uid() and u.ativo is true
  );
$$;

create or replace function public.crm_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.usuarios u
    where u.id = auth.uid() and u.role = 'admin' and u.ativo is true
  );
$$;

create or replace function public.crm_proteger_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.crm_is_admin() then
    new.role := old.role;
    new.ativo := old.ativo;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_crm_proteger_usuario on public.usuarios;
create trigger trg_crm_proteger_usuario
before update on public.usuarios
for each row execute function public.crm_proteger_usuario();

create or replace function public.crm_proteger_site_parceiro()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.crm_is_admin() then
    if tg_op = 'INSERT' then
      new.owner_usuario_id := auth.uid();
      new.status := 'draft';
      new.plano_slug := 'inicial';
    else
      new.owner_usuario_id := old.owner_usuario_id;
      new.status := old.status;
      new.plano_slug := old.plano_slug;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_crm_proteger_site_parceiro on public.parceiros_sites;
create trigger trg_crm_proteger_site_parceiro
before insert or update on public.parceiros_sites
for each row execute function public.crm_proteger_site_parceiro();

create or replace function public.crm_proteger_assinatura_parceiro()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.crm_is_admin() then
    if tg_op = 'INSERT' then
      new.plano_slug := 'inicial';
      new.status := 'trial';
    else
      new.site_id := old.site_id;
      new.plano_slug := old.plano_slug;
      new.status := old.status;
      new.provedor := old.provedor;
      new.referencia_externa := old.referencia_externa;
      new.inicio_em := old.inicio_em;
      new.fim_em := old.fim_em;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_crm_proteger_assinatura_parceiro on public.parceiros_assinaturas;
create trigger trg_crm_proteger_assinatura_parceiro
before insert or update on public.parceiros_assinaturas
for each row execute function public.crm_proteger_assinatura_parceiro();

-- Dados comerciais internos: parceiro não possui acesso direto.
drop policy if exists escrita_logado on public.imoveis;
create policy escrita_crm_imoveis on public.imoveis
  for all to authenticated
  using (public.crm_is_active_user() and (public.crm_is_admin() or exists (select 1 from public.usuarios u where u.id=auth.uid() and u.role='consultor')))
  with check (public.crm_is_active_user() and (public.crm_is_admin() or exists (select 1 from public.usuarios u where u.id=auth.uid() and u.role='consultor')));

drop policy if exists escrita_logado on public.condominios;
create policy escrita_crm_condominios on public.condominios
  for all to authenticated
  using (public.crm_is_active_user() and (public.crm_is_admin() or exists (select 1 from public.usuarios u where u.id=auth.uid() and u.role='consultor')))
  with check (public.crm_is_active_user() and (public.crm_is_admin() or exists (select 1 from public.usuarios u where u.id=auth.uid() and u.role='consultor')));

-- Remover permissões amplas dos módulos internos.
drop policy if exists clientes_auth_all on public.clientes;
create policy clientes_crm_read on public.clientes for select to authenticated
  using (public.crm_is_active_user() and (public.crm_is_admin() or exists (select 1 from public.usuarios u where u.id=auth.uid() and u.role in ('consultor','visualizador'))));
create policy clientes_crm_write on public.clientes for all to authenticated
  using (public.crm_is_active_user() and (public.crm_is_admin() or exists (select 1 from public.usuarios u where u.id=auth.uid() and u.role='consultor')))
  with check (public.crm_is_active_user() and (public.crm_is_admin() or exists (select 1 from public.usuarios u where u.id=auth.uid() and u.role='consultor')));

drop policy if exists crm_gerencia_proprietarios on public.proprietarios;
drop policy if exists crm_proprietarios on public.proprietarios;
drop policy if exists crm_le_proprietarios on public.proprietarios;
drop policy if exists somente_logado on public.proprietarios;
create policy proprietarios_crm_read on public.proprietarios for select to authenticated
  using (public.crm_is_active_user() and (public.crm_is_admin() or exists (select 1 from public.usuarios u where u.id=auth.uid() and u.role in ('consultor','visualizador'))));
create policy proprietarios_crm_write on public.proprietarios for all to authenticated
  using (public.crm_is_active_user() and (public.crm_is_admin() or exists (select 1 from public.usuarios u where u.id=auth.uid() and u.role='consultor')))
  with check (public.crm_is_active_user() and (public.crm_is_admin() or exists (select 1 from public.usuarios u where u.id=auth.uid() and u.role='consultor')));

drop policy if exists somente_logado on public.atividades;
create policy atividades_crm on public.atividades for all to authenticated
  using (public.crm_is_active_user() and (public.crm_is_admin() or exists (select 1 from public.usuarios u where u.id=auth.uid() and u.role='consultor')))
  with check (public.crm_is_active_user() and (public.crm_is_admin() or exists (select 1 from public.usuarios u where u.id=auth.uid() and u.role='consultor')));

drop policy if exists crm_negociacoes on public.negociacoes;
drop policy if exists somente_logado on public.negociacoes;
create policy negociacoes_crm on public.negociacoes for all to authenticated
  using (public.crm_is_active_user() and (public.crm_is_admin() or exists (select 1 from public.usuarios u where u.id=auth.uid() and u.role='consultor')))
  with check (public.crm_is_active_user() and (public.crm_is_admin() or exists (select 1 from public.usuarios u where u.id=auth.uid() and u.role='consultor')));

comment on function public.crm_is_active_user() is 'Retorna true para usuários CRM ativos.';
comment on function public.crm_is_admin() is 'Retorna true somente para administradores CRM ativos.';
comment on trigger trg_crm_proteger_site_parceiro on public.parceiros_sites is 'Parceiros só criam/editam o próprio cadastro em rascunho; publicação e plano ficam com admin.';
comment on trigger trg_crm_proteger_assinatura_parceiro on public.parceiros_assinaturas is 'Parceiros não alteram plano, status ou dados de cobrança.';
