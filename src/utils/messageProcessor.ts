
import { 
  handleWelcome,
  handleMoveType,
  handleDate,
  handleRooms,
  handleVolume,
  handleAdditionalInfo,
  StepHandlerContext
} from './stepHandlers';
import { handleFromAddressSubmission, handleToAddressSubmission } from './addressHandlers';
import { handleContactStep } from './contactHandlers';
import { ChatbotState, FlowStep } from '@/types/chatbot';
import { trackFlowStep } from '@/utils/analytics';
import { faqData } from '@/data/faq';

interface MessageProcessorProps {
  message: string;
  state: ChatbotState;
  addMessage: (content: string, type: 'bot' | 'user', isQuickReply?: boolean) => void;
  setCurrentStep: (step: FlowStep) => void;
  setSubmissionType: (type: 'offert' | 'kontorsflytt' | 'volymuppskattning') => void;
  updateFormData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const processUserMessage = async ({
  message,
  state,
  addMessage,
  setCurrentStep,
  setSubmissionType,
  updateFormData,
  setLoading,
  setError
}: MessageProcessorProps) => {
  const lowerMessage = message.toLowerCase().trim();
  
  // Track user interaction
  trackFlowStep(state.currentStep, { message, submissionType: state.submissionType });

  const context: StepHandlerContext = {
    state,
    addMessage,
    setCurrentStep: setCurrentStep as any,
    setLoading,
    updateFormData
  };

  // Handle quick replies and navigation
  if (lowerMessage === 'offert' || lowerMessage === 'få offert') {
    setSubmissionType('offert');
    handleMoveType(context, 'offert');
    return;
  }

  if (lowerMessage === 'kontorsflytt') {
    setSubmissionType('kontorsflytt');
    handleMoveType(context, 'kontorsflytt');
    return;
  }

  if (lowerMessage === 'volymuppskattning') {
    setSubmissionType('volymuppskattning');
    handleMoveType(context, 'volymuppskattning');
    return;
  }

  // Handle FAQ
  if (lowerMessage.includes('fråga') || lowerMessage.includes('hjälp') || lowerMessage.includes('?')) {
    handleFAQ(message, addMessage);
    return;
  }

  // Handle step-specific logic
  switch (state.currentStep) {
    case 'welcome':
      handleWelcome(context);
      break;

    case 'date':
      handleDate(context, message);
      break;

    case 'rooms':
      const roomsMapping: { [key: string]: '1 rok' | '2 rok' | '3 rok' | 'villa' | 'annat' } = {
        '1': '1 rok',
        '2': '2 rok', 
        '3': '3 rok',
        'villa': 'villa',
        'annat': 'annat'
      };
      const rooms = roomsMapping[lowerMessage] || 'annat';
      handleRooms(context, rooms);
      break;

    case 'volume':
      const volume = parseFloat(message);
      if (!isNaN(volume)) {
        handleVolume(context, volume);
      } else {
        addMessage('Ange en giltig volym i kubikmeter.', 'bot');
      }
      break;

    case 'additionalInfo':
      handleAdditionalInfo(context, message);
      break;

    case 'fromAddress':
    case 'toAddress':
      // These are handled by the UI components directly
      addMessage('Använd formuläret ovan för att ange adress.', 'bot');
      break;

    case 'contact':
      await handleContactStep(message, context);
      break;

    default:
      addMessage('Jag förstår inte riktigt. Kan du försöka igen?', 'bot');
      break;
  }
};

const handleFAQ = (message: string, addMessage: (content: string, type: 'bot' | 'user') => void) => {
  const lowerMessage = message.toLowerCase();
  
  // Find matching FAQ
  for (const faq of faqData) {
    if (faq.question.toLowerCase().includes(lowerMessage) || 
        faq.answer.toLowerCase().includes(lowerMessage)) {
      addMessage(faq.answer, 'bot');
      return;
    }
  }
  
  // Default FAQ response
  addMessage('Här är några vanliga frågor jag kan hjälpa med:\n\n• Vad kostar det att flytta?\n• Hur lång tid tar en flytt?\n• Vad ingår i tjänsten?\n• Hur bokar jag en flytt?\n\nFråga mig gärna något specifikt!', 'bot');
};
