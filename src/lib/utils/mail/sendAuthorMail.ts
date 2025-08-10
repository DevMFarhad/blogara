import env from '@/config/env';
import React from 'react';
import sendMail from './sendMail';
import config from '@/config';

const sendAuthorMail = ({
  userName,
  email,
  password,
}: {
  userName: string;
  email: string;
  password: string;
}) => {
  const loginUrl = `${env.base_url}/login`;

  const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Credential Email</title>
        <style>
            /* Reset & base */
            body, p, h1, h2, h3, h4, h5, h6 {
            margin: 0; padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
                Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            color: #333333;
            }
            body {
            background-color: #f9f9f9;
            padding: 20px;
            }
            .container {
            max-width: 600px;
            background-color: #ffffff;
            margin: 0 auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
            }
            .header {
            background-color: #0052cc;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 1.5rem;
            font-weight: bold;
            }
            .content {
            padding: 30px 25px;
            font-size: 16px;
            line-height: 1.5;
            }
            .password-box {
            background-color: #f4f4f4;
            border: 1px dashed #ccc;
            padding: 15px;
            margin: 20px 0;
            font-weight: bold;
            font-size: 1.2rem;
            text-align: center;
            letter-spacing: 2px;
            user-select: all;
            }
            .btn {
            display: inline-block;
            background-color: #0052cc;
            color: white !important;
            padding: 12px 24px;
            margin-top: 20px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: background-color 0.3s ease;
            }
            .btn:hover {
            background-color: #003d99;
            }
            .footer {
            font-size: 12px;
            color: #777777;
            padding: 15px 25px;
            text-align: center;
            background-color: #f0f0f0;
            }
            /* Responsive */
            @media (max-width: 480px) {
            .container {
                width: 95% !important;
            }
            .content {
                padding: 20px 15px;
                font-size: 14px;
            }
            .btn {
                width: 100%;
                padding: 14px 0;
                text-align: center;
                display: block;
            }
            }
        </style>
        </head>
        <body>
        <div class="container" role="main" aria-label="Welcome Email">
            <div class="header">Welcome to ${config.app_name}</div>
            <div class="content">
            <p>Hi <strong>${userName}</strong>,</p>
            <p>Your author account has been created successfully. Below is your temporary password:</p>
            <div class="password-box" tabindex="0">${password}</div>
            <p>Please log in using the button below and change your password immediately for security reasons.</p>
            <a href="${loginUrl}" class="btn" target="_blank" rel="noopener noreferrer">Login Now</a>
            </div>
            <div class="footer">
            <p>© ${new Date().getFullYear()} ${config.app_name}</p>
            </div>
        </div>
        </body>
        </html>
  `;

  sendMail({
    to: email,
    subject: `Login Credential from ${config.app_name}`,
    body: html,
  });
};

export default sendAuthorMail;
