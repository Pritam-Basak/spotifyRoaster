import { useState, useEffect } from 'react';
import { Music, Sparkles, Zap, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import RoastButton from '../components/RoastButton';
import RoastCard from '../components/RoastCard';
import { musicApi, authApi } from '../services/api';

const Index = () => {
  const [currentRoast, setCurrentRoast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRoasted, setHasRoasted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roastCount, setRoastCount] = useState(0);
  const { toast } = useToast();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authApi.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const generateRoast = async () => {
    // Check if authenticated
    if (!isAuthenticated) {
      authApi.login();
      return;
    }

    // Check if user has reached roast limit
    if (roastCount >= 2) {
      toast({
        title: "Roast Limit Hit",
        description: "You can only generate 2 roasts per hour. Come back later! 🔥",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCurrentRoast(null);

    try {
      const response = await musicApi.generateRoast();
      setCurrentRoast(response.text);
      setHasRoasted(true);
      setRoastCount(prev => prev + 1);

      toast({
        title: "Roast Generated! 🔥",
        description: `${2 - roastCount - 1} roasts remaining this hour`,
      });
    } catch (error) {
      console.error('Roast error:', error);

      // Check if it's a rate limit error
      if (error.data?.error?.includes('Roast limit')) {
        toast({
          title: "Roast Limit Hit",
          description: "Reflect on your music choices. Come back in an hour! 🔥",
          variant: "destructive",
        });
      } else if (error.status === 401) {
        // User not authenticated
        setIsAuthenticated(false);
        authApi.login();
        toast({
          title: "Please log in",
          description: "You need to be logged in to generate roasts",
          variant: "destructive",
        });
      } else {
        // Generic error (likely Gemini quota)
        toast({
          title: "Can't generate roast right now",
          description: error.message || "Our roasting AI is taking a break. Try again later!",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Roasts",
      description: "Our AI analyzes your listening habits to craft personalized, hilarious roasts"
    },
    {
      icon: Music,
      title: "Deep Analysis",
      description: "We look at your top tracks, artists, and those embarrassing 3am sessions"
    },
    {
      icon: Users,
      title: "Share & Compare",
      description: "See how your music taste stacks up against friends and the community"
    }
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 px-4">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
        {/* Animated badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>Get brutally honest about your music taste</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-6 animate-slide-up">
          Let's{' '}
          <span className="text-gradient">Roast</span>
          {' '}Your
          <br />
          Music Taste
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
          Connect your Spotify account and discover what your playlist says about you.
          Warning: The truth might hurt. 🔥
        </p>

        {/* Roast Button */}
        <div className="animate-slide-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <RoastButton onClick={generateRoast} isLoading={isLoading} />
        </div>
      </section>

      {/* Roast Result */}
      {(currentRoast || isLoading) && (
        <section className="max-w-4xl mx-auto mb-16 md:mb-24 px-4">
          {currentRoast ? (
            <RoastCard roast={currentRoast} onNewRoast={generateRoast} />
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="animate-bounce-slow">
                <Music className="w-16 h-16 text-primary mx-auto mb-4" />
              </div>
              <p className="text-muted-foreground text-lg">
                Analyzing your questionable music choices...
              </p>
            </div>
          )}
        </section>
      )}

      {/* Features Section */}
      {!hasRoasted && (
        <section className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`glass-card rounded-2xl p-6 hover-lift animate-slide-up opacity-0 stagger-${index + 3}`}
                style={{ animationFillMode: 'forwards' }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Floating decorative elements */}
      <div className="fixed top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default Index;
