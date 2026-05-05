import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type {IncomingMessage, ServerResponse} from 'node:http';
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

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      {
        name: 'airtable-register-dev-api',
        configureServer(server) {
          server.middlewares.use('/api/register', async (request, response) => {
            if (request.method !== 'POST') {
              response.setHeader('Allow', 'POST');
              sendJson(response, 405, {error: 'Method not allowed'});
              return;
            }

            const token = env.AIRTABLE_API_KEY;
            const baseId = env.AIRTABLE_BASE_ID;
            const tableName = env.AIRTABLE_TABLE_NAME || 'MBBS Seminar';

            if (!token || !baseId) {
              sendJson(response, 503, {
                configured: false,
                error: 'Airtable is not configured in .env.',
              });
              return;
            }

            try {
              const body = await readJsonBody(request);

              if (!requiredString(body.fullName) || !requiredString(body.mobileNumber) || !requiredString(body.emailAddress)) {
                sendJson(response, 400, {error: 'Missing required registration fields.'});
                return;
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

              const airtableResponse = await fetch(`${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({records: [{fields}]}),
              });

              const data = await airtableResponse.json();

              if (!airtableResponse.ok) {
                sendJson(response, airtableResponse.status, {
                  error: data?.error?.message || 'Airtable rejected the registration.',
                });
                return;
              }

              sendJson(response, 200, {
                ok: true,
                id: data.records?.[0]?.id,
              });
            } catch (error) {
              sendJson(response, 500, {
                error: error instanceof Error ? error.message : 'Airtable request failed.',
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
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
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
