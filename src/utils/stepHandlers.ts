import { ChatbotState } from '@/types/chatbot';
import { trackFlowStep, trackFormAbandonment } from '@/utils/analytics';
import { submitForm } from '@/utils/formSubmission';
import { handlePriceCalculationStep } from '@/utils/priceCalculationHandler';
import { validateEmail, validatePhoneNumber } from '@/utils/validation';
import { SMARTFLYTT_CONFIG } from '@/data/constants';

export interface StepHandlerContext {
  state: ChatbotState;
  addMessage: (content: string, type: 'bot' | 'user', isQuickReply?: boolean) => void;
  setCurrentStep: (step: any) => void;
  setLoading: (loading: boolean) => void;
  updateFormData: (data: any) => void;
  analyticsData?: any;
}

interface StepContext {
  state: ChatbotState;
  addMessage: (content: string, type: 'bot' | 'user', isQuickReply?: boolean) => void;
  setCurrentStep: (step: any) => void;
  setLoading: (loading: boolean) => void;
  analyticsData?: any;
}

import { getABTestVariant, welcomeMessageTest, trackABTestEvent } from './abTesting';
import { getUserSessionId } from './userSession';

export const handleWelcome = (context: StepContext) => {
  const { addMessage } = context;
  
  const userId = getUserSessionId();
  const variant = getABTestVariant(welcomeMessageTest.name, userId);
  const welcomeMessage = welcomeMessageTest.variants[variant];
  
  // Track A/B test exposure
  trackABTestEvent(welcomeMessageTest.name, variant, 'exposure', userId);
  
  addMessage(welcomeMessage, 'bot');
  addMessage('Vad vill du göra?', 'bot', true);
};

export const handleMoveType = (context: StepContext, moveType: 'offert' | 'kontorsflytt' | 'volymuppskattning') => {
  const { state, addMessage, setCurrentStep } = context;

  state.submissionType = moveType;
  trackFlowStep('moveType', { moveType });

  if (moveType === 'offert') {
    addMessage('Vad bra! Då behöver jag lite info först.', 'bot');
    setTimeout(() => {
      addMessage('Vart vill du flytta?', 'bot');
      setCurrentStep('address');
    }, 1000);
  } else if (moveType === 'kontorsflytt') {
    addMessage('Vad bra! Då behöver jag lite info först.', 'bot');
    setTimeout(() => {
      addMessage('Berätta om ditt företag', 'bot');
      setCurrentStep('companyInfo');
    }, 1000);
  }
   else if (moveType === 'volymuppskattning') {
    addMessage('Vad bra! Då behöver jag lite info först.', 'bot');
    setTimeout(() => {
      addMessage('För att ge dig en uppskattning behöver jag veta lite mer om vad du vill flytta.', 'bot');
      setCurrentStep('volume');
    }, 1000);
  }
};

export const handleAddress = (context: StepContext, fromAddress: any, toAddress: any) => {
  const { state, addMessage, setCurrentStep } = context;

  if (!fromAddress || !toAddress) {
    addMessage('Du måste ange både start- och slutadress.', 'bot');
    return;
  }

  state.formData.from = fromAddress;
  state.formData.to = toAddress;

  trackFlowStep('address', { fromAddress, toAddress });

  addMessage(`Okej, du vill flytta från ${fromAddress.street}, ${fromAddress.postalCode} ${fromAddress.city} till ${toAddress.street}, ${toAddress.postalCode} ${toAddress.city}.`, 'bot');
  setTimeout(() => {
    addMessage('När vill du flytta?', 'bot');
    setCurrentStep('date');
  }, 1000);
};

export const handleDate = (context: StepContext, date: string) => {
  const { state, addMessage, setCurrentStep } = context;

  if (!date) {
    addMessage('Du måste ange ett datum.', 'bot');
    return;
  }

  state.formData.date = date;
  trackFlowStep('date', { date });

  addMessage(`Du vill flytta den ${date}.`, 'bot');
  setTimeout(() => {
    addMessage('Hur stort är ditt bohag?', 'bot');
    setCurrentStep('rooms');
  }, 1000);
};

export const handleRooms = (context: StepContext, rooms: '1 rok' | '2 rok' | '3 rok' | 'villa' | 'annat') => {
  const { state, addMessage, setCurrentStep } = context;

  state.formData.rooms = rooms;
  trackFlowStep('rooms', { rooms });

  // Get room label from config - need to map from picker values to display values
  const roomMappings: { [key: string]: string } = {
    '1rok': '1 rum och kök',
    '2rok': '2 rum och kök', 
    '3rok': '3 rum och kök',
    '4rok': '4 rum och kök',
    'villa': 'Villa/Hus',
    'kontor': 'Kontor',
    'annat': 'Annat'
  };
  
  // Convert picker format to display format
  const pickerToFormData: { [key: string]: '1 rok' | '2 rok' | '3 rok' | 'villa' | 'annat' } = {
    '1rok': '1 rok',
    '2rok': '2 rok',
    '3rok': '3 rok',
    '4rok': 'villa', // Map 4rok to villa since it's not in the original type
    'villa': 'villa',
    'kontor': 'villa', // Map kontor to villa since it's not in the original type
    'annat': 'annat'
  };

  // If rooms is coming from the picker format, convert it
  if (typeof rooms === 'string' && rooms.includes('rok')) {
    const mappedRoom = pickerToFormData[rooms] || 'annat';
    state.formData.rooms = mappedRoom;
    const displayLabel = roomMappings[rooms] || rooms;
    addMessage(`Du har valt ${displayLabel}.`, 'bot');
  } else {
    addMessage(`Du har valt ${rooms}.`, 'bot');
  }

  setTimeout(() => {
    addMessage('Ungefär hur många kubikmeter uppskattar du?', 'bot');
    setCurrentStep('volume');
  }, 1000);
};

