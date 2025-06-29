
import React, { useEffect, useState } from 'react';
import { useChatbotState } from '@/hooks/useChatbotState';
import { DialogManager } from './DialogManager';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ProgressIndicator } from './ProgressIndicator';
import { OnboardingScreen } from './OnboardingScreen';
import { BackButton } from './BackButton';
import { ValidationProvider } from '@/contexts/ValidationContext';
import { trackFlowStep, trackFormAbandonment } from '@/utils/analytics';
import { SMARTFLYTT_CONFIG } from '@/data/constants';
import { ErrorBoundary } from './ErrorBoundary';

export const ChatbotContainer: React.FC = () => {
  const chatbotState = useChatbotState();
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleSendMessage = (message: string) => {
    chatbotState.addMessage(message, 'user');
  };

  const handleStartQuote = () => {
    setShowOnboarding(false);
    chatbotState.setSubmissionType('offert');
    chatbotState.addMessage('Välkommen! Låt oss hjälpa dig med din flyttoffert.', 'bot');
    chatbotState.addMessage('Vad för typ av flytt handlar det om?', 'bot');
    chatbotState.setCurrentStep('moveType');
  };

  const handleInternationalMove = () => {
    setShowOnboarding(false);
    chatbotState.addMessage('Flytt utomlands kommer snart! Kontakta oss direkt för internationella flyttar:', 'bot');
    chatbotState.addMessage(`📞 ${SMARTFLYTT_CONFIG.COMPANY.phone}`, 'bot');
    chatbotState.addMessage(`📧 ${SMARTFLYTT_CONFIG.COMPANY.email}`, 'bot');
  };

  // Check if user has already started the flow
  useEffect(() => {
    if (chatbotState.state.currentStep !== 'welcome' || chatbotState.state.messages.length > 0) {
      setShowOnboarding(false);
    }
  }, [chatbotState.state.currentStep, chatbotState.state.messages.length]);

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

  // Show onboarding screen
  if (showOnboarding) {
    return (
      <ErrorBoundary>
        <OnboardingScreen 
          onStartQuote={handleStartQuote}
          onInternationalMove={handleInternationalMove}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ValidationProvider>
        <div className="h-full flex flex-col bg-white/98 backdrop-blur-sm">
          {/* Modern Header with Back Button */}
          <div className="sticky top-0 z-50 bg-gradient-to-r from-smartflytt-600 to-smartflytt-700 text-white shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">{SMARTFLYTT_CONFIG.BOT.avatar}</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">{SMARTFLYTT_CONFIG.BOT.name}</h1>
                    <p className="text-smartflytt-100 text-sm">{SMARTFLYTT_CONFIG.COMPANY.tagline}</p>
                  </div>
                </div>
                
                {/* Back Button */}
                {chatbotState.canGoBack() && (
                  <BackButton 
                    onGoBack={chatbotState.goBackOneStep}
                    disabled={chatbotState.state.isLoading}
                    className="text-white hover:text-smartflytt-100 hover:bg-white/10"
                  />
                )}
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
      </ValidationProvider>
    </ErrorBoundary>
  );
};
