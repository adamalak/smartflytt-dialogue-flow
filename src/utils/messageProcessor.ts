
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
import { SMARTFLYTT_CONFIG } from '@/data/constants';

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

  // Handle main flow options
  if (lowerMessage === 'offert' || lowerMessage === 'begär flyttoffert') {
    setSubmissionType('offert');
    handleMoveType(context, 'offert');
    return;
  }

  // Handle international moving (placeholder for future implementation)
  if (lowerMessage === 'utomlands' || lowerMessage === 'flytt utomlands') {
    // TODO: Implement international moving flow
    addMessage('Flytt utomlands kommer snart! Kontakta oss direkt för internationella flyttar:', 'bot');
    addMessage(`📞 ${SMARTFLYTT_CONFIG.COMPANY.phone}`, 'bot');
    addMessage(`📧 ${SMARTFLYTT_CONFIG.COMPANY.email}`, 'bot');
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
      const roomsMapping: { [key: string]: string } = {
        '1': '1rok',
        '2': '2rok', 
        '3': '3rok',
        '4': '4rok',
        'villa': 'villa',
        'kontor': 'kontor',
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
