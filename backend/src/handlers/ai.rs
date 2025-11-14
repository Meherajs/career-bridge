//! AI-powered action handlers.
//!
//! Provides endpoints for AI-powered features like skill extraction,
//! roadmap generation, and more.

use axum::{Json, extract::State};
use serde_json::json;

use crate::{
    AppState,
    ai::types::{AIActionRequest, AIActionResponse},
    auth::AuthUser,
    errors::AppError,
};

/// Process an AI action
///
/// # Endpoint
/// `POST /api/ai/action`
///
/// # Request Body
/// ```json
/// {
///   "action": "extract_skills",
///   "provider": "gemini",
///   "input": "CV text here...",
///   "parameters": {
///     "optional": "parameters"
///   }
/// }
/// ```
///
/// # Actions
/// - `extract_skills`: Extract skills from CV/profile text
/// - `generate_roadmap`: Generate learning roadmap for tech stack
/// - `ask_question`: Ask career-related questions
/// - `generate_content`: Generate career content (cover letters, etc.)
///
/// # Providers
/// - `gemini`: Google Gemini API (default)
/// - `groq`: Groq API
pub async fn process_ai_action(
    _auth_user: AuthUser,
    State(state): State<AppState>,
    Json(request): Json<AIActionRequest>,
) -> Result<Json<AIActionResponse>, AppError> {
    tracing::info!(
        "Processing AI action: {:?} with provider: {:?}",
        request.action,
        request.provider
    );

    let ai_service = state
        .ai_service
        .as_ref()
        .ok_or_else(|| AppError::ConfigurationError("AI service not configured".to_string()))?;

    let response = ai_service.process_action(request).await?;

    Ok(Json(response))
}

