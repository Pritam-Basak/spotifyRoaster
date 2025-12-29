import { Music } from 'lucide-react';

const ArtistCard = ({ artist, rank }) => {
  return (
    <div className="group glass-card rounded-2xl p-4 md:p-6 hover-lift hover-glow cursor-pointer text-center">
      {/* Rank Badge */}
      {rank && (
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm shadow-lg">
          #{rank}
        </div>
      )}

      {/* Artist Image */}
      <div className="relative w-20 h-20 md:w-28 md:h-28 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-border group-hover:ring-primary transition-all duration-300">
        <img
          src={artist.profile_img || artist.image || 'https://via.placeholder.com/150'}
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
          <Music className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Artist Info */}
      <h4 className="font-bold text-foreground text-sm md:text-lg mb-1 truncate group-hover:text-primary transition-colors">
        {artist.name}
      </h4>
      <p className="text-muted-foreground text-xs md:text-sm">
        {artist.genre}
      </p>

      {/* Followers */}
      {artist.followers && (
        <p className="text-primary text-xs mt-2 font-medium">
          {artist.followers} followers
        </p>
      )}
    </div>
  );
};

export default ArtistCard;
