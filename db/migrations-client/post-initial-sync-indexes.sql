CREATE INDEX IF NOT EXISTS "event_modified_idx" ON "event" ("modified");
CREATE INDEX IF NOT EXISTS "event_created_idx" ON "event" ("created");
CREATE INDEX IF NOT EXISTS "event_deleted_idx" ON "event" ("deleted");
CREATE INDEX IF NOT EXISTS "event_synced_idx" ON "event" ("synced");