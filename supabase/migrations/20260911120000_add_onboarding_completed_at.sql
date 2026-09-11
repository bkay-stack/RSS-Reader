-- lib/onboarding/applySelection.ts writes user_preferences.onboarding_completed_at
-- when a user finishes onboarding, but the column was never created, so every
-- write failed with Postgres error 42703 (undefined column) and was ignored.
--
-- Nullable on purpose: null means "has not finished onboarding yet".

alter table user_preferences
  add column if not exists onboarding_completed_at timestamptz;
