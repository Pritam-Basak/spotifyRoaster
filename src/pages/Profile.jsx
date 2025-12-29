import { useState, useEffect } from 'react';
import { Clock, TrendingUp, Star, Music2, Settings, LogOut } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import SectionHeader from '../components/SectionHeader';
import TrackCard from '../components/TrackCard';
import ArtistCard from '../components/ArtistCard';
import { musicApi, authApi } from '../services/api';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // Fetch all user data in parallel
        const [userResponse, recentResponse, artistsResponse, tracksResponse] = await Promise.all([
          authApi.getCurrentUser(),
          musicApi.getRecentlyPlayed(),
          musicApi.getTopArtists(),
          musicApi.getTopTracks(),
        ]);

        setCurrentUser(userResponse);
        setRecentlyPlayed(recentResponse);
        setTopArtists(artistsResponse);
        setTopTracks(tracksResponse);
      } catch (error) {
        console.error('Error fetching profile data:', error);

        if (error.status === 401) {
          toast({
            title: "Please log in",
            description: "You need to be logged in to view your profile",
            variant: "destructive",
          });
          authApi.login();
        } else {
          toast({
            title: "Error loading profile",
            description: error.message || "Failed to load your profile data",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      // Redirect to home or reload
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error logging out",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 md:pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <Music2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen pt-20 md:pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Unable to load profile</p>
          <button
            onClick={() => authApi.login()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Log in again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <section className="glass-card rounded-3xl p-6 md:p-10 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-primary/50 group-hover:ring-primary transition-all duration-300 spotify-glow bg-gradient-to-br from-primary/20 to-accent/20">
                {currentUser.image_url ? (
                  <img
                    src={currentUser.image_url}
                    alt={currentUser.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music2 className="w-16 h-16 text-primary" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Music2 className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
                {currentUser.display_name || 'User'}
              </h1>
              <p className="text-muted-foreground text-lg mb-4">
                {currentUser.email || '@user'}
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors tooltip"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* Recent Tracks */}
        {recentlyPlayed.length > 0 && (
          <section className="mb-10 animate-slide-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <SectionHeader
              title="Recently Played"
              subtitle="Your latest listening activity"
              icon={Clock}
              action="See All"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {recentlyPlayed.slice(0, 6).map((track, index) => (
                <TrackCard
                  key={`${track.id}-${index}`}
                  track={track}
                  index={index + 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* Top Artists */}
        {topArtists.length > 0 && (
          <section className="mb-10 animate-slide-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <SectionHeader
              title="Top Artists"
              subtitle="Your most played artists this month"
              icon={Star}
              action="See All"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {topArtists.slice(0, 6).map((artist, index) => (
                <div key={`${artist.name}-${index}`} className="relative">
                  <ArtistCard artist={artist} rank={index + 1} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Top Tracks */}
        {topTracks.length > 0 && (
          <section className="animate-slide-up stagger-3 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <SectionHeader
              title="Top Tracks"
              subtitle="Songs you can't stop playing"
              icon={TrendingUp}
              action="See All"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {topTracks.slice(0, 6).map((track, index) => (
                <TrackCard
                  key={`${track.id}-${index}`}
                  track={track}
                  index={index + 1}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Decorative elements */}
      <div className="fixed top-1/3 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default Profile;
