
export const CHATBOT_CONSTANTS = {
  WELCOME_MESSAGE: 'Hej! Jag är Smartflytts chattbot och jag hjälper dig att ta fram en offert för din flytt! 🚚',
  
  CONTACT_INFO: {
    email: 'info@smartflytt.se',
    phone: '08-12345678'
  },
  
  VALIDATION_MESSAGES: {
    REQUIRED_FIELD: 'Detta fält är obligatoriskt',
    INVALID_POSTAL: 'Postnummer måste vara fem siffror',
    INVALID_PHONE: 'Telefonnummer måste vara 10 siffror (07XXXXXXXX)',
    INVALID_EMAIL: 'Ange en giltig e-postadress',
    INVALID_DATE: 'Datum måste vara i framtiden och format ÅÅÅÅ-MM-DD',
    MIN_LENGTH: (min: number) => `Minst ${min} tecken krävs`,
    MIN_CITY_LENGTH: 'Stad måste vara minst 2 bokstäver'
  },
  
  GDPR_TEXT: 'Godkänner du att vi behandlar dina personuppgifter enligt vår integritetspolicy för att kunna ge dig en offert?',
  GDPR_LINK: 'https://smartflytt.se/integritetspolicy',
  
  QUICK_REPLIES: {
    MOVE_TYPES: [
      { label: 'Bostad', value: 'bostad' },
      { label: 'Kontor', value: 'kontor' },
      { label: 'Annat', value: 'annat' }
    ],
    SIZE_OPTIONS: [
      { label: '1 rok', value: '1 rok' },
      { label: '2 rok', value: '2 rok' },
      { label: 'Villa', value: 'villa' },
      { label: 'Annat', value: 'annat' }
    ],
    ELEVATOR_OPTIONS: [
      { label: 'Ja, båda adresserna', value: 'båda' },
      { label: 'Ja, från-adress', value: 'ja' },
      { label: 'Nej, ingen hiss', value: 'ingen' }
    ],
    MAIN_MENU: [
      { label: 'Begär offert', value: 'offert' },
      { label: 'Boka flytt', value: 'bokning' },
      { label: 'Vanliga frågor', value: 'faq' },
      { label: 'Om våra tjänster', value: 'services' }
    ]
  }
};
