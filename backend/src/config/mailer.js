const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.resend.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER || 'resend',
    pass: process.env.SMTP_PASS || '',
  },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_PASS) {
    console.log(`[Email skipped - no SMTP config] To: ${to} | Subject: ${subject}`);
    return { messageId: 'skipped' };
  }
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@techpigeon.org',
    to, subject, html,
  });
};

module.exports = { sendEmail };
