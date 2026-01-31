"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Auction } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomButton } from '@/components/CustomButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { showError, showSuccess } from '@/utils/toast';

const formatHungarianPrice = (price: number) => {
  return new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", minimumFractionDigits: 0 }).format(price);
};

const ShippingForm = ({ auction, onSave }: { auction: Auction, onSave: () => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      city: '',
      street: '',
      zip: '',
    }
  });

  const onSubmit = async (data: any) => {
    const shipping_address = { type: 'address', ...data };
    const { error } = await supabase
      .from('auctions')
      .update({ shipping_address })
      .eq('id', auction.id);

    if (error) {
      showError(error.message);
    } else {
      showSuccess("Szállítási cím sikeresen mentve!");
      onSave();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <h4 className="font-semibold">Szállítási adatok megadása</h4>
      <div>
        <Label htmlFor="name">Név</Label>
        <Input id="name" {...register("name", { required: "A név megadása kötelező." })} />
        {errors.name && <p className="text-red-500 text-sm mt-1">{String(errors.name.message)}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">Város</Label>
          <Input id="city" {...register("city", { required: "A város megadása kötelező." })} />
          {errors.city && <p className="text-red-500 text-sm mt-1">{String(errors.city.message)}</p>}
        </div>
        <div>
          <Label htmlFor="zip">Irányítószám</Label>
          <Input id="zip" {...register("zip", { required: "Az irányítószám megadása kötelező." })} />
          {errors.zip && <p className="text-red-500 text-sm mt-1">{String(errors.zip.message)}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="street">Utca, házszám</Label>
        <Input id="street" {...register("street", { required: "A cím megadása kötelező." })} />
        {errors.street && <p className="text-red-500 text-sm mt-1">{String(errors.street.message)}</p>}
      </div>
      <CustomButton type="submit">Cím mentése</CustomButton>
    </form>
  );
};

const WonAuctionCard = ({ auction, onUpdate }: { auction: Auction, onUpdate: () => void }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{auction.title}</CardTitle>
        <CardDescription>Azonosító: {auction.auction_id_human}</CardDescription>
      </CardHeader>
      <CardContent>
        <p><strong>Nyertes licit:</strong> {formatHungarianPrice(auction.current_bid)}</p>
        <p><strong>Státusz:</strong> {auction.status}</p>
        {auction.status === 'Fizetésre vár' && (
          <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-lg">
            <h4 className="font-bold">Fizetési információk</h4>
            <p>Kérjük, utalja el a fenti összeget a következő számlaszámra: <strong>12345678-12345678-12345678</strong></p>
            <p>A közlemény rovatban kérjük, tüntesse fel az aukció azonosítóját: <strong>{auction.auction_id_human}</strong></p>
          </div>
        )}
        {auction.shipping_address ? (
          <div className="mt-4">
            <h4 className="font-semibold">Megadott szállítási cím:</h4>
            <p>{auction.shipping_address.name}, {auction.shipping_address.zip} {auction.shipping_address.city}, {auction.shipping_address.street}</p>
          </div>
        ) : (
          auction.status === 'Fizetésre vár' && <ShippingForm auction={auction} onSave={onUpdate} />
        )}
        {auction.status === 'Postázva' && auction.tracking_number && (
          <p className="mt-4"><strong>Követési kód:</strong> {auction.tracking_number}</p>
        )}
      </CardContent>
    </Card>
  );
};

const Profil = () => {
  const [wonAuctions, setWonAuctions] = useState<Auction[]>([]);
  const [user, setUser] = useState<any>(null);

  const fetchWonAuctions = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .eq('winner_id', userId)
      .order('end_time', { ascending: false });

    if (error) {
      showError(error.message);
    } else {
      setWonAuctions(data as Auction[]);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      if (currentUser) {
        fetchWonAuctions(currentUser.id);
      }
    };
    checkUser();
  }, [fetchWonAuctions]);

  if (!user) {
    return <div className="container mx-auto p-8 text-center">A profil megtekintéséhez jelentkezzen be.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Profilom - Megnyert aukcióim</h1>
      <div className="space-y-6">
        {wonAuctions.length > 0 ? (
          wonAuctions.map(auction => (
            <WonAuctionCard key={auction.id} auction={auction} onUpdate={() => fetchWonAuctions(user.id)} />
          ))
        ) : (
          <p>Még nincsenek megnyert aukciói.</p>
        )}
      </div>
    </div>
  );
};

export default Profil;