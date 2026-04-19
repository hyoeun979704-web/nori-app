-- Phase 6: per-user rate limiting for the recipe Edge Function.
--
-- Simple append-only log. The Edge Function inserts one row per successful
-- Gemini call (or Red Flag short-circuit) and refuses further calls if more
-- than `RATE_LIMIT_MAX` rows exist within the last `RATE_LIMIT_WINDOW_SEC`
-- seconds for the same user.
--
-- Rows older than the observation window have no value. An opportunistic
-- cleanup runs inside the Edge Function to keep the table small; a pg_cron
-- job can be added later for a hard bound.

create table if not exists public.recipe_call_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists recipe_call_log_user_time_idx
  on public.recipe_call_log (user_id, created_at desc);

alter table public.recipe_call_log enable row level security;

drop policy if exists "recipe_call_log_insert_own" on public.recipe_call_log;
create policy "recipe_call_log_insert_own" on public.recipe_call_log
  for insert with check (auth.uid() = user_id);

drop policy if exists "recipe_call_log_select_own" on public.recipe_call_log;
create policy "recipe_call_log_select_own" on public.recipe_call_log
  for select using (auth.uid() = user_id);

drop policy if exists "recipe_call_log_delete_own" on public.recipe_call_log;
create policy "recipe_call_log_delete_own" on public.recipe_call_log
  for delete using (auth.uid() = user_id);
