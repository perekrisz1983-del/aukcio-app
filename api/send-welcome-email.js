import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    await resend.emails.send({
      from: 'PCAS Aukció <info@send.diamondbutor.hu>',
      to: [to],
      subject: 'Üdvözlünk a PCAS Aukciós oldalon!',
      html: `
        <h1>Sikeres regisztráció!</h1>
        <p>Köszönjük, hogy csatlakoztál a közösségünkhöz. Mostantól te is licitálhatsz az aukciókon.</p>
        <p>Sok sikert!</p>
        <p>A PCAS Csapata</p>
      `,
    });

    return res.status(200).json({ message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};