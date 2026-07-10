-- Redline webhook debugger schema.
-- Run this once in your Supabase project's SQL editor (Project > SQL Editor > New query).

create extension if not exists pgcrypto;

create table if not exists webhook_bins (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_at timestamptz not null default now(),
  last_active_at timestamptz
);

create table if not exists webhook_requests (
  id uuid primary key default gen_random_uuid(),
  bin_id uuid not null references webhook_bins (id) on delete cascade,
  method text not null,
  path text not null,
  query jsonb not null default '{}'::jsonb,
  headers jsonb not null default '{}'::jsonb,
  body text,
  content_type text,
  ip text,
  received_at timestamptz not null default now()
);

create index if not exists webhook_requests_bin_id_received_at_idx
  on webhook_requests (bin_id, received_at desc);

-- RLS is enabled with no policies defined, so the anon key has zero access.
-- All reads/writes happen through server/db/admin.ts (the service-role
-- client), which bypasses RLS entirely. This keeps webhook contents
-- unreachable from the browser even if a key were ever leaked client-side.
alter table webhook_bins enable row level security;
alter table webhook_requests enable row level security;
