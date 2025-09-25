/**
 * Smartflytt Send Email Edge Function
 * Production-grade email service with proper security, logging, and error handling
 */

import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.0';
import sgMail from 'npm:@sendgrid/mail@8.1.5';

// Environment-based CORS allowlist for production security
const getAllowedOrigins = (): string[] => {
  const origins = Deno.env.get('ALLOWED_ORIGINS');
  if (!origins) {
    console.warn('ALLOWED_ORIGINS not set, using default');
    return ['https://syfkpifjsnsbdzculmos.supabase.co'];
  }
  return origins.split(',').map(origin => origin.trim());
};

const allowedOrigins = getAllowedOrigins();

const getCorsHeaders = (origin?: string | null) => {
  const isAllowed = origin && allowedOrigins.includes(origin);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
};

// Structured logging interface
interface LogContext {
  requestId: string;
  userId?: string;
  submissionId?: string;
  submissionType?: string;
  event: string;
  level: 'info' | 'warn' | 'error';
  latencyMs?: number;
  error?: string;
  metadata?: Record<string, any>;
}

const log = (context: LogContext) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    ...context,
  };
  console.log(JSON.stringify(logEntry));
};

// TypeScript interfaces for type safety
interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

interface Address {
  street: string;
  postal: string;
  city: string;
}

interface DistanceData {
  movingDistance: number;
  baseToStartDistance: number;
  baseToEndDistance: number;
}

interface PriceCalculation {
  startFee: number;
  elevatorFee: number;
  volumeCost: number;
  distanceCost: number;
  remoteStartSurcharge: number;
  longDistanceSurcharge: number;
  totalPrice: number;
}

interface MoveQuoteData {
  moveType: 'bostad' | 'kontor' | 'annat';
  moveTypeOther?: string;
  date: string;
  from: Address;
  to: Address;
  rooms: '1 rok' | '2 rok' | '3 rok' | 'villa' | 'annat';
  roomsOther?: string;
  volume?: number;
  wantsVolumeCoordinator?: boolean;
  elevator: 'båda' | 'från' | 'till' | 'ingen';
  contact: ContactInfo;
  gdprConsent: boolean;
  additionalInfo?: string;
  distanceData?: DistanceData;
  priceCalculation?: PriceCalculation;
}

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: string;
  isQuickReply?: boolean;
}

interface EmailSubmissionRequest {
  id: string;
  timestamp: string;
  type: 'offert' | 'kontorsflytt' | 'volymuppskattning';
  data: MoveQuoteData;
  chatTranscript: ChatMessage[];
}

// Email template functions with improved formatting
const formatChatTranscript = (messages: ChatMessage[]): string => {
  return messages.map(msg => {
    const time = new Date(msg.timestamp).toLocaleTimeString('sv-SE');
    const sender = msg.type === 'bot' ? 'Chattbot' : 'Kund';
    return `<div class="message-${msg.type}"><span><strong>${sender} (${time}):</strong> ${msg.content}</span></div>`;
  }).join('\n');
};

