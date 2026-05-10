-- =========================================================
-- 1. ENUMS
-- =========================================================
do $$ begin
  create type public.workspace_role as enum ('owner', 'editor', 'viewer');
exception when duplicate_object then null; end $$;

-- =========================================================
-- 2. CORE TABLES
-- =========================================================
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null,
  plan text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null,
  role public.workspace_role not null default 'editor',
  invited_by uuid,
  joined_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create index if not exists idx_workspace_members_user on public.workspace_members(user_id);
create index if not exists idx_workspace_members_workspace on public.workspace_members(workspace_id);

create table if not exists public.workspace_invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null,
  role public.workspace_role not null default 'editor',
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  invited_by uuid not null,
  expires_at timestamptz not null default (now() + interval '14 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_workspace_invites_token on public.workspace_invites(token);
create index if not exists idx_workspace_invites_email on public.workspace_invites(lower(email));

-- =========================================================
-- 3. SECURITY DEFINER HELPERS (avoid recursive RLS)
-- =========================================================
create or replace function public.is_workspace_member(_workspace_id uuid, _user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = _workspace_id and user_id = _user_id
  );
$$;

create or replace function public.has_workspace_role(_workspace_id uuid, _user_id uuid, _roles public.workspace_role[])
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = _workspace_id
      and user_id = _user_id
      and role = any(_roles)
  );
$$;

-- =========================================================
-- 4. ADD workspace_id COLUMNS (nullable initially for backfill)
-- =========================================================
alter table public.workflow_runs       add column if not exists workspace_id uuid;
alter table public.workflow_items      add column if not exists workspace_id uuid;
alter table public.user_custom_agents  add column if not exists workspace_id uuid;
alter table public.nora_chat_sessions  add column if not exists workspace_id uuid;

-- =========================================================
-- 5. BACKFILL: personal workspace per existing user
-- =========================================================
do $$
declare
  u record;
  ws_id uuid;
begin
  for u in
    select distinct user_id from (
      select user_id from public.workflow_runs
      union select user_id from public.workflow_items
      union select user_id from public.user_custom_agents
      union select user_id from public.nora_chat_sessions
      union select user_id from public.profiles
    ) s where user_id is not null
  loop
    -- skip if already has a workspace
    select w.id into ws_id
    from public.workspaces w
    where w.owner_id = u.user_id
    limit 1;

    if ws_id is null then
      insert into public.workspaces (name, owner_id)
      values ('Personal workspace', u.user_id)
      returning id into ws_id;

      insert into public.workspace_members (workspace_id, user_id, role)
      values (ws_id, u.user_id, 'owner')
      on conflict do nothing;
    end if;

    update public.workflow_runs       set workspace_id = ws_id where user_id = u.user_id and workspace_id is null;
    update public.workflow_items      set workspace_id = ws_id where user_id = u.user_id and workspace_id is null;
    update public.user_custom_agents  set workspace_id = ws_id where user_id = u.user_id and workspace_id is null;
    update public.nora_chat_sessions  set workspace_id = ws_id where user_id = u.user_id and workspace_id is null;
  end loop;
end $$;

-- =========================================================
-- 6. ENFORCE NOT NULL + indexes + FKs
-- =========================================================
alter table public.workflow_runs       alter column workspace_id set not null;
alter table public.workflow_items      alter column workspace_id set not null;
alter table public.user_custom_agents  alter column workspace_id set not null;
alter table public.nora_chat_sessions  alter column workspace_id set not null;

alter table public.workflow_runs       add constraint workflow_runs_workspace_fk      foreign key (workspace_id) references public.workspaces(id) on delete cascade;
alter table public.workflow_items      add constraint workflow_items_workspace_fk     foreign key (workspace_id) references public.workspaces(id) on delete cascade;
alter table public.user_custom_agents  add constraint user_custom_agents_workspace_fk foreign key (workspace_id) references public.workspaces(id) on delete cascade;
alter table public.nora_chat_sessions  add constraint nora_chat_sessions_workspace_fk foreign key (workspace_id) references public.workspaces(id) on delete cascade;

