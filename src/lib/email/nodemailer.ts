
import nodemailer from 'nodemailer';

// Gmail SMTP Configuration
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const EMAIL_FROM = GMAIL_USER || 'noreply@mealro.app';

let transporter: nodemailer.Transporter | null = null;

if (GMAIL_USER && GMAIL_APP_PASSWORD && !GMAIL_APP_PASSWORD.includes('placeholder')) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD,
        },
    });
    console.log('✅ Nodemailer (Gmail) initialized');
} else {
    console.warn('⚠️ GMAIL_USER or GMAIL_APP_PASSWORD not set. Using MOCK EMAIL mode (Console Log Only).');
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
    if (!transporter) {
        console.log('========================================================');
        console.log(`[MOCK EMAIL - Nodemailer] To: ${options.to}`);
        console.log(`[MOCK EMAIL - Nodemailer] Subject: ${options.subject}`);
        console.log(`[MOCK EMAIL - Nodemailer] Body: ${options.text || stripHtml(options.html)}`);
        console.log('========================================================');

        // Extract code for easy testing
        const codeMatch = options.html.match(/<strong[^>]*>(\d{6})<\/strong>/) || options.text?.match(/(\d{6})/);
        if (codeMatch) {
            console.log(`🔑 [MOCK CODE]: ${codeMatch[1]}`);
        }

        return { success: true, messageId: 'mock-gmail-id-' + Date.now() };
    }

    try {
        const info = await transporter.sendMail({
            from: `"MealRo" <${EMAIL_FROM}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text || stripHtml(options.html),
        });

        console.log(`✅ Email sent to ${options.to}, messageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error('❌ Nodemailer send failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Strip HTML for plain text fallback
function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
