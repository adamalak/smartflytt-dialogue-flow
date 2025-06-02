
import React, { useEffect } from 'react';
import { useChatbotState } from '@/hooks/useChatbotState';
import { DialogManager } from './DialogManager';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ProgressIndicator } from './ProgressIndicator';
import { trackFlowStep, trackFormAbandonment } from '@/utils/analytics';

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
        // Calculate completion percentage based on step order
        const stepOrder = ['welcome', 'moveType', 'date', 'fromAddress', 'toAddress', 'rooms', 'volume', 'elevator', 'priceCalculation', 'contact', 'gdpr', 'submitted'];
        const currentIndex = stepOrder.indexOf(chatbotState.state.currentStep);
        const completionPercentage = currentIndex > 0 ? (currentIndex / (stepOrder.length - 1)) * 100 : 0;
        
        trackFormAbandonment(chatbotState.state.currentStep, completionPercentage);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [chatbotState.state.currentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-green-200/50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚚</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Smartflytt Chattbot</h1>
              <p className="text-green-100 text-sm">Få din preliminära offert för flytt</p>
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
    </div>
  );
};
