
import { FAQItem } from '../types/chatbot';

export const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Vad kostar en flytt?',
    answer: 'Priset beror på flera faktorer som avstånd, mängd bohag och vilka tjänster du väljer. Vi ger alltid en kostnadsfri offert som är skräddarsydd för just din flytt. Kontakta oss så räknar vi fram ett exakt pris.',
    category: 'pris'
  },
  {
    id: '2',
    question: 'Vad ingår i en flytt?',
    answer: 'I våra flyttjänster ingår lastning, transport och lossning av ditt bohag. Vi kan även erbjuda extratjänster som packning, montering/demontering av möbler, flyttstädning och magasinering.',
    category: 'tjänster'
  },
  {
    id: '3',
    question: 'Hur lång tid tar en flytt?',
    answer: 'Tiden beror på mängden bohag och avstånd. En mindre lägenhet tar vanligtvis 4-6 timmar, medan en villa kan ta 8-12 timmar. Vi ger dig en tidsuppskattning i din offert.',
    category: 'tid'
  },
  {
    id: '4',
    question: 'Har ni försäkring?',
    answer: 'Ja, vi har fullständig ansvarsförsäkring som täcker ditt bohag under flytten. All personal är försäkrad och vi följer branschens säkerhetsstandarder.',
    category: 'försäkring'
  },
  {
    id: '5',
    question: 'Kan jag avboka eller omboka min flytt?',
    answer: 'Ja, du kan avboka eller omboka din flytt. Vid avbokning mer än 48 timmar innan flyttdatum tas ingen avgift. Vid senare avbokning kan en avgift tillkomma.',
    category: 'avbokning'
  },
  {
    id: '6',
    question: 'Flyttar ni specialföremål som piano eller konstverk?',
    answer: 'Ja, vi har erfarenhet av att flytta känsliga och värdefulla föremål. Vi använder specialemballage och extra försiktighet för piano, konstverk, antikviteter och andra värdesaker.',
    category: 'special'
  },
  {
    id: '7',
    question: 'Vilka tider är ni tillgängliga?',
    answer: 'Vår kundtjänst är öppen måndag-fredag 08:00-17:00. Du kan nå oss på info@smartflytt.se eller 08-12345678. Flyttjänster utförs 07:00-19:00, även helger efter överenskommelse.',
    category: 'kontakt'
  }
];
