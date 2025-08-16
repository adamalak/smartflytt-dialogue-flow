
import React from 'react';

interface BotAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const BotAvatar: React.FC<BotAvatarProps> = ({ 
  size = 'md', 
  animated = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSize = {
    sm: 20,
    md: 28,
    lg: 36
  };

  return (
    <div className={`
      ${sizeClasses[size]} 
      glass-card relative overflow-hidden
      flex items-center justify-center 
      ${animated ? 'animate-bounce-subtle' : ''}
      hover:shadow-glow transition-all duration-300
      ${className}
    `}
    style={{
      background: 'var(--gradient-glass)',
      borderImage: 'var(--gradient-border) 1'
    }}>
      <div className="absolute inset-0 bg-gradient-to-br from-smartflytt-400/20 via-transparent to-smartflytt-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      <svg
        width={iconSize[size]}
        height={iconSize[size]}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-smartflytt-600 relative z-10 transition-transform duration-200 hover:scale-105"
      >
        {/* Robot head with enhanced styling */}
        <rect x="6" y="8" width="20" height="16" rx="4" fill="currentColor" className="opacity-90"/>
        <rect x="6" y="8" width="20" height="16" rx="4" fill="url(#robotGradient)" className="opacity-20"/>
        
        {/* Eyes with animation */}
        <circle cx="12" cy="14" r="2" fill="white" className="animate-pulse"/>
        <circle cx="20" cy="14" r="2" fill="white" className="animate-pulse"/>
        <circle cx="12" cy="14" r="1" fill="currentColor"/>
        <circle cx="20" cy="14" r="1" fill="currentColor"/>
        
        {/* Mouth */}
        <rect x="14" y="18" width="4" height="2" rx="1" fill="white"/>
        
        {/* Antenna with glow */}
        <line x1="16" y1="8" x2="16" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="16" cy="4" r="1.5" fill="currentColor" className="animate-pulse"/>
        
        {/* Body indicator */}
        <rect x="12" y="24" width="8" height="4" rx="2" fill="currentColor" className="opacity-60"/>
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="white" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
