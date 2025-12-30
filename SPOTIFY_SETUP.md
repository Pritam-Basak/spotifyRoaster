# Spotify Login Setup Instructions (Backend Integration)

## Backend Configuration

Your backend handles all Spotify OAuth, so the frontend simply needs to:
1. Redirect users to `{BACKEND_URL}/user/login` for authentication
2. Receive authentication cookies from the backend
3. Make authenticated requests with `credentials: 'include'`

## How It Works

1. User clicks any buttons and gets 404 not found error Frontend redirects to `{BACKEND_URL}/user/login`
2. Backend handles Spotify OAuth flow and redirects to `{FRONTEND_URL}/` with access & refresh token cookies
3. redirect user to button he clicked or perform the task user wants do do
6. Frontend makes authenticated API calls with cookies

## Backend Endpoints Expected

The frontend expects these endpoints from your backend:

- `GET /user/login` - Initiates Spotify OAuth return access and refresh token cookie then redirects to root of frontend url.
- `GET /user/me` - Returns current user json.  

``` 
response = {
    id: userData.id,
    display_name: userData.display_name,
    email: userData.email,
    image_url: userData.images?.[0]?.url || null
}
```

- `GET /user/logout` - Clears auth cookies
```
res.clearCookie("access_token", options)
    .clearCookie("refresh_token", options)
    .status(200)
    .json({
        status: 200,
        success: true,
        message: "logged out successfully"
    })
    .redirect(process.env.APP_URL);
```
- `GET /api/v1/top-tracks` - Returns user's top tracks array
```
response_array = [{
    name: t.name,
    id: t.id,
    artist: t.artists[0].name,
    popularity: t.popularity,
    explicit: t.explicit,
    album_img: t.album.images[2]?.url || null,
    time_ms: t.duration_ms,
}]
```
- `GET /api/v1/top-artists` - Returns user's top artists array
```
    response_array = [{name: a.name,
    genres: a.genres,
    popularity: a.popularity,
    profile_img: a.images[2]?.url || null,
    followers: a.followers.total,}]
```
- `GET /api/v1/recently-played` - Returns recently played tracks array
```
    response_array = [{name: i.track.name,
    id: i.track.id,
    artist: i.track.artists[0].name,
    played_at: i.played_at,
    album_img: i.track.album.images[2]?.url || null,
    time_ms: i.track.duration_ms,}]
```

- `POST /api/v1/generate-roast`. user two middlewares authinticate user and roasterLimit which allows each spotify user to genarate 2 roastes in 1 hour
example fetch:
```
response = {
    status: 200,
    success: true,
    text: roasting text
}
```

### using mongodb atlas to store user data
- userSchema = const userSchema = new mongoose.Schema({
    spotify_user_id: { type: String, required: true, unique: true, index: true },
    display_name: { type: String },
    email: { type: String },
    top_artist: { type: String },
    top_track: { type: String },
    image_url: { type: String }
}, { timestamps: true });

### changes you need to do 
- in index page if user clicks roast my music taste, fetch `POST /api/v1/generate-roast` and show response.text on the Roast Card. make sure user does not make more than 2 roast my music taste. toast error if he gets error on getting error from rate limit middleware that i used in backend. show can't genarate right now if got any error while calling generate-roast api as i am using free quota of gemini to generate roast.
- in profile page get User data from `GET /user/me`. Don't need to show numbers of follower, followings, playlist of that user. Get recently played tracks from `GET /api/v1/recently-played`,
top artist data from `GET /api/v1/top-artists` and top tracks from `GET /api/v1/top-tracks`.
- in discover page get data from mongodb data base

### errors you might get:
- gemini qouta end error
- per user and ip 2 roastes per hour if reached message: {
        success: false,
        error: "Roast limit hit. Reflect on your music choices."
    }

