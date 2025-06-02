
# CHANGELOG

## [2025-06-02] - Initial Release

### Lagt till

#### Huvudkomponenter
- **Komponent**: `ChatbotContainer` - Huvudlogik för chattflöde med state management, progress tracking och felhantering
- **Komponent**: `ChatMessages` - Renderering av meddelanden med scroll-hantering och dynamiska UI-komponenter
- **Komponent**: `MessageBubble` - Individuella chattbubblor med support för quick replies och användar/bot-meddelanden
- **Komponent**: `LoadingIndicator` - Animerad laddningsindikator med tre hoppande prickar
- **Komponent**: `RoomsSelection` - UI för val av antal rum (1 rok, 2 rok, 3 rok, villa, annat)
- **Komponent**: `AddressInput` - Strukturerad adressinmatning med fält för gata, postnummer och stad
- **Komponent**: `VolumeInput` - Volymuppskattning med numerisk validering
- **Komponent**: `AdditionalInfoInput` - Textfält för ytterligare information och önskemål
- **Komponent**: `DatePicker` - Datumväljare med kalender-UI för flyttdatum
- **Komponent**: `ProgressIndicator` - Visuell stegindikator med progressbar
- **Komponent**: `DialogManager` - Centraliserad hantering av chattdialog och flödeslogik

#### Hooks
- **Hook**: `useChatbotState` - Centraliserad state-hantering med useState callbacks för messages, form data, current step, loading states
- **Hook**: `use-toast` - Toast-meddelanden för användarfeedback

#### Utility-funktioner
- **Funktion**: `stepHandlers.ts` - Hantering av olika chattsteg (welcome, moveType, date, rooms, volume, faq, services, etc.)
- **Funktion**: `messageProcessor.ts` - Huvudprocessor för användarmeddelanden med routing till rätt step handler
- **Funktion**: `addressHandlers.ts` - Specialiserad hantering för från/till-adresser och hissvalidering
- **Funktion**: `contactHandlers.ts` - Hantering av kontaktuppgifter, telefon/email validering och GDPR-samtycke
- **Funktion**: `priceCalculation.ts` - Komplex prisberäkning baserat på volym, distanser och hiss-tillgänglighet
- **Funktion**: `priceCalculationHandler.ts` - Integration av prisberäkning i chattflödet med Supabase edge function calls
- **Funktion**: `formSubmission.ts` - Hantering av slutgiltig inlämning via Supabase med error handling
- **Funktion**: `validation.ts` - Input-validering för datum, email, telefon och andra fält

#### Backend/API-integrationer
- **Supabase Edge Function**: `send-email` - Tre-email-system som skickar bekräftelse till kund, notifiering till ägare och partner-notification
- **Supabase Edge Function**: `calculate-distances` - Google Maps API-integration för distansberäkning från/till bas och mellan adresser
- **Service**: `emailService.ts` - SendGrid-integration som backup för email-leverans
- **Service**: `supabaseEmailService.ts` - Supabase-baserad email-hantering med fallback-logik

#### Data och konfiguration
- **Data**: `constants.ts` - Centraliserade konstanter för välkomstmeddelanden, quick replies, GDPR-text och andra chattbot-konstanter
- **Data**: `faq.ts` - FAQ-databas med kategoriserade frågor och svar
- **Types**: `chatbot.ts` - Omfattande TypeScript-definitioner för ChatMessage, FlowStep, ChatbotState, MoveQuoteData, Address, etc.

#### UI och styling
- **Styling**: Fullständig Tailwind CSS-implementation med gradient-bakgrunder, responsiv design
- **Icons**: Lucide React-ikoner för UI-element
- **Komponenter**: Shadcn/ui-komponenter (Button, Progress, ScrollArea, etc.)

### Funktionalitet
- **Flödeshantering**: Komplett chatbot-flöde från välkomst till slutförd offert
- **Tri-path submission**: Tre olika typer av inlämningar (offert, kontorsflytt, volymuppskattning)
- **Adressvalidering**: Strukturerad adressinmatning med validering
- **Prisberäkning**: Dynamisk prisberäkning baserat på volym, distanser och andra faktorer
- **GDPR-compliance**: Inbyggt GDPR-samtycke i flödet
- **Error handling**: Omfattande felhantering med användarmeddelanden
- **Responsive design**: Fullt responsiv design för alla enheter
- **Quick replies**: Fördefinierade snabbsvar för förbättrad användarupplevelse

### Teknisk arkitektur
- **State management**: Centraliserad state med React hooks
- **Type safety**: Fullständig TypeScript-implementation
- **API integration**: Supabase för backend-funktionalitet
- **Email delivery**: Redundant email-system med SendGrid + Supabase
- **Validation**: Robust input-validering på alla nivåer
- **Error boundaries**: Felhantering på komponent- och application-nivå

