const express = require('express');
const path = require('path');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();

const app = express();
const port = 3000;

// Initialize Mailgun
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
  url: 'https://api.mailgun.net'
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(express.json());

// Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for welcome email
app.post('/api/welcome-email', async (req, res) => {
  const { recipient } = req.body;

  if (!recipient) {
    return res.status(400).json({ message: 'Recipient email is required', sent: false });
  }

  const data = {
    from: 'primo21178@gmail.com',
    to: recipient,
    subject: 'Welcome to DEV@Deakin',
    text: 'Welcome to DEV@Deakin! Thank you for subscribing.',
    html: '<h1>Welcome!</h1><p>Thank you for joining DEV@Deakin. Stay tuned!</p>'
  };

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
    res.json({ message: 'Welcome email sent successfully!', sent: true });
  } catch (error) {
    console.error('Mailgun error:', error);
    res.status(500).json({ message: 'Error sending email', sent: false });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});