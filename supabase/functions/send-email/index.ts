
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import sgMail from 'npm:@sendgrid/mail@8.1.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailSubmissionRequest {
  id: string;
  timestamp: string;
  type: 'offert' | 'bokning';
  data: {
    moveType: string;
    moveTypeOther?: string;
    date: string;
    from: {
      street: string;
      postal: string;
      city: string;
    };
    to: {
      street: string;
      postal: string;
      city: string;
    };
    size: string;
    sizeOther?: string;
    elevator: string;
    contact: {
      name: string;
      phone: string;
      email: string;
    };
    gdprConsent: boolean;
  };
}

const formatSubmissionEmail = (submission: EmailSubmissionRequest): string => {
  const { data } = submission;
  
  return `
    <h2>Ny ${submission.type} från Smartflytt Chattbot</h2>
    
    <h3>Ärendeuppgifter</h3>
    <p><strong>Ärende-ID:</strong> ${submission.id}</p>
    <p><strong>Tidpunkt:</strong> ${new Date(submission.timestamp).toLocaleString('sv-SE')}</p>
    <p><strong>Typ:</strong> ${submission.type}</p>
    
    <h3>Flyttuppgifter</h3>
    <p><strong>Typ av flytt:</strong> ${data.moveType}${data.moveTypeOther ? ` (${data.moveTypeOther})` : ''}</p>
    <p><strong>Flyttdatum:</strong> ${data.date}</p>
    <p><strong>Bohagsstorlek:</strong> ${data.size}${data.sizeOther ? ` (${data.sizeOther})` : ''}</p>
    <p><strong>Hiss:</strong> ${data.elevator}</p>
    
    <h3>Adresser</h3>
    <p><strong>Från:</strong><br>
       ${data.from.street}<br>
       ${data.from.postal} ${data.from.city}</p>
    
    <p><strong>Till:</strong><br>
       ${data.to.street}<br>
       ${data.to.postal} ${data.to.city}</p>
    
    <h3>Kontaktuppgifter</h3>
    <p><strong>Namn:</strong> ${data.contact.name}</p>
    <p><strong>Telefon:</strong> ${data.contact.phone}</p>
    <p><strong>E-post:</strong> ${data.contact.email}</p>
    
    <h3>GDPR-samtycke</h3>
    <p><strong>Godkänt:</strong> ${data.gdprConsent ? 'Ja' : 'Nej'}</p>
    
    <hr>
    <p><em>Detta meddelande har genererats automatiskt från Smartflytt Chattbot.</em></p>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sendGridApiKey = Deno.env.get('SEND_GRID_API_KEY');
    
    if (!sendGridApiKey) {
      throw new Error('SendGrid API key not configured');
    }

    sgMail.setApiKey(sendGridApiKey);

    const submission: EmailSubmissionRequest = await req.json();
    
    const emailContent = formatSubmissionEmail(submission);
    
    const msg = {
      to: 'info@smartflytt.se',
      from: 'noreply@smartflytt.se',
      subject: `Ny ${submission.type} från chattbot - ${submission.data.contact.name}`,
      html: emailContent
    };

    await sgMail.send(msg);
    
    console.log('Email sent successfully to:', msg.to);

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
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send email' 
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
