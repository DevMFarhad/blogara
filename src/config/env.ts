const env = {
  admin_email: process.env.ADMIN_EMAIL as string,
  admin_password: process.env.ADMIN_PASSWORD as string,
  jwt_secret: process.env.JWT_SECRET as string,
  jwt_expires: process.env.JWT_EXPIRES as string,
  jwt_reset_secret: process.env.JWT_RESET_SECRET as string,
  jwt_reset_expires: process.env.JWT_RESET_EXPIRES as string,
  nodemailer_app_mail: process.env.NODEMAILER_APP_MAIL as string,
  nodemailer_app_pass: process.env.NODEMAILER_APP_PASS as string,
  bcrypt_salt: Number(process.env.BCRYPT_SALT),
  base_url: (process.env.BASE_URL as string) || 'http://localhost:3000',
};

export default env;
