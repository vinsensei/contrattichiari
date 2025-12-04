// src/lib/emailTemplate.ts

export type EmailTemplateParams = {
  title: string;
  content: string; // HTML già formattato
};

export function renderEmailTemplate({ title, content }: EmailTemplateParams) {
  return `
  <!DOCTYPE html>
  <html lang="it">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>

      <style>
        body {
          margin: 0;
          padding: 0;
          background: #f6f7f9;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1f2937;
          line-height: 1.5;
        }
        .container {
          max-width: 520px;
          margin: 0 auto;
          background: white;
          border-radius: 14px;
          padding: 32px;
          margin-top: 32px;
          border: 1px solid #e5e7eb;
        }
        .logo {
          text-align: center;
          margin-bottom: 24px;
        }
        .title {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #111827;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          margin-top: 32px;
          padding-bottom: 24px;
        }
        a.button {
          display: inline-block;
          background: #111827;
          color: white !important;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          margin-top: 16px;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <div class="logo">
          <img src="https://contrattichiari.it/logo_email.png" width="100" alt="Contratti Chiari" />
        </div>

        <h1 class="title">${title}</h1>

        <div class="content">
          ${content}
        </div>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} ContrattiChiari — Questo è un messaggio automatico.
      </div>
    </body>
  </html>
  `;
}