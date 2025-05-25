
import React from 'react';
import { useChatbotState } from '@/hooks/useChatbotState';
import { DialogManager } from './DialogManager';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ProgressIndicator } from './ProgressIndicator';

interface ChatbotContainerProps {
  onClose: () => void;
}

export const ChatbotContainer: React.FC<ChatbotContainerProps> = ({ onClose }) => {
  const chatbotState = useChatbotState();

  const handleSendMessage = (message: string) => {
    chatbotState.addMessage(message, 'user');
  };

  return (
    <div className="h-full flex flex-col">
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
    </div>
  );
};
