
import { validateEmail, validatePhoneNumber } from './validation';
import { trackFlowStep } from './analytics';
import { submitForm } from './formSubmission';
import { StepHandlerContext } from './stepHandlers';

export const handleContactStep = async (message: string, context: StepHandlerContext) => {
  const { addMessage } = context;
  
  // For now, just acknowledge the contact input
  // In a real implementation, this would parse the contact information
  addMessage('Tack för dina kontaktuppgifter. Vi återkommer snart!', 'bot');
  
  // Track the contact step
  trackFlowStep('contact', { message });
};

export const handleContactInput = async (message: string, context: StepHandlerContext) => {
  return handleContactStep(message, context);
};

export const handleGdprConsent = async (message: string, context: StepHandlerContext) => {
  const { state, addMessage, setCurrentStep } = context;
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('ja') || lowerMessage.includes('godkänn') || lowerMessage.includes('accepter')) {
    state.formData.gdprConsent = true;
    trackFlowStep('gdpr', { consent: true });
    
    addMessage('Tack! Nu skickar vi din förfrågan.', 'bot');
    
    // Submit the form
    await submitForm(context);
  } else {
    addMessage('Du måste godkänna behandling av personuppgifter för att fortsätta.', 'bot');
  }
};
