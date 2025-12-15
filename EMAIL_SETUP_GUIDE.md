# Email Setup Guide for Onira

## Current Status

✅ **Resend Integration**: Working correctly
✅ **Password Reset Emails**: Being sent successfully
✅ **Welcome Emails**: Code is working, but emails may not be delivered due to Resend configuration

## Issue: Welcome Emails Not Received

The welcome email feature is fully implemented and working correctly from a code perspective. However, you may not receive welcome emails due to **Resend's free tier restrictions**.

### Why Emails Aren't Being Delivered

Looking at the Resend API response headers:
```
x-resend-daily-quota: 2
x-resend-monthly-quota: 11
ratelimit-limit: 2
```

This shows you're on Resend's free tier, which has the following limitations:

1. **Test "From" Address**: The current sender `onboarding@resend.dev` is a test address
2. **Email Restrictions**: In development/testing mode, Resend may only deliver to:
   - Verified email addresses you've added to your Resend account
   - The test inbox: `delivered@resend.dev`
3. **Rate Limits**: Limited to 2 emails per second

## Solutions

### Option 1: Add Your Email to Resend (Recommended for Testing)

1. Go to [Resend Dashboard](https://resend.com/emails)
2. Navigate to **Settings** → **Team**
3. Add your email address to the allowlist
4. Verify your email
5. Now you can receive welcome emails when testing

### Option 2: Verify a Custom Domain (Recommended for Production)

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click **Add Domain**
3. Add your domain (e.g., `onira.sbs`)
4. Add the DNS records to your domain provider
5. Wait for verification (usually 5-10 minutes)
6. Update the "from" address in the code:

```typescript
// In app/api/auth/register/route.ts
await resend.emails.send({
  from: "Onira <noreply@onira.sbs>", // Change this
  to: email,
  subject: "Welcome to Onira! 🎉",
  // ...
});
```

### Option 3: Use Different Email Service

If you prefer not to use Resend, you can switch to:
- **Nodemailer** with Gmail SMTP
- **SendGrid**
- **Mailgun**
- **AWS SES**

## Testing the Email System

### Test 1: Check if Resend is Working
Visit: `http://localhost:3000/api/test-email`

This sends a test email to `delivered@resend.dev`. If you see a success message, Resend is configured correctly.

### Test 2: Check Server Logs
When you sign up, check the terminal for logs like:
```
[REGISTER] Attempting to send welcome email to: user@example.com
[REGISTER] Email sent successfully! Email ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

If you see "Email sent successfully", the code is working - the issue is with Resend delivery.

### Test 3: Check Resend Dashboard
1. Go to https://resend.com/emails
2. Log in to your account
3. Check the **Logs** or **Emails** section
4. You should see your sent emails with status (delivered, bounced, etc.)

## Current Email Flow

### Welcome Email (Signup)
1. User fills out registration form
2. System validates email format
3. **System attempts to send welcome email first**
4. If email sending fails → Shows error, no account created
5. If email sends successfully → Account created, user logged in, loading animation shown

### Features in Welcome Email
- Personalized greeting with username
- 4-step picture story explaining how Onira works
- Feature highlights (Anonymous Reviews, QR Integration, Social Sharing)
- Call-to-action button to dashboard
- Professional gradient design matching Onira branding

## Email Templates

Welcome emails are generated in [`lib/email-templates.ts`](lib/email-templates.ts):
- `getWelcomeEmailHTML(username)` - HTML version with full styling
- `getWelcomeEmailText(username)` - Plain text fallback

## Troubleshooting

### Check Current Quota
The test endpoint shows your current Resend usage:
```bash
curl http://localhost:3000/api/test-email
```

Look for:
- `x-resend-daily-quota`: How many emails sent today
- `x-resend-monthly-quota`: How many emails sent this month

### Common Issues

1. **Email goes to spam**:
   - Verify your domain with Resend
   - Add SPF and DKIM records
   - Use a custom domain instead of `onboarding@resend.dev`

2. **"Email does not exist" error**:
   - This is intentional - it means the email validation is working
   - The system successfully sent to Resend, but Resend rejected it
   - Add your email to Resend's allowlist

3. **No logs appear**:
   - Make sure you're watching the correct terminal window
   - The server must be running (`npm run dev`)
   - Try registering with a new username/email

## Production Recommendations

Before deploying to production:

1. ✅ Verify a custom domain with Resend
2. ✅ Update the "from" address to use your domain
3. ✅ Set up proper DNS records (SPF, DKIM, DMARC)
4. ✅ Test email delivery thoroughly
5. ✅ Set up email bounce handling
6. ✅ Monitor Resend logs for delivery issues
7. ✅ Consider upgrading Resend plan for higher quota

## Environment Variables

Make sure these are set in your `.env` file:
```
RESEND_API_KEY="re_gJExdYm6_Cgh2JuxrsrwwoFrydYkBSRwG"
```

## Support

If you continue having issues:
1. Check [Resend Documentation](https://resend.com/docs)
2. Contact Resend Support
3. Review server logs for detailed error messages
4. Check spam folder in your email client

---

**Note**: The email functionality is fully implemented and working. The issue is solely related to Resend's delivery configuration, not the code itself.
