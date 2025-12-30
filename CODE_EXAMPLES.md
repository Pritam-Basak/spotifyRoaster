# Code Examples & References

## API Service Usage

### Making Authenticated API Calls

```javascript
import { musicApi, authApi } from '../services/api';

// Login user
authApi.login(); // Redirects to backend OAuth

// Get current user
const user = await authApi.getCurrentUser();

// Get top tracks
const tracks = await musicApi.getTopTracks();

// Get top artists
const artists = await musicApi.getTopArtists();

// Generate roast
const roast = await musicApi.generateRoast();
console.log(roast.text); // The roast content

// Logout
await authApi.logout();
```

## Error Handling Examples

### Handling Rate Limit Errors

```javascript
try {
  const roast = await musicApi.generateRoast();
} catch (error) {
  if (error.data?.error?.includes('Roast limit')) {
    toast({
      title: "Roast Limit Hit",
      description: "You can only generate 2 roasts per hour",
      variant: "destructive",
    });
  }
}
```

### Handling Authentication Errors

```javascript
try {
  const data = await musicApi.getTopTracks();
} catch (error) {
  if (error.status === 401) {
    // User not authenticated
    authApi.login(); // Redirect to login
    toast({
      title: "Please log in",
      description: "You need to be logged in to view this",
      variant: "destructive",
    });
  }
}
```

### Handling Generic Errors

```javascript
try {
  const roast = await musicApi.generateRoast();
} catch (error) {
  console.error('Error:', error);
  toast({
    title: "Error",
    description: error.message || "Something went wrong",
    variant: "destructive",
  });
}
```

## Component Examples

### Using Toast Notifications

```javascript
import { useToast } from '../hooks/use-toast';

function MyComponent() {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "Success!",
      description: "Operation completed",
    });
    
    // Error toast
    toast({
      title: "Error",
      description: "Something went wrong",
      variant: "destructive",
    });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### Fetching Data with Loading State

```javascript
import { useState, useEffect } from 'react';
import { musicApi } from '../services/api';

function ProfileComponent() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const tracks = await musicApi.getTopTracks();
        setData(tracks);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {data?.map(track => (
        <div key={track.id}>{track.name}</div>
      ))}
    </div>
  );
}
```

### Checking Authentication

```javascript
import { useEffect, useState } from 'react';
import { authApi } from '../services/api';

function ProtectedComponent() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authApi.getCurrentUser();
        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
        authApi.login(); // Redirect to login
      }
    };

    checkAuth();
  }, []);

  if (!isAuth) return null;
  
  return <div>Protected Content</div>;
}
```

## Response Format Examples

### User Response
```json
{
  "id": "123456789",
  "display_name": "John Doe",
  "email": "john@example.com",
  "image_url": "https://i.scdn.co/image/abc123"
}
```

### Top Tracks Response
```json
[
  {
    "name": "Song Name",
    "id": "track_123",
    "artist": "Artist Name",
    "popularity": 85,
    "explicit": false,
    "album_img": "https://i.scdn.co/image/abc123",
    "time_ms": 240000
  }
]
```

### Top Artists Response
```json
[
  {
    "name": "Artist Name",
    "genres": ["rock", "indie"],
    "popularity": 82,
    "profile_img": "https://i.scdn.co/image/abc123",
    "followers": 1000000
  }
]
```

### Roast Response
```json
{
  "status": 200,
  "success": true,
  "text": "Your playlist is basically a cry for help disguised as music taste..."
}
```

### Error Response
```json
{
  "success": false,
  "error": "Roast limit hit. Reflect on your music choices."
}
```

## Environment Variables

### `.env` File
```env
# Backend API URL (adjust based on your setup)
VITE_BACKEND_URL=http://localhost:5000

# For production
# VITE_BACKEND_URL=https://api.yourdomain.com
```

## Common Issues & Solutions

### Issue: "CORS error when calling API"

**Solution:** Ensure backend has CORS enabled:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: "Not authenticated" on protected pages

**Solution:** Make sure user completes Spotify login flow:
```javascript
authApi.login(); // Redirects to backend OAuth endpoint
```

### Issue: "No data showing on Profile page"

**Solution:** Check API responses match expected format:
```javascript
// Backend should return array or object with correct fields
GET /api/v1/top-tracks → returns array of tracks
GET /api/v1/top-artists → returns array of artists
GET /user/me → returns user object
```

### Issue: "Toast notifications not showing"

**Solution:** Make sure toast hook is imported and used correctly:
```javascript
import { useToast } from '@/hooks/use-toast';

function Component() {
  const { toast } = useToast();
  
  // Use within component
  toast({ title: "Hello" });
}
```

## Debugging Tips

### 1. Check Network Requests
Open DevTools → Network tab → Filter by XHR/Fetch to see all API calls

### 2. Log API Responses
```javascript
const response = await musicApi.getTopTracks();
console.log('Top tracks:', response);
```

### 3. Check Authentication Status
In browser console:
```javascript
import { authApi } from './src/services/api';
authApi.getCurrentUser().then(console.log).catch(console.error);
```

### 4. Monitor Cookies
DevTools → Application → Cookies → Check for `access_token` and `refresh_token`

### 5. Check Environment Variables
```javascript
console.log(import.meta.env.VITE_BACKEND_URL);
```

## Performance Optimization Tips

1. **Use React Query** (optional) for automatic caching:
```javascript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['topTracks'],
  queryFn: () => musicApi.getTopTracks()
});
```

2. **Lazy load components** that aren't immediately visible

3. **Memoize expensive components**:
```javascript
import { memo } from 'react';

const TrackCard = memo(({ track }) => (
  <div>{track.name}</div>
));
```

4. **Optimize images** - request appropriately sized images from Spotify
