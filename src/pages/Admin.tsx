"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuctionForm, auctionFormSchema } from "@/components/AuctionForm";
import { AuctionList } from "@/components/AuctionList";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabase";
import { Auction, AuctionStatus } from "../types";
import { z } from "zod";
import { User } from "@supabase/supabase-js";
import { CustomButton } from "@/components/CustomButton";
import { PawPrint } from "lucide-react";

const Admin = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [categories, setCategories] = useState<string[]>(['Elektronika', 'Lakástextil', 'Cipő', 'Ruha', 'Kozmetikum', 'Plüss']);
  const [filter, setFilter] = useState('all');
  const [editingAuction, setEditingAuction] = useState<Auction | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();

        if (error || profile?.role !== 'admin') {
          if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
            console.error("Error checking admin status:", error);
          }
          showError("Nincs jogosultságod az oldal megtekintéséhez.");
          navigate('/');
        } else {
          setUser(currentUser);
        }
      } else {
        showError("Az oldal megtekintéséhez bejelentkezés szükséges.");
        navigate('/auth');
      }
      setLoading(false);
    };
    checkAdminStatus();
  }, [navigate]);

  const fetchAuctions = useCallback(async () => {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showError("Hiba az aukciók betöltésekor: " + error.message);
      setAuctions([]);
    } else {
      setAuctions(data as Auction[]);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAuctions();
    }
  }, [fetchAuctions, user]);

  const handleSaveAuction = async (formData: z.infer<typeof auctionFormSchema>) => {
    const auctionData = {
      ...formData,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
      has_buy_now: formData.has_buy_now === "igen",
      buy_now_price: formData.has_buy_now === "igen" ? formData.buy_now_price : null,
    };

    if (editingAuction) {
      const { error } = await supabase
        .from('auctions')
        .update(auctionData)
        .eq('id', editingAuction.id);
      
      if (error) {
        showError(error.message);
      } else {
        showSuccess("Aukció sikeresen módosítva!");
        setEditingAuction(null);
        fetchAuctions();
      }
    } else {
      const { count } = await supabase.from('auctions').select('*', { count: 'exact', head: true });
      const newId = `PCAS-${new Date().getFullYear()}-${((count ?? 0) + 1).toString().padStart(3, '0')}`;

      const newAuctionData = {
        ...auctionData,
        auction_id_human: newId,
        status: new Date(auctionData.start_time) > new Date() ? 'Tervezett' : 'Aktív' as AuctionStatus,
        current_bid: auctionData.starting_price,
      };

      const { error } = await supabase.from('auctions').insert(newAuctionData);
      
      if (error) {
        showError(error.message);
      } else {
        showSuccess("Új aukció sikeresen létrehozva!");
        fetchAuctions();
      }
    }
  };

  const handleAddCategory = (newCategory: string) => {
    if (newCategory && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory].sort();
      setCategories(updatedCategories);
    }
  };

  const handleStartEdit = (auction: Auction) => {
    setEditingAuction(auction);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    setEditingAuction(null);
  };

  const handleDeleteAuction = async (id: string) => {
    const { error } = await supabase.from('auctions').delete().eq('id', id);
    if (error) {
      showError(error.message);
    } else {
      showSuccess("Aukció sikeresen törölve!");
      fetchAuctions();
    }
  };

  const handleStatusChange = async (id: string, status: AuctionStatus, trackingNumber?: string) => {
    const updateData: { status: AuctionStatus; tracking_number?: string } = { status };
    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }

    const { error } = await supabase.from('auctions').update(updateData).eq('id', id);
    if (error) {
      showError(error.message);
    } else {
      showSuccess(`Státusz frissítve: ${status}`);
      fetchAuctions();
      
      if (status === 'Fizetésre vár') {
        const auction = auctions.find(a => a.id === id);
        if (auction && auction.winner_id) {
          const { data: bids, error: rpcError } = await supabase.rpc('get_auction_bids', { p_auction_id: id });
          if (rpcError || !bids || bids.length === 0) {
            console.error("Could not fetch winner's email:", rpcError?.message);
            return;
          }
          const winnerEmail = bids[0].bidder_email;
          
          fetch('/api/send-winner-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: winnerEmail,
              itemName: auction.title,
              winningBid: auction.current_bid,
              auctionIdHuman: auction.auction_id_human,
            }),
          })
          .then(async res => {
            if(res.ok) {
              showSuccess("Nyertes e-mail sikeresen elküldve.");
            } else {
              const errorBody = await res.json().catch(() => ({ error: "Ismeretlen hiba" }));
              const errorMessage = errorBody.error || 'Ismeretlen hiba';
              showError(`Hiba a nyertes e-mail küldésekor: ${errorMessage}`);
              console.error("API Error:", errorBody);
            }
          })
          .catch(err => {
            showError("Hálózati hiba az e-mail küldésekor.");
            console.error("Failed to send winner email:", err);
          });
        }
      }
    }
  };

  const filteredAuctions = useMemo(() => {
    if (filter === 'all') return auctions;
    const filterMap: { [key: string]: AuctionStatus } = {
      'tervezett': 'Tervezett',
      'aktív': 'Aktív',
      'lejárt': 'Lejárt',
      'fizetesre-var': 'Fizetésre vár',
      'fizetve-postazasra-var': 'Fizetve / Postázásra vár',
      'postazva': 'Postázva',
      'lezart-teljesult': 'Lezárt / Teljesült'
    };
    return auctions.filter(auction => auction.status === filterMap[filter]);
  }, [auctions, filter]);

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p>Betöltés...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Adminisztráció: Aukciók</h1>
        <CustomButton onClick={() => navigate('/admin/animals')}>
          <PawPrint className="mr-2 h-4 w-4" /> Állatok kezelése
        </CustomButton>
      </div>
      
      <div ref={formRef}>
        <AuctionForm 
          onSaveAuction={handleSaveAuction} 
          categories={categories}
          onAddCategory={handleAddCategory}
          editingAuction={editingAuction}
          onCancelEdit={handleCancelEdit}
        />
      </div>
      
      <AuctionList 
        auctions={filteredAuctions} 
        filter={filter} 
        setFilter={setFilter}
        onEdit={handleStartEdit}
        onDelete={handleDeleteAuction}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Admin;