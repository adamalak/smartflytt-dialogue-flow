
import React, { useEffect } from 'react';
import { FlowStep, ChatbotState } from '@/types/chatbot';
import { CHATBOT_CONSTANTS } from '@/data/constants';
import { processUserMessage } from '@/utils/messageProcessor';

interface DialogManagerProps {
  state: ChatbotState;
  addMessage: (content: string, type: 'bot' | 'user', isQuickReply?: boolean) => void;
  setCurrentStep: (step: FlowStep) => void;
  setSubmissionType: (type: 'offert' | 'kontorsflytt' | 'volymuppskattning') => void;
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
        addMessage('Vad kan jag hjälpa dig med idag?', 'bot', true);
      }, 1000);
    }
  }, [state.messages.length, addMessage]);

  // Process user messages and handle dialog flow
  useEffect(() => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (!lastMessage || lastMessage.type !== 'user' || state.isLoading) return;

    processUserMessage({
      message: lastMessage.content,
      state,
      addMessage,
      setCurrentStep,
      setSubmissionType,
      updateFormData,
      setLoading,
      setError
    });
  }, [state.messages, state, addMessage, setCurrentStep, setSubmissionType, updateFormData, setLoading, setError]);

  return null;
};
