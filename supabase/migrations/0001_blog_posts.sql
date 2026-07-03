-- Blog posts published by the ClinicTech app's Blog agent (and any future CMS).
-- The marketing site reads this table via lib/blog-store.ts; the 10 original
-- hardcoded posts in lib/blog-data.ts remain as a seed/fallback.
--
-- Apply in the LANDING Supabase project (the one that already holds `clinics`,
-- `leads`, `preview_views`) — NOT the app's project. Run in the SQL editor or
-- via the Supabase CLI.

create table if not exists public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text not null,
  content      text not null,                       -- rendered HTML
  author       text not null default 'ClinicTech Team',
  category     text not null default 'Insights',
  read_time    text not null default '5 min read',
  image        text,
  published    boolean not null default true,
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

-- The blog list query filters on published and orders by published_at.
create index if not exists blog_posts_published_idx
  on public.blog_posts (published, published_at desc);

-- Reads and writes happen exclusively through the service role (server-side:
-- lib/blog-store.ts and /api/blog/publish), so enable RLS with no public
-- policies. The service role bypasses RLS; the anon key gets nothing.
alter table public.blog_posts enable row level security;
