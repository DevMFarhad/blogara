import config from '@/config';
import env from '@/config/env';
import sendMail from './sendMail';

const sendPostEmail = async ({
  slug,
  title,
  message,
  subscriberId,
  subscriberName,
  subscriberEmail,
}: {
  slug: string;
  title: string;
  subscriberName: string;
  message: string;
  subscriberId: string;
  subscriberEmail: string;
}) => {
  const postUrl = `${env.base_url}/posts/${slug}`;
  const subject = `🆕 New Article: ${title} | ${config.app_name}`;
  const body = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>${subject}</title>
        <style>
          body, table, td, a { font-family: Arial, sans-serif; text-decoration: none; }
          table { border-collapse: collapse !important; }
          img { max-width: 100%; border: none; }
          
          @media screen and (max-width: 600px) {
            h1 { font-size: 22px !important; }
            p { font-size: 16px !important; }
            .button { padding: 12px 20px !important; font-size: 16px !important; }
          }
          
          .button:hover {
            background-color: #4338ca !important;
            transform: scale(1.05);import { email } from 'zod';

          }
        </style>
      </head>
      <body style="margin:0; padding:0; background-color:#f7f7f7;">
        <table role="presentation" width="100%">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table role="presentation" width="600" style="background: #fff; border-radius: 8px; overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td align="center" style="background-color: #4f46e5; padding: 20px;">
                    <h1 style="color: white; margin: 0;">${config.app_name} Updates</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="color:#333;">Hi ${subscriberName || 'Subscriber'},</h2>
                    <p style="color:#555; font-size:16px; line-height:1.5;">
                      We’ve just published a new article: <strong>${title}</strong>.
                    </p>
                    <p style="color:#555; font-size:16px; line-height:1.5;">
                      ${message}
                    </p>
                    <p style="text-align:center; margin: 30px 0;">
                      <a href="${postUrl}" class="button" 
                        style="background-color:#4f46e5; color:white; padding:14px 28px; border-radius:6px; display:inline-block; font-size:18px; transition:all 0.3s ease;">
                        Read Full Article
                      </a>
                    </p>
                    <p style="color:#777; font-size:14px;">
                      Stay tuned for more updates from <strong>${config.app_name}</strong>.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td align="center" style="background-color:#f0f0f0; padding: 15px; font-size:14px; color:#777;">
                    &copy; ${new Date().getFullYear()} ${config.app_name}. All rights reserved.
                    <br>
                    <a href="${env.base_url}/unsubscribe?id=${subscriberId}" 
                      style="color:#4f46e5; text-decoration: underline;">
                      Unsubscribe
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

  await sendMail({
    to: subscriberEmail,
    subject,
    body,
  });
};

export default sendPostEmail;
