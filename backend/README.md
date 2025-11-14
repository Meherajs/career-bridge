# CareerBridge Backend API

> A comprehensive career development platform API built with Rust and Axum
> 

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Setup Guide](#-setup-guide)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Code Documentation](#-code-documentation)
- [Algorithms](#-algorithms)
- [Testing](#-testing)
- [Logging & Monitoring](#-logging--monitoring)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)

## 🎯 Overview

CareerBridge helps users achieve career goals through:
- 🎯 **Skill Gap Analysis** - Identify and bridge skill gaps
- 💼 **Smart Job Matching** - AI-powered recommendations with real job details
- 📚 **Personalized Learning** - Curated courses and resources
- 📊 **Progress Tracking** - Monitor applications and learning

### 🆕 Recent Enhancement (November 2025)
The Job API now includes **comprehensive job details** directly from the database:
- ✅ Real responsibilities for each position
- ✅ Actual job requirements and qualifications
- ✅ Company benefits and perks
- ✅ No client-side generation - all data is authentic and database-driven

See `BACKEND_CHANGES.md` for migration details.

## ✨ Features

### 🔐 Authentication & Security
- **Multiple Login Methods**: Email/password, Google OAuth, GitHub OAuth
- **OAuth Integration**: Sign in with Google or GitHub accounts
- **Account Linking**: Automatic linking of OAuth and email accounts
- **Simplified Registration**: Name, email, password only (no barriers)
- **Instant Authentication**: JWT token generated immediately on registration
- **Secure Tokens**: JWT-based authentication (24-hour validity)
- **Strong Password Hashing**: Argon2 algorithm
- **Protected Routes**: Token middleware on all sensitive endpoints
- **Case-Insensitive Enums**: Flexible input handling (e.g., `Junior`, `junior`, `JUNIOR`)
- **SQL Injection Prevention**: Parameterized queries via SQLx

### 👤 Profile Management
- **Two-Step Onboarding**: Register first, complete profile later
- **Progress Tracking**: `profile_completed` flag to show onboarding prompts
- **Flexible Updates**: Update any profile field independently
- **Complete Profiles**: Skills, projects, education, experience, target roles
- **CV/Resume Upload**: Upload PDF files with automatic text extraction
- **Manual CV Input**: Alternative text-based CV entry
- **Career Preferences**: Track preferred career path and target roles

### 💼 Job Recommendations
- AI-powered skill-based matching
- Match score calculation (0-100%)
- Matched and missing skills identification
- Detailed job descriptions
- **Real job details**: responsibilities, requirements, and benefits from database
- Salary range information (min-max)
- Filter by experience level and job type
- Works even before profile completion

### 📚 Learning Resources
- Personalized course recommendations
- Skill gap-based suggestions
- Relevance scoring
- Free and paid resource filtering
- Progress tracking (0-100%)

### 📊 Skill Gap Analysis
- Compare user skills vs role requirements
- Calculate match percentage
- Identify specific skill gaps
- Recommend learning resources

### 📝 Application Tracking
- Track job applications
- Status updates and notes
- Application history
- Timeline tracking

### 📈 Progress Tracking
- Track learning resource progress
- Automatic completion detection
- View learning history

### 🤖 AI-Powered Features (Gemini & Groq)
- **Professional Summary Generator** - AI creates compelling CV summaries
- **Project Description Enhancer** - Transforms basic descriptions into impactful bullet points
- **Profile Improvement Suggestions** - Personalized LinkedIn/Portfolio recommendations
- **Career Roadmap Generator** - Personalized learning paths with timelines and projects
- **Career Mentor Chatbot** - Ask career-related questions and get expert advice
- **Skill Extraction from CV** - Automatically extract and categorize skills from uploaded CVs

### 📄 CV/Resume Management
- **PDF Upload & Text Extraction** - Upload CV and auto-extract text content
- **Professional CV Export** - Generate clean, print-ready CV layouts
- **PDF Export** - Print to PDF for easy sharing and applications
- **AI-Enhanced Content** - Improve summaries, projects, and descriptions

## 🚀 Quick Start

```bash
# Prerequisites: Rust 1.70+, PostgreSQL 14+

# 1. Navigate to backend
cd backend

# 2. Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, and OAuth credentials (optional)

# 3. Create database
createdb -U postgres database_db

# 4. Run schema
psql -U postgres -d database_db -f schema.sql

# 5. Seed data (includes 20 jobs with full details: descriptions, salary ranges, responsibilities, requirements, benefits)
psql -U postgres -d database_db -f seed_data.sql

# 6. Build and run
cargo build
cargo run
```

Server starts at: `http://127.0.0.1:3000`

### User Registration Flow

1. **Register** → Provide name, email, password → Get JWT token instantly
2. **Complete Profile** → Add experience, skills, preferences → Start using platform
3. **Update Anytime** → Modify profile as career progresses

> 💡 **Tip**: Use `api_tests.http` with VS Code REST Client extension to test all endpoints!

## 🛠 Tech Stack

- **Language**: Rust (Edition 2024)
- **Framework**: Axum 0.8 - Async web framework
- **Database**: PostgreSQL 14+ with SQLx
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: Argon2
- **File Upload**: Axum Typed Multipart
- **PDF Processing**: pdf-extract for CV text extraction
- **Validation**: Validator with derive macros
- **Logging**: Tracing
- **Runtime**: Tokio

## 📖 Setup Guide

### 1. Install Prerequisites

**Rust**:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**PostgreSQL**:
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql@14

# Windows - Download from postgresql.org
```

### 2. Start PostgreSQL

```bash
# Ubuntu/Debian
sudo service postgresql start

# macOS
brew services start postgresql@14

# Windows
net start postgresql-x64-14
```

### 3. Configure Environment

Create `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/database_db
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3001
GOOGLE_REDIRECT_URI=http://127.0.0.1:3000/api/auth/google/callback
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_REDIRECT_URI=http://127.0.0.1:3000/api/auth/github/callback
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

> **Note:** The `FRONTEND_URL` should point to where your frontend is running (default: `http://localhost:3001`). The OAuth redirect URIs should point to the backend API endpoints (port 3000).

### 4. Create & Setup Database

```bash
# Create database
createdb -U postgres database_db

# Apply schema
psql -U postgres -d database_db -f schema.sql

# Verify
psql -U postgres -d database_db -c "\dt"
```

### 5. Build & Run

```bash
cargo build
cargo run
```

## 📚 API Documentation

### Base URL
```
http://127.0.0.1:3000
```

### Public Endpoints

#### OAuth Authentication (NEW!)

##### Login with Google
```http
GET /api/auth/google
```
Redirects to Google OAuth, then back to frontend with JWT token.

##### Login with GitHub
```http
GET /api/auth/github
```
Redirects to GitHub OAuth, then back to frontend with JWT token.

After OAuth authentication, users are redirected to:
```
http://localhost:3001/auth/callback?token=<JWT>&new_user=<true|false>
```

#### Register User (Traditional Method)
```http
POST /api/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response**:
```json
{
  "message": "User registered successfully",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user_id": "uuid"
}
```

> 💡 **Note**: User receives JWT token immediately after registration for instant login.

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response**:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "profile_completed": false,
    "experience_level": null,
    "preferred_track": null,
    "skills": [],
    "projects": [],
    "target_roles": []
  }
}
```

> 💡 **Note**: Check `profile_completed` flag to show onboarding UI if needed.

### Protected Endpoints

**Authentication**: Add header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get Profile
```http
GET /api/profile
```

**Response** includes `profile_completed: true/false` to indicate if onboarding is needed.

#### Complete Profile (Step 2: Onboarding)
```http
POST /api/profile/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "education_level": "Bachelor's Degree in Computer Science",
  "experience_level": "junior",
  "preferred_track": "web_development",
  "skills": ["JavaScript", "React"],
  "projects": ["Portfolio Website"],
  "target_roles": ["Full Stack Developer"]
}
```

**Experience Levels**: `fresher`, `junior`, `mid` (case-insensitive)  
**Career Tracks**: `web_development`, `data`, `design`, `marketing` (case-insensitive)

**Response**:
```json
{
  "message": "Profile completed successfully"
}
```

#### Update Profile
```http
PUT /api/profile
Content-Type: application/json

{
  "full_name": "John Doe",
  "experience_level": "mid",
  "skills": ["JavaScript", "React", "Node.js", "TypeScript"],
  "projects": ["E-commerce Platform", "Task Manager"],
  "target_roles": ["Full Stack Developer", "Senior Frontend Developer"],
  "raw_cv_text": "My CV content..."
}
```

> 💡 **Note**: All fields optional. Only provided fields are updated.

#### Upload CV/Resume PDF
```http
POST /api/profile/cv/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

Field name: cv_file
File type: PDF only
Max size: 10MB
```

**Response**:
```json
{
  "message": "CV uploaded and processed successfully",
  "extracted_length": 1234
}
```

The PDF text is automatically extracted and saved to `raw_cv_text` field. The endpoint:
- Accepts only PDF files
- Extracts text content using `pdf-extract`
- Validates the file contains readable text
- Saves the extracted text to the user's profile

> 💡 **Note**: Users can still manually provide CV text via the `PUT /api/profile` endpoint.

#### Get Job Recommendations
```http
GET /api/jobs/recommendations?experience_level=junior&limit=10
```

**Query Parameters**:
- `experience_level`: `fresher`, `junior`, `mid`
- `job_type`: `internship`, `part_time`, `full_time`, `freelance`
- `limit`: Number of results (default: 10)

**Response**:
```json
[
  {
    "job": {
      "id": 1,
      "job_title": "Frontend Developer",
      "company": "Tech Corp",
      "location": "Remote",
      "job_description": "We are seeking a talented Frontend Developer...",
      "required_skills": ["JavaScript", "React", "CSS"],
      "experience_level": "junior",
      "job_type": "full_time",
      "salary_min": 60000,
      "salary_max": 80000,
      "responsibilities": [
        "Develop and maintain responsive web applications using React",
        "Collaborate with UX/UI designers to implement pixel-perfect designs",
        "Write clean, maintainable, and well-documented code",
        "Participate in code reviews and contribute to team knowledge sharing",
        "Optimize application performance and ensure cross-browser compatibility"
      ],
      "requirements": [
        "1-2 years of experience with JavaScript and React",
        "Strong understanding of HTML5, CSS3, and responsive design principles",
        "Experience with version control systems (Git)",
        "Good problem-solving skills and attention to detail",
        "Bachelor's degree in Computer Science or related field (or equivalent experience)"
      ],
      "benefits": [
        "Flexible remote work arrangement",
        "Health, dental, and vision insurance",
        "Professional development budget",
        "401(k) with company match",
        "Generous PTO policy"
      ]
    },
    "match_score": 66.7,
    "matched_skills": ["JavaScript", "React"],
    "missing_skills": ["CSS"]
  }
]
```

#### Get Learning Recommendations
```http
GET /api/learning/recommendations
```

#### Analyze Skill Gap
```http
GET /api/skill-gap/Full%20Stack%20Developer
```

**Response**:
```json
{
  "user_skills": ["JavaScript", "React"],
  "target_role": "Full Stack Developer",
  "required_skills": ["JavaScript", "React", "Node.js", "PostgreSQL"],
  "skill_gaps": ["Node.js", "PostgreSQL"],
  "matching_skills": ["JavaScript", "React"],
  "match_percentage": 50.0,
  "recommended_resources": [...]
}
```

#### Create Application
```http
POST /api/applications
Content-Type: application/json

{
  "job_id": 1,
  "notes": "Applied via company website"
}
```

#### Get Applications
```http
GET /api/applications
```

#### Update Application
```http
PUT /api/applications/1
Content-Type: application/json

{
  "status": "interview_scheduled",
  "notes": "Interview Monday at 10am"
}
```

#### Start Resource Tracking
```http
POST /api/progress/resource/5/start
```

#### Update Progress
```http
PUT /api/progress/resource/5
Content-Type: application/json

{
  "completion_percentage": 75
}
```

#### Get Progress
```http
GET /api/progress
```

### AI-Powered Endpoints

#### Generate Professional Summary
```http
POST /api/ai/generate-summary
Authorization: Bearer <token>
Content-Type: application/json

{
  "provider": "gemini"
}
```

**Response**: AI-generated professional summary based on your profile.

#### Improve Project Descriptions
```http
POST /api/ai/improve-projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "projects": [
    "Built a todo app",
    "Created a portfolio website"
  ],
  "provider": "gemini"
}
```

**Response**: Array of improved project descriptions with action verbs and impact.

#### Get Profile Improvement Suggestions
```http
POST /api/ai/profile-suggestions
Authorization: Bearer <token>
Content-Type: application/json

{
  "platform": "linkedin",
  "provider": "gemini"
}
```

**Response**: 5 personalized suggestions to improve your LinkedIn or portfolio.

#### Generate Career Roadmap
```http
POST /api/ai/roadmap
Authorization: Bearer <token>
Content-Type: application/json

{
  "target_role": "Full Stack Developer",
  "timeframe_months": 6,
  "learning_hours_per_week": 10,
  "include_current_skills": true,
  "provider": "gemini"
}
```

**Response**: Personalized learning roadmap with phases, resources, and timeline.

#### Ask Career Mentor
```http
POST /api/ai/ask-mentor
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "What should I learn to become a backend developer?",
  "provider": "gemini"
}
```

**Response**: AI-powered career advice based on your profile and question.

#### Extract Skills from CV
```http
POST /api/ai/extract-skills
Authorization: Bearer <token>
Content-Type: application/json

{
  "cv_text": "Your CV content here...",
  "provider": "gemini",
  "update_profile": true
}
```

**Response**: Extracted technical skills, soft skills, roles, tools, and certifications.

## 🗄 Database Schema

### Tables

#### users
- `id` (UUID, PK)
- `email` (TEXT, UNIQUE)
- `password_hash` (TEXT, optional for OAuth users)
- `oauth_provider` (VARCHAR(50), nullable) - 'google', 'github', or NULL
- `oauth_id` (VARCHAR(255), nullable) - Provider's unique user ID
- `avatar_url` (TEXT, nullable) - Profile picture from OAuth
- `full_name` (TEXT)
- `education_level` (TEXT, nullable)
- `experience_level` (ENUM, nullable until profile completion)
- `preferred_track` (ENUM, nullable until profile completion)
- `profile_completed` (BOOLEAN, default: false)
- `skills` (TEXT[])
- `projects` (TEXT[])
- `target_roles` (TEXT[])
- `raw_cv_text` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### jobs
- `id` (SERIAL, PK)
- `job_title` (TEXT)
- `company` (TEXT)
- `location` (TEXT)
- `job_description` (TEXT)
- `required_skills` (TEXT[])
- `experience_level` (ENUM)
- `job_type` (ENUM)
- `salary_min` (INTEGER, nullable)
- `salary_max` (INTEGER, nullable)
- `responsibilities` (TEXT[]) - Array of job responsibilities
- `requirements` (TEXT[]) - Array of job requirements
- `benefits` (TEXT[]) - Array of company benefits

#### learning_resources
- `id` (SERIAL, PK)
- `title` (TEXT)
- `platform` (TEXT)
- `url` (TEXT)
- `related_skills` (TEXT[])
- `cost` (ENUM)

#### application_tracking
- `id` (SERIAL, PK)
- `user_id` (UUID, FK → users)
- `job_id` (INT, FK → jobs)
- `status` (TEXT)
- `applied_at` (TIMESTAMPTZ)
- `notes` (TEXT)

#### user_progress
- `id` (SERIAL, PK)
- `user_id` (UUID, FK → users)
- `resource_id` (INT, FK → learning_resources)
- `completion_percentage` (INT)
- `started_at` (TIMESTAMPTZ)
- `completed_at` (TIMESTAMPTZ)

#### notifications
- `id` (SERIAL, PK)
- `user_id` (UUID, FK → users)
- `title` (VARCHAR(255))
- `message` (TEXT)
- `type` (VARCHAR(50))
- `is_read` (BOOLEAN, default: false)
- `created_at` (TIMESTAMPTZ)

#### skill_assessments
- `id` (SERIAL, PK)
- `user_id` (UUID, FK → users)
- `skill_name` (VARCHAR(255))
- `proficiency_level` (INTEGER, 1-10)
- `assessed_at` (TIMESTAMPTZ)

#### career_roadmaps
- `id` (SERIAL, PK)
- `user_id` (UUID, FK → users)
- `title` (TEXT)
- `target_role` (TEXT)
- `roadmap_data` (JSONB) - Complete roadmap structure
- `ai_provider` (VARCHAR(50)) - 'gemini' or 'groq'
- `timeframe_months` (INTEGER)
- `learning_hours_per_week` (INTEGER)
- `current_skills` (JSONB) - Skills at roadmap creation
- `project_suggestions` (JSONB) - Recommended projects
- `job_application_timing` (TEXT) - When to start applying
- `progress_percentage` (INTEGER, default: 0)
- `completed_phases` (INTEGER[])
- `notes` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### Enums
- `experience_level`: fresher, junior, mid
- `career_track`: web_development, data, design, marketing
- `job_type`: internship, part_time, full_time, freelance
- `cost_indicator`: free, paid

## 📝 Code Documentation

Full Rust documentation available:

```bash
cargo doc --open --no-deps
```

Generates comprehensive HTML docs with:
- Crate overview and API reference
- Module documentation
- All structs, enums, functions
- Parameter and return descriptions
- Error conditions
- Usage examples
- Search functionality

## 🧮 Algorithms

### Job Matching
```
match_score = (matched_skills / required_skills) × 100
```
Calculates skill overlap percentage between user and job.

### Learning Resource Relevance
```
relevance = (new_skills_taught / total_skills) × 100
```
Prioritizes resources teaching new skills.

### Skill Gap Analysis
```
match_percentage = (matching_skills / required_skills) × 100
```
Aggregates requirements from multiple jobs for comprehensive analysis.

## 🧪 Testing

```bash
# Run all tests
cargo test

# Run specific test
cargo test test_name

# Show output
cargo test -- --nocapture

# With REST Client (VS Code)
# Open api_tests.http and click "Send Request"
```

## 🔧 Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Start if stopped
sudo service postgresql start
```

### "relation does not exist"
```bash
# Apply schema
psql -U postgres -d database_db -f schema.sql
```

### "password authentication failed"
```bash
# Reset password
sudo -u postgres psql
ALTER USER postgres PASSWORD 'newpassword';
\q

# Update .env with new password
```

### Port 3000 Already in Use
Change port in `src/main.rs`:
```rust
let addr = SocketAddr::from(([127, 0, 0, 1], 3001));
```

## 🚀 Deployment

### Production Checklist
- [ ] Use strong JWT_SECRET
- [ ] Configure database connection pooling
- [ ] Enable HTTPS/TLS
- [ ] Set up CORS for frontend
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Database backups
- [ ] Error reporting service

### Build for Production
```bash
cargo build --release
```

Binary: `./target/release/backend`

### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=production-secret-key
```

## 📝 Logging & Monitoring

The application includes comprehensive tracing logs for debugging and monitoring:

### Log Levels
- **INFO** - Business operations, user actions, successful completions
- **DEBUG** - Detailed information (query params, intermediate values)
- **WARN** - User errors, validation failures, duplicate actions
- **ERROR** - System errors, database failures requiring investigation

### What's Logged
✅ All user registration and login attempts (success/failure)  
✅ Profile operations (creation, updates, completions)  
✅ Job and learning recommendations (with match scores)  
✅ Application and progress tracking events  
✅ OAuth flows (Google/GitHub authentication)  
✅ Database operations and errors  
✅ Server startup and configuration  

### Smart Error Handling
User errors (validation, duplicates) are logged at WARN level, while system errors are logged at ERROR level. Users receive friendly messages instead of raw database errors.

**Example:**
```
WARN  Registration failed: Email already exists - user@example.com
Response: "An account with this email already exists. Please login or use a different email."
```

### Configuration
Change log level in `main.rs` or via environment:
```bash
RUST_LOG=debug cargo run   # Debug level
RUST_LOG=info cargo run    # Default (recommended)
```

## 📊 Project Structure

```
backend/
├── src/
│   ├── main.rs                # Entry point with startup logs
│   ├── lib.rs                 # Crate docs
│   ├── handlers.rs            # Router with route logging
│   ├── handlers/
│   │   ├── types.rs           # Request/response types
│   │   ├── auth.rs            # Auth endpoints (with logs)
│   │   ├── profile.rs         # Profile endpoints (with logs)
│   │   ├── jobs.rs            # Job recommendations (with logs)
│   │   ├── learning.rs        # Learning resources (with logs)
│   │   ├── applications.rs    # Application tracking (with logs)
│   │   ├── progress.rs        # Progress tracking (with logs)
│   │   └── oauth.rs           # OAuth handlers (comprehensive logs)
│   ├── models.rs              # Database models
│   ├── auth.rs                # JWT logic
│   ├── security.rs            # Password hashing
│   └── errors.rs              # Error handling with smart logging
├── schema.sql                 # Database schema
├── seed_data.sql              # Sample data
├── api_tests.http             # API tests
├── Cargo.toml                 # Dependencies
└── .env                       # Environment vars
```

## 🤝 Contributing

Contributions welcome!

## 📄 License

MIT License

---

**Built with ❤️ using Rust** | **Version 0.1.0** | **XO9A8** 
