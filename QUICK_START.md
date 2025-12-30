# Quick Start Guide

## 1. Setup Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and set your backend URL:

```env
VITE_BACKEND_URL=http://localhost:5000
```

## 2. Install Dependencies

```bash
npm install
# or
bun install
```

## 3. Start Development Server

```bash
npm run dev
# or
bun run dev
```

The app will be available at `http://localhost:5173`

## 4. Ensure Backend is Running

Make sure your backend server is running at the URL specified in `.env`

## 5. Test the Features

### Testing Roast Generation
1. Click "Login with Spotify" in the navbar
2. Complete Spotify authentication
3. Click "Roast My Music Taste" button
4. You should see a roast generated within a few seconds
5. Try generating a second roast (should work)
6. Try generating a third roast within the same hour (should show rate limit error)

### Testing Profile Page
1. After logging in, click "My Profile" in the navbar
2. You should see:
   - Your profile picture and name
   - Recently played tracks
   - Top artists
   - Top tracks
3. Click the logout button to test logout functionality

### Testing Discover Page
1. Click "Discover" in the navbar
2. Browse different tabs:
   - **Top Artists**: Scroll through popular artists
   - **Top Tracks**: Browse trending tracks
3. Use the search bar to filter content
4. Each item animates in with a nice scale effect

## File Structure

```
src/
├── pages/
│   ├── Index.jsx          ← Roast generation page
│   ├── Profile.jsx        ← User profile with data
│   ├── Discover.jsx       ← Discover music content
│   └── NotFound.tsx       ← 404 page
├── components/
│   ├── Navbar.jsx         ← Navigation with login/logout
│   ├── RoastButton.jsx    ← Button to generate roast
│   ├── RoastCard.jsx      ← Display roast text
│   ├── TrackCard.jsx      ← Display track info
│   ├── ArtistCard.jsx     ← Display artist info
│   └── UserCard.jsx       ← Display user info
├── services/
│   └── api.js            ← API client with all endpoints
├── hooks/
│   └── use-toast.ts      ← Toast notifications
└── data/
    └── mockData.js       ← Sample data (now replaced with API)
```

## Key Features Implemented

✅ **Authentication**
- Login with Spotify
- Automatic session management
- Logout functionality

✅ **Roast Generation**
- AI-powered roasts using backend
- Rate limiting (2 per hour)
- Error handling for quota limits

✅ **User Profile**
- Display user info from Spotify
- Recently played tracks
- Top artists
- Top tracks

✅ **Discover**
- Browse top artists
- Browse top tracks
- Search functionality
- Tab-based navigation

✅ **Error Handling**
- Toast notifications
- Rate limit messages
- API error handling
- Authentication redirects

## Troubleshooting

### "Can't connect to backend"
- Ensure backend is running at the URL in `.env`
- Check CORS configuration on backend
- Verify `VITE_BACKEND_URL` is set correctly

### "Login not working"
- Check if backend OAuth configuration is correct
- Verify frontend URL is in Spotify app redirect URIs
- Check browser console for errors

### "No data showing on pages"
- Ensure user is authenticated
- Check network tab for API errors
- Verify backend endpoints return correct format

### "Build errors"
- Run `npm install` to ensure all dependencies are installed
- Check Node version (requires Node 16+)
- Clear node_modules and reinstall if needed

## Performance Tips

- The app uses React Query for data fetching (can be added later for caching)
- Toast notifications are non-blocking
- Images are lazy-loaded where possible
- Animations use CSS transforms for better performance

## Production Build

```bash
npm run build
npm run preview
```

Check the [Vite documentation](https://vitejs.dev) for deployment options.
