# Echoes of Time API - Backend Implementation Prompt

## Project Overview
Build a REST API for the Echoes of Time mobile application. The API should serve historical scenarios ("echoes") to users, with a "Scenario of the Day" feature that ensures all users see the same scenario on the same date.

## Core Requirements

### 1. Scenario of the Day Endpoint

**Endpoint:** `GET /scenarios/today`

**Purpose:** Return the scenario of the day based on the current date. All users worldwide should receive the same scenario on the same date (deterministic selection).

**Response Format:**
```json
{
  "id": "string",
  "title": "string",
  "subtitle": "string",
  "location": "string",
  "description": "string",
  "imageUrl": "string",
  "date": "string (ISO 8601 format)"
}
```

**Example Response:**
```json
{
  "id": "1",
  "title": "The Fall of\nthe Bastille",
  "subtitle": "Paris, 1789",
  "location": "Paris",
  "description": "A guard must choose between duty and revolution.",
  "imageUrl": "https://cdn.historyrelived.com/scenarios/bastille.jpg",
  "date": "1789-07-14"
}
```

**Selection Algorithm:**
- Must be deterministic: same date = same scenario for all users
- Recommended approach: Use the date (YYYYMMDD format) as a seed to select from available scenarios
- Example: `seed = year * 10000 + month * 100 + day`, then `index = seed % totalScenarios`
- This ensures consistency across different timezones and servers

### 2. Initial Scenario Database

Create a database with at least these 7 historical scenarios:

1. **The Fall of the Bastille**
   - Subtitle: "Paris, 1789"
   - Location: "Paris"
   - Description: "A guard must choose between duty and revolution."
   - Historical Date: "1789-07-14"

2. **The Signing of the Declaration**
   - Subtitle: "Philadelphia, 1776"
   - Location: "Philadelphia"
   - Description: "A delegate faces the weight of treason and freedom."
   - Historical Date: "1776-07-04"

3. **Crossing the Rubicon**
   - Subtitle: "Roman Republic, 49 BC"
   - Location: "Italy"
   - Description: "Caesar makes a decision that will change history forever."
   - Historical Date: "-0049-01-10"

4. **The Moon Landing**
   - Subtitle: "Sea of Tranquility, 1969"
   - Location: "Moon"
   - Description: "One small step for man, one giant leap for mankind."
   - Historical Date: "1969-07-20"

5. **The Berlin Wall Falls**
   - Subtitle: "Berlin, 1989"
   - Location: "Berlin"
   - Description: "A border guard must decide: follow orders or make history."
   - Historical Date: "1989-11-09"

6. **The Battle of Hastings**
   - Subtitle: "England, 1066"
   - Location: "Hastings"
   - Description: "A Saxon warrior stands at the turning point of English history."
   - Historical Date: "1066-10-14"

7. **The Printing Press**
   - Subtitle: "Mainz, 1440"
   - Location: "Mainz"
   - Description: "Gutenberg unveils an invention that will change the world."
   - Historical Date: "1440-01-01"

### 3. Additional Endpoints (Optional but Recommended)

**Get Scenario by ID:**
```
GET /scenarios/:id
```
Returns a specific scenario by its ID.

**List All Scenarios:**
```
GET /scenarios
```
Returns all available scenarios (for admin/testing purposes).

**Response includes:**
- Pagination support (limit/offset or cursor-based)
- Total count
- Array of scenario objects

### 4. Error Handling

All endpoints should return appropriate HTTP status codes:

**Success:**
- `200 OK` - Successful request

**Client Errors:**
- `404 Not Found` - Scenario not found
- `400 Bad Request` - Invalid request parameters

**Server Errors:**
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Database connection issues

**Error Response Format:**
```json
{
  "error": {
    "code": "SCENARIO_NOT_FOUND",
    "message": "The requested scenario could not be found",
    "timestamp": "2024-10-14T12:00:00Z"
  }
}
```

### 5. Technical Requirements

**Performance:**
- Response time: < 200ms for scenario retrieval
- Support for 1000+ concurrent users
- Implement caching for "Scenario of the Day" (cache expires at midnight UTC)

**Security:**
- CORS enabled for mobile app domain
- Rate limiting: 100 requests per minute per IP
- Input validation and sanitization
- HTTPS only in production

**Database:**
- Use PostgreSQL, MySQL, MongoDB, or similar
- Include indexes on frequently queried fields (id, date)
- Support for future expansion (user progress, choices, etc.)

**Infrastructure:**
- Environment variables for configuration
- Logging (requests, errors, performance metrics)
- Health check endpoint: `GET /health`

### 6. Data Schema Considerations

