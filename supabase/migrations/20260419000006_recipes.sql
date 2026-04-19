-- Phase 5: saved recipes library.
--
-- Recipes are also embedded as jsonb in chat_messages (Phase 4) so the chat
-- UI stays simple, but the dedicated `recipes` table lets the home screen
-- query a per-user recipe history cheaply and gives Phase-N favourites/tags
-- a stable row to hang off later.

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) > 0),
  age_range text not null,
  materials text[] not null default '{}',
  steps text[] not null default '{}',
  tip text not null default '',
  safety_note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists recipes_user_created_idx
  on public.recipes (user_id, created_at desc);

alter table public.recipes enable row level security;

drop policy if exists "recipes_select_own" on public.recipes;
create policy "recipes_select_own" on public.recipes
  for select using (auth.uid() = user_id);

drop policy if exists "recipes_insert_own" on public.recipes;
create policy "recipes_insert_own" on public.recipes
  for insert with check (auth.uid() = user_id);

drop policy if exists "recipes_delete_own" on public.recipes;
create policy "recipes_delete_own" on public.recipes
  for delete using (auth.uid() = user_id);
