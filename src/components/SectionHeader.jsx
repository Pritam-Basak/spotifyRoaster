const SectionHeader = ({ title, subtitle, icon: Icon, action }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 rounded-xl bg-primary/10">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground text-sm mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && (
        <button className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">
          {action}
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
