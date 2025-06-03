import express from 'express';
const router = express.Router();
import nodemailer from 'nodemailer';

// Nodemailer transport configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send confirmation email
router.post('/', async (req, res) => {
  const { userEmail, sitterEmail, bookingDetails } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: [userEmail, sitterEmail],
    subject: 'Booking Confirmation',
    text: `Your booking has been confirmed! Details: ${JSON.stringify(bookingDetails)}`,
 instruction: 'Shift + Enter to add a line break in WhatsApp message.',
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Confirmation email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;