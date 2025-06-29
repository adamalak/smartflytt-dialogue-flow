
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
    <div className="flex items-start space-x-4 animate-fade-in">
      {showAvatar && (
        <BotAvatar size="md" animated className="mt-1 flex-shrink-0" />
      )}
      
      <div className="glass-card p-4 max-w-xs">
        <div className="flex items-center space-x-2">
          <div className="text-gray-600 dark:text-gray-300 text-base font-medium">
            {message}
          </div>
          
          {/* Animated dots */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-smartflytt-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-smartflytt-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-smartflytt-600 rounded-full animate-bounce"></div>
          </div>
        </div>
        
        {/* Shimmer effect */}
        <div className="mt-3 space-y-2">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded shimmer w-3/4"></div>
        </div>
      </div>
    </div>
  );
};
