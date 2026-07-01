-- Phase 2: 자녀 프로필 (children)
-- 평균 비교를 위한 어떤 또래 통계도 저장하지 않는다. 오직 내 아이의 현재 정보만 보관한다.

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 20),
  birth_date date not null,
  interests text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists children_user_id_idx on public.children (user_id);

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists children_set_updated_at on public.children;
create trigger children_set_updated_at
  before update on public.children
  for each row
  execute function public.set_updated_at();

-- Row Level Security: 본인 자녀만 접근 가능
alter table public.children enable row level security;

drop policy if exists "children_select_own" on public.children;
create policy "children_select_own"
  on public.children for select
  using (auth.uid() = user_id);

drop policy if exists "children_insert_own" on public.children;
create policy "children_insert_own"
  on public.children for insert
  with check (auth.uid() = user_id);

drop policy if exists "children_update_own" on public.children;
create policy "children_update_own"
  on public.children for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "children_delete_own" on public.children;
create policy "children_delete_own"
  on public.children for delete
  using (auth.uid() = user_id);
