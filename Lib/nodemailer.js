import nodemailer from 'nodemailer'

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  service: "gmail", // Or your email service
  auth: {
    user: process.env.EMAIL_USER, // sender email
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

module.exports = transporter;