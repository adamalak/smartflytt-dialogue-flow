import React, { useEffect, useState } from 'react';
import { useChatbotState } from '@/hooks/useChatbotState';
import { DialogManager } from './DialogManager';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ProgressIndicator } from './ProgressIndicator';
import { OnboardingScreen } from './OnboardingScreen';
import { BackButton } from './BackButton';
import { BotAvatar } from './BotAvatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
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
        <div className="h-full flex flex-col relative overflow-hidden"
             style={{
               background: 'linear-gradient(135deg, hsl(var(--smartflytt-50)) 0%, hsl(var(--background)) 50%, hsl(var(--smartflytt-50) / 0.3) 100%)'
             }}>
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-smartflytt-200/10 dark:bg-smartflytt-800/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-smartflytt-300/10 dark:bg-smartflytt-700/10 rounded-full blur-3xl animate-float [animation-delay:2s]"></div>
          </div>
          
          {/* Header */}
          <div className="glass-overlay border-b border-gradient p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BotAvatar size="lg" className="shadow-glow" />
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-smartflytt-700 to-smartflytt-600 bg-clip-text text-transparent">
                    {SMARTFLYTT_CONFIG.COMPANY.name}
                  </h2>
                  <p className="text-lg text-smartflytt-600 dark:text-smartflytt-400 font-medium">
                    {SMARTFLYTT_CONFIG.COMPANY.tagline}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                {chatbotState.canGoBack() && (
                  <BackButton 
                    onGoBack={chatbotState.goBackOneStep}
                    disabled={chatbotState.state.isLoading}
                    className="glass-card hover:shadow-glow"
                  />
                )}
              </div>
            </div>
          </div>

          <ProgressIndicator currentStep={chatbotState.state.currentStep} />
          
          <div className="flex-1 flex flex-col min-h-0 relative z-10">
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
