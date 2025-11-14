//! CareerBridge API Server
//!
//! Main entry point for the CareerBridge API server.
//! Sets up database connection, logging, and HTTP server.

use std::net::SocketAddr;
use tracing::{info, error, Level};
use tracing_subscriber::FmtSubscriber;
use sqlx::PgPool; 
use dotenvy::dotenv; 
use std::env;
use backend::{AppState, handlers};

/// Main application entry point.
/// 
/// Initializes the database connection, sets up tracing, and starts the HTTP server.
#[tokio::main]
async fn main() {
    // Load environment variables
    dotenv().ok();
    
    // Initialize tracing
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::INFO)
        .finish();
    tracing::subscriber::set_global_default(subscriber)
        .expect("Failed to set global tracing subscriber");
    
    info!("🚀 Starting CareerBridge API Server...");
    info!("Environment: {}", env::var("RUST_ENV").unwrap_or_else(|_| "development".to_string()));
    
    // Get database URL
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env file");
    
    info!("Connecting to database...");
    
    if std::env::var("SQLX_OFFLINE").is_ok() {
        println!("cargo:rustc-env=SQLX_OFFLINE=true");
    }
    
    // Create database connection pool
    let db_pool = PgPool::connect(&database_url)
        .await
        .expect("Failed to create database connection pool");
    
    info!("✓ Database connection pool created successfully");
    
    // Initialize AI service
    info!("Initializing AI services...");
    let gemini_api_key = env::var("GEMINI_API_KEY").ok();
    let groq_api_key = env::var("GROQ_API_KEY").ok();
    
    let ai_service = if gemini_api_key.is_some() || groq_api_key.is_some() {
        info!("✓ AI service initialized with available providers");
        if gemini_api_key.is_some() {
            info!("  - Gemini API: enabled");
        }
        if groq_api_key.is_some() {
            info!("  - Groq API: enabled");
        }
        Some(std::sync::Arc::new(backend::ai::AIService::new(
            gemini_api_key,
            groq_api_key,
        )))
    } else {
        info!("⚠ AI service not configured (no API keys found)");
        info!("  Set GEMINI_API_KEY or GROQ_API_KEY to enable AI features");
        None
    };
    
    // Create application state
    let app_state = AppState { 
        db_pool,
        ai_service,
    };

    // Create router
    info!("Configuring routes...");
    let app = handlers::create_router(app_state);
    info!("✓ Routes configured");

    // Bind to address - use 0.0.0.0 for Railway and read PORT from environment
    let port = env::var("PORT")
        .unwrap_or_else(|_| "3000".to_string())
        .parse::<u16>()
        .expect("PORT must be a valid number");
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    info!("Binding to address: {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind to address");

    info!("✓ Server successfully started!");
    info!("📡 Listening on http://{}", addr);
    info!("📚 API Documentation: http://{}/api/", addr);
    info!("Press Ctrl+C to stop the server");

    // Start serving
    if let Err(e) = axum::serve(listener, app).await {
        error!("Server error: {}", e);
    }
    
    info!("Server shutting down...");
}