export type AuctionStatus = 'Tervezett' | 'Aktív' | 'Lejárt' | 'Fizetésre vár' | 'Fizetve / Postázásra vár' | 'Postázva' | 'Lezárt / Teljesült';

export interface Auction {
  id: string; // uuid
  created_at: string;
  auction_id_human: string;
  title: string;
  description: string;
  category: string;
  condition: 'Új' | 'Használt';
  starting_price: number;
  current_bid: number;
  bid_increment: number;
  start_time: string;
  end_time: string;
  image_urls: string[];
  has_buy_now: boolean;
  buy_now_price?: number;
  status: AuctionStatus;
  highest_bidder_id?: string;
  winner_id?: string;
  shipping_address?: {
    type: 'address' | 'foxpost';
    name: string;
    street: string;
    city: string;
    zip: string;
    foxpost_machine?: string;
  };
  tracking_number?: string;
}

export interface Profile {
  id: string;
  role: string;
}