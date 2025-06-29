
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
      glass-card
      flex items-center justify-center 
      ${animated ? 'animate-bounce-subtle' : ''}
      ${className}
    `}>
      <svg
        width={iconSize[size]}
        height={iconSize[size]}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-smartflytt-600"
      >
        {/* Robot head */}
        <rect x="6" y="8" width="20" height="16" rx="4" fill="currentColor" className="opacity-90"/>
        
        {/* Eyes */}
        <circle cx="12" cy="14" r="2" fill="white"/>
        <circle cx="20" cy="14" r="2" fill="white"/>
        <circle cx="12" cy="14" r="1" fill="currentColor"/>
        <circle cx="20" cy="14" r="1" fill="currentColor"/>
        
        {/* Mouth */}
        <rect x="14" y="18" width="4" height="2" rx="1" fill="white"/>
        
        {/* Antenna */}
        <line x1="16" y1="8" x2="16" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="16" cy="4" r="1.5" fill="currentColor"/>
        
        {/* Body indicator */}
        <rect x="12" y="24" width="8" height="4" rx="2" fill="currentColor" className="opacity-60"/>
      </svg>
    </div>
  );
};
