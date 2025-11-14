-- Create table for storing AI-extracted skill metadata
-- This table stores detailed information about skills extracted from CVs

CREATE TABLE IF NOT EXISTS extracted_skills (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    proficiency VARCHAR(50), -- beginner, intermediate, advanced, expert
    category VARCHAR(100), -- programming_language, framework, library, database, etc.
    source VARCHAR(50) DEFAULT 'ai_extraction', -- how the skill was added
    extracted_at TIMESTAMP DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE, -- user can verify/confirm extracted skills
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, skill_name)
);

-- Create index for faster lookups
CREATE INDEX idx_extracted_skills_user_id ON extracted_skills(user_id);
CREATE INDEX idx_extracted_skills_category ON extracted_skills(category);

-- Create table for storing AI extraction metadata
CREATE TABLE IF NOT EXISTS ai_extractions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    extraction_type VARCHAR(50) NOT NULL, -- cv_skills, profile_analysis, etc.
    input_text TEXT,
    extracted_data JSONB, -- full JSON response from AI
    provider VARCHAR(50), -- gemini, groq
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for extraction history
CREATE INDEX idx_ai_extractions_user_id ON ai_extractions(user_id);
CREATE INDEX idx_ai_extractions_type ON ai_extractions(extraction_type);

-- Add comments for documentation
COMMENT ON TABLE extracted_skills IS 'Stores AI-extracted skills with metadata';
COMMENT ON TABLE ai_extractions IS 'Stores history of AI extraction operations';
