export function getPasswordResetEmailHTML(otp: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset OTP</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Password Reset Request</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                Hello,
              </p>
              <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.5;">
                We received a request to reset your password. Use the following One-Time Password (OTP) to complete the process:
              </p>

              <!-- OTP Box -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 20px 40px; display: inline-block;">
                      <span style="color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        ${otp}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                This OTP will expire in <strong>10 minutes</strong>.
              </p>

              <p style="margin: 0 0 20px; color: #666666; font-size: 14px; line-height: 1.5;">
                If you didn't request this password reset, please ignore this email or contact support if you have concerns.
              </p>

              <!-- Warning Box -->
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>Security Tip:</strong> Never share this OTP with anyone. Our team will never ask for your OTP.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">
                Best regards,<br>
                <strong>Onira Team</strong>
              </p>
              <p style="margin: 10px 0 0; color: #999999; font-size: 12px;">
                This is an automated email. Please do not reply to this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getPasswordResetEmailText(otp: string): string {
  return `
Password Reset Request

Hello,

We received a request to reset your password. Use the following One-Time Password (OTP) to complete the process:

OTP: ${otp}

This OTP will expire in 10 minutes.

If you didn't request this password reset, please ignore this email or contact support if you have concerns.

Security Tip: Never share this OTP with anyone. Our team will never ask for your OTP.

Best regards,
Onira Team

This is an automated email. Please do not reply to this message.
  `.trim();
}
