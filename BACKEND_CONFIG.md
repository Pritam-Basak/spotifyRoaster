# Backend Configuration

This file documents the expected backend setup and endpoints that the frontend uses.

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Backend Endpoints Expected

### Authentication Endpoints

**`GET /user/login`**
- Initiates Spotify OAuth flow
- Redirects to Spotify login page
- Sets authentication cookies after OAuth callback
- Finally redirects to frontend root (/)

**`GET /user/me`**
- Returns current authenticated user information
- Response format:
```json
{
  "id": "spotify_user_id",
  "display_name": "User Display Name",
  "email": "user@example.com",
  "image_url": "https://url-to-profile-image.jpg"
}
```

**`GET /user/logout`**
- Clears authentication cookies
- Response format:
```json
{
  "status": 200,
  "success": true,
  "message": "logged out successfully"
}
```

### Music Data Endpoints

**`GET /api/v1/top-tracks`**
- Returns user's top tracks
- Response format (array):
```json
[
  {
    "name": "Track Name",
    "id": "track_id",
    "artist": "Artist Name",
    "popularity": 75,
    "explicit": false,
    "album_img": "https://url-to-album-art.jpg",
    "time_ms": 180000
  }
]
```

**`GET /api/v1/top-artists`**
- Returns user's top artists
- Response format (array):
```json
[
  {
    "name": "Artist Name",
    "genres": ["genre1", "genre2"],
    "popularity": 85,
    "profile_img": "https://url-to-artist-image.jpg",
    "followers": 1000000
  }
]
```

**`GET /api/v1/recently-played`**
- Returns recently played tracks
- Response format (array):
```json
[
  {
    "name": "Track Name",
    "id": "track_id",
    "artist": "Artist Name",
    "played_at": "2024-01-15T10:30:00Z",
    "album_img": "https://url-to-album-art.jpg",
    "time_ms": 180000
  }
]
```

### Roasting Endpoint

**`POST /api/v1/generate-roast`**
- Generates an AI roast of user's music taste
- Requires: `authenticate` middleware (checks cookies)
- Requires: `roasterLimit` middleware (max 2 roasts per hour)
- Response format:
```json
{
  "status": 200,
  "success": true,
  "text": "Your roast text here..."
}
```

**Error Response (Rate Limit):**
```json
{
  "success": false,
  "error": "Roast limit hit. Reflect on your music choices."
}
```

**Error Response (Gemini Quota):**
```json
{
  "success": false,
  "error": "Gemini quota exceeded"
}
```

## Middleware Requirements

- **authenticate**: Check if user has valid authentication cookies
  - Should return 401 if not authenticated
  
- **roasterLimit**: Rate limit roasts per user
  - Max 2 roasts per hour per Spotify user ID
  - Should return 429 or include error in response if limit hit

## MongoDB Schema

User schema for storing profile data:

```javascript
const userSchema = new mongoose.Schema({
  spotify_user_id: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  display_name: { type: String },
  email: { type: String },
  top_artist: { type: String },
  top_track: { type: String },
  image_url: { type: String }
}, { timestamps: true });
```

## CORS Configuration

The frontend expects the backend to allow CORS requests with credentials:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

## Cookie Configuration

Authentication cookies should be set with:
- `httpOnly: true` (prevent JS access)
- `secure: true` (HTTPS only in production)
- `sameSite: 'lax'`
- Accessible across all API endpoints

Example:
```javascript
res.cookie('access_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```
