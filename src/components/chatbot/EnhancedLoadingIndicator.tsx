
import React from 'react';
import { BotAvatar } from './BotAvatar';

interface EnhancedLoadingIndicatorProps {
  message?: string;
  showAvatar?: boolean;
}

export const EnhancedLoadingIndicator: React.FC<EnhancedLoadingIndicatorProps> = ({
  message = 'Tänker...',
  showAvatar = true
}) => {
  return (
    <div className="flex items-start space-x-4 animate-fade-in group">
      {showAvatar && (
        <BotAvatar size="md" animated className="mt-1 flex-shrink-0" />
      )}
      
      <div className="glass-card p-5 max-w-sm rounded-3xl relative overflow-hidden"
           style={{
             background: 'var(--gradient-glass)',
             borderImage: 'var(--gradient-border) 1'
           }}>
        <div className="absolute inset-0 bg-gradient-to-r from-smartflytt-400/5 via-transparent to-smartflytt-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="flex items-center space-x-3 relative z-10">
          <div className="text-foreground text-base font-semibold">
            {message}
          </div>
          
          {/* Enhanced animated dots */}
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 bg-smartflytt-600 rounded-full animate-bounce [animation-delay:-0.3s] shadow-glow"></div>
            <div className="w-2.5 h-2.5 bg-smartflytt-500 rounded-full animate-bounce [animation-delay:-0.15s] shadow-glow"></div>
            <div className="w-2.5 h-2.5 bg-smartflytt-400 rounded-full animate-bounce shadow-glow"></div>
          </div>
        </div>
        
        {/* Enhanced shimmer effect */}
        <div className="mt-4 space-y-3 relative z-10">
          <div className="h-2.5 bg-smartflytt-200/30 dark:bg-smartflytt-800/30 rounded-full shimmer"></div>
          <div className="h-2.5 bg-smartflytt-200/30 dark:bg-smartflytt-800/30 rounded-full shimmer w-4/5"></div>
          <div className="h-2.5 bg-smartflytt-200/30 dark:bg-smartflytt-800/30 rounded-full shimmer w-3/5"></div>
        </div>
      </div>
    </div>
  );
};
