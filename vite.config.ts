import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type {IncomingMessage, ServerResponse} from 'node:http';
import { Resend } from 'resend';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

function readJsonBody(request: IncomingMessage) {
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

function sendJson(response: ServerResponse, statusCode: number, payload: Record<string, unknown>) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(payload));
}

function requiredString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

function buildEmailHtml(body: Record<string, unknown>): string {
  const ts = body.createdAt
    ? new Date(body.createdAt as string).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
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
    <div class="subtitle">New Seminar Registration (DEV)</div>
    <h2>🎓 ${body.fullName || 'New Lead'}</h2>
    <div class="ticket-id">ID: ${body.ticketId || 'N/A'}</div>
    <table>
      <tr><td>Mobile</td><td>${body.mobileNumber || '—'}</td></tr>
      <tr><td>Email</td><td>${body.emailAddress || '—'}</td></tr>
      <tr><td>City</td><td>${body.preferredCity || '—'}</td></tr>
      <tr><td>Time</td><td>${ts}</td></tr>
    </table>
    <div class="footer">Dev Server — Powered by Resend</div>
  </div>
</body>
</html>`;
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      {
        name: 'resend-register-dev-api',
        configureServer(server) {
          server.middlewares.use('/api/register', async (request, response) => {
            if (request.method !== 'POST') {
              response.setHeader('Allow', 'POST');
              sendJson(response, 405, {error: 'Method not allowed'});
              return;
            }

            const resendApiKey = env.RESEND_API_KEY;
            const targetEmail = env.NOTIFICATION_EMAIL || 'megambbs26@gmail.com';

            if (!resendApiKey) {
              sendJson(response, 503, {error: 'RESEND_API_KEY not set in .env'});
              return;
            }

            const resend = new Resend(resendApiKey);

            try {
              const body = await readJsonBody(request);

              if (!requiredString(body.fullName) || !requiredString(body.mobileNumber)) {
                sendJson(response, 400, {error: 'Missing required fields.'});
                return;
              }

              // 1. SEND EMAIL FIRST
              try {
                await resend.emails.send({
                  from: 'MBBS Seminar <onboarding@resend.dev>',
                  to: targetEmail,
                  subject: `🚨 LEAD: ${body.fullName} (${body.preferredCity})`,
                  html: buildEmailHtml(body),
                });
                console.log(`[resend] Lead email sent for ${body.fullName}`);
              } catch (emailErr: any) {
                console.error('[resend] Failed:', emailErr.message);
                sendJson(response, 500, {error: 'Resend API failed to send email.'});
                return;
              }

              // 2. TRY AIRTABLE BACKGROUND
              const token = env.AIRTABLE_API_KEY;
              const baseId = env.AIRTABLE_BASE_ID;
              const tableName = env.AIRTABLE_TABLE_NAME || 'MBBS Seminar';

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
                  body: JSON.stringify({records: [{fields}]}),
                }).catch((err: Error) => console.error('[airtable] Sync failed:', err.message));
              }

              sendJson(response, 200, {ok: true, message: 'Lead captured via Resend.'});
            } catch (error) {
              sendJson(response, 500, {
                error: error instanceof Error ? error.message : 'Request failed.',
              });
            }
          });
        },
      },
      react(),
      tailwindcss(),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'motion', 'lucide-react', 'jspdf', 'html2canvas'],
          },
        },
      },
    },
  };
});
