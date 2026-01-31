import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const formatHungarianPrice = (price) => {
    return new Intl.NumberFormat("hu-HU", {
      style: "currency",
      currency: "HUF",
      minimumFractionDigits: 0,
    }).format(price);
  };

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { to, itemName, winningBid, auctionIdHuman } = req.body;

    if (!to || !itemName || !winningBid || !auctionIdHuman) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await resend.emails.send({
      from: 'PCAS Aukció <info@send.diamondbutor.hu>',
      to: [to],
      subject: `Gratulálunk, megnyerted a(z) ${itemName} aukciót!`,
      html: `
        <h1>Gratulálunk!</h1>
        <p>Sikeresen megnyerted a(z) <strong>${itemName}</strong> nevű aukciót a következő összeggel: <strong>${formatHungarianPrice(winningBid)}</strong>.</p>
        <p>A következő lépés az összeg átutalása. Kérjük, a profilodban vagy az aukciós oldalon található adatok alapján végezd el az utalást.</p>
        <p>Az aukció azonosítója, amit a közleményben fel kell tüntetned: <strong>${auctionIdHuman}</strong></p>
        <p>Köszönjük a részvételt!</p>
        <p>A PCAS Csapata</p>
      `,
    });

    return res.status(200).json({ message: 'Winner email sent successfully' });
  } catch (error) {
    console.error('Error sending winner email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};