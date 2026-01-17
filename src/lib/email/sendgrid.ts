
import sgMail from '@sendgrid/mail';

// SendGrid 초기화
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@mealro.app';

if (SENDGRID_API_KEY && !SENDGRID_API_KEY.includes('placeholder')) {
    sgMail.setApiKey(SENDGRID_API_KEY);
    console.log('✅ SendGrid initialized');
} else {
    console.warn('⚠️ SENDGRID_API_KEY not set or invalid. Using MOCK EMAIL mode (Console Log Only).');
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
    // [MOCK MODE] 개발 환경이거나 키가 없을 때 콘솔에 코드 출력하고 성공 처리
    if (!SENDGRID_API_KEY || SENDGRID_API_KEY.includes('placeholder')) {
        console.log('========================================================');
        console.log(`[MOCK EMAIL] To: ${options.to}`);
        console.log(`[MOCK EMAIL] Subject: ${options.subject}`);
        console.log(`[MOCK EMAIL] Body (Text): ${options.text || stripHtml(options.html)}`);
        console.log('========================================================');

        // 인증번호 추출 (로그에서 쉽게 찾기 위해)
        const codeMatch = options.html.match(/<strong[^>]*>(\d{6})<\/strong>/) || options.text?.match(/(\d{6})/);
        if (codeMatch) {
            console.log(`🔑 [MOCK CODE]: ${codeMatch[1]}`);
        }

        return { success: true, messageId: 'mock-id-' + Date.now() };
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
