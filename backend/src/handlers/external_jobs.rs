//! External job sources integration handlers.
//!
//! This module integrates jobs from external sources:
//! - ReliefWeb API (UN/NGO jobs)
//! - Bangladesh government portals
//! - Local job boards

use crate::AppState;
use crate::auth::AuthUser;
use crate::errors::AppResult;
use axum::{Json, extract::State};
use serde::{Deserialize, Serialize};
use tracing::{debug, error, info, warn};

#[derive(Debug, Serialize, Deserialize)]
pub struct ExternalJob {
    pub id: String,
    pub title: String,
    pub company: String,
    pub location: String,
    pub description: String,
    pub url: String,
    pub posted_date: String,
    pub source: String,
    pub job_type: Option<String>,
    pub experience_level: Option<String>,
    pub skills: Vec<String>,
    pub salary: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ReliefWebResponse {
    data: Vec<ReliefWebJob>,
}

#[derive(Debug, Deserialize)]
struct ReliefWebJob {
    id: String,
    fields: ReliefWebFields,
}

#[derive(Debug, Deserialize)]
struct ReliefWebFields {
    title: String,
    #[serde(default)]
    body: Option<String>,
    #[serde(default)]
    url: String,
    #[serde(default)]
    source: Vec<ReliefWebSource>,
    #[serde(default)]
    country: Vec<ReliefWebCountry>,
    #[serde(default)]
    date: ReliefWebDate,
    #[serde(default)]
    experience: Vec<ReliefWebExperience>,
    #[serde(default)]
    career_categories: Vec<ReliefWebCareer>,
}

#[derive(Debug, Deserialize)]
struct ReliefWebSource {
    #[serde(default)]
    name: String,
}

#[derive(Debug, Deserialize)]
struct ReliefWebCountry {
    #[serde(default)]
    name: String,
}

#[derive(Debug, Deserialize, Default)]
struct ReliefWebDate {
    #[serde(default)]
    created: String,
}

#[derive(Debug, Deserialize)]
struct ReliefWebExperience {
    #[serde(default)]
    name: String,
}

#[derive(Debug, Deserialize)]
struct ReliefWebCareer {
    #[serde(default)]
    name: String,
}

/// Fetches NGO and UN jobs from ReliefWeb API for Bangladesh
async fn fetch_reliefweb_jobs() -> Result<Vec<ExternalJob>, Box<dyn std::error::Error>> {
    let url = "https://api.reliefweb.int/v1/jobs?appname=careerbridge&query[value]=country:\"Bangladesh\"&limit=20&sort[]=date.created:desc";

    let client = reqwest::Client::new();
    let response = client
        .get(url)
        .header("User-Agent", "CareerBridge/1.0")
        .send()
        .await?;

    if !response.status().is_success() {
        return Err(format!("ReliefWeb API returned status: {}", response.status()).into());
    }

    let data: ReliefWebResponse = response.json().await?;

    let jobs = data
        .data
        .into_iter()
        .map(|job| {
            let location = job
                .fields
                .country
                .first()
                .map(|c| c.name.clone())
                .unwrap_or_else(|| "Bangladesh".to_string());

            let company = job
                .fields
                .source
                .first()
                .map(|s| s.name.clone())
                .unwrap_or_else(|| "NGO/UN".to_string());

            let experience = job
                .fields
                .experience
                .first()
                .map(|e| e.name.clone())
                .unwrap_or_default();

            let skills: Vec<String> = job
                .fields
                .career_categories
                .iter()
                .map(|c| c.name.clone())
                .collect();

            ExternalJob {
                id: format!("reliefweb_{}", job.id),
                title: job.fields.title,
                company,
                location,
                description: job.fields.body.unwrap_or_default(),
                url: job.fields.url,
                posted_date: job.fields.date.created,
                source: "ReliefWeb".to_string(),
                job_type: Some("Full-time".to_string()),
                experience_level: if experience.is_empty() {
                    None
                } else {
                    Some(experience)
                },
                skills,
                salary: None,
            }
        })
        .collect();

    Ok(jobs)
}

/// Sample data for Bangladesh government job portals
fn get_sample_govt_jobs() -> Vec<ExternalJob> {
    vec![
        ExternalJob {
            id: "bpsc_001".to_string(),
            title: "Assistant Engineer - BPSC".to_string(),
            company: "Bangladesh Public Service Commission".to_string(),
            location: "Dhaka, Bangladesh".to_string(),
            description: "Hiring for Assistant Engineer position in various government departments. Bachelor's degree in Engineering required.".to_string(),
            url: "http://bpsc.gov.bd".to_string(),
            posted_date: "2025-11-01".to_string(),
            source: "BPSC".to_string(),
            job_type: Some("Government".to_string()),
            experience_level: Some("Entry Level".to_string()),
            skills: vec!["Engineering".to_string(), "Problem Solving".to_string()],
            salary: Some("BDT 35,000 - 45,000".to_string()),
        },
        ExternalJob {
            id: "ngoab_001".to_string(),
            title: "Program Officer - Development".to_string(),
            company: "NGO Affairs Bureau Registered Organization".to_string(),
            location: "Chittagong, Bangladesh".to_string(),
            description: "Seeking Program Officer for community development projects. Experience in rural development preferred.".to_string(),
            url: "http://ngoab.gov.bd".to_string(),
            posted_date: "2025-11-10".to_string(),
            source: "NGOAB".to_string(),
            job_type: Some("Full-time".to_string()),
            experience_level: Some("Mid Level".to_string()),
            skills: vec!["Project Management".to_string(), "Community Development".to_string(), "Report Writing".to_string()],
            salary: Some("BDT 40,000 - 60,000".to_string()),
        },
    ]
}

/// Sample data for local Bangladesh job boards
fn get_sample_local_jobs() -> Vec<ExternalJob> {
    vec![
        ExternalJob {
            id: "bdjobs_001".to_string(),
            title: "Software Developer - FinTech".to_string(),
            company: "bKash Limited".to_string(),
            location: "Dhaka, Bangladesh".to_string(),
            description: "Looking for experienced software developers to work on mobile financial services platform. Strong Java/Kotlin skills required.".to_string(),
            url: "https://bdjobs.com".to_string(),
            posted_date: "2025-11-12".to_string(),
            source: "BDJobs".to_string(),
            job_type: Some("Full-time".to_string()),
            experience_level: Some("Mid Level".to_string()),
            skills: vec!["Java".to_string(), "Kotlin".to_string(), "Android".to_string(), "APIs".to_string()],
            salary: Some("BDT 80,000 - 120,000".to_string()),
        },
        ExternalJob {
            id: "prothomalo_001".to_string(),
            title: "Digital Marketing Specialist".to_string(),
            company: "Grameen Phone".to_string(),
            location: "Dhaka, Bangladesh".to_string(),
            description: "Join our marketing team to drive digital campaigns for Bangladesh's leading telecom operator.".to_string(),
            url: "https://jobs.prothomalo.com".to_string(),
            posted_date: "2025-11-13".to_string(),
            source: "Prothom Alo Jobs".to_string(),
            job_type: Some("Full-time".to_string()),
            experience_level: Some("Junior".to_string()),
            skills: vec!["Digital Marketing".to_string(), "SEO".to_string(), "Social Media".to_string(), "Analytics".to_string()],
            salary: Some("BDT 50,000 - 70,000".to_string()),
        },
        ExternalJob {
            id: "chakri_001".to_string(),
            title: "Training Coordinator".to_string(),
            company: "SEIP - Skills for Employment Investment Program".to_string(),
            location: "Sylhet, Bangladesh".to_string(),
            description: "Coordinate vocational training programs for youth employment. Government-funded skill development initiative.".to_string(),
            url: "https://seip.gov.bd".to_string(),
            posted_date: "2025-11-08".to_string(),
            source: "Chakri.com".to_string(),
            job_type: Some("Contract".to_string()),
            experience_level: Some("Junior".to_string()),
            skills: vec!["Training".to_string(), "Coordination".to_string(), "Communication".to_string()],
            salary: Some("BDT 35,000 - 50,000".to_string()),
        },
    ]
}

/// Get external jobs from all sources
pub async fn get_external_jobs(
    _auth_user: AuthUser,
    State(_app_state): State<AppState>,
) -> AppResult<Json<Vec<ExternalJob>>> {
    info!("Fetching external jobs from multiple sources");

    let mut all_jobs = Vec::new();

    // Fetch ReliefWeb jobs (NGO/UN jobs in Bangladesh)
    match fetch_reliefweb_jobs().await {
        Ok(mut jobs) => {
            info!("Successfully fetched {} jobs from ReliefWeb", jobs.len());
            all_jobs.append(&mut jobs);
        }
        Err(e) => {
            error!("Failed to fetch ReliefWeb jobs: {}", e);
            warn!("Continuing with other sources...");
        }
    }

    // Add government portal jobs
    let mut govt_jobs = get_sample_govt_jobs();
    debug!("Added {} government portal jobs", govt_jobs.len());
    all_jobs.append(&mut govt_jobs);

    // Add local job board listings
    let mut local_jobs = get_sample_local_jobs();
    debug!("Added {} local job board listings", local_jobs.len());
    all_jobs.append(&mut local_jobs);

    info!(
        "Returning {} total external jobs from all sources",
        all_jobs.len()
    );

    Ok(Json(all_jobs))
}

/// Get only ReliefWeb NGO jobs
pub async fn get_ngo_jobs(
    _auth_user: AuthUser,
    State(_app_state): State<AppState>,
) -> AppResult<Json<Vec<ExternalJob>>> {
    info!("Fetching NGO jobs from ReliefWeb");

    match fetch_reliefweb_jobs().await {
        Ok(jobs) => {
            info!("Successfully fetched {} NGO jobs", jobs.len());
            Ok(Json(jobs))
        }
        Err(e) => {
            error!("Failed to fetch NGO jobs: {}", e);
            // Return empty list on error
            Ok(Json(Vec::new()))
        }
    }
}

/// Get government job portal listings
pub async fn get_govt_jobs(
    _auth_user: AuthUser,
    State(_app_state): State<AppState>,
) -> AppResult<Json<Vec<ExternalJob>>> {
    info!("Fetching government job portal listings");
    let jobs = get_sample_govt_jobs();
    Ok(Json(jobs))
}

/// Get local job board listings
pub async fn get_local_jobs(
    _auth_user: AuthUser,
    State(_app_state): State<AppState>,
) -> AppResult<Json<Vec<ExternalJob>>> {
    info!("Fetching local job board listings");
    let jobs = get_sample_local_jobs();
    Ok(Json(jobs))
}
