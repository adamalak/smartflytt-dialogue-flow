
export const CHATBOT_CONSTANTS = {
  WELCOME_MESSAGE: 'Hej! Jag är Smartflytts chattbot och jag hjälper dig gärna att ta fram en **preliminär offert** för din flytt! 🚚',
  
  CONTACT_INFO: {
    email: 'smartflyttlogistik@gmail.com'
  },
  
  VALIDATION_MESSAGES: {
    REQUIRED_FIELD: 'Detta fält är obligatoriskt',
    INVALID_POSTAL: 'Postnummer måste vara fem siffror',
    INVALID_PHONE: 'Telefonnummer måste vara 10 siffror (07XXXXXXXX)',
    INVALID_EMAIL: 'Ange en giltig e-postadress',
    INVALID_DATE: 'Datum måste vara i framtiden och format ÅÅÅÅ-MM-DD',
    INVALID_VOLUME: 'Volym måste vara ett positivt tal i kubikmeter',
    MIN_LENGTH: (min: number) => `Minst ${min} tecken krävs`,
    MIN_CITY_LENGTH: 'Stad måste vara minst 2 bokstäver'
  },
  
  GDPR_TEXT: 'Godkänner du att vi behandlar dina personuppgifter enligt vår integritetspolicy för att kunna ge dig en preliminär offert?',
  GDPR_LINK: 'https://smartflytt.se/integritetspolicy',
  
  BASE_COORDINATES: {
    latitude: 57.708870, // Göteborg centrum
    longitude: 11.974560
  },
  
  QUICK_REPLIES: {
    MOVE_TYPES: [
      { label: 'Bostad', value: 'bostad' },
      { label: 'Kontor', value: 'kontor' },
      { label: 'Annat', value: 'annat' }
    ],
    ROOM_OPTIONS: [
      { label: '1 rok', value: '1 rok' },
      { label: '2 rok', value: '2 rok' },
      { label: '3 rok', value: '3 rok' },
      { label: 'Villa/Hus', value: 'villa' },
      { label: 'Annat', value: 'annat' }
    ],
    ELEVATOR_OPTIONS: [
      { label: 'Ja, båda adresserna', value: 'båda' },
      { label: 'Ja, endast från-adress', value: 'från' },
      { label: 'Ja, endast till-adress', value: 'till' },
      { label: 'Nej, ingen hiss', value: 'ingen' }
    ],
    VOLUME_COORDINATOR: [
      { label: 'Ja, skicka koordinator', value: 'ja' },
      { label: 'Nej, jag anger volym själv', value: 'nej' }
    ],
    MAIN_MENU: [
      { label: 'Begär offert', value: 'offert' },
      { label: 'Vanliga frågor', value: 'faq' },
      { label: 'Om våra tjänster', value: 'services' }
    ]
  }
};
