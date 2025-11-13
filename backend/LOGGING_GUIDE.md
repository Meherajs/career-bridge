# Logging Guide

Comprehensive tracing logs have been added across the entire CareerBridge backend codebase.

## Log Levels Used

- **INFO** - Important business operations, user actions, successful completions
- **DEBUG** - Detailed information useful for debugging (query params, intermediate values)
- **WARN** - Validation failures, authentication failures, non-critical issues
- **ERROR** - Database errors, critical failures, unexpected conditions

## Logging by Module

### 🔐 Authentication (`handlers/auth.rs`)

**Registration Flow:**
- INFO: Registration request received with email
- WARN: Validation failures
- DEBUG: Password hashing in progress
- INFO: User created successfully with user_id
- DEBUG: JWT token generation
- INFO: Registration successful
- WARN: Email already exists
- ERROR: Database errors

**Login Flow:**
- INFO: Login attempt received with email
- WARN: Validation failures
- DEBUG: Fetching user from database
- WARN: User not found
- INFO: User found with profile completion status
- DEBUG: Password verification
- WARN: Invalid password
- INFO: Password verified successfully
- DEBUG: JWT token generation
- INFO: Login successful with user details

### 👤 Profile (`handlers/profile.rs`)

**Get Profile:**
- INFO: Fetching profile for user
- DEBUG: Profile completion status
- ERROR: User not found

**Complete Profile:**
- INFO: Completing profile for user
- WARN: Validation failures
- DEBUG: Profile data (experience level, track)
- INFO: Profile completed successfully
- ERROR: Database errors

**Update Profile:**
- INFO: Updating profile for user
- WARN: Validation failures
- DEBUG: Updating specific field
- INFO: Profile updated with list of modified fields

### 💼 Jobs (`handlers/jobs.rs`)

**Job Recommendations:**
- INFO: Fetching job recommendations for user
- DEBUG: Query parameters (experience level, limit)
- INFO: Number of recommendations returned
- DEBUG: Top match score
- INFO: Job matching complete

### 📚 Learning (`handlers/learning.rs`)

**Learning Recommendations:**
- INFO: Fetching learning recommendations
- INFO: Number of recommendations returned

**Skill Gap Analysis:**
- INFO: Analyzing skill gap with target role
- INFO: Analysis complete with match percentage and gaps
- DEBUG: List of skill gaps identified

### 📝 Applications (`handlers/applications.rs`)

**Create Application:**
- INFO: Creating application for user and job
- INFO: Application created with IDs

**Get Applications:**
- INFO: Fetching applications for user
- DEBUG: Number of applications retrieved

**Update Application:**
- INFO: Updating application with new status
- INFO: Application updated successfully

### 📈 Progress (`handlers/progress.rs`)

**Start Resource:**
- INFO: Starting resource tracking for user/resource
- INFO: Resource tracking started with progress_id

**Update Progress:**
- INFO: Updating progress with completion percentage
- INFO: Resource completed (when 100%)
- DEBUG: Progress percentage updated

**Get Progress:**
- INFO: Fetching progress for user
- DEBUG: Number of progress records retrieved

### 🔑 OAuth (`handlers/oauth.rs`)

Already has comprehensive logging! See previous implementation for:
- Google/GitHub OAuth initiation
- Callback handling
- Token exchange
- User info retrieval
- User creation/linking
- JWT generation
- Redirects

### 🚀 Server Startup (`main.rs`)

- INFO: Server starting with environment
- INFO: Connecting to database
- INFO: Database connection successful
- INFO: Configuring routes
- INFO: Routes configured
- INFO: Binding to address
- INFO: Server successfully started with URL
- INFO: API documentation link
- ERROR: Server errors
- INFO: Server shutting down

### 🛣️ Router Setup (`handlers.rs`)

- INFO: API routes being configured
- INFO: Route categories (public, OAuth, protected)

## Example Log Output

### Successful Registration
```
INFO  Received registration request for email: john@example.com
DEBUG Hashing password for user: john@example.com
INFO  User created successfully: user_id=123e4567-e89b-12d3-a456-426614174000, email=john@example.com
DEBUG Generating JWT token for user: 123e4567-e89b-12d3-a456-426614174000
INFO  Registration successful for user: 123e4567-e89b-12d3-a456-426614174000
```

### Successful Login
```
INFO  Login attempt received for: john@example.com
DEBUG Fetching user from database: john@example.com
INFO  User found: user_id=123e4567-e89b-12d3-a456-426614174000, profile_completed=true
DEBUG Verifying password for user: 123e4567-e89b-12d3-a456-426614174000
INFO  Password verified successfully for user: 123e4567-e89b-12d3-a456-426614174000
DEBUG Generating JWT token for user: 123e4567-e89b-12d3-a456-426614174000
INFO  Login successful for user: user_id=123e4567-e89b-12d3-a456-426614174000, email=john@example.com
```

