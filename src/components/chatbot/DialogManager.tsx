
import React, { useEffect } from 'react';
import { FlowStep, ChatbotState } from '@/types/chatbot';
import { CHATBOT_CONSTANTS } from '@/data/constants';

interface DialogManagerProps {
  state: ChatbotState;
  addMessage: (content: string, type: 'bot' | 'user', isQuickReply?: boolean) => void;
  setCurrentStep: (step: FlowStep) => void;
  setSubmissionType: (type: 'offert' | 'bokning') => void;
  updateFormData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const DialogManager: React.FC<DialogManagerProps> = ({
  state,
  addMessage,
  setCurrentStep,
  setSubmissionType,
  updateFormData,
  setLoading,
  setError
}) => {
  
  useEffect(() => {
    // Initialize with welcome message if no messages exist
    if (state.messages.length === 0) {
      addMessage(CHATBOT_CONSTANTS.WELCOME_MESSAGE, 'bot');
      setTimeout(() => {
        addMessage('Vad kan jag hjälpa dig med idag?', 'bot');
      }, 1000);
    }
  }, [state.messages.length, addMessage]);

  // This component manages dialog flow but doesn't render anything visible
  return null;
};
