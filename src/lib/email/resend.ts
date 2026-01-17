
import { Resend } from 'resend';

// Resend Configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Use 'onboarding@resend.dev' for free tier testing if domain not verified
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';

let resend: Resend | null = null;

if (RESEND_API_KEY && !RESEND_API_KEY.includes('placeholder')) {
    resend = new Resend(RESEND_API_KEY);
    console.log('✅ Resend Service initialized');
} else {
    console.warn('⚠️ RESEND_API_KEY not set. Using MOCK EMAIL mode (Console Log Only).');
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
    // [MOCK MODE] If credentials missing, log to console
    if (!resend) {
        console.log('========================================================');
        console.log(`[MOCK EMAIL - Resend] To: ${options.to}`);
        console.log(`[MOCK EMAIL - Resend] Subject: ${options.subject}`);
        console.log(`[MOCK EMAIL - Resend] Body: ${options.text || stripHtml(options.html)}`);
        console.log('========================================================');

        // Extract code for easy testing
        const codeMatch = options.html.match(/<strong[^>]*>(\d{6})<\/strong>/) || options.text?.match(/(\d{6})/);
        if (codeMatch) {
            console.log(`🔑 [MOCK CODE]: ${codeMatch[1]}`);
        }

        return { success: true, messageId: 'mock-resend-id-' + Date.now() };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.html,
            // text: options.text, // Resend handles text automatically if needed, or pass it
        });

        if (error) {
            console.error('❌ Resend send failed:', error);
            return { success: false, error: error.message };
        }

        console.log(`✅ Email sent to ${options.to}, ID: ${data?.id}`);
        return { success: true, messageId: data?.id };
    } catch (err: any) {
        console.error('❌ Resend exception:', err.message);
        return { success: false, error: err.message };
    }
}

// Strip HTML for plain text fallback logging
function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