create index if not exists idx_workflow_runs_workspace      on public.workflow_runs(workspace_id);
create index if not exists idx_workflow_items_workspace     on public.workflow_items(workspace_id);
create index if not exists idx_user_custom_agents_workspace on public.user_custom_agents(workspace_id);
create index if not exists idx_nora_chat_sessions_workspace on public.nora_chat_sessions(workspace_id);

-- =========================================================
-- 7. ENABLE RLS
-- =========================================================
alter table public.workspaces        enable row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_invites enable row level security;

-- workspaces policies
create policy "Members can view their workspaces"
on public.workspaces for select to authenticated
using (public.is_workspace_member(id, auth.uid()));

create policy "Authenticated users can create workspaces"
on public.workspaces for insert to authenticated
with check (auth.uid() = owner_id);

create policy "Owners can update workspaces"
on public.workspaces for update to authenticated
using (public.has_workspace_role(id, auth.uid(), array['owner']::public.workspace_role[]))
with check (public.has_workspace_role(id, auth.uid(), array['owner']::public.workspace_role[]));

create policy "Owners can delete workspaces"
on public.workspaces for delete to authenticated
using (public.has_workspace_role(id, auth.uid(), array['owner']::public.workspace_role[]));

-- workspace_members policies
create policy "Members can view co-members"
on public.workspace_members for select to authenticated
using (public.is_workspace_member(workspace_id, auth.uid()));

create policy "Owners can add members"
on public.workspace_members for insert to authenticated
with check (
  public.has_workspace_role(workspace_id, auth.uid(), array['owner']::public.workspace_role[])
  or (user_id = auth.uid() and exists (
    select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid()
  ))
);

create policy "Owners can update members"
on public.workspace_members for update to authenticated
using (public.has_workspace_role(workspace_id, auth.uid(), array['owner']::public.workspace_role[]))
with check (public.has_workspace_role(workspace_id, auth.uid(), array['owner']::public.workspace_role[]));

create policy "Owners can remove members or self leave"
on public.workspace_members for delete to authenticated
using (
  public.has_workspace_role(workspace_id, auth.uid(), array['owner']::public.workspace_role[])
  or user_id = auth.uid()
);

-- workspace_invites policies
create policy "Owners can view invites"
on public.workspace_invites for select to authenticated
using (
  public.has_workspace_role(workspace_id, auth.uid(), array['owner']::public.workspace_role[])
  or token is not null  -- token lookup allowed (token itself is the secret)
);

create policy "Owners can create invites"
on public.workspace_invites for insert to authenticated
with check (
  public.has_workspace_role(workspace_id, auth.uid(), array['owner']::public.workspace_role[])
  and invited_by = auth.uid()
);

create policy "Owners can update invites"
on public.workspace_invites for update to authenticated
using (public.has_workspace_role(workspace_id, auth.uid(), array['owner']::public.workspace_role[]))
with check (public.has_workspace_role(workspace_id, auth.uid(), array['owner']::public.workspace_role[]));

create policy "Owners can delete invites"
on public.workspace_invites for delete to authenticated
using (public.has_workspace_role(workspace_id, auth.uid(), array['owner']::public.workspace_role[]));

-- =========================================================
-- 8. REPLACE RLS ON DATA TABLES TO USE WORKSPACE MEMBERSHIP
-- =========================================================

-- workflow_runs
drop policy if exists "Users can read own runs"   on public.workflow_runs;
drop policy if exists "Users can insert own runs" on public.workflow_runs;
drop policy if exists "Users can update own runs" on public.workflow_runs;
drop policy if exists "Users can delete own runs" on public.workflow_runs;

create policy "Workspace members can read runs"
on public.workflow_runs for select to authenticated
using (public.is_workspace_member(workspace_id, auth.uid()));

create policy "Editors and owners can insert runs"
on public.workflow_runs for insert to authenticated
with check (
  user_id = auth.uid()
  and public.has_workspace_role(workspace_id, auth.uid(), array['owner','editor']::public.workspace_role[])
);

create policy "Editors and owners can update runs"
on public.workflow_runs for update to authenticated
using (public.has_workspace_role(workspace_id, auth.uid(), array['owner','editor']::public.workspace_role[]))
with check (public.has_workspace_role(workspace_id, auth.uid(), array['owner','editor']::public.workspace_role[]));

