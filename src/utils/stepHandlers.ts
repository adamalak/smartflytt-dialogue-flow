
import { FlowStep } from '@/types/chatbot';
import { CHATBOT_CONSTANTS } from '@/data/constants';
import { validateInput } from '@/utils/validation';
import { faqData } from '@/data/faq';

export interface StepHandlerContext {
  message: string;
  addMessage: (content: string, type: 'bot' | 'user', isQuickReply?: boolean) => void;
  setCurrentStep: (step: FlowStep) => void;
  setSubmissionType: (type: 'offert' | 'bokning') => void;
  updateFormData: (data: any) => void;
}

export const handleWelcomeStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, setSubmissionType } = context;
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('offert') || lowerMessage.includes('pris')) {
    setSubmissionType('offert');
    addMessage('Perfekt! Jag hjälper dig att få en offert för din flytt. Först behöver jag veta vilken typ av flytt det gäller.', 'bot');
    setTimeout(() => {
      addMessage('Välj typ av flytt:', 'bot');
      setCurrentStep('moveType');
    }, 1000);
  } else if (lowerMessage.includes('bok') || lowerMessage.includes('boka')) {
    setSubmissionType('bokning');
    addMessage('Bra! Jag hjälper dig att boka din flytt. Låt oss börja med att samla in alla detaljer.', 'bot');
    setTimeout(() => {
      addMessage('Vilken typ av flytt handlar det om?', 'bot');
      setCurrentStep('moveType');
    }, 1000);
  } else if (lowerMessage.includes('frågor') || lowerMessage.includes('faq')) {
    addMessage('Här är våra vanligaste frågor. Skriv din fråga så hjälper jag dig!', 'bot');
    setCurrentStep('faq');
  } else if (lowerMessage.includes('tjänster') || lowerMessage.includes('service')) {
    addMessage('Här kan du läsa om våra tjänster:', 'bot');
    setCurrentStep('services');
  } else {
    addMessage('Jag kan hjälpa dig med att begära offert, boka flytt, svara på frågor eller berätta om våra tjänster. Vad vill du göra?', 'bot', true);
  }
};

export const handleMoveTypeStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData } = context;
  const lowerMessage = message.toLowerCase();
  let moveType: string;
  let moveTypeOther: string | undefined;

  if (lowerMessage.includes('bostad') || lowerMessage.includes('lägenhet') || lowerMessage.includes('hus')) {
    moveType = 'bostad';
  } else if (lowerMessage.includes('kontor') || lowerMessage.includes('företag') || lowerMessage.includes('arbete')) {
    moveType = 'kontor';
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
    addMessage('Nu behöver jag din nuvarande adress. Ange gata och nummer:', 'bot');
    setCurrentStep('fromAddress');
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
    addMessage('Jag kunde inte hitta svar på den frågan. Kontakta oss direkt på info@smartflytt.se eller 08-12345678.', 'bot');
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
    addMessage('Vill du begära offert eller boka en flytt?', 'bot', true);
    setCurrentStep('welcome');
  }, 2000);
};
