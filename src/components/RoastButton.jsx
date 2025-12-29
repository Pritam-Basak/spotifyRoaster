import { useState } from 'react';
import { Flame, Loader2 } from 'lucide-react';

const RoastButton = ({ onClick, isLoading }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group px-8 py-4 md:px-12 md:py-6 rounded-full font-bold text-lg md:text-xl
        bg-gradient-to-r from-fire-orange to-fire-red text-foreground
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-2xl
        disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
        ${isLoading ? '' : 'fire-glow'}
      `}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fire-orange to-fire-red opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
      
      {/* Button content */}
      <span className="relative flex items-center gap-3">
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Roasting...
          </>
        ) : (
          <>
            <Flame className={`w-6 h-6 ${isHovered ? 'animate-wiggle' : ''}`} />
            Roast My Music Taste
            <Flame className={`w-6 h-6 ${isHovered ? 'animate-wiggle' : ''}`} />
          </>
        )}
      </span>
    </button>
  );
};

export default RoastButton;
