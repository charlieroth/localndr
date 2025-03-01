CREATE TABLE IF NOT EXISTS "event" (
  "id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "start_date" TIMESTAMPTZ NOT NULL,
  "end_date" TIMESTAMPTZ NOT NULL,
  "created" TIMESTAMPTZ DEFAULT NOW(),
  "modified" TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);
