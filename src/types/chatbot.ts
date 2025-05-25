
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

export interface DistanceData {
  movingDistance: number; // D - körsträcka mellan från/till
  baseToStartDistance: number; // D_start_bas
  baseToEndDistance: number; // D_slut_bas
}

export interface PriceCalculation {
  startFee: number;
  elevatorFee: number;
  volumeCost: number;
  distanceCost: number;
  remoteStartSurcharge: number;
  longDistanceSurcharge: number;
  totalPrice: number;
}

export interface MoveQuoteData {
  moveType: 'bostad' | 'kontor' | 'annat';
  moveTypeOther?: string;
  date: string;
  from: Address;
  to: Address;
  rooms: '1 rok' | '2 rok' | '3 rok' | 'villa' | 'annat';
  roomsOther?: string;
  volume?: number; // m³
  wantsVolumeCoordinator?: boolean;
  elevator: 'båda' | 'från' | 'till' | 'ingen';
  contact: ContactInfo;
  gdprConsent: boolean;
  additionalInfo?: string;
  distanceData?: DistanceData;
  priceCalculation?: PriceCalculation;
}

export interface ChatbotSubmission {
  id: string;
  timestamp: string;
  type: 'offert' | 'kontorsflytt' | 'volymuppskattning';
  data: MoveQuoteData;
  chatTranscript: ChatMessage[];
}

export type FlowStep = 
  | 'welcome'
  | 'moveType'
  | 'date'
  | 'fromAddress'
  | 'toAddress'
  | 'rooms'
  | 'volume'
  | 'volumeCoordinator'
  | 'elevator'
  | 'priceCalculation'
  | 'contact'
  | 'gdpr'
  | 'additionalInfo'
  | 'summary'
  | 'submitted'
  | 'faq'
  | 'services';

export interface ChatbotState {
  currentStep: FlowStep;
  messages: ChatMessage[];
  formData: Partial<MoveQuoteData>;
  submissionType: 'offert' | 'kontorsflytt' | 'volymuppskattning' | null;
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
