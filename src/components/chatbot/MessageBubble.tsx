
import React from 'react';
import { ChatMessage } from '@/types/chatbot';
import { BotAvatar } from './BotAvatar';

interface MessageBubbleProps {
  message: ChatMessage;
  isLast: boolean;
  onQuickReply?: (value: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isLast, 
  onQuickReply 
}) => {
  return (
    <div 
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} message-enter`}
      role="listitem"
    >
      {message.type === 'bot' && (
        <BotAvatar size="md" className="mr-3 mt-1 flex-shrink-0" />
      )}
      
      <div
        className={`max-w-[85%] p-5 rounded-2xl transition-all duration-300 ${
          message.type === 'user'
            ? 'btn-gradient-primary text-white shadow-lg'
            : 'glass-card glass-dark text-gray-800 dark:text-gray-100 border border-smartflytt-100/50 dark:border-gray-700/50'
        }`}
        role={message.type === 'bot' ? 'status' : undefined}
        aria-live={message.type === 'bot' && isLast ? 'polite' : undefined}
      >
        <p className="text-base leading-relaxed whitespace-pre-line font-medium">
          {message.content}
        </p>
      </div>
    </div>
  );
};