**Scenario Model:**
```typescript
interface Scenario {
  id: string;                 // Unique identifier
  title: string;              // Display title (may include \n for line breaks)
  subtitle: string;           // Location and year
  location: string;           // Geographic location
  description: string;        // Brief description
  imageUrl: string;           // Full URL to scenario image
  date: string;               // Historical date (ISO 8601)
  createdAt?: Date;           // When scenario was added to DB
  updatedAt?: Date;           // Last modification
  isActive?: boolean;         // For soft deletes/deactivation
  metadata?: {                // Optional additional data
    era: string;              // e.g., "Ancient Rome", "Modern Era"
    difficulty: string;       // e.g., "Easy", "Medium", "Hard"
    estimatedDuration: number; // Minutes to complete
    tags: string[];           // ["revolution", "war", "politics"]
  }
}
```

### 7. Image Handling

**Options:**
1. **CDN/Cloud Storage:** Store images in AWS S3, Cloudinary, or similar
2. **Return URLs:** API returns full URLs to images
3. **Image Sizes:** Provide multiple sizes for mobile optimization:
   - Thumbnail: 400x400
   - Standard: 800x800
   - HD: 1200x1200

**Image Response Format:**
```json
{
  "imageUrl": "https://cdn.historyrelived.com/scenarios/bastille.jpg",
  "imageSizes": {
    "thumbnail": "https://cdn.historyrelived.com/scenarios/bastille-thumb.jpg",
    "standard": "https://cdn.historyrelived.com/scenarios/bastille-standard.jpg",
    "hd": "https://cdn.historyrelived.com/scenarios/bastille-hd.jpg"
  }
}
```

### 8. Testing Requirements

**Unit Tests:**
- Scenario selection algorithm (verify deterministic behavior)
- Database queries
- Error handling

**Integration Tests:**
- API endpoint responses
- Database operations
- Cache behavior

**Test Cases to Include:**
1. Same date returns same scenario
2. Different dates may return different scenarios
3. Invalid scenario ID returns 404
4. Cache properly invalidates at midnight
5. Rate limiting works correctly

### 9. Documentation

Provide:
- OpenAPI/Swagger documentation
- README with setup instructions
- API usage examples
- Deployment guide

### 10. Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/echoesoftime
DATABASE_POOL_SIZE=10

# CORS
ALLOWED_ORIGINS=https://app.echoesoftime.com,exp://192.168.1.1:8081

# CDN/Storage
IMAGE_CDN_URL=https://cdn.echoesoftime.com
AWS_S3_BUCKET=echoesoftime-images
AWS_REGION=us-east-1

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Caching
REDIS_URL=redis://localhost:6379
CACHE_TTL_SECONDS=86400
```

## Implementation Priority

### Phase 1 (MVP):
1. ✅ Set up basic server (Express/Fastify/NestJS)
2. ✅ Database setup with Scenario model
3. ✅ Seed database with 7 scenarios
4. ✅ Implement `GET /scenarios/today` with deterministic selection
5. ✅ Basic error handling
6. ✅ CORS configuration

### Phase 2 (Enhanced):
1. Add caching layer (Redis)
2. Implement `GET /scenarios/:id`
3. Implement `GET /scenarios` (list all)
4. Add comprehensive logging
5. Set up rate limiting
6. Deploy to production

### Phase 3 (Advanced):
1. Add image upload/management
2. Admin panel for managing scenarios
3. Analytics tracking
4. User progress tracking (future feature)
5. Multi-language support

## Success Criteria

✅ API returns consistent scenario for same date across all requests
✅ Response time < 200ms
✅ Properly handles errors with meaningful messages
✅ CORS configured for mobile app
✅ Documentation complete and clear
✅ Tests passing with >80% coverage
✅ Can handle 1000+ concurrent users

## Mobile App Integration

The mobile app is configured to use the API via the `EXPO_PUBLIC_API_URL` environment variable. Once your API is deployed:

1. The app will call `${EXPO_PUBLIC_API_URL}/scenarios/today`
2. Expected response matches the TypeScript interface above
3. App handles loading states and errors gracefully
4. Retry logic is built into the mobile app

## Questions to Consider

1. **Tech Stack:** What framework/language will you use? (Node.js/Express, Python/FastAPI, Go, etc.)
2. **Database:** Which database fits your infrastructure? (PostgreSQL recommended)
3. **Hosting:** Where will you deploy? (AWS, Heroku, Vercel, Railway, etc.)
4. **Images:** How will you store and serve images? (S3, Cloudinary, etc.)
5. **Monitoring:** What tools for logging/monitoring? (Datadog, New Relic, etc.)

---

**Ready to build?** Use this specification to implement the backend API that will power the Echoes of Time mobile app!

