
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
        return 'Välj typ av flytt...';
      case 'date':
        return 'Ange flyttdatum (ÅÅÅÅ-MM-DD)...';
      case 'fromAddress':
        return 'Ange från-adress...';
      case 'toAddress':
        return 'Ange till-adress...';
      case 'size':
        return 'Beskriv bohagsstorlek...';
      case 'elevator':
        return 'Finns det hiss?';
      case 'contact':
        return 'Ange kontaktuppgifter...';
      default:
        return 'Skriv ditt meddelande...';
    }
  };

  // Show quick reply buttons for certain steps
  const showQuickReplies = () => {
    if (currentStep === 'welcome') {
      return (
        <div className="flex flex-wrap gap-2 mb-2">
          {CHATBOT_CONSTANTS.QUICK_REPLIES.MAIN_MENU.map((reply) => (
            <Button
              key={reply.value}
              variant="outline"
              size="sm"
              onClick={() => onSendMessage(reply.label)}
              disabled={disabled}
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
    <div className="border-t p-4">
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
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
