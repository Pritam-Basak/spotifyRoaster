import { Play, Clock } from 'lucide-react';

const TrackCard = ({ track, index, showIndex = true }) => {
  // Convert milliseconds to mm:ss format
  const formatDuration = (ms) => {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const duration = track.duration || formatDuration(track.time_ms);

  return (
    <div className="group glass-card rounded-xl p-3 md:p-4 hover-lift cursor-pointer">
      <div className="flex items-center gap-3 md:gap-4">
        {/* Index or Play Button */}
        {showIndex && (
          <div className="w-8 flex-shrink-0 text-center">
            <span className="text-muted-foreground group-hover:hidden font-medium">
              {index}
            </span>
            <Play className="w-5 h-5 text-primary hidden group-hover:block mx-auto" />
          </div>
        )}

        {/* Album Art */}
        <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-md overflow-hidden">
          <img
            src={track.album_img || track.albumArt || 'https://via.placeholder.com/100'}
            alt={track.album || track.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate text-sm md:text-base group-hover:text-primary transition-colors">
            {track.name}
          </h4>
          <p className="text-muted-foreground text-xs md:text-sm truncate">
            {track.artist}
          </p>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1 text-muted-foreground text-sm flex-shrink-0">
          <Clock className="w-3 h-3 hidden md:block" />
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
