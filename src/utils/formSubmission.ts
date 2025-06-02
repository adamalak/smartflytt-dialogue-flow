
import { ChatbotState } from '@/types/chatbot';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { trackFormSubmission, trackConversion, trackErrorEvent } from '@/utils/analytics';

interface SubmissionContext {
  state: ChatbotState;
  addMessage: (content: string, type: 'bot' | 'user', isQuickReply?: boolean) => void;
  setCurrentStep: (step: any) => void;
  setLoading: (loading: boolean) => void;
}

export const submitForm = async (context: SubmissionContext) => {
  const { state, addMessage, setCurrentStep, setLoading } = context;
  
  try {
    addMessage('Tack! Jag skickar nu ditt ärende...', 'bot');
    setLoading(true);

    const submission = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type: state.submissionType!,
      data: state.formData as any,
      chatTranscript: state.messages
    };

    // Track form submission
    trackFormSubmission(state.submissionType!, state.formData);

    console.log('Submitting form via Supabase Edge Function:', submission.type);
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: submission
    });

    if (error) {
      console.error('Submission error:', error);
      trackErrorEvent('submission_failed', error.message, { submissionType: state.submissionType });
      throw error;
    }

    if (data?.success) {
      let successMessage = '';
      let leadQuality = 'medium';
      let estimatedValue = 0;
      
      if (state.submissionType === 'offert') {
        successMessage = `Perfekt! Din preliminära offert har skickats. Du får bekräftelse och vi kontaktar dig inom 12 timmar på ${state.formData.contact?.email}. Ärendenummer: ${submission.id.slice(0, 8)}`;
        leadQuality = 'high';
        estimatedValue = state.formData.priceCalculation?.totalPrice || 5000;
      } else if (state.submissionType === 'kontorsflytt') {
        successMessage = `Tack! Din kontorsflytt-förfrågan har registrerats. Vi återkommer via e-post för att diskutera detaljerna. Ärendenummer: ${submission.id.slice(0, 8)}`;
        leadQuality = 'high';
        estimatedValue = 15000; // Higher value for office moves
      } else if (state.submissionType === 'volymuppskattning') {
        successMessage = `Perfekt! En flyttkoordinator kommer att kontakta dig för volymuppskattning. Vi hör av oss inom 24 timmar på ${state.formData.contact?.email}. Ärendenummer: ${submission.id.slice(0, 8)}`;
        leadQuality = 'medium';
        estimatedValue = 3000;
      }

      // Track conversion
      trackConversion(leadQuality, estimatedValue, state.submissionType!);

      addMessage(successMessage, 'bot');
      addMessage('\n**Viktigt:** Kontrollera din skräppostmapp om du inte ser vårt bekräftelsemail inom kort.', 'bot');
    } else {
      trackErrorEvent('submission_response_error', 'No success in response', { submissionType: state.submissionType });
      addMessage('Det uppstod ett problem när ärendet skulle skickas. Kontakta oss direkt på smartflyttlogistik@gmail.com', 'bot');
    }

    setTimeout(() => {
      addMessage('Vill du göra något annat?', 'bot', true);
      setCurrentStep('welcome');
    }, 3000);

  } catch (error) {
    console.error('Submission error:', error);
    trackErrorEvent('submission_exception', error instanceof Error ? error.message : 'Unknown error', { 
      submissionType: state.submissionType,
      formDataKeys: Object.keys(state.formData)
    });
    addMessage('Ett tekniskt fel uppstod. Kontakta oss direkt på smartflyttlogistik@gmail.com', 'bot');
  } finally {
    setLoading(false);
  }
};
