const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

function requiredString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'MBBS Seminar';

  if (!token || !baseId) {
    return response.status(503).json({
      configured: false,
      error: 'Airtable is not configured on this deployment.',
    });
  }

  const body = request.body || {};

  if (!requiredString(body.fullName) || !requiredString(body.mobileNumber) || !requiredString(body.emailAddress)) {
    return response.status(400).json({ error: 'Missing required registration fields.' });
  }

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
    'Event Name': body.eventName || 'Mega MBBS Seminar 2026',
    'Registration Type': body.registrationType || 'free_seat_reservation',
    'Source': body.source || 'landing_page',
    'Created At': body.createdAt || new Date().toISOString(),
  };

  try {
    const airtableResponse = await fetch(`${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: [{ fields }] }),
    });

    const data = await airtableResponse.json();

    if (!airtableResponse.ok) {
      return response.status(airtableResponse.status).json({
        error: data?.error?.message || 'Airtable rejected the registration.',
      });
    }

    return response.status(200).json({
      ok: true,
      id: data.records?.[0]?.id,
    });
  } catch (error) {
    return response.status(500).json({
      error: error instanceof Error ? error.message : 'Airtable request failed.',
    });
  }
}
