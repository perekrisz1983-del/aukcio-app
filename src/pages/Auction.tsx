"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { CustomButton } from "@/components/CustomButton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import CountdownTimer from "@/components/CountdownTimer";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Auction } from "../types";
import { showError, showSuccess } from "@/utils/toast";
import BidHistory from "@/components/BidHistory";
import { User } from "@supabase/supabase-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formatHungarianPrice = (price: number) => {
  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace("HUF", "Ft");
};

const maskEmail = (email: string | undefined): string => {
  if (!email) return 'Névtelen';
  const [name, domain] = email.split('@');
  if (!name || !domain) return 'Névtelen';
  return `${name.charAt(0)}***@${domain}`;
};

const AuctionCard = ({ item, onBid, currentUser }: { item: Auction; onBid: (itemId: string, bidValue: number) => void; currentUser: User | null; }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [highestBidderEmail, setHighestBidderEmail] = useState<string | null>(null);
  const [isClosed, setIsClosed] = useState(new Date() > new Date(item.end_time));

  const isWinner = useMemo(() => currentUser?.id === item.winner_id, [currentUser, item.winner_id]);

  useEffect(() => {
    if (!isClosed) {
      const timeRemaining = new Date(item.end_time).getTime() - Date.now();
      if (timeRemaining > 0) {
        const timer = setTimeout(() => setIsClosed(true), timeRemaining);
        return () => clearTimeout(timer);
      } else {
        setIsClosed(true);
      }
    }
  }, [item.end_time, isClosed]);

  useEffect(() => {
    const bidderId = item.winner_id || item.highest_bidder_id;
    if (isClosed && bidderId) {
      const fetchHighestBidderEmail = async () => {
        const { data, error } = await supabase.rpc('get_auction_bids', {
          p_auction_id: item.id
        });
        if (error) {
          console.error("Hiba a nyertes emailjének lekérdezésekor:", error);
        } else if (data && data.length > 0) {
          setHighestBidderEmail(data[0].bidder_email);
        }
      };
      fetchHighestBidderEmail();
    }
  }, [isClosed, item.winner_id, item.highest_bidder_id, item.id]);

  const handlePlaceBid = () => {
    const bidValue = parseInt(bidAmount, 10);
    if (isNaN(bidValue)) {
      showError("Kérjük, érvényes összeget adjon meg.");
      return;
    }
    onBid(item.id, bidValue);
    setBidAmount('');
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % item.image_urls.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + item.image_urls.length) % item.image_urls.length);
  };

  return (
    <div className="bg-card p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-500">
      <Dialog onOpenChange={(isOpen) => !isOpen && setCurrentImageIndex(0)}>
        <DialogTrigger asChild>
          <div className="aspect-video mb-4 rounded-md overflow-hidden cursor-pointer bg-gray-100">
            {item.image_urls && item.image_urls.length > 0 ? (
              <img src={item.image_urls[0]} alt={item.title} className="w-full h-full object-contain transition-transform hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">Nincs kép</div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-5xl w-full p-2 bg-transparent border-0 flex justify-center items-center">
          {item.image_urls && item.image_urls.length > 0 && (
            <div className="relative">
              <img src={item.image_urls[currentImageIndex]} alt={item.title} className="max-h-[90vh] w-auto object-contain rounded-lg" />
              <DialogClose asChild><CustomButton variant="ghost" size="icon" className="absolute top-2 right-2 h-9 w-9 rounded-full bg-black/50 text-white hover:bg-black/70 z-50"><X className="h-5 w-5" /></CustomButton></DialogClose>
              {item.image_urls.length > 1 && (
                <>
                  <CustomButton variant="outline" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-black/30 hover:bg-black/50 text-white" onClick={prevImage}><ChevronLeft /></CustomButton>
                  <CustomButton variant="outline" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-black/30 hover:bg-black/50 text-white" onClick={nextImage}><ChevronRight /></CustomButton>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-2xl font-semibold text-foreground pr-2">{item.title}</h2>
        <Badge variant={item.condition === 'Új' ? 'default' : 'secondary'} className="shrink-0">{item.condition}</Badge>
      </div>
      <p className="text-muted-foreground mb-4 flex-grow">{item.description}</p>
      
      {isClosed ? (
        <div className="mt-auto">
          <div className="text-center p-4 border-2 border-red-500 rounded-lg bg-red-50 text-red-700 font-bold">
            AZ AUKCIÓ LEZÁRULT
          </div>
          {item.highest_bidder_id ? (
            <div className="text-center mt-4">
              <p>Nyertes: <span className="font-semibold">{highestBidderEmail ? maskEmail(highestBidderEmail) : 'Betöltés...'}</span></p>
              <p>Nyertes licit: <span className="font-semibold">{formatHungarianPrice(item.current_bid)}</span></p>
            </div>
          ) : (
            <p className="text-center mt-4 text-muted-foreground">Nem érkezett licit.</p>
          )}
          {isWinner && (
            <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 rounded-r-lg text-green-800">
              <h4 className="font-bold text-lg">Gratulálunk, te nyertél!</h4>
              <p className="mt-2">Kérjük, utald el a nyertes összeget az alábbi adatokkal:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Név:</strong> PCAS Alapítvány</li>
                <li><strong>Bankszámlaszám:</strong> 12345678-12345678-12345678</li>
                <li><strong>Összeg:</strong> {formatHungarianPrice(item.current_bid)}</li>
                <li><strong>Közlemény:</strong> {item.auction_id_human}</li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <>
          <p className="text-xl font-bold text-primary mb-2">Jelenlegi licit: {formatHungarianPrice(item.current_bid)}</p>
          <p className="text-sm text-muted-foreground mb-4">Lejár: <CountdownTimer endTime={item.end_time} /></p>
          <div className="flex flex-col space-y-2">
            <Input type="number" placeholder={`Minimum licit: ${formatHungarianPrice(item.current_bid + item.bid_increment)}`} value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="w-full" />
            <CustomButton onClick={handlePlaceBid} className="w-full text-primary-foreground bg-gradient-to-br from-primary to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/20">Licitálás</CustomButton>
            
            {item.has_buy_now && item.buy_now_price && item.current_bid < item.buy_now_price && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <CustomButton variant="outline" className="w-full mt-2 border-primary text-primary hover:bg-primary/10 hover:text-primary font-bold">
                    Villámár: {formatHungarianPrice(item.buy_now_price)}
                  </CustomButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Vásárlás megerősítése</AlertDialogTitle>
                    <AlertDialogDescription>
                      Biztosan megvásárolja a(z) "{item.title}" terméket villámáron, {formatHungarianPrice(item.buy_now_price)} összegért? Ezzel az aukció azonnal lezárul, és Ön lesz a nyertes.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Mégse</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onBid(item.id, item.buy_now_price!)}>
                      Vásárlás
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </>
      )}
      
      <BidHistory auctionId={item.id} />
    </div>
  );
};

const AuctionPage = () => {
  const [auctionItems, setAuctionItems] = useState<Auction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchAuctions = useCallback(async () => {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .in('status', ['Aktív', 'Fizetésre vár', 'Lejárt']) // Fetch active and recently closed auctions
      .order('end_time', { ascending: true });
    
    if (error) {
      showError("Hiba az aukciók betöltésekor: " + error.message);
    } else {
      setAuctionItems(data as Auction[]);
    }
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();

    fetchAuctions();
    const channel = supabase.channel('public:auctions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auctions' }, () => {
        fetchAuctions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAuctions]);

  const availableCategories = useMemo(() => {
    return [...new Set(auctionItems.map(a => a.category))].sort();
  }, [auctionItems]);

  const handlePlaceBid = async (itemId: string, bidValue: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showError("A licitáláshoz be kell jelentkeznie!");
      return;
    }

    const { error } = await supabase.rpc('place_bid', {
      auction_id_input: itemId,
      bid_amount: bidValue,
    });

    if (error) {
      showError(`Sikertelen licit: ${error.message}`);
    } else {
      showSuccess(`Sikeres licit: ${formatHungarianPrice(bidValue)}!`);
    }
  };

  const filteredAuctions = useMemo(() => {
    if (selectedCategory === 'all') return auctionItems;
    return auctionItems.filter(item => item.category === selectedCategory);
  }, [auctionItems, selectedCategory]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center text-primary mb-8">Aktuális aukciók</h1>
      <p className="text-lg text-center text-foreground mb-8">
        Üdvözöljük aukciós oldalunkon! Böngésszen termékeink között, és licitáljon, hogy támogassa munkánkat.
      </p>

      {availableCategories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <CustomButton variant={selectedCategory === 'all' ? 'default' : 'outline'} onClick={() => setSelectedCategory('all')} className="rounded-full">Összes</CustomButton>
          {availableCategories.map(category => (
            <CustomButton key={category} variant={selectedCategory === category ? 'default' : 'outline'} onClick={() => setSelectedCategory(category)} className="rounded-full">{category}</CustomButton>
          ))}
        </div>
      )}

      {filteredAuctions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {filteredAuctions.map((item) => (
            <AuctionCard key={item.id} item={item} onBid={handlePlaceBid} currentUser={currentUser} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-10">{auctionItems.length > 0 ? `Nincsenek aukciók a(z) '${selectedCategory}' kategóriában.` : 'Jelenleg nincsenek aktív aukciók. Nézzen vissza később!'}
        </p>
      )}
    </div>
  );
};

export default AuctionPage;