export const handleVolume = (context: StepContext, volume: number) => {
  const { state, addMessage, setCurrentStep } = context;

  if (!volume || volume <= 0) {
    addMessage('Du måste ange en volym.', 'bot');
    return;
  }

  state.formData.volume = volume;
  trackFlowStep('volume', { volume });

  addMessage(`Du uppskattar ${volume} kubikmeter.`, 'bot');
    setTimeout(() => {
      addMessage('Har du några speciella önskemål eller kommentarer?', 'bot');
      setCurrentStep('additionalInfo');
    }, 1000);
};

export const handleAdditionalInfo = (context: StepContext, additionalInfo: string) => {
  const { state, addMessage, setCurrentStep } = context;

  state.formData.additionalInfo = additionalInfo;
  trackFlowStep('additionalInfo', { additionalInfo });

  addMessage('Tack! Nu har jag all information jag behöver.', 'bot');
  setTimeout(() => {
    addMessage('Låt mig visa en sammanfattning av din förfrågan så du kan kontrollera att allt stämmer.', 'bot');
    setCurrentStep('summary');
  }, 1000);
};

export const handleContact = async (context: StepHandlerContext, contactInfo: any) => {
  const { state, addMessage, setCurrentStep, setLoading, updateFormData } = context;

  if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
    addMessage('Du måste ange namn, e-post och telefonnummer.', 'bot');
    return;
  }

  if (!validateEmail(contactInfo.email)) {
    addMessage('Ogiltig e-postadress.', 'bot');
    return;
  }

  if (!validatePhoneNumber(contactInfo.phone)) {
    addMessage('Ogiltigt telefonnummer. Ange formatet 0701234567.', 'bot');
    return;
  }

  state.formData.contact = contactInfo;
  trackFlowStep('contact', { contactInfo });

  addMessage(`Tack ${contactInfo.name}!`, 'bot');

  // Check if we should calculate price or go straight to additional info
  if (state.formData.from && state.formData.to && state.formData.volume) {
    await handlePriceCalculationStep(state.formData, {
      addMessage,
      setCurrentStep,
      updateFormData,
      setLoading,
      state
    });
  } else {
    setTimeout(() => {
      addMessage('Har du några speciella önskemål eller kommentarer?', 'bot');
      setCurrentStep('additionalInfo');
    }, 1000);
  }
};

export const handlePriceCalculation = (context: StepContext, priceCalculation: any) => {
  const { state, addMessage, setCurrentStep } = context;

  if (!priceCalculation) {
    addMessage('Ett fel uppstod vid prisberäkningen.', 'bot');
    return;
  }

  state.formData.priceCalculation = priceCalculation;
  trackFlowStep('priceCalculation', { priceCalculation });

  addMessage(`Din preliminära offert är ${priceCalculation.totalPrice} kr.`, 'bot');
  setTimeout(() => {
    addMessage('Vill du gå vidare och boka?', 'bot', true);
    setCurrentStep('confirmation');
  }, 1000);
};

export const handleConfirmation = (context: StepContext, confirmation: boolean) => {
  const { state, addMessage, setCurrentStep } = context;

  trackFlowStep('confirmation', { confirmation });

  if (confirmation) {
    submitForm(context);
  } else {
    addMessage('Okej, du vill inte boka. Vill du göra något annat?', 'bot', true);
    setCurrentStep('welcome');
  }
};

export const handleCompanyInfo = (context: StepHandlerContext, companyInfo: any) => {
  const { state, addMessage, setCurrentStep, updateFormData } = context;

  if (!companyInfo.companyName || !companyInfo.contactName || !companyInfo.email || !companyInfo.phone) {
    addMessage('Du måste ange företagsnamn, kontaktperson, e-post och telefonnummer.', 'bot');
    return;
  }

  if (!validateEmail(companyInfo.email)) {
    addMessage('Ogiltig e-postadress.', 'bot');
    return;
  }

  if (!validatePhoneNumber(companyInfo.phone)) {
    addMessage('Ogiltigt telefonnummer. Ange formatet 0701234567.', 'bot');
    return;
  }

  // Add company info to form data
  updateFormData({
    companyInfo
  });
  
  trackFlowStep('companyInfo', { companyInfo });

  addMessage(`Tack!`, 'bot');
  setTimeout(() => {
    addMessage('Vart vill ni flytta?', 'bot');
    setCurrentStep('fromAddress');
  }, 1000);
};

export const handleFormAbandonment = (context: StepContext, currentStep: string, completionPercentage: number) => {
  trackFormAbandonment(currentStep, completionPercentage);
};
