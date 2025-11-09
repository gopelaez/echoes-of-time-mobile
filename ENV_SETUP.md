# Environment Setup - Echoes of Time Mobile

## API Integration

The mobile app now connects to your real API server!

### Setup Instructions

1. **Create a `.env` file** in the project root:
   ```bash
   touch .env
   ```

2. **Add the following content** to `.env`:
   ```env
   # API Configuration
   # Set this to your API base URL (should include /api)
   
   # For AWS Production Stack
   EXPO_PUBLIC_API_URL=https://b5nrmnjvdb.execute-api.us-east-1.amazonaws.com/api
   
   # For local development (if API is running on localhost:4000)
   # EXPO_PUBLIC_API_URL=http://localhost:4000/api
   ```

3. **Restart the Metro bundler** for changes to take effect:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm start
   ```

### API Configuration

The app connects directly to your real API server. There is no mock mode - it's production-ready from the start!

**Endpoint Used:**
- `${EXPO_PUBLIC_API_URL}/scenarios/today`
- Example: `http://localhost:4000/api/scenarios/today`

**Note:** Mock API implementation files are kept in the repository for reference but are not used by the application.

### Testing the Integration

1. **Start your API server:**
   ```bash
   # In your API project directory
   npm run dev:api
   ```
   Should run on `http://localhost:4000`

2. **Assign a scenario** to today's date:
   ```bash
   curl -X POST http://localhost:4000/api/calendar \
     -H "Content-Type: application/json" \
     -d '{
       "date": "2024-10-15",
       "scenarioId": 28,
       "imageUrl": "https://cdn.example.com/image.jpg"
     }'
   ```
   (Use today's date in YYYY-MM-DD format)

3. **Verify the scenario** is assigned:
   ```bash
   curl http://localhost:4000/api/scenarios/today
   ```

4. **Run the mobile app:**
   ```bash
   npm start
   ```
   The app should now display the scenario from your API!

### Troubleshooting

**Error: "API URL not configured"**
- Make sure `.env` file exists
- Verify `EXPO_PUBLIC_API_URL` is set
- Restart Metro bundler after creating/modifying `.env`

**Error: "No scenario assigned for today"**
- Check that your API has a scenario assigned for today
- Use the admin endpoint to assign one:
  ```bash
  curl -X POST http://localhost:4000/api/calendar \
    -H "Content-Type: application/json" \
    -d '{"date": "YYYY-MM-DD", "scenarioId": 28}'
  ```

**Error: "Failed to fetch"**
- Ensure API server is running on localhost:4000
- Check if the URL in `.env` is correct
- For iOS simulator, use `http://localhost:4000`
- For Android emulator, you might need `http://10.0.2.2:4000`

**Connection refused on physical device:**
- Can't use `localhost` on physical devices
- Use your computer's IP address instead:
  ```env
  EXPO_PUBLIC_API_URL=http://192.168.1.X:4000
  ```
- Find your IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)

### Production Deployment

When deploying to production:

1. **Update `.env` for production:**
   ```env
   EXPO_PUBLIC_API_URL=https://api.historyrelived.com
   ```

2. **Rebuild your app** with production environment variables

3. **Ensure API is accessible** from mobile networks (not just localhost)

### Security Notes

- `.env` file is gitignored (never commit it!)
- All API requests use HTTPS in production
- Rate limiting is handled by the API server
- No authentication required yet (implement API keys in future versions)

---

**Echoes of Time Mobile** - Relive history, shape the future.

