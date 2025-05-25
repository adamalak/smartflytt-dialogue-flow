
import React from 'react';
import { Card } from '@/components/ui/card';
import { useChatbotState } from '@/hooks/useChatbotState';
import { DialogManager } from './DialogManager';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

export const ChatbotContainer: React.FC = () => {
  const chatbotState = useChatbotState();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
          <h2 className="text-lg font-semibold">Smartflytt Chattbot</h2>
          <p className="text-sm opacity-90">Din hjälp för flytt och offert</p>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          <ChatMessages 
            messages={chatbotState.state.messages}
            isLoading={chatbotState.state.isLoading}
          />
          
          <DialogManager {...chatbotState} />
          
          <ChatInput 
            onSendMessage={(message) => chatbotState.addMessage(message, 'user')}
            disabled={chatbotState.state.isLoading}
            currentStep={chatbotState.state.currentStep}
          />
        </div>
      </Card>
    </div>
  );
};
