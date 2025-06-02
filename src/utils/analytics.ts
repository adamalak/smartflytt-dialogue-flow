
// Google Analytics 4 tracking utilities
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const trackEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, parameters);
  }
};

export const trackFlowStep = (step: string, data?: any) => {
  trackEvent('chatbot_step_completed', {
    step: step,
    timestamp: new Date().toISOString(),
    ...data
  });
};

export const trackConversion = (leadQuality: string, estimatedValue: number, submissionType: string, leadScore?: number, leadFactors?: string[]) => {
  trackEvent('lead_generated', {
    lead_quality: leadQuality,
    lead_score: leadScore,
    lead_factors: leadFactors?.join(', '),
    estimated_value: estimatedValue,
    submission_type: submissionType,
    timestamp: new Date().toISOString()
  });
};

export const trackFormSubmission = (submissionType: 'offert' | 'kontorsflytt' | 'volymuppskattning', formData: any) => {
  trackEvent('form_submission', {
    submission_type: submissionType,
    has_contact_info: !!formData.contact,
    has_addresses: !!(formData.from && formData.to),
    volume: formData.volume || 'unknown',
    timestamp: new Date().toISOString()
  });
};

export const trackErrorEvent = (errorType: string, errorMessage: string, context?: any) => {
  trackEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
    context: context || {},
    timestamp: new Date().toISOString()
  });
};

export const trackFormAbandonment = (currentStep: string, completionPercentage: number) => {
  trackEvent('form_abandoned', {
    abandoned_at_step: currentStep,
    completion_percentage: completionPercentage,
    timestamp: new Date().toISOString()
  });
};

export const trackPriceCalculation = (volume: number, estimatedPrice: number, distanceData?: any) => {
  trackEvent('price_calculated', {
    volume: volume,
    estimated_price: estimatedPrice,
    has_distance_data: !!distanceData,
    timestamp: new Date().toISOString()
  });
};

export const trackVolumeCoordinatorRequest = (reason: string) => {
  trackEvent('volume_coordinator_requested', {
    reason: reason,
    timestamp: new Date().toISOString()
  });
};

export const trackLeadQualityDistribution = (leadQuality: string, leadScore: number, factors: string[]) => {
  trackEvent('lead_quality_calculated', {
    lead_quality: leadQuality,
    lead_score: leadScore,
    scoring_factors: factors.join(', '),
    timestamp: new Date().toISOString()
  });
};
