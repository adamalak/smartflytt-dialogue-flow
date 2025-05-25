
import { ChatbotState } from '@/types/chatbot';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

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

    console.log('Submitting form via Supabase Edge Function:', submission.type);
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: submission
    });

    if (error) {
      console.error('Submission error:', error);
      throw error;
    }

    if (data?.success) {
      let successMessage = '';
      
      if (state.submissionType === 'offert') {
        successMessage = `Perfekt! Din preliminära offert har skickats. Du får bekräftelse och vi kontaktar dig inom 12 timmar på ${state.formData.contact?.email}. Ärendenummer: ${submission.id.slice(0, 8)}`;
      } else if (state.submissionType === 'kontorsflytt') {
        successMessage = `Tack! Din kontorsflytt-förfrågan har registrerats. Vi återkommer via e-post för att diskutera detaljerna. Ärendenummer: ${submission.id.slice(0, 8)}`;
      } else if (state.submissionType === 'volymuppskattning') {
        successMessage = `Perfekt! En flyttkoordinator kommer att kontakta dig för volymuppskattning. Vi hör av oss inom 24 timmar på ${state.formData.contact?.email}. Ärendenummer: ${submission.id.slice(0, 8)}`;
      }

      addMessage(successMessage, 'bot');
      addMessage('\n**Viktigt:** Kontrollera din skräppostmapp om du inte ser vårt bekräftelsemail inom kort.', 'bot');
    } else {
      addMessage('Det uppstod ett problem när ärendet skulle skickas. Kontakta oss direkt på smartflyttlogistik@gmail.com', 'bot');
    }

    setTimeout(() => {
      addMessage('Vill du göra något annat?', 'bot', true);
      setCurrentStep('welcome');
    }, 3000);

  } catch (error) {
    console.error('Submission error:', error);
    addMessage('Ett tekniskt fel uppstod. Kontakta oss direkt på smartflyttlogistik@gmail.com', 'bot');
  } finally {
    setLoading(false);
  }
};
