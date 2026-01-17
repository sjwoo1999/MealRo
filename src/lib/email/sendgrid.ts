
import sgMail from '@sendgrid/mail';

// SendGrid 초기화
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@mealro.app';

if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
    console.log('✅ SendGrid initialized');
} else {
    console.warn('⚠️ SENDGRID_API_KEY is not set. Email sending will fail.');
}

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
    if (!SENDGRID_API_KEY) {
        console.error('❌ SendGrid API key not configured');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const msg = {
            to: options.to,
            from: EMAIL_FROM,
            subject: options.subject,
            html: options.html,
            text: options.text || stripHtml(options.html),
        };

        const [response] = await sgMail.send(msg);
        const messageId = response.headers['x-message-id'] as string;

        console.log(`✅ Email sent to ${options.to}, messageId: ${messageId}`);
        return { success: true, messageId };
    } catch (error: any) {
        console.error('❌ Email send failed:', error.message);

        // SendGrid 에러 상세 로깅
        if (error.response) {
            console.error('SendGrid error body:', error.response.body);
        }

        return { success: false, error: error.message };
    }
}

// HTML 태그 제거 (plain text 버전용)
function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
