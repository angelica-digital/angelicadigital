-- =====================================================================
-- Avaliações de clientes — site Angélica Digital
-- Executar UMA vez no SQL Editor do projeto Supabase PRÓPRIO do site
-- (não usar projetos de outros clientes).
--
-- Regras garantidas pelo banco (não dependem do JavaScript do site):
--   * o visitante (papel "anon") só consegue INSERIR os 5 campos do formulário;
--     o status é sempre gravado como 'pendente' por um gatilho;
--   * o visitante só consegue LER avaliações com status 'aprovada' e apenas as
--     colunas públicas; não lê pendentes/recusadas nem o identificador de origem;
--   * o visitante não pode editar nem apagar nada;
--   * limites de envio: 3 por hora por origem (IP, guardado só como hash),
--     30 por hora no total e no máximo 200 pendentes aguardando revisão;
--     comentário idêntico repetido em 24 h é recusado.
-- Aprovação: no painel do Supabase (Table Editor), mudar "status" para 'aprovada'
-- ou 'recusada'. O campo "revisado_em" é preenchido automaticamente.
-- =====================================================================

create table if not exists public.avaliacoes_site (
  id                  uuid        primary key default gen_random_uuid(),
  criado_em           timestamptz not null default now(),
  nome_publico        text        not null check (char_length(btrim(nome_publico)) between 2 and 60),
  servico             text        not null check (servico in (
                                    'Site',
                                    'Perfil da Empresa no Google',
                                    'Site e Perfil da Empresa no Google',
                                    'Plaquinha NFC')),
  nota                smallint    not null check (nota between 1 and 5),
  comentario          text        not null check (char_length(btrim(comentario)) between 10 and 600),
  autoriza_publicacao boolean     not null check (autoriza_publicacao),
  status              text        not null default 'pendente'
                                  check (status in ('pendente', 'aprovada', 'recusada')),
  revisado_em         timestamptz,
  origem_hash         text
);

comment on table  public.avaliacoes_site is 'Avaliações enviadas pelo formulário do site. Só as aprovadas são públicas.';
comment on column public.avaliacoes_site.status is 'pendente | aprovada | recusada — altere no painel para revisar.';
comment on column public.avaliacoes_site.origem_hash is 'Hash do IP de envio, usado só para limitar envios. Não é público.';

create index if not exists avaliacoes_site_status_criado on public.avaliacoes_site (status, criado_em desc);
create index if not exists avaliacoes_site_origem_criado on public.avaliacoes_site (origem_hash, criado_em desc);

-- ---------------------------------------------------------------------
-- Gatilho de inserção: força 'pendente', normaliza textos e aplica limites.
-- SECURITY DEFINER para poder contar envios sem dar ao visitante acesso de leitura.
-- ---------------------------------------------------------------------
create or replace function public.avaliacoes_site_antes_inserir()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  cabecalhos json;
  ip text;
begin
  new.status       := 'pendente';
  new.revisado_em  := null;
  new.criado_em    := now();
  new.nome_publico := btrim(new.nome_publico);
  new.comentario   := btrim(new.comentario);

  begin
    cabecalhos := nullif(current_setting('request.headers', true), '')::json;
  exception when others then
    cabecalhos := null;
  end;
  ip := btrim(coalesce(cabecalhos ->> 'cf-connecting-ip',
                       split_part(coalesce(cabecalhos ->> 'x-forwarded-for', ''), ',', 1)));

  if ip <> '' then
    new.origem_hash := md5('avaliacoes-site:' || ip);
    if (select count(*) from public.avaliacoes_site
         where origem_hash = new.origem_hash and criado_em > now() - interval '1 hour') >= 3 then
      raise exception 'limite_envios' using errcode = 'P0001',
        hint = 'Muitos envios desta origem. Tente novamente mais tarde.';
    end if;
  else
    new.origem_hash := null;
  end if;

  if (select count(*) from public.avaliacoes_site where criado_em > now() - interval '1 hour') >= 30 then
    raise exception 'limite_envios' using errcode = 'P0001', hint = 'Muitos envios no momento.';
  end if;

  if (select count(*) from public.avaliacoes_site where status = 'pendente') >= 200 then
    raise exception 'limite_pendentes' using errcode = 'P0001', hint = 'Fila de revisão cheia.';
  end if;

  if exists (select 1 from public.avaliacoes_site
              where lower(comentario) = lower(new.comentario) and criado_em > now() - interval '24 hours') then
    raise exception 'envio_repetido' using errcode = 'P0001', hint = 'Avaliação já recebida.';
  end if;

  return new;
end;
$$;

drop trigger if exists avaliacoes_site_antes_inserir on public.avaliacoes_site;
create trigger avaliacoes_site_antes_inserir
  before insert on public.avaliacoes_site
  for each row execute function public.avaliacoes_site_antes_inserir();

-- Registra a data da revisão quando o status muda (feito no painel).
create or replace function public.avaliacoes_site_ao_revisar()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.status is distinct from old.status then
    new.revisado_em := case when new.status = 'pendente' then null else now() end;
  end if;
  return new;
end;
$$;

drop trigger if exists avaliacoes_site_ao_revisar on public.avaliacoes_site;
create trigger avaliacoes_site_ao_revisar
  before update on public.avaliacoes_site
  for each row execute function public.avaliacoes_site_ao_revisar();

-- O Supabase concede EXECUTE automático a anon/authenticated em funções novas do schema public;
-- estas são só funções de gatilho, então a permissão é removida explicitamente.
revoke all on function public.avaliacoes_site_antes_inserir() from public, anon, authenticated;
revoke all on function public.avaliacoes_site_ao_revisar() from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- Permissões por coluna + Row Level Security
-- ---------------------------------------------------------------------
alter table public.avaliacoes_site enable row level security;

revoke all on table public.avaliacoes_site from anon, authenticated;
grant insert (nome_publico, servico, nota, comentario, autoriza_publicacao)
  on table public.avaliacoes_site to anon, authenticated;
-- "status" precisa de leitura para o filtro ?status=eq.aprovada funcionar; como o RLS só
-- devolve linhas aprovadas, o visitante nunca vê outro valor além de 'aprovada'.
grant select (id, criado_em, nome_publico, servico, nota, comentario, status)
  on table public.avaliacoes_site to anon, authenticated;

drop policy if exists "visitante envia avaliacao pendente" on public.avaliacoes_site;
create policy "visitante envia avaliacao pendente"
  on public.avaliacoes_site for insert
  to anon, authenticated
  with check (status = 'pendente' and revisado_em is null and autoriza_publicacao);

drop policy if exists "publico le somente aprovadas" on public.avaliacoes_site;
create policy "publico le somente aprovadas"
  on public.avaliacoes_site for select
  to anon, authenticated
  using (status = 'aprovada');

-- Sem políticas de UPDATE/DELETE: o visitante não edita nem apaga.
-- O painel do Supabase (papéis postgres/service_role) continua podendo revisar.

notify pgrst, 'reload schema';
