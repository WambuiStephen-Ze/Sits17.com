import transporter from '../config/email';

// Send confirmation email
exports.sendConfirmationEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send email', err });
  }
};
