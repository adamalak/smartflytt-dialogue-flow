
import { useState, useCallback, useEffect } from 'react';
import { ChatbotState, ChatMessage, FlowStep, MoveQuoteData } from '../types/chatbot';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'smartflytt-chat-state';

interface NavigationStep {
  step: FlowStep;
  formData: Partial<MoveQuoteData>;
  timestamp: Date;
}

const initialState: ChatbotState = {
  currentStep: 'welcome',
  messages: [],
  formData: {},
  submissionType: null,
  isLoading: false,
  error: null
};

// Save state to localStorage
const saveStateToStorage = (state: ChatbotState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...state,
      messages: state.messages.slice(-50) // Keep only last 50 messages
    }));
  } catch (error) {
    console.warn('Failed to save chat state to localStorage:', error);
  }
};

// Load state from localStorage
const loadStateFromStorage = (): ChatbotState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert timestamp strings back to Date objects
      if (parsed.messages) {
        parsed.messages = parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
      return { ...initialState, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load chat state from localStorage:', error);
  }
  return initialState;
};

export const useChatbotState = () => {
  const [state, setState] = useState<ChatbotState>(() => loadStateFromStorage());
  const [navigationHistory, setNavigationHistory] = useState<NavigationStep[]>([]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  const addMessage = useCallback((content: string, type: 'bot' | 'user', isQuickReply?: boolean) => {
    const message: ChatMessage = {
      id: uuidv4(),
      type,
      content,
      timestamp: new Date(),
      isQuickReply
    };

    setState(prev => {
      // Prevent duplicate messages
      const lastMessage = prev.messages[prev.messages.length - 1];
      if (lastMessage && 
          lastMessage.content === content && 
          lastMessage.type === type &&
          Date.now() - lastMessage.timestamp.getTime() < 1000) {
        return prev;
      }

      return {
        ...prev,
        messages: [...prev.messages, message]
      };
    });
  }, []);

  const updateFormData = useCallback((data: Partial<MoveQuoteData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data }
    }));
  }, []);

  const setCurrentStep = useCallback((step: FlowStep) => {
    setState(prev => {
      // Save current step to navigation history before changing
      if (prev.currentStep !== 'welcome' && prev.currentStep !== step) {
        setNavigationHistory(history => [
          ...history,
          {
            step: prev.currentStep,
            formData: { ...prev.formData },
            timestamp: new Date()
          }
        ]);
      }

      return {
        ...prev,
        currentStep: step
      };
    });
  }, []);

  const goBackOneStep = useCallback(() => {
    const lastStep = navigationHistory[navigationHistory.length - 1];
    if (lastStep) {
      setState(prev => ({
        ...prev,
        currentStep: lastStep.step,
        formData: lastStep.formData
      }));
      
      setNavigationHistory(history => history.slice(0, -1));
      
      // Remove the last few bot messages to clean up the chat
      setState(prev => ({
        ...prev,
        messages: prev.messages.slice(0, -2)
      }));
    }
  }, [navigationHistory]);

  const canGoBack = useCallback(() => {
    return navigationHistory.length > 0 && state.currentStep !== 'welcome';
  }, [navigationHistory.length, state.currentStep]);

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
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
    setNavigationHistory([]);
  }, []);

  return {
    state,
    addMessage,
    updateFormData,
    setCurrentStep,
    setSubmissionType,
    setLoading,
    setError,
    resetChat,
    goBackOneStep,
    canGoBack
  };
};
