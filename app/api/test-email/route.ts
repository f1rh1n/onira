import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function GET() {
  try {
    console.log("[TEST-EMAIL] Testing Resend configuration...");
    console.log("[TEST-EMAIL] RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
    console.log("[TEST-EMAIL] API Key (first 10 chars):", process.env.RESEND_API_KEY?.substring(0, 10));

    const result = await resend.emails.send({
      from: "Onira <onboarding@resend.dev>",
      to: "delivered@resend.dev", // Resend's test email
      subject: "Test Email from Onira",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1>Test Email</h1>
          <p>This is a test email to verify Resend configuration.</p>
          <p>If you receive this, Resend is working correctly!</p>
        </div>
      `,
      text: "This is a test email to verify Resend configuration. If you receive this, Resend is working correctly!",
    });

    console.log("[TEST-EMAIL] Email sent successfully!");
    console.log("[TEST-EMAIL] Result:", JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      emailId: result.data?.id,
      result: result,
    });
  } catch (error: any) {
    console.error("[TEST-EMAIL] Error sending test email:", error);
    console.error("[TEST-EMAIL] Error details:", JSON.stringify(error, null, 2));

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send test email",
        details: error,
      },
      { status: 500 }
    );
  }
}
