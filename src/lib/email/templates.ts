
/**
 * 인증번호 이메일 HTML 템플릿
 */
export function generateVerificationEmailHTML(code: string, email: string): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MealRo 이메일 인증</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f3f4f6;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#ffffff;border-radius:16px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="text-align:center;margin-bottom:30px;">
        <div style="font-size:36px;margin-bottom:8px;">🍽️</div>
        <div style="font-size:28px;font-weight:800;color:#22c55e;">MealRo</div>
        <h1 style="font-size:22px;font-weight:700;color:#111827;margin:12px 0 0;">이메일 인증</h1>
      </div>
      
      <!-- Message -->
      <p style="color:#4b5563;font-size:15px;line-height:1.6;margin-bottom:24px;">
        안녕하세요! MealRo 서비스 이용을 위한 인증번호입니다.<br>
        아래 인증번호를 입력해주세요.
      </p>
      
      <!-- Code Box -->
      <div style="background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%);border:2px solid #22c55e;border-radius:12px;padding:32px;text-align:center;margin:28px 0;">
        <div style="font-size:13px;color:#6b7280;margin-bottom:12px;letter-spacing:0.5px;">인증번호</div>
        <div style="font-size:42px;font-weight:900;color:#15803d;letter-spacing:10px;font-family:'SF Mono',Monaco,'Courier New',monospace;">${code}</div>
      </div>
      
      <!-- Info Box -->
      <div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0;">
        <div style="font-weight:600;color:#1e40af;margin-bottom:8px;">📌 안내사항</div>
        <ul style="margin:0;padding-left:20px;color:#1e40af;font-size:14px;line-height:1.8;">
          <li>인증번호는 <strong>3분</strong> 후 만료됩니다.</li>
          <li>최대 <strong>5회</strong>까지 입력할 수 있습니다.</li>
        </ul>
      </div>
      
      <!-- Warning Box -->
      <div style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0;">
        <div style="font-weight:600;color:#92400e;margin-bottom:8px;">🔒 보안 주의</div>
        <ul style="margin:0;padding-left:20px;color:#92400e;font-size:14px;line-height:1.8;">
          <li>인증번호를 타인에게 공유하지 마세요.</li>
          <li>본인이 요청하지 않았다면 이 메일을 무시하세요.</li>
        </ul>
      </div>
      
      <!-- Footer -->
      <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;">
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          본 메일은 <strong>${email}</strong>로 발송되었습니다.
        </p>
        <p style="color:#9ca3af;font-size:12px;margin:8px 0 0;">
          © 2025 MealRo. All rights reserved.
        </p>
      </div>
      
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * 인증번호 이메일 Plain Text 템플릿
 */
export function generateVerificationEmailText(code: string, email: string): string {
  return `
MealRo 이메일 인증
==================

안녕하세요! MealRo 서비스 이용을 위한 인증번호입니다.

인증번호: ${code}

📌 안내사항
- 인증번호는 3분 후 만료됩니다.
- 최대 5회까지 입력할 수 있습니다.

🔒 보안 주의
- 인증번호를 타인에게 공유하지 마세요.
- 본인이 요청하지 않았다면 이 메일을 무시하세요.

---
본 메일은 ${email}로 발송되었습니다.
© 2026 MealRo. All rights reserved.
  `.trim();
}
