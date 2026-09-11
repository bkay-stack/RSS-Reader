-- Adds the column onboarding saves to (it was missing, so saves failed).
-- Empty (null) means the user hasn't finished onboarding.

alter table user_preferences
  add column if not exists onboarding_completed_at timestamptz;
