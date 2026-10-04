-- Run once by hand in the Neon SQL editor as the database owner.
-- Not part of npm run db:reset, which creates tables and needs the owner.
-- Replace the password below with a real one and keep it out of the repository.

-- 1. Create the login role
CREATE ROLE places_app WITH LOGIN PASSWORD 'use-a-long-random-password';

-- 2. Let it reach the schema
GRANT USAGE ON SCHEMA public TO places_app;

-- 3. Row-level access to the one table
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.places TO places_app;

-- 4. SERIAL's hidden sequence (needed for INSERT)
GRANT USAGE, SELECT ON SEQUENCE public.places_id_seq TO places_app;