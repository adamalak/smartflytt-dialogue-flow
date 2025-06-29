
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
        <div className="flex flex-col gap-3 mb-4" role="group" aria-label="Välj tjänst">
          {SMARTFLYTT_CONFIG.FLOW.initialOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => onSendMessage(option.label)}
              disabled={disabled}
              className={`w-full min-h-12 text-lg rounded-2xl transition-all duration-300 touch-target font-semibold ${
                option.primary
                  ? 'btn-gradient-primary text-white shadow-lg hover:shadow-xl focus:shadow-xl'
                  : 'glass-card glass-dark text-smartflytt-700 dark:text-smartflytt-300 hover:bg-white/80 dark:hover:bg-gray-800/80 border border-smartflytt-200/50 dark:border-gray-600/50'
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
    <div className="glass border-t border-smartflytt-200/50 dark:border-gray-700/50 p-6">
      {showInitialOptions()}
      <div className="flex gap-3">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={getPlaceholder()}
          disabled={disabled}
          className="flex-1 min-h-12 text-lg rounded-2xl glass-card border-smartflytt-200/50 dark:border-gray-600/50 focus:border-smartflytt-400 focus:ring-smartflytt-400 px-5 py-3 font-medium"
          aria-label="Skriv meddelande"
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          size="icon"
          className="shrink-0 min-w-12 min-h-12 btn-gradient-primary rounded-2xl transition-all duration-300 hover:shadow-lg touch-target"
          aria-label="Skicka meddelande"
        >
          {disabled ? (
            <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="w-6 h-6" aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
};
