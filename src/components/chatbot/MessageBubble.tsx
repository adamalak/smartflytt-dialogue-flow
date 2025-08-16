
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
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} message-enter group`}
      role="listitem"
    >
      {message.type === 'bot' && (
        <BotAvatar size="md" className="mr-3 mt-1 flex-shrink-0 group-hover:animate-bounce-subtle" />
      )}
      
      <div
        className={`max-w-[85%] p-5 rounded-3xl transition-all duration-500 ${
          message.type === 'user'
            ? 'btn-gradient-primary text-white shadow-lg hover:shadow-xl relative overflow-hidden'
            : 'glass-card text-foreground border-2 border-gradient hover:scale-[1.02] hover:shadow-elegant'
        }`}
        style={message.type === 'bot' ? {
          background: 'var(--gradient-glass)',
          borderImage: 'var(--gradient-border) 1'
        } : undefined}
        role={message.type === 'bot' ? 'status' : undefined}
        aria-live={message.type === 'bot' && isLast ? 'polite' : undefined}
      >
        {message.type === 'user' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        )}
        <p className="text-base leading-relaxed whitespace-pre-line font-medium relative z-10">
          {message.content}
        </p>
      </div>
    </div>
  );
};
