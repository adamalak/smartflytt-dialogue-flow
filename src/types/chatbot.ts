
export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  isQuickReply?: boolean;
}

export interface Address {
  street: string;
  postal: string;
  city: string;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

export interface MoveQuoteData {
  moveType: 'bostad' | 'kontor' | 'annat';
  moveTypeOther?: string;
  date: string;
  from: Address;
  to: Address;
  size: '1 rok' | '2 rok' | 'villa' | 'annat';
  sizeOther?: string;
  elevator: 'ja' | 'nej' | 'båda' | 'ingen';
  contact: ContactInfo;
  gdprConsent: boolean;
}

export interface ChatbotSubmission {
  id: string;
  timestamp: string;
  type: 'offert' | 'bokning';
  data: MoveQuoteData;
}

export type FlowStep = 
  | 'welcome'
  | 'moveType'
  | 'date'
  | 'fromAddress'
  | 'toAddress'
  | 'size'
  | 'elevator'
  | 'contact'
  | 'gdpr'
  | 'summary'
  | 'submitted'
  | 'faq'
  | 'services';

export interface ChatbotState {
  currentStep: FlowStep;
  messages: ChatMessage[];
  formData: Partial<MoveQuoteData>;
  submissionType: 'offert' | 'bokning' | null;
  isLoading: boolean;
  error: string | null;
}

export interface QuickReplyOption {
  label: string;
  value: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'pris' | 'tjänster' | 'försäkring' | 'tid' | 'avbokning' | 'special' | 'kontakt';
}
