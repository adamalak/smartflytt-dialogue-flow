import { FlowStep } from '@/types/chatbot';
import { CHATBOT_CONSTANTS } from '@/data/constants';
import { validateInput } from '@/utils/validation';
import { faqData } from '@/data/faq';
import { trackVolumeCoordinatorRequest, trackErrorEvent } from '@/utils/analytics';

export interface StepHandlerContext {
  message: string;
  addMessage: (content: string, type: 'bot' | 'user', isQuickReply?: boolean) => void;
  setCurrentStep: (step: FlowStep) => void;
  setSubmissionType: (type: 'offert' | 'kontorsflytt' | 'volymuppskattning') => void;
  updateFormData: (data: any) => void;
}

export const handleWelcomeStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, setSubmissionType } = context;
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('offert') || lowerMessage.includes('pris')) {
    setSubmissionType('offert');
    addMessage('Perfekt! Jag hjälper dig att få en preliminär offert för din flytt. Först behöver jag veta vilken typ av flytt det gäller.', 'bot');
    setTimeout(() => {
      addMessage('Välj typ av flytt:', 'bot');
      setCurrentStep('moveType');
    }, 1000);
  } else if (lowerMessage.includes('frågor') || lowerMessage.includes('faq')) {
    addMessage('Här är våra vanligaste frågor. Skriv din fråga så hjälper jag dig!', 'bot');
    setCurrentStep('faq');
  } else if (lowerMessage.includes('tjänster') || lowerMessage.includes('service')) {
    addMessage('Här kan du läsa om våra tjänster:', 'bot');
    setCurrentStep('services');
  } else {
    addMessage('Jag kan hjälpa dig med att begära preliminär offert, svara på frågor eller berätta om våra tjänster. Vad vill du göra?', 'bot', true);
  }
};

export const handleMoveTypeStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData, setSubmissionType } = context;
  const lowerMessage = message.toLowerCase();
  let moveType: string;
  let moveTypeOther: string | undefined;

  if (lowerMessage.includes('bostad') || lowerMessage.includes('lägenhet') || lowerMessage.includes('hus')) {
    moveType = 'bostad';
  } else if (lowerMessage.includes('kontor') || lowerMessage.includes('företag') || lowerMessage.includes('arbete')) {
    moveType = 'kontor';
    // Special handling for office moves
    setSubmissionType('kontorsflytt');
    updateFormData({ moveType });
    addMessage('Tack! För kontorsflyttar hanterar vi processen personligen. Fyll i dina kontaktuppgifter nedan så återkommer vi via e-post för att diskutera detaljerna.', 'bot');
    setTimeout(() => {
      addMessage('Ange ditt namn och e-postadress:', 'bot');
      setCurrentStep('contact');
    }, 1500);
    return;
  } else {
    moveType = 'annat';
    moveTypeOther = message;
  }

  updateFormData({ moveType, moveTypeOther });
  addMessage(`Bra! Du vill flytta ${moveType === 'annat' ? 'annat' : moveType}.`, 'bot');
  
  setTimeout(() => {
    addMessage('När planerar du att flytta? Ange datum i format ÅÅÅÅ-MM-DD (t.ex. 2024-06-15)', 'bot');
    setCurrentStep('date');
  }, 1000);
};

export const handleDateStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData } = context;
  const validation = validateInput('date', message);
  
  if (!validation.isValid) {
    addMessage(validation.error!, 'bot');
    return;
  }

  updateFormData({ date: message });
  addMessage(`Perfekt! Flyttdatum: ${message}`, 'bot');
  
  setTimeout(() => {
    addMessage('Nu behöver jag din nuvarande adress:', 'bot');
    setCurrentStep('fromAddress');
  }, 1000);
};

export const handleRoomsStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData } = context;
  const lowerMessage = message.toLowerCase();
  let rooms: string;
  let roomsOther: string | undefined;

  if (lowerMessage.includes('1') && lowerMessage.includes('rok')) {
    rooms = '1 rok';
  } else if (lowerMessage.includes('2') && lowerMessage.includes('rok')) {
    rooms = '2 rok';
  } else if (lowerMessage.includes('3') && lowerMessage.includes('rok')) {
    rooms = '3 rok';
  } else if (lowerMessage.includes('villa') || lowerMessage.includes('hus')) {
    rooms = 'villa';
  } else {
    rooms = 'annat';
    roomsOther = message;
  }

  updateFormData({ rooms, roomsOther });
  addMessage(`Antal rum registrerat: ${rooms === 'annat' ? message : rooms}`, 'bot');
  
  setTimeout(() => {
    addMessage('Hur många kubikmeter (m³) uppskattar du att din flytt är?\n\nAnge ett numeriskt värde (t.ex. 25 för 25 m³):', 'bot');
    setCurrentStep('volume');
  }, 1000);
};

