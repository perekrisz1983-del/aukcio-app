"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Animal } from "../types";
import { showError } from "@/utils/toast";
import SuccessStoryCard from "@/components/SuccessStoryCard";
import { Skeleton } from "@/components/ui/skeleton";

const SuccessStoriesPage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdoptedAnimals = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .eq('status', 'Gazdára talált')
      .order('created_at', { ascending: false });
    
    if (error) {
      showError("Hiba a sikersztorik betöltésekor: " + error.message);
    } else {
      setAnimals(data as Animal[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAdoptedAnimals();
  }, [fetchAdoptedAnimals]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center text-primary mb-4">Sikersztorik</h1>
      <p className="text-lg text-center text-foreground max-w-3xl mx-auto mb-12">
        Büszkén mutatjuk be azokat a védenceinket, akik a ti segítségetekkel már szerető otthonra találtak. Minden történet egy új kezdet.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[192px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : animals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {animals.map((animal) => (
            <SuccessStoryCard key={animal.id} animal={animal} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-10">Még nincsenek sikertörténetek. Legyél te az első, aki segít!</p>
      )}
    </div>
  );
};

export default SuccessStoriesPage;