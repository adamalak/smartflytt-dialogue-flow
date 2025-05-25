
import { FlowStep, ChatbotState } from '@/types/chatbot';
import { 
  handleWelcomeStep, 
  handleMoveTypeStep, 
  handleDateStep, 
  handleFaqStep, 
  handleServicesStep,
  handleRoomsStep,
  handleVolumeStep,
  handleVolumeCoordinatorStep,
  handleAdditionalInfoStep,
  StepHandlerContext 
} from './stepHandlers';
import { handleFromAddressStep, handleToAddressStep, handleElevatorStep } from './addressHandlers';
import { handleContactStep, handleGdprStep } from './contactHandlers';
import { handlePriceCalculationStep } from './priceCalculationHandler';
import { submitForm } from './formSubmission';

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

export const processUserMessage = async (props: MessageProcessorProps) => {
  const { 
    message, 
    state, 
    addMessage, 
    setCurrentStep, 
    setSubmissionType, 
    updateFormData, 
    setLoading, 
    setError 
  } = props;

  setLoading(true);
  setError(null);

  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate thinking

    const context: StepHandlerContext = {
      message,
      addMessage,
      setCurrentStep,
      setSubmissionType,
      updateFormData
    };

    const submissionContext = {
      state,
      addMessage,
      setCurrentStep,
      setLoading
    };

    switch (state.currentStep) {
      case 'welcome':
        await handleWelcomeStep(message, context);
        break;
      case 'moveType':
        await handleMoveTypeStep(message, context);
        break;
      case 'date':
        await handleDateStep(message, context);
        break;
      case 'fromAddress':
        await handleFromAddressStep(message, context);
        break;
      case 'toAddress':
        await handleToAddressStep(message, context);
        break;
      case 'rooms':
        await handleRoomsStep(message, context);
        break;
      case 'volume':
        await handleVolumeStep(message, context);
        break;
      case 'volumeCoordinator':
        await handleVolumeCoordinatorStep(message, context);
        break;
      case 'elevator':
        await handleElevatorStep(message, context);
        break;
      case 'priceCalculation':
        await handlePriceCalculationStep(state.formData, context);
        break;
      case 'contact':
        await handleContactStep(message, context);
        break;
      case 'additionalInfo':
        await handleAdditionalInfoStep(message, context);
        break;
      case 'gdpr':
        await handleGdprStep(message, context, () => submitForm(submissionContext));
        break;
      case 'faq':
        await handleFaqStep(message, context);
        break;
      case 'services':
        await handleServicesStep(message, context);
        break;
      default:
        addMessage('Förlåt, jag förstod inte det. Kan du upprepa?', 'bot');
    }
  } catch (error) {
    console.error('Error processing message:', error);
    setError('Ett fel uppstod. Försök igen.');
    addMessage('Ett tekniskt fel uppstod. Försök igen eller kontakta oss direkt på smartflyttlogistik@gmail.com.', 'bot');
  }

  setLoading(false);
};
