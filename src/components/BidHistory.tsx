"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface BidWithEmail {
  id: string;
  created_at: string;
  amount: number;
  bidder_email: string;
}

interface BidHistoryProps {
  auctionId: string;
}

const formatHungarianPrice = (price: number) => {
  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("hu-HU", {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const maskEmail = (email: string | undefined): string => {
  if (!email) return 'Névtelen';
  const [name, domain] = email.split('@');
  if (!name || !domain) return 'Névtelen';
  return `${name.charAt(0)}***@${domain}`;
};

const BidHistory: React.FC<BidHistoryProps> = ({ auctionId }) => {
  const [bids, setBids] = useState<BidWithEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBids = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc('get_auction_bids', {
      p_auction_id: auctionId
    });

    if (rpcError) {
      console.error('Hiba a licitek lekérdezésekor:', rpcError);
      setError('Hiba a licitnapló betöltésekor.');
    } else {
      setBids(data || []);
    }
    setLoading(false);
  }, [auctionId]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  useEffect(() => {
    const channel = supabase
      .channel(`bids-for-auction-${auctionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `auction_id=eq.${auctionId}`,
        },
        () => {
          fetchBids();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId, fetchBids]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Licitnapló</h3>
      <Separator className="mb-4" />
      <ScrollArea className="h-48 w-full rounded-md border p-4 bg-gray-50/50">
        {error ? (
          <p className="text-sm text-center text-red-500 pt-4">{error}</p>
        ) : loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        ) : bids.length > 0 ? (
          <div className="space-y-4">
            {bids.map((bid) => (
              <div key={bid.id} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-gray-800">{maskEmail(bid.bidder_email)}</p>
                  <p className="text-xs text-gray-500">{formatDate(bid.created_at)}</p>
                </div>
                <p className="font-semibold text-gray-900">{formatHungarianPrice(bid.amount)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-center text-gray-500 pt-4">Még nem érkezett licit.</p>
        )}
      </ScrollArea>
    </div>
  );
};

export default BidHistory;