const formatAdminEmail = (submission: EmailSubmissionRequest): string => {
  const { data, chatTranscript } = submission;
  const chatHtml = formatChatTranscript(chatTranscript);
  
  let priceDisplay = '';
  if (submission.type === 'offert' && data.priceCalculation) {
    priceDisplay = `Preliminär kostnad för kund: **${data.priceCalculation.totalPrice} kr** (inkl. RUT-avdrag)`;
  } else if (submission.type === 'volymuppskattning') {
    priceDisplay = '**Kund önskar volymuppskattning av koordinator.**';
  } else if (submission.type === 'kontorsflytt') {
    priceDisplay = '**Kontorsflytt - kräver personlig hantering.**';
  }

  return `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NY CHATTRANSKRIPTION - Smartflytt Chattbot</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; background-color: #f8f9fa; margin: 0; padding: 0; }
            .email-container { max-width: 750px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
            .content { padding: 30px; }
            .content h2 { color: #2c3e50; font-size: 22px; margin: 30px 0 20px 0; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .chat-transcript { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; max-height: 400px; overflow-y: auto; }
            .message-bot { color: #007bff; margin-bottom: 12px; }
            .message-user { color: #28a745; text-align: right; margin-bottom: 12px; }
            .message-bot span, .message-user span { display: inline-block; padding: 10px 15px; border-radius: 18px; max-width: 80%; line-height: 1.4; }
            .message-bot span { background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-top-left-radius: 4px; }
            .message-user span { background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); border-top-right-radius: 4px; text-align: left; }
            .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .details-table th, .details-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
            .details-table th { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); font-weight: 600; width: 35%; color: #495057; }
            .details-table tr:last-child td { border-bottom: none; }
            .price-display { background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border: 2px solid #28a745; border-radius: 10px; padding: 20px; margin: 25px 0; text-align: center; }
            .price-display p { font-size: 20px; font-weight: 700; color: #155724; margin: 0; }
            .meta-data { background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-top: 25px; font-size: 14px; color: #6c757d; }
            .footer { background-color: #343a40; color: #ffffff; text-align: center; padding: 20px; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>🚚 Ny Chatt Transkription</h1>
                <p>Smartflytt Chattbot - Automatisk Offerthantering</p>
            </div>
            <div class="content">
                <p><strong>Hej Smartflytt Team,</strong></p>
                <p>En ny kund har interagerat med chattbotten och lämnat en förfrågan. Nedan hittar ni den fullständiga transkriptionen samt offertdetaljer.</p>

                <h2>📱 Chattkonversation</h2>
                <div class="chat-transcript">
                    ${chatHtml}
                </div>

                <h2>📋 Offertförfrågan - Sammanfattning</h2>
                <table class="details-table">
                    <tr><th>Typ av flytt</th><td>${data.moveType}${data.moveTypeOther ? ` (${data.moveTypeOther})` : ''}</td></tr>
                    <tr><th>Önskat flyttdatum</th><td>${data.date || 'Ej angivet'}</td></tr>
                    <tr><th>Från adress</th><td>${data.from ? `${data.from.street}, ${data.from.postal} ${data.from.city}` : 'Ej angivet'}</td></tr>
                    <tr><th>Till adress</th><td>${data.to ? `${data.to.street}, ${data.to.postal} ${data.to.city}` : 'Ej angivet'}</td></tr>
                    <tr><th>Antal rum (ROK)</th><td>${data.rooms || 'Ej angivet'}${data.roomsOther ? ` (${data.roomsOther})` : ''}</td></tr>
                    <tr><th>Uppskattad Volym</th><td>${data.volume ? `${data.volume} m³` : (data.wantsVolumeCoordinator ? 'Volymuppskattning av koordinator önskas' : 'Ej angivet')}</td></tr>
                    <tr><th>Hiss på adresser</th><td>${data.elevator || 'Ej angivet'}</td></tr>
                    <tr><th>Kundens namn</th><td>${data.contact?.name || 'Ej angivet'}</td></tr>
                    <tr><th>Kundens e-post</th><td><a href="mailto:${data.contact?.email || ''}">${data.contact?.email || 'Ej angivet'}</a></td></tr>
                    <tr><th>Kundens telefon</th><td><a href="tel:${data.contact?.phone || ''}">${data.contact?.phone || 'Ej angivet'}</a></td></tr>
                    ${data.distanceData ? `
                    <tr><th>Körsträcka (D)</th><td>${data.distanceData.movingDistance} km</td></tr>
                    <tr><th>Bas till start (D_start)</th><td>${data.distanceData.baseToStartDistance} km</td></tr>
                    <tr><th>Bas till slut (D_slut)</th><td>${data.distanceData.baseToEndDistance} km</td></tr>
                    ` : ''}
                    <tr><th>Offert UUID</th><td><code>${submission.id}</code></td></tr>
                </table>

                <div class="price-display">
                    <p>${priceDisplay}</p>
                </div>

                <div class="meta-data">
                    <strong>📅 Tidpunkt för förfrågan:</strong> ${new Date(submission.timestamp).toLocaleString('sv-SE')}<br>
                    <strong>🔄 Automatisk bearbetning:</strong> Slutförd framgångsrikt
                </div>
            </div>
            <div class="footer">
                Detta meddelande skickades automatiskt från Smartflytts chattbot system.
            </div>
        </div>
    </body>
    </html>
  `;
};

