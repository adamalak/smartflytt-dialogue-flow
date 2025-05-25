
import { CHATBOT_CONSTANTS } from '@/data/constants';
import { StepHandlerContext } from './stepHandlers';

export const handleContactStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData } = context;
  
  const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = message.match(/(\+46|0)[\s-]?7[\d\s-]{8,}/);
  
  if (!emailMatch || !phoneMatch) {
    addMessage('Jag behöver både telefonnummer och e-post. Ange: Namn, 07XXXXXXXX, namn@exempel.se', 'bot');
    return;
  }

  const email = emailMatch[0];
  const phone = phoneMatch[0].replace(/[\s-]/g, '');
  const name = message.replace(emailMatch[0], '').replace(phoneMatch[0], '').replace(/[,]/g, '').trim();

  if (!name) {
    addMessage('Jag behöver ditt namn också. Ange: Namn, telefon, e-post', 'bot');
    return;
  }

  updateFormData({ contact: { name, phone, email } });
  addMessage(`Kontakt registrerad: ${name}, ${phone}, ${email}`, 'bot');
  
  setTimeout(() => {
    addMessage(CHATBOT_CONSTANTS.GDPR_TEXT, 'bot');
    setCurrentStep('gdpr');
  }, 1000);
};

export const handleGdprStep = async (message: string, context: StepHandlerContext, onSubmit: () => Promise<void>) => {
  const { addMessage, updateFormData } = context;
  const lowerMessage = message.toLowerCase();
  const gdprConsent = lowerMessage.includes('ja') || lowerMessage.includes('godkänn') || lowerMessage.includes('accept');

  if (!gdprConsent) {
    addMessage('Du måste godkänna behandling av personuppgifter för att vi ska kunna skicka din offert.', 'bot');
    return;
  }

  updateFormData({ gdprConsent: true });
  await onSubmit();
};
