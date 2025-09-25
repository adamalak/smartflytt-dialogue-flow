/**
 * Swedish Copy/Text Content for Smartflytt Application
 * Centralized location for all user-facing text in Swedish
 */

export const COPY = {
  // Common UI elements
  COMMON: {
    YES: 'Ja',
    NO: 'Nej',
    CONTINUE: 'Fortsätt',
    BACK: 'Tillbaka',
    CANCEL: 'Avbryt',
    SAVE: 'Spara',
    LOADING: 'Laddar...',
    ERROR: 'Ett fel uppstod',
    SUCCESS: 'Framgång!',
    REQUIRED_FIELD: 'Detta fält är obligatoriskt',
    INVALID_EMAIL: 'Ogiltig e-postadress',
    INVALID_PHONE: 'Ogiltigt telefonnummer',
    INVALID_POSTAL: 'Ogiltigt postnummer'
  },

  // Chatbot messages and labels
  CHATBOT: {
    WELCOME_MESSAGE: 'Hej! Jag hjälper dig att få en kostnadsfri offert för din flytt. Låt oss börja med några frågor.',
    WELCOME_QUESTION: 'Vad kan jag hjälpa dig med idag?',
    
    // Move type
    MOVE_TYPE_QUESTION: 'Vilken typ av flytt behöver du hjälp med?',
    MOVE_TYPE_HOME: 'Bostadsflytt',
    MOVE_TYPE_OFFICE: 'Kontorsflytt',
    MOVE_TYPE_OTHER: 'Annat',
    MOVE_TYPE_OTHER_PLACEHOLDER: 'Beskriv din flytt...',
    
    // Date selection
    DATE_QUESTION: 'När vill du helst flytta?',
    DATE_PLACEHOLDER: 'Välj datum',
    DATE_FLEXIBLE: 'Jag är flexibel med datumet',
    
    // Address inputs
    FROM_ADDRESS_QUESTION: 'Vilken adress ska vi flytta från?',
    TO_ADDRESS_QUESTION: 'Vilken adress ska vi flytta till?',
    ADDRESS_STREET_PLACEHOLDER: 'Gatuadress',
    ADDRESS_POSTAL_PLACEHOLDER: 'Postnummer',
    ADDRESS_CITY_PLACEHOLDER: 'Ort',
    
    // Room selection
    ROOMS_QUESTION: 'Hur många rum har bostaden du flyttar från?',
    ROOMS_1: '1 rum och kök',
    ROOMS_2: '2 rum och kök',
    ROOMS_3: '3 rum och kök',
    ROOMS_VILLA: 'Villa/Hus',
    ROOMS_OTHER: 'Annat',
    ROOMS_OTHER_PLACEHOLDER: 'Antal rum...',
    
    // Volume
    VOLUME_QUESTION: 'Ungefär hur många kubikmeter (m³) uppskattar du att du har att flytta?',
    VOLUME_COORDINATOR_QUESTION: 'Skulle du vilja att en av våra koordinatorer kommer hem till dig för en kostnadsfri volymuppskattning?',
    VOLUME_COORDINATOR_NOTE: 'En volymuppskattning på plats ger dig en mer exakt offert.',
    VOLUME_PLACEHOLDER: 'Antal m³',
    
    // Elevator
    ELEVATOR_QUESTION: 'Finns det hiss på någon av adresserna?',
    ELEVATOR_BOTH: 'Både från och till',
    ELEVATOR_FROM: 'Endast från-adress',
    ELEVATOR_TO: 'Endast till-adress',
    ELEVATOR_NONE: 'Ingen hiss',
    
    // Contact information
    CONTACT_QUESTION: 'Så får vi kontakt med dig för att slutföra offerten.',
    CONTACT_NAME_PLACEHOLDER: 'Ditt namn',
    CONTACT_EMAIL_PLACEHOLDER: 'Din e-postadress',
    CONTACT_PHONE_PLACEHOLDER: 'Ditt telefonnummer',
    
    // GDPR consent
    GDPR_QUESTION: 'För att slutföra din offert behöver vi ditt samtycke för att behandla dina personuppgifter.',
    GDPR_CONSENT_TEXT: 'Jag samtycker till att Smartflytt behandlar mina personuppgifter för att kunna ge mig en offert. Jag förstår att jag kan återkalla mitt samtycke när som helst.',
    GDPR_PRIVACY_LINK: 'Läs vår integritetspolicy',
    
    // Additional info
    ADDITIONAL_INFO_QUESTION: 'Har du något annat du vill berätta om flytten?',
    ADDITIONAL_INFO_PLACEHOLDER: 'Beskriv eventuella specialförhållanden, stora möbler, eller andra önskemål...',
    ADDITIONAL_INFO_SKIP: 'Hoppa över',
    
    // Price calculation
    PRICE_CALCULATING: 'Beräknar din preliminära offert...',
    PRICE_CALCULATION_ERROR: 'Vi kunde inte beräkna priset just nu. Vi kommer att kontakta dig med en offert.',
    
    // Summary
    SUMMARY_TITLE: 'Sammanfattning av din flyttförfrågan',
    SUMMARY_EDIT: 'Redigera',
    SUMMARY_SUBMIT: 'Skicka förfrågan',
    
    // Thank you page
    THANK_YOU_TITLE: 'Tack för din förfrågan!',
    THANK_YOU_MESSAGE: 'Vi har tagit emot din offertförfrågan och kommer att kontakta dig inom 12 timmar.',
    THANK_YOU_EMAIL_NOTE: 'Du kommer att få en bekräftelse via e-post inom kort.',
    THANK_YOU_NEW_QUOTE: 'Begär ny offert',
    
    // Error messages
    ERROR_GENERIC: 'Något gick fel. Försök igen senare.',
    ERROR_NETWORK: 'Nätverksfel. Kontrollera din internetanslutning.',
    ERROR_VALIDATION: 'Vänligen kontrollera dina uppgifter och försök igen.',
    
    // Quick replies
    QUICK_REPLY_GET_QUOTE: 'Få offert',
    QUICK_REPLY_OFFICE_MOVE: 'Kontorsflytt',
    QUICK_REPLY_VOLUME_HELP: 'Volymhjälp',
    QUICK_REPLY_FAQ: 'Vanliga frågor'
  },

  // Admin interface
  ADMIN: {
    TITLE: 'Smartflytt Admin',
    LOGIN_TITLE: 'Logga in',
    LOGIN_EMAIL: 'E-postadress',
    LOGIN_PASSWORD: 'Lösenord',
    LOGIN_BUTTON: 'Logga in',
    LOGIN_ERROR: 'Ogiltiga inloggningsuppgifter',
    LOGOUT: 'Logga ut',
    
    DASHBOARD_TITLE: 'Admin Dashboard',
    LEADS_TABLE_TITLE: 'Kundförfrågningar',
    STATISTICS_TITLE: 'Statistik',
    
    LEADS_COLUMNS: {
      NAME: 'Namn',
      EMAIL: 'E-post',
      PHONE: 'Telefon',
      MOVE_DATE: 'Flyttdatum',
      STATUS: 'Status', 
      LEAD_QUALITY: 'Kvalitet',
      LEAD_SCORE: 'Poäng',
      VOLUME: 'Volym',
      CREATED: 'Skapad',
      ACTIONS: 'Åtgärder'
    },
    
    STATUS_OPTIONS: {
      NEW: 'Ny',
      CONTACTED: 'Kontaktad',
      QUOTED: 'Offererad',
      SOLD: 'Såld',
      LOST: 'Förlorad',
      CANCELLED: 'Avbruten'
    },
    
    QUALITY_LEVELS: {
      HIGH: 'Hög',
      MEDIUM: 'Medium',
      LOW: 'Låg'
    },
    
    ACTIONS: {
      VIEW: 'Visa',
      EDIT: 'Redigera',
      DELETE: 'Ta bort',
      EXPORT: 'Exportera',
      REFRESH: 'Uppdatera'
    }
  },

  // Validation messages
  VALIDATION: {
    REQUIRED: 'Detta fält är obligatoriskt',
    EMAIL_INVALID: 'Ange en giltig e-postadress',
    PHONE_INVALID: 'Ange ett giltigt svenskt telefonnummer (t.ex. 070-123 45 67)',
    POSTAL_INVALID: 'Ange ett giltigt svenskt postnummer (t.ex. 123 45)',
    DATE_INVALID: 'Välj ett giltigt datum',
    DATE_PAST: 'Datumet kan inte vara i det förflutna',
    VOLUME_INVALID: 'Volymen måste vara ett positivt tal',
    VOLUME_TOO_HIGH: 'Volymen verkar orealistiskt hög. Kontrollera värdet.',
    NAME_TOO_SHORT: 'Namnet måste vara minst 2 tecken',
    NAME_TOO_LONG: 'Namnet får vara max 100 tecken',
    ADDITIONAL_INFO_TOO_LONG: 'Ytterligare information får vara max 2000 tecken'
  },

  // Price display
  PRICE: {
    PRELIMINARY_TITLE: 'Preliminär kostnad',
    BREAKDOWN_TITLE: 'Prisuppdelning',
    START_FEE: 'Startavgift',
    ELEVATOR_FEE: 'Hisstillägg',
    VOLUME_COST: 'Volymkostnad',
    DISTANCE_COST: 'Avståndskostnad',
    REMOTE_SURCHARGE: 'Avlägsenhetstillägg',
    LONG_DISTANCE_SURCHARGE: 'Långdistanstillägg',
    TOTAL_PRICE: 'Totalt pris',
    PRICE_INCLUDES_RUT: 'Priset inkluderar RUT-avdrag',
    PRICE_DISCLAIMER: 'Detta är en preliminär offert baserad på dina uppgifter. Slutligt pris bekräftas efter personlig kontakt.'
  },

  // Success and error messages
  MESSAGES: {
    SUBMISSION_SUCCESS: 'Din förfrågan har skickats framgångsrikt!',
    SUBMISSION_ERROR: 'Ett fel uppstod när vi skulle skicka din förfrågan. Försök igen.',
    EMAIL_SENT: 'E-post skickad framgångsrikt',
    EMAIL_ERROR: 'Kunde inte skicka e-post',
    LEAD_UPDATED: 'Kundförfrågan uppdaterad',
    LEAD_UPDATE_ERROR: 'Kunde inte uppdatera kundförfrågan',
    NETWORK_ERROR: 'Nätverksfel. Kontrollera din internetanslutning och försök igen.',
    UNAUTHORIZED: 'Du har inte behörighet att utföra denna åtgärd',
    SESSION_EXPIRED: 'Din session har gått ut. Logga in igen.'
  },

  // Accessibility
  A11Y: {
    SKIP_TO_CONTENT: 'Hoppa till huvudinnehåll',
    OPEN_CHATBOT: 'Öppna Smartflytt chattbot',
    CLOSE_CHATBOT: 'Stäng chattbot',
    LOADING_CONTENT: 'Laddar innehåll',
    ERROR_OCCURRED: 'Ett fel uppstod',
    FORM_HAS_ERRORS: 'Formuläret innehåller fel som behöver åtgärdas',
    REQUIRED_FIELD_INDICATOR: 'obligatoriskt fält',
    MENU_TOGGLE: 'Växla meny',
    CURRENT_PAGE: 'aktuell sida'
  },

  // Meta information for SEO
  META: {
    SITE_NAME: 'Smartflytt',
    SITE_DESCRIPTION: 'Få en kostnadsfri flyttoffert från Smartflytt. Proffsig flyttjänst i hela Sverige med transparenta priser och pålitlig service.',
    HOME_TITLE: 'Smartflytt - Kostnadsfri Flyttoffert Online',
    ADMIN_TITLE: 'Admin Dashboard - Smartflytt',
    KEYWORDS: 'flytt, flyttfirma, flyttjänst, offert, kostnadsfri, Sverige, flytthjälp, professionell flytt'
  },

  // Company information
  COMPANY: {
    NAME: 'Smartflytt',
    TAGLINE: 'Din smarta flyttpartner',
    EMAIL: 'smartflyttlogistik@gmail.com',
    WEBSITE: 'https://smartflytt.se',
    SUPPORT_HOURS: 'Måndag-Fredag 08:00-17:00'
  }
} as const;

// Type-safe helper for accessing copy
export type CopyKey = keyof typeof COPY;
export type CommonCopyKey = keyof typeof COPY.COMMON;
export type ChatbotCopyKey = keyof typeof COPY.CHATBOT;
export type AdminCopyKey = keyof typeof COPY.ADMIN;