/// Extract skills from CV and update user profile
///
/// # Endpoint
/// `POST /api/ai/extract-skills`
///
/// # Request Body
/// ```json
/// {
///   "cv_text": "Your CV content here...",
///   "provider": "gemini",
///   "update_profile": true
/// }
/// ```
pub async fn extract_and_save_skills(
    auth_user: AuthUser,
    State(state): State<AppState>,
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, AppError> {
    let cv_text = payload
        .get("cv_text")
        .and_then(|v| v.as_str())
        .ok_or_else(|| AppError::ValidationError("cv_text is required".to_string()))?;

    let provider_str = payload
        .get("provider")
        .and_then(|v| v.as_str())
        .unwrap_or("gemini");

    let update_profile = payload
        .get("update_profile")
        .and_then(|v| v.as_bool())
        .unwrap_or(false);

    // Create AI action request
    let ai_request = AIActionRequest {
        action: crate::ai::types::ActionType::ExtractSkills,
        provider: if provider_str == "groq" {
            crate::ai::types::AIProvider::Groq
        } else {
            crate::ai::types::AIProvider::Gemini
        },
        input: cv_text.to_string(),
        parameters: None,
    };

    let ai_service = state
        .ai_service
        .as_ref()
        .ok_or_else(|| AppError::ConfigurationError("AI service not configured".to_string()))?;

    tracing::info!("Calling AI service to extract skills, update_profile={}", update_profile);
    let response = ai_service.process_action(ai_request).await?;

    tracing::info!("AI response received, success={}", response.success);
    
    if !response.success {
        tracing::error!("AI extraction failed: {:?}", response.message);
        return Err(AppError::ExternalServiceError(
            response
                .message
                .unwrap_or_else(|| "AI extraction failed".to_string()),
        ));
    }

    // Extract the skills from the response
    let extracted_data = &response.data;
    tracing::info!("Full AI response data: {}", serde_json::to_string_pretty(extracted_data).unwrap_or_default());

    // If update_profile is true, update the user's profile
    if update_profile {
        tracing::info!("Starting profile update with extracted data");
        
        // Extract technical skills - handle both object format and string array format
        let technical_skills: Vec<String> = extracted_data
            .get("technical_skills")
            .and_then(|v| v.as_array())
            .map(|arr| {
                arr.iter()
                    .filter_map(|skill| {
                        // Try to get as object with "name" field
                        if let Some(name) = skill.get("name").and_then(|n| n.as_str()) {
                            Some(name.to_string())
                        }
                        // Fallback: try as plain string
                        else if let Some(name) = skill.as_str() {
                            Some(name.to_string())
                        } else {
                            None
                        }
                    })
                    .collect()
            })
            .unwrap_or_default();

        tracing::info!("Extracted {} technical skills: {:?}", technical_skills.len(), technical_skills);

        // Extract roles
        let roles: Vec<String> = extracted_data
            .get("roles")
            .and_then(|v| v.as_array())
            .map(|arr| {
                arr.iter()
                    .filter_map(|r| r.as_str())
                    .map(String::from)
                    .collect()
            })
            .unwrap_or_default();

        tracing::info!("Extracted {} roles: {:?}", roles.len(), roles);

        // Combine existing skills with new ones (avoid duplicates)
        let user_id = auth_user.user_id;
        let existing_user =
            sqlx::query_as::<_, crate::models::User>("SELECT * FROM users WHERE id = $1")
                .bind(&user_id)
                .fetch_one(&state.db_pool)
                .await?;

        tracing::info!("Existing user skills before update: {:?}", existing_user.skills);
        tracing::info!("Existing user roles before update: {:?}", existing_user.target_roles);

        let mut combined_skills = existing_user.skills.clone();
        for skill in technical_skills {
            if !combined_skills.contains(&skill) {
                combined_skills.push(skill);
            }
        }

        let mut combined_roles = existing_user.target_roles.clone();
        for role in roles {
            if !combined_roles.contains(&role) {
                combined_roles.push(role);
            }
        }

        tracing::info!("Combined skills to save: {:?} (total: {})", combined_skills, combined_skills.len());
        tracing::info!("Combined roles to save: {:?} (total: {})", combined_roles, combined_roles.len());

        // Update user profile with extracted skills and roles
        let result = sqlx::query(
            "UPDATE users 
             SET skills = $1, 
                 target_roles = $2, 
                 raw_cv_text = $3,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4",
        )
        .bind(&combined_skills)
        .bind(&combined_roles)
        .bind(cv_text)
        .bind(&user_id)
        .execute(&state.db_pool)
        .await?;

        tracing::info!(
            "Updated user profile with extracted skills for user: {}. Rows affected: {}",
            user_id,
            result.rows_affected()
        );
    }

    Ok(Json(json!({
        "success": true,
        "extracted_data": extracted_data,
        "profile_updated": update_profile,
        "message": "Skills extracted successfully"
    })))
}

/// Generate a personalized learning roadmap
///
/// # Endpoint
/// `POST /api/ai/roadmap`
///
/// # Request Body
/// ```json
/// {
///   "target_role": "Full Stack Developer",
///   "timeframe_months": 6,
///   "learning_hours_per_week": 10,
///   "provider": "gemini",
///   "include_current_skills": true
/// }
/// ```
pub async fn generate_roadmap(
    auth_user: AuthUser,
    State(state): State<AppState>,
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, AppError> {
    let target_role = payload
        .get("target_role")
        .or_else(|| payload.get("tech_stack"))
        .and_then(|v| v.as_str())
        .ok_or_else(|| AppError::ValidationError("target_role is required".to_string()))?;

    let timeframe_months = payload
        .get("timeframe_months")
        .and_then(|v| v.as_u64())
        .map(|t| t as u32)
        .unwrap_or(6);

    let learning_hours_per_week = payload
        .get("learning_hours_per_week")
        .and_then(|v| v.as_u64())
        .map(|h| h as u32)
        .unwrap_or(10);

    let provider_str = payload
        .get("provider")
        .and_then(|v| v.as_str())
        .unwrap_or("gemini");

    let include_current_skills = payload
        .get("include_current_skills")
        .and_then(|v| v.as_bool())
        .unwrap_or(true);

    // Get user's current skills if requested
    let (current_skills, user_skills_json) = if include_current_skills {
        let user = sqlx::query_as::<_, crate::models::User>("SELECT * FROM users WHERE id = $1")
            .bind(auth_user.user_id)
            .fetch_one(&state.db_pool)
            .await?;

        let skills_str = user.skills.join(", ");
        let skills_json = serde_json::to_value(&user.skills).unwrap_or(json!([]));
        (Some(skills_str), skills_json)
    } else {
        (None, json!([]))
    };

    // Create AI action request with comprehensive parameters
    let mut parameters = serde_json::Map::new();
    if let Some(ref skills) = current_skills {
        parameters.insert("current_skills".to_string(), json!(skills));
    }
    parameters.insert("timeframe_months".to_string(), json!(timeframe_months));
    parameters.insert("learning_hours_per_week".to_string(), json!(learning_hours_per_week));

    let ai_request = AIActionRequest {
        action: crate::ai::types::ActionType::GenerateRoadmap,
        provider: if provider_str == "groq" {
            crate::ai::types::AIProvider::Groq
        } else {
            crate::ai::types::AIProvider::Gemini
        },
        input: target_role.to_string(),
        parameters: Some(serde_json::Value::Object(parameters)),
    };

    let ai_service = state
        .ai_service
        .as_ref()
        .ok_or_else(|| AppError::ConfigurationError("AI service not configured".to_string()))?;

    let response = ai_service.process_action(ai_request).await?;

    if !response.success {
        return Err(AppError::ExternalServiceError(
            response.message.unwrap_or_else(|| "Roadmap generation failed".to_string())
        ));
    }

    // Extract project suggestions and job application timing from AI response
    let project_suggestions = response.data.get("project_suggestions")
        .cloned()
        .unwrap_or(json!([]));
    
    let job_application_timing = response.data.get("job_application_timing")
        .and_then(|v| v.as_str())
        .unwrap_or("Apply after completing 60-70% of the roadmap");

    // Save roadmap to database with enhanced fields
    let provider_string = match response.provider {
        crate::ai::types::AIProvider::Gemini => "gemini",
        crate::ai::types::AIProvider::Groq => "groq",
    };

    let roadmap_id = sqlx::query_scalar::<_, i32>(
        "INSERT INTO career_roadmaps (
            user_id, title, target_role, roadmap_data, ai_provider,
            timeframe_months, learning_hours_per_week, current_skills,
            project_suggestions, job_application_timing
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING id",
    )
    .bind(auth_user.user_id)
    .bind(format!("Roadmap to {}", target_role))
    .bind(target_role)
    .bind(&response.data)
    .bind(provider_string)
    .bind(timeframe_months as i32)
    .bind(learning_hours_per_week as i32)
    .bind(&user_skills_json)
    .bind(&project_suggestions)
    .bind(job_application_timing)
    .fetch_one(&state.db_pool)
    .await?;

    Ok(Json(json!({
        "success": true,
        "roadmap": response.data,
        "roadmap_id": roadmap_id,
        "provider": response.provider,
        "message": "Roadmap generated and saved successfully",
        "metadata": {
            "timeframe_months": timeframe_months,
            "learning_hours_per_week": learning_hours_per_week,
            "job_application_timing": job_application_timing
        }
    })))
}

/// Generate professional summary for CV/profile
///
/// # Endpoint
/// `POST /api/ai/generate-summary`
///
/// # Request Body
/// ```json
/// {
///   "profile_data": {
///     "skills": ["React", "Node.js"],
///     "experience": "2 years",
///     "target_role": "Full Stack Developer"
///   },
///   "provider": "gemini"
/// }
/// ```
pub async fn generate_professional_summary(
    auth_user: AuthUser,
    State(state): State<AppState>,
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, AppError> {
    let provider_str = payload
        .get("provider")
        .and_then(|v| v.as_str())
        .unwrap_or("gemini");

    // Get user profile
    let user = sqlx::query_as::<_, crate::models::User>("SELECT * FROM users WHERE id = $1")
        .bind(auth_user.user_id)
        .fetch_one(&state.db_pool)
        .await?;

    // Build context from user profile
    let context = format!(
        "User Profile:\nSkills: {}\nProjects: {}\nTarget Roles: {}\nEducation: {}\nExperience Level: {:?}",
        user.skills.join(", "),
        user.projects.join(", "),
        user.target_roles.join(", "),
        user.education_level.as_deref().unwrap_or("Not specified"),
        user.experience_level
    );

    let prompt = format!(
        "Generate a professional summary for a CV/LinkedIn profile based on the following information:\n\n{}\n\nCreate a compelling 2-3 sentence professional summary that highlights key strengths, experience, and career goals. Make it engaging and professional.",
        context
    );

    let ai_request = AIActionRequest {
        action: crate::ai::types::ActionType::GenerateContent,
        provider: if provider_str == "groq" {
            crate::ai::types::AIProvider::Groq
        } else {
            crate::ai::types::AIProvider::Gemini
        },
        input: prompt,
        parameters: Some(json!({
            "content_type": "professional_summary",
            "tone": "professional",
            "length": "short"
        })),
    };

    let ai_service = state
        .ai_service
        .as_ref()
        .ok_or_else(|| AppError::ConfigurationError("AI service not configured".to_string()))?;

    let response = ai_service.process_action(ai_request).await?;

    Ok(Json(json!({
        "success": response.success,
        "summary": response.data,
        "provider": response.provider
    })))
}

/// Improve project descriptions with AI
///
/// # Endpoint
/// `POST /api/ai/improve-projects`
///
/// # Request Body
/// ```json
/// {
///   "projects": ["Built a todo app", "Created a website"],
///   "provider": "gemini"
/// }
/// ```
pub async fn improve_project_descriptions(
    auth_user: AuthUser,
    State(state): State<AppState>,
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, AppError> {
    let projects = payload
        .get("projects")
        .and_then(|v| v.as_array())
        .ok_or_else(|| AppError::ValidationError("projects array is required".to_string()))?;

    let provider_str = payload
        .get("provider")
        .and_then(|v| v.as_str())
        .unwrap_or("gemini");

    // Get user skills for context
    let user = sqlx::query_as::<_, crate::models::User>("SELECT * FROM users WHERE id = $1")
        .bind(auth_user.user_id)
        .fetch_one(&state.db_pool)
        .await?;

    let projects_text = projects
        .iter()
        .filter_map(|p| p.as_str())
        .collect::<Vec<_>>()
        .join("\n- ");

    let prompt = format!(
        "Improve these project descriptions for a professional CV. Make them more impactful using action verbs and quantifiable achievements where possible. User's skills: {}\n\nProjects:\n- {}\n\nReturn a JSON array of improved descriptions in the same order.",
        user.skills.join(", "),
        projects_text
    );

    let ai_request = AIActionRequest {
        action: crate::ai::types::ActionType::GenerateContent,
        provider: if provider_str == "groq" {
            crate::ai::types::AIProvider::Groq
        } else {
            crate::ai::types::AIProvider::Gemini
        },
        input: prompt,
        parameters: Some(json!({
            "content_type": "project_descriptions",
            "format": "bullet_points"
        })),
    };

    let ai_service = state
        .ai_service
        .as_ref()
        .ok_or_else(|| AppError::ConfigurationError("AI service not configured".to_string()))?;

    let response = ai_service.process_action(ai_request).await?;

    Ok(Json(json!({
        "success": response.success,
        "improved_projects": response.data,
        "provider": response.provider
    })))
}

/// Get LinkedIn/portfolio improvement suggestions
///
/// # Endpoint
/// `POST /api/ai/profile-suggestions`
///
/// # Request Body
/// ```json
/// {
///   "platform": "linkedin",
///   "provider": "gemini"
/// }
/// ```
pub async fn get_profile_suggestions(
    auth_user: AuthUser,
    State(state): State<AppState>,
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, AppError> {
    let platform = payload
        .get("platform")
        .and_then(|v| v.as_str())
        .unwrap_or("linkedin");

    let provider_str = payload
        .get("provider")
        .and_then(|v| v.as_str())
        .unwrap_or("gemini");

    // Get user profile
    let user = sqlx::query_as::<_, crate::models::User>("SELECT * FROM users WHERE id = $1")
        .bind(auth_user.user_id)
        .fetch_one(&state.db_pool)
        .await?;

    let prompt = format!(
        "Provide 5 specific, actionable suggestions to improve a {} profile for a job seeker with the following background:\n\nSkills: {}\nTarget Roles: {}\nExperience Level: {:?}\nEducation: {}\n\nReturn suggestions as a JSON array of objects with 'category' and 'suggestion' fields.",
        platform,
        user.skills.join(", "),
        user.target_roles.join(", "),
        user.experience_level,
        user.education_level.as_deref().unwrap_or("Not specified")
    );

    let ai_request = AIActionRequest {
        action: crate::ai::types::ActionType::GenerateContent,
        provider: if provider_str == "groq" {
            crate::ai::types::AIProvider::Groq
        } else {
            crate::ai::types::AIProvider::Gemini
        },
        input: prompt,
        parameters: Some(json!({
            "content_type": "profile_suggestions",
            "platform": platform
        })),
    };

    let ai_service = state
        .ai_service
        .as_ref()
        .ok_or_else(|| AppError::ConfigurationError("AI service not configured".to_string()))?;

    let response = ai_service.process_action(ai_request).await?;

    Ok(Json(json!({
        "success": response.success,
        "suggestions": response.data,
        "platform": platform,
        "provider": response.provider
    })))
}

/// Career chatbot - ask career-related questions
///
/// # Endpoint
/// `POST /api/ai/ask-mentor`
///
/// # Request Body
/// ```json
/// {
///   "question": "What should I learn to become a backend developer?",
///   "provider": "gemini"
/// }
/// ```
pub async fn ask_career_mentor(
    auth_user: AuthUser,
    State(state): State<AppState>,
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, AppError> {
    let question = payload
        .get("question")
        .and_then(|v| v.as_str())
        .ok_or_else(|| AppError::ValidationError("question is required".to_string()))?;

    let provider_str = payload
        .get("provider")
        .and_then(|v| v.as_str())
        .unwrap_or("gemini");

    // Get user context
    let user = sqlx::query_as::<_, crate::models::User>("SELECT * FROM users WHERE id = $1")
        .bind(auth_user.user_id)
        .fetch_one(&state.db_pool)
        .await?;

    let context = format!(
        "User's current skills: {}\nTarget roles: {}\nExperience level: {:?}",
        user.skills.join(", "),
        user.target_roles.join(", "),
        user.experience_level
    );

    let ai_request = AIActionRequest {
        action: crate::ai::types::ActionType::AskQuestion,
        provider: if provider_str == "groq" {
            crate::ai::types::AIProvider::Groq
        } else {
            crate::ai::types::AIProvider::Gemini
        },
        input: question.to_string(),
        parameters: Some(json!({ "context": context })),
    };

    let ai_service = state
        .ai_service
        .as_ref()
        .ok_or_else(|| AppError::ConfigurationError("AI service not configured".to_string()))?;

    let response = ai_service.process_action(ai_request).await?;

    Ok(Json(json!({
        "success": response.success,
        "answer": response.data,
        "provider": response.provider
    })))
}

/// Get all saved roadmaps for the logged-in user
///
/// # Endpoint
/// `GET /api/ai/roadmaps`
pub async fn get_my_roadmaps(
    auth_user: AuthUser,
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, AppError> {
    let roadmaps = sqlx::query!(
        "SELECT id, title, target_role, roadmap_data, ai_provider, 
                timeframe_months, learning_hours_per_week, current_skills,
                project_suggestions, job_application_timing, 
                progress_percentage, completed_phases, notes,
                created_at, updated_at 
         FROM career_roadmaps 
         WHERE user_id = $1 
         ORDER BY created_at DESC",
        auth_user.user_id
    )
    .fetch_all(&state.db_pool)
    .await?;

    let roadmaps_json: Vec<serde_json::Value> = roadmaps
        .into_iter()
        .map(|r| {
            json!({
                "id": r.id,
                "title": r.title,
                "target_role": r.target_role,
                "roadmap": r.roadmap_data,
                "ai_provider": r.ai_provider,
                "timeframe_months": r.timeframe_months,
                "learning_hours_per_week": r.learning_hours_per_week,
                "current_skills": r.current_skills,
                "project_suggestions": r.project_suggestions,
                "job_application_timing": r.job_application_timing,
                "progress_percentage": r.progress_percentage,
                "completed_phases": r.completed_phases,
                "notes": r.notes,
                "created_at": r.created_at,
                "updated_at": r.updated_at
            })
        })
        .collect();

    Ok(Json(json!({
        "success": true,
        "roadmaps": roadmaps_json,
        "count": roadmaps_json.len()
    })))
}

/// Get a specific roadmap by ID
///
/// # Endpoint
/// `GET /api/ai/roadmaps/:id`
pub async fn get_roadmap_by_id(
    auth_user: AuthUser,
    State(state): State<AppState>,
    axum::extract::Path(roadmap_id): axum::extract::Path<i32>,
) -> Result<Json<serde_json::Value>, AppError> {
    let roadmap = sqlx::query!(
        "SELECT id, title, target_role, roadmap_data, ai_provider,
                timeframe_months, learning_hours_per_week, current_skills,
                project_suggestions, job_application_timing,
                progress_percentage, completed_phases, notes,
                created_at, updated_at 
         FROM career_roadmaps 
         WHERE id = $1 AND user_id = $2",
        roadmap_id,
        auth_user.user_id
    )
    .fetch_optional(&state.db_pool)
    .await?;

    match roadmap {
        Some(r) => Ok(Json(json!({
            "success": true,
            "roadmap": {
                "id": r.id,
                "title": r.title,
                "target_role": r.target_role,
                "roadmap": r.roadmap_data,
                "ai_provider": r.ai_provider,
                "timeframe_months": r.timeframe_months,
                "learning_hours_per_week": r.learning_hours_per_week,
                "current_skills": r.current_skills,
                "project_suggestions": r.project_suggestions,
                "job_application_timing": r.job_application_timing,
                "progress_percentage": r.progress_percentage,
                "completed_phases": r.completed_phases,
                "notes": r.notes,
                "created_at": r.created_at,
                "updated_at": r.updated_at
            }
        }))),
        None => Err(AppError::NotFound),
    }
}

/// Delete a roadmap by ID
///
/// # Endpoint
/// `DELETE /api/ai/roadmaps/:id`
pub async fn delete_roadmap(
    auth_user: AuthUser,
    State(state): State<AppState>,
    axum::extract::Path(roadmap_id): axum::extract::Path<i32>,
) -> Result<Json<serde_json::Value>, AppError> {
    let result = sqlx::query!(
        "DELETE FROM career_roadmaps WHERE id = $1 AND user_id = $2",
        roadmap_id,
        auth_user.user_id
    )
    .execute(&state.db_pool)
    .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    Ok(Json(json!({
        "success": true,
        "message": "Roadmap deleted successfully"
    })))
}

/// Update roadmap progress
///
/// # Endpoint
/// `PUT /api/ai/roadmaps/:id/progress`
///
/// # Request Body
/// ```json
/// {
///   "progress_percentage": 45,
///   "completed_phases": [1, 2],
///   "notes": "Completed first two phases, starting phase 3"
/// }
/// ```
pub async fn update_roadmap_progress(
    auth_user: AuthUser,
    State(state): State<AppState>,
    axum::extract::Path(roadmap_id): axum::extract::Path<i32>,
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, AppError> {
    let progress_percentage = payload
        .get("progress_percentage")
        .and_then(|v| v.as_i64())
        .map(|p| p as i32);

    let completed_phases: Option<Vec<i32>> = payload
        .get("completed_phases")
        .and_then(|v| v.as_array())
        .map(|arr| {
            arr.iter()
                .filter_map(|p| p.as_i64())
                .map(|p| p as i32)
                .collect()
        });

    let notes = payload
        .get("notes")
        .and_then(|v| v.as_str());

    // Build dynamic update query
    let mut update_fields = Vec::new();
    let mut query = String::from("UPDATE career_roadmaps SET updated_at = CURRENT_TIMESTAMP");
    
    if let Some(progress) = progress_percentage {
        if progress < 0 || progress > 100 {
            return Err(AppError::ValidationError("Progress percentage must be between 0 and 100".to_string()));
        }
        update_fields.push(format!(" progress_percentage = {}", progress));
    }
    
    if completed_phases.is_some() {
        update_fields.push(" completed_phases = $3".to_string());
    }
    
    if notes.is_some() {
        update_fields.push(" notes = $4".to_string());
    }

    if !update_fields.is_empty() {
        query.push_str(", ");
        query.push_str(&update_fields.join(", "));
    }

    query.push_str(" WHERE id = $1 AND user_id = $2 RETURNING id");

    // Execute update
    let result = if let Some(phases) = completed_phases {
        if let Some(note_text) = notes {
            sqlx::query_scalar::<_, i32>(&query)
                .bind(roadmap_id)
                .bind(auth_user.user_id)
                .bind(&phases)
                .bind(note_text)
                .fetch_optional(&state.db_pool)
                .await?
        } else {
            let query_no_notes = query.replace(", notes = $4", "");
            sqlx::query_scalar::<_, i32>(&query_no_notes)
                .bind(roadmap_id)
                .bind(auth_user.user_id)
                .bind(&phases)
                .fetch_optional(&state.db_pool)
                .await?
        }
    } else if let Some(note_text) = notes {
        let query_no_phases = query.replace(", completed_phases = $3", "");
        sqlx::query_scalar::<_, i32>(&query_no_phases)
            .bind(roadmap_id)
            .bind(auth_user.user_id)
            .bind(note_text)
            .fetch_optional(&state.db_pool)
            .await?
    } else {
        // Only progress percentage
        let simple_query = "UPDATE career_roadmaps SET progress_percentage = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING id";
        sqlx::query_scalar::<_, i32>(simple_query)
            .bind(roadmap_id)
            .bind(auth_user.user_id)
            .bind(progress_percentage.unwrap_or(0))
            .fetch_optional(&state.db_pool)
            .await?
    };

    match result {
        Some(_) => Ok(Json(json!({
            "success": true,
            "message": "Roadmap progress updated successfully"
        }))),
        None => Err(AppError::NotFound),
    }
}
