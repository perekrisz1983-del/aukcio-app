"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimalForm, animalFormSchema } from "@/components/AnimalForm";
import { AnimalList } from "@/components/AnimalList";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabase";
import { Animal, AnimalStatus } from "../types";
import { z } from "zod";
import { User } from "@supabase/supabase-js";
import { CustomButton } from "@/components/CustomButton";
import { ArrowLeft } from "lucide-react";

const AdminAnimals = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', currentUser.id).single();
        if (profile?.role !== 'admin') {
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

  const fetchAnimals = useCallback(async () => {
    const { data, error } = await supabase.from('animals').select('*').order('created_at', { ascending: false });
    if (error) {
      showError("Hiba az állatok betöltésekor: " + error.message);
    } else {
      setAnimals(data as Animal[]);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAnimals();
    }
  }, [fetchAnimals, user]);

  const handleSave = async (formData: z.infer<typeof animalFormSchema>) => {
    if (editingAnimal) {
      const { error } = await supabase.from('animals').update(formData).eq('id', editingAnimal.id);
      if (error) {
        showError(error.message);
      } else {
        showSuccess("Állat sikeresen módosítva!");
        setEditingAnimal(null);
        fetchAnimals();
      }
    } else {
      const { error } = await supabase.from('animals').insert(formData);
      if (error) {
        showError(error.message);
      } else {
        showSuccess("Új állat sikeresen hozzáadva!");
        fetchAnimals();
      }
    }
  };

  const handleStartEdit = (animal: Animal) => {
    setEditingAnimal(animal);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => setEditingAnimal(null);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('animals').delete().eq('id', id);
    if (error) {
      showError(error.message);
    } else {
      showSuccess("Állat sikeresen törölve!");
      fetchAnimals();
    }
  };

  const handleStatusChange = async (id: string, status: AnimalStatus) => {
    const { error } = await supabase.from('animals').update({ status }).eq('id', id);
    if (error) {
      showError(error.message);
    } else {
      showSuccess(`Státusz frissítve: ${status}`);
      fetchAnimals();
    }
  };

  if (loading) return <div className="container mx-auto p-8 text-center"><p>Betöltés...</p></div>;
  if (!user) return null;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <CustomButton variant="outline" onClick={() => navigate('/admin')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Vissza az aukciókhoz
      </CustomButton>
      <h1 className="text-4xl font-bold text-primary mb-8">Állatok kezelése</h1>
      <div ref={formRef}>
        <AnimalForm onSave={handleSave} editingAnimal={editingAnimal} onCancelEdit={handleCancelEdit} />
      </div>
      <AnimalList animals={animals} onEdit={handleStartEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default AdminAnimals;