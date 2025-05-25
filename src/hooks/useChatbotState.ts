
import { useState, useCallback } from 'react';
import { ChatbotState, ChatMessage, FlowStep, MoveQuoteData } from '../types/chatbot';
import { v4 as uuidv4 } from 'uuid';

const initialState: ChatbotState = {
  currentStep: 'welcome',
  messages: [],
  formData: {},
  submissionType: null,
  isLoading: false,
  error: null
};

export const useChatbotState = () => {
  const [state, setState] = useState<ChatbotState>(initialState);

  const addMessage = useCallback((content: string, type: 'bot' | 'user', isQuickReply?: boolean) => {
    const message: ChatMessage = {
      id: uuidv4(),
      type,
      content,
      timestamp: new Date(),
      isQuickReply
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  }, []);

  const updateFormData = useCallback((data: Partial<MoveQuoteData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data }
    }));
  }, []);

  const setCurrentStep = useCallback((step: FlowStep) => {
    setState(prev => ({
      ...prev,
      currentStep: step
    }));
  }, []);

  const setSubmissionType = useCallback((type: 'offert' | 'kontorsflytt' | 'volymuppskattning') => {
    setState(prev => ({
      ...prev,
      submissionType: type
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error
    }));
  }, []);

  const resetChat = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    addMessage,
    updateFormData,
    setCurrentStep,
    setSubmissionType,
    setLoading,
    setError,
    resetChat
  };
};
