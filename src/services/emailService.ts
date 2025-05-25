import sgMail from '@sendgrid/mail';
import { ChatbotSubmission } from '../types/chatbot';
import { config, validateConfig } from '../utils/config';

class EmailService {
  private isInitialized = false;

  private initialize() {
    if (this.isInitialized) return;
    
    const validation = validateConfig();
    if (!validation.isValid) {
      console.error('Email service configuration errors:', validation.errors);
      return;
    }
    
    sgMail.setApiKey(config.sendgridApiKey!);
    this.isInitialized = true;
  }

  async sendSubmission(submission: ChatbotSubmission): Promise<boolean> {
    try {
      this.initialize();
      
      if (!this.isInitialized) {
        throw new Error('SendGrid not properly initialized - check environment variables');
      }
      
      const emailContent = this.formatSubmissionEmail(submission);
      
      const msg = {
        to: config.adminEmailRecipient,
        from: 'noreply@smartflytt.se',
        subject: `Ny ${submission.type} från chattbot - ${submission.data.contact.name}`,
        html: emailContent
      };

      await sgMail.send(msg);
      console.log('Email sent successfully to:', config.adminEmailRecipient);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  private formatSubmissionEmail(submission: ChatbotSubmission): string {
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
  }
}

export const emailService = new EmailService();
