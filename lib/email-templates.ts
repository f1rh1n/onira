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

export function getWelcomeEmailHTML(username: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Onira!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">

          <!-- Header with Logo -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px 16px 0 0;">
              <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <span style="font-size: 40px;">🍪</span>
              </div>
              <h1 style="margin: 0 0 10px; color: #ffffff; font-size: 32px; font-weight: 700;">Welcome to Onira!</h1>
              <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 16px;">Your journey to better customer feedback starts here</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 40px 20px;">
              <h2 style="margin: 0 0 15px; color: #333333; font-size: 24px; font-weight: 600;">Hey ${username}! 👋</h2>
              <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                We're excited to have you join the Onira community! You're now part of a platform that's revolutionizing how businesses connect with their customers.
              </p>
            </td>
          </tr>

          <!-- Story Section -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h3 style="margin: 0 0 20px; color: #667eea; font-size: 20px; font-weight: 600;">📖 How Onira Works</h3>

              <!-- Story Step 1 -->
              <table role="presentation" style="width: 100%; margin-bottom: 25px; background: #f8f9fa; border-radius: 12px; padding: 20px;">
                <tr>
                  <td style="width: 60px; vertical-align: top;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">1</div>
                  </td>
                  <td style="vertical-align: top; padding-left: 15px;">
                    <h4 style="margin: 0 0 10px; color: #333; font-size: 18px; font-weight: 600;">Customer Discovers Your Business</h4>
                    <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
                      A customer visits your shop and notices the <strong>Onira logo/QR code</strong> displayed at your counter or on your products.
                    </p>
                    <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #667eea;">
                      <p style="margin: 0; color: #667eea; font-size: 13px; font-weight: 600;">💡 "Hey, they use Onira! Let me check them out."</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Story Step 2 -->
              <table role="presentation" style="width: 100%; margin-bottom: 25px; background: #f8f9fa; border-radius: 12px; padding: 20px;">
                <tr>
                  <td style="width: 60px; vertical-align: top;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">2</div>
                  </td>
                  <td style="vertical-align: top; padding-left: 15px;">
                    <h4 style="margin: 0 0 10px; color: #333; font-size: 18px; font-weight: 600;">Scan & Review</h4>
                    <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
                      The customer <strong>scans your QR code</strong> with their phone and lands on your beautiful Onira profile where they can:
                    </p>
                    <ul style="margin: 10px 0; padding-left: 20px; color: #666; font-size: 14px;">
                      <li>See your business details and previous reviews</li>
                      <li>Leave an anonymous review with a rating</li>
                      <li>Share their experience instantly</li>
                    </ul>
                    <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #764ba2;">
                      <p style="margin: 0; color: #764ba2; font-size: 13px; font-weight: 600;">📱 "Quick scan, easy review - love it!"</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Story Step 3 -->
              <table role="presentation" style="width: 100%; margin-bottom: 25px; background: #f8f9fa; border-radius: 12px; padding: 20px;">
                <tr>
                  <td style="width: 60px; vertical-align: top;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">3</div>
                  </td>
                  <td style="vertical-align: top; padding-left: 15px;">
                    <h4 style="margin: 0 0 10px; color: #333; font-size: 18px; font-weight: 600;">You Receive & Manage Feedback</h4>
                    <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
                      You get notified about the new review in your <strong>dashboard</strong>. You can:
                    </p>
                    <ul style="margin: 10px 0; padding-left: 20px; color: #666; font-size: 14px;">
                      <li>View all reviews in real-time</li>
                      <li>Choose which reviews to make public</li>
                      <li>Track your ratings and feedback trends</li>
                    </ul>
                    <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #667eea;">
                      <p style="margin: 0; color: #667eea; font-size: 13px; font-weight: 600;">💼 "5-star review! Time to share this!"</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Story Step 4 -->
              <table role="presentation" style="width: 100%; margin-bottom: 25px; background: #f8f9fa; border-radius: 12px; padding: 20px;">
                <tr>
                  <td style="width: 60px; vertical-align: top;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">4</div>
                  </td>
                  <td style="vertical-align: top; padding-left: 15px;">
                    <h4 style="margin: 0 0 10px; color: #333; font-size: 18px; font-weight: 600;">Share to Social Media</h4>
                    <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
                      Love a review? <strong>Share it instantly</strong> to Instagram, Facebook, or download as a beautiful image card! Build your reputation and attract more customers.
                    </p>
                    <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #764ba2;">
                      <p style="margin: 0; color: #764ba2; font-size: 13px; font-weight: 600;">📸 "Shared to Instagram Stories - 100+ views already!"</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Features Section -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h3 style="margin: 0 0 20px; color: #667eea; font-size: 20px; font-weight: 600;">✨ What Makes Onira Special?</h3>
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="padding: 10px 0;">
                    <span style="color: #10b981; font-size: 20px; margin-right: 10px;">✓</span>
                    <span style="color: #666; font-size: 15px;"><strong>Anonymous Reviews:</strong> Customers feel comfortable sharing honest feedback</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <span style="color: #10b981; font-size: 20px; margin-right: 10px;">✓</span>
                    <span style="color: #666; font-size: 15px;"><strong>QR Code Integration:</strong> Easy access with a simple scan</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <span style="color: #10b981; font-size: 20px; margin-right: 10px;">✓</span>
                    <span style="color: #666; font-size: 15px;"><strong>Social Sharing:</strong> Turn reviews into marketing content</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <span style="color: #10b981; font-size: 20px; margin-right: 10px;">✓</span>
                    <span style="color: #666; font-size: 15px;"><strong>Beautiful Profile:</strong> Showcase your business professionally</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Section -->
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px;">
                <h3 style="margin: 0 0 15px; color: white; font-size: 22px; font-weight: 600;">Ready to Get Started?</h3>
                <p style="margin: 0 0 20px; color: rgba(255,255,255,0.9); font-size: 15px;">
                  Complete your profile setup and start receiving reviews today!
                </p>
                <a href="https://onira.sbs/dashboard" style="display: inline-block; padding: 15px 40px; background: white; color: #667eea; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                  Go to Dashboard →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">
                Questions? We're here to help!<br>
                Reply to this email or visit our help center.
              </p>
              <p style="margin: 10px 0 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} Onira. All rights reserved.
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

export function getWelcomeEmailText(username: string): string {
  return `
Welcome to Onira!

Hey ${username}!

We're excited to have you join the Onira community! You're now part of a platform that's revolutionizing how businesses connect with their customers.

HOW ONIRA WORKS:

Step 1: Customer Discovers Your Business
A customer visits your shop and notices the Onira logo/QR code displayed at your counter or on your products.

Step 2: Scan & Review
The customer scans your QR code with their phone and lands on your beautiful Onira profile where they can:
- See your business details and previous reviews
- Leave an anonymous review with a rating
- Share their experience instantly

Step 3: You Receive & Manage Feedback
You get notified about the new review in your dashboard. You can:
- View all reviews in real-time
- Choose which reviews to make public
- Track your ratings and feedback trends

Step 4: Share to Social Media
Love a review? Share it instantly to Instagram, Facebook, or download as a beautiful image card!

WHAT MAKES ONIRA SPECIAL?

✓ Anonymous Reviews: Customers feel comfortable sharing honest feedback
✓ QR Code Integration: Easy access with a simple scan
✓ Social Sharing: Turn reviews into marketing content
✓ Beautiful Profile: Showcase your business professionally

Ready to Get Started?
Complete your profile setup and start receiving reviews today!

Visit your dashboard: https://onira.sbs/dashboard

Questions? We're here to help!
Reply to this email or visit our help center.

© ${new Date().getFullYear()} Onira. All rights reserved.
  `.trim();
}
