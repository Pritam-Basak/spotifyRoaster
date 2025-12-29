import { useState, useEffect } from 'react';
import { Flame, Share2, RefreshCw } from 'lucide-react';

const RoastCard = ({ roast, onNewRoast }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!roast) return;
    
    setDisplayedText('');
    setIsTyping(true);
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < roast.length) {
        setDisplayedText(roast.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [roast]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Spotify Roast 🔥',
          text: roast,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(roast);
      alert('Roast copied to clipboard! 📋');
    }
  };

  return (
    <div className="animate-scale-in w-full max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl p-6 md:p-8 fire-glow">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-gradient-to-r from-fire-orange to-fire-red">
            <Flame className="w-6 h-6 text-foreground" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gradient">Your Roast</h3>
        </div>

        {/* Roast Text */}
        <div className="min-h-[150px] mb-6">
          <p className="text-lg md:text-xl text-foreground leading-relaxed">
            {displayedText}
            {isTyping && <span className="animate-pulse text-primary">|</span>}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onNewRoast}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            New Roast
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/80 text-primary-foreground font-medium transition-all duration-300 hover:scale-105"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoastCard;