### Failed Login
```
INFO  Login attempt received for: john@example.com
DEBUG Fetching user from database: john@example.com
WARN  Login failed: Invalid password for user - john@example.com
```

### Profile Update
```
INFO  Updating profile for user: 123e4567-e89b-12d3-a456-426614174000
DEBUG Updating full_name for user: 123e4567-e89b-12d3-a456-426614174000
INFO  Profile updated successfully for user 123e4567-e89b-12d3-a456-426614174000: fields updated: ["full_name", "skills", "projects"]
```

### Job Recommendations
```
INFO  Fetching job recommendations for user: 123e4567-e89b-12d3-a456-426614174000
DEBUG Query params: experience_level=Some(Junior), limit=Some(10)
INFO  Returning 8 job recommendations for user: 123e4567-e89b-12d3-a456-426614174000
DEBUG Top match score: 85.7%
```

### Skill Gap Analysis
```
INFO  Analyzing skill gap for user: 123e4567-e89b-12d3-a456-426614174000, target_role: Full Stack Developer
INFO  Skill gap analysis complete for user 123e4567-e89b-12d3-a456-426614174000: 5/8 skills matched (62.5%), 3 gaps identified
DEBUG Skill gaps: ["Docker", "Kubernetes", "AWS"]
```

### OAuth Flow
```
INFO  Initiating Google OAuth login flow
DEBUG Google redirect URI: http://127.0.0.1:3000/api/auth/google/callback
INFO  Redirecting to Google OAuth URL: https://accounts.google.com/...
INFO  Received Google OAuth callback
INFO  Exchanging authorization code for access token
INFO  Successfully obtained access token, fetching user info from Google
INFO  Retrieved Google user info: email=user@gmail.com, name=John Doe
INFO  Processing OAuth user authentication for Google ID: 123456789
INFO  Handling OAuth user: provider=google, email=user@gmail.com, oauth_id=123456789
INFO  Found existing OAuth user: user_id=123e4567-e89b-12d3-a456-426614174000
INFO  Generating JWT token for user: 123e4567-e89b-12d3-a456-426614174000, new_user=false
INFO  Google OAuth successful! Redirecting to frontend
```

## Configuration

### Change Log Level

In `main.rs`, change the max level:

```rust
let subscriber = FmtSubscriber::builder()
    .with_max_level(Level::DEBUG)  // Change to DEBUG, TRACE, etc.
    .finish();
```

### Environment Variable

Set `RUST_LOG` environment variable:
```bash
RUST_LOG=debug cargo run    # Debug level
RUST_LOG=trace cargo run    # Most verbose
RUST_LOG=info cargo run     # Default
```

## Benefits of Added Logging

✅ **Debugging** - Quickly identify where requests fail
✅ **Monitoring** - Track user activity and system health
✅ **Auditing** - See who did what and when
✅ **Performance** - Identify slow operations
✅ **Security** - Track authentication attempts and failures
✅ **User Behavior** - Understand usage patterns
✅ **Error Tracking** - Detailed error context for troubleshooting

## Error Handling and Logging

### Smart Error Logging

The error handler intelligently logs errors at appropriate levels:

**DEBUG Level** - User errors that don't require investigation:
- Validation errors (invalid input)
- Not found errors
- Unauthorized access attempts

**WARN Level** - User actions that should be monitored:
- Duplicate email registration attempts
- Duplicate record violations

**ERROR Level** - System errors requiring investigation:
- Database connection failures
- Internal server errors
- Unexpected database errors

### User-Friendly Error Messages

Instead of exposing database errors, users receive clear messages:
- ❌ Raw: `duplicate key value violates unique constraint "users_email_key"`
- ✅ User-friendly: `An account with this email already exists. Please login or use a different email.`

### Example: Duplicate Email Registration
```
WARN  Registration failed: Email already exists - jane.smith@example.com
WARN  Duplicate record attempt: Some("users_email_key")

Response to user:
{
  "error": "An account with this email already exists. Please login or use a different email."
}
```

## Best Practices

1. **INFO level** logs are always visible and provide key business events
2. **DEBUG level** provides detailed flow for troubleshooting
3. **WARN level** highlights issues that aren't critical but need attention (like user errors)
4. **ERROR level** captures failures that require immediate investigation (system errors only)
5. Sensitive data (passwords, tokens) are never logged
6. User IDs and emails are logged for traceability
7. Request parameters are logged at DEBUG level
8. Success/failure outcomes are always logged
9. User errors (validation, duplicates) don't pollute ERROR logs
10. Database constraint names are used to provide specific error messages

## Production Considerations

For production:
- Use structured logging (JSON format)
- Send logs to centralized logging service (ELK, CloudWatch, etc.)
- Set level to INFO or WARN to reduce volume
- Add correlation IDs for request tracing
- Monitor ERROR and WARN logs with alerts
- Implement log rotation and retention policies
