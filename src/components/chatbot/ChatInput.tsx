
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { FlowStep } from '@/types/chatbot';
import { CHATBOT_CONSTANTS } from '@/data/constants';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  currentStep: FlowStep;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled,
  currentStep
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPlaceholder = () => {
    switch (currentStep) {
      case 'welcome':
        return 'Skriv ditt meddelande...';
      case 'moveType':
        return 'T.ex. "bostad", "kontor" eller "annat"...';
      case 'date':
        return 'Ange flyttdatum (ÅÅÅÅ-MM-DD)...';
      case 'fromAddress':
        return 'T.ex. "Storgatan 1, 12345 Stockholm"...';
      case 'toAddress':
        return 'T.ex. "Nygatan 5, 54321 Göteborg"...';
      case 'size':
        return 'T.ex. "1 rok", "2 rok", "villa"...';
      case 'elevator':
        return 'T.ex. "ja", "nej", "båda"...';
      case 'contact':
        return 'T.ex. "Anna Svensson, 0701234567, anna@exempel.se"...';
      case 'gdpr':
        return 'Skriv "ja" för att godkänna...';
      default:
        return 'Skriv ditt meddelande...';
    }
  };

  // Show quick reply buttons for certain steps
  const showQuickReplies = () => {
    if (currentStep === 'moveType') {
      return (
        <div className="flex flex-wrap gap-2 mb-2">
          {CHATBOT_CONSTANTS.QUICK_REPLIES.MOVE_TYPES.map((reply) => (
            <Button
              key={reply.value}
              variant="outline"
              size="sm"
              onClick={() => onSendMessage(reply.label)}
              disabled={disabled}
              className="text-xs"
            >
              {reply.label}
            </Button>
          ))}
        </div>
      );
    }

    if (currentStep === 'size') {
      return (
        <div className="flex flex-wrap gap-2 mb-2">
          {CHATBOT_CONSTANTS.QUICK_REPLIES.SIZE_OPTIONS.map((reply) => (
            <Button
              key={reply.value}
              variant="outline"
              size="sm"
              onClick={() => onSendMessage(reply.label)}
              disabled={disabled}
              className="text-xs"
            >
              {reply.label}
            </Button>
          ))}
        </div>
      );
    }

    if (currentStep === 'elevator') {
      return (
        <div className="flex flex-wrap gap-2 mb-2">
          {CHATBOT_CONSTANTS.QUICK_REPLIES.ELEVATOR_OPTIONS.map((reply) => (
            <Button
              key={reply.value}
              variant="outline"
              size="sm"
              onClick={() => onSendMessage(reply.label)}
              disabled={disabled}
              className="text-xs"
            >
              {reply.label}
            </Button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="border-t p-4 bg-background">
      {showQuickReplies()}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={getPlaceholder()}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          size="icon"
          className="shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
