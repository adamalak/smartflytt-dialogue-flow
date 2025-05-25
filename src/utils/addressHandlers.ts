
import { StepHandlerContext } from './stepHandlers';

const parseAddress = (message: string) => {
  const parts = message.split(',').map(p => p.trim());
  let street = parts[0] || message;
  let postal = '';
  let city = '';

  const postalMatch = message.match(/\b\d{5}\b/);
  if (postalMatch) {
    postal = postalMatch[0];
    const cityMatch = message.match(/\d{5}\s+([a-öA-Ö\s]+)/);
    if (cityMatch) {
      city = cityMatch[1].trim();
    }
  }

  return { street, postal, city };
};

export const handleFromAddressStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData } = context;
  const { street, postal, city } = parseAddress(message);

  if (!postal) {
    addMessage('Jag behöver postnummer också. Ange hela adressen: Gata nummer, postnummer stad', 'bot');
    return;
  }

  updateFormData({ from: { street, postal, city } });
  addMessage(`Från-adress registrerad: ${street}, ${postal} ${city}`, 'bot');
  
  setTimeout(() => {
    addMessage('Vart ska du flytta? Ange din nya adress:', 'bot');
    setCurrentStep('toAddress');
  }, 1000);
};

export const handleToAddressStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData } = context;
  const { street, postal, city } = parseAddress(message);

  if (!postal) {
    addMessage('Jag behöver postnummer för din nya adress också. Ange: Gata nummer, postnummer stad', 'bot');
    return;
  }

  updateFormData({ to: { street, postal, city } });
  addMessage(`Till-adress registrerad: ${street}, ${postal} ${city}`, 'bot');
  
  setTimeout(() => {
    addMessage('Hur många rum är det som ska flyttas?', 'bot');
    setCurrentStep('rooms');
  }, 1000);
};

export const handleElevatorStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData } = context;
  const lowerMessage = message.toLowerCase();
  let elevator: string;

  if (lowerMessage.includes('båda') || (lowerMessage.includes('ja') && lowerMessage.includes('båda'))) {
    elevator = 'båda';
  } else if (lowerMessage.includes('från') || (lowerMessage.includes('ja') && lowerMessage.includes('från'))) {
    elevator = 'från';
  } else if (lowerMessage.includes('till') || (lowerMessage.includes('ja') && lowerMessage.includes('till'))) {
    elevator = 'till';
  } else {
    elevator = 'ingen';
  }

  updateFormData({ elevator });
  addMessage(`Hiss: ${elevator}`, 'bot');
  
  setTimeout(() => {
    addMessage('Nu beräknar jag körsträckor och preliminär kostnad...', 'bot');
    setCurrentStep('priceCalculation');
  }, 1000);
};
