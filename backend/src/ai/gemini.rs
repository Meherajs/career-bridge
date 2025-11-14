//! Google Gemini API client for AI operations.

use crate::errors::AppError;
use reqwest::Client;
use serde::{Deserialize, Serialize};

/// Gemini API client
pub struct GeminiClient {
    api_key: String,
    client: Client,
    base_url: String,
}

#[derive(Debug, Serialize)]
struct GeminiRequest {
    contents: Vec<Content>,
    #[serde(skip_serializing_if = "Option::is_none")]
    generation_config: Option<GenerationConfig>,
}

#[derive(Debug, Serialize)]
struct Content {
    parts: Vec<Part>,
}

#[derive(Debug, Serialize)]
struct Part {
    text: String,
}

#[derive(Debug, Serialize)]
struct GenerationConfig {
    temperature: f32,
    #[serde(skip_serializing_if = "Option::is_none")]
    response_mime_type: Option<String>,
}

#[derive(Debug, Deserialize)]
struct GeminiResponse {
    candidates: Vec<Candidate>,
}

#[derive(Debug, Deserialize)]
struct Candidate {
    content: ContentResponse,
}

#[derive(Debug, Deserialize)]
struct ContentResponse {
    parts: Vec<PartResponse>,
}

#[derive(Debug, Deserialize)]
struct PartResponse {
    text: String,
}

impl GeminiClient {
    /// Create a new Gemini client
    pub fn new(api_key: String) -> Self {
        Self {
            api_key,
            client: Client::new(),
            base_url: "https://generativelanguage.googleapis.com/v1beta".to_string(),
        }
    }

    /// Generate content using Gemini
    ///
    /// # Arguments
    /// * `prompt` - The prompt to send to Gemini
    /// * `model` - The model to use (default: "gemini-2.0-flash")
    /// * `temperature` - Temperature for generation (default: 0.7)
    /// * `json_mode` - Whether to request JSON response
    pub async fn generate(
        &self,
        prompt: &str,
        model: Option<&str>,
        temperature: Option<f32>,
        json_mode: bool,
    ) -> Result<String, AppError> {
        let model = model.unwrap_or("gemini-2.0-flash");
        let temperature = temperature.unwrap_or(0.7);

        let generation_config = if json_mode {
            Some(GenerationConfig {
                temperature,
                response_mime_type: Some("application/json".to_string()),
            })
        } else {
            Some(GenerationConfig {
                temperature,
                response_mime_type: None,
            })
        };

        let request = GeminiRequest {
            contents: vec![Content {
                parts: vec![Part {
                    text: prompt.to_string(),
                }],
            }],
            generation_config,
        };

        let url = format!(
            "{}/models/{}:generateContent?key={}",
            self.base_url, model, self.api_key
        );

        let response = self
            .client
            .post(&url)
            .json(&request)
            .send()
            .await
            .map_err(|e| {
                tracing::error!("Gemini API request failed: {}", e);
                AppError::ExternalServiceError(format!("Gemini API error: {}", e))
            })?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_default();
            tracing::error!("Gemini API error {}: {}", status, error_text);
            return Err(AppError::ExternalServiceError(format!(
                "Gemini API returned {}: {}",
                status, error_text
            )));
        }

        let gemini_response: GeminiResponse = response.json().await.map_err(|e| {
            tracing::error!("Failed to parse Gemini response: {}", e);
            AppError::ExternalServiceError(format!("Failed to parse Gemini response: {}", e))
        })?;

