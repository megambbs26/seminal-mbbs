import { Resend } from 'resend';

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

function requiredString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function buildEmailHtml(body) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f9fafb; margin: 0; padding: 20px; }
    .card { background: #ffffff; border-radius: 12px; padding: 32px; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; }
    h2 { color: #111827; margin: 0 0 8px; font-size: 24px; }
    .subtitle { color: #6b7280; font-size: 14px; margin: 0 0 24px; text-transform: uppercase; letter-spacing: 0.05em; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 12px 0; font-size: 15px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
    td:first-child { color: #4b5563; font-weight: 600; width: 35%; }
    td:last-child { color: #111827; }
    .ticket-id { display: inline-block; background: #fef3c7; color: #92400e; font-weight: 700; font-size: 14px; padding: 6px 12px; border-radius: 6px; margin-bottom: 24px; font-family: monospace; }
    .footer { margin-top: 32px; font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="subtitle">New Seminar Registration</div>
    <h2>🎓 ${body.fullName || 'New Lead'}</h2>
    <div class="ticket-id">ID: ${body.ticketId || 'N/A'}</div>
    <table>
      <tr><td>Mobile</td><td>${body.mobileNumber || '—'}</td></tr>
      <tr><td>Email</td><td>${body.emailAddress || '—'}</td></tr>
      <tr><td>City</td><td>${body.preferredCity || '—'}</td></tr>
      <tr><td>State</td><td>${body.state || '—'}</td></tr>
      <tr><td>Exam Year</td><td>${body.neetExamYear || '—'}</td></tr>
      <tr><td>Interested In</td><td>${body.interestedCourse || '—'}</td></tr>
      <tr><td>Message</td><td>${body.message || '(none)'}</td></tr>
      <tr><td>Time</td><td>${body.createdAt ? new Date(body.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
    </table>
    <div class="footer">Captured via MBBS Seminar Landing Page — Powered by Resend</div>
  </div>
</body>
</html>`;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const body = request.body || {};
  if (!requiredString(body.fullName) || !requiredString(body.mobileNumber)) {
    return response.status(400).json({ error: 'Missing required fields.' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const targetEmail = process.env.NOTIFICATION_EMAIL || 'megambbs26@gmail.com';

  if (!resendApiKey) {
    return response.status(503).json({ error: 'Resend API key not configured.' });
  }

  const resend = new Resend(resendApiKey);

  try {
    // 1. SEND EMAIL FIRST
    await resend.emails.send({
      from: 'MBBS Seminar <onboarding@resend.dev>',
      to: targetEmail,
      subject: `🚨 LEAD: ${body.fullName} (${body.preferredCity})`,
      html: buildEmailHtml(body),
    });

    // 2. TRY AIRTABLE IN BACKGROUND
    const token = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'MBBS Seminar';

    if (token && baseId) {
      const fields = {
        'Ticket ID': body.ticketId,
        'Full Name': body.fullName,
        'Mobile Number': body.mobileNumber,
        'Email Address': body.emailAddress,
        'State': body.state,
        'Seminar City': body.preferredCity,
        'NEET Exam Year': body.neetExamYear,
        'Interested In': body.interestedCourse,
        'Message': body.message || '',
        'Created At': body.createdAt || new Date().toISOString(),
      };

      fetch(`${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: [{ fields }] }),
      }).catch(err => console.error('[airtable] Sync failed:', err.message));
    }

    return response.status(200).json({ ok: true, message: 'Lead captured successfully.' });

  } catch (error) {
    console.error('[resend] Email failed:', error.message);
    return response.status(500).json({ 
      error: 'Failed to capture lead via email.',
      details: error.message 
    });
  }
}
