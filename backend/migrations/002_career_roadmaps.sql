-- Migration: Add career roadmaps table for storing AI-generated career paths
-- This supports Part 2, Point 4: AI-Generated Career Roadmap with persistence

CREATE TABLE career_roadmaps (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    target_role VARCHAR(255) NOT NULL,
    duration_weeks INTEGER,
    roadmap_data JSONB NOT NULL, -- Stores the full roadmap with phases, topics, resources
    ai_provider VARCHAR(50) NOT NULL, -- 'gemini' or 'groq'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster user lookups
CREATE INDEX idx_roadmaps_user_id ON career_roadmaps(user_id);
CREATE INDEX idx_roadmaps_created_at ON career_roadmaps(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_roadmap_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_roadmap_timestamp
    BEFORE UPDATE ON career_roadmaps
    FOR EACH ROW
    EXECUTE FUNCTION update_roadmap_timestamp();

COMMENT ON TABLE career_roadmaps IS 'Stores AI-generated career roadmaps for users (SDG 8 Hackathon - Part 2, Point 4)';
COMMENT ON COLUMN career_roadmaps.roadmap_data IS 'JSON structure containing phases, topics, resources, and learning path';
