
import { ChatbotState } from '@/types/chatbot';
import { supabaseEmailService } from '@/services/supabaseEmailService';
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
      data: state.formData as any
    };

    console.log('Submitting form via Supabase Edge Function');
    const success = await supabaseEmailService.sendSubmission(submission);

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
  } finally {
    setLoading(false);
  }
};
