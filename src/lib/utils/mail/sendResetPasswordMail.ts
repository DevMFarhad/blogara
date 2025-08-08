import config from '@/config';
import sendMail from './sendMail';
import env from '@/config/env';

const sendResetPasswordMail = async (email: string, token: string) => {
  const resetLink = `${env.base_url}/reset-password?token=${token}`;
  const body = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Password Reset ${config.app_name}</title>
            <style>
                @media screen and (max-width: 600px) {
                .container {
                    width: 100% !important;
                    padding: 20px !important;
                }
                .button {
                    width: 80% !important;
                    display: block !important;
                }
                }
                .button:hover {
                background-color: #4338ca !important;
                }
            </style>
            </head>
            <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, sans-serif; color:#333;">

            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f4f4f7; padding: 40px 0;">
                <tr>
                <td align="center">
                    <table class="container" width="600" cellpadding="0" cellspacing="0" role="presentation"
                        style="background-color:#ffffff; border-radius:8px; overflow:hidden; max-width:600px; width:100%; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color:#4f46e5; padding:20px; text-align:center;">
                        <h1 style="margin:0; font-size:20px; color:#ffffff; font-weight:600;">
                            ${config.app_name}
                        </h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 30px; font-size:16px; line-height:1.6; color:#333333;">
                        <p style="margin-top:0;">Hi,</p>
                        <p>We received a request to reset your password for your <strong>${config.app_name}</strong> account.</p>
                        <p>Click the button below to set a new password. This link will expire in 5 minutes for security reasons.</p>
                        <p style="text-align:center; margin: 30px 0;">
                            <a href="${resetLink}" target="_blank"
                            class="button"
                            style="background-color:#4f46e5; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:600; display:inline-block; transition: background-color 0.3s ease;">
                            Reset Password
                            </a>
                        </p>
                        <p>If you didn’t request this change, you can safely ignore this email — your account will remain secure.</p>
                        <p style="margin-bottom:0;">If the button doesn’t work, copy and paste this link into your browser:</p>
                        <p style="word-break: break-word; color:#4f46e5; margin-top:5px;">${resetLink}</p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f9f9f9; padding:15px; text-align:center; font-size:12px; color:#777;">
                        &copy; ${new Date().getFullYear()} ${config.app_name}. All rights reserved.<br/>
                        This is an automated message, please do not reply.
                        </td>
                    </tr>

                    </table>
                </td>
                </tr>
            </table>
            </body>
        </html>
    `;
  await sendMail({ to: email, subject: 'Password Reset Email', body });
};

export default sendResetPasswordMail;
