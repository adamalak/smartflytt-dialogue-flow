
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
    addMessage('Hur stor är din bostad/ditt bohag?', 'bot');
    setCurrentStep('size');
  }, 1000);
};

export const handleSizeStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData } = context;
  const lowerMessage = message.toLowerCase();
  let size: string;
  let sizeOther: string | undefined;

  if (lowerMessage.includes('1') && lowerMessage.includes('rok')) {
    size = '1 rok';
  } else if (lowerMessage.includes('2') && lowerMessage.includes('rok')) {
    size = '2 rok';
  } else if (lowerMessage.includes('villa') || lowerMessage.includes('hus')) {
    size = 'villa';
  } else {
    size = 'annat';
    sizeOther = message;
  }

  updateFormData({ size, sizeOther });
  addMessage(`Bohagsstorlek: ${size === 'annat' ? message : size}`, 'bot');
  
  setTimeout(() => {
    addMessage('Finns det hiss på någon av adresserna?', 'bot');
    setCurrentStep('elevator');
  }, 1000);
};

export const handleElevatorStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData } = context;
  const lowerMessage = message.toLowerCase();
  let elevator: string;

  if (lowerMessage.includes('båda') || (lowerMessage.includes('ja') && lowerMessage.includes('båda'))) {
    elevator = 'båda';
  } else if (lowerMessage.includes('ja') && !lowerMessage.includes('nej')) {
    elevator = 'ja';
  } else {
    elevator = 'ingen';
  }

  updateFormData({ elevator });
  addMessage(`Hiss: ${elevator}`, 'bot');
  
  setTimeout(() => {
    addMessage('Slutligen behöver jag dina kontaktuppgifter. Ange namn, telefon och e-post:', 'bot');
    setCurrentStep('contact');
  }, 1000);
};
