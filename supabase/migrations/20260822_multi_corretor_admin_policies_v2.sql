-- Permissões corrigidas do CRM para o módulo multi-corretor.

drop policy if exists parceiros_sites_admin_manage on public.parceiros_sites;
create policy parceiros_sites_admin_manage
  on public.parceiros_sites
  for all to authenticated
  using (
    owner_usuario_id = auth.uid()
    or exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.role = 'admin' and u.ativo is true
    )
  )
  with check (
    owner_usuario_id = auth.uid()
    or exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.role = 'admin' and u.ativo is true
    )
  );

drop policy if exists parceiros_sites_imoveis_admin_manage on public.parceiros_sites_imoveis;
create policy parceiros_sites_imoveis_admin_manage
  on public.parceiros_sites_imoveis
  for all to authenticated
  using (
    site_id in (
      select s.id from public.parceiros_sites s
      where s.owner_usuario_id = auth.uid()
    )
    or exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.role = 'admin' and u.ativo is true
    )
  )
  with check (
    site_id in (
      select s.id from public.parceiros_sites s
      where s.owner_usuario_id = auth.uid()
    )
    or exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.role = 'admin' and u.ativo is true
    )
  );

drop policy if exists parceiros_leads_admin_read on public.parceiros_leads;
create policy parceiros_leads_admin_read
  on public.parceiros_leads
  for select to authenticated
  using (
    site_id in (
      select s.id from public.parceiros_sites s
      where s.owner_usuario_id = auth.uid()
    )
    or exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.role = 'admin' and u.ativo is true
    )
  );

drop policy if exists parceiros_planos_admin_manage on public.parceiros_planos;
create policy parceiros_planos_admin_manage
  on public.parceiros_planos
  for all to authenticated
  using (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.role = 'admin' and u.ativo is true
    )
  )
  with check (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.role = 'admin' and u.ativo is true
    )
  );

drop policy if exists parceiros_assinaturas_admin_manage on public.parceiros_assinaturas;
create policy parceiros_assinaturas_admin_manage
  on public.parceiros_assinaturas
  for all to authenticated
  using (
    site_id in (
      select s.id from public.parceiros_sites s
      where s.owner_usuario_id = auth.uid()
    )
    or exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.role = 'admin' and u.ativo is true
    )
  )
  with check (
    site_id in (
      select s.id from public.parceiros_sites s
      where s.owner_usuario_id = auth.uid()
    )
    or exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.role = 'admin' and u.ativo is true
    )
  );
