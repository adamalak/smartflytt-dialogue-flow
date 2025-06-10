
# CHANGELOG

## [2025-06-10] - Admin Dashboard & A/B Testing Update

### Lagt till

#### Admin Dashboard System
- **Komponent**: `AdminDashboard` - Komplett admin-panel för lead-hantering med real-time statistik
- **Komponent**: `AdminAuth` - Lösenordsskyddad inloggning för admin-åtkomst
- **Komponent**: `StatisticsCards` - Dashboard-kort som visar totala leads, premium leads, konverteringsgrad och dagsstatistik
- **Komponent**: `LeadsTable` - Interaktiv tabell för lead-hantering med status-uppdatering
- **Sida**: `AdminPage` - Dedikerad admin-sida tillgänglig på `/admin`

#### A/B Testing Infrastructure
- **Utility**: `abTesting.ts` - Komplett A/B testing-system med hash-baserad användar-segmentering
- **Test**: `welcomeMessageTest` - Första A/B test för välkomstmeddelanden med två varianter
- **Funktion**: `getABTestVariant` - Deterministisk variant-tilldelning baserat på användar-ID
- **Funktion**: `trackABTestEvent` - Analytics-spårning för test-exponering och konverteringar
- **Utility**: `userSession.ts` - Hantering av beständiga användar-sessioner för konsistent A/B test-upplevelse

#### Databas-förbättringar
- **Kolumn**: `company_id` tillagd i leads-tabellen för framtida multi-tenant support
- **Index**: Prestanda-optimering för lead_quality, status, created_at och company_id
- **RLS Policies**: Row Level Security för säker admin-åtkomst till lead-data

#### Funktionalitet
- **Real-time statistik**: Live-uppdatering av lead-metrics och konverteringsgrad
- **Status-hantering**: Interaktiv lead-status uppdatering (Ny, Kontaktad, Kvalificerad, Konverterad, Stängd)
- **Mobilanpassning**: Responsiv design för admin-dashboard på alla enheter
- **A/B Test Integration**: Automatisk variant-tilldelning och spårning i chatbot-flödet
- **Analytics Enhancement**: Utökad spårning för A/B test-prestanda och användar-segmentering

### Teknisk arkitektur
- **Authentication**: Lösenordsbaserad admin-autentisering
- **Data Management**: Supabase integration med RLS för säker data-åtkomst
- **A/B Testing**: Deterministisk hash-baserad segmentering för konsistenta användar-upplevelser
- **Performance**: Databas-indexering och optimerad query-hantering
- **UI/UX**: Shadcn/ui komponenter med Tailwind CSS för konsistent design

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
