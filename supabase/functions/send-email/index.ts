
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import sgMail from 'npm:@sendgrid/mail@8.1.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailSubmissionRequest {
  id: string;
  timestamp: string;
  type: 'offert' | 'kontorsflytt' | 'volymuppskattning';
  data: any;
  chatTranscript: any[];
}

const formatChatTranscript = (messages: any[]): string => {
  return messages.map(msg => {
    const time = new Date(msg.timestamp).toLocaleTimeString('sv-SE');
    const sender = msg.type === 'bot' ? 'Chattbot' : 'Kund';
    return `<div class="message-${msg.type}"><span><strong>${sender} (${time}):</strong> ${msg.content}</span></div>`;
  }).join('\n');
};

const formatOwnerEmail = (submission: EmailSubmissionRequest): string => {
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
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .email-container { max-width: 700px; margin: 20px auto; background-color: #ffffff; padding: 20px 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
            .header h1 { color: #2c3e50; font-size: 24px; margin-top: 10px; }
            .content { padding: 20px 0; }
            .content h2 { color: #2c3e50; font-size: 20px; margin-bottom: 15px; }
            .chat-transcript { background-color: #f9f9f9; border: 1px solid #eee; padding: 15px; border-radius: 5px; max-height: 400px; overflow-y: auto; }
            .message-bot { color: #007bff; margin-bottom: 10px; }
            .message-user { color: #28a745; text-align: right; margin-bottom: 10px; }
            .message-bot span, .message-user span { display: inline-block; padding: 8px 12px; border-radius: 15px; max-width: 80%; }
            .message-bot span { background-color: #e6f2ff; border-top-left-radius: 2px; }
            .message-user span { background-color: #e0ffe0; border-top-right-radius: 2px; }
            .meta-data { font-size: 0.9em; color: #555; margin-top: 20px; border-top: 1px dashed #ddd; padding-top: 10px; }
            .price-display { font-size: 1.2em; font-weight: bold; color: #28a745; text-align: center; margin: 20px 0; padding: 10px; border: 2px dashed #28a745; border-radius: 5px; }
            .footer { text-align: center; padding-top: 20px; margin-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777; }
            .details-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            .details-table th, .details-table td { border: 1px solid #dddddd; padding: 8px; text-align: left; }
            .details-table th { background-color: #f9f9f9; width: 35%; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Ny Chatt Transkription från Smartflytt Chattbot</h1>
            </div>
            <div class="content">
                <p>Hej Smartflytt,</p>
                <p>En ny kund har interagerat med chattbotten. Här är transkriptionen av konversationen samt den preliminära offertförfrågan:</p>

                <h2>Chattkonversation:</h2>
                <div class="chat-transcript">
                    ${chatHtml}
                </div>

                <h2 style="margin-top: 30px;">Preliminär Offertförfrågan (Sammanfattning):</h2>
                <table class="details-table">
                    <tr><th>Typ av flytt:</th><td>${data.moveType}${data.moveTypeOther ? ` (${data.moveTypeOther})` : ''}</td></tr>
                    <tr><th>Önskat flyttdatum:</th><td>${data.date || 'Ej angivet'}</td></tr>
                    <tr><th>Från adress:</th><td>${data.from ? `${data.from.street}, ${data.from.postal} ${data.from.city}` : 'Ej angivet'}</td></tr>
                    <tr><th>Till adress:</th><td>${data.to ? `${data.to.street}, ${data.to.postal} ${data.to.city}` : 'Ej angivet'}</td></tr>
                    <tr><th>Antal rum (ROK):</th><td>${data.rooms || 'Ej angivet'}${data.roomsOther ? ` (${data.roomsOther})` : ''}</td></tr>
                    <tr><th>Uppskattad Volym:</th><td>${data.volume ? `${data.volume} m³` : (data.wantsVolumeCoordinator ? 'Volymuppskattning av koordinator önskas' : 'Ej angivet')}</td></tr>
                    <tr><th>Hiss på adresser:</th><td>${data.elevator || 'Ej angivet'}</td></tr>
                    <tr><th>Kundens namn:</th><td>${data.contact?.name || 'Ej angivet'}</td></tr>
                    <tr><th>Kundens e-post:</th><td>${data.contact?.email || 'Ej angivet'}</td></tr>
                    <tr><th>Kundens telefonnummer:</th><td>${data.contact?.phone || 'Ej angivet'}</td></tr>
                    ${data.distanceData ? `
                    <tr><th>Beräknad körsträcka (D):</th><td>${data.distanceData.movingDistance} km</td></tr>
                    <tr><th>Sträcka från bas (D_start_bas):</th><td>${data.distanceData.baseToStartDistance} km</td></tr>
                    <tr><th>Sträcka till bas (D_slut_bas):</th><td>${data.distanceData.baseToEndDistance} km</td></tr>
                    ` : ''}
                    <tr><th>UUID för offert:</th><td>${submission.id}</td></tr>
                </table>

                <div class="price-display">
                    ${priceDisplay}
                </div>

                <div class="meta-data">
                    Tidpunkt för förfrågan: ${new Date(submission.timestamp).toLocaleString('sv-SE')}
                </div>
            </div>
            <div class="footer">
                Detta meddelande skickades automatiskt från Smartflytts chattbot.
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
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
            .header h1 { color: #2c3e50; font-size: 24px; margin-top: 10px; }
            .content { padding: 20px 0; }
            .content h2 { color: #2c3e50; font-size: 20px; margin-bottom: 15px; }
            .content p { margin-bottom: 10px; }
            .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .details-table th, .details-table td { border: 1px solid #dddddd; padding: 8px; text-align: left; }
            .details-table th { background-color: #f9f9f9; color: #555555; width: 35%; }
            .footer { text-align: center; padding-top: 20px; margin-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777; }
            .footer a { color: #007bff; text-decoration: none; }
            .warning-box { background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 4px; margin-top: 20px; font-size: 14px; }
            .important-note { font-weight: bold; color: #c0392b; margin-top: 15px; text-align: center; }
            .price-display { font-size: 1.4em; font-weight: bold; color: #28a745; text-align: center; margin: 20px 0; padding: 10px; border: 2px dashed #28a745; border-radius: 5px; }
            .volume-note { font-style: italic; font-size: 0.9em; margin-top: 10px; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Tack för din preliminära offertförfrågan!</h1>
            </div>
            <div class="content">
                <p>Hej ${data.contact?.name || 'Kund'},</p>
                <p>Tack för din offertförfrågan till Smartflytt! Vi har tagit emot dina uppgifter och kommer att behandla din förfrågan skyndsamt.</p>

                ${submission.type === 'offert' ? `
                <div class="important-note">
                    Vänligen notera att offerten nedan är **preliminär** och baserad på den information du angivit via vår chattbot samt beräknad körsträcka. En slutgiltig offert bekräftas efter vår personliga kontakt med dig.
                </div>
                ` : ''}

                <h2>Din ${submission.type === 'kontorsflytt' ? 'Kontorsflytt' : 'Preliminära Offert'}förfrågan:</h2>
                <table class="details-table">
                    <tr><th>Typ av flytt:</th><td>${data.moveType}${data.moveTypeOther ? ` (${data.moveTypeOther})` : ''}</td></tr>
                    ${data.date ? `<tr><th>Önskat flyttdatum:</th><td>${data.date}</td></tr>` : ''}
                    ${data.from ? `<tr><th>Från adress:</th><td>${data.from.street}, ${data.from.postal} ${data.from.city}</td></tr>` : ''}
                    ${data.to ? `<tr><th>Till adress:</th><td>${data.to.street}, ${data.to.postal} ${data.to.city}</td></tr>` : ''}
                    ${data.rooms ? `<tr><th>Antal rum (ROK):</th><td>${data.rooms}${data.roomsOther ? ` (${data.roomsOther})` : ''}</td></tr>` : ''}
                    ${data.volume ? `<tr><th>Uppskattad Volym:</th><td>${data.volume} m³</td></tr>` : ''}
                    ${data.elevator ? `<tr><th>Hiss på adresser:</th><td>${data.elevator}</td></tr>` : ''}
                    <tr><th>Ditt namn:</th><td>${data.contact?.name || 'Ej angivet'}</td></tr>
                    <tr><th>Din e-post:</th><td>${data.contact?.email || 'Ej angivet'}</td></tr>
                    ${data.contact?.phone ? `<tr><th>Ditt telefonnummer:</th><td>${data.contact.phone}</td></tr>` : ''}
                </table>

                <div class="price-display">
                    ${priceDisplay}
                </div>

                ${volumeNote ? `<div class="volume-note">${volumeNote}</div>` : ''}

                <div class="warning-box">
                    **Viktigt:** Vårt svar med din offert kan i sällsynta fall hamna i skräppostmappen. Vänligen kontrollera den om du inte ser något svar inom kort.
                </div>

                <p>Vi strävar efter att kontakta dig **inom 12 timmar** för att bekräfta din offert och diskutera det önskade flyttdatumet. Vi ser fram emot att hjälpa dig med din flytt!</p>

                <p>Vänliga hälsningar,</p>
                <p>Team Smartflytt</p>
                <p>E-post: smartflyttlogistik@gmail.com</p>
            </div>
            <div class="footer">
                Denna e-post skickades från Smartflytt. Besök vår integritetspolicy <a href="${Deno.env.get('GDPR_LINK') || 'https://smartflytt.se/integritetspolicy'}">här</a>.
            </div>
        </div>
    </body>
    </html>
  `;
};

const formatPartnerEmail = (submission: EmailSubmissionRequest): string => {
  const { data } = submission;

  return `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ny Flyttoffert från Smartflytt - För Er Översyn</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
            .header h1 { color: #2c3e50; font-size: 24px; margin-top: 10px; }
            .content { padding: 20px 0; }
            .content h2 { color: #2c3e50; font-size: 20px; margin-bottom: 15px; }
            .content p { margin-bottom: 10px; }
            .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .details-table th, .details-table td { border: 1px solid #dddddd; padding: 8px; text-align: left; }
            .details-table th { background-color: #f9f9f9; color: #555555; width: 35%; }
            .footer { text-align: center; padding-top: 20px; margin-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777; }
            .footer a { color: #007bff; text-decoration: none; }
            .price-display { font-size: 1.4em; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0; padding: 10px; border: 2px dashed #007bff; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Ny Preliminär Flyttoffert från Smartflytt</h1>
            </div>
            <div class="content">
                <p>Hej Partner,</p>
                <p>Vi har en ny, **preliminär** offertförfrågan som vi tror kan vara intressant för er. Kunden söker en flytt av nedanstående karaktär. Vänligen notera att detta är en preliminär offert baserad på kundens angivna uppgifter och en maskinell beräkning. Kundens kontaktuppgifter kommer att delas efter att vi har kommit överens om villkoren för uppdraget.</p>

                <h2>Offertdetaljer:</h2>
                <table class="details-table">
                    <tr><th>Typ av flytt:</th><td>${data.moveType}${data.moveTypeOther ? ` (${data.moveTypeOther})` : ''}</td></tr>
                    <tr><th>Önskat flyttdatum:</th><td>${data.date}</td></tr>
                    <tr><th>Från adress (Postnummer, Ort):</th><td>${data.from.postal} ${data.from.city}</td></tr>
                    <tr><th>Till adress (Postnummer, Ort):</th><td>${data.to.postal} ${data.to.city}</td></tr>
                    <tr><th>Antal rum (ROK):</th><td>${data.rooms}${data.roomsOther ? ` (${data.roomsOther})` : ''}</td></tr>
                    <tr><th>Uppskattad Volym:</th><td>${data.volume} m³</td></tr>
                    <tr><th>Hiss på adresser:</th><td>${data.elevator}</td></tr>
                    <tr><th>Beräknad körsträcka:</th><td>${data.distanceData?.movingDistance} km</td></tr>
                    <tr><th>UUID för offert:</th><td>${submission.id}</td></tr>
                </table>

                <div class="price-display">
                    Vår preliminära kostnad för kunden: **${data.priceCalculation?.totalPrice} kr** (inkl. RUT-avdrag)
                </div>

                <p style="margin-top: 20px;">Vänligen svara på detta mail med ert intresse och pris för att utföra flytten. Vi ser fram emot ett fortsatt gott samarbete.</p>

                <p>Med vänliga hälsningar,</p>
                <p>Smartflytt</p>
                <p>E-post: smartflyttlogistik@gmail.com</p>
            </div>
            <div class="footer">
                Detta meddelande skickades från Smartflytt.
            </div>
        </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sendGridApiKey = Deno.env.get('SEND_GRID_API_KEY');
    const adminEmail = Deno.env.get('ADMIN_EMAIL_RECIPIENT');
    const partnerEmail = Deno.env.get('PARTNER_EMAIL_RECIPIENT');
    const customerSupportEmail = Deno.env.get('CUSTOMER_SUPPORT_EMAIL') || 'smartflyttlogistik@gmail.com';
    
    if (!sendGridApiKey) {
      throw new Error('SendGrid API key not configured');
    }

    sgMail.setApiKey(sendGridApiKey);

    const submission: EmailSubmissionRequest = await req.json();
    
    console.log('Processing email submission:', submission.type, submission.id);

    // Email 1: To Owner (Chat transcript and offer details)
    if (adminEmail) {
      const ownerEmailContent = formatOwnerEmail(submission);
      
      const ownerMsg = {
        to: adminEmail,
        from: customerSupportEmail,
        subject: `NY ${submission.type.toUpperCase()} från chattbot - ${submission.data.contact?.name || 'Okänd kund'}`,
        html: ownerEmailContent
      };

      await sgMail.send(ownerMsg);
      console.log('Owner email sent successfully');
    }

    // Email 2: To Customer (Confirmation with preliminary offer)
    if (submission.data.contact?.email) {
      const customerEmailContent = formatCustomerEmail(submission);
      
      const customerMsg = {
        to: submission.data.contact.email,
        from: customerSupportEmail,
        subject: submission.type === 'kontorsflytt' ? 
          'Tack för din kontorsflytt-förfrågan till Smartflytt' :
          'Din preliminära offert från Smartflytt',
        html: customerEmailContent
      };

      await sgMail.send(customerMsg);
      console.log('Customer email sent successfully');
    }

    // Email 3: To Partner (Limited offer details) - only for successful price calculations
    if (partnerEmail && submission.type === 'offert' && submission.data.priceCalculation) {
      const partnerEmailContent = formatPartnerEmail(submission);
      
      const partnerMsg = {
        to: partnerEmail,
        from: customerSupportEmail,
        subject: `Ny preliminär offert från Smartflytt - ${submission.data.from?.city} → ${submission.data.to?.city}`,
        html: partnerEmailContent
      };

      await sgMail.send(partnerMsg);
      console.log('Partner email sent successfully');
    }

    return new Response(
      JSON.stringify({ success: true, submissionId: submission.id }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error sending emails:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send emails' 
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
