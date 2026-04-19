-- Phase 4: chat message history
--
-- One linear stream per user (no session grouping in MVP). Chat screen loads
-- the most recent ~50 messages in ascending order. Recipes are stored as
-- jsonb so Phase 5's "최근 레시피" home widget can query them directly.

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'nori')),
  kind text not null check (kind in ('text', 'recipe')),
  text text,
  recipe jsonb,
  created_at timestamptz not null default now(),
  constraint chat_messages_payload_present check (
    (kind = 'text' and text is not null and char_length(text) > 0)
    or (kind = 'recipe' and recipe is not null)
  )
);

create index if not exists chat_messages_user_created_idx
  on public.chat_messages (user_id, created_at desc);

alter table public.chat_messages enable row level security;

drop policy if exists "chat_messages_select_own" on public.chat_messages;
create policy "chat_messages_select_own" on public.chat_messages
  for select using (auth.uid() = user_id);

drop policy if exists "chat_messages_insert_own" on public.chat_messages;
create policy "chat_messages_insert_own" on public.chat_messages
  for insert with check (auth.uid() = user_id);

drop policy if exists "chat_messages_delete_own" on public.chat_messages;
create policy "chat_messages_delete_own" on public.chat_messages
  for delete using (auth.uid() = user_id);

-- Updates are intentionally not allowed: chat history is append-only.
