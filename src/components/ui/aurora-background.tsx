import React from 'react';

interface AuroraBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Aurora Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Deep Navy Base */}
        <div className="absolute inset-0 bg-aurora-navy"></div>
        
        {/* Flowing Aurora Lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-aurora-indigo/40 to-aurora-purple/20 rounded-full blur-3xl animate-aurora-flow"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-bl from-aurora-cyan/30 to-aurora-green/20 rounded-full blur-3xl animate-aurora-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-tr from-aurora-pink/25 to-aurora-purple/15 rounded-full blur-3xl animate-aurora-flow" style={{ animationDelay: '2s' }}></div>
        
        {/* Subtle Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-aurora-charcoal/10 to-aurora-navy/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-aurora-navy/50 via-transparent to-aurora-navy/50"></div>
        
        {/* Shimmer Effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-aurora-white/5 via-transparent to-aurora-white/5 animate-aurora-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;