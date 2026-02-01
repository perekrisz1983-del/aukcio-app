import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
// IMPORTANT: Replace this with your actual admin email address
const ADMIN_EMAIL = 'admin@example.com';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { animalName, fullName, email, phone, message } = req.body;

    if (!animalName || !fullName || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await resend.emails.send({
      from: 'PCAS Örökbefogadás <info@send.diamondbutor.hu>',
      to: [ADMIN_EMAIL],
      reply_to: email,
      subject: `Új örökbefogadási jelentkezés: ${animalName}`,
      html: `
        <h1>Új örökbefogadási jelentkezés érkezett!</h1>
        <p>A következő állatra jelentkeztek: <strong>${animalName}</strong></p>
        <hr>
        <h2>Jelentkező adatai:</h2>
        <ul>
          <li><strong>Név:</strong> ${fullName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Telefonszám:</strong> ${phone}</li>
        </ul>
        <h2>Bemutatkozás/Üzenet:</h2>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    });

    return res.status(200).json({ message: 'Adoption email sent successfully' });
  } catch (error) {
    console.error('Error sending adoption email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};