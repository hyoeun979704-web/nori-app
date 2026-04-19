-- Phase 2b: developmental reference tables (INTERNAL ONLY — never rendered to user UI)
--
-- Purpose:
--   Feed Phase 4 Edge Function with public-institution data so the AI can
--   surface play activities that support the child's current developmental stage.
--
-- Data policy:
--   * Public institution sources only. Each row MUST have `source_code` and
--     `source_url` populated.
--   * Age checkpoints are fixed: 2, 4, 6, 9, 12, 15, 18, 24, 30, 36, 48, 60,
--     72, 84 months (agreed with product owner).
--   * RLS: authenticated users may SELECT to enable Edge Function RPC use,
--     but writes are restricted to the service_role.

create type dev_domain as enum (
  'gross_motor',
  'fine_motor',
  'language',
  'cognitive',
  'social_emotional'
);

create type dev_source as enum (
  'CDC',      -- U.S. Centers for Disease Control and Prevention
  'WHO',      -- World Health Organization
  'KDST'      -- 대한민국 보건복지부 한국 영유아 발달선별검사
);

create table public.dev_milestones (
  id uuid primary key default gen_random_uuid(),
  age_months smallint not null check (
    age_months in (2, 4, 6, 9, 12, 15, 18, 24, 30, 36, 48, 60, 72, 84)
  ),
  domain dev_domain not null,
  description_ko text not null,
  source_code dev_source not null,
  source_url text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index dev_milestones_age_domain_idx
  on public.dev_milestones (age_months, domain)
  where is_active = true;

create table public.dev_play_activities (
  id uuid primary key default gen_random_uuid(),
  age_months_min smallint not null check (
    age_months_min in (2, 4, 6, 9, 12, 15, 18, 24, 30, 36, 48, 60, 72, 84)
  ),
  age_months_max smallint not null check (
    age_months_max in (2, 4, 6, 9, 12, 15, 18, 24, 30, 36, 48, 60, 72, 84)
  ),
  domains dev_domain[] not null,
  interests_match text[] not null default '{}',
  title_ko text not null,
  summary_ko text not null,
  materials text[] not null default '{}',
  source_code dev_source not null,
  source_url text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (age_months_min <= age_months_max)
);

create index dev_play_activities_age_idx
  on public.dev_play_activities (age_months_min, age_months_max)
  where is_active = true;

-- RLS: read-only for authenticated clients (Edge Function uses service_role which
-- bypasses RLS; this policy exists so the same tables remain safe if queried
-- directly from the app in a future phase).
alter table public.dev_milestones enable row level security;
alter table public.dev_play_activities enable row level security;

create policy "dev_milestones_read_all_authenticated" on public.dev_milestones
  for select to authenticated using (true);

create policy "dev_play_activities_read_all_authenticated"
  on public.dev_play_activities
  for select to authenticated using (true);
-- No INSERT/UPDATE/DELETE policies: only service_role can write.
