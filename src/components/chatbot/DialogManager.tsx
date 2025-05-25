
import React, { useEffect } from 'react';
import { FlowStep, ChatbotState } from '@/types/chatbot';
import { CHATBOT_CONSTANTS } from '@/data/constants';
import { validateInput } from '@/utils/validation';
import { emailService } from '@/services/emailService';
import { faqData } from '@/data/faq';
import { v4 as uuidv4 } from 'uuid';

interface DialogManagerProps {
  state: ChatbotState;
  addMessage: (content: string, type: 'bot' | 'user', isQuickReply?: boolean) => void;
  setCurrentStep: (step: FlowStep) => void;
  setSubmissionType: (type: 'offert' | 'bokning') => void;
  updateFormData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const DialogManager: React.FC<DialogManagerProps> = ({
  state,
  addMessage,
  setCurrentStep,
  setSubmissionType,
  updateFormData,
  setLoading,
  setError
}) => {
  
  useEffect(() => {
    // Initialize with welcome message if no messages exist
    if (state.messages.length === 0) {
      addMessage(CHATBOT_CONSTANTS.WELCOME_MESSAGE, 'bot');
      setTimeout(() => {
        addMessage('Vad kan jag hjälpa dig med idag?', 'bot', true);
      }, 1000);
    }
  }, [state.messages.length, addMessage]);

  // Process user messages and handle dialog flow
  useEffect(() => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (!lastMessage || lastMessage.type !== 'user' || state.isLoading) return;

    processUserMessage(lastMessage.content);
  }, [state.messages]);

  const processUserMessage = async (message: string) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate thinking

      switch (state.currentStep) {
        case 'welcome':
          await handleWelcomeStep(message);
          break;
        case 'moveType':
          await handleMoveTypeStep(message);
          break;
        case 'date':
          await handleDateStep(message);
          break;
        case 'fromAddress':
          await handleFromAddressStep(message);
          break;
        case 'toAddress':
          await handleToAddressStep(message);
          break;
        case 'size':
          await handleSizeStep(message);
          break;
        case 'elevator':
          await handleElevatorStep(message);
          break;
        case 'contact':
          await handleContactStep(message);
          break;
        case 'gdpr':
          await handleGdprStep(message);
          break;
        case 'faq':
          await handleFaqStep(message);
          break;
        case 'services':
          await handleServicesStep(message);
          break;
        default:
          addMessage('Förlåt, jag förstod inte det. Kan du upprepa?', 'bot');
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setError('Ett fel uppstod. Försök igen.');
      addMessage('Ett tekniskt fel uppstod. Försök igen eller kontakta oss direkt.', 'bot');
    }

    setLoading(false);
  };

  const handleWelcomeStep = async (message: string) => {
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

  const handleMoveTypeStep = async (message: string) => {
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

  const handleDateStep = async (message: string) => {
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

  const handleFromAddressStep = async (message: string) => {
    // Parse address (simple implementation)
    const parts = message.split(',').map(p => p.trim());
    let street = parts[0] || message;
    let postal = '';
    let city = '';

    // Try to extract postal code and city
    const postalMatch = message.match(/\b\d{5}\b/);
    if (postalMatch) {
      postal = postalMatch[0];
      // Try to find city after postal code
      const cityMatch = message.match(/\d{5}\s+([a-öA-Ö\s]+)/);
      if (cityMatch) {
        city = cityMatch[1].trim();
      }
    }

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

  const handleToAddressStep = async (message: string) => {
    // Parse address (same logic as from address)
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

  const handleSizeStep = async (message: string) => {
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

  const handleElevatorStep = async (message: string) => {
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

  const handleContactStep = async (message: string) => {
    // Simple parsing of contact info
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

  const handleGdprStep = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    const gdprConsent = lowerMessage.includes('ja') || lowerMessage.includes('godkänn') || lowerMessage.includes('accept');

    if (!gdprConsent) {
      addMessage('Du måste godkänna behandling av personuppgifter för att vi ska kunna skicka din offert.', 'bot');
      return;
    }

    updateFormData({ gdprConsent: true });
    
    // Submit the form
    await submitForm();
  };

  const handleFaqStep = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Simple FAQ matching
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

  const handleServicesStep = async (message: string) => {
    addMessage('Vi erbjuder följande tjänster:\n\n• Flyttjänster för privatpersoner och företag\n• Packning och uppackning\n• Montering och demontering av möbler\n• Flyttstädning\n• Magasinering\n• Internationella flyttar\n\nKontakta oss för mer information!', 'bot');
    
    setTimeout(() => {
      addMessage('Vill du begära offert eller boka en flytt?', 'bot', true);
      setCurrentStep('welcome');
    }, 2000);
  };

  const submitForm = async () => {
    try {
      addMessage('Tack! Jag skickar nu ditt ärende...', 'bot');
      setLoading(true);

      const submission = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        type: state.submissionType!,
        data: state.formData as any
      };

      const success = await emailService.sendSubmission(submission);

      if (success) {
        addMessage(`Perfekt! Din ${state.submissionType} har skickats. Du får svar inom 24 timmar på ${state.formData.contact?.email}. Ärendenummer: ${submission.id.slice(0, 8)}`, 'bot');
      } else {
        addMessage('Det uppstod ett problem när ärendet skulle skickas. Kontakta oss direkt på info@smartflytt.se', 'bot');
      }

      setTimeout(() => {
        addMessage('Vill du göra något annat?', 'bot', true);
        setCurrentStep('welcome');
      }, 3000);

    } catch (error) {
      console.error('Submission error:', error);
      addMessage('Ett tekniskt fel uppstod. Kontakta oss direkt på info@smartflytt.se eller 08-12345678', 'bot');
    }
  };

  return null;
};
