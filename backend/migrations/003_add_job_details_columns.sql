-- Migration: Add responsibilities, requirements, and benefits columns to jobs table
-- These columns were defined in schema.sql but may not exist in existing databases

-- Add responsibilities column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'responsibilities'
    ) THEN
        ALTER TABLE jobs ADD COLUMN responsibilities TEXT[] NOT NULL DEFAULT '{}';
    END IF;
END $$;

-- Add requirements column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'requirements'
    ) THEN
        ALTER TABLE jobs ADD COLUMN requirements TEXT[] NOT NULL DEFAULT '{}';
    END IF;
END $$;

-- Add benefits column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'benefits'
    ) THEN
        ALTER TABLE jobs ADD COLUMN benefits TEXT[] NOT NULL DEFAULT '{}';
    END IF;
END $$;

COMMENT ON COLUMN jobs.responsibilities IS 'Array of job responsibilities';
COMMENT ON COLUMN jobs.requirements IS 'Array of job requirements';
COMMENT ON COLUMN jobs.benefits IS 'Array of benefits offered';

