
import React from 'react';
import { ChatMessage } from '@/types/chatbot';

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
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] p-4 rounded-2xl transition-all duration-300 shadow-md ${
          message.type === 'user'
            ? 'bg-gradient-to-r from-smartflytt-600 to-smartflytt-700 text-white shadow-smartflytt-200'
            : 'bg-white text-gray-800 shadow-gray-200 border border-gray-100'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
      </div>
    </div>
  );
};
