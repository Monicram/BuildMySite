-- ============================================================
-- BuildMySite — Overlap-Based Availability System Migration
-- Safe to run multiple times (fully idempotent)
-- ============================================================

-- 1. Create availability_overrides table if not exists
CREATE TABLE IF NOT EXISTS availability_overrides (
  id         SERIAL PRIMARY KEY,
  date       DATE        NOT NULL,
  start_time VARCHAR(10) DEFAULT NULL,
  end_time   VARCHAR(10) DEFAULT NULL,
  reason     TEXT        DEFAULT NULL,
  created_at TIMESTAMP   DEFAULT NOW()
);

-- Unique index for whole-day overrides
CREATE UNIQUE INDEX IF NOT EXISTS uq_override_date_null
  ON availability_overrides (date)
  WHERE start_time IS NULL;

-- 2. Add preferred_end_time to discovery_bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'discovery_bookings' AND column_name = 'preferred_end_time'
  ) THEN
    ALTER TABLE discovery_bookings ADD COLUMN preferred_end_time VARCHAR(10);
    RAISE NOTICE 'Added preferred_end_time';
  END IF;
END
$$;

-- 3. Ensure updated_at column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'discovery_bookings' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE discovery_bookings ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
  END IF;
END
$$;

-- 4. Backfill preferred_end_time for existing bookings (start + 60 min)
UPDATE discovery_bookings
SET preferred_end_time = to_char(
  (preferred_time::time + interval '60 minutes')::time,
  'HH24:MI'
)
WHERE preferred_end_time IS NULL
  AND preferred_time IS NOT NULL
  AND preferred_time ~ '^\d{1,2}:\d{2}';

-- 5. Remove legacy booking_slots system
DROP TABLE IF EXISTS booking_slots CASCADE;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'discovery_bookings' AND column_name = 'slot_id'
  ) THEN
    ALTER TABLE discovery_bookings DROP COLUMN slot_id;
    RAISE NOTICE 'Removed slot_id column';
  END IF;
END
$$;

-- 6. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  company    VARCHAR(255),
  role       VARCHAR(255),
  photo_url  TEXT,
  rating     INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message    TEXT NOT NULL,
  status     VARCHAR(50) DEFAULT 'pending',
  booking_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
