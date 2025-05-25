
import { StepHandlerContext } from './stepHandlers';
import { Address } from '@/types/chatbot';

export const handleFromAddressStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep } = context;
  
  // Show address input form - the actual address data will be handled by the AddressInput component
  addMessage('Fyll i din nuvarande adress nedan:', 'bot');
};

export const handleFromAddressSubmission = async (address: Address, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData } = context;
  
  updateFormData({ from: address });
  addMessage(`Från-adress registrerad: ${address.street}, ${address.postal} ${address.city}`, 'bot');
  
  setTimeout(() => {
    addMessage('Nu behöver jag din nya adress. Fyll i uppgifterna nedan:', 'bot');
    setCurrentStep('toAddress');
  }, 1000);
};

export const handleToAddressStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage } = context;
  
  // Show address input form - the actual address data will be handled by the AddressInput component
  addMessage('Fyll i din nya adress nedan:', 'bot');
};

export const handleToAddressSubmission = async (address: Address, context: StepHandlerContext) => {
  const { addMessage, setCurrentStep, updateFormData } = context;
  
  updateFormData({ to: address });
  addMessage(`Till-adress registrerad: ${address.street}, ${address.postal} ${address.city}`, 'bot');
  
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