create policy "Owners can delete runs"
on public.workflow_runs for delete to authenticated
using (public.has_workspace_role(workspace_id, auth.uid(), array['owner']::public.workspace_role[]));

-- workflow_items
drop policy if exists "Users can read own items"   on public.workflow_items;
drop policy if exists "Users can insert own items" on public.workflow_items;
drop policy if exists "Users can update own items" on public.workflow_items;
drop policy if exists "Users can delete own items" on public.workflow_items;

create policy "Workspace members can read items"
on public.workflow_items for select to authenticated
using (public.is_workspace_member(workspace_id, auth.uid()));

create policy "Editors and owners can insert items"
on public.workflow_items for insert to authenticated
with check (
  user_id = auth.uid()
  and public.has_workspace_role(workspace_id, auth.uid(), array['owner','editor']::public.workspace_role[])
);

create policy "Editors and owners can update items"
on public.workflow_items for update to authenticated
using (public.has_workspace_role(workspace_id, auth.uid(), array['owner','editor']::public.workspace_role[]))
with check (public.has_workspace_role(workspace_id, auth.uid(), array['owner','editor']::public.workspace_role[]));

create policy "Owners can delete items"
on public.workflow_items for delete to authenticated
using (public.has_workspace_role(workspace_id, auth.uid(), array['owner']::public.workspace_role[]));

-- user_custom_agents
drop policy if exists "Users can read own agents"   on public.user_custom_agents;
drop policy if exists "Users can insert own agents" on public.user_custom_agents;
drop policy if exists "Users can update own agents" on public.user_custom_agents;
drop policy if exists "Users can delete own agents" on public.user_custom_agents;

create policy "Workspace members can read agents"
on public.user_custom_agents for select to authenticated
using (public.is_workspace_member(workspace_id, auth.uid()));

create policy "Editors and owners can insert agents"
on public.user_custom_agents for insert to authenticated
with check (
  user_id = auth.uid()
  and public.has_workspace_role(workspace_id, auth.uid(), array['owner','editor']::public.workspace_role[])
);

create policy "Editors and owners can update agents"
on public.user_custom_agents for update to authenticated
using (public.has_workspace_role(workspace_id, auth.uid(), array['owner','editor']::public.workspace_role[]))
with check (public.has_workspace_role(workspace_id, auth.uid(), array['owner','editor']::public.workspace_role[]));

create policy "Owners can delete agents"
on public.user_custom_agents for delete to authenticated
using (public.has_workspace_role(workspace_id, auth.uid(), array['owner']::public.workspace_role[]));

-- nora_chat_sessions (chats stay personal-by-default but live inside a workspace)
drop policy if exists "Users can read own sessions"   on public.nora_chat_sessions;
drop policy if exists "Users can insert own sessions" on public.nora_chat_sessions;
drop policy if exists "Users can update own sessions" on public.nora_chat_sessions;
drop policy if exists "Users can delete own sessions" on public.nora_chat_sessions;

create policy "Users can read own sessions in their workspaces"
on public.nora_chat_sessions for select to authenticated
using (auth.uid() = user_id and public.is_workspace_member(workspace_id, auth.uid()));

create policy "Users can insert own sessions in their workspaces"
on public.nora_chat_sessions for insert to authenticated
with check (auth.uid() = user_id and public.is_workspace_member(workspace_id, auth.uid()));

create policy "Users can update own sessions"
on public.nora_chat_sessions for update to authenticated
using (auth.uid() = user_id);

create policy "Users can delete own sessions"
on public.nora_chat_sessions for delete to authenticated
using (auth.uid() = user_id);

-- =========================================================
-- 9. AUTO-CREATE PERSONAL WORKSPACE ON SIGNUP
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ws_id uuid;
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));

  insert into public.workspaces (name, owner_id)
  values ('Personal workspace', new.id)
  returning id into ws_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (ws_id, new.id, 'owner');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- 10. updated_at trigger for workspaces
-- =========================================================
drop trigger if exists set_workspaces_updated_at on public.workspaces;
create trigger set_workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.set_updated_at();