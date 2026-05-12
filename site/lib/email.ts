import { Resend } from "resend";

/**
 * Email sending wrapper. In dev without a RESEND_API_KEY, logs to console.
 */
export async function sendEmail({
  to, subject, html, from
}: { to: string; subject: string; html: string; from?: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const sender = from ?? process.env.EMAIL_FROM ?? "Remedia <onboarding@resend.dev>";

  if (!apiKey) {
    console.log("📧 [DEV] Would send email:", { to, from: sender, subject });
    console.log(html);
    return;
  }
  const resend = new Resend(apiKey);
  await resend.emails.send({ to, from: sender, subject, html });
}

export function unlockEmailHtml({
  name, tier, magicUrl
}: { name: string; tier: string; magicUrl: string }): string {
  return `
  <!DOCTYPE html>
  <html><body style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 560px; margin: auto; color: #222;">
    <div style="background: linear-gradient(135deg, #f4f9f4, #fff); padding: 32px; border-radius: 12px; border: 1px solid #c9e1c8;">
      <h1 style="font-family: Georgia, serif; color: #2c562b; margin: 0 0 8px;">Welcome to Remedia</h1>
      <p>Hi ${name || "there"},</p>
      <p>Thanks for your purchase! Your <strong>${tier}</strong> access is ready.</p>
      <p style="text-align:center; margin: 28px 0;">
        <a href="${magicUrl}"
           style="display:inline-block; background:#376d35; color:white; text-decoration:none;
                  padding: 12px 28px; border-radius: 8px; font-weight: 500;">
          Unlock my encyclopedia →
        </a>
      </p>
      <p style="color: #666; font-size: 13px;">This link is valid for 14 days. If the button doesn't work, paste this URL: ${magicUrl}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
      <p style="color: #999; font-size: 12px;">Educational content only — not medical advice.</p>
    </div>
  </body></html>`;
}