const formatCustomerEmail = (submission: EmailSubmissionRequest): string => {
  const { data } = submission;
  
  let priceDisplay = '';
  let volumeNote = '';
  
  if (submission.type === 'offert' && data.priceCalculation) {
    priceDisplay = `Preliminär kostnad: **${data.priceCalculation.totalPrice} kr** (inkl. RUT-avdrag)`;
  } else if (submission.type === 'volymuppskattning') {
    priceDisplay = '**En flyttkoordinator kommer att kontakta dig för volymuppskattning.**';
    volumeNote = '**Notera om volym:** En avgiftsfri volymuppskattning förutsätter att du bokar flytten med oss. Om flytten inte bokas, kommer en avgift för volymuppskattningen att tas ut.';
  } else if (submission.type === 'kontorsflytt') {
    priceDisplay = '**Vi återkommer med personlig kontakt för kontorsflyttar.**';
  }

  return `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Din preliminära offertförfrågan till Smartflytt</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; background-color: #f8f9fa; margin: 0; padding: 0; }
            .email-container { max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
            .content { padding: 30px; }
            .content h2 { color: #2c3e50; font-size: 22px; margin: 30px 0 20px 0; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .content p { margin-bottom: 15px; line-height: 1.6; }
            .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .details-table th, .details-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
            .details-table th { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); font-weight: 600; width: 35%; color: #495057; }
            .details-table tr:last-child td { border-bottom: none; }
            .price-display { background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border: 2px solid #28a745; border-radius: 10px; padding: 20px; margin: 25px 0; text-align: center; }
            .price-display p { font-size: 22px; font-weight: 700; color: #155724; margin: 0; }
            .warning-box { background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border: 1px solid #ffc107; border-radius: 8px; padding: 20px; margin: 20px 0; color: #856404; }
            .important-note { background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%); border: 1px solid #dc3545; border-radius: 8px; padding: 15px; margin: 20px 0; color: #721c24; font-weight: 600; text-align: center; }
            .volume-note { font-style: italic; font-size: 14px; margin-top: 15px; color: #6c757d; }
            .footer { background-color: #343a40; color: #ffffff; text-align: center; padding: 20px; font-size: 14px; }
            .footer a { color: #17a2b8; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>🎉 Tack för din offertförfrågan!</h1>
                <p>Smartflytt - Din flyttpartner</p>
            </div>
            <div class="content">
                <p><strong>Hej ${data.contact?.name || 'Kund'},</strong></p>
                <p>Tack för att du kontaktade Smartflytt! Vi har tagit emot din förfrågan och kommer att behandla den med högsta prioritet.</p>

                ${submission.type === 'offert' ? `
                <div class="important-note">
                    ⚠️ <strong>Viktigt:</strong> Offerten nedan är <strong>preliminär</strong> och baserad på den information du angivit via vår chattbot. En slutgiltig offert bekräftas efter vår personliga kontakt med dig.
                </div>
                ` : ''}

                <h2>📋 Din ${submission.type === 'kontorsflytt' ? 'Kontorsflytt' : 'Preliminära Offert'}förfrågan</h2>
                <table class="details-table">
                    <tr><th>Typ av flytt</th><td>${data.moveType}${data.moveTypeOther ? ` (${data.moveTypeOther})` : ''}</td></tr>
                    ${data.date ? `<tr><th>Önskat flyttdatum</th><td>${data.date}</td></tr>` : ''}
                    ${data.from ? `<tr><th>Från adress</th><td>${data.from.street}, ${data.from.postal} ${data.from.city}</td></tr>` : ''}
                    ${data.to ? `<tr><th>Till adress</th><td>${data.to.street}, ${data.to.postal} ${data.to.city}</td></tr>` : ''}
                    ${data.rooms ? `<tr><th>Antal rum (ROK)</th><td>${data.rooms}${data.roomsOther ? ` (${data.roomsOther})` : ''}</td></tr>` : ''}
                    ${data.volume ? `<tr><th>Uppskattad Volym</th><td>${data.volume} m³</td></tr>` : ''}
                    ${data.elevator ? `<tr><th>Hiss på adresser</th><td>${data.elevator}</td></tr>` : ''}
                    <tr><th>Ditt namn</th><td>${data.contact?.name || 'Ej angivet'}</td></tr>
                    <tr><th>Din e-post</th><td>${data.contact?.email || 'Ej angivet'}</td></tr>
                    ${data.contact?.phone ? `<tr><th>Ditt telefonnummer</th><td>${data.contact.phone}</td></tr>` : ''}
                </table>

                <div class="price-display">
                    <p>${priceDisplay}</p>
                </div>

                ${volumeNote ? `<div class="volume-note">${volumeNote}</div>` : ''}

                <div class="warning-box">
                    <strong>📧 Viktigt meddelande:</strong> Vårt svar kan i sällsynta fall hamna i din skräppostmapp. Kontrollera den om du inte ser något svar inom kort.
                </div>

                <p><strong>⏰ Nästa steg:</strong> Vi kontaktar dig <strong>inom 12 timmar</strong> för att bekräfta din offert och diskutera det önskade flyttdatumet.</p>

                <p>Vi ser fram emot att hjälpa dig med din flytt och göra den så smidig som möjligt!</p>

                <p><strong>Med vänliga hälsningar,</strong><br>
                <strong>Team Smartflytt</strong><br>
                📧 smartflyttlogistik@gmail.com<br>
                🌐 <a href="https://smartflytt.se">smartflytt.se</a></p>
            </div>
            <div class="footer">
                Denna e-post skickades från Smartflytt. 
                <a href="${Deno.env.get('GDPR_LINK') || 'https://smartflytt.se/integritetspolicy'}">Integritetspolicy</a>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Retry mechanism for external API calls
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = Math.min(baseDelay * Math.pow(2, attempt), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Main handler function
const handler = async (req: Request): Promise<Response> => {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  let submission: EmailSubmissionRequest | null = null;

  try {
    // Verify JWT token for authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      log({
        requestId,
        event: 'auth_missing',
        level: 'warn',
        error: 'Missing or invalid authorization header'
      });
      
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Initialize Supabase client for JWT verification
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the JWT token
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      log({
        requestId,
        event: 'auth_failed',
        level: 'warn',
        error: authError?.message || 'Invalid token'
      });
      
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Validate environment variables
    const sendGridApiKey = Deno.env.get('SEND_GRID_API_KEY');
    const adminEmail = Deno.env.get('ADMIN_EMAIL_RECIPIENT');
    const customerSupportEmail = Deno.env.get('CUSTOMER_SUPPORT_EMAIL') || 'smartflyttlogistik@gmail.com';
    
    if (!sendGridApiKey) {
      throw new Error('SendGrid API key not configured');
    }

    // Parse and validate request body
    try {
      submission = await req.json() as EmailSubmissionRequest;
    } catch (parseError) {
      log({
        requestId,
        userId: user.id,
        event: 'request_parse_error',
        level: 'error',
        error: 'Invalid JSON in request body'
      });
      
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Validate required fields
    if (!submission || !submission.id || !submission.type || !submission.data) {
      log({
        requestId,
        userId: user.id,
        event: 'validation_failed',
        level: 'error',
        error: 'Missing required fields in submission'
      });
      
      return new Response(
        JSON.stringify({ error: 'Missing required fields in submission' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    log({
      requestId,
      userId: user.id,
      submissionId: submission.id,
      submissionType: submission.type,
      event: 'email_processing_started',
      level: 'info',
      metadata: {
        hasContact: !!submission.data.contact,
        hasPrice: !!submission.data.priceCalculation
      }
    });

    // Configure SendGrid
    sgMail.setApiKey(sendGridApiKey);

    const emailPromises: Promise<void>[] = [];

    // Email 1: To Admin (Chat transcript and offer details)
    if (adminEmail) {
      const adminEmailContent = formatAdminEmail(submission);
      
      const adminMsg = {
        to: adminEmail,
        from: customerSupportEmail,
        subject: `🔔 NY ${submission.type.toUpperCase()} från chattbot - ${submission.data.contact?.name || 'Okänd kund'}`,
        html: adminEmailContent,
        categories: ['admin-notification', submission.type],
        customArgs: {
          submissionId: submission.id,
          submissionType: submission.type,
          source: 'chatbot'
        }
      };

      emailPromises.push(
        retryWithBackoff(async () => {
          await sgMail.send(adminMsg);
          log({
            requestId,
            userId: user.id,
            submissionId: submission!.id,
            event: 'admin_email_sent',
            level: 'info'
          });
        })
      );
    }

    // Email 2: To Customer (Confirmation with preliminary offer)
    if (submission.data.contact?.email) {
      const customerEmailContent = formatCustomerEmail(submission);
      
      const customerMsg = {
        to: submission.data.contact.email,
        from: customerSupportEmail,
        subject: submission.type === 'offert' 
          ? '✅ Din preliminära flyttoffert från Smartflytt'
          : submission.type === 'kontorsflytt'
          ? '🏢 Kontorsflytt - Vi återkommer inom kort'
          : '📏 Volymuppskattning - Vi kontaktar dig snart',
        html: customerEmailContent,
        categories: ['customer-confirmation', submission.type],
        customArgs: {
          submissionId: submission.id,
          submissionType: submission.type,
          source: 'chatbot'
        }
      };

      emailPromises.push(
        retryWithBackoff(async () => {
          await sgMail.send(customerMsg);
          log({
            requestId,
            userId: user.id,
            submissionId: submission!.id,
            event: 'customer_email_sent',
            level: 'info',
            metadata: {
              customerEmail: submission!.data.contact!.email
            }
          });
        })
      );
    }

    // Send all emails concurrently
    await Promise.all(emailPromises);

    // Save email sent record to database
    try {
      const { error: dbError } = await supabase
        .from('leads')
        .update({ 
          updated_at: new Date().toISOString(),
          // You could add an email_sent_at field if needed
        })
        .eq('id', submission.id);

      if (dbError) {
        log({
          requestId,
          userId: user.id,
          submissionId: submission.id,
          event: 'database_update_failed',
          level: 'warn',
          error: dbError.message
        });
      }
    } catch (dbError) {
      // Log but don't fail the request for database issues
      log({
        requestId,
        userId: user.id,
        submissionId: submission.id,
        event: 'database_update_error',
        level: 'warn',
        error: (dbError as Error).message
      });
    }

    const latencyMs = Date.now() - startTime;
    log({
      requestId,
      userId: user.id,
      submissionId: submission.id,
      submissionType: submission.type,
      event: 'email_processing_completed',
      level: 'info',
      latencyMs,
      metadata: {
        emailsSent: emailPromises.length
      }
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Emails sent successfully',
        submissionId: submission.id,
        requestId 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    
    log({
      requestId,
      userId: submission?.data?.contact?.email ? 'anonymous' : undefined,
      submissionId: submission?.id,
      submissionType: submission?.type,
      event: 'email_processing_failed',
      level: 'error',
      latencyMs,
      error: error.message,
      metadata: {
        stack: error.stack
      }
    });

    return new Response(
      JSON.stringify({ 
        error: 'Failed to send emails',
        message: error.message,
        requestId 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);