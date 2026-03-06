const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from: `"TechPigeon" <${process.env.EMAIL_FROM}>`, to, subject, html });
  } catch (e) { console.error('Mail error:', e.message); }
};
module.exports = { sendEmail };
