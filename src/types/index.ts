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

export type AnimalStatus = 'Gazdira vár' | 'Lefoglalva' | 'Gazdára talált';

export interface Animal {
  id: string;
  name: string;
  description: string;
  gender: 'Kan' | 'Szuka';
  size: 'Kicsi' | 'Közepes' | 'Nagy';
  age_category: 'Kölyök (0-1 év)' | 'Felnőtt (1-8 év)' | 'Idős (8+ év)';
  image_url: string;
  status: AnimalStatus;
  created_at: string;
}