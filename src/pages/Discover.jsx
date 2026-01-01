import { useState, useEffect } from 'react';
import { Compass, TrendingUp, Star, Search, Filter, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import SectionHeader from '../components/SectionHeader';
import UserCard from '../components/UserCard';
import ArtistCard from '../components/ArtistCard';
import TrackCard from '../components/TrackCard';
import { musicApi, authApi } from '../services/api';

const Discover = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const tabs = [
    { id: 'users', label: 'People', icon: Compass },
    { id: 'artists', label: 'Top Artists', icon: Star },
    { id: 'tracks', label: 'Top Tracks', icon: TrendingUp },
  ];

  // Fetch data on component mount
  useEffect(() => {
    const fetchDiscoverData = async () => {
      try {
        setIsLoading(true);

        // Fetch data with individual error handling
        const fetchUsers = musicApi.getDiscoverUsers()
          .then(data => data?.data || data || [])
          .catch(error => {
            console.warn('Users data not available:', error);
            return [];
          });

        const fetchArtists = musicApi.getTopArtists()
          .then(data => data || [])
          .catch(error => {
            console.warn('Artists data not available:', error);
            return [];
          });

        const fetchTracks = musicApi.getTopTracks()
          .then(data => data || [])
          .catch(error => {
            console.warn('Tracks data not available:', error);
            return [];
          });

        const [usersData, artistsData, tracksData] = await Promise.all([
          fetchUsers,
          fetchArtists,
          fetchTracks,
        ]);

        console.log('Users data:', usersData);
        console.log('Artists data:', artistsData);
        console.log('Tracks data:', tracksData);

        setUsers(usersData);
        setArtists(artistsData);
        setTracks(tracksData);

      } catch (error) {
        console.error('Error fetching discover data:', error);

        toast({
          title: "Error loading discover data",
          description: error.message || "Failed to load discover data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscoverData();
  }, [toast]);

  // Filter data based on search query
  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    if (!searchQuery) return true; // Show all if no search query
    return user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
  }) : [];

  console.log('Raw users:', users);
  console.log('Search query:', searchQuery);
  console.log('Filtered users:', filteredUsers);

  const filteredArtists = Array.isArray(artists) ? artists.filter(artist => {
    if (!searchQuery) return true;
    return artist.name?.toLowerCase().includes(searchQuery.toLowerCase());
  }) : [];

  const filteredTracks = Array.isArray(tracks) ? tracks.filter(track => {
    if (!searchQuery) return true;
    return track.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist?.toLowerCase().includes(searchQuery.toLowerCase());
  }) : [];

  console.log('Filtered users count:', filteredUsers.length);
  console.log('Filtered artists count:', filteredArtists.length);
  console.log('Filtered tracks count:', filteredTracks.length);

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <section className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            Discover <span className="text-gradient">Music Taste</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Explore what others are listening to and find new music inspiration
          </p>
        </section>

        {/* Search Bar */}
        <section className="mb-8 animate-slide-up">
          <div className="glass-card rounded-2xl p-4 max-w-xl mx-auto">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search people, artists, or tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
              <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                <Filter className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="mb-8 animate-slide-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="flex justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <section className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading discover content...</p>
          </section>
        )}

        {/* Content */}
        {!isLoading && (
          <section className="animate-slide-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <SectionHeader
                  title="Music Enthusiasts"
                  subtitle="Discover people with interesting taste"
                  icon={Compass}
                />
                {filteredUsers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUsers.slice(0, 12).map((user, index) => (
                      <div
                        key={user.spotify_user_id || user.id || index}
                        className={`animate-scale-in opacity-0`}
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          animationFillMode: 'forwards'
                        }}
                      >
                        <UserCard user={user} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No users found matching your search</p>
                  </div>
                )}
              </div>
            )}

            {/* Artists Tab */}
            {activeTab === 'artists' && (
              <div>
                <SectionHeader
                  title="Popular Artists"
                  subtitle="Most streamed artists right now"
                  icon={Star}
                />
                {filteredArtists.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {filteredArtists.map((artist, index) => (
                      <div
                        key={`${artist.name}-${index}`}
                        className={`animate-scale-in opacity-0`}
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          animationFillMode: 'forwards'
                        }}
                      >
                        <ArtistCard artist={artist} rank={index + 1} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No artists found matching your search</p>
                  </div>
                )}
              </div>
            )}

            {/* Tracks Tab */}
            {activeTab === 'tracks' && (
              <div>
                <SectionHeader
                  title="Trending Tracks"
                  subtitle="Most popular tracks this week"
                  icon={TrendingUp}
                />
                {filteredTracks.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {filteredTracks.map((track, index) => (
                      <div
                        key={`${track.id}-${index}`}
                        className={`animate-scale-in opacity-0`}
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          animationFillMode: 'forwards'
                        }}
                      >
                        <TrackCard track={track} index={index + 1} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No tracks found matching your search</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Decorative elements */}
        <div className="fixed top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-1/4 right-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};

export default Discover;
