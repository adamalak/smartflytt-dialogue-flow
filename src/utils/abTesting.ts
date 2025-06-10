
export interface ABTest {
  name: string;
  variants: {
    control: any;
    variant: any;
  };
  trafficSplit: number;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const getABTestVariant = (testName: string, userId: string): 'control' | 'variant' => {
  const hash = simpleHash(userId + testName);
  return hash % 100 < 50 ? 'control' : 'variant';
};

export const welcomeMessageTest: ABTest = {
  name: 'welcome_message',
  variants: {
    control: "Hej! Jag hjälper dig att få en snabb och gratis flyttoffert. Ska vi börja?",
    variant: "Få 3 konkurrenskraftiga flyttofferter på bara 2 minuter! Helt gratis. Redo att börja?"
  },
  trafficSplit: 0.5
};

// Track A/B test exposure and conversion events
export const trackABTestEvent = (testName: string, variant: 'control' | 'variant', eventType: 'exposure' | 'conversion', userId: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'ab_test_event', {
      test_name: testName,
      variant: variant,
      event_type: eventType,
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  }
};
