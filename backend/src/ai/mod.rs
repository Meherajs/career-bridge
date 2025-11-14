//! AI service abstraction layer.
//!
//! This module provides AI-powered features using Google Gemini and Groq APIs.
//! Supports multiple actions: skill extraction, roadmap generation, Q&A, and content generation.

pub mod types;
pub mod gemini;
pub mod groq;

use crate::errors::AppError;
use types::*;
use gemini::GeminiClient;
use groq::GroqClient;

/// AI service that abstracts over multiple providers
pub struct AIService {
    gemini_client: Option<GeminiClient>,
    groq_client: Option<GroqClient>,
}

impl AIService {
    /// Create a new AI service with API keys from environment
    pub fn new(gemini_api_key: Option<String>, groq_api_key: Option<String>) -> Self {
        let gemini_client = gemini_api_key.map(GeminiClient::new);
        let groq_client = groq_api_key.map(GroqClient::new);

        if gemini_client.is_none() && groq_client.is_none() {
            tracing::warn!("No AI API keys configured. AI features will not be available.");
        }

        Self {
            gemini_client,
            groq_client,
        }
    }

    /// Process an AI action request
    pub async fn process_action(&self, request: AIActionRequest) -> Result<AIActionResponse, AppError> {
        // Select the appropriate client based on provider
        let result = match request.provider {
            AIProvider::Gemini => {
                let client = self.gemini_client.as_ref().ok_or_else(|| {
                    AppError::ConfigurationError("Gemini API key not configured".to_string())
                })?;
                self.execute_action(client, &request).await
            }
            AIProvider::Groq => {
                let client = self.groq_client.as_ref().ok_or_else(|| {
                    AppError::ConfigurationError("Groq API key not configured".to_string())
                })?;
                self.execute_action(client, &request).await
            }
        };

        match result {
            Ok(data) => Ok(AIActionResponse {
                success: true,
                data,
                provider: request.provider,
                message: None,
            }),
            Err(e) => Ok(AIActionResponse {
                success: false,
                data: serde_json::json!({"error": e.to_string()}),
                provider: request.provider,
                message: Some(e.to_string()),
            }),
        }
    }

    /// Execute action using Gemini client
    async fn execute_action<T: AIClient>(
        &self,
        client: &T,
        request: &AIActionRequest,
    ) -> Result<serde_json::Value, AppError> {
        match request.action {
            ActionType::ExtractSkills => {
                let result = client.extract_skills(&request.input).await?;
                let parsed: serde_json::Value = serde_json::from_str(&result)
                    .map_err(|e| AppError::ExternalServiceError(format!("Failed to parse AI response: {}", e)))?;
                Ok(parsed)
            }
            ActionType::GenerateRoadmap => {
                let current_skills = request.parameters.as_ref()
                    .and_then(|p| p.get("current_skills"))
                    .and_then(|s| s.as_str());
                
                let timeframe_months = request.parameters.as_ref()
                    .and_then(|p| p.get("timeframe_months"))
                    .and_then(|t| t.as_u64())
                    .map(|t| t as u32);
                
                let learning_hours_per_week = request.parameters.as_ref()
                    .and_then(|p| p.get("learning_hours_per_week"))
                    .and_then(|h| h.as_u64())
                    .map(|h| h as u32);
                
                let result = client.generate_roadmap(
                    &request.input,
                    current_skills,
                    timeframe_months,
                    learning_hours_per_week
                ).await?;
                let parsed: serde_json::Value = serde_json::from_str(&result)
                    .map_err(|e| AppError::ExternalServiceError(format!("Failed to parse AI response: {}", e)))?;
                Ok(parsed)
            }
            ActionType::AskQuestion => {
                let context = request.parameters.as_ref()
                    .and_then(|p| p.get("context"))
                    .and_then(|c| c.as_str());
                
                let result = client.answer_question(&request.input, context).await?;
                let parsed: serde_json::Value = serde_json::from_str(&result)
                    .map_err(|e| AppError::ExternalServiceError(format!("Failed to parse AI response: {}", e)))?;
                Ok(parsed)
            }
            ActionType::GenerateContent => {
                let content_type = request.parameters.as_ref()
                    .and_then(|p| p.get("content_type"))
                    .and_then(|t| t.as_str())
                    .unwrap_or("generic");
                
                let result = client.generate_content(content_type, &request.input, request.parameters.clone()).await?;
                let parsed: serde_json::Value = serde_json::from_str(&result)
                    .map_err(|e| AppError::ExternalServiceError(format!("Failed to parse AI response: {}", e)))?;
                Ok(parsed)
            }
        }
    }
}

/// Trait for AI clients to implement
#[async_trait::async_trait]
trait AIClient {
    async fn extract_skills(&self, cv_text: &str) -> Result<String, AppError>;
    async fn generate_roadmap(
        &self,
        tech_stack: &str,
        current_skills: Option<&str>,
        timeframe_months: Option<u32>,
        learning_hours_per_week: Option<u32>,
    ) -> Result<String, AppError>;
    async fn answer_question(&self, question: &str, context: Option<&str>) -> Result<String, AppError>;
    async fn generate_content(&self, content_type: &str, input: &str, parameters: Option<serde_json::Value>) -> Result<String, AppError>;
}

#[async_trait::async_trait]
impl AIClient for GeminiClient {
    async fn extract_skills(&self, cv_text: &str) -> Result<String, AppError> {
        self.extract_skills(cv_text).await
    }

    async fn generate_roadmap(
        &self,
        tech_stack: &str,
        current_skills: Option<&str>,
        timeframe_months: Option<u32>,
        learning_hours_per_week: Option<u32>,
    ) -> Result<String, AppError> {
        GeminiClient::generate_roadmap(self, tech_stack, current_skills, timeframe_months, learning_hours_per_week).await
    }

    async fn answer_question(&self, question: &str, context: Option<&str>) -> Result<String, AppError> {
        self.answer_question(question, context).await
    }

    async fn generate_content(&self, content_type: &str, input: &str, parameters: Option<serde_json::Value>) -> Result<String, AppError> {
        self.generate_content(content_type, input, parameters).await
    }
}

#[async_trait::async_trait]
impl AIClient for GroqClient {
    async fn extract_skills(&self, cv_text: &str) -> Result<String, AppError> {
        self.extract_skills(cv_text).await
    }

    async fn generate_roadmap(
        &self,
        tech_stack: &str,
        current_skills: Option<&str>,
        timeframe_months: Option<u32>,
        learning_hours_per_week: Option<u32>,
    ) -> Result<String, AppError> {
        GroqClient::generate_roadmap(self, tech_stack, current_skills, timeframe_months, learning_hours_per_week).await
    }

    async fn answer_question(&self, question: &str, context: Option<&str>) -> Result<String, AppError> {
        self.answer_question(question, context).await
    }

    async fn generate_content(&self, content_type: &str, input: &str, parameters: Option<serde_json::Value>) -> Result<String, AppError> {
        self.generate_content(content_type, input, parameters).await
    }
}
