import "server-only";

/**
 * Team notification email.
 *
 * NOTE: this project has no transactional email provider wired up — the
 * contact form only writes to the `inquiries` table. This module is the hook
 * for one: set RESEND_API_KEY and TEAM_NOTIFICATION_EMAIL and notifications
 * start sending, with no other code change. Until then it logs server-side.
 *
 * Deliberately never throws. A notification is a side effect of the client's
 * action; if the mail provider is down, the client's message must still save.
 */
export async function notifyTeam(
  subject: string,
  lines: string[],
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.TEAM_NOTIFICATION_EMAIL;
  const from = process.env.TEAM_NOTIFICATION_FROM;

  if (!apiKey || !to || !from) {
    console.info("[notify] email not configured — would have sent:", subject);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      // Plain text only: the body interpolates client-supplied content, and
      // text/plain cannot carry an injected script or tracking pixel.
      body: JSON.stringify({ from, to, subject, text: lines.join("\n") }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[notify] provider rejected the send:", res.status);
    }
  } catch (err) {
    console.error("[notify] send failed:", err);
  }
}