        gemini_response
            .candidates
            .first()
            .and_then(|c| c.content.parts.first())
            .map(|p| p.text.clone())
            .ok_or_else(|| AppError::ExternalServiceError("No response from Gemini".to_string()))
    }

    /// Extract skills from CV text
    pub async fn extract_skills(&self, cv_text: &str) -> Result<String, AppError> {
        let prompt = format!(
            r#"You are an expert CV/resume analyzer. Analyze the following CV/resume text and extract structured information.

CV Text:
{}

Please extract and return a JSON object with the following structure:
{{
  "technical_skills": [
    {{"name": "Python", "proficiency": "advanced", "category": "programming_language"}},
    {{"name": "React", "proficiency": "intermediate", "category": "framework"}}
  ],
  "soft_skills": ["communication", "leadership", "problem-solving"],
  "roles": ["Software Engineer", "Full Stack Developer"],
  "domains": ["Web Development", "E-commerce"],
  "certifications": ["AWS Certified Solutions Architect"],
  "tools": ["Git", "Docker", "Jenkins"],
  "years_of_experience": 3.5,
  "education": ["B.S. Computer Science"]
}}

Guidelines:
- Extract ONLY what is explicitly mentioned or strongly implied in the CV
- For technical_skills, include programming languages, frameworks, libraries
- Categories: programming_language, framework, library, database, cloud, devops, design_tool
- Proficiency levels: beginner, intermediate, advanced, expert (infer from context)
- Be comprehensive but accurate
- Return valid JSON only, no additional text"#,
            cv_text
        );

        self.generate(&prompt, None, Some(0.3), true).await
    }

    /// Generate a learning roadmap for a tech stack
    pub async fn generate_roadmap(
        &self,
        tech_stack: &str,
        current_skills: Option<&str>,
    ) -> Result<String, AppError> {
        let current_skills_text = current_skills
            .map(|s| format!("\n\nCurrent skills: {}", s))
            .unwrap_or_default();

        let prompt = format!(
            r#"You are an expert career advisor and learning path designer. Create a comprehensive learning roadmap for: {}{}

Return a JSON object with this structure:
{{
  "stack_name": "Full Stack Development",
  "prerequisites": ["Basic programming knowledge", "HTML/CSS basics"],
  "estimated_duration": "6-8 months",
  "difficulty": "intermediate",
  "phases": [
    {{
      "phase": 1,
      "title": "Fundamentals",
      "topics": ["JavaScript basics", "ES6+ features", "DOM manipulation"],
      "duration": "4-6 weeks",
      "resources": ["MDN Web Docs", "JavaScript.info"]
    }}
  ]
}}

Guidelines:
- Create 4-6 phases with logical progression
- Each phase should have specific, actionable topics
- Include realistic time estimates
- Suggest high-quality free and paid resources
- Consider the user's current skills if provided
- Return valid JSON only"#,
            tech_stack, current_skills_text
        );

        self.generate(&prompt, None, Some(0.7), true).await
    }

    /// Answer a career-related question
    pub async fn answer_question(
        &self,
        question: &str,
        context: Option<&str>,
    ) -> Result<String, AppError> {
        let context_text = context
            .map(|c| format!("\n\nContext: {}", c))
            .unwrap_or_default();

        let prompt = format!(
            r#"You are a knowledgeable career advisor specializing in technology careers. Answer the following question:

Question: {}{}

Provide a helpful, accurate, and actionable answer. Include:
- Direct answer to the question
- Practical advice or steps
- Related topics the user might find helpful

Return a JSON object:
{{
  "question": "the question",
  "answer": "your detailed answer here",
  "related_topics": ["topic1", "topic2", "topic3"]
}}

Return valid JSON only."#,
            question, context_text
        );

        self.generate(&prompt, None, Some(0.8), true).await
    }

    /// Generate career-related content
    pub async fn generate_content(
        &self,
        content_type: &str,
        input: &str,
        parameters: Option<serde_json::Value>,
    ) -> Result<String, AppError> {
        let params_text = parameters
            .as_ref()
            .and_then(|p| serde_json::to_string_pretty(p).ok())
            .unwrap_or_default();

        let prompt = format!(
            r#"You are an expert career content writer. Generate {} based on the following:

Input:
{}

Parameters:
{}

Return a JSON object:
{{
  "content_type": "{}",
  "content": "the generated content here",
  "metadata": {{"word_count": 150, "tone": "professional"}}
}}

Guidelines:
- Make it professional and tailored
- Be specific and actionable
- Use appropriate formatting
- Return valid JSON only"#,
            content_type, input, params_text, content_type
        );

        self.generate(&prompt, None, Some(0.8), true).await
    }
}
