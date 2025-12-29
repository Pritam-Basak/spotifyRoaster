import { User, Music2, Sparkles } from 'lucide-react';

const UserCard = ({ user }) => {
  return (
    <div className="group glass-card rounded-2xl p-4 md:p-5 hover-lift hover-glow cursor-pointer">
      <div className="flex items-center gap-3 md:gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 md:w-18 md:h-18 rounded-full overflow-hidden ring-3 ring-primary/20 group-hover:ring-primary transition-all duration-200 bg-gradient-to-br from-primary/15 to-accent/15">
            {user.image_url ? (
              <img
                src={user.image_url}
                alt={user.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-fire-orange to-fire-red flex items-center justify-center shadow-md">
            <Music2 className="w-3.5 h-3.5 text-foreground" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground text-base md:text-lg truncate group-hover:text-primary transition-colors">
            {user.display_name || 'Music Lover'}
          </h4>
          <p className="text-muted-foreground text-xs truncate opacity-70">
            {user.email?.split('@')[0] || 'Anonymous'}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {user.top_artist && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-xs text-foreground">
                <Sparkles className="w-3 h-3 text-primary" />
                {user.top_artist}
              </span>
            )}
            {user.top_track && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-xs text-foreground">
                <Music2 className="w-3 h-3 text-accent" />
                {user.top_track}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
