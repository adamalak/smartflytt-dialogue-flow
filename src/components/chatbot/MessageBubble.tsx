
import React from 'react';
import { ChatMessage } from '@/types/chatbot';
import { Button } from '@/components/ui/button';
import { CHATBOT_CONSTANTS } from '@/data/constants';

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
  const handleQuickReply = (value: string) => {
    if (onQuickReply) {
      onQuickReply(value);
    }
  };

  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] p-4 rounded-2xl transition-all duration-300 shadow-md ${
          message.type === 'user'
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-200'
            : 'bg-white text-gray-800 shadow-gray-200 border border-gray-100'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
        
        {message.isQuickReply && message.type === 'bot' && isLast && (
          <div className="mt-4 flex flex-wrap gap-2">
            {CHATBOT_CONSTANTS.QUICK_REPLIES.MAIN_MENU.map((reply) => (
              <Button
                key={reply.value}
                variant="outline"
                size="sm"
                className="text-xs bg-white hover:bg-green-50 border-green-200 hover:border-green-300 text-green-700 transition-colors"
                onClick={() => handleQuickReply(reply.label)}
              >
                {reply.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
