
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { FlowStep } from '@/types/chatbot';
import { SMARTFLYTT_CONFIG } from '@/data/constants';

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
      case 'contact':
        return 'Ange dina kontaktuppgifter...';
      case 'additionalInfo':
        return 'Eventuella önskemål eller kommentarer...';
      default:
        return 'Skriv ditt meddelande...';
    }
  };

  // Show initial quick reply buttons for welcome step
  const showInitialOptions = () => {
    if (currentStep === 'welcome') {
      return (
        <div className="flex flex-col gap-3 mb-4">
          {SMARTFLYTT_CONFIG.FLOW.initialOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => onSendMessage(option.label)}
              disabled={disabled}
              className={`w-full h-14 text-lg rounded-xl transition-all duration-200 ${
                option.primary
                  ? 'bg-smartflytt-600 hover:bg-smartflytt-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-white border-2 border-smartflytt-200 hover:bg-smartflytt-50 text-smartflytt-700 hover:border-smartflytt-300'
              }`}
              aria-label={option.label}
            >
              {option.label}
            </Button>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border-t border-smartflytt-200 p-6 bg-white">
      {showInitialOptions()}
      <div className="flex gap-3">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={getPlaceholder()}
          disabled={disabled}
          className="flex-1 h-12 rounded-xl border-smartflytt-200 focus:border-smartflytt-400 focus:ring-smartflytt-400"
          aria-label="Skriv meddelande"
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          size="icon"
          className="shrink-0 w-12 h-12 bg-smartflytt-600 hover:bg-smartflytt-700 rounded-xl"
          aria-label="Skicka meddelande"
        >
          {disabled ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
};
