/**
 * Centralized TypeScript type definitions for Smartflytt application
 * Production-grade type safety with strict typing
 */

// Re-export all chatbot types
export * from './chatbot';

// Import specific types that are referenced
import type { 
  Address, 
  DistanceData, 
  PriceCalculation, 
  ChatMessage, 
  ChatbotSubmission 
} from './chatbot';

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = string;
export type Timestamp = string; // ISO 8601 string
export type UUID = string;

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  requestId?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// User and authentication types
export interface User {
  id: UUID;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type UserRole = 'admin' | 'user';

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: Timestamp;
}

// Database record types with proper constraints
export interface DbRecord {
  id: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Lead extends DbRecord {
  submissionType: SubmissionType;
  leadQuality: LeadQuality;
  leadScore: number; // 0-100
  status: LeadStatus;
  
  // Contact information (required)
  name: string; // 1-100 chars
  email: string; // valid email format
  phone: string; // Swedish phone format
  
  // Move details
  moveDate: string; // YYYY-MM-DD format
  fromAddress: Address;
  toAddress: Address;
  volume?: number; // cubic meters, positive number
  
  // Calculated data
  distanceData?: DistanceData;
  priceCalculation?: PriceCalculation;
  
  // Additional info
  additionalInfo?: string; // max 2000 chars
  chatTranscript: ChatMessage[];
  
  // Internal tracking
  companyId?: UUID;
}

export type SubmissionType = 'offert' | 'kontorsflytt' | 'volymuppskattning';
export type LeadQuality = 'high' | 'medium' | 'low';
export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'sold' | 'lost' | 'cancelled';

// Audit trail for sales
export interface LeadSalesAudit extends DbRecord {
  leadUuid: UUID;
  partnerPrice?: number; // SEK, positive integer
  platformCommission?: number; // SEK, positive integer  
  soldAt: Timestamp;
  soldBy?: string; // max 100 chars
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: ApiError;
  errorBoundary?: boolean;
}

export interface UiState extends LoadingState, ErrorState {
  // Additional UI state properties
}

// Analytics and tracking
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: Timestamp;
  userId?: UUID;
  sessionId: string;
}

export interface LeadQualityFactors {
  hasFullContactInfo: boolean;
  hasRealisticVolume: boolean;
  hasNearTermMoveDate: boolean;
  hasCompleteAddresses: boolean;
  hasAdditionalInfo: boolean;
  completedFullFlow: boolean;
}

// Edge function request/response types
export interface EdgeFunctionRequest<T = unknown> {
  data: T;
  userId?: UUID;
  requestId: string;
}

export interface EdgeFunctionResponse<T = unknown> extends ApiResponse<T> {
  latencyMs?: number;
  cached?: boolean;
}

// Distance calculation types
export interface DistanceRequest {
  fromAddress: string;
  toAddress: string;
  baseLatitude: number;
  baseLongitude: number;
}

export interface DistanceResponse extends EdgeFunctionResponse<DistanceData> {
  calculatedAt: Timestamp;
}

// Email service types
export interface EmailRequest {
  submission: ChatbotSubmission;
}

export interface EmailResponse extends EdgeFunctionResponse {
  emailsSent: number;
}

// Configuration and environment types
export interface AppConfig {
  supabaseUrl: string;
  supabasePublishableKey: string;
  gaMeasurementId?: string;
  environment: 'development' | 'production';
}

export interface EdgeFunctionConfig {
  sendGridApiKey: string;
  mapsApiKey: string;
  adminEmailRecipient: string;
  customerSupportEmail: string;
  allowedOrigins: string[];
}

// Testing types
export interface TestContext {
  user?: Partial<User>;
  mockData?: Record<string, unknown>;
  skipAnimations?: boolean;
}

export interface MockApiResponse<T = unknown> extends ApiResponse<T> {
  delay?: number;
  shouldFail?: boolean;
}

// Utility types for better type safety
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// String literal types for better type safety
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type Theme = 'light' | 'dark' | 'system';

// Component prop types
export interface ComponentWithClassName {
  className?: string;
}

export interface ComponentWithChildren {
  children: React.ReactNode;
}

export interface ComponentWithId {
  id?: string;
}

export type BaseComponentProps = ComponentWithClassName & ComponentWithChildren & ComponentWithId;

// Form component types
export interface FormFieldProps<T = string> extends ComponentWithClassName {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: T;
  onChange?: (value: T) => void;
  onBlur?: () => void;
}