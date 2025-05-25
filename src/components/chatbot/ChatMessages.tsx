
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CHATBOT_CONSTANTS } from '@/data/constants';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onQuickReply?: (message: string) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isLoading,
  onQuickReply 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickReply = (value: string) => {
    if (onQuickReply) {
      onQuickReply(value);
    }
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg transition-all duration-200 ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              {message.isQuickReply && message.type === 'bot' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {CHATBOT_CONSTANTS.QUICK_REPLIES.MAIN_MENU.map((reply) => (
                    <Button
                      key={reply.value}
                      variant="outline"
                      size="sm"
                      className="text-xs bg-background hover:bg-accent transition-colors"
                      onClick={() => handleQuickReply(reply.label)}
                    >
                      {reply.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground p-3 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm">Skriver...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
