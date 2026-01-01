import { useState, useEffect } from 'react';
import { Compass, Search, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import SectionHeader from '../components/SectionHeader';
import UserCard from '../components/UserCard';
import { musicApi } from '../services/api';

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch data on component mount
  useEffect(() => {
    const fetchDiscoverData = async () => {
      try {
        setIsLoading(true);

        // Fetch all users from database
        const usersData = await musicApi.getDiscoverUsers();

        console.log('Users data:', usersData);

        // Extract array from response (backend may return {status, success, data})
        setUsers(usersData?.data || usersData || []);

      } catch (error) {
        console.error('Error fetching users data:', error);

        // Set empty array on error but don't show error toast
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscoverData();
  }, [toast]);

  // Filter users based on search query
  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    if (!searchQuery) return true; // Show all if no search query
    return user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.top_artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.top_track?.toLowerCase().includes(searchQuery.toLowerCase());
  }) : [];

  console.log('Raw users:', users);
  console.log('Search query:', searchQuery);
  console.log('Filtered users:', filteredUsers);

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
                placeholder="Search by name, email, artist, or track..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <section className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading users...</p>
          </section>
        )}

        {/* Users Content */}
        {!isLoading && (
          <section className="animate-slide-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <SectionHeader
              title="Music Enthusiasts"
              subtitle="Discover people with interesting music taste"
              icon={Compass}
            />
            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user, index) => (
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
              <div className="glass-card rounded-2xl p-12 text-center">
                <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg">
                  {searchQuery ? 'No users found matching your search' : 'No users available yet'}
                </p>
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
