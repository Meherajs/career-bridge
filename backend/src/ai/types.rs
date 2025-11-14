//! AI service types and common structures.

use serde::{Deserialize, Serialize};

/// AI provider to use for processing
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum AIProvider {
    /// Google Gemini API
    Gemini,
    /// Groq API
    Groq,
}

/// Type of AI action to perform
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ActionType {
    /// Extract skills from CV or profile text
    ExtractSkills,
    /// Generate a learning roadmap for a tech stack
    GenerateRoadmap,
    /// Ask a specific question about career development
    AskQuestion,
    /// Generate career-related content (e.g., cover letters, resume improvements)
    GenerateContent,
}

/// Request structure for AI actions
#[derive(Debug, Deserialize)]
pub struct AIActionRequest {
    /// Type of action to perform
    pub action: ActionType,
    /// AI provider to use (defaults to Gemini if not specified)
    #[serde(default = "default_provider")]
    pub provider: AIProvider,
    /// Input text/context for the action
    pub input: String,
    /// Optional additional parameters as JSON
    pub parameters: Option<serde_json::Value>,
}

fn default_provider() -> AIProvider {
    AIProvider::Gemini
}

/// Response structure for AI actions
#[derive(Debug, Serialize)]
pub struct AIActionResponse {
    /// Whether the action was successful
    pub success: bool,
    /// The processed result
    pub data: serde_json::Value,
    /// Provider that was used
    pub provider: AIProvider,
    /// Optional message or explanation
    pub message: Option<String>,
}

/// Extracted skills from CV analysis
#[derive(Debug, Serialize, Deserialize)]
pub struct ExtractedSkills {
    /// Technical skills (programming languages, frameworks, tools)
    pub technical_skills: Vec<SkillItem>,
    /// Soft skills (communication, leadership, etc.)
    pub soft_skills: Vec<String>,
    /// Roles or job titles identified
    pub roles: Vec<String>,
    /// Domains or industries identified
    pub domains: Vec<String>,
    /// Certifications or qualifications
    pub certifications: Vec<String>,
    /// Tools and technologies
    pub tools: Vec<String>,
    /// Years of experience if mentioned
    pub years_of_experience: Option<f32>,
    /// Education level detected
    pub education: Vec<String>,
}

/// A skill item with proficiency level
#[derive(Debug, Serialize, Deserialize)]
pub struct SkillItem {
    /// Name of the skill
    pub name: String,
    /// Proficiency level (beginner, intermediate, advanced, expert)
    pub proficiency: Option<String>,
    /// Category (e.g., "programming_language", "framework", "database")
    pub category: Option<String>,
}

/// Roadmap for learning a tech stack
#[derive(Debug, Serialize, Deserialize)]
pub struct TechStackRoadmap {
    /// Tech stack name
    pub stack_name: String,
    /// Learning phases with timeline
    pub phases: Vec<LearningPhase>,
    /// Prerequisites
    pub prerequisites: Vec<String>,
    /// Estimated total duration
    pub estimated_duration: String,
    /// Difficulty level
    pub difficulty: String,
}

/// A phase in the learning roadmap
#[derive(Debug, Serialize, Deserialize)]
pub struct LearningPhase {
    /// Phase number
    pub phase: u32,
    /// Phase title
    pub title: String,
    /// Topics to learn in this phase
    pub topics: Vec<String>,
    /// Estimated duration for this phase
    pub duration: String,
    /// Resources (optional)
    pub resources: Option<Vec<String>>,
}

/// Generic question-answer response
#[derive(Debug, Serialize, Deserialize)]
pub struct QuestionResponse {
    /// The original question
    pub question: String,
    /// The AI's answer
    pub answer: String,
    /// Related suggestions or follow-up topics
    pub related_topics: Option<Vec<String>>,
}

/// Generated content response
#[derive(Debug, Serialize, Deserialize)]
pub struct GeneratedContent {
    /// Type of content generated
    pub content_type: String,
    /// The generated content
    pub content: String,
    /// Any additional metadata
    pub metadata: Option<serde_json::Value>,
}
