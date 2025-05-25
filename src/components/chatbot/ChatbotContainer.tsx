
import React from 'react';
import { Card } from '@/components/ui/card';
import { useChatbotState } from '@/hooks/useChatbotState';
import { DialogManager } from './DialogManager';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ProgressIndicator } from './ProgressIndicator';
import { StartOverButton } from './StartOverButton';

export const ChatbotContainer: React.FC = () => {
  const chatbotState = useChatbotState();

  const handleStartOver = () => {
    chatbotState.resetChat();
  };

  const handleSendMessage = (message: string) => {
    chatbotState.addMessage(message, 'user');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="h-[600px] flex flex-col shadow-lg">
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Smartflytt Chattbot</h2>
              <p className="text-sm opacity-90">Din hjälp för flytt och offert</p>
            </div>
            <StartOverButton 
              onStartOver={handleStartOver}
              disabled={chatbotState.state.isLoading}
            />
          </div>
        </div>
        
        <ProgressIndicator currentStep={chatbotState.state.currentStep} />
        
        <div className="flex-1 flex flex-col min-h-0">
          <ChatMessages 
            messages={chatbotState.state.messages}
            isLoading={chatbotState.state.isLoading}
            onQuickReply={handleSendMessage}
          />
          
          <DialogManager {...chatbotState} />
          
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={chatbotState.state.isLoading}
            currentStep={chatbotState.state.currentStep}
          />
        </div>
      </Card>
    </div>
  );
};
