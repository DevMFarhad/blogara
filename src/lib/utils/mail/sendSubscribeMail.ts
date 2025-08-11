import env from '@/config/env';
import sendMail from './sendMail';
import config from '@/config';

const sendSubscribeMail = async ({
  name,
  email,
  id,
}: {
  name: string;
  email: string;
  id: string;
}) => {
  const subject = `Welcome to ${config.app_name}! 🎉`;

  const unsubscribeUrl = `${env.base_url}/unsubscribe?id=${id}`;

  const body = `
        < !DOCTYPE html>
            <html lang="en" >
                <head>
                <meta charset="UTF-8" />
                    <meta name="viewport" content = "width=device-width, initial-scale=1.0" />
                        <title>${subject} </title>
                            <style>
    body, table, td, a { font - family: Arial, sans - serif; text - decoration: none; }
          img { border: none; outline: none; text - decoration: none; max - width: 100 %; }
          table { border - collapse: collapse!important; width: 100 %; }

    @media screen and(max - width: 600px) {
            .content { padding: 20px!important; }
            h1 { font - size: 24px!important; }
            p { font - size: 16px!important; }
            .button { padding: 12px 20px!important; font - size: 16px!important; }
          }

          .button:hover {
    background - color: #0056b3!important;
    transform: scale(1.05);
}
</style>
    </head>
    < body style = "margin:0; padding:0; background-color:#f7f7f7;" >
        <table role="presentation" cellpadding = "0" cellspacing = "0" width = "100%" >
            <tr>
            <td align="center" style = "padding: 20px 0;" >
                <table class="content" role = "presentation" cellpadding = "0" cellspacing = "0" width = "600" style = "background:#ffffff; border-radius:8px; overflow:hidden; padding:40px;" >
                    <tr>
                    <td align="center" style = "background-color: #4f46e5; padding: 20px;" >
                        <h1 style="color: white; margin: 0;" > Welcome to ${config.app_name} 🎉</h1>
                            </td>
                            </tr>
                            < tr >
                            <td style="padding: 30px;" >
                                <h2 style="color:#333;" > Hi ${name}, </h2>
                                    < p style = "color:#555; font-size:16px; line-height:1.5;" >
                                        Thank you for subscribing to < strong > ${config.app_name} </>!  
                      We’re excited to have you with us.You’ll now get the latest updates, tips, and exclusive content right in your inbox.
                    </p>
    < p style = "color:#555; font-size:16px; line-height:1.5;" >
        Click the button below to explore our latest content:
</>
    < p style = "text-align:center; margin: 30px 0;" >
        <a href="${env.base_url}" class="button"
style = "background-color:#4f46e5; color:white; padding:14px 28px; border-radius:6px; display:inline-block; font-size:18px; transition:all 0.3s ease;" >
    Visit ${config.app_name}
</a>
    </>
    < p style = "color:#999; font-size:14px;" >
        If you didn’t subscribe, you can safely ignore this email.
                    </>
            </td>
            </tr>
            < tr >
            <td align="center" style = "background-color:#f0f0f0; padding: 15px; font-size:14px; color:#777;" >
                    & copy; ${new Date().getFullYear()} ${config.app_name}. All rights reserved.
                    < br > <br>
    <a href="${unsubscribeUrl}" style = "color:#4f46e5; text-decoration: underline;" >
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

  await sendMail({ to: email, subject, body });
};

export default sendSubscribeMail;