export const handleVolumeStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData } = context;
  
  const volumeMatch = message.match(/\d+\.?\d*/);
  const volume = volumeMatch ? parseFloat(volumeMatch[0]) : null;

  if (!volume || volume <= 0) {
    addMessage('Om du är osäker på volymen, kan vi skicka ut en flyttkoordinator som gör en avgiftsfri uppskattning på plats. Detta förutsätter att du sedan bokar flytten med oss. Om ingen bokning sker, debiteras en avgift för uppskattningen.\n\nVill du att vi skickar ut en flyttkoordinator?', 'bot');
    setCurrentStep('volumeCoordinator');
    return;
  }

  updateFormData({ volume });
  addMessage(`Volym registrerad: ${volume} m³`, 'bot');
  
  setTimeout(() => {
    addMessage('Finns det hiss på någon av adresserna som kan användas för flytten?', 'bot');
    setCurrentStep('elevator');
  }, 1000);
};

export const handleVolumeCoordinatorStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData, setSubmissionType } = context;
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('ja')) {
    // Track volume coordinator request
    trackVolumeCoordinatorRequest('unsure_about_volume');
    
    setSubmissionType('volymuppskattning');
    updateFormData({ wantsVolumeCoordinator: true });
    addMessage('Perfekt! Vi skickar ut en flyttkoordinator för volymuppskattning. Kom ihåg att en avgiftsfri uppskattning förutsätter att du sedan bokar flytten med oss.', 'bot');
    setTimeout(() => {
      addMessage('Jag behöver dina kontaktuppgifter. Ange namn, telefonnummer och e-post:', 'bot');
      setCurrentStep('contact');
    }, 1500);
  } else {
    addMessage('Okej, då behöver jag att du anger volymen i kubikmeter. Ange ett numeriskt värde (t.ex. 25 för 25 m³):', 'bot');
    // Stay on volume step to get manual input
    setCurrentStep('volume');
  }
};

export const handleAdditionalInfoStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData } = context;
  
  if (message.toLowerCase().includes('nej') || message.toLowerCase().includes('ingen')) {
    updateFormData({ additionalInfo: '' });
    addMessage('Okej, vi går vidare utan ytterligare information.', 'bot');
  } else {
    updateFormData({ additionalInfo: message });
    addMessage('Tack för den ytterligare informationen!', 'bot');
  }
  
  setTimeout(() => {
    addMessage(CHATBOT_CONSTANTS.GDPR_TEXT, 'bot');
    setCurrentStep('gdpr');
  }, 1000);
};

export const handleFaqStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep } = context;
  const lowerMessage = message.toLowerCase();
  
  const matchedFaq = faqData.find(faq => 
    faq.question.toLowerCase().includes(lowerMessage) ||
    lowerMessage.includes(faq.question.toLowerCase().split(' ')[0]) ||
    (faq.category === 'pris' && (lowerMessage.includes('pris') || lowerMessage.includes('kost'))) ||
    (faq.category === 'tid' && (lowerMessage.includes('tid') || lowerMessage.includes('lång'))) ||
    (faq.category === 'försäkring' && lowerMessage.includes('försäkring'))
  );

  if (matchedFaq) {
    addMessage(matchedFaq.answer, 'bot');
    setTimeout(() => {
      addMessage('Har du fler frågor eller vill du göra något annat?', 'bot', true);
      setCurrentStep('welcome');
    }, 2000);
  } else {
    addMessage('Jag kunde inte hitta svar på den frågan. Kontakta oss direkt på smartflyttlogistik@gmail.com.', 'bot');
    setTimeout(() => {
      addMessage('Vill du göra något annat?', 'bot', true);
      setCurrentStep('welcome');
    }, 1500);
  }
};

export const handleServicesStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep } = context;
  
  addMessage('Vi erbjuder följande tjänster:\n\n• Flyttjänster för privatpersoner och företag\n• Packning och uppackning\n• Montering och demontering av möbler\n• Flyttstädning\n• Magasinering\n• Internationella flyttar\n\nKontakta oss för mer information!', 'bot');
  
  setTimeout(() => {
    addMessage('Vill du begära preliminär offert eller har du andra frågor?', 'bot', true);
    setCurrentStep('welcome');
  }, 2000);
};
