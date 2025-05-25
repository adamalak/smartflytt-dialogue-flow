
import { supabase } from '@/integrations/supabase/client';
import { ChatbotSubmission } from '@/types/chatbot';

class SupabaseEmailService {
  async sendSubmission(submission: ChatbotSubmission): Promise<boolean> {
    try {
      console.log('Sending submission via Supabase Edge Function:', submission.id);
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: submission
      });

      if (error) {
        console.error('Supabase function error:', error);
        return false;
      }

      if (data?.success) {
        console.log('Email sent successfully via Edge Function');
        return true;
      } else {
        console.error('Email sending failed:', data?.error);
        return false;
      }
    } catch (error) {
      console.error('Error calling email function:', error);
      return false;
    }
  }
}

export const supabaseEmailService = new SupabaseEmailService();
