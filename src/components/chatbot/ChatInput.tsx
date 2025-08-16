
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
    <div className="glass-overlay border-t border-gradient p-6 backdrop-blur-xl">
      {showInitialOptions()}
      <div className="flex gap-4 relative">
        <div className="flex-1 relative group">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholder()}
            disabled={disabled}
            className="min-h-14 text-lg rounded-3xl glass-card border-2 border-gradient focus:border-smartflytt-400 focus:ring-2 focus:ring-smartflytt-400/20 px-6 py-4 font-medium transition-all duration-300 group-hover:shadow-elegant focus:shadow-glow placeholder:text-muted-foreground/60"
            style={{
              background: 'var(--gradient-glass)',
              borderImage: 'var(--gradient-border) 1'
            }}
            aria-label="Skriv meddelande"
          />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-smartflytt-400/10 via-transparent to-smartflytt-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        <Button
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          size="icon"
          className={`shrink-0 min-w-14 min-h-14 btn-gradient-primary rounded-3xl transition-all duration-300 touch-target relative overflow-hidden ${
            inputValue.trim() && !disabled ? 'animate-pulse-glow' : ''
          }`}
          aria-label="Skicka meddelande"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          {disabled ? (
            <Loader2 className="w-6 h-6 animate-spin relative z-10" aria-hidden="true" />
          ) : (
            <Send className="w-6 h-6 relative z-10 transition-transform duration-200 hover:scale-110" aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
};
