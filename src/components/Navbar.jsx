import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Flame, User, Compass, Music, LogOut } from 'lucide-react';
import { authApi } from '../services/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Roast Me', icon: Flame },
    { path: '/profile', label: 'My Profile', icon: User },
    { path: '/discover', label: 'Discover', icon: Compass },
  ];

  const isActive = (path) => location.pathname === path;

  // Check authentication on mount and when location changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authApi.getCurrentUser();
        setIsAuthenticated(true);
        setUserName(user.display_name || 'User');
      } catch (error) {
        setIsAuthenticated(false);
        setUserName('');
      }
    };
    checkAuth();
  }, [location]);

  const handleLogin = () => {
    authApi.login();
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsAuthenticated(false);
      setUserName('');
      setIsOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Music className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
              <Flame className="w-4 h-4 text-fire-orange absolute -top-1 -right-1 animate-bounce-slow" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-gradient">
              Spotify Roaster
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300
                  ${isActive(item.path)
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}

            {/* Auth Buttons */}
            <div className="ml-4 flex items-center gap-2 border-l border-border/30 pl-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground">{userName}</span>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Login with Spotify
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-out
            ${isOpen ? 'max-h-[70vh] pb-4' : 'max-h-0'}
          `}
        >
          <div className="flex flex-col gap-2 pt-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300
                  ${isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="border-t border-border/30 mt-2 pt-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    {userName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogin();
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Login with Spotify
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
