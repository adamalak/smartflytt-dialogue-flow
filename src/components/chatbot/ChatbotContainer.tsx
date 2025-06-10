
import React, { useEffect } from 'react';
import { useChatbotState } from '@/hooks/useChatbotState';
import { DialogManager } from './DialogManager';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ProgressIndicator } from './ProgressIndicator';
import { trackFlowStep, trackFormAbandonment } from '@/utils/analytics';
import { SMARTFLYTT_CONFIG } from '@/data/constants';
import { ErrorBoundary } from './ErrorBoundary';

export const ChatbotContainer: React.FC = () => {
  const chatbotState = useChatbotState();

  const handleSendMessage = (message: string) => {
    chatbotState.addMessage(message, 'user');
  };

  // Track flow step changes
  useEffect(() => {
    if (chatbotState.state.currentStep !== 'welcome') {
      trackFlowStep(chatbotState.state.currentStep, {
        message_count: chatbotState.state.messages.length,
        form_data_keys: Object.keys(chatbotState.state.formData),
        submission_type: chatbotState.state.submissionType
      });
    }
  }, [chatbotState.state.currentStep, chatbotState.state.messages.length, chatbotState.state.submissionType]);

  // Track form abandonment on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (chatbotState.state.currentStep !== 'welcome' && chatbotState.state.currentStep !== 'submitted') {
        const stepOrder = ['welcome', 'moveType', 'date', 'fromAddress', 'toAddress', 'rooms', 'volume', 'contact', 'submitted'];
        const currentIndex = stepOrder.indexOf(chatbotState.state.currentStep);
        const completionPercentage = currentIndex > 0 ? (currentIndex / (stepOrder.length - 1)) * 100 : 0;
        
        trackFormAbandonment(chatbotState.state.currentStep, completionPercentage);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [chatbotState.state.currentStep]);

  return (
    <ErrorBoundary>
      <div className="h-full flex flex-col bg-white">
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-smartflytt-600 to-smartflytt-700 text-white p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">{SMARTFLYTT_CONFIG.BOT.avatar}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">{SMARTFLYTT_CONFIG.BOT.name}</h1>
              <p className="text-smartflytt-100 text-sm">{SMARTFLYTT_CONFIG.COMPANY.tagline}</p>
            </div>
          </div>
        </div>

        <ProgressIndicator currentStep={chatbotState.state.currentStep} />
        
        <div className="flex-1 flex flex-col min-h-0">
          <ChatMessages 
            messages={chatbotState.state.messages}
            isLoading={chatbotState.state.isLoading}
            onQuickReply={handleSendMessage}
            currentStep={chatbotState.state.currentStep}
            addMessage={chatbotState.addMessage}
            setCurrentStep={chatbotState.setCurrentStep}
            updateFormData={chatbotState.updateFormData}
          />
          
          <DialogManager {...chatbotState} />
          
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={chatbotState.state.isLoading}
            currentStep={chatbotState.state.currentStep}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};
