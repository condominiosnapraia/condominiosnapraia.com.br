-- Publicação automática: todo imóvel publicado fica disponível em todos os parceiros ativos.
-- Novos parceiros ativos também recebem a carteira publicada existente.

create or replace function public.parceiros_imovel_elegivel(p_publicar boolean, p_status text)
returns boolean
language sql
immutable
as $$
  select coalesce(p_publicar, false)
    and lower(trim(coalesce(p_status, ''))) <> 'vendido';
$$;

create or replace function public.sincronizar_imovel_parceiros()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.parceiros_imovel_elegivel(new.publicar, new.status) then
    insert into public.parceiros_sites_imoveis (site_id, imovel_id, publicado, destaque, ordem)
    select s.id, new.id, true, false, 0
      from public.parceiros_sites s
     where s.status = 'active'
    on conflict (site_id, imovel_id)
    do update set publicado = true, updated_at = now();
  else
    update public.parceiros_sites_imoveis
       set publicado = false, updated_at = now()
     where imovel_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_sincronizar_imovel_parceiros on public.imoveis;
create trigger trg_sincronizar_imovel_parceiros
after insert or update of publicar, status on public.imoveis
for each row execute function public.sincronizar_imovel_parceiros();

create or replace function public.sincronizar_parceiro_imoveis()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'active' and (tg_op = 'INSERT' or old.status is distinct from new.status) then
    insert into public.parceiros_sites_imoveis (site_id, imovel_id, publicado, destaque, ordem)
    select new.id, i.id, true, false, 0
      from public.imoveis i
     where public.parceiros_imovel_elegivel(i.publicar, i.status)
    on conflict (site_id, imovel_id)
    do update set publicado = true, updated_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_sincronizar_parceiro_imoveis on public.parceiros_sites;
create trigger trg_sincronizar_parceiro_imoveis
after insert or update of status on public.parceiros_sites
for each row execute function public.sincronizar_parceiro_imoveis();

-- Backfill imediato dos imóveis já publicados para todos os parceiros ativos.
insert into public.parceiros_sites_imoveis (site_id, imovel_id, publicado, destaque, ordem)
select s.id, i.id, true, false, 0
  from public.parceiros_sites s
 cross join public.imoveis i
 where s.status = 'active'
   and public.parceiros_imovel_elegivel(i.publicar, i.status)
on conflict (site_id, imovel_id)
do update set publicado = true, updated_at = now();

comment on function public.sincronizar_imovel_parceiros() is 'Publica automaticamente imóveis elegíveis em todos os parceiros ativos.';
comment on function public.sincronizar_parceiro_imoveis() is 'Entrega a carteira publicada existente a novos parceiros ativos.';
