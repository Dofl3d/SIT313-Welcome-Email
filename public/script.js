async function sendWelcomeEmail() {
  const recipient = document.getElementById('recipient-email').value;
  const output = document.getElementById('email-output');

  if (!recipient) {
    output.innerText = 'Please enter an email address.';
    return;
  }

  if (!recipient.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    output.innerText = 'Invalid email format.';
    return;
  }

  try {
    const response = await fetch('/api/welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient })
    });
    const data = await response.json();
    output.innerText = data.message;
  } catch (error) {
    output.innerText = 'Error sending welcome email';
  }
}