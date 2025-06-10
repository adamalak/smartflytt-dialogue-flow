
export const SMARTFLYTT_CONFIG = {
  // Company Information
  COMPANY: {
    name: 'Smartflytt',
    tagline: 'Din smarta partner för professionella flyttjänster',
    email: 'hej@smartflytt.se',
    phone: '08-123 45 67',
    website: 'https://smartflytt.se'
  },

  // Bot Configuration
  BOT: {
    name: 'Smartflytt Assistent',
    avatar: '🏠', // Professional house icon instead of truck
    welcomeMessage: 'Hej! Jag hjälper dig att få en skräddarsydd offert för din flytt. Vad kan jag hjälpa dig med?',
    processingMessage: 'Bearbetar din förfrågan...',
    thankYouMessage: 'Tack för din förfrågan! Vi återkommer inom 24 timmar med din personliga offert.'
  },

  // Flow Configuration
  FLOW: {
    initialOptions: [
      { label: 'Begär flyttoffert', value: 'offert', primary: true },
      { label: 'Flytt utomlands', value: 'utomlands', primary: false } // TODO: Implement international moving flow
    ],
    autoProgressDelay: 800, // Shorter delays for snappier feel
    loadingDelay: 500
  },

  // UI Configuration
  UI: {
    colors: {
      primary: 'smartflytt-600',
      primaryHover: 'smartflytt-700',
      background: 'smartflytt-50',
      accent: 'smartflytt-100'
    },
    spacing: {
      message: 'space-y-8', // More generous spacing
      button: 'space-y-4',
      section: 'space-y-6'
    }
  },

  // Validation Messages
  VALIDATION: {
    REQUIRED_FIELD: 'Detta fält måste fyllas i',
    INVALID_POSTAL: 'Ange ett giltigt postnummer (5 siffror)',
    INVALID_PHONE: 'Ange ett giltigt telefonnummer (10 siffror)',
    INVALID_EMAIL: 'Ange en giltig e-postadress',
    INVALID_DATE: 'Välj ett datum i framtiden',
    INVALID_VOLUME: 'Välj en giltig volym'
  },

  // Room Options for Picker
  ROOM_OPTIONS: [
    { label: '1 rum och kök', value: '1rok', m3Estimate: 15 },
    { label: '2 rum och kök', value: '2rok', m3Estimate: 35 },
    { label: '3 rum och kök', value: '3rok', m3Estimate: 55 },
    { label: '4 rum och kök', value: '4rok', m3Estimate: 75 },
    { label: 'Villa/Hus', value: 'villa', m3Estimate: 100 },
    { label: 'Kontor', value: 'kontor', m3Estimate: 40 },
    { label: 'Annat', value: 'annat', m3Estimate: 30 }
  ],

  // Volume Options for Picker (cubic meters)
  VOLUME_OPTIONS: Array.from({ length: 40 }, (_, i) => ({
    label: `${(i + 1) * 5} m³`,
    value: (i + 1) * 5
  })),

  // Success Page Configuration
  SUCCESS: {
    title: 'Tack för din förfrågan!',
    subtitle: 'Vi återkommer inom 24 timmar',
    nextSteps: [
      'Vi granskar din förfrågan noggrant',
      'Du får en personlig offert via e-post inom 24h',
      'Ring oss för snabbare hantering'
    ],
    callToAction: {
      primary: 'Ring nu för direktsvar',
      secondary: 'Skicka e-post'
    }
  },

  // GDPR Configuration
  GDPR: {
    text: 'Jag godkänner att Smartflytt behandlar mina personuppgifter för att kunna lämna offert enligt integritetspolicyn.',
    link: 'https://smartflytt.se/integritetspolicy'
  }
};

// Legacy constants for backward compatibility (will be removed)
export const CHATBOT_CONSTANTS = {
  WELCOME_MESSAGE: SMARTFLYTT_CONFIG.BOT.welcomeMessage,
  CONTACT_INFO: SMARTFLYTT_CONFIG.COMPANY,
  VALIDATION_MESSAGES: SMARTFLYTT_CONFIG.VALIDATION,
  GDPR_TEXT: SMARTFLYTT_CONFIG.GDPR.text,
  GDPR_LINK: SMARTFLYTT_CONFIG.GDPR.link
};
