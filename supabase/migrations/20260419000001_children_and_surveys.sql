-- Phase 2a: children + child_surveys
-- MVP: single child per user (UNIQUE user_id)
-- child_surveys is private metadata for AI prompting only; never rendered to user UI.

create extension if not exists pgcrypto;

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 20),
  birth_date date not null check (birth_date <= current_date),
  interests text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.child_surveys (
  child_id uuid primary key references public.children(id) on delete cascade,
  allergies text[] not null default '{}',
  sensitivities text[] not null default '{}',
  notes text not null default '',
  updated_at timestamptz not null default now()
);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists child_surveys_set_updated_at on public.child_surveys;
create trigger child_surveys_set_updated_at
  before update on public.child_surveys
  for each row execute function public.set_updated_at();

-- RLS
alter table public.children enable row level security;
alter table public.child_surveys enable row level security;

-- children: user can access only own row
drop policy if exists "children_select_own" on public.children;
create policy "children_select_own" on public.children
  for select using (auth.uid() = user_id);

drop policy if exists "children_insert_own" on public.children;
create policy "children_insert_own" on public.children
  for insert with check (auth.uid() = user_id);

drop policy if exists "children_update_own" on public.children;
create policy "children_update_own" on public.children
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "children_delete_own" on public.children;
create policy "children_delete_own" on public.children
  for delete using (auth.uid() = user_id);

-- child_surveys: access gated through ownership of the referenced child
drop policy if exists "child_surveys_select_own" on public.child_surveys;
create policy "child_surveys_select_own" on public.child_surveys
  for select using (
    exists (
      select 1 from public.children c
      where c.id = child_surveys.child_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "child_surveys_insert_own" on public.child_surveys;
create policy "child_surveys_insert_own" on public.child_surveys
  for insert with check (
    exists (
      select 1 from public.children c
      where c.id = child_surveys.child_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "child_surveys_update_own" on public.child_surveys;
create policy "child_surveys_update_own" on public.child_surveys
  for update using (
    exists (
      select 1 from public.children c
      where c.id = child_surveys.child_id and c.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.children c
      where c.id = child_surveys.child_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "child_surveys_delete_own" on public.child_surveys;
create policy "child_surveys_delete_own" on public.child_surveys
  for delete using (
    exists (
      select 1 from public.children c
      where c.id = child_surveys.child_id and c.user_id = auth.uid()
    )
  );
