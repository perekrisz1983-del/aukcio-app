import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
  throw new Error("Missing environment variables for Supabase or Resend.");
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
const resend = new Resend(resendApiKey);

const formatHungarianPrice = (price) => {
  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    minimumFractionDigits: 0,
  }).format(price);
};

export default async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('Cron job started: /api/cron');
    
    /*
    const authToken = (req.headers.authorization || '').split('Bearer ').pop();
    if (process.env.CRON_SECRET && authToken !== process.env.CRON_SECRET) {
      console.warn('Cron job unauthorized access attempt.');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    */

    console.log('Calling close_expired_auctions RPC...');
    const { data: closedAuctions, error: rpcError } = await supabaseAdmin.rpc('close_expired_auctions');

    if (rpcError) {
      console.error('Error calling close_expired_auctions RPC:', rpcError);
      return res.status(500).json({ error: 'Failed to process auctions.', details: rpcError.message });
    }

    console.log(`RPC call successful. Found ${closedAuctions ? closedAuctions.length : 0} auctions to process.`);

    if (!closedAuctions || closedAuctions.length === 0) {
      console.log('No expired auctions to close.');
      return res.status(200).json({ message: 'No auctions to close.' });
    }

    const processingPromises = closedAuctions.map(async (auction) => {
      if (!auction.winner_user_id) {
        console.log(`Auction ${auction.human_readable_id} closed without a winner.`);
        return;
      }

      console.log(`Processing winner for auction ${auction.human_readable_id}. Winner ID: ${auction.winner_user_id}`);
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(auction.winner_user_id);

      if (userError || !userData.user?.email) {
        console.error(`Could not find user email for winner ID: ${auction.winner_user_id}`, userError);
        return;
      }

      const winnerEmail = userData.user.email;
      console.log(`Sending winner email to ${winnerEmail} for auction ${auction.human_readable_id}.`);

      try {
        await resend.emails.send({
          from: 'PCAS Aukció <info@send.diamondbutor.hu>',
          to: [winnerEmail],
          subject: `Gratulálunk, megnyerted a(z) ${auction.item_title} aukciót!`,
          html: `
            <h1>Gratulálunk!</h1>
            <p>Sikeresen megnyerted a(z) <strong>${auction.item_title}</strong> nevű aukciót a következő összeggel: <strong>${formatHungarianPrice(auction.winning_bid_amount)}</strong>.</p>
            <p>A következő lépés az összeg átutalása. Kérjük, a profilodban vagy az aukciós oldalon található adatok alapján végezd el az utalást.</p>
            <p>Az aukció azonosítója, amit a közleményben fel kell tüntetned: <strong>${auction.human_readable_id}</strong></p>
            <p>Köszönjük a részvételt!</p>
            <p>A PCAS Csapata</p>
          `,
        });
        console.log(`Winner email sent successfully to ${winnerEmail}.`);

        const { error: updateError } = await supabaseAdmin
          .from('auctions')
          .update({ status: 'Fizetésre vár' })
          .eq('auction_id_human', auction.human_readable_id);

        if (updateError) {
          console.error(`Failed to update status for auction ${auction.human_readable_id} to 'Fizetésre vár'`, updateError);
        } else {
          console.log(`Successfully updated status for auction ${auction.human_readable_id} to 'Fizetésre vár'.`);
        }
      } catch (emailError) {
        console.error(`Failed to send winner email to ${winnerEmail} for auction ${auction.human_readable_id}`, emailError);
      }
    });

    await Promise.all(processingPromises);

    console.log(`Cron job finished. Successfully processed ${closedAuctions.length} auctions.`);
    return res.status(200).json({ message: `Successfully processed ${closedAuctions.length} auctions.` });
  } catch (error) {
    console.error('An unexpected error occurred in the cron job:', error